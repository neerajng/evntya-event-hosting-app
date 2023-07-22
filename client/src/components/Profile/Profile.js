import React ,{useState, useEffect} from 'react';
import axios from 'axios';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import './Profile.css';

const Profile = () => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/profile');
        setUser(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserProfile();
  }, []);


  return (
    <div style={{cursor:'pointer'}}> 
    <div className="profile"  >
      <div style={{ display: 'inline-block' }}>Profile</div>
    </div>
    <div className="icon">
      <AccountBoxIcon style={{ display: '', marginLeft: '-32px',fontSize: '200%' }} />
    </div>
    </div>
  );
};

export default Profile;
