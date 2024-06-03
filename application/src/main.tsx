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
import Register from "./routes/auth/Register";
import EditProfile from "./routes/auth/EditProfile";
import Dashboard from "./routes/Dashboard";
import ShoppingCart from "./routes/ShoppingCart";
import Checkout from "./routes/Checkout";
import Summary from "./routes/Summary";
import ChangePassword from "./routes/auth/ChangePassword";
import Welcome from "./routes/Welcome";
import ProductDetailPage from "./routes/product-detail/PoductDetailPage";
import FollowingList from "./routes/Following";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/login",
        element: (
          <PageWithAuthorization destination="/welcome">
            <Login />
          </PageWithAuthorization>
        ),
      },
      {
        path: "/register",
        element: (
          <PageWithAuthorization destination="/welcome">
            <Register />
          </PageWithAuthorization>
        ),
      },
      {
        path: "/welcome",
        element: <PageWithAuthorization destination="/login" authorized>
          <Welcome />
        </PageWithAuthorization>
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
        path: "/profile/change-password",
        element: (
          <PageWithAuthorization destination="/login" authorized>
            <ChangePassword />
          </PageWithAuthorization>
        ),
      },
      {
        path: "/following",
        element: (
          <PageWithAuthorization destination="/login" authorized>
            <FollowingList />
          </PageWithAuthorization>
        ),
      },
      {
        path: "/cart",
        element: <ShoppingCart />,
      },
      {
        path: "/checkout",
        element: <Checkout />,
      },
      {
        path: "/summary",
        element: <Summary />,
      },
      {
        path: "/product/:id",
        element: <ProductDetailPage />,
      },
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
