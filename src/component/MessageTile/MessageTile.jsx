import React, { useEffect, useState } from "react";
import styles from "./MessageTile.module.css";
import { ID } from "appwrite";
import FilePreview from "../FilePreview";

function MessageTile({ msgId, message, messanger,type, mediaUrl, deleteMessage, editMessage, time, ...props}) {
  const [optionVisibility, setOptionVisibility] = useState(false);
  const [editMessagePanelVisibility, setEditMessagePanelVisibility] = useState(false);
  const [editText, setEditText] = useState("");
  const [msgType, setMsgType] = useState("text");

  useEffect(()=>{
    if(type == "voice"){
      setMsgType("voice")
    }else if(type == "image"){
      setMsgType("image")
    }else{
      setMsgType("text")
    }
  },[msgId])

  return (
    <>
      <li
        className={styles.message_tile}
        style={{
          borderRadius: messanger == "sender" ? "0 10px 10px 10px" : "10px 0px 10px 10px",
          alignSelf: messanger == "sender" ? "flex-start" : "flex-end",
          zIndex: optionVisibility || editMessagePanelVisibility ? 2 : 1,
        }}
      >
        {msgType=="image" && (
          <span className={styles.image_container}>
            {mediaUrl.map((media) => (
              <img src={media.replace("preview","view") + "&mode=admin"} alt="" key={ID.unique()} />
            ))}
          </span>
        )}
        {msgType=="voice" && (
          <FilePreview mediaUrl={mediaUrl}/>
        )}
        <div className={styles.message_container}>
          <p>{message}</p>
          <span
            className="material-symbols-outlined"
            onClick={() => {
              setEditMessagePanelVisibility(false)
              setOptionVisibility(prev => !prev)
              return;
            }}
          >
            {optionVisibility ? "keyboard_arrow_up" : "keyboard_arrow_down"}
          </span>
        </div>
        {optionVisibility && (
          <div className={styles.option_panel}>
            <button
              onClick={() => {
                setEditMessagePanelVisibility(true);
                // setOptionVisibility(false);
                return;
              }}
            >
              Edit
            </button>
            <button
              onClick={() => {
                deleteMessage(msgId);
                setOptionVisibility(false);
                return;
              }}
            >
              Delete
            </button>
          </div>
        )}
        {editMessagePanelVisibility && (
          <div className={styles.option_panel}>
            <input
              type="text"
              style={{ backgroundColor: "rgb(245,245,245)", outline: "none" }}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
            <button
              onClick={() => {
                editMessage(msgId, editText);
                setEditMessagePanelVisibility(false);
                setEditText("");
                return;
              }}
            >
              Edit Message
            </button>
            <button
              onClick={() => {
                setEditMessagePanelVisibility(false);
                setEditText("");
                return;
              }}
            >
              Cancel Edit
            </button>
          </div>
        )}
      </li>
    </>
  );
}

export default MessageTile;
