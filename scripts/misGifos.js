// CREAR GIFOS
const apiKeyGiphy = "v6GX2EfRqxwiexQZkHhYu6ZrteDkFt6Z";

let btnStart = document.getElementById("comenzar");
let btnRecord = document.getElementById("grabar");
let btnStop = document.getElementById("finalizar");
let btnUpload = document.getElementById("subir");
let ctnVideo = document.getElementById("contenedorVideo");
let video = document.querySelector("video");
let urlUpload = `https://upload.giphy.com/v1/gifs?api_key=${apiKeyGiphy}`
let timerGif = document.getElementById("aditionaltext")

btnStart.addEventListener("click", getStreamAndRecord);

function getStreamAndRecord() {

    btnStart.classList.remove("activo");
    btnRecord.classList.add("activo");

    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            height: { max: 480 }
        }
    })
        .then(function (stream) {

            ctnVideo.innerHTML = ""

            video.srcObject = stream;
            video.play()

            btnRecord.addEventListener("click", () => {
                recorder = RecordRTC(stream, {
                    type: 'gif',
                    frameRate: 1,
                    quality: 10,
                    width: 360,
                    hidden: 240,
                    onGifRecordingStarted: function () {
                        console.log('started')
                    },
                });
                recorder.startRecording();

                btnRecord.classList.remove("activo");
                btnStop.classList.add("activo");

                function timer() {
                    var tope = 0;
                    var intervalo;

                    function seconds() {
                        tope++;
                        timerGif.textContent = `00:00:0${tope}`

                        if (tope >= 9) {
                            clearInterval(intervalo);
                            pararGrabacion();
                        }
                    }

                    function intervalo() {
                        intervalo = setInterval(seconds, 1000);
                    }
                    intervalo();
                    btnStop.addEventListener("click", () => {
                        clearInterval(intervalo);
                        pararGrabacion()

                    })
                }
                timer();
            })

        })


    ctnVideo.innerHTML = `<h2><span>¿Nos das acceso</span><span>a tu cámara?</span></h2>
        <p>
        <span>El acceso de tu cámara será válido solo</span>
        <span>Por el tiempo en el que estés creando el GIFO</span></p>`

}

function pararGrabacion() {
    recorder.stopRecording(function () {
        let blob = recorder.getBlob();
        invokeSaveAsDialog(blob);
    });

    timerGif.textContent = `REPETIR CAPTURA`;

    btnStop.classList.remove("activo");
    btnUpload.classList.add("activo");

    timerGif.addEventListener("click", () => {
        getStreamAndRecord();
        btnUpload.classList.remove("activo");

    })

}
btnUpload.addEventListener("click", uploadGif)

function uploadGif() {
    fetch(urlUpload)
        .then(data => data.json())
        .then(() => {
            let form = new FormData()
            form.append('file', recorder.getBlob(), 'myGif.gif')
            console.log(form.get('file'))
        }
        )
}
