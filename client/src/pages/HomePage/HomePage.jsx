import React,{useEffect, useState} from 'react';
import axiosInstance from '../../utils/axiosInterceptors/axiosConfig'
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setAllEvents, setSearchResults } from '../../redux/eventsSlice';
import { DiscoverEvents } from '../../components/DiscoverEvents/DiscoverEvents';
import { PopularEvents } from '../../components/PopularEvents/PopularEvents';
import { Box } from '@mui/material';

export const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    function fetchEvents() {
      axiosInstance
        .get('/api/all-events')
        .then((response) => {
          const data = response.data;          
          dispatch(setAllEvents(data));
          // dispatch(setSearchResults(data));
          setIsLoading(false);
          console.log("data")
        })
        .catch((error) => console.log(error));
    }
  
    fetchEvents();
  }, [dispatch]);

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box>
      <DiscoverEvents />
      <PopularEvents />
    </Box>
  );
};
