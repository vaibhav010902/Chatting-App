import { useRef, useState } from "react";
import { ID } from "appwrite";
import { generateWaveform } from "../component/utils/generateWaveform";
import VoiceWaveform from "./VoiceWaveform";
import storageServices from "../appwrite/storage";
import messagesService from "../appwrite/messagesService";
import FilePreview from "./FilePreview";

export default function Root() {
  const chatId = "6972a606003456112b2e";
  const userId = "6973184f000d955da862";
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef();

  const [stream, setStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const [previewFile, setPreviewFile] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const [previewWaveform, setPreviewWaveform] = useState(null);

  // 🎤 START RECORDING
  const startRecording = async () => {
    if (mediaRecorderRef.current?.state === "recording") return;

    const micStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    setStream(micStream);
    setIsRecording(true);

    mediaRecorderRef.current = new MediaRecorder(micStream, {
      mimeType: "audio/webm",
    });

    audioChunksRef.current = [];
    mediaRecorderRef.current.start(1000);

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };
  };

  // 🛑 STOP RECORDING → PREVIEW
  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;

    setIsRecording(false);

    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const file = new File([blob], "voice.webm", { type: "audio/webm" });

      const waveform = await generateWaveform(blob);

      setPreviewFile(file);
      setPreviewType("voice");
      setPreviewWaveform(waveform);

      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    };

    mediaRecorderRef.current.stop();
  };

  // 📎 FILE SELECT
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewFile(file);
    setPreviewType(file.type.startsWith("image") ? "image" : "file");
  };

  // ✅ SEND PREVIEW
  const sendPreview = async () => {
    const fileID = ID.unique();
    const uploaded = await storageServices.uploadFile({
      fileID,
      file: previewFile,
    });

    await messagesService.sendMessage({
      chatId,
      senderId: userId,
      type: previewType,
      fileId: uploaded.$id,
      fileUrl: storageServices.getFileView(uploaded.$id),
      waveform: previewWaveform || null,
    });

    setPreviewFile(null);
    setPreviewType(null);
    setPreviewWaveform(null);
  };

  // ❌ CANCEL PREVIEW
  const cancelPreview = () => {
    setPreviewFile(null);
    setPreviewType(null);
    setPreviewWaveform(null);
  };

  return (
    <div>
      {previewFile ? (
        <FilePreview
          file={previewFile}
          type={previewType}
          onSend={sendPreview}
          onCancel={cancelPreview}
        />
      ) : (
        <>
          {isRecording && (
            <VoiceWaveform stream={stream} isRecording={isRecording} />
          )}

          <input
            type="file"
            hidden
            ref={fileInputRef}
            onChange={handleFileSelect}
          />

          <button onClick={() => fileInputRef.current.click()}>📎</button>

          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
          >
            🎤 Hold
          </button>
        </>
      )}
    </div>
  );
}
