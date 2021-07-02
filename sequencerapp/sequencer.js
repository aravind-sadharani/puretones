let audioCtx;
const faust = new Faust2WebAudio.Faust({ debug: false, wasmLocation: "/sequencerapp/faustwasm/libfaust-wasm.wasm", dataLocation: "/sequencerapp/faustwasm/libfaust-wasm.data" });
window.faust = faust;
let playState = false;

const tokenize = str => str.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/(\n|\t)/g,' ').split(' ').map(s => s.trim()).filter(s => s.length)

const baseValue = (noteStr) => {
    let baseStr = noteStr.substring(0,3)
    if(baseStr.includes("Sa"))
        return "1"
    if(baseStr.includes("re"))
        return "256/243"
    if(baseStr.includes("Re"))
        return "9/8"
    if(baseStr.includes("ga"))
        return "32/27"
    if(baseStr.includes("Ga"))
        return "81/64"
    if(baseStr.includes("ma"))
        return "4/3"    
    if(baseStr.includes("Ma"))
        return "729/512"
    if(baseStr.includes("Pa"))
        return "3/2"
    if(baseStr.includes("dha"))
        return "128/81"
    if(baseStr.includes("Dha"))
        return "27/16"
    if(baseStr.includes("ni"))
        return "16/9"
    if(baseStr.includes("Ni"))
        return "243/128"
    if(baseStr.includes("SA"))
        return "2"    
    if(baseStr.includes("Q"))
        return "3"    
    return "-1"
}

const octaveValue = (noteStr) => {
    if(noteStr.includes('"'))
        return "2"
    if(noteStr.includes("'"))
        return "1/2"
    return "1"
}

const gamakaValue = (noteStr) => {
    if(noteStr.includes("(G)"))
        return 1
    return 0
}

const gamakaParams = (noteStr) => {
    let paramsMatch = /\(G\)\(.*\)/
    let params = noteStr.match(paramsMatch)
    if(params === null || params[0].replace("(G)","") === "()")
        return "none"
    else
        return `${params[0].replace("(G)","").replace("(","").replace(")","")}`
}

const isequal = (note1, note2) => (baseValue(note1) === baseValue(note2) && octaveValue(note1) === octaveValue(note2) && gamakaValue(note1) === gamakaValue(note2) && gamakaParams(note1) === gamakaParams(note2))

const isnote = (token) => (baseValue(token) !== "-1")

const findunique = (tokens) => {
    let notes = tokens.filter(isnote)
    let uniquenotes = new Array()

    notes.forEach(note => {
        if(uniquenotes.find(testnote => isequal(testnote, note)) === undefined)
            uniquenotes.push(note)
        if(note.includes("(G)")) {
            unShakenNote = note.replace("(G)","")
            if(uniquenotes.find(testnote => isequal(testnote, unShakenNote)) === undefined)
                uniquenotes.push(unShakenNote)
        }
    })

    return uniquenotes
}

const getPitch = (voiceName,id) => {
    let cpitch = document.getElementById("cpitch").value
    let finetune = document.getElementById("finetune").value
    let octave = document.getElementById(`octave${id}`).value
    return `${voiceName}cpitch = 220*(2^(${cpitch}/12))*(2^(${finetune}/1200))*(2^(${octave}));\n`
}

const getFineTune = (noteStr) => {
    let baseStr = noteStr.substring(0,3)
    if(baseStr.includes("Sa"))
        return `${parseInt(document.getElementById("Sa-C").value)+0.01*parseInt(document.getElementById("Sa-F").value)}`
    if(baseStr.includes("re"))
        return `${parseInt(document.getElementById("re-C").value)+0.01*parseInt(document.getElementById("re-F").value)}`
    if(baseStr.includes("Re"))
        return `${parseInt(document.getElementById("Re-C").value)+0.01*parseInt(document.getElementById("Re-F").value)}`
    if(baseStr.includes("ga"))
        return `${parseInt(document.getElementById("ga-C").value)+0.01*parseInt(document.getElementById("ga-F").value)}`
    if(baseStr.includes("Ga"))
        return `${parseInt(document.getElementById("Ga-C").value)+0.01*parseInt(document.getElementById("Ga-F").value)}`
    if(baseStr.includes("ma"))
        return `${parseInt(document.getElementById("ma-C").value)+0.01*parseInt(document.getElementById("ma-F").value)}`
    if(baseStr.includes("Ma"))
        return `${parseInt(document.getElementById("Ma-C").value)+0.01*parseInt(document.getElementById("Ma-F").value)}`
    if(baseStr.includes("Pa"))
        return `${parseInt(document.getElementById("Pa-C").value)+0.01*parseInt(document.getElementById("Pa-F").value)}`
    if(baseStr.includes("dha"))
        return `${parseInt(document.getElementById("dha-C").value)+0.01*parseInt(document.getElementById("dha-F").value)}`
    if(baseStr.includes("Dha"))
        return `${parseInt(document.getElementById("Dha-C").value)+0.01*parseInt(document.getElementById("Dha-F").value)}`
    if(baseStr.includes("ni"))
        return `${parseInt(document.getElementById("ni-C").value)+0.01*parseInt(document.getElementById("ni-F").value)}`
    if(baseStr.includes("Ni"))
        return `${parseInt(document.getElementById("Ni-C").value)+0.01*parseInt(document.getElementById("Ni-F").value)}`
    if(baseStr.includes("SA"))
        return `${parseInt(document.getElementById("SA-C").value)+0.01*parseInt(document.getElementById("SA-F").value)}`
    return "0"
}

const printNoteSpec = (voiceName, noteStr, id) => `${voiceName}ratio_${id} = (${baseValue(noteStr)}) * (${octaveValue(noteStr)}) * (2^(${getFineTune(noteStr)}/1200))${printGamaka(voiceName, noteStr)}  //${noteStr}\n`

const printGamaka = (voiceName, noteStr) => {
    let params = gamakaParams(noteStr)
    return (params === "none" ? `${(gamakaValue(noteStr) ? ` * (delta,(-1)*delta,rate,number,8*cperiod : ${voiceName}shake);` : ";")}` : ` * (${params},8*cperiod : ${voiceName}shake);`)
}

const printNoteId = (voiceName, id) => `${voiceName}ratio_${id}`

const jatiValue = (timeStr) => {
    let jatiStr = timeStr[0]
    if(jatiStr === '.')
        return 1/2
    if(jatiStr === ';')
        return 1/4
    if(jatiStr === ',')
        return 1/8
    return 1
}

const repeatValue = (timeStr) => {
    let parsedTimeStr = jatiValue(timeStr) === 1 ? timeStr : timeStr.substring(1,timeStr.length)
    if(parsedTimeStr === "")
        return 1
    let intTimeStr = parseInt(parsedTimeStr)
    return (isNaN(intTimeStr) ? 1 : intTimeStr)
}

const getPluckTiming = (tokens) => {
    let state = 0
    let timing = new Array()

    tokens.forEach(token => {
        if(state === 0 && isnote(token))
            state = 1
        else if(state === 1 && isnote(token)) {
            timing.push(8)
            state = 1
        } else if(state === 1 && !isnote(token)) {
            timing.push(getPluckLength(token))
            state = 0
        }
    })
    if(state === 1)
        timing.push(8)

    return timing
}

const getPluckLength = (timeStr) => 8*jatiValue(timeStr)*repeatValue(timeStr)

const printPluckTiming = (id, repeats) => (id.includes("Q") ? "0,0,".repeat(repeats-1).concat("0,0") : "1,1,".repeat(repeats-1).concat("1,0"))

const printNoteTiming = (id, repeats) => `${id},`.repeat(2*repeats-1).concat(`${id}`)

const dspTemplateTop = `import("stdfaust.lib");

cperiod = 2^(vslider("[01]Motif Tempo",1.0,-2,4,0.1) - 3);
cgain = 10^(vslider("[02]Motif Gain",-9,-20,20,0.1) - 6 : /(20));
delta = vslider("[04]Shake Variance", 10,0,120,1);  	
rate = vslider("[05]Shake Rate",11.5,10,25,0.1);
c2v(d) = 2^(d/1200)-1;
l2l(r) = 2^(r/10);
number = vslider("[06]Shake Number",3.4,1,10,0.1);
phasor(f) = ba.period(ma.SR/f) : *(f/ma.SR);
ramp(x) = ba.time : *(x);
`

let composition

const showsnapshotdialog = () => {
    let dialog = document.getElementById("snapshotdialog")
    getComposition()
    dialog.style.visibility = "visible"
}

const getsnapshot = (name, extn) => {
    let dialog = document.getElementById("snapshotdialog")
    let a = document.createElement('a')
    let file = new Blob([composition], {type: 'text/plain'})
    a.href= URL.createObjectURL(file)
    if(name !== null) {
        a.download = name === "" ? `My-New-Composition.${extn}` : `${name.replace(/ /g,'-')}.${extn}`
        a.click()
    }
    URL.revokeObjectURL(a.href)
    delete file
    dialog.style.visibility = "hidden"
}

const getfilename = () => {
    let filename = prompt("Please enter a name for your Composition", "My New Composition")
    if(filename === null)
        return null
    if(filename === "")
        return 'My-New-Composition.dsp'
    else
        return `${filename.replace(/ /g,'-')}.dsp`
}

const getVoice = (voiceName,tokens,pitchid,toneName) => {
    let uniquenotes = findunique(tokens)
    let plucktimes = getPluckTiming(tokens)
    let noteids = tokens.filter(isnote).map(n => uniquenotes.findIndex(t => isequal(t,n)))

    let notespec = `${uniquenotes.map((str,id) => printNoteSpec(voiceName,str,id)).join("")}
${voiceName}noteratio = ${uniquenotes.map((str,id) => printNoteId(voiceName,id)).join()} : ba.selectn(${uniquenotes.length},${voiceName}noteindex);`

    let pluckTiming = `${noteids.map((id, index) => printPluckTiming(uniquenotes[id],plucktimes[index])).join()}`
    let pluckWaveformLength = pluckTiming.length
    let noteTiming = `${noteids.map((id, index) => printNoteTiming(id,plucktimes[index])).join()}`

    let dspVoiceTop = `
${voiceName}phasedcos(x) = phasor(x) - (phasor(x) : ba.latch(${voiceName}gate(cperiod))) : *(2*ma.PI) : cos;
${voiceName}lockedramp(x) = ramp(x) - (ramp(x) : ba.latch(${voiceName}gate(cperiod)));
${voiceName}shake(d1,d2,r,n,p) = 1+((c2v(d1)+c2v(d2))/2+(c2v(d1)-c2v(d2))*${voiceName}phasedcos(l2l(r))/2)*(${voiceName}lockedramp(l2l(r)) < n*ma.SR);
${voiceName}noteindex = cperiod : ${voiceName}motifnotes;
`

    let voiceComposition = `${dspVoiceTop}
${getPitch(voiceName,pitchid)}
${notespec}
${voiceName}gatewaveform = waveform{${pluckTiming}};

${voiceName}gate(p) = ${voiceName}gatewaveform,int(2*ba.period(${(pluckWaveformLength+1)/4}*p*ma.SR)/(p*ma.SR)) : rdtable;
${voiceName}motif = waveform{${noteTiming}};

${voiceName}motifnotes(p) = ${voiceName}motif,int(2*ba.period(${(pluckWaveformLength+1)/4}*p*ma.SR)/(p*ma.SR)) : rdtable;
${voiceName}notes = ${toneName}Tone(${voiceName}cpitch,${voiceName}noteratio,${voiceName}gate(cperiod)) : @(ma.SR*0.1);
`
    return voiceComposition
}

const getComposition = () => {
    let voices = ['1', '2', '3']
    let voiceActiveState = voices.map(voice => document.getElementById(`voice_${voice}/toggle`).classList.contains("active"))
    if(!voiceActiveState.includes(true))
        return false

    let tonesUsed = [false, false, false, false]
    let toneNames = ["String1", "String2", "Violin", "Reed"]
    let tonesOfVoices = voices.map(voice => document.getElementById(`tone_${voice}`).value)
    let motifStringTokens = new Array(3)

    voiceActiveState.forEach((state,index) => {
        if(state) {
            tonesUsed[tonesOfVoices[index]] = true
            motifStringTokens[index] = tokenize(document.getElementById(`motifComposer_${(index+1).toString()}`).value)
        }
    })

    voicesForComposition = voiceActiveState.map((state,index) => {
        let id = (index+1).toString()
        let toneName = toneNames[tonesOfVoices[index]]
        if(state) {
            return getVoice(`_voice_${id}`,motifStringTokens[index],`_${id}`,toneName)
        } else {
            return `_voice_${id}notes = 0;\n`
        }
    }).join("")

    tonesForComposition = tonesUsed.map((used,index) => {
        if(used) {
            return dspToneTemplates[index]
        } else {
            return ""
        }
    }).join("")
   
    composition = `${dspTemplateTop}
${tonesForComposition}
${voicesForComposition}
mix(a,b) = 0.7*a+0.3*b,0.3*a+0.7*b;
concert = hgroup("[00]Motif",1.5*cgain*(0.7*_voice_1notes + 0.9*_voice_2notes),2*cgain*(0.7*_voice_1notes + 0.9*_voice_3notes));
process = concert : mix : dm.zita_light;
`
    return true
}

const showError = () => {
    document.getElementById("syntaxError").classList.remove("errorhidden");
    document.getElementById("playStop").disabled = false;
    document.getElementById("playStop").classList.remove("disabled");
    document.getElementById("playStop").innerHTML = "Try Again";
}

const playit = () => {
    if(!audioCtx)
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if(audioCtx.state === "suspended")
        audioCtx.resume();
    if(!playState) {
        if(!getComposition()) {
            showError()
            return
        }
        document.getElementById("playStop").disabled = true;
        document.getElementById("playStop").classList.add("disabled");
        document.getElementById("playStop").innerHTML = "Compiling...";
        faust.ready.then(() => {
            faust.getNode(composition, { audioCtx, useWorklet: false, bufferSize: 16384, args: { "-I": "libraries/" } }).then(node => {
                window.node = node;
                node.connect(audioCtx.destination);
                playState = true;
                document.getElementById("syntaxError").classList.add("errorhidden");
                document.getElementById("playStop").disabled = false;
                document.getElementById("playStop").classList.remove("disabled");
                document.getElementById("playStop").innerHTML = "Stop";
                document.getElementById("download").disabled = false;
                document.getElementById("download").classList.remove("disabled");
            }, reason => {
                showError()
            });
        });
    } else {
        let dspNode = window.node;
        dspNode.disconnect(audioCtx.destination);
        dspNode.destroy();
        playState = false;
        document.getElementById("playStop").innerHTML = "Play Audio";
        document.getElementById("download").disabled = true;
        document.getElementById("download").classList.add("disabled");
    }
}

const playmotif = (id) => {
    if(!audioCtx)
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if(audioCtx.state === "suspended")
        audioCtx.resume();
    if(!playState) {
        getMotif(id)
        document.getElementById(`playStop_${id}`).disabled = true;
        document.getElementById(`playStop_${id}`).classList.add("disabled");
        document.getElementById(`playStop_${id}`).innerHTML = "Compiling...";
        faust.ready.then(() => {
            faust.getNode(composition, { audioCtx, useWorklet: false, bufferSize: 16384, args: { "-I": "libraries/" } }).then(node => {
                window.node = node;
                node.connect(audioCtx.destination);
                playState = true;
                document.getElementById(`playStop_${id}`).disabled = false;
                document.getElementById(`playStop_${id}`).classList.remove("disabled");
                document.getElementById(`playStop_${id}`).innerHTML = "Stop";
            }, reason => {
                console.log("Error in predefined composition!")
            });
        });
    } else {
        let dspNode = window.node;
        dspNode.disconnect(audioCtx.destination);
        dspNode.destroy();
        playState = false;
        document.getElementById(`playStop_${id}`).innerHTML = "Play";
    }
}

const getMotif = (id) => {
    let motifStringTokens = tokenize(document.getElementById(`motif_${id}`).value)

    let voicesForComposition = getVoice(`_motif_${id}`,motifStringTokens,`_${id}`,"String1")

    let tonesForComposition = dspToneTemplates[0]
   
    composition = `${dspTemplateTop}
${tonesForComposition}
${voicesForComposition}
concert = hgroup("[00]Motif",cgain*_motif_${id}notes);
process = concert <: dm.zita_light;
`
}

const uploadsnapshot = () => {
    let uploader = document.getElementById("fileupload")
    let file = uploader.files[0]
    let reader = new FileReader()
    reader.onload = () => {
        loadTuning(reader.result)
        window.history.pushState(null,"",".")
    }
    reader.readAsText(file)
    delete reader
    uploader.value = null
}

const updateNotes = (id, value) => {
    let note
    if(id.includes("/musicscale/Common_Parameters/Pitch"))
        document.getElementById("cpitch").value = value - 12
    if(id.includes("/musicscale/Common_Parameters/Fine_Tune"))
        document.getElementById("finetune").value = value
    if(id.includes("/Cent")) {
        note = id.replace("/musicscale/Common_Parameters/12_Note_Scale/","").replace("/Cent","")
        document.getElementById(`${note}-C`).value = value
    }
    if(id.includes("/0.01_Cent")) {
        note = id.replace("/musicscale/Common_Parameters/12_Note_Scale/","").replace("/0.01_Cent","")
        document.getElementById(`${note}-F`).value = value
    }
}

const toggleVoice = (evt, voiceName) => {
    let link = evt.currentTarget
    let targetClassList = link.classList 
    let activeState = targetClassList.contains("active")
    let element = document.getElementById(`${voiceName}/config`)
    if(activeState) {
        link.innerHTML = "Enable"
        element.style.display = "none"
        targetClassList.remove("active")
    } else {
        link.innerHTML = "Disable"
        element.style.display = "grid"
        targetClassList.add("active")
    }
}

const dspToneTemplates = [
    `String1Tone(f,r,g) = StringModel(pm.f2l(f*r*(1+variance)),0.63,10*StringPluck,min(0.95,0.5*(r^0.75)),0,60/(r^2)) + StringModel(pm.f2l(f*r*(1-variance)),0.63,10*StringPluck,min(0.95,0.5*(r^0.75)),0,60/(r^2)) : *(StringEnv)
with {
    variance = vslider("[00]Variance",2,0,4,0.1)/10000;
    StringPluck = en.adsr(0.00001,cperiod*0.7,0.9,cperiod*0.3,g);
    StringEnv = en.adsr(0.0001,cperiod*0.6,0.8,cperiod*0.5,g);
    
    StringModel(length,pluckPosition,excitation,brightness,damping,stiffness) = 0.1*pm.endChain(egChain)
    with{
        openStringPick(length,stiffness,pluckPosition,excitation) = strChain
        with{
            dispersionFilters = par(i,2,si.smooth(stiffness)),_;
            maxStringLength = 6;
            nti = length*pluckPosition; // length of the upper portion of the string
            itb = length*(1-pluckPosition); // length of the lower portion of the string
            strChain = pm.chain(
                pm.stringSegment(maxStringLength,nti) :
                pm.in(excitation) :
                pm.out :
                dispersionFilters :
                pm.stringSegment(maxStringLength,itb)
            );
        };
        lengthTuning = 14*pm.speedOfSound/ma.SR;
        stringL = length-lengthTuning;
        egChain = pm.chain(
            pm.lStringRigidTermination :
            openStringPick(stringL,stiffness/1000,pluckPosition,excitation) :
            pm.rTermination(pm.basicBlock,(-1)*pm.bridgeFilter(brightness,damping))
        );
    };
};`,
    `String2Tone(f,r,g) = StringModel(pm.f2l(f*r*(1+variance)),StringPluck) + StringModel(pm.f2l(f*r*(1-variance)),StringPluck) : *(StringEnv)
with {
    variance = vslider("[00]Variance",2,0,4,0.1)/10000;
    StringPluck = en.adsr(0.00001,cperiod*0.7,0.9,cperiod*0.3,g);
    StringEnv = en.adsr(0.0001,cperiod*0.7,0.9,cperiod*0.4,g);
    
    StringModel(length,excitation) = 2*pm.endChain(egChain)
    with{
        brightness = 0.6/((length)^(1/3));
        stiffness = 25*((length)^(1/3));
        pluckPosition = 0.61;
        StringBody(stringL,excitation) = reflectance,transmittance,_
        with{
            c = (0.375*(stringL^(1/4)) - 0.0825);
            transmittance = _ <: *(1-c),1*c*fi.resonbp(pm.l2f(stringL),2,1) :> _;
            reflectance = _;
        };
        StringBridge(brightness) = pm.rTermination(pm.basicBlock,reflectance) : _,transmittance,_
        with{
            reflectance = (-1)*pm.bridgeFilter(brightness,0);
            transmittance = _;
        };
        openStringPick(length,stiffness,pluckPosition,excitation) = strChain
        with{
            dispersionFilters = par(i,2,si.smooth(stiffness)),_;
            maxStringLength = 6;
            nti = length*pluckPosition; // length of the upper portion of the string
            itb = length*(1-pluckPosition); // length of the lower portion of the string
            strChain = pm.chain(
                pm.stringSegment(maxStringLength,nti) :
                pm.in(excitation) :
                dispersionFilters :
                pm.stringSegment(maxStringLength,itb)
            );
        };
        lengthTuning = 13*pm.speedOfSound/ma.SR;
        stringL = length-lengthTuning;
        egChain = pm.chain(
            pm.lStringRigidTermination :
            openStringPick(stringL,stiffness/1000,pluckPosition,excitation) :
            StringBridge(brightness) : 
            StringBody(length,excitation) :
            pm.out
        );
    };
};`,
    `ViolinTone(f,r,g) = ((pm.f2l(f*r)/6))*ViolinModel(pm.f2l(f*r),0.2*ViolinBow,0.2*ViolinBow,0.79) : *(ViolinEnv)
with {

    ViolinBow = en.adsr(0.1,cperiod*0.7,0.6,cperiod*0.3,g)*(1+0.35*os.osc(1/(16*cperiod)));
    ViolinEnv = en.adsr(0.1,cperiod*0.6,0.6,cperiod*0.5,g);
    
    violinBowedString(length,bowPressure,bowVelocity,bowPosition) = strChain
          with{
          maxStringLength = 6;
          nti = length*bowPosition; // length of the upper portion of the string
            itb = length*(1-bowPosition); // length of the lower portion of the string
          strChain = pm.chain(
            pm.stringSegment(maxStringLength,nti) : 
            pm.violinBow(bowPressure,bowVelocity) :  
            pm.stringSegment(maxStringLength,itb)
          );
          };
        violinBridge = pm.rTermination(pm.basicBlock,reflectance) : _,transmittance,_
        with{
            reflectance = (-1)*pm.bridgeFilter(0.2,0.9);
            transmittance = _;
        };
        violinBody(stringL) = reflectance,transmittance,_
        with{
            transmittance = _ <: 0.5*fi.resonbp(pm.l2f(stringL/4),2,1) + 1.5*fi.resonbp(pm.l2f(stringL/2),2,1) :> _ ;
            reflectance = _;
        };
        ViolinModel(length,bowPressure,bowVelocity,bowPosition) = 15*pm.endChain(egChain)
        with{
          lengthTuning = 11*pm.speedOfSound/ma.SR;
          stringL = length-lengthTuning;
          egChain = pm.chain(
            pm.lTermination((-1)*pm.bridgeFilter(0.3,0.1),pm.basicBlock) :
            violinBowedString(stringL,bowPressure,bowVelocity,bowPosition) :
                violinBridge :
                violinBody(stringL) :
                pm.out
          );
        };
};`,
    `ReedTone(f,r,g) = ReedModel(pm.f2l(f*r),0.56*(1+ReedBlow),-0.104) : *(ReedEnv)
with {

    ReedBlow = 3*en.adsr(0.01,cperiod*0.7,0.9,cperiod*0.3,g)*(1+0.25*os.osc(1/(16*cperiod)));
    ReedEnv = en.adsr(0.1,cperiod*0.6,0.8,cperiod*0.5,g);
    
    reedTable(offset,slope) = reedTable : min(1) : max(-1)
        with {
            reedTable = *(slope) + offset;
        };
        clarinetReed(stiffness) = reedTable(0.7,stiffness);
        ReedMouthPiece(reedStiffness,pressure) = pm.lTermination(reedInteraction,pm.in(pressure))
        with{
            reedInteraction = *(-1) <: *(clarinetReed(reedStiffness));
        };
        wBell(length) = pm.rTermination(pm.basicBlock,bellFilter)
        with {
          opening = (length^(1/3))/(length^(1/3)+1);
          bellFilter = si.smooth(opening);
        };
        ReedModel(tubeLength,pressure,reedStiffness) = 0.75*pm.endChain(modelChain)
        with{
            lengthTuning = 7*pm.speedOfSound/ma.SR;
            maxTubeLength = 3;
            tunedLength = tubeLength/2-lengthTuning;
            modelChain =
                pm.chain(
                    ReedMouthPiece(reedStiffness,pressure) :
                    pm.openTube(maxTubeLength,tunedLength) :
                    wBell(tubeLength/2) : pm.out
                );
        };
    };`
]

const checkURLParams = () => {
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
                    loadTuning(ragaReq.response)
                } else {
                    console.log(`Error ${ragaReq.status}: ${ragaReq.statusText}`)
                }
                checkURLKeyOffset(urlParams)
            }
            ragaReq.open("GET", `../tunings/${raga}.pkb`)
            ragaReq.send()
        } else {
            checkURLKeyOffset(urlParams)
        }
    }
}

const checkURLKeyOffset = (urlParams) => {
    let key = urlParams.get('key')
    if(key)
        document.getElementById("cpitch").value = pitchValue[key]

    let offset = urlParams.get('offset')
    if(offset)
        document.getElementById("finetune").value = offset
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

const loadTuning = (tuning) => {
    tuning.split("\n").forEach(p => {
        let args = p.split(' ')
        if(args.length === 2)
            updateNotes(args[1].trim(), args[0].trim())
    })
}