import { useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import authServices from "./appwrite/auth";
import { login, logout, setAuthChecked } from "./store/authSlice";
import profileServices from "./appwrite/profileServices";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const userData = await authServices.getCurrentUser();
        if (userData) {
          dispatch(login({ userData}));
        } else {
          dispatch(logout());
        }
      } catch {
        console.log("Error while restoring session");
        dispatch(logout());
      } finally {
        dispatch(setAuthChecked());
      }
    };

    restoreSession();
  }, []);

  return <Outlet />;
}

export default App;
