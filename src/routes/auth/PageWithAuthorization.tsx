import React, { useContext } from "react";
import { AuthContext, AuthContextValue } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

export type PageWithAuthorizationProp = {
  destination: string;
  children: React.ReactNode;
  authorized?: boolean;
};

/*
 * PageWithAuthorization Component
 * This component is used to restrict a page from being accessed,
 * @param destination url to redirect to
 * @param children data to show
 * @param authorized whether if the user is authorized or not to be redirected
 * */
export default function PageWithAuthorization({
  destination,
  children,
  authorized,
}: PageWithAuthorizationProp) {
  const { user } = useContext(AuthContext) as AuthContextValue;
  const isLoggedIn = user != null;
  if (authorized) {
    if (isLoggedIn) {
      return children;
    }
    return <Navigate to={destination} replace />;
  }
  if (isLoggedIn) {
    return <Navigate to={destination} replace />;
  }
  return children;
}
