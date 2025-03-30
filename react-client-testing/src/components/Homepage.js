import bunny from '../assets/bunny.png';
import React from 'react';
import './Homepage.css';
import Button from './Button';

function HomePage() {
  return (
    <div className="HomePage">
      <div className="App-header">
        <h1>exQuizit</h1>
        <img src={bunny} width="400" height="200" alt="bunny"/> 
        
        <div className="body">
          <Button className="btn" btnTxt={'PLAY'} route="/start"/>
          <Button className="btn" btnTxt={'HOW TO PLAY'}/>
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