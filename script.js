document.getElementById("audio").addEventListener("change", (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
        const arrayBuffer = event.target.result;
        const audioContext = new (window.AudioContext || window.webkitAudioContext)(); 
        audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
            visualize(audioBuffer, audioContext);
        });
    });

    reader.readAsArrayBuffer(file);
});

function visualize(audioBuffer, audioContext){
    const canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.5; 

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;

    const frequencyData = new Uint8Array(analyser.frequencyBinCount);

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    source.start();

    const canvasContext = canvas.getContext("2d");
    const barWidth = canvas.width / analyser.frequencyBinCount;

    function draw() {
        requestAnimationFrame(draw);

        canvasContext.fillStyle = "#a8e6cf";
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);

        analyser.getByteFrequencyData(frequencyData);

        for(let i = 0; i < analyser.frequencyBinCount; i++){
            const barHeight = frequencyData[i];
            const gradient = canvasContext.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, 'rgba(102, 252, 241, 1)');
            gradient.addColorStop(1, 'rgba(50, 187, 174, 1)');
            canvasContext.fillStyle = gradient;
            canvasContext.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 1, barHeight);
        }
    }

    draw();
}
