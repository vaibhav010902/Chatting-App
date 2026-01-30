import React from "react";
import styles from "./Sidebar.module.css";
import authServices from "../../appwrite/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout as authLogout } from "../../store/authSlice";

function Sidebar({ activePanel, setActivePanel, requestList, newMessages }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navbar_container}>
          <div className={styles.navbar_container_1}>
            <div className={styles.profile_container}>
              <span
                className="material-symbols-outlined"
                onClick={() => setActivePanel("Profile")}
                style={{
                  padding: "8px 5px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  backgroundColor:
                    activePanel === "Profile" ? "rgb(245,245,245)" : "white",
                  scale: activePanel === "Profile" ? "0.97" : "1",
                }}
              >
                account_circle
              </span>
            </div>
            <div className={styles.btns_container}>
              <div>
              {newMessages > 0 && <p>{newMessages}</p>}
                <span
                  className="material-symbols-outlined"
                  onClick={() => setActivePanel("Friends")}
                  style={{
                    backgroundColor:
                      activePanel === "Friends" ? "rgb(245,245,245)" : "white",
                    scale: activePanel === "Friends" ? "0.97" : "1",
                  }}
                >
                  chat
                </span>
              </div>
              <div>
                <span
                  className="material-symbols-outlined"
                  onClick={() => setActivePanel("Contacts")}
                  style={{
                    backgroundColor:
                      activePanel === "Contacts" ? "rgb(245,245,245)" : "white",
                    scale: activePanel === "Contacts" ? "0.97" : "1",
                  }}
                >
                  chat_add_on
                </span>
              </div>
              <div>
                <span
                  className="material-symbols-outlined"
                  onClick={() => setActivePanel("Groups")}
                  style={{
                    backgroundColor:
                      activePanel === "Groups" ? "rgb(245,245,245)" : "white",
                    scale: activePanel === "Groups" ? "0.97" : "1",
                  }}
                >
                  group
                </span>
              </div>
              <div>
                {requestList.length > 0 && <p>{requestList.length}</p>}
                <span
                  className="material-symbols-outlined"
                  onClick={() => setActivePanel("Requests")}
                  style={{
                    backgroundColor:
                      activePanel === "Requests" ? "rgb(245,245,245)" : "white",
                    scale: activePanel === "Requests" ? "0.97" : "1",
                  }}
                >
                  person_add
                  
                </span>
              </div>
            </div>
          </div>
          <div className={styles.navbar_container_2}>
            <div>
              <span
                className="material-symbols-outlined"
                onClick={() => setActivePanel("Settings")}
                style={{
                  backgroundColor:
                    activePanel === "Settings" ? "rgb(245,245,245)" : "white",
                  scale: activePanel === "Settings" ? "0.97" : "1",
                }}
              >
                settings
              </span>
            </div>
            <div>
              <span
                className="material-symbols-outlined"
                onClick={async () => {
                  try {
                    await authServices.logoutAccount();
                    dispatch(authLogout());
                    navigate("/");
                  } catch (error) {
                    console.log("error", error);
                  }
                }}
              >
                logout
              </span>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Sidebar;
