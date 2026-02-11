import React, { useState, useEffect } from "react";
import styles from "./ContactPanel.module.css";
import profileServices from "../../appwrite/profileServices";
import { ContactTile } from "../../component";
import NavbarMobileView from "../../component/NavbarMobileView/NavbarMobileView";

function ContactPanel({ users, setCurrentChat }) {
  const [hamburgerMenuVisibility, setHamburgerMenuVisibility] = useState(false);
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
            <h1>Friends-Circle</h1>
            <span 
              className="material-symbols-outlined"
              onClick={() => setHamburgerMenuVisibility(prev => !prev)}
            >more_vert</span>
            {hamburgerMenuVisibility && 
            <div className={styles.hamburger_menu_panel}>
              <p onClick={() => dispatch(setActivePanel("Profile"))}>Profile</p>
              <p onClick={() => dispatch(setActivePanel("Settings"))}>Settings</p>
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
          <NavbarMobileView/>
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
