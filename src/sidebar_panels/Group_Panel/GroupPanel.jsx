import React, { useEffect, useState } from "react";
import styles from "./GroupPanel.module.css";
import { ContactTile } from "../../component";
import NavbarMobileView from "../../component/NavbarMobileView/NavbarMobileView";

function GroupPanel() {
  const [text, setText] = useState("");
  const [filterGroup, setFilterGroup] = useState([]);
  const [hamburgerMenuVisibility, setHamburgerMenuVisibility] = useState(false);

  useEffect(() => {
    console.log(text);
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
