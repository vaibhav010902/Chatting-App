import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from 'react-redux'
import "./index.css";
import App from "./App.jsx";
import store from "./store/store.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home, Login, Signup } from './pages/index.js'
import { ChatPanel, Loading } from "./component/index.js";
import Profile from "./component/Profile/Profile.jsx";
import AuthLayout from "./component/AuthLayout.jsx";
import Root from "./component/Root.jsx";
import { SettingPanel } from "./sidebar_panels/sidebar_panels.js";
// import UserHome from "./component/index.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "/login",
        element: (
          <AuthLayout isAuthenticated={false}>
            <Login/>
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout isAuthenticated={false}>
            <Signup/>
          </AuthLayout>
        )
      },
      {
        path: "/profile",
        element: (
          <AuthLayout isAuthenticated={true}>
            <Profile/>
          </AuthLayout>
        )
      },
      {
        path: "/loading",
        element: <Loading/>
      },
      {
        path: "/sidebar",
        element: <Root/>
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  /* </StrictMode> */
);
