import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from 'react-redux'
import "./index.css";
import App from "./App.jsx";
import store from "./store/store.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home, Login, Signup} from './pages/index.js'
import Profile from "./component/Profile/Profile.jsx";
import AuthLayout from "./component/AuthLayout.jsx";


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
