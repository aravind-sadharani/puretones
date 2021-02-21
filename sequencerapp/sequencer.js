let audioCtx;
const faust = new Faust2WebAudio.Faust({ debug: false, wasmLocation: "./faustwasm/libfaust-wasm.wasm", dataLocation: "./faustwasm/libfaust-wasm.data" });
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

const getPitch = () => {
    let cpitch = document.getElementById("cpitch").value
    let finetune = document.getElementById("finetune").value
    let octave = document.getElementById("octave").value
    return `cpitch = 220*(2^(${cpitch}/12))*(2^(${finetune}/1200))*(2^(${octave}));\n`
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

const printNoteSpec = (noteStr, id) => `ratio_${id} = (${baseValue(noteStr)}) * (${octaveValue(noteStr)}) * (2^(${getFineTune(noteStr)}/1200))${printGamaka(noteStr)}  //${noteStr}\n`

const printGamaka = (noteStr) => {
    let params = gamakaParams(noteStr)
    return (params === "none" ? `${(gamakaValue(noteStr) ? " * (delta,(-1)*delta,rate,number,8*cperiod : shake);" : ";")}` : ` * (${params},8*cperiod : shake);`)
}

const printNoteId = (noteStr, id) => `ratio_${id}`

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

const printPluckTiming = (plucklength) => "1,1,".repeat(plucklength-1).concat("1,0")

const printNoteTiming = (id, repeats) => `${id},`.repeat(repeats-1).concat(`${id}`)

const dspTemplateTop = `import("stdfaust.lib");

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

variance = vslider("[00]Variance",2,0,4,0.1)/10000;
cperiod = 2^(vslider("[01]Motif Tempo",1.0,-2,4,0.1) - 3);
cgain = 10^(vslider("[02]Motif Gain",-9,-20,20,0.1) - 6 : /(20));
delta = vslider("[04]Shake Variance", 10,0,120,1);  	
rate = vslider("[05]Shake Rate",11.5,10,25,0.1);
c2v(d) = 2^(d/1200)-1;
l2l(r) = 2^(r/10);
number = vslider("[06]Shake Number",3.4,1,10,0.1);
phasor(f) = (+(f/ma.SR) ~ ma.decimal);
phasedcos(x) = phasor(x) - (phasor(x) : ba.latch(gate(cperiod))) : *(2*ma.PI) : cos;
ramp(x) = +(x/ma.SR) ~ _;
lockedramp(x) = ramp(x) - (ramp(x) : ba.latch(gate(cperiod)));
shake(d1,d2,r,n,p) = 1+((c2v(d1)+c2v(d2))/2+(c2v(d1)-c2v(d2))*phasedcos(l2l(r))/2)*(lockedramp(l2l(r)) < n);
pluck = en.adsr(0.00001,cperiod*0.7,0.9,cperiod*0.3,gate(cperiod));
env = en.adsr(0.0001,cperiod*0.6,0.8,cperiod*0.5,gate(cperiod));
noteindex = cperiod : motifnotes;
`

const dspTemplateBottom = `
notes = StringModel(pm.f2l(cpitch*noteratio*(1+variance)),0.63,10*pluck,min(0.95,0.5*(noteratio^0.75)),0,60/(noteratio^2)) + StringModel(pm.f2l(cpitch*noteratio*(1-variance)),0.63,10*pluck,min(0.95,0.5*(noteratio^0.75)),0,60/(noteratio^2)) : *(env) : @(ma.SR*0.1);

concert = hgroup("[00]Motif",cgain*notes);
process = concert <: dm.zita_light;
`

let composition

const showsnapshotdialog = () => {
    let dialog = document.getElementById("snapshotdialog")
    getComposition()
    dialog.style.visibility = "visible"
}

const getsnapshot = (name, extn) => {
    let dialog = document.getElementById("snapshotdialog")
    const a = document.createElement('a')
    const file = new Blob([composition], {type: 'text/plain'})
    a.href= URL.createObjectURL(file)
    if(name !== null) {
        a.download = name === "" ? `My-New-Composition.${extn}` : `${name.replace(/ /g,'-')}.${extn}`
        a.click()
    }
    URL.revokeObjectURL(a.href)
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

const getComposition = () => {
    let motifStringTokens = tokenize(document.getElementById("motifComposer").value)
    
    const uniquenotes = findunique(motifStringTokens)
    const plucktimes = getPluckTiming(motifStringTokens)
    const noteids = motifStringTokens.filter(isnote).map(n => uniquenotes.findIndex(t => isequal(t,n)))

    let noteSpec = `${uniquenotes.map(printNoteSpec).join("")}
noteratio = ${uniquenotes.map(printNoteId).join()} : ba.selectn(${uniquenotes.length},noteindex);`
    
    let restTiming = ",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0"
    let pluckTiming = `${plucktimes.map(printPluckTiming).join()}${restTiming}${restTiming}`
    let pluckWaveformLength = pluckTiming.length
    let noteTiming = `${noteids.map((id, index) => printNoteTiming(id,plucktimes[index])).join()}${restTiming}`

    composition = `${dspTemplateTop}
${getPitch()}
${noteSpec}
gatewaveform = waveform{${pluckTiming}};

gate(p) = gatewaveform,int(os.phasor(${(pluckWaveformLength+1)/2},1/(${(pluckWaveformLength+1)/4}*p))) : rdtable;
motif = waveform{${noteTiming}};

motifnotes(p) = motif,int(os.phasor(${(pluckWaveformLength+1)/4},1/(${(pluckWaveformLength+1)/4}*p))) : rdtable;
${dspTemplateBottom}`
}

const playit = () => {
    if(!audioCtx)
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if(audioCtx.state === "suspended")
        audioCtx.resume();
    if(!playState) {
        getComposition()
        document.getElementById("playStop").disabled = true;
        document.getElementById("playStop").classList.add("disabled");
        document.getElementById("playStop").innerHTML = "Compiling...";
        faust.ready.then(() => {
            let code = composition;
            faust.getNode(code, { audioCtx, useWorklet: false, bufferSize: 16384, args: { "-I": "libraries/" } }).then(node => {
                window.node = node;
                node.connect(audioCtx.destination);
                playState = true;
                document.getElementById("motifComposer").classList.remove("invalid");
                document.getElementById("syntaxError").classList.add("errorhidden");
                document.getElementById("playStop").disabled = false;
                document.getElementById("playStop").classList.remove("disabled");
                document.getElementById("playStop").innerHTML = "Stop";
                document.getElementById("download").disabled = false;
                document.getElementById("download").classList.remove("disabled");
            }, reason => {
                document.getElementById("motifComposer").classList.add("invalid");
                document.getElementById("syntaxError").classList.remove("errorhidden");
                document.getElementById("playStop").disabled = false;
                document.getElementById("playStop").classList.remove("disabled");
                document.getElementById("playStop").innerHTML = "Try Again";
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

const uploadsnapshot = () => {
    let uploader = document.getElementById("fileupload")
    let file = uploader.files[0]
    let reader = new FileReader()
    reader.onload = () => {
        reader.result.split("\n").forEach(p => {
            let args = p.split(' ')
            updateNotes(args[1].trim(), args[0].trim())
        })
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
    if(id.includes("/musicscale/Common_Parameters/Octave")) 
        document.getElementById("octave").value = value - 0
    if(id.includes("/Cent")) {
        note = id.replace("/musicscale/Common_Parameters/12_Note_Scale/","").replace("/Cent","")
        document.getElementById(`${note}-C`).value = value
    }
    if(id.includes("/0.01_Cent")) {
        note = id.replace("/musicscale/Common_Parameters/12_Note_Scale/","").replace("/0.01_Cent","")
        document.getElementById(`${note}-F`).value = value
    }
}