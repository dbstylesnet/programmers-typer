import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

const  App = (): JSX.Element => {
  const [userTypeValue, setUserTypeValue] = React.useState('');

  const practiceText = 'clude';
  // const practiceText = '#include <iostream> int main() {std::cout << "Hello World!"; return 0;}';

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const enteredText = event.target.value;

    if (enteredText === practiceText) {
      alert('Congratulations, you have completed typing test!');
    }
    setUserTypeValue(enteredText);
  }

  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const enteredText = event.target.value;

    if (enteredText === practiceText) {
      alert('Congratulations, you have completed typing test!');
    }
    setUserTypeValue(enteredText);
  }

  return (
    <div className="main-container">

      <div className='sub-header'>
        <h2>Programmers typing training</h2>
      </div>  

      <div className="mainTextAreas">
        <div className='inputsArea'>
          <input className='typeInputs userTextInput' placeholder="Start typing here" onChange={handleInputChange} value={userTypeValue} />
        </div>

        <div className='sub-header'>
          <h3>Practice text:</h3>
        </div>
        <div className="textAreas">
          <textarea className='textInputs topP' onChange={handleTextareaChange} value={userTypeValue} />
          <textarea className='textInputs bottomP' value={practiceText}/>
        </div>
        
      </div>  

    </div>
  );
}

export default App;
