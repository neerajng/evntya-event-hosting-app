import React from 'react';
import {Button} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import toast, { Toaster } from 'react-hot-toast';

const buttonStyle = {
    borderRadius: 5,
    color: 'black',
    textTransform: 'none',
    borderColor: 'black'
  };

export const LocationButton = (props) => {
    const handleClick = () => {
        // console.log('Button clicked');
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              let { latitude, longitude } = position.coords;
    
              // console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      
              // Use the BigDataCloud Reverse Geocoding API to get the address information
              const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
              );
              const data = await response.json();
              const { locality, city, principalSubdivision, countryName } = data;
              // console.log(data)
              // console.log(`Location: ${locality}`);
              // console.log(`City: ${city}`);
              // console.log(`State: ${principalSubdivision}`);
              // console.log(`Country: ${countryName}`);
              props.onLocationChange(locality);
              props.onCityChange(city);
              props.onStateChange(principalSubdivision);
              props.onCountryChange(countryName);

              // console.log(props)
            },
            (error) => {              
              toast.error(error.message+".Please enable location and re-try");
            }
            );
        } else {
            toast.error('Geolocation is not supported by this browser');
        }
      };
      

  return (
  < >
  <Button 
  startIcon={<LocationOnIcon />} 
  onClick={handleClick}
  sx={buttonStyle}
  variant='outlined'
  >Get Current Location</Button>
    <Toaster toastOptions={{ sx: { padding: '10px', fontSize: '14px' } }} position="top-right" />
  </>
  );
};
