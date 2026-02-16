import React, { use, useEffect, useState } from "react";
import styles from "./ContactProfilePanel.module.css";
import { Button, ContactTile, Loading } from "../../component";
import { useForm } from "react-hook-form";
import profileServices from "../../appwrite/profileServices";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../store/userProfileSlice";
import relationshipServices from "../../appwrite/relationshipServices";
import { ID } from "appwrite";
import { setActivePanel} from "../../store/activePanelSlice";

function ContactProfilePanel() {
  const dispatch = useDispatch();
  const previousPanel = useSelector(state => state.activePanel.previous);
  const contactId = useSelector(state => state.activePanel.contact_id);
  const [profile, setProfile] = useState(null);
  const userProfile = useSelector(state => state.userprofile.userProfile);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileServices.getProfile(contactId);
        setProfile(response.documents[0])
      } catch (error) {
        console.error("Select User")
      }
    }
    fetchProfile();
  })
  
  
  async function handleAddToFriend(){
    await relationshipServices.getRelationshipId({
      fromUserId: userProfile?.$id,
      toUserId: profile?.$id
    }).then(async (res) => {
      await relationshipServices.friendRequestAccept(res);
    }).catch(async (err) => {
      await relationshipServices.friendRequest({
        relationshipId: ID.unique()+Date.now(),
        fromUserId: userProfile?.$id,
        toUserId: profile?.$id
      })
    })
    const response = await profileServices.updateProfile({
      userId: userProfile.$id,
      friends: Array.from(new Set([...userProfile.friends, profile.$id]))
    })
    dispatch(updateProfile(response))
  }
  
  async function handleUnfriend(){
    await relationshipServices.getRelationshipId({
      fromUserId: userProfile?.$id,
      toUserId: profile?.$id
    }).then(async (res) => {
      const response = await relationshipServices.getRelationship({relationshipId: res});
      if(response.status === "pending"){
        await relationshipServices.removeRelationship(res)
        console.log("Relationship removed")
      }else{
        await relationshipServices.updateRelationship({
          relationshipId: res,
          type: "pending"
        })
        console.log("Relationship updated to pending")
      }
      // relationshipServices.updateRelationship({
      //   relationshipId: res,
      //   status: "pending"
      // })
    })
    const response = await profileServices.updateProfile({
      userId: userProfile.$id,
      friends: userProfile.friends.filter(friendId => friendId !== profile.$id)
    })
    dispatch(updateProfile(response))
  }
  async function handleBlock(){
    await relationshipServices.getRelationshipId({
      fromUserId: userProfile.$id,
      toUserId: profile.$id,
    }).then((res) => {
      relationshipServices.updateRelationship({
        relationshipId: res,
        type: "block"
      })
    })
    const response = await profileServices.updateProfile({
      userId: userProfile.$id,
      block: Array.from(new Set([...userProfile.block, profile.$id]))
    })
    dispatch(updateProfile(response))
  }
  async function handleUnblock(){
    await relationshipServices.getRelationshipId({
        fromUserId: userProfile.$id,
        toUserId: profile.$id
      }).then(async (res) => {
        await relationshipServices.updateRelationship({
          relationshipId: res,
          type: "friend"
        })
      })
      const response = await profileServices.updateProfile({
        userId: userProfile.$id,
        block: userProfile.block.filter(blockId => blockId!==profile.$id)
      })
      dispatch(updateProfile(response))
  }

  const isFriend = userProfile?.friends?.includes(profile?.$id);
  const isBlocked = userProfile?.block?.includes(profile?.$id);

  const btns = [
    {
      name: "Message",
      icon: "message",
      function: null,
      status: true
    },
    {
      name: "Add to Friend",
      icon: "person_add",
      function: handleAddToFriend,
      status: !isFriend
    },
    {
      name: "Unfriend",
      icon: "person_remove",
      function: handleUnfriend,
      status: isFriend
    },
    {
      name: "Block",
      icon: "person_off",
      function: handleBlock,
      status: !isBlocked
    },
    {
      name: "Unblock",
      icon: "person",
      function: handleUnblock,
      status: isBlocked
    }
  ]

  return (
    <>
      <div className={styles.profile_panel}>
        <div className={styles.profile_panel_container}>
          <div className={styles.profile_panel_header_container}>
            <div className={styles.container_1}>
              <span className="material-symbols-outlined" onClick={() => {
                dispatch(setActivePanel(previousPanel))
              }}>arrow_back</span>
              <h1>Friends-Circle</h1>
            </div>
            <span className="material-symbols-outlined">more_vert</span>
          </div>
          <div className={styles.profile_panel_img_container}>
            <img
              src={profile?.profile_image}
              alt=""
              className={styles.user_profile_image}
            />
          </div>
          {profile ? 
          (<div className={styles.profile_panel_fields_container}>
            <div className={styles.field_container}>
              <p className={styles.name}>
                {profile?.first_name + " " + profile?.last_name}
              </p>
            </div>
            <div className={styles.field_container}>
              <p className={styles.email}>{profile?.email}</p>
            </div>
            <div className={styles.field_container}>
              <p className={styles.status}>{profile?.status}</p>
            </div>
            {/* <div className={styles.field_container}>
              <p className={styles.phone}>{profile?.phone}</p>
            </div> */}
            {/* <div className={styles.field_container}>
            <p className={styles.dob}>{profile?.dob.slice(0, 10)}</p>
            </div> */}
            <div className={styles.btn_container}>
              {btns.map((btn) => (
                btn.status && 
                  <div className={styles.msg_btn_container} key={btn.name} onClick={btn?.function}>
                    <span className="material-symbols-outlined">{btn.icon}</span>
                    <p className={styles.msg_btn}>{btn.name}</p>
                  </div>
              ))} 
            </div>
          </div>) : 
          (<Loading/>)}
        </div>
      </div>
    </>
  );
}

export default ContactProfilePanel;
