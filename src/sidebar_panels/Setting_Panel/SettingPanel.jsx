import styles from "./SettingPanel.module.css";
import React, { useState } from "react";
import { Button, ContactTile } from "../../component";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

function SettingPanel() {
  const userProfile = useSelector((state) => state.userprofile.userProfile);

  return (
    <>
      <div className={styles.settings_panel}>
        <div className={styles.settings_panel_container}>
          <div className={styles.settings_panel_header_container}>
            <h1>Settings</h1>
          </div>
          <div className={styles.settings_panel_profile_container}>
          <div className={styles.settings_panel_profile}>
            <img
              src={userProfile?.profile_image}
              alt=""
              className={styles.user_profile_image}
            />
            <div className={styles.profile_content_container}>
                <p className={styles.profile_firstname}>{userProfile?.first_name}</p>
                <p className={styles.profile_status}>
                  {userProfile?.status}
                </p>
              </div>
          </div>
          </div>
          <div className={styles.settings_panel_content_container}>
            <div className={styles.settings_panel_setting_tile}>
              <span className="material-symbols-outlined">settings</span>
              <div className={styles.setting_tile_content_container}>
                <p className={styles.setting_tile_heading}>Change Password</p>
                <p className={styles.setting_tile_text}>
                  This is used to change the font-size of everything...
                </p>
              </div>
            </div>
            <div className={styles.settings_panel_setting_tile}>
              <span className="material-symbols-outlined">settings</span>
              <div className={styles.setting_tile_content_container}>
                <p className={styles.setting_tile_heading}>Theme</p>
                <p className={styles.setting_tile_text}>
                  This is used to change the font-size of everything...
                </p>
              </div>
            </div>
            <div className={styles.settings_panel_setting_tile}>
              <span className="material-symbols-outlined">settings</span>
              <div className={styles.setting_tile_content_container}>
                <p className={styles.setting_tile_heading}>Wallpaper</p>
                <p className={styles.setting_tile_text}>
                  This is used to change the font-size of everything...
                </p>
              </div>
            </div>
            <div className={styles.settings_panel_setting_tile}>
              <span className="material-symbols-outlined">settings</span>
              <div className={styles.setting_tile_content_container}>
                <p className={styles.setting_tile_heading}>Font Size</p>
                <p className={styles.setting_tile_text}>
                  This is used to change the font-size of everything...
                </p>
              </div>
            </div>
            <div className={styles.settings_panel_setting_tile}>
              <span className="material-symbols-outlined">settings</span>
              <div className={styles.setting_tile_content_container}>
                <p className={styles.setting_tile_heading}>Blocked</p>
                <p className={styles.setting_tile_text}>
                  This is used to change the font-size of everything...
                </p>
              </div>
            </div>
            <div className={styles.settings_panel_setting_tile}>
              <span className="material-symbols-outlined">settings</span>
              <div className={styles.setting_tile_content_container}>
                <p className={styles.setting_tile_heading}>Settings</p>
                <p className={styles.setting_tile_text}>
                  This is used to change the font-size of everything...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SettingPanel;
