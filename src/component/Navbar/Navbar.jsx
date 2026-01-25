import React from "react";
import styles from "./Navbar.module.css";
import { useNavigate } from "react-router-dom";

function Navbar({ homeBtn }) {
  const navigate = useNavigate();

  return (
    <nav className={styles.navbar_container}>
      <div className={styles.navbar_title_container}>
        <h1>Chat App</h1>
      </div>
      <div className={styles.navbar_btn_container}>
        {homeBtn ? (
          <button onClick={() => navigate("/")}>Home</button>
        ) : (
          <>
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/signup")}>Signup</button>
          </>
        )}
        <span className="material-symbols-outlined">power_settings_new</span>
      </div>
    </nav>
  );
}

export default Navbar;
