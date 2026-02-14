import React, { useEffect, useRef, useState } from "react";
import styles from "./ChatContact.module.css";
import ContactTile from "../ContactTile/ContactTile";
import authServices from "../../appwrite/auth";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import messagesService from "../../appwrite/messagesService";
import { resetUnreadByUser } from "../../store/messageStatusSlice";
import relationshipServices from "../../appwrite/relationshipServices";
import NavbarMobileView from "../NavbarMobileView/NavbarMobileView";
import { setActivePanel } from "../../store/activePanelSlice";

function ChatContact({ friends, setCurrentChat, unseenMsg }) {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [filterUser, setFilterUser] = useState(friends);
  const [allFilterBtn, setAllFilterBtn] = useState(true);
  const [unreadFilterBtn, setUnreadFilterBtn] = useState(false);
  const [archivedFilterBtn, setArchivedFilterBtn] = useState(false);
  const [favouritesFilterBtn, setFavouritesFilterBtn] = useState(false);
  const [hamburgerMenuVisibility, setHamburgerMenuVisibility] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userProfile = useSelector(state => state.userprofile.userProfile);
  const msgUnreadByUser = useSelector(state => state.messageStatus.unreadByUser);

  const chatContactRef = useRef(null);
  
  // console.log(friends,filterUser);    // THIS HELPS ME TO IDENTIFY THE BUG

  useEffect(() => {
    let filterFriends = [];
    if(favouritesFilterBtn){
      const favFriends = friends.filter(friend => userProfile?.favourites.includes(friend.$id));
      filterFriends = favFriends;
    }else if(archivedFilterBtn){
      const archivedFriends = friends.filter(friend => userProfile?.archived.includes(friend.$id));
      filterFriends = archivedFriends;
    }else if(unreadFilterBtn){
      const unreadFriends = friends.filter(friend => unseenMsg.find(msg => msg.senderId === friend.$id));
      filterFriends = unreadFriends;
    }
    else{
        filterFriends = friends;
    }
    filterFriends = filterFriends?.filter(
      (friend) =>
        friend.first_name.toLowerCase().includes(text.toLowerCase()) ||
        friend.last_name.toLowerCase().includes(text.toLowerCase())
    );
    setFilterUser(filterFriends);
    
  }, [text, friends, favouritesFilterBtn, archivedFilterBtn, allFilterBtn]); // BUG FIXED BY ADDING FRIENDS ARRAY IN USEEFFECT DEPENDENCY ARRAY

  const handleAllFilterBtn = async () => {
    setAllFilterBtn(prev => !prev)
    setUnreadFilterBtn(false)
    setFavouritesFilterBtn(false)
    setArchivedFilterBtn(false)
    setFilterUser(friends) // BUG FIXED BY ADDING FRIENDS ARRAY IN USEEFFECT DEPENDENCY ARRAY SO THAT FILTERUSER ARRAY WILL BE RESETED TO FRIENDS ARRAY WHEN ALL BUTTON IS PRESSED
  }

  const handleUnreadFilterBtn = async () => {
    setUnreadFilterBtn(prev =>!prev)
    setAllFilterBtn(false)
    setFavouritesFilterBtn(false)
    setArchivedFilterBtn(false)
  }

  const handleFavouritesFilterBtn = () => {
    setFavouritesFilterBtn(prev =>!prev)
    setAllFilterBtn(false)
    setUnreadFilterBtn(false)
    setArchivedFilterBtn(false)
  }

  const handleArchivedFilterBtn = () => {
    setArchivedFilterBtn(prev => !prev)
    setAllFilterBtn(false)
    setUnreadFilterBtn(false)
    setFavouritesFilterBtn(false)
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

  const openChat = async (friendId) => {
    dispatch(resetUnreadByUser(friendId));
    unseenMsg.map(async (msg) => {
      if(String(msg.senderId) === String(friendId)){
        await messagesService.updateMessageStatus({
          msgId: msg.$id,
          status: "seen"
        })
      }
    }
    )
  };

  return (
    <>
      <div className={styles.chatcontact} ref={chatContactRef} >
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
            <span 
              onClick={handleAllFilterBtn}
              style={{backgroundColor: allFilterBtn? "rgb(245,245,245)":"transparent", scale: allFilterBtn? "0.97":"1"}}
            >All</span>
            <span 
              onClick={handleUnreadFilterBtn}
              style={{backgroundColor: unreadFilterBtn? "rgb(245,245,245)":"transparent", scale: allFilterBtn? "0.97":"1"}}
            >Unread</span>
            <span 
              onClick={handleFavouritesFilterBtn}
              style={{backgroundColor: favouritesFilterBtn? "rgb(245,245,245)":"transparent", scale: allFilterBtn? "0.97":"1"}}
            >Favourites</span>
            <span 
              onClick={handleArchivedFilterBtn}
              style={{backgroundColor: archivedFilterBtn? "rgb(245,245,245)":"transparent", scale: allFilterBtn? "0.97":"1"}}
            >Archived</span>
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
                  contact_id={friend.$id}
                  contact_name={friend.first_name + " " + friend.last_name}
                  contact_msg={friend.status}
                  profile_image={friend.profile_image}
                  // status={unseenMsg.find(msg => String(msg.senderId) === String(friend.$id))}
                  status={msgUnreadByUser[friend.$id]}
                  onClick={() => {
                    setCurrentChat(friend)
                    openChat(friend.$id)
                    return;
                  }}
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
