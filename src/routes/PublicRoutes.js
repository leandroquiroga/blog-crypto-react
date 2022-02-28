import React from 'react'
import { Navigate } from 'react-router-dom';
import { useAuth } from './../hooks/useAuth';

export const PublicRoutes = ({children}) => {

  const { user } = useAuth();

  return (
    
    (!user) ? children : <Navigate to={'/'} />
  )
}
