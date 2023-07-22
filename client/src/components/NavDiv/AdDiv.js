import React from 'react';

const NavDiv = () => {

    const containerStyle = {
        display: 'flex',
        width: '100%',
      };
      
    const divStyle = { 
        position: 'absolute',
        top: 106,
        left: 0,
        width: '100%',
        height: '45vh',
        backgroundColor: '#FFF000',
    };
    
    return (
      <div style={containerStyle}>
        <div style={divStyle}></div>
      </div>
    );
  };  

  export default NavDiv;