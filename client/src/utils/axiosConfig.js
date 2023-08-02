import axios from 'axios';
import { showSpinner, hideSpinner } from '.././components/Spinner/Spinner';
import { clearAuth } from '../redux/authSlice'; 
import store from '../redux/store';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    // Show spinner
    showSpinner();
    return config;
  },
  function (error) {
    // Hide spinner
    hideSpinner();
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Hide spinner
    hideSpinner();
    return response;
  },
  function (error) {
    // Hide spinner
    hideSpinner();
    // Check if the user is blocked
    if (
      error.response &&
      error.response.status === 403 &&
      error.response.data.error === 'You have been blocked'
    ) {
      // Sign out the user and redirect to the sign-in page
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      store.dispatch(clearAuth());
      history.push('/test/signin');
    }

    return Promise.reject(error);
  }
);
