import React from 'react'
import { Navigate,Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

export const PublicRoutes = () => {

    const authState = useSelector((state)=>{

      return  state.auths.authState
    })
    
    console.log("public",authState ,'manali')

  return (authState===undefined ||authState === null ? <Outlet/> :<Navigate to='/test'/>)//
}

