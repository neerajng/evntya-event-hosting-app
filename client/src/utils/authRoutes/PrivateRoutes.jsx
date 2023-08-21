import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

export const PrivateRoutes = ({ allowedRole }) => {
    
    const authState = useSelector((state)=>{ return  state.auths.authState }) 

  if (!authState || !authState.token) {
    
    return <Navigate to="/test/signin" />;

  } else if (authState.role === allowedRole) {
    
    return <Outlet/>;

  } else {
    
    return <Navigate to="/error" />;
  }
}

