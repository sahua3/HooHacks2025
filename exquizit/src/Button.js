import React from 'react';

function Button({btnTxt}) {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return (
    <>
    <button onClick={handleClick}>
      {btnTxt}
    </button>
    </>
    

  );
}

export default Button;