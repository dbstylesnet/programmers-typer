 import React, { useEffect } from 'react';
import './App.css';
import { useState } from 'react';
import { saveResult, getPlayerResults, getAllPlayers, addPlayer, getPlayerStats, PlayerResult } from './database';

const  App = (): JSX.Element => {
  const [userTypeValue, setUserTypeValue] = React.useState('');
  const [shadowBoxToggle, setShadowBoxToggle] = React.useState(false);
  const [practiceTextState, setPracticeTextState] = useState('');
  const [randomTextIndex, setRandomTextIndex] = useState(0);
  const [coverage, setCoverage] = useState('');
  const [accuracyCount, setAccuracyCount] = useState(1);
  const [playerName, setPlayerName] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [playerResults, setPlayerResults] = useState<PlayerResult[]>([]);
  const [playerStats, setPlayerStats] = useState<any>(null);

  const completedText = 'Congratulations, you have completed typing test!';
  const practiceTextC = '#include <iostream> int main() {std::cout << "Hello World!"; return 0;}';
  const practiceTextJS = 'else {\n;let fact = 1;\nfor (i = 1; i <= number; i++) {\nfact *= i;\n}\nconsole.log(`The factorial \\n\n of ${number} is ${fact}.`);';
  const practiceTextJS2 = 'var x = 1;\nlet y = 1;\nif (true) {\nvar x = 2;\nlet y = 2;\n}';

  const jsTexts = [practiceTextJS, practiceTextJS2];

  useEffect(() => {
    const randomText = Math.floor(Math.random() * jsTexts.length); 
    setPracticeTextState(jsTexts[randomText]);
    setRandomTextIndex(randomText);
    
    const savedPlayer = localStorage.getItem('currentPlayer');
    if (savedPlayer) {
      setPlayerName(savedPlayer);
    }
  }, []);

  useEffect(() => {
    if (playerName) {
      const results = getPlayerResults(playerName);
      const stats = getPlayerStats(playerName);
      setPlayerResults(results);
      setPlayerStats(stats);
    }
  }, [playerName]);

  const handleTextSelection = (selection: 'first' | 'second' | 'random') => {
    let selectedText: string;
    let selectedIndex: number;

    if (selection === 'first') {
      selectedText = jsTexts[0];
      selectedIndex = 0;
    } else if (selection === 'second') {
      selectedText = jsTexts[1];
      selectedIndex = 1;
    } else {

      selectedIndex = Math.floor(Math.random() * jsTexts.length);
      selectedText = jsTexts[selectedIndex];
    }

    setPracticeTextState(selectedText);
    setRandomTextIndex(selectedIndex);
    setUserTypeValue('');
    setShadowBoxToggle(false);
    setAccuracyCount(0);
    setStartTime(null);
  };

  const handlePlayerNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value.trim();
    setPlayerName(name);
    if (name) {
      localStorage.setItem('currentPlayer', name);
      addPlayer(name);
      const results = getPlayerResults(name);
      const stats = getPlayerStats(name);
      setPlayerResults(results);
      setPlayerStats(stats);
    }
  };

  const saveTestResult = (completed: boolean) => {
    if (!playerName) return;

    const endTime = Date.now();
    const duration = startTime ? endTime - startTime : 0;
    const accuracy = userTypeValue.length > 0 
      ? ((accuracyCount / userTypeValue.length) * 100) 
      : 0;
    const progress = practiceTextState.length > 0
      ? ((userTypeValue.length / practiceTextState.length) * 100)
      : 0;

    const result: PlayerResult = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      playerName,
      textIndex: randomTextIndex,
      accuracy,
      progress,
      correctChars: accuracyCount,
      totalChars: userTypeValue.length,
      targetLength: practiceTextState.length,
      completed,
      startTime: startTime || endTime,
      endTime,
      duration,
      date: new Date().toISOString(),
    };

    saveResult(result);
    
    const results = getPlayerResults(playerName);
    const stats = getPlayerStats(playerName);
    setPlayerResults(results);
    setPlayerStats(stats);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const enteredText = event.target.value;

    if (enteredText === practiceTextState) {
      shadowBoxToggle === true ? setShadowBoxToggle(false) : setShadowBoxToggle(true)
    } else if (shadowBoxToggle === true) {
      setShadowBoxToggle(false)
    }

    setUserTypeValue(enteredText);
  }


  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const enteredText = event.target.value;
 
    if (enteredText.length === 1 && startTime === null) {
      setStartTime(Date.now());
    }

    console.log('enteredText:', enteredText);

    const compareStrings = (typed:any , target: any) => {
      let correctCount = 0;
      
      const result = typed.split("").map((char: any, index: any) => {
        if (char === target[index]) {
          correctCount++;
          console.log('char match at index', index, ':', char);
          return "correct";
        } else {
          console.log('char mismatch at index', index, ':', char, '!=', target[index]);
          return "incorrect";
        }
      });
      
      setAccuracyCount(correctCount);
      console.log('accuracyCount:', correctCount);
      
      return result;
    };

    compareStrings(enteredText, practiceTextState);

    const isCompleted = enteredText === practiceTextState;

    if (isCompleted) {
      if (!shadowBoxToggle) {
        setShadowBoxToggle(true);
        saveTestResult(true);
      }
    } else if (shadowBoxToggle === true) {
      setShadowBoxToggle(false);
    }

    setUserTypeValue(enteredText);
  }

  return (
    <div className="main-container">

      <div className='sub-header main-header'>
        <h2>Programmers typing training</h2>
      </div>  

      <div className='player-section'>
        <label htmlFor="playerName">Player Name: </label>
        <input
          id="playerName"
          type="text"
          value={playerName}
          onChange={handlePlayerNameChange}
          placeholder="Enter your name"
          style={{ marginLeft: '10px', padding: '5px' }}
        />
        <button 
          onClick={() => setShowResults(!showResults)}
          style={{ marginLeft: '10px', padding: '5px 10px' }}
        >
          {showResults ? 'Hide' : 'Show'} Results
        </button>
      </div>

      {showResults && playerName && playerStats && (
        <div className='results-section' style={{ margin: '20px 0', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <h3>Statistics for {playerName}</h3>
          <p>Total Tests: {playerStats.totalTests}</p>
          <p>Completed Tests: {playerStats.completedTests}</p>
          <p>Average Accuracy: {playerStats.averageAccuracy.toFixed(2)}%</p>
          <p>Average Progress: {playerStats.averageProgress.toFixed(2)}%</p>
          <p>Best Accuracy: {playerStats.bestAccuracy.toFixed(2)}%</p>
          
          <h4 style={{ marginTop: '15px' }}>Recent Results:</h4>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {playerResults.slice(-10).reverse().map((result) => (
              <div key={result.id} style={{ margin: '10px 0', padding: '10px', background: '#f5f5f5', borderRadius: '3px' }}>
                <p><strong>Date:</strong> {new Date(result.date).toLocaleString()}</p>
                <p><strong>Accuracy:</strong> {result.accuracy.toFixed(2)}% | <strong>Progress:</strong> {result.progress.toFixed(2)}%</p>
                <p><strong>Duration:</strong> {(result.duration / 1000).toFixed(2)}s | <strong>Completed:</strong> {result.completed ? 'Yes' : 'No'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className='sub-header statsHeader'>
        <h4>
          Accuracy: {((accuracyCount / (userTypeValue.length || 1)) * 100).toFixed(2)}% | 
          Progress: {((userTypeValue.length / (practiceTextState.length || 1)) * 100).toFixed(2)}%
        </h4>
      </div>

      <div className="text-selection-buttons">
        <button onClick={() => handleTextSelection('first')}>First Text</button>
        <button onClick={() => handleTextSelection('second')}>Second Text</button>
        <button onClick={() => handleTextSelection('random')}>Random Text</button>
      </div>

      <div className="mainTextAreas">
        <div className='sub-header'>
          <h3>Practice text:</h3>
        </div>
        <div className="textAreas">
          <textarea className='textInputs topP' onChange={handleTextareaChange} value={userTypeValue} />
          <textarea className='textInputs bottomP' value={practiceTextState}/>
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
