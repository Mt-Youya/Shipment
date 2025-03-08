import React from "react";
// import { Navigate } from "react-router-dom";
// import useCurrentUserStore from "../store/current-user";

const Auth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  // const [user, accessToken] = useCurrentUserStore((state) => [state.user, state.accessToken]);

  // if (!accessToken || !user) {
  //   return <Navigate to="/login" />;
  // }
  return <>{children}</>;
};

export default Auth;
