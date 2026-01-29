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

function UserHome() {
  const userData = useSelector((state) => state.auth.userData);

  const [userProfile, setUserProfile] = useState({});
  const [messages, setMessages] = useState([]);
  const [contact, setContact] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentChat, setCurrentChat] = useState("");
  const [currentChatUserProfile, setCurrentChatUserProfile] = useState({});
  const [activePanel, setActivePanel] = useState("Friends");
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState(null);
  const [requestList, setRequestList] = useState([]);

  const panels = [
    {
      name: "Profile",
      component: <ProfilePanel userProfile={userProfile} />,
      status: false,
    },
    {
      name: "Friends",
      component: (
        <ChatContact friends={friends} setCurrentChat={setCurrentChat} />
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
      component: <RequestPanel userProfile={userProfile} users={users} setCurrentChat={setCurrentChat} requestList={requestList}/>,
      status: false,
    },
    {
      name: "Settings",
      component: <SettingPanel userProfile={userProfile} />,
      status: false,
    },
  ];

  const activePanelComponent = panels.find(
    (panel) => panel.name === activePanel
  )?.component;

  const getUserProfile = async () => {
    if (!userData?.$id) return;
    try {
      const response = await profileServices.getProfile(userData.$id);
      setUserProfile(response.documents[0]);
    } catch (error) {
      console.log("Error fetching profile:", error.message);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentChatUserProfile = async () => {
    if (!currentChat?.$id) return;
    try{
      const response = await profileServices.getProfile(currentChat.$id);
      setCurrentChatUserProfile(response.documents[0]);
    }catch(error){
      console.log("Error fetching profile:", error.message);
      setCurrentChatUserProfile(null);
    }finally{
      setLoading(false);}
  }
  const getUsers = async () => {
    try {
      const response = await profileServices.getAllUsers();
      setUsers(response?.documents || []);
    } catch (error) {
      console.log("Something went wrong while getting the users");
    }
  };

  const getFriendRequestList = async () => {
    if(!userProfile?.$id) return;

    try{
      const response = await relationshipServices.getRelationshipList({toUserId: userProfile?.$id, status: "pending"});
      response.length && setRequestList(response);
    }catch(error){
      console.log("UserHome :: getFriendRequestList :: ", error.message);
    }
  }

  useEffect(() => {
    getFriendRequestList();
  }, [userProfile?.$id]);

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (!users.length || !userProfile.friends?.length) return setFriends([]);
    const filteredFriends = users.filter((user) =>
      userProfile.friends.includes(user.$id)
    );
    setFriends(filteredFriends);
  }, [users, userProfile]);

  useEffect(() => {
    getUserProfile();
  }, [userData]);

  useEffect(() => {
    if (!currentChat) return;
    getCurrentChatUserProfile(currentChat);
  }, [currentChat]);

  useEffect(() => {
    if (
      Array.isArray(friends) &&
      Array.isArray(users) &&
      Array.isArray(userProfile)
    ) {
      setLoading(false);
    }
  }, [friends]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="userhome-page">
            <Sidebar
              activePanel={activePanel}
              setActivePanel={setActivePanel}
              requestList={requestList}
            />
            {activePanelComponent}
            {currentChat?.$id && (
              <ChatPanel
                currentChat={currentChat}
                currentChatUserProfile={currentChatUserProfile}
                setCurrentChat={setCurrentChat}
                userProfile={userProfile}
              />
            )}
          </div>
        </>
      )}
    </>
  );

  // return (

  //   // <>
  //   //   <Sidebar activePanel={activePanel} setActivePanel={setActivePanel}/>
  //   //   {activePanelComponent}
  //   //   <ChatPanel currentChat={currentChat} userProfile={userProfile}/>
  //   // </>
  // );
}

export default UserHome;
