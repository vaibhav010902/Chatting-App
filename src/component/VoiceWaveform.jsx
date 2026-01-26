import { useEffect, useRef } from "react";

export default function VoiceWaveform({stream, isRecording}){
    const canvasRef = useRef();
    const animationRef = useRef();

    useEffect(() => {
        if(!stream || !isRecording) return;    // DON'T DO ANYTHING IF MIC PERMISSION IS NOT GRANTED OR USER NOT RECORDING.

        const audiaCtx = new AudioContext();    // THIS IS THE ENGINE OF WEB AUDIO API. CREATE CONTEXT.
        const analyser = audiaCtx.createAnalyser();    // ANALYSER IS THE ENGINE THAT WILL ANALYSE THE AUDIO STREAM AND PROVIDE US WITH DATA. WE WILL USE THIS DATA TO DRAW THE WAVEFORM.
        analyser.fftSize = 256;    // THIS IS THE SIZE OF THE DATA ARRAY. THE MORE THE SIZE THE MORE ACCURATE THE DATA BUT THE MORE CPU INTENSIVE IT IS. IT CONTROLS RESOLUTION(SMALLER=SMOOTHER)

        const source = audiaCtx.createMediaStreamSource(stream);    // THIS WILL CONNECT THE AUDIO STREAM TO THE ANALYSER. 
        source.connect(analyser);    

        const dataArray = new Uint8Array(analyser.frequencyBinCount);    // THIS IS THE DATA ARRAY THAT WILL STORE THE DATA. WILL HOLD THE AUDIO AMPLITUDE VALUES.
        const canvas = canvasRef.current;    // THIS IS THE CANVAS ELEMENT THAT WILL BE USED TO DRAW THE WAVEFORM.
        const ctx = canvas.getContext("2d");    // THIS IS THE CONTEXT OF THE CANVAS. WE WILL USE THIS TO DRAW THE WAVEFORM.

        const draw = () => {
            analyser.getByteFrequencyData(dataArray);    // THIS WILL GET THE DATA FROM THE ANALYSER AND STORE IT IN THE DATA ARRAY. FILL WITH CURRENT AUDIO INTENSITY.
            ctx.clearRect(0,0,canvas.width, canvas.height);    // CLEAR THE CANVAS.
            const barwidth = canvas.width/dataArray.length;    // THIS IS THE WIDTH OF EACH BAR. DIVIDE CANVAS INTO EQUAL BARS

            dataArray.forEach((value,i) => {
                const barHeight = value/2;    // THIS IS THE HEIGHT OF EACH BAR. DIVIDE BY 2 TO MAKE IT SMALLER. LOUDER SOUND --> TALLER BAR
                ctx.fillStyle = "#25D366";
                ctx.fillRect(
                    i*barwidth,
                    canvas.height - barHeight,
                    barwidth-2,
                    barHeight
                );    // DRAW EACH BAR FROM BOTTOM-->UP.
            });
            animationRef.current = requestAnimationFrame(draw);    // REQUEST ANIMATION FRAME TO DRAW THE WAVEFORM. RUNS AT 60FPS.
        };
        draw();

        return () => {
            cancelAnimationFrame(animationRef.current);    // STOP ANIMATION.
            audiaCtx.close();    // RELEASE MIC/AUDUO MEMORY.
        };
    },[stream, isRecording]);

    return <canvas ref={canvasRef} width={200} height={40}/>
}