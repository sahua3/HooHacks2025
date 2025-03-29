import React from 'react';
import { useNavigate } from 'react-router-dom';

function Button({ btnTxt, route }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (route) {
      navigate(route); // Navigate to the specified route
    } else {
      alert('Button clicked!');
    }
  };

  return (
    <button onClick={handleClick}>
      {btnTxt}
    </button>
  );
}

export default Button;
