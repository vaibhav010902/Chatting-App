import React, { useEffect, useState } from "react";
import { ChatContact, ChatPanel, Loading, Sidebar } from "../index";
import { useSelector } from "react-redux";
import profileServices from "../../appwrite/profileServices";
import messagesService from "../../appwrite/messagesService";
import {
  ProfilePanel,
  ContactPanel,
  GroupPanel,
  SettingPanel,
} from "../../sidebar_panels/sidebar_panels";
import { Query } from "appwrite";

function UserHome() {
  const userData = useSelector((state) => state.auth.userData);

  const [userProfile, setUserProfile] = useState({});
  const [messages, setMessages] = useState([]);
  const [contact, setContact] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentChat, setCurrentChat] = useState({});
  const [activePanel, setActivePanel] = useState("Friends");
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState(null);

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
      component: <GroupPanel />,
      status: false,
    },
    {
      name: "Settings",
      component: <SettingPanel />,
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

  const getUsers = async () => {
    try {
      const response = await profileServices.getAllUsers();
      setUsers(response?.documents || []);
    } catch (error) {
      console.log("Something went wrong while getting the users");
    }
  };

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
  // console.log(friends);
  useEffect(() => {
    if (Array.isArray(friends)) {
      console.log("Friends:", friends);
      setLoading(false);
    }
  },[friends])


  return (
    <>
      {loading ? (
        <Loading/>
      ):(
        <>
          <Sidebar activePanel={activePanel} setActivePanel={setActivePanel} />
          {activePanelComponent}
          {currentChat?.$id && <ChatPanel currentChat={currentChat} userProfile={userProfile} />}
          
        </>
      ) }
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
