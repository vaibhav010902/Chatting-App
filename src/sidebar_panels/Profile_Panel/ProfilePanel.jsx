import React, { useState } from "react";
import styles from "./ProfilePanel.module.css";
import { Button, ContactTile } from "../../component";
import { useForm } from "react-hook-form";
import profileServices from "../../appwrite/profileServices";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../store/userProfileSlice";

function ProfilePanel({ userProfile, setUserProfile }) {
  const profile = useSelector(state => state.userprofile.userProfile);
  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: profile?.first_name + " "  + profile?.last_name,
      email: profile?.email,
      phone: profile?.phone,
      dob: profile?.dob.slice(0,10),
      status: profile?.status,
    },
  });

  const editSubmit = async (data) => {
    setEdit(prev => !prev);
    
    const response = await profileServices.updateProfile({
      userId: profile.$id,
      first_name: data.name.split(" ")[0],
      last_name: data?.name?.split(" ").slice(1).join(" ")      ,
      email: data.email,
      phone: data.phone,
      dob: data.dob,
      status: data.status,
    })
    dispatch(updateProfile(response))
  };

  return (
    <>
      <div className={styles.profile_panel}>
        <div className={styles.profile_panel_container}>
          <div className={styles.profile_panel_header_container}>
            <h1>Chat App</h1>
          </div>
          <div className={styles.profile_panel_img_container}>
            <img src={profile?.profile_image} alt="" className={styles.user_profile_image} />
          </div>
          <form
            className={styles.profile_panel_fields_container}
            onSubmit={handleSubmit(editSubmit)}
          >
            <div className={styles.field_container}>
              <label htmlFor="name">Name</label>
              {!edit ? (
                <p>{ profile?.first_name + " " + profile?.last_name}</p>
              ) : (
                <input
                  type="text"
                  id="name"
                  {...register("name", { required: true })}
                />
              )}
            </div>
            <div className={styles.field_container}>
              <label htmlFor="email">Email</label>
              {!edit ? (
                <p>{profile?.email}</p>
              ) : (
                <input
                  type="email"
                  id="email"
                  {...register("email", {
                    required: true,
                    validate: {
                      matchPattern: (value) =>
                        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                          value
                        ) || "Invalid email address",
                    },
                  })}
                />
              )}
            </div>
            <div className={styles.field_container}>
              <label htmlFor="phone">Phone</label>
              {!edit ? (
                <p>{profile?.phone}</p>
              ) : (
                <input
                  type="number"
                  id="phone"
                  {...register("phone", {
                    required: true,
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Phone number must be 10 digits",
                    },
                  })}
                />
              )}
            </div>
            <div className={styles.field_container}>
              <label htmlFor="dob">DOB</label>
              {!edit ? (
                <p>{profile?.dob.slice(0,10)}</p>
              ) : (
                <input
                  type="date"
                  id="dob"
                  {...register("dob", { required: true })}
                />
              )}
            </div>
            <div className={styles.field_container}>
              <label htmlFor="status">Status</label>
              {!edit ? (
                <p>{profile?.status}</p>
              ) : (
                <input
                  type="text"
                  id="status"
                  {...register("status", { required: true })}
                />
              )}
            </div>
            {!edit ? (
              <span className={styles.edit_btn} onClick={() => setEdit(prev => !prev)}>
                Edit
              </span>
            ) : (
              <button type="submit">Save</button>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export default ProfilePanel;
