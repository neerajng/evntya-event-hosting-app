import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Eventya from '../../components/Evntya/Evntya';
import CreateEvent from '../../components/CreateEvent/CreateEvent';
import MyEvents from '../../components/MyEvents/MyEvents';
import Profile from '../../components/Profile/Profile';
import NavDiv from '../../components/NavDiv/NavDiv';
import SignOut from '../../components/SignOut/SignOut';


const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/api/profile');
        setUser(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div>
      {user ? (
        <div>
          <h2>User Profile</h2>
          <p>Name: {user.firstName} {user.lastName}</p>
          <p>Email: {user.email}</p>
          {/* Add additional user profile information as needed */}
        </div>
      ) : (   <>
              <NavDiv/>
              <Eventya />
              <CreateEvent/>
              <MyEvents/>
              <Profile />
              <SignOut /> 
        <p>Loading user profile...</p>
        </>
      )}
    </div>
  );
};

export default UserProfile;
