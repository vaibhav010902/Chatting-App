import styles from "./SettingPanel.module.css";
import React, { useRef, useState } from "react";
import { Button, ContactTile } from "../../component";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setActivePanel } from "../../store/activePanelSlice";
import storageServices from "../../appwrite/storage";
import { ID } from "appwrite";
import { setChatTheme, setChatWallpaper } from "../../store/settingSlice";
import settingServices from "../../appwrite/settingServices";

function SettingPanel() {
  const userProfile = useSelector((state) => state.userprofile.userProfile);
  const chatSettings = useSelector(state => state.settings)

  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const fontsizesliderRef = useRef(null);
  const [show, setShow] = useState("");
  const [wallpaperFile, setWallpaperFile] = useState(null);

  const handleSliderSelector = (e) => {
    
    console.log(e)
  }
  

  const handleInputClick = () => {
    inputRef.current.click();
  };
  const handleInputChange = async () => {
    const file = inputRef.current.files[0];
    setWallpaperFile(file?.name);
  };
  const handleUploadWallpaper = async () => {
    const file = inputRef.current.files[0];
    await storageServices
      .uploadFile({
        fileID: ID.unique(),
        file: file,
      })
      .then((res) => {
        const file = res.replace("preview", "view") + "&mode=admin";
        dispatch(setChatWallpaper(file));
        settingServices.updateSettings({
          userId: userProfile.$id,
          wallpaper: file,
        });
      });
    setWallpaperFile("");
  }

  const handleThemeSettings = async (theme) => {
    dispatch(setChatTheme(theme));
    await settingServices.updateSettings({
      userId: userProfile.$id,
      theme: theme,
    });
    setShow("");
  };

  const handleFontSizeSettings = async (fontsize) => {
    dispatch(setChatTheme(fontSize));
    await settingServices.updateSettings({
      userId: userProfile.$id,
      fontsize: fontsize,
    });
    setShow("");
  };

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
                <p className={styles.profile_firstname}>
                  {userProfile?.first_name}
                </p>
                <p className={styles.profile_status}>{userProfile?.status}</p>
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

            <div
              className={styles.settings_panel_setting_tile}
              onClick={() => setShow("theme")}
            >
              <span className="material-symbols-outlined">settings</span>
              <div className={styles.setting_tile_content_container}>
                <p className={styles.setting_tile_heading}>Theme</p>
                <p className={styles.setting_tile_text}>
                  This is used to change the font-size of everything...
                </p>
              </div>
            </div>
            {show == "theme" && (
              <div className={styles.settings_btn_panel}>
                <div className={styles.theme_btn_header}>
                  <p className={styles.theme_btn_header_heading}>
                    Select Theme
                  </p>
                  <p className={styles.theme_btn_header_theme_indicator}>
                    {chatSettings?.chatTheme}
                  </p>
                  <span
                    className="material-symbols-outlined"
                    onClick={() => setShow("")}
                  >
                    close
                  </span>
                </div>
                <div className={styles.theme_btn_container}>
                  <button onClick={() => handleThemeSettings("Light")}>
                    Light
                  </button>
                  <button onClick={() => handleThemeSettings("Dark")}>Dark</button>
                  <button onClick={() => handleThemeSettings("System")}>System</button>
                </div>
              </div>
            )}

            <div
              className={styles.settings_panel_setting_tile}
              onClick={() => setShow("wallpaper")}
            >
              <span className="material-symbols-outlined">settings</span>
              <div className={styles.setting_tile_content_container}>
                <p className={styles.setting_tile_heading}>Wallpaper</p>
                <p className={styles.setting_tile_text}>
                  This is used to change the font-size of everything...
                </p>
              </div>
            </div>
            {show == "wallpaper" && (
              <div className={styles.settings_btn_panel}>
                <div className={styles.theme_btn_header}>
                  <p className={styles.theme_btn_header_heading}>Wallpaper</p>
                  <span
                    className="material-symbols-outlined"
                    onClick={() => setShow("")}
                  >
                    close
                  </span>
                  {/* <p className={styles.theme_btn_header_theme_indicator}>Light</p> */}
                </div>
                <div className={styles.wallpaper_btn_container}>
                  <button onClick={handleInputClick}>Select Wallpaper</button>
                  <div className={styles.wallpaper_upload_container}>
                    <input
                      type="file"
                      hidden
                      ref={inputRef}
                      onChange={handleInputChange}
                    />
                    <p className={styles.wallpaper_file_name}>
                      {wallpaperFile}
                    </p>
                    <button onClick={handleUploadWallpaper}>Upload Wallpaper</button>
                  </div>
                </div>
              </div>
            )}

            <div
              className={styles.settings_panel_setting_tile}
              onClick={() => setShow("fontsize")}
            >
              <span className="material-symbols-outlined">settings</span>
              <div className={styles.setting_tile_content_container}>
                <p className={styles.setting_tile_heading}>Font Size</p>
                <p className={styles.setting_tile_text}>
                  This is used to change the font-size of everything...
                </p>
              </div>
            </div>
            {show == "fontsize" && (
              <div className={styles.settings_btn_panel}>
                <div className={styles.font_size_btn_header}>
                  <p className={styles.font_size_btn_header_heading}>
                    Font Size
                  </p>
                  <p className={styles.font_size_btn_header_theme_indicator}>
                    Light
                  </p>
                  <span
                    className="material-symbols-outlined"
                    onClick={() => setShow("")}
                  >
                    close
                  </span>
                </div>
                <div className={styles.font_size_btn_container}>
                  <div className={styles.font_size_slider_btn}>
                    <p className={styles.font_size_btn}>
                      <p>S</p>
                    </p>
                    <p className={styles.font_size_lines}></p>
                    <p className={styles.font_size_btn}>
                      <p>XS</p>
                    </p>
                    <p className={styles.font_size_lines}></p>
                    <p className={styles.font_size_btn}>
                      <p>M</p>
                    </p>
                    <p className={styles.font_size_lines}></p>
                    <p className={styles.font_size_btn}>
                      <p>XM</p>
                    </p>
                    <p className={styles.font_size_lines}></p>
                    <p className={styles.font_size_btn}>
                      <p>L</p>
                    </p>
                    <p className={styles.font_size_lines}></p>
                    <p className={styles.font_size_btn}>
                      <p>XL</p>
                    </p>
                    <p className={styles.font_size_slider_btn_selector} ref={fontsizesliderRef} onClick={handleSliderSelector}></p>
                  </div>
                  <button>Set Font Size</button>
                </div>
              </div>
            )}

            <div
              className={styles.settings_panel_setting_tile}
              onClick={() => dispatch(setActivePanel("Blocked"))}
            >
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
