import { createSlice } from "@reduxjs/toolkit";


const initialState ={
    authState: JSON.parse(localStorage.getItem('token')) ? JSON.parse(localStorage.getItem('token')):null
};

  
const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers: {
        setAuth: (state) => {
          state.authState = JSON.parse(localStorage.getItem('token'));
        },
        clearAuth: (state) => {
          state.authState = null;
        },
    },
})
// this is for dispatch
export const { setAuth, clearAuth } = authSlice.actions;

// this is for configureStore
export default authSlice.reducer;