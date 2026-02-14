import React, { useEffect, useState } from "react";
import { ChatContact, ChatPanel, Loading, Sidebar } from "../index";
import { useSelector } from "react-redux";
import profileServices from "../../appwrite/profileServices";
import messagesService from "../../appwrite/messagesService";
import "./UserHome.css";
import { ProfilePanel, ContactPanel, GroupPanel, SettingPanel } from "../../sidebar_panels/sidebar_panels";
import { Query } from "appwrite";
import RequestPanel from "../../sidebar_panels/Request_Panel/RequestPanel";
import relationshipServices from "../../appwrite/relationshipServices";
import { client } from "../../appwrite/config";
import conf from "../../conf/conf";
import {useDispatch} from "react-redux";
import { setUnreadByUser } from "../../store/messageStatusSlice.js";
import { addProfile } from "../../store/userProfileSlice.js";
import ContactProfilePanel from "../../sidebar_panels/ContactProfilePanel/ContactProfilePanel.jsx";
import settingServices from "../../appwrite/settingServices.js";
import { setSettings } from "../../store/settingSlice.js";
import { setRequestList } from "../../store/requestListSlice.js";

function UserHome() {
  const userData = useSelector((state) => state.auth.userData);
  const userProfile = useSelector(state => state.userprofile.userProfile);
  const activePanel = useSelector(state => state.activePanel.name);

  const [loading, setLoading] = useState(true);
  const [currentChat, setCurrentChat] = useState("");
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState(null);
  // const [newMessages, setNewMessages] = useState([]);
  const [unseenMsg, setUnseenMsg] = useState([]);
  const [error, setError] = useState("");
  const dispatch = useDispatch();



  const panels = [
    {
      name: "Profile",
      component: <ProfilePanel/>,
      status: false,
    },
    {
      name: "Friends",
      component: (
        <ChatContact friends={friends} setCurrentChat={setCurrentChat} unseenMsg={unseenMsg}/>
      ),
      status: true,
    },
    {
      name: "Contacts",
      component: <ContactPanel users={users} setCurrentChat={setCurrentChat} />,
      status: false,
    },
    {
      name: "Groups",
      component: <GroupPanel  />,
      status: false,
    },
    {
      name: "Requests",
      component: <RequestPanel users={users} setCurrentChat={setCurrentChat}/>,
      status: false,
    },
    {
      name: "Settings",
      component: <SettingPanel/>,
      status: false,
    },
    {
      name: "Contact_Profile_Panel",
      component: <ContactProfilePanel users={users}/>,
      status: false,
    },
  ];

  const activePanelComponent = panels.find(
    (panel) => panel.name === activePanel
  )?.component;

  useEffect(() => {
    const getUserProfile = async () => {
      if (!userData?.$id) return;
      try {
        const response = await profileServices.getProfile(userData.$id);
        dispatch(addProfile(response.documents[0]))
      } catch (error) {
        console.log("Error fetching profile:", error.message);
      } finally {
        setLoading(false);
      }
    };
    getUserProfile();
  }, [userData]);

  useEffect(() => {
    const getMessageStatus = async () => {
      if (!userProfile?.$id) return;
      try {
        const response = await messagesService.getMessagesStatus({recieverId: userProfile?.$id, status: "delivered"});
        response.forEach(msg => {
          dispatch(setUnreadByUser(msg.senderId));
        })
        setUnseenMsg(response);
      } catch (error) {
        console.log("Something went wrong while getting the messages");
      }
    };
    getMessageStatus();
  },[userProfile?.$id])

  const getFriendRequestList = async () => {
    if(!userProfile?.$id) return;

    try{
      const response = await relationshipServices.getRelationshipList({toUserId: userProfile?.$id, status: "pending"});
      response.length && dispatch(setRequestList(response));
    }catch(error){
      console.log("UserHome :: getFriendRequestList :: ", error.message);
    }
  }
  useEffect(() => {
    getFriendRequestList();
  }, [userProfile?.$id]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await profileServices.getAllUsers();
        setUsers(response?.documents || []);
      } catch (error) {
        console.log("Something went wrong while getting the users");
      }
    };
    getUsers();
  }, [userData?.$id]);

  useEffect(() => {
    if (!users?.length || !userProfile?.friends?.length) return setFriends([]);
    const filteredFriends = users.filter((user) =>
      userProfile.friends.includes(user.$id)
    );
    setFriends(filteredFriends);
  }, [users, userProfile]);
  
  useEffect(() => {
    if (!userProfile?.$id) return;
    const getSettings = async () => {
      try {
        setError("")
        const response = await settingServices.getSettings(userProfile?.$id);
        if(response){
          dispatch(setSettings({theme: response?.theme, wallpaper: response?.wallpaper, fontsize: response?.fontsize}))
        }else{
          const settings = await settingServices.createSettings(userProfile?.$id);
          dispatch(setSettings({theme: settings?.theme, wallpaper: settings?.wallpaper, fontsize: settings?.fontsize}))
        }
      } catch (error) {
        
        setError(error.message);
      }
    }
    getSettings();
  }, [userProfile?.$id])

  useEffect(() => {
    if (
      Array.isArray(friends) &&
      Array.isArray(users) &&
      Array.isArray(userProfile)
    ) {
      setLoading(false);
    }
  }, [friends]);
  
  useEffect(() => {
    if (!userProfile?.$id) return;
    const channel = `databases.${conf.appwriteDatabaseID}.collections.${conf.appwriteMessagesCollectionID}.documents`;
    const unsubscribe = client.subscribe(channel, (response) => {
      if (
        response.events.includes("databases.*.collections.*.documents.*.create")
      ) {
        if (!response.payload?.$id) return;
        const msg = response.payload;
        if (
          msg.chatId === userProfile.$id &&
          msg.status !== "seen"
        ) {
          dispatch(setUnreadByUser(msg.senderId));
        }
        getFriendRequestList();
        console.log("Websocket!")
      }
    });

    return () => {
      unsubscribe(); // ✅ always a function
    };
  }, [currentChat?.$id, userProfile?.$id]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="userhome-page">
            <Sidebar/>
            {activePanelComponent}
            {/* <SettingPanel/> */}
            {currentChat?.$id && (
              <ChatPanel
                currentChat={currentChat}
                setCurrentChat={setCurrentChat}
              />
            )}
          </div>
        </>
      )}
    </>
  );
}

export default UserHome;
