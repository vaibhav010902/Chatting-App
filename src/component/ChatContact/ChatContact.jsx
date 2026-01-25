import React, { useEffect, useState } from "react";
import styles from "./ChatContact.module.css";
import ContactTile from "../ContactTile/ContactTile";
import Sidebar from "../Sidebar/Sidebar";
import ChatPanel from "../ChatPanel/ChatPanel";

function ChatContact({ friends, setCurrentChat }) {
  const [text, setText] = useState("");
  const [filterUser, setFilterUser] = useState(friends);

  useEffect(() => {
    friends = friends?.filter(
      (friend) =>
        friend.first_name.toLowerCase().includes(text.toLowerCase()) ||
        friend.last_name.toLowerCase().includes(text.toLowerCase())
    );
    setFilterUser(friends);
    console.log(text);
  }, [text]);
  return (
    <>
      {/* <Sidebar/> */}
      <div className={styles.chatcontact}>
        <div className={styles.chatcontact_container}>
          <div className={styles.chatcontact_header_container}>
            <h1>Chat App</h1>
          </div>
          <div className={styles.chatcontact_search_bar_container}>
            <input
              type="text"
              placeholder="Search"
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div className={styles.chatcontact_chat_filter_container}>
            <span>All</span>
            <span>Unread</span>
            <span>Favourites</span>
            <span>Archived</span>
          </div>
          <div className={styles.chatcontact_chats_container}>
            {filterUser.length == 0 ? (
              <p style={{margin:"auto", color:"gray"}}>NO FRIENDS FOUND....<br/>START CHATTING TO ADD FRIENDS.</p>
            ) : (
              filterUser?.map((friend) => (
                <ContactTile
                  key={friend.$id}
                  contact_name={friend.first_name + " " + friend.last_name}
                  contact_msg={friend.status}
                  profile_image={friend.profile_image}
                  onClick={() => setCurrentChat(friend)}
                />
              ))
            )}
          </div>
        </div>
      </div>
      {/* <ChatPanel/> */}
    </>
  );
}

export default ChatContact;
