import React, { useState, useEffect } from "react";
import styles from "./Request.module.css";
import { ContactTile, Loading } from "../../component";
import { useSelector } from "react-redux";
import NavbarMobileView from "../../component/NavbarMobileView/NavbarMobileView";

function RequestPanel({users, setCurrentChat, requestList }) {
  const userProfile = useSelector(state => state.userprofile.userProfile);
  const [text, setText] = useState("");
  const [filterUser, setFilterUser] = useState([]);
  const [friendRequest, setFriendRequest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hamburgerMenuVisibility, setHamburgerMenuVisibility] = useState(false);

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
