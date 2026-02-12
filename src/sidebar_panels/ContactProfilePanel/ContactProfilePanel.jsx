import React, { useState } from "react";
import styles from "./ContactProfilePanel.module.css";
import { Button, ContactTile } from "../../component";
import { useForm } from "react-hook-form";
import profileServices from "../../appwrite/profileServices";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../store/userProfileSlice";
import relationshipServices from "../../appwrite/relationshipServices";
import { ID } from "appwrite";
import { setActivePanel } from "../../store/activePanelSlice";

function ContactProfilePanel() {
  const profile = useSelector((state) => state.userprofile.userProfile);
  const dispatch = useDispatch();
  const previousPanel = useSelector(state => state.activePanel.previous);
  const [edit, setEdit] = useState(false);
  
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: profile?.first_name + " " + profile?.last_name,
      email: profile?.email,
      phone: profile?.phone,
      dob: profile?.dob.slice(0, 10),
      status: profile?.status,
    },
  });

  const editSubmit = async (data) => {
    setEdit((prev) => !prev);

    const response = await profileServices.updateProfile({
      userId: profile.$id,
      first_name: data.name.split(" ")[0],
      last_name: data?.name?.split(" ").slice(1).join(" "),
      email: data.email,
      phone: data.phone,
      dob: data.dob,
      status: data.status,
    });
    dispatch(updateProfile(response));
  };
  async function handleAddToFriend(){
    await relationshipServices.friendRequest({
      relationshipId: ID.unique()+Date.now(),
      fromUserId: profile.$id,
      toUserId: "",
    })
    const response = await profileServices.updateProfile({
      userId: profile.$id,
      friends: Array.from(new Set([...profile.friends, ""]))
    })
    dispatch(updateProfile(response))
  }
  async function handleBlock(){
    await relationshipServices.getRelationshipId({
      fromUserId: profile.$id,
      toUserId: "",
    }).then((res) => {
      relationshipServices.updateRelationship({
        relationshipId: res,
        type: "block"
      })
    })
    response = await profileServices.updateProfile({
      userId: profile.$id,
      block: Array.from(new Set([...profile.block, ""]))
    })
    dispatch(updateProfile(response))
  }

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
          <div className={styles.profile_panel_fields_container}>
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
              <div className={styles.msg_btn_container}>
              <span className="material-symbols-outlined">message</span>
              <p className={styles.msg_btn}>Message</p>
              </div>
              <div className={styles.add_to_friend_btn_container}>
              <span className="material-symbols-outlined">person_add</span>
              <p className={styles.msg_btn}>Add to Friend</p>
              </div>
              <div className={styles.block_btn_container}>
              <span className="material-symbols-outlined">person_off</span>
              <p className={styles.msg_btn}>Block</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ContactProfilePanel;
