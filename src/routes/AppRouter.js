import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'
import { Dashboard } from '../components/Dashboard/Dashboard';
import { ForgotPassword } from '../components/Login/ForgotPassword';
import { Login } from '../components/Login/Login';
import { Register } from '../components/Login/Register';
import { Portfolio } from '../components/Portfolio/Portfolio';
import { AuthProvaider } from '../context/authContext';
import { StorageProviader } from '../context/storageContext';
import { HomePage } from './../HomePage';
import { PrivateRoutes } from './PrivateRoutes';
import { PublicRoutes } from './PublicRoutes';

export const AppRouter = () => {
  return (
    <BrowserRouter>      
      <AuthProvaider>
        <StorageProviader>
          <Routes>
    
            <Route path='/login' element={
              <PublicRoutes>
                <Login />
              </PublicRoutes>
            } />
            <Route path='/login/reset-password' element={
              <PublicRoutes>
                <ForgotPassword/>
              </PublicRoutes>           
            } />
            <Route path='/register' element={
              <PublicRoutes>
                <Register />
              </PublicRoutes>
            } />
            <Route path='/' element={
              <PrivateRoutes>
                <HomePage />
              </PrivateRoutes>
            } />
            <Route path='/dashboard' element={
              <PrivateRoutes>
                <Dashboard />
              </PrivateRoutes>
            } />

            <Route path='/portfolio' element={
              <PrivateRoutes>
                <Portfolio />
              </PrivateRoutes>
            } />

          </Routes>

        </StorageProviader>
      </AuthProvaider>
    </BrowserRouter>
  )
}
