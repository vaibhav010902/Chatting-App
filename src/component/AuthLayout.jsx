// 

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import profileServices from "../appwrite/profileServices";
import Loading from "./Loading/Loading";

function AuthLayout({ children, isAuthenticated = true }) {
  const navigate = useNavigate();
  const { status, userData } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndProfile = async () => {
      // 🔒 Not logged in but page requires auth
      if (isAuthenticated && !status) {
        navigate("/login");
        return;
      }

      // 🔓 Logged in but profile-required page
      if (!isAuthenticated && status && userData) {
        const profileData = await profileServices.getProfile(userData.$id);

        if (profileData.documents.length === 0) {
          navigate("/profile");
          return;
        }

        navigate("/");
      }

      setLoading(false);
    };

    checkAuthAndProfile();
  }, [status, userData, isAuthenticated, navigate]);

  if (loading) return <Loading/>;

  return <>{children}</>;
}

export default AuthLayout;
