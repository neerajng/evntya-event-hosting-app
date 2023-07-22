import React from 'react';
import './SearchEvent.css';
import myImage from '../../assets/images/searchImage.png';

const SearchEvent = () => {
  return (
    <div className="container">      
        <p className="text">Discover Events <br />
        Happening in <br />
        Your City</p>
        <select className="combo-box">
        <option value="option1">Detect Location</option>
        <option value="option2">Trivandrum</option>
        </select>
        <select className="combo-box2">
        <option value="option1">All Events</option>
        <option value="option2">EvenType1</option>
        </select>
        <button className="explore-button">
        Explore
        </button>
        <img src={myImage} alt="search" className="srch-img" />
      </div>
  );
};

export default SearchEvent;
