import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInterceptors/axiosConfig'
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CardActionArea,
  Grid,
  Typography,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab
} from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import slugify from 'slugify';
import { Container } from '@mui/system';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <>{children}</>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


export const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [value, setValue] = useState(0);
  const maxDescriptionLength = 100;

  const toastStyle = {
    padding: '10px',
    fontSize: '14px',
  }; 

  const navigate = useNavigate();

  const handleCardClick = (event) => {
    const slug = slugify(event.name.toString(), { lower: true, strict: true });
    console.log(slug)
    navigate(`/event/${slug}`, { state: { id: event._id } });
  };
  const handleEditClick = (event) => {
    // Handle the edit event
    navigate(`/edit-event/${event._id}`);
    console.log(`Edit event: ${event._id}`);
  };
  const handleCancelClick = (event) => {
    setSelectedEvent(event); 
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleConfirm = () => {
    if (selectedEvent) {
      axiosInstance
        .post(`/api/cancel-event/${selectedEvent._id}`)
        .then((response) => {
          // Handle the successful response
          console.log(response.data);
          toast.loading('Event is being cancelled');
  
          setTimeout(() => {
            navigate(0);
            toast.success(response.data.message);
          }, 4000);
        })
        .catch((error) => {
          console.error(error);
        });
      setOpen(false);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get('/api/my-events');
        setEvents(response.data);
        console.log(response.data)
      } catch (error) {
        console.error(error);
        toast.error(error.response.data.message)
      }
    };
    fetchEvents();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box mt={2}  >      
      <Typography variant="h4" align="center" sx={{ fontWeight: 500, fontFamily: 'cursive' }} >
        My Events
      </Typography>
      <Box ml={10} display="flex" sx={{bgcolor: '', alignItems: 'center', borderBottom: 1, borderColor: 'divider', flexWrap: 'wrap'}} mt={1}>
        <Box sx={{ flexGrow: 1 }} >
          <Tabs value={value} onChange={handleChange} aria-label="event tabs" textColor="secondary" indicatorColor="secondary">
              <Tab label="Upcoming Events" {...a11yProps(0)}/>
              <Tab label="Past Events" {...a11yProps(1)}/>
          </Tabs>
        </Box>
        <Box display="inline-flex" gap={2} pr={3} 
        sx={{ flexWrap: 'wrap' ,justifyContent: 'flex-end'}}>        
            <TextField label="Search" variant="outlined" size="small"/>
            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel id="demo-select-small-label">Sort By</InputLabel>  
                <Select labelId="demo-select-small-label"
                id="demo-select-small"
                // value={}
                label="Sort By"
                // onChange={}
                >
                  <MenuItem value="date">Date</MenuItem>            
              </Select>
            </FormControl>
        </Box>
      </Box>
      
      <CustomTabPanel value={value} index={0}>
        <Container sx={{ py: 4 }} maxWidth="lg" >
          <Grid container spacing={3} >
          {events.length > 0 ? (
            events.map((event) => (
              <Grid item key={event._id} xs={12} sm={6} md={4} >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    opacity: event.canceled ? 0.5 : 1,
                    pointerEvents: event.canceled ? 'none' : 'auto',
                    position:event.canceled ? 'relative' : 'none'
                  }}
                  
                >
                <CardActionArea>
                {event.canceled && <DoDisturbIcon sx={{ color: 'red', position: 'absolute', width: "100%", height: "100%" }} />}
              
                  <CardMedia
                    component="img"
                    sx={{ height: 140 }}
                    image={event.image}
                    alt={event.name}
                    onClick={() => handleCardClick(event)}
                  />
                  <CardContent  onClick={() => handleCardClick(event)}>

                    <Typography gutterBottom variant="h6" component="div">
                      {event.name}
                    </Typography>
                    {/* <Typography>Start Time: {new Date(event.startTime).toLocaleString()}</Typography>
                    <Typography>End Time: {new Date(event.endTime).toLocaleString()}</Typography> */}
                    <Typography>Category: {event.category}</Typography>
                    <Typography>
                      Description:{' '}
                      {event.description.length > maxDescriptionLength
                        ? event.description.slice(0, maxDescriptionLength) + '...'
                        : event.description}
                    </Typography>
                  </CardContent>
                  </CardActionArea>
                  
                  <CardActions sx={{ justifyContent: 'space-between' , px:4,pb:2}} >
                  <Button
                    size="big"
                    variant="outlined"
                    onClick={() => handleEditClick(event)}
                    startIcon={<EditIcon />}
                    sx={{ color: 'green', borderColor: 'green',borderRadius:5,mr: 1, width: 120 }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="big"
                    variant="outlined"
                    onClick={() => handleCancelClick(event)}
                    startIcon={<CancelIcon />}
                    sx={{ color: 'red', borderColor: 'red',borderRadius:5, ml: 1, width: 120 }}
                  >
                    Cancel
                  </Button>
                </CardActions>
                
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="h5">
              Sorry, no upcoming events available.              
            </Typography>
            ) 
          }
          </Grid>
          
        </Container>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1} >
      <Container sx={{ py: 4 }} maxWidth="lg"  >
        <Grid container spacing={3}  >
        <Typography variant="h5">No past events yet.</Typography>
        </Grid>
      </Container>  
      </CustomTabPanel>

      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText>Are you sure you want to cancel this event?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={handleConfirm}>Yes</Button>
        </DialogActions>
      </Dialog>
      
      <Toaster
        toastOptions={{
          style: toastStyle,
        }}
        position="top-right"
      />
    </Box>
  );
};

