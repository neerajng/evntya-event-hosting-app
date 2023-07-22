import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

export const PrivateRoutes = () => {
    
    const authState = useSelector((state)=>{

        return  state.auths.authState
    })

    console.log("protected",authState,'kulu')  

  return (authState ? <Outlet/> :<Navigate to='/test/signin'/>)
}

