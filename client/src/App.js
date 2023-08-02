import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'

import YellowDiv from './components/YellowDiv/YellowDiv.jsx';
import Eventya from './components/Evntya/Evntya';
import Welcome from './components/Welcome/Welcome';

import { WelcomeLayout } from './layouts/WelcomeLayout/WelcomeLayout.jsx';
import { NavbarLayout } from './layouts/NavbarLayout/NavbarLayout.jsx';
import { AdminLayout } from './layouts/AdminLayout/AdminLayout.jsx';
import {SignupForm}  from './pages/Signup/SignUp.jsx';
import {OtpForm}  from './pages/Otp/Otp.jsx';
import {SigninForm} from './pages/Signin/Signin.jsx'; 
import {ForgetPasswordForm} from './pages/ForgetPassword/ForgetPassword.jsx'; 
import {ResetPasswordForm} from './pages/ForgetPassword/ResetPassword.jsx'; 

import {DiscoverEvents} from './components/DiscoverEvents/DiscoverEvents.jsx'
import {PopularEvents} from './components/PopularEvents/PopularEvents.jsx'
import { MyEvents } from './pages/MyEvents/MyEvents.jsx';
import { EventDetails } from './pages/MyEvents/EventDetails.jsx'; 
import { ErrorPage } from './pages/ErrorPage/ErrorPage.jsx'; 

import { CreateEvent } from './pages/CreateEvent/CreateEvent.jsx';
import { UpdateEvent } from './pages/CreateEvent/UpdateEvent.jsx';
import { Profile } from './pages/Profile/Profile.jsx';
import { AdminDashboard } from './pages/Admin/AdminDashboard.jsx';
import { AdminProfile } from './pages/Admin/AdminProfile.jsx'
import { AdminUsers } from './pages/Admin/AdminUsers.jsx'

import {PrivateRoutes} from './utils/PrivateRoutes.jsx'
import {PublicRoutes} from './utils/PublicRoutes.jsx'


function App() {
  return (
    <div className="App" >
      <header className="App-header">
        <BrowserRouter>

          <Routes>

            <Route element={<PublicRoutes />}>
              <Route path="/test" element={<WelcomeLayout />}>
                <Route path='signup' element={<SignupForm />}/>      
                <Route path='otp' element={<OtpForm />} /> 
                <Route path='signin' element={<SigninForm />}/>  
                <Route path='forget-password' element={<ForgetPasswordForm/>}/>   
                <Route path='reset-password/:id' element={<ResetPasswordForm/>}/>
              </Route>
            </Route> 

             
            <Route element={<PrivateRoutes allowedRole="user"/>}>
              <Route path='/test' element={<NavbarLayout/>}> 
                <Route path="" element={ <><DiscoverEvents/><PopularEvents/></>}/>
                <Route path='create-event' element={<CreateEvent />} /> 
                <Route path='update-event' element={<UpdateEvent />} /> 
                <Route path='my-events' element={<MyEvents />} /> 
                <Route path='profile' element={<Profile />} /> 
                <Route path="event/:eventId" element={<EventDetails/>} />              
              </Route>
            </Route>        

            
            <Route element={<PrivateRoutes allowedRole="admin"/>}>
              <Route path='/admin' element={<AdminLayout/>}> 
                <Route path='' element={<AdminDashboard />} /> 
                <Route path='profile' element={<AdminProfile/>} /> 
                <Route path='users' element={<AdminUsers/>} /> 
                <Route path='events' element={<AdminProfile/>} /> 
              </Route>
            </Route>   

            <Route path="*" element={<ErrorPage />} />


          </Routes>    
  
        

        

          <Routes>
            <Route element={<PublicRoutes/>}>
            <Route path="/signup" element={<>
              <YellowDiv />
              <Eventya />
              <Welcome />
            </>} />
            <Route path="/signin" element={<>
              <YellowDiv />
              <Eventya />
              <Welcome />
            </>} />
            <Route path="/otp" element={<>
              <YellowDiv />
              <Eventya />
              <Welcome />
            </>} />
            </Route>
            

          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
