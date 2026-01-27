import { useEffect } from "react";

export default function FilePreview({ file, type, onSend, onCancel }) {
  const previewUrl = URL.createObjectURL(file);

  useEffect(() => {
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  return (
    <div style={{ padding: 10, borderTop: "1px solid #ddd" }}>
      {type === "voice" && <audio controls src={previewUrl} />}

      {type === "image" && (
        <img src={previewUrl} alt="preview" width={200} />
      )}

      {type === "file" && (
        <p>{file.name} ({(file.size / 1024).toFixed(1)} KB)</p>
      )}

      <div style={{ marginTop: 10 }}>
        <button onClick={onCancel}>❌ Cancel</button>
        <button onClick={onSend} style={{ marginLeft: 10 }}>✅ Send</button>
      </div>
    </div>
  );
}
