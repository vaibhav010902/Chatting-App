import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import authServices from "./appwrite/auth";
import { login, logout, setAuthChecked } from "./store/authSlice";

function App() {
  const dispatch = useDispatch();

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
