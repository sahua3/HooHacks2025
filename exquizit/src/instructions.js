import bunny from './assets/bunny.png';
import React from 'react';
import './Instructions.css';
import Button from './Button';

function Instructions() {
  return (
    <div className="HomePage">
      <div className="App-header">
        <img src={bunny} width="400" height="200" /> 
        <div className="body">
          <Button btnTxt={'GO BACK'} route="/"/>
            <div className="footer">
                <p>Made with ♡ by the exQuizit Team</p>
            </div>
        </div>
        
      </div>
    </div>
  );
}

export default Instructions;
