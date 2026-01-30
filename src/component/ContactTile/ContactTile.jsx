import React, {useState} from "react";
import styles from "./ContactTile.module.css";

function ContactTile({
  contact_name,
  contact_msg,
  profile_image,
  status,
  ...props
}) {
    const [hamburgerMenuVisibility, setHamburgerMenuVisibility] = useState(false);
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
              <p>Profile</p>
              <p>Mark as read</p>
              <p>Add to Favourites</p>
              <p>Unfriend</p>
              <p>Archived</p>
              <p>Block</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactTile;
