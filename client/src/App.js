import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'

import { WelcomeLayout } from './layouts/WelcomeLayout/WelcomeLayout.jsx';
import { AdminLayout } from './layouts/AdminLayout/AdminLayout.jsx';
import { PageLayout } from './layouts/PageLayout/PageLayout.jsx';

import {SignupForm}  from './pages/Signup/SignUp.jsx';
import {OtpForm}  from './pages/Otp/Otp.jsx';
import {SigninForm} from './pages/Signin/Signin.jsx'; 
import {ForgetPasswordForm} from './pages/ForgetPassword/ForgetPassword.jsx'; 
import {ResetPasswordForm} from './pages/ForgetPassword/ResetPassword.jsx'; 

import { MyEvents } from './pages/MyEvents/MyEvents.jsx';
import { EventDetails } from './pages/MyEvents/EventDetails.jsx'; 
import { ErrorPage } from './pages/ErrorPage/ErrorPage.jsx'; 
import { EditEvent } from './pages/MyEvents/EditEvent.jsx';
import { EditEvent2 } from './pages/MyEvents/EditEvent2.jsx';
import { BookingConfirmation } from './pages/ErrorPage/BookingConfirmation.jsx';
import { Bookings } from './pages/Bookings/Bookings.jsx';

import { Checkout } from './components/Payment/Checkout.jsx';

import { CreateEvent } from './pages/CreateEvent/CreateEvent.jsx';
import { UpdateEvent } from './pages/CreateEvent/UpdateEvent.jsx';
import { Profile } from './pages/Profile/Profile.jsx';
import { AdminDashboard } from './pages/Admin/AdminDashboard.jsx';
import { AdminProfile } from './pages/Admin/AdminProfile.jsx'
import { AdminUsers } from './pages/Admin/AdminUsers.jsx'
import { HomePage } from './pages/HomePage/HomePage.jsx';

import { PrivateRoutes } from './utils/authRoutes/PrivateRoutes.jsx'
import { PublicRoutes } from './utils/authRoutes/PublicRoutes.jsx'; 
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js'; 
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);
function App() {

  return (
    <div className="App" >
      <header className="App-header">
        <BrowserRouter>
        
          
          <Routes>

            <Route element={<PublicRoutes />}>            
              <Route path='/' element={<PageLayout><HomePage /> </PageLayout>} />
              <Route path="" element={<WelcomeLayout />}>
                <Route path='signup' element={<SignupForm />}/>      
                <Route path='otp' element={<OtpForm />} /> 
                <Route path='signin' element={<SigninForm />}/>  
                <Route path='forget-password' element={<ForgetPasswordForm/>}/>   
                <Route path='reset-password/:id' element={<ResetPasswordForm/>}/>
              </Route>
            </Route> 

             
            <Route element={<PrivateRoutes allowedRole="user"/>}>
              <Route path='/' element={<PageLayout/>}> 
                <Route index element={<HomePage/>}/>
                <Route path='create-event' element={<CreateEvent />} /> 
                <Route path='update-event' element={<UpdateEvent />} /> 
                <Route path='my-events' element={<MyEvents />} /> 
                <Route path='profile' element={<Profile />} /> 
                <Route path="event/:eventId" element={<EventDetails/>} />  
                <Route path="edit-event/:id" element={<EditEvent />} />    
                <Route path="edit-event-two/:id" element={<EditEvent2 />} />
                <Route path="checkout" element={<Elements stripe={stripePromise}><Checkout /></Elements>} />
                <Route path="confirmation" element={<BookingConfirmation />} /> 
                <Route path="bookings" element={<Bookings />} />            
              </Route>
            </Route>        

            
            <Route element={<PrivateRoutes allowedRole="admin"/>}>
              <Route path='/admin' element={<AdminLayout/>}> 
                <Route path='' element={<AdminDashboard />} /> 
                <Route path='users' element={<AdminUsers/>} /> 
                <Route path='events' element={<AdminProfile/>} /> 
                <Route path='profile' element={<AdminProfile/>} /> 
              </Route>
            </Route>   

            <Route path="*" element={<ErrorPage />} />
            
          </Routes>    
        
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
