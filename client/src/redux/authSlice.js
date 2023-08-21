import { createSlice } from "@reduxjs/toolkit";


const initialState ={
    authState: {
      token: JSON.parse(localStorage.getItem('token')) ? JSON.parse(localStorage.getItem('token')):null,
      role: JSON.parse(localStorage.getItem('role')) ? JSON.parse(localStorage.getItem('role')):null, 
  }
};
  
const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers: {
        setAuth: (state) => {
          state.authState.token = JSON.parse(localStorage.getItem('token')) ? JSON.parse(localStorage.getItem('token')):null
          state.authState.role = JSON.parse(localStorage.getItem('role')) ? JSON.parse(localStorage.getItem('role')): null;
        },
        clearAuth: (state) => {
          state.authState.token = null;
          state.authState.role = null;
        },
    },
})

// this is for dispatch
export const { setAuth, clearAuth } = authSlice.actions;

// this is for configureStore
export default authSlice.reducer;