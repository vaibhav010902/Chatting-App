import { useEffect, useRef } from "react";

export default function VoiceWaveform({stream, isRecording}){
    const canvasRef = useRef();
    const animationRef = useRef();

    useEffect(() => {
        if(!stream || !isRecording) return;

        const audiaCtx = new AudioContext();
        const analyser = audiaCtx.createAnalyser();
        analyser.fftSize = 256;

        const source = audiaCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const draw = () => {
            analyser.getByteFrequencyData(dataArray);
            ctx.clearRect(0,0,canvas.width, canvas.height);
            const barwidth = canvas.width/dataArray.length;

            dataArray.forEach((value,i) => {
                const barHeight = value/2;
                ctx.fillStyle = "#25D366";
                ctx.fillRect(
                    i*barwidth,
                    canvas.height - barHeight,
                    barwidth-2,
                    barHeight
                );
            });
            animationRef.current = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(animationRef.current);
            audiaCtx.close();
        };
    },[stream, isRecording]);

    return <canvas ref={canvasRef} width={200} height={40}/>
}