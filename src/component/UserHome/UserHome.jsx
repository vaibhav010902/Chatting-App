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
  const [newMessages, setNewMessages] = useState([]);
  const [unseenMsg, setUnseenMsg] = useState([]);


  const panels = [
    {
      name: "Profile",
      component: <ProfilePanel userProfile={userProfile} />,
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

  const getMessageStatus = async () => {
    if (!userProfile?.$id) return;
    try {
      const response = await messagesService.getMessagesStatus({recieverId: userProfile?.$id, status: "delivered"});
      setUnseenMsg(response);
    } catch (error) {
      console.log("Something went wrong while getting the messages");
    }
  };
  // useEffect(() => {
  //   const fetchNewMessages = async () => {
  //     if (!friends?.length) {
  //       setNewMessages([]);
  //       return;
  //     }
  
  //     const deliveredSenders = await getMessageStatus();
  //     if (!deliveredSenders?.size) {
  //       setNewMessages([]);
  //       return;
  //     }
  
  //     let newMsgFriends = friends.filter(friend =>
  //       deliveredSenders.has(friend.$id)
  //     );
  //     newMsgFriends = newMsgFriends.map(friend => friend.$id)
  
  //     setNewMessages(newMsgFriends);
  //   };
  
  //   fetchNewMessages();
  // }, [friends]);
  
  useEffect(() => {
    getMessageStatus();
  },[currentChat])

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
    unseenMsg.length && setNewMessages(filteredFriends.map(friend => 
      unseenMsg.find(msg => String(msg.senderId) === String(friend.$id))
    ))
  }, [users, userProfile]);

  useEffect(() => {
    getUserProfile();
  }, [userData]);



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
    if (!currentChat?.$id) return;

    const channel = `databases.${conf.appwriteDatabaseID}.collections.${conf.appwriteMessagesCollectionID}.documents`;

    const unsubscribe = client.subscribe(channel, (response) => {
      if (
        response.events.includes("databases.*.collections.*.documents.*.create")
      ) {
        // setMessages((prev) => [...prev, response.payload]);
        getMessageStatus();
        getFriendRequestList();
        getUsers();
        console.log("Websocket!")
      }
    });

    return () => {
      unsubscribe(); // ✅ always a function
    };
  }, [currentChat?.$id]);

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
              newMessages={newMessages.length}
            />
            {activePanelComponent}
            {currentChat?.$id && (
              <ChatPanel
                currentChat={currentChat}
                setCurrentChat={setCurrentChat}
                userProfile={userProfile}
                unseenMsg={unseenMsg}
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
