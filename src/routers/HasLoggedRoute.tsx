import { getAccessToken } from '@/services/AuthenticationService';
import React from 'react'
import { useNavigate } from 'react-router-dom';

interface IProps {
  children: React.ReactNode;
}

const HasLoggedRoute: React.FC<IProps> = (props) => {
  const accessToken = getAccessToken()
  const navigate = useNavigate();
  React.useEffect(() => {

    if (accessToken) {
      navigate("/your-work");
    }
  }, [])
  return <>{props.children}</>
}

export default HasLoggedRoute
