import logo from '../assets/exQuizit_logo.png';
import bg from '../assets/exQuizit_bg.png';
import React from 'react';
import './Homepage.css';
import Button from './Button';

function HomePage() {
  return (
    <div 
      className="HomePage" 
      style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh' }}
    >
      <div className="App-header">
        <img src={logo} width="400" height="200" alt="bunny"/> 
        
        <div className="body">
          <Button className="btn" btnTxt={'PLAY'} route="/start"/>
            <div className="footer">
                <p>Made with ❤️ by the ExQuizit Team</p>
                <p>Version 1.0.0</p>
            </div>
        </div>
        
      </div>
    </div>
  );
}

export default HomePage;