import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { hasToken } from "../utils/storage.ts";

function PrivateRoute({ config, children }) {
  const token = hasToken();

  useEffect(() => {
    document.title = config?.label;
  }, []);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

export default PrivateRoute;
