// // 

// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import profileServices from "../appwrite/profileServices";
// import Loading from "./Loading/Loading";

// function AuthLayout({ children, isAuthenticated = true }) {
//   const navigate = useNavigate();
//   const { status, userData } = useSelector((state) => state.auth);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkAuthAndProfile = async () => {
//       // 🔒 Not logged in but page requires auth
//       if (isAuthenticated && !status) {
//         navigate("/login");
//         return;
//       }

//       // 🔓 Logged in but profile-required page
//       if (!isAuthenticated && status && userData) {
//         const profileData = await profileServices.getProfile(userData.$id);

//         if (profileData.documents.length === 0) {
//           navigate("/profile");
//           return;
//         }

//         navigate("/");
//       }

//       setLoading(false);
//     };

//     checkAuthAndProfile();
//   }, [status, userData, isAuthenticated, navigate]);

//   if (loading) return <Loading/>;

//   return <>{children}</>;
// }

// export default AuthLayout;


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
    // 🔴 Wait until Redux is initialized
    if (status === undefined) return;

    const checkAuthAndProfile = async () => {

      // 🔒 Protected route but user not logged in
      if (isAuthenticated && !status) {
        navigate("/login", { replace: true });
        return;
      }

      // 🔓 Public route but user logged in
      if (!isAuthenticated && status && userData) {
        try {
          const profileData = await profileServices.getProfile(userData.$id);

          if (profileData?.documents?.length === 0) {
            navigate("/profile", { replace: true });
            return;
          }

          navigate("/", { replace: true });
        } catch (error) {
          console.error(error);
        }
      }

      setLoading(false);
    };

    checkAuthAndProfile();
  }, [status, userData, isAuthenticated, navigate]);

  if (loading) return <Loading />;

  return <>{children}</>;
}

export default AuthLayout;
