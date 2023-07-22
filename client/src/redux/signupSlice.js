// signupSlice.js

import { createSlice } from '@reduxjs/toolkit';

const signupSlice = createSlice({
  name: 'signup',
  initialState: {
    response: null,
  },
  reducers: {
    SignupResponse: (state, action) => {
      state.response = action.payload;
    },
  },
});

// this is for dispatch
export const { SignupResponse } = signupSlice.actions;

// this is for configureStore
export default signupSlice.reducer;
