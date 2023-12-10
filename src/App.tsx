import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

const  App = (): JSX.Element => {
  const [userTypeValue, setUserTypeValue] = React.useState('');
  const [shadowBoxToggle, setShadowBoxToggle] = React.useState(false);

  // const practiceText = 'clude';
  const completedText = 'Congratulations, you have completed typing test!';
  const practiceTextC = '#include <iostream> int main() {std::cout << "Hello World!"; return 0;}';
  const practiceTextJS = 'else {\n;let fact = 1;\nfor (i = 1; i <= number; i++) {\nfact *= i;\n}\nconsole.log(`The factorial \\n\n of ${number} is ${fact}.`);';
  const practiceText = '';
  // const practiceTextJS = 'else {\nlet fact = 1;\nfor (i = 1; i <= number; i++) {\nfact *= i;\n}\nconsole.log(`The factorial of ${number} is ${fact}.`);\n}';

  useEffect(() => {

  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const enteredText = event.target.value;

    if (enteredText === practiceText) {
      shadowBoxToggle === true ? setShadowBoxToggle(false) : setShadowBoxToggle(true)
    } else if (shadowBoxToggle === true) {
      setShadowBoxToggle(false)
    }

    setUserTypeValue(enteredText);
  }

  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const enteredText = event.target.value;

    if (enteredText === practiceText) {
      shadowBoxToggle === true ? setShadowBoxToggle(false) : setShadowBoxToggle(true)
    } else if (shadowBoxToggle === true) {
      setShadowBoxToggle(false)
    }

    setUserTypeValue(enteredText);
  }

  return (
    <div className="main-container">

      <div className='sub-header main-header'>
        <h2>Programmers typing training</h2>
      </div>  

      <div className="mainTextAreas">
        {/* <div className='inputsArea'>
          <input className='typeInputs userTextInput' placeholder="Start typing here" onChange={handleInputChange} value={userTypeValue} />
        </div> */}

        <div className='sub-header'>
          <h3>Practice text:</h3>
        </div>
        <div className="textAreas">
          <textarea className='textInputs topP' onChange={handleTextareaChange} value={userTypeValue} />
          <textarea className='textInputs bottomP' value={practiceText}/>
          <h4 className="congratz sub-header">
            {shadowBoxToggle
              ? completedText
              : ''
          }</h4>
        </div>
      </div>  
    </div>
  );
}

export default App;
