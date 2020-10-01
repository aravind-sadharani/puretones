const keyplay = (id) => {
    let aud = document.getElementById(id);
    if(!aud.ended)
        aud.load()
    aud.play()
}
