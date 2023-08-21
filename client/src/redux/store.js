import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import signupReducer from './signupSlice';
import otpReducer from './otpSlice';
import authReducer from './authSlice'
import eventsReducer from './eventsSlice'

const eventsPersistConfig = {
  key: 'events',
  storage,
};

const rootReducer = {
  signups: signupReducer,
  otps: otpReducer,
  auths: authReducer, 
  events: persistReducer(eventsPersistConfig, eventsReducer) // Only persist eventsReducer
};

export const store = configureStore({
  reducer: rootReducer,
});

export const persistor = persistStore(store);
