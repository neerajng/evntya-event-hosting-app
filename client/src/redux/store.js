// store.js

import { configureStore } from '@reduxjs/toolkit';
import signupReducer from './signupSlice';
import otpReducer from './otpSlice';
import authReducer from './authSlice'

const store = configureStore({
  reducer: {
    signups: signupReducer,
    otps: otpReducer,
    auths:authReducer, 
  },
});


export default store;
