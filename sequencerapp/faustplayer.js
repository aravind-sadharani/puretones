audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const faust = new Faust2WebAudio.Faust({ debug: true, wasmLocation: "./faustwasm/libfaust-wasm.wasm", dataLocation: "./faustwasm/libfaust-wasm.data" });
window.faust = faust;
var playState = false;
const playit = () => {
    if(audioCtx.state === "suspended")
        audioCtx.resume();
    if(!playState) {
        document.getElementById("playStop").disabled = true;
        document.getElementById("playStop").classList.add("disabled");
        document.getElementById("playStop").innerHTML = "Compiling...";
        faust.ready.then(() => {
            let code = document.getElementById("noteSpec").value;
            faust.getNode(code, { audioCtx, useWorklet: false, bufferSize: 8192, args: { "-I": "libraries/" } }).then(node => {
                window.node = node;
                node.connect(audioCtx.destination);
                playState = true;
                document.getElementById("playStop").disabled = false;
                document.getElementById("playStop").classList.remove("disabled");
                document.getElementById("playStop").innerHTML = "Stop";
            });
        });
    } else {
        let dspNode = window.node;
        dspNode.disconnect(audioCtx.destination);
        dspNode.destroy();
        playState = false;
        document.getElementById("playStop").innerHTML = "Play Audio";
    }
}