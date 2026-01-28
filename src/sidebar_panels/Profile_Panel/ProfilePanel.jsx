import React, { useState } from "react";
import styles from "./ProfilePanel.module.css";
import { Button, ContactTile } from "../../component";
import { useForm } from "react-hook-form";

function ProfilePanel({ userProfile }) {
  const [edit, setEdit] = useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: userProfile?.first_name + " "  + userProfile?.last_name,
      email: userProfile?.email,
      phone: userProfile?.phone,
      dob: userProfile?.dob.slice(0,10),
      status: userProfile?.status,
    },
  });

  const editSubmit = () => {
    setEdit(prev => !prev);

  };

  return (
    <>
      <div className={styles.profile_panel}>
        <div className={styles.profile_panel_container}>
          <div className={styles.profile_panel_header_container}>
            <h1>Chat App</h1>
          </div>
          <div className={styles.profile_panel_img_container}>
            <img src={userProfile.profile_image} alt="" className={styles.user_profile_image} />
          </div>
          <form
            className={styles.profile_panel_fields_container}
            onSubmit={handleSubmit(editSubmit)}
          >
            <div className={styles.field_container}>
              <label htmlFor="name">Name</label>
              {!edit ? (
                <p>{ userProfile?.first_name + " " + userProfile?.last_name}</p>
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
                <p>{userProfile?.email}</p>
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
                <p>{userProfile?.phone}</p>
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
                <p>{userProfile?.dob.slice(0,10)}</p>
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
                <p>{userProfile?.status}</p>
              ) : (
                <input
                  type="text"
                  id="status"
                  {...register("status", { required: true })}
                />
              )}
            </div>
            {!edit ? (
              <button type="button" onClick={() => setEdit(prev => !prev)}>
                Edit
              </button>
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
