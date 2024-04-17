import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Root from "./routes/Root";
import Error from "./routes/Error";
import Login from "./routes/auth/Login";
import Profile from "./routes/auth/Profile";  
import AuthProvider from "./context/AuthContext";
import PageWithAuthorization from "./routes/auth/PageWithAuthorization";
import Register from "./routes/auth/Register ";
import EditProfile from "./routes/auth/EditProfile";
import Dashboard from "./routes/Dashboard";
import ShoppingCart from "./routes/ShoppingCart";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Dashboard />
      },
      {
        path: "/login",
        element: (
          <PageWithAuthorization destination="/profile">
            <Login />
          </PageWithAuthorization>
        ),
      },
      {
        path: "/register",
        element: (
          <PageWithAuthorization destination="/profile">
            <Register />
          </PageWithAuthorization>
        ),
      },
      {
        path: "/profile",
        element: (
          <PageWithAuthorization destination="/login" authorized>
            <Profile />
          </PageWithAuthorization>
        ),
      },
      {
        path: "/profile/edit",
        element: (
          <PageWithAuthorization destination="/login" authorized>
            <EditProfile></EditProfile>
          </PageWithAuthorization>
        ),
      },
      {
        path: "/cart",
        element: <ShoppingCart />
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);
