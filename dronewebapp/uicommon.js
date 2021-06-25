let dspNode
let audioCtx
let saveState
let playState = false

// Save/Load functions using local storage
const getStorageItemValue = (item_key, key) => { // get item from local storage 'item_key' key
    if (!localStorage.getItem(item_key)) return null
    const item_value = JSON.parse(localStorage.getItem(item_key))
    const item_index = item_value.findIndex(obj => obj[0] === key)
    return item_index >= 0 ? item_value[item_index][1] : null
}

const setStorageItemValue = (item_key, key, value) => { // set [key, value] in local storage item_key key
    let item_value = []
    if (localStorage.getItem(item_key))
        item_value = JSON.parse(localStorage.getItem(item_key))
    const item_index = item_value.findIndex((obj => obj[0] === key)) // Possibly update an existing 'key'
    if (item_index >= 0) {
        item_value[item_index][1] = value // Otherwise push a new [key, value]
    } else {
        item_value.push([key, value])
    }
    localStorage.setItem(item_key, JSON.stringify(item_value))
}

const saveAppState = (keyname) => {
    dspNode.getParams().forEach(param => {
        setStorageItemValue(keyname, param, dspNode.getParamValue(param))
    })
}

const loadAppState = (keyname, defaultParams) => {
    if(localStorage.getItem(keyname)) {
        dspNode.getParams().forEach(param => {
            const value = getStorageItemValue(keyname, param)
            updateParams(keyname, param, value)
        })
    } else {
        defaultParams.split("\n").forEach(p => {
            let args = p.split(' ')
            updateParams(keyname, args[1], args[0])
        })
    }
}

const initApp = (appname, bufSize) => {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)(({ latencyHint: "playback" }))
    audioCtx.destination.channelInterpretation = "discrete"
    if(audioCtx.state === "suspended")
        audioCtx.resume()

    if (typeof WebAssembly === "undefined") return alert("WebAssembly is not supported in this browser !")
    if (!window[dspName]) return console.error(dspName + " instance not found.")
    const bufferSize = bufSize || 16384
    window[dspName].createDSP(audioCtx, bufferSize)
    .then(dsp => {
        if (!dsp) return console.error(`Error in ${appname} creation.`)
        dspNode = dsp
        dspNode.connect(audioCtx.destination)
        loadAppState(appname, defaultParams) 
        saveState = setInterval(() => dspNode ? saveAppState(appname) : null, 30000)
    })
}

const teardownApp = (appname) => {
    if(dspNode) {
        clearInterval(saveState)
        saveAppState(appname)
        dspNode.disconnect(audioCtx.destination)
    }
}

const updateParams = (keyname,id,value) => {
    if(id.includes("/Loop") || id.includes("/Play") || id.includes("/Gamaka")) {
        return updateToggle(keyname,id,parseFloat(value).toFixed(1)==="1.0")
    }
    let paramId = id.includes("/slider") ? id.replace("/slider","") : id
    let sliderId = id.includes("/slider") ? id : id.concat("/slider")
    let paramElement = document.getElementById(paramId)
    if(paramElement) {
        let precision = paramElement.step < 1 ? 1 : 0
        paramElement.value = parseFloat(value).toFixed(precision)
    }
    let sliderElement = document.getElementById(sliderId)
    if(sliderElement) {
        let precision = paramElement.step < 1 ? 1 : 0
        sliderElement.value = parseFloat(value).toFixed(precision)
    }
    if(playState) {
        dspNode.setParamValue(paramId,value)
    } else {
        setStorageItemValue(keyname, paramId, Number(value))
    }
}

const updateToggle = (keyname,id,checked) => {
    let toggleElement = document.getElementById(`${id}`)
    if(toggleElement)
        toggleElement.checked = checked
    let value = checked ? 1 : 0
    if(playState) {
        dspNode.setParamValue(id,value)
    } else {
        setStorageItemValue(keyname, id, Number(value))
    }
}

const getHTMLSlider = (appname,title,id,initvalue,minvalue,maxvalue,step) => (`
    <span>${title}</span>
    <input class="field" type="number" id=${id} min=${minvalue} max=${maxvalue} value=${initvalue} step=${step} oninput=updateParams(${appname},this.id,this.value)>
    <input type="range" id="${id}/slider" class="slider" min=${minvalue} max=${maxvalue} value=${initvalue} step=${step} oninput=updateParams(${appname},this.id,this.value)>
    <br>
`)

const getHTMLToggle = (appname,title,id) => (`
    <span>${title}</span>
    <label class="switch">
        <input type="checkbox" id=${id} oninput=updateToggle(${appname},this.id,this.checked)>
        <span class="toggle round"></span>
    </label>
    <br>
`)

const showsnapshotdialog = () => {
    let dialog = document.getElementById("snapshotdialog")
    dialog.style.visibility = "visible"
}

const getsnapshot = (name, extn) => {
    let dialog = document.getElementById("snapshotdialog")
    let snapshot = dspNode.getParams().map(p => `${dspNode.getParamValue(p).toFixed(1)} ${p}`).join('\n')
    const a = document.createElement('a')
    const file = new Blob([snapshot], {type: 'text/plain'})
    a.href= URL.createObjectURL(file)
    if(name !== null) {
        a.download = name === "" ? `My-New-Tuning.${extn}` : `${name.replace(/ /g,'-')}.${extn}`
        a.click()
    }
    URL.revokeObjectURL(a.href)
    dialog.style.visibility = "hidden"
}

const uploadsnapshot = (keyname) => {
    let uploader = document.getElementById("fileupload")
    let file = uploader.files[0]
    let reader = new FileReader()
    reader.onload = () => {
        loadTuning(reader.result,keyname)
        if(!playState) {
            document.getElementById('startstop').disabled = false
            document.getElementById('startstop').classList.remove("disabled")
            playit()
        }
    }
    reader.readAsText(file)
    delete reader
    uploader.value = null
}

const reset = (appname) => {
    if(playState)
        playit()
    if(localStorage.getItem(appname))
        localStorage.removeItem(appname)
    document.getElementById('startstop').disabled = false
    document.getElementById('startstop').classList.remove("disabled")
    playit()
}

const checkURLParams = (keyname) => {
    let urlParamString = window.location.search
    if(urlParamString !== "") {
        let urlParams = new URLSearchParams(urlParamString)
        let raga = urlParams.get('raga')
        if(raga) {
            let ragaReq = new XMLHttpRequest()
            ragaReq.onload = () => {
                if(ragaReq.status === 404) {
                    console.log(`Did not find tuning for ${raga}.`)
                    window.history.replaceState(null,"",`./${urlParamString.replace(`&raga=${raga}`,"").replace(`raga=${raga}&`,"")}`)
                } else if(ragaReq.status === 200) {
                    loadTuning(ragaReq.response,keyname)
                } else {
                    console.log(`Error ${ragaReq.status}: ${ragaReq.statusText}`)
                }
                checkURLKeyOffset(urlParams,keyname)
                if(!playState) {
                    document.getElementById('startstop').disabled = false
                    document.getElementById('startstop').classList.remove("disabled")
                    playit()
                }
            }
            let extn = keyname === 'puretones' ? 'prt' : 'pkb'
            ragaReq.open("GET", `../tunings/${raga}.${extn}`)
            ragaReq.send()
        } else {
            checkURLKeyOffset(urlParams,keyname)
            if(!playState) {
                document.getElementById('startstop').disabled = false
                document.getElementById('startstop').classList.remove("disabled")
                playit()
            }
        }
    }
}

const checkURLKeyOffset = (urlParams,keyname) => {
    let key = urlParams.get('key')
    if(key) {
        if(keyname === 'puretones'){
            updateParams(keyname,"/puretones/PureTones_v1.0/0x00/Common_Frequency",pitchValue[key]+12)
            updateParams(keyname,"/puretones/PureTones_v1.0/0x00/Octave_Selector",0)
        }
        else if(keyname === 'musicscale') {
            updateParams(keyname,"/musicscale/Common_Parameters/Pitch",pitchValue[key]+12)
            updateParams(keyname,"/musicscale/Common_Parameters/Octave",0)
        }
    }

    let offset = urlParams.get('offset')
    if(offset) {
        if(keyname === 'puretones')
            updateParams(keyname,"/puretones/PureTones_v1.0/0x00/Fine_Tune",offset)
        else if(keyname === 'musicscale')
            updateParams(keyname,"/musicscale/Common_Parameters/Fine_Tune",offset)
    }
}

const pitchValue = {
    "B" : 2,
    "A#" : 1,
    "A" : 0,
    "G#" : -1,
    "G" : -2,
    "F#" : -3,
    "F" : -4,
    "E" : -5,
    "D#" : -6,
    "D" : -7,
    "C#" : -8,
    "C" : -9
}

const loadTuning = (tuning,keyname) => {
    tuning.split("\n").forEach(p => {
        let args = p.split(' ')
        if(args.length === 2) 
            updateParams(keyname, args[1].trim(), args[0].trim())
    })
}