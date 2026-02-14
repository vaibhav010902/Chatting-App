import React, { useEffect } from "react";
import {Home as HomeComponent, UserHome} from "./../component/index";
import { useSelector } from "react-redux";

function Home() {
  const authStatus = useSelector((state) => state.auth.status);
  // if user is logged in then show home page else show login scree
  return !authStatus ? <HomeComponent /> : <UserHome/>;
}

export default Home;
