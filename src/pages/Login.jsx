import React from "react";
import { Login as LoginComponent, Navbar } from "./../component/index";
import { useSelector } from "react-redux";

function Login() {
  
  return (
    <>
      <Navbar homeBtn={true}/>
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoginComponent />
      </div>
    </>
  );
}

export default Login;
