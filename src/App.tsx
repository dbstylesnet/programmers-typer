import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

interface typedInterface {
  placeholder?: string;
  onChange: (event: InputEvent) => void;
}

export default function App(props: typedInterface) {
  const [userTypeValue, setUserTypeValue] = React.useState('');
  const [savedTypedValue, setSavedTypedValue] = React.useState('');
  const [practiceTypeString, setpracticeTypeString] = useState('This is practice text');
  const practiceText = 'This is practice string This is practice string This is practice string This is practice string This is practice string';
  const a = 5;
  const b = 10;
  const practiceTypedText = `This is practice string `+ <span style="color: #ccc">a</span> + `${a + b} `;
  const practiceTypedWord = `This`;
  const practiceTypedLetter = `T`;



  const handleTypeChange = (e)=>{
    setUserTypeValue(e.target.value);  
  }

  return (
    <div className="App">
      <header className="App-header">
        {/* <textarea onChange={handleTypeChange(InputEvent)}/>
        <textarea value={userTypeValue} /> */}
          <div className='sub-header'>
            <h2>Programmers typing training</h2>
          </div>  
        <div className="mainTextAreas">
          {/* <div>
            <p className='paragraphs topP'>{practiceTypedWord}</p>
            <p className='paragraphs bottomP'>{practiceTypedWord}</p>
          </div> */}
          <div className='inputsArea'>
            <input className='typeInputs userTextInput' placeholder="Start typing here" onChange={handleChange} value={userTypeValue} />
          </div>
          <div className='sub-header'>
            <h3>Practice text:</h3>
          </div>
          <div className="textAreas">
            <textarea className='textInputs topP'  onChange={handleChange} value={userTypeValue} />
            <textarea className='textInputs bottomP'  value={practiceText}></textarea>
          </div>
        </div>  
      </header>
    </div>
  );
}
