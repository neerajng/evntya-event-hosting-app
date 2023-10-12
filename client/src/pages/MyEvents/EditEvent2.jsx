import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInterceptors/axiosConfig'
import { useParams } from 'react-router-dom';
import { UpdateEvent } from '../CreateEvent/UpdateEvent'
import toast from 'react-hot-toast';

export const EditEvent2 = () => {
  const [event, setEvent] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axiosInstance.get(`/api/event/${id}`);
        setEvent(response.data);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchEvent();
  }, [id]);

  return event ? <UpdateEvent event={event} /> : null;
};
