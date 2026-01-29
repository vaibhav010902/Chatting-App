import React, { useEffect, useState } from "react";
import styles from "./ChatContact.module.css";
import ContactTile from "../ContactTile/ContactTile";
import Sidebar from "../Sidebar/Sidebar";
import ChatPanel from "../ChatPanel/ChatPanel";
import Loading from "../Loading/Loading";
import authServices from "../../appwrite/auth";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";

function ChatContact({ friends, setCurrentChat }) {
  const [text, setText] = useState("");
  const [filterUser, setFilterUser] = useState(friends);
  const [hamburgerMenuVisibility, setHamburgerMenuVisibility] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // console.log(friends,filterUser);    // THIS HELPS ME TO IDENTIFY THE BUG

  useEffect(() => {
    friends = friends?.filter(
      (friend) =>
        friend.first_name.toLowerCase().includes(text.toLowerCase()) ||
        friend.last_name.toLowerCase().includes(text.toLowerCase())
    );
    setFilterUser(friends);
  }, [text, friends]); // BUG FIXED BY ADDING FRIENDS ARRAY IN USEEFFECT DEPENDENCY ARRAY

  const handleProfileBtn = async () => {
    console.log("Profile Btn Clicked")
  }

  const handleContactBtn = async () => {
    console.log("Contact Btn Clicked")
  }

  const handleRequestBtn = () => {
    console.log("Request Btn Clicked")
  }

  const handleGroupBtn = () => {
    console.log("Group Btn Clicked")
  }

  const handleSettingsBtn = () => {
    console.log("Settings Btn Clicked")
  }
  
  const handleLogoutBtn = async () => {
    try {
      await authServices.logoutAccount()
      dispatch(logout())
      navigate("/")
    } catch (error) {
      console.log("error: ",error);
    }
  }

  return (
    <>
      <div className={styles.chatcontact}>
        <div className={styles.chatcontact_container}>
          <div className={styles.chatcontact_header_container}>
            <h1>Chat App</h1>
            <span 
              className="material-symbols-outlined"
              onClick={() => setHamburgerMenuVisibility(prev => !prev)}
            >more_vert</span>
            {hamburgerMenuVisibility && 
            <div className={styles.hamburger_menu_panel}>
              <p onClick={handleProfileBtn}>Profile</p>
              <p onClick={handleContactBtn}>New Contact</p>
              <p onClick={handleRequestBtn}>Request</p>
              <p onClick={handleGroupBtn}>New Group</p>
              <p onClick={handleSettingsBtn}>Settings</p>
              <p onClick={handleLogoutBtn}>Logout</p>
            </div>}
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
              <p style={{ margin: "auto", color: "gray" }}>
                NO FRIENDS FOUND....
                <br />
                START CHATTING TO ADD FRIENDS.
              </p>
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
    </>
  );
}

export default ChatContact;
