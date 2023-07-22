import React from 'react';
import './FilterSorts.css';

const FilterSorts = () => {
  return (
    <div className="filter-sorts">
      <h1 className="title">Popular Events in your City</h1>
      <div className="buttons">
        <button className="button">All</button>
        <button className="button">Today</button>
        <button className="button">Tomorrow</button>
        <button className="button">This weekend</button>
      </div>
    </div>
  );
};

export default FilterSorts;
