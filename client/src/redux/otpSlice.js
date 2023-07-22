
// signupSlice.js

import { createSlice } from '@reduxjs/toolkit';

const otpSlice = createSlice({
    name: 'otp',
    initialState: {
      response: null,
    },
    reducers: {
      OtpResponse: (state, action) => {
        state.response = action.payload;
      },
    },
  });

  // this is for dispatch
  export const { OtpResponse } = otpSlice.actions;

  // this is for configureStore
  export default otpSlice.reducer;
  
  