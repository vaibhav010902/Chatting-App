import React, { useState } from "react";
import styles from "./MessageTile.module.css";
import { ID } from "appwrite";

function MessageTile({
  msgId,
  message,
  messanger,
  mediaUrl,
  deleteMessage,
  editMessage,
  time,
  ...props
}) {
  const [optionVisibility, setOptionVisibility] = useState(false);
  const [editMessagePanelVisibility, setEditMessagePanelVisibility] =
    useState(false);
  const [editText, setEditText] = useState("");

  return (
    <>
      <li
        className={styles.message_tile}
        style={{
          borderRadius:
            messanger == "sender" ? "0 10px 10px 10px" : "10px 0px 10px 10px",
          alignSelf: messanger == "sender" ? "flex-start" : "flex-end",
        }}
      >
        {mediaUrl.length > 0 ? (
          <span className={styles.image_container}>
            {mediaUrl.map((media) => (
              <img src={media + "&mode=admin"} alt="" key={ID.unique()} />
            ))}
          </span>
        ) : null}
        <div className={styles.message_container}>
          <p>{message}</p>
          <span
            className="material-symbols-outlined"
            onClick={() => setOptionVisibility((prev) => !prev)}
          >
            {optionVisibility ? "keyboard_arrow_up" : "keyboard_arrow_down"}
          </span>
        </div>
        {optionVisibility && (
          <div className={styles.option_panel}>
            <button
              onClick={() => {
                setEditMessagePanelVisibility(true);
                setOptionVisibility(false);
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
