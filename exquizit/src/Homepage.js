import logoTemp from './assets/templogo.jpeg'
import bunny from './assets/bunny.png';
import React from 'react';
import './Homepage.css';
import Button from './Button';

function HomePage() {
  return (
    <div className="HomePage">
      <div className="App-header">
        <img src={bunny} width="400" height="200" /> 

        <div className="body">
          <Button btnTxt={'PLAY'} route="/Quiz"/>
          <Button btnTxt={'HOW TO PLAY'}/>
            <div className="footer">
                <p>Made with ♡ by the ExQuizit Team</p>
            </div>
        </div>
        
      </div>
    </div>
  );
}

export default HomePage;
