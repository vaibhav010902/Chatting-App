import React, {Component, useState} from "react";
import styles from "./ContactTile.module.css";
import { useDispatch, useSelector } from "react-redux";
import relationshipServices from "../../appwrite/relationshipServices";
import profileServices from "../../appwrite/profileServices";
import { updateProfile } from "../../store/userProfileSlice";
import { compose } from "@reduxjs/toolkit";

function ContactTile({
  contact_id,
  contact_name,
  contact_msg,
  profile_image,
  status,
  ...props
}) {
    const [hamburgerMenuVisibility, setHamburgerMenuVisibility] = useState(false);
    const profile = useSelector(state => state.userprofile.userProfile);
    const dispatch = useDispatch();  

    const handleProfileBtn = async () => {
      console.log("Profile...")
    }

    const handleMarkAsReadBtn = async () => {
      console.log("Mark as read...")
    }

    const handleAddToFavouriteBtn = async () => {
      const response = await profileServices.updateProfile({
        userId: profile.$id,
        favourites: [...profile.favourites,contact_id]
      })
      dispatch(updateProfile(response))
    }
    const handleRemoveFromFavouriteBtn = async () => {
      console.log("Remove from Favourites...")
    }

    const handleAddToFriendBtn = async () => {
      console.log("Add To Friend...")
    }
    const handleUnfriendBtn = async () => {
      await profileServices.updateProfile({
        userId: profile.$id,
        friends: profile.friends.filter(friendId => friendId !== contact_id)
      })
      dispatch(updateProfile(response))
    }

    const handleArchivedBtn = async () => {
        const response = await profileServices.updateProfile({
          userId: profile.$id,
          archived: Array.from(new Set([...profile.archived,contact_id]))
        })
        dispatch(updateProfile(response))
    }
    const handleUnarchivedBtn = async () => {
      console.log("Remove from Archived...")
    }
    
    const handleBlockBtn = async () => {
      console.log("Block...")
    }

    const isFriend = profile?.friends?.includes(contact_id) ?? false;
    const isFavourite = profile?.favourites?.includes(contact_id) ?? false;
    const isArchived = profile?.archived?.includes(contact_id) ?? false;

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
        status: true
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
          <span className="material-symbols-outlined" onClick={() => setHamburgerMenuVisibility(prev => !prev)}>more_vert</span>
          {hamburgerMenuVisibility && (
            <div className={styles.hamburger_menu_panel}>
              {/* <p onClick={handleProfileBtn}>Profile</p>
              <p onClick={handleMarkAsReadBtn}>Mark as read</p>
              <p onClick={handleAddToFavouriteBtn}>Add to Favourites</p>
              <p onClick={handleRemoveFromFavouriteBtn}>Remove from Favourites</p>
              <p onClick={handleAddToFriendBtn}>Add to Friend List</p>
              <p onClick={handleUnfriendBtn}>Unfriend</p>
              <p onClick={handleArchivedBtn}>Archived</p>
              <p onClick={handleUnarchivedBtn}>Unarchived</p>
              <p onClick={handleBlockBtn}>Block</p> */}
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
