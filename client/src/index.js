import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from '@mui/material/styles';
import {theme} from './assets/themes/theme'

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';

import { CssBaseline } from '@mui/material';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ReactErrorBoundary } from './utils/errorBoundary/ReactErrorBoundary';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
<ReactErrorBoundary>
  <GoogleOAuthProvider clientId= {process.env.REACT_APP_CLIENT_ID}>
    <ThemeProvider theme={theme}> 
      <CssBaseline/>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </ThemeProvider>
  </GoogleOAuthProvider>
  </ReactErrorBoundary>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
