// store.js

import { configureStore } from '@reduxjs/toolkit';
import signupReducer from './signupSlice';
import otpReducer from './otpSlice';
import authReducer from './authSlice'
import userAuthreducer from '../features/auth/UserAuth'

const store = configureStore({
  reducer: {
    signups: signupReducer,
    otps: otpReducer,
    auths:authReducer,
    userAuth:userAuthreducer,
  },
});


export default store;
