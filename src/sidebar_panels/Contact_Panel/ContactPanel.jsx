import React, { useState, useEffect } from "react";
import styles from "./ContactPanel.module.css";
import profileServices from "../../appwrite/profileServices";
import { ContactTile } from "../../component";

function ContactPanel({ users, setCurrentChat }) {
  const [text, setText] = useState("");
  const [filterUser, setFilterUser] = useState(users);
  useEffect(() => {
    users = users.filter(
      (user) =>
        user.first_name.toLowerCase().includes(text.toLowerCase()) ||
        user.last_name.toLowerCase().includes(text.toLowerCase())
    );
    setFilterUser(users);
  }, [text]);

  return (
    <>
      <div className={styles.chatcontact}>
        <div className={styles.chatcontact_container}>
          <div className={styles.chatcontact_header_container}>
            <h1>Chat App</h1>
          </div>
          <div className={styles.chatcontact_search_bar_container}>
            <input
              type="text"
              placeholder="Search"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div className={styles.chatcontact_chats_container}>
            {filterUser.length == 0 ? (
              <p style={{ margin: "auto", color: "gray" }}>
                NO USERS FOUND....
              </p>
            ) : (
              filterUser?.map((user) => (
                <ContactTile
                  key={user.$id}
                  contact_id={user.$id}
                  contact_name={user.first_name + " " + user.last_name}
                  contact_msg={user.status}
                  profile_image={user.profile_image}
                  onClick={() => setCurrentChat(user)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ContactPanel;
