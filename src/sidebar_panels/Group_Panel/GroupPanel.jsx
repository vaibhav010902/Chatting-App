import React, { useEffect, useState } from "react";
import styles from "./GroupPanel.module.css";
import { ContactTile } from "../../component";

function GroupPanel() {
  const [text, setText] = useState("");
  const [filterGroup, setFilterGroup] = useState([]);

  useEffect(() => {
    console.log(text);
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
              placeholder="Search..."
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div className={styles.chatcontact_chat_filter_container}>
            <span>All</span>
            <span>Unread</span>
            <span>Favourites</span>
          </div>
          <div className={styles.chatcontact_chats_container}>
            {filterGroup.length == 0 ? (
              <p style={{ margin: "auto", color: "gray" }}>
                NO GROUP FOUND....
                <br />
                START CHATTING TO ADD GROUPS.
              </p>
            ) : (
              filterGroup?.map((user) => (
                <ContactTile
                  key={user.$id}
                  contact_name={user.first_name + " " + user.last_name}
                  contact_msg={user.status}
                  profile_image={user.profile_image}
                  onClick={() => setCurrentChat(user)}
                />
              ))
            )}

            {/* {friends?.map((friend) => (
              <ContactTile 
                key={friend}
                contact_name={friend}
                contact_msg="Yo Yo Honey Singh"
                onClick={() => setCurrentChat(friend)}
              />
            ))} */}
            <ContactTile
              contact_name="Vaibhav Agrawal"
              contact_msg="Name is Vaibhav agrawal from satna "
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default GroupPanel;
