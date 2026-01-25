import React from "react";
import { Navbar, Signup as SignupComponent } from "./../component/index";

function Signup() {
  return (
    <>
      <Navbar homeBtn={true} />
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SignupComponent />
      </div>
    </>
  );
}

export default Signup;
