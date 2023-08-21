import React,{useEffect} from 'react';
import axiosInstance from '../../utils/axiosInterceptors/axiosConfig'
import { useDispatch } from 'react-redux';
import { setAllEvents, setSearchResults } from '../../redux/eventsSlice';
import { DiscoverEvents } from '../../components/DiscoverEvents/DiscoverEvents';
import { PopularEvents } from '../../components/PopularEvents/PopularEvents';
import { Box } from '@mui/material';

export const HomePage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    function fetchEvents() {
      axiosInstance
        .get('/all-events')
        .then((response) => {
          const data = response.data;          
          dispatch(setAllEvents(data));
          // dispatch(setSearchResults(data));
          console.log(data)
        })
        .catch((error) => console.log(error));
    }
  
    fetchEvents();
  }, [dispatch]);

  return (
    <Box>
      <DiscoverEvents />
      <PopularEvents />
    </Box>
  );
};
