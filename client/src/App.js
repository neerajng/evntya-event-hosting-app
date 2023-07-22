import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'

import YellowDiv from './components/YellowDiv/YellowDiv.jsx';
import Eventya from './components/Evntya/Evntya';
import Welcome from './components/Welcome/Welcome';
import CreateEvent from './components/CreateEvent/CreateEvent';
import MyEvents from './components/MyEvents/MyEvents';
import Profile from './components/Profile/Profile';
import NavDiv from './components/NavDiv/NavDiv';
import AdDiv from './components/NavDiv/AdDiv';
import SearchEvent from './components/SearchEvent/SearchEvent';
import FilterSorts from './components/FilterSorts/FilterSorts';
import Logout from './components/SignOut/SignOut';

import Home from './pages/Homes/Home';
import UserProfile from './pages/UserProfile/UserProfile';



import {Stack} from '@mui/material';
import { WelcomeLayout } from './layouts/WelcomeLayout/WelcomeLayout.jsx';
import {SignupForm}  from './pages/Signup/SignUp.jsx';
import {OtpForm}  from './pages/Otp/Otp.jsx';
import {SigninForm} from './pages/Signin/Signin.jsx'; 
import {ForgetPasswordForm} from './pages/ForgetPassword/ForgetPassword.jsx'; 
import {ResetPasswordForm} from './pages/ForgetPassword/ResetPassword.jsx'; 

import {PrivateRoutes} from './utils/PrivateRoutes.jsx'
import {PublicRoutes} from './utils/PublicRoutes.jsx'


function App() {
  return (
    <div className="App" backgroundColor="green">
      <header className="App-header">
        <BrowserRouter>

        <Stack direction="row">     
          <Routes>
            <Route element={<PublicRoutes/>}>
            <Route path="/test" element={<WelcomeLayout />}>
              <Route path='signup' element={<SignupForm />}/>      
              <Route path='otp' element={<OtpForm />} /> 
              <Route path='signin' element={<SigninForm />}/>  
              <Route path='forget-password' element={<ForgetPasswordForm/>}/>   
              <Route path='reset-password/:id' element={<ResetPasswordForm/>}/> 
            </Route>
            </Route>
          </Routes>
        </Stack>

        <Routes>
          <Route element={<PrivateRoutes/>}>
            <Route path='/test' element={<Eventya/>}/> 
          </Route>      
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

            
            <Route path="/" element={<>
              <NavDiv/>
              <Eventya />
              <CreateEvent/>
              <MyEvents/>
              <Profile />
              <AdDiv/>
              <SearchEvent />    
              <FilterSorts/>        
              <Home />
              <Logout />              
            </>} />
            <Route path="/profile" element={<UserProfile/>}/>
            

          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
