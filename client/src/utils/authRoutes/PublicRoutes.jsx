import React from 'react'
import { Navigate,Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

export const PublicRoutes = () => {

    const authState = useSelector((state)=>{ return  state.auths.authState })
    
    console.log("Public",authState)

  if (!authState || !authState.token) {
    return <Outlet />;
  } else if (authState.role === 'admin') {
    return <Navigate to="/admin" />;
  } else {
    <Navigate to="/" />;
    return <Outlet />;
  }
}

