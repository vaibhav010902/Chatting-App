import React from "react";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

function Home() {
  

  return (
    <>
      <div className={styles.home}>
        <Navbar homeBtn={false}/>
        <div className={styles.home_container}>
          <h1>FRIENDS</h1>
          <h1>CIRCLE</h1>
          {/* <Login/> */}
        </div>
      </div>
    </>
  );
}

export default Home;
