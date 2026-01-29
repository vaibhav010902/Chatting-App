import React, { useState, useEffect } from "react";
import styles from "./Request.module.css";
import profileServices from "../../appwrite/profileServices";
import { ContactTile, Loading } from "../../component";
import relationshipServices from "../../appwrite/relationshipServices";

function RequestPanel({ userProfile, users, setCurrentChat, requestList }) {
  const [text, setText] = useState("");
  const [filterUser, setFilterUser] = useState([]);
  // const [requestList, setRequestList] = useState([]);
  const [friendRequest, setFriendRequest] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestList.length==0 && setLoading(false);
  }, [userProfile.$id]);

  useEffect(() => {
    if (!users.length || !requestList.length) return;
    
    const requestUserIds = new Set(
      requestList.map(req => req.fromUserId)
    );
  
    setFriendRequest(
      users.filter(user => requestUserIds.has(user.$id))
    );
    setFilterUser(friendRequest);
    friendRequest && setLoading(false);
  }, [requestList]);
  

  useEffect(() => {
    if (!friendRequest.length) return;
    const fuser = friendRequest?.filter(
      (user) =>
        user.first_name.toLowerCase().includes(text.toLowerCase()) ||
        user.last_name.toLowerCase().includes(text.toLowerCase())
    );
    setFilterUser(fuser);
  }, [text,friendRequest]);

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
          {loading ?
            <Loading font_Size="20px"/>:
            <div className={styles.chatcontact_chats_container}>
              {filterUser.length == 0 ? (
                <p style={{ margin: "auto", color: "gray" }}>
                  NO USERS FOUND....
                </p>  
              ) : (
                filterUser?.map((user) => (
                  <ContactTile
                    key={user.$id}
                    contact_name={user.first_name + " " + user.last_name}
                    contact_msg={user.status}
                    profile_image={user.profile_image}
                    onClick={() => setCurrentChat(user)}
                  />
                ))
              )}
                {/* {friendRequest?.length == 0 ? (
                  <p style={{ margin: "auto", color: "gray" }}>
                    NO USERS FOUND....
                  </p>
                ) : (
                  friendRequest?.map((user) => (
                    <ContactTile
                      key={user.$id}
                      contact_name={user.first_name + " " + user.last_name}
                      contact_msg={user.status}
                      profile_image={user.profile_image}
                      onClick={() => setCurrentChat(user)}
                    />
                  ))
                )} */}
            </div>}
        </div>
      </div>
    </>
  );
}

export default RequestPanel;
