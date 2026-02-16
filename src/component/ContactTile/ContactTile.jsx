import React, {Component, useEffect, useRef, useState} from "react";
import styles from "./ContactTile.module.css";
import { useDispatch, useSelector } from "react-redux";
import relationshipServices from "../../appwrite/relationshipServices";
import profileServices from "../../appwrite/profileServices";
import { updateProfile } from "../../store/userProfileSlice";
import ContactProfilePanel from "../../sidebar_panels/ContactProfilePanel/ContactProfilePanel";
import { ID } from "appwrite";
import { resetUnreadByUser } from "../../store/messageStatusSlice";
import messagesService from "../../appwrite/messagesService";
import { setActivePanel, setActivePanelContactId } from "../../store/activePanelSlice";
function ContactTile({
  contact_id,
  contact_name,
  contact_msg,
  profile_image,
  status,
  ...props
}) {
    const [hamburgerMenuVisibility, setHamburgerMenuVisibility] = useState(false);
    const userProfile = useSelector(state => state.userprofile.userProfile);
    const dispatch = useDispatch();
    const menuRef = useRef(null);

    useEffect(() => {
      if(!hamburgerMenuVisibility) return;

      const handleClickOutside = (e) => {
        if(menuRef.current && !menuRef.current.contains(e.target)){
          setHamburgerMenuVisibility(false);
        }
      };

      const handleEsc = (e) => {
        if(e.key === "Escape"){
          setHamburgerMenuVisibility(false);
        }
      }

      document.addEventListener("mousedown",handleClickOutside);
      document.addEventListener("keydown",handleEsc);

      return () => {
        document.removeEventListener("mousedown",handleClickOutside);
        document.removeEventListener("keydown",handleEsc);
      }
    },[hamburgerMenuVisibility,setHamburgerMenuVisibility])

    const handleProfileBtn = async (e) => {
      e.stopPropagation();
      dispatch(setActivePanel("Contact_Profile_Panel"));
      dispatch(setActivePanelContactId(contact_id));
    }

    const handleMarkAsReadBtn = async (e) => {
      e.stopPropagation();
      const response = await messagesService.getMessagesSendByUser({
        activeChatId: contact_id, 
        userId: userProfile.$id
      })
      response.forEach(async (msg) => {
        await messagesService.updateMessageStatus({
          msgId: msg.$id,
          status: "seen"
        })
      })
      dispatch(resetUnreadByUser(contact_id));
    }

    const handleAddToFavouriteBtn = async (e) => {
      e.stopPropagation();
      const response = await profileServices.updateProfile({
        userId: userProfile.$id,
        favourites: [...userProfile.favourites,contact_id]
      })
      dispatch(updateProfile(response))
    }
    const handleRemoveFromFavouriteBtn = async (e) => {
      e.stopPropagation();
      const response = await profileServices.updateProfile({
        userId: userProfile.$id,
        favourites: userProfile.favourites.filter(favouriteId => favouriteId!==contact_id)
      })
      dispatch(updateProfile(response))
    }

    const handleAddToFriendBtn = async (e) => {
      e.stopPropagation();
      await relationshipServices.friendRequest({
        relationshipId: ID.unique() + Date.now(),
        fromUserId: userProfile.$id,
        toUserId: contact_id,
      });
      const response = await profileServices.updateProfile({
        userId: userProfile.$id,
        friends: Array.from(new Set([...userProfile.friends,contact_id]))
      })
      dispatch(updateProfile(response))
    }
    const handleUnfriendBtn = async (e) => {
      e.stopPropagation();
      await relationshipServices.getRelationshipId({
      fromUserId: userProfile?.$id,
      toUserId: profile?.$id
      }).then(async (res) => {
        const response = await relationshipServices.getRelationship({relationshipId: res});
        if(response.status === "pending"){
          await relationshipServices.removeRelationship(res)
        }else{
          await relationshipServices.updateRelationship({
            relationshipId: res,
            type: "pending"
          })
        }
      })
      const response = await profileServices.updateProfile({
        userId: userProfile.$id,
        friends: userProfile.friends.filter(friendId => friendId !== contact_id)
      })
      dispatch(updateProfile(response))
    }

    const handleArchivedBtn = async (e) => {
        e.stopPropagation();
        const response = await profileServices.updateProfile({
          userId: userProfile.$id,
          archived: Array.from(new Set([...userProfile.archived,contact_id]))
        })
        dispatch(updateProfile(response))
    }
    const handleUnarchivedBtn = async (e) => {
        e.stopPropagation();
        const response = await profileServices.updateProfile({
          userId: userProfile.$id,
          archived: userProfile.archived.filter(archivedId => archivedId!==contact_id)
        })
        dispatch(updateProfile(response))
    }
    
    const handleBlockBtn = async (e) => {
      e.stopPropagation();
      await relationshipServices.getRelationshipId({
        fromUserId: userProfile.$id,
        toUserId: contact_id
      }).then((res) => {
        relationshipServices.updateRelationship({
          relationshipId: res,
          type: "block"
        })
      })
      const response = await profileServices.updateProfile({
        userId: userProfile.$id,
        block: Array.from(new Set([...userProfile.block,contact_id]))
      })
      dispatch(updateProfile(response))
    }
    const handleUnblockBtn = async (e) => {
      e.stopPropagation();
      await relationshipServices.getRelationshipId({
        fromUserId: userProfile.$id,
        toUserId: contact_id
      }).then(async (res) => {
        await relationshipServices.updateRelationship({
          relationshipId: res,
          type: "friend"
        })
      })
      const response = await profileServices.updateProfile({
        userId: userProfile.$id,
        block: userProfile.block.filter(blockId => blockId!==contact_id)
      })
      dispatch(updateProfile(response))
    }

    const isFriend = userProfile?.friends?.includes(contact_id) ?? false;
    const isFavourite = userProfile?.favourites?.includes(contact_id) ?? false;
    const isArchived = userProfile?.archived?.includes(contact_id) ?? false;
    const isBlocked = userProfile?.block?.includes(contact_id) ?? false;

    const hamburgerBtns = [
      {
        name: "Profile",
        function: handleProfileBtn,
        status: !!contact_id
      },
      {
        name: "Mark as read",
        function: handleMarkAsReadBtn,
        status: isFriend
      },
      {
        name: "Add to Favourites",
        function: handleAddToFavouriteBtn,
        status: !isFavourite
      },
      {
        name: "Remove from Favourites",
        function: handleRemoveFromFavouriteBtn,
        status: isFavourite
      },
      {
        name: "Add to Friend List",
        function: handleAddToFriendBtn,
        status: !isFriend
      },
      {
        name: "Unfriend",
        function: handleUnfriendBtn,
        status: isFriend
      },
      {
        name: "Archived",
        function: handleArchivedBtn,
        status: !isArchived
      },
      {
        name: "Unarchived",
        function: handleUnarchivedBtn,
        status: isArchived
      },
      {
        name: "Block",
        function: handleBlockBtn,
        status: !isBlocked
      },
      {
        name: "Unblock",
        function: handleUnblockBtn,
        status: isBlocked
      },
    ] 
  return (
    <div className={styles.contact_tile_container} {...props}>
      <div className={styles.contact_tile_main_container}>
        <div className={styles.contact_profile_container}>
          <div className={styles.contact_image}>
            <img
              className="material-symbols-outlined"
              style={{
                width: "45px",
                height: "45px",
                border: "1px solid black",
                borderRadius: "50%",
                alignContent: "center",
                objectFit: "cover",
              }}
              src={
                profile_image
                  ? profile_image
                  : "https://in.pinterest.com/pin/660832945362593473/"
              }
            />
            {/* account_circle */}
            {/* </img>  */}
          </div>
          <div className={styles.contact_name_and_message_container}>
            <p className={styles.contact_name}>{contact_name}</p>
            <p className={styles.contact_msg}>{contact_msg}</p>
          </div>
        </div>
        <div className={styles.contact_tile_btn_container}>
          {status && <p className={styles.indicator}></p>}
          <span className="material-symbols-outlined" onClick={(e) => {
            e.stopPropagation();
            setHamburgerMenuVisibility(prev => !prev)}}>more_vert</span>
          {hamburgerMenuVisibility && (
            <div className={styles.hamburger_menu_panel} ref={menuRef}>
              {hamburgerBtns.map(btn => (
                btn.status && <p key={btn.name} onClick={btn.function}>{btn.name}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactTile;
