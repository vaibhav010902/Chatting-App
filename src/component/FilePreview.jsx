import { useEffect, useState, useRef } from "react";
import "./FilePreview.css";

export default function FilePreview({mediaUrl}) {
  const audioRef = useRef(null);
  const lastProgressRef = useRef(0);
  const progressBarRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      await audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio.duration || !isFinite(audio.duration)) return;

    const newProgress = (audio.currentTime / audio.duration) * 100;

    if (Math.abs(newProgress - lastProgressRef.current) > 0.1) {
      lastProgressRef.current = newProgress;
    }
    setCurrentTime(audio.currentTime);
    setProgress(newProgress);
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;

    if (audio.duration === Infinity) {
      audio.currentTime = 1e101;
      audio.ontimeupdate = () => {
        audio.currentTime = 0;
        audio.ontimeupdate = null;
        setDuration(audio.duration);
      };
    } else {
      setDuration(audio.duration);
    }
  };

  const formatTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;

    audio.currentTime = percent * audio.duration;
    setProgress(percent * 100);
  };

  return (
    <>
      <div className="voice-player">
        <div className="voice-player-container">
          <div className="progress-bar-container">
            <span 
                className="material-symbols-outlined" 
                onClick={togglePlay}
                style={{padding:"0px", margin:"0px", cursor:"pointer"}}
            >
              {!isPlaying ? "play_arrow" : "pause"}
            </span>
            <div
              className="progress-bar"
              ref={progressBarRef}
              onClick={handleSeek}
            >
              <span
                className="progress-bar-pointer"
                style={{ left: `${Math.min(progress, 95)}%` }}
              ></span>
              <span
                className="progress-bar-filler"
                style={{ width: `${progress}%` }}
              ></span>
            </div>
          </div>
          <div className="progress-timer-container">
            <span className="progress-timer">
              {formatTime(currentTime)}/{formatTime(duration)}
            </span>
            <span className="time">
              {new Date().toISOString().slice(11,19)}
            </span>
          </div>
          <audio
            ref={audioRef}
            src={mediaUrl+"&mode=admin"}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            hidden
          />
        </div>
        <div className="profile-image-container">
          <img
            src="https://fra.cloud.appwrite.io/v1/storage/buckets/69765f44003cd4e19451/files/69793f1d003e5ba4805a/view?project=6967f521002a896162cb&mode=admin"
            alt=""
            className="profile-image"
          />
        </div>
      </div>
    </>
  );
}
