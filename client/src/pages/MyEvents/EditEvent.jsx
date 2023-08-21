import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInterceptors/axiosConfig'
import { useParams } from 'react-router-dom';
import { CreateEvent } from '../../pages/CreateEvent/CreateEvent';

export const EditEvent = () => {
  const [event, setEvent] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axiosInstance.get(`/event/${id}`);
        console.log(response.data);
        setEvent(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEvent();
  }, [id]);

  return event ? <CreateEvent event={event} /> : null;
};
