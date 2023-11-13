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
  const practiceText = 'This is practice string';
  const a = 5;
  const b = 10;
  const practiceTypedText = `This is practice string `+ <span style="color: #ccc">a</span> + `${a + b} `;
  const practiceTypedWord = `This`;



  const handleTypeChange = (e)=>{
    setUserTypeValue(e.target.value);  
  }

  return (
    <div className="App">
      <header className="App-header">

        <div className="mainTextAreas">
            <div>
              <p className='paragraphs topP'>{practiceTypedWord}</p>
              <p className='paragraphs bottomP'>{practiceTypedWord}</p>
            </div>
            <div>
              <input className='paragraphs topP' value='tes' />
              <input className='paragraphs bottomP' value='test' />
            </div>
            <textarea onChange={handleTypeChange} value={userTypeValue} />
            <textarea value={userTypeValue}></textarea>
            <p className='textParagraph'>{practiceTypedText}</p>
          </div>  
      </header>
    </div>
  );
}
