import axios from 'axios';
import { store } from '../../redux/store';
import { clearAuth } from '../../redux/authSlice'; 
import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

const instance = axios.create();


// Request interceptor
instance.interceptors.request.use(config => {   
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }   
    console.log(config.headers)
    return config;   
  },

  error => {  
    console.log(error)    
    return Promise.reject(error);
  }

);

// Response interceptor
instance.interceptors.response.use(function (response) {
    return response;
  },

  function (error) {    
    // Check if the user is blocked
    if (
      error.response &&
      error.response.status === 403 &&
      error.response.data.error === 'You have been blocked'
    ) {
      // Sign out the user and redirect to the sign-in page
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.clear();
      store.dispatch(clearAuth());
      history.push('/test/signin');
    }
    return Promise.reject(error);
  }

);

export default instance;
