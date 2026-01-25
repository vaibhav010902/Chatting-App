import React from "react";
import styles from "./MessageTile.module.css";

function MessageTile({ message, messanger, mediaUrl, ...props }) {
  return (
    <li
      className={styles.message_tile}
      style={{
        borderRadius:
          messanger == "sender" ? "0 10px 10px 10px" : "10px 0px 10px 10px",
        alignSelf: messanger == "sender" ? "flex-start" : "flex-end",
      }}
    >
      {mediaUrl.length > 0 ?? (
        <span className={styles.image_container}>
          {mediaUrl.map((media) => (
            <img src={media.mediaUrl} alt="" key={media.id} />
          ))}
        </span>
      )}
      <div className={styles.message_container}>
        <p>{message}</p>
        <span className="material-symbols-outlined">keyboard_arrow_down</span>
      </div>
    </li>
  );
}

export default MessageTile;
