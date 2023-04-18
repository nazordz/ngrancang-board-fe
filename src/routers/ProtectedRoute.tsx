import { getAccessToken } from "@/services/AuthenticationService";
import React from "react";
import { useNavigate } from "react-router-dom";

interface IProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<IProps> = (props) => {
  const accessToken = getAccessToken()
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    }
  }, [])

  const { children } = props;
  return <>{children}</>;
};

export default ProtectedRoute;
