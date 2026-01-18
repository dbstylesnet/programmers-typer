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
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const completedText = 'Congratulations, you have completed typing test! You can check your results in the results section above.';
  const practiceTextC = '#include <iostream> int main() {std::cout << "Hello World!"; return 0;}';
  const practiceTextJS = 'else {\n;let fact = 1;\nfor (i = 1; i <= number; i++) {\nfact *= i;\n}\nconsole.log(`The factorial of ${number} is ${fact}.`);';
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

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isTimerRunning) {
      interval = setInterval(() => {
        if (startTime) {
          setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
        }
      }, 100);
    } else {
      setElapsedTime(0);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerRunning, startTime]);

  const handleStartTimer = () => {
    setIsTimerRunning(true);
    setStartTime(Date.now());
    setElapsedTime(0);
    setUserTypeValue('');
    setShadowBoxToggle(false);
    setAccuracyCount(0);
  };

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
    setIsTimerRunning(false);
    setElapsedTime(0);
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
 
    if (!isTimerRunning && enteredText.length > 0) {
      return;
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
        setIsTimerRunning(false);
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
        />
        <button 
          onClick={() => setShowResults(!showResults)}
        >
          {showResults ? 'Hide' : 'Show'} Results
        </button>
      </div>

      {showResults && playerName && playerStats && (
        <div className='results-section'>
          <h3>Statistics for {playerName}</h3>
          <p>Total Tests: {playerStats.totalTests}</p>
          <p>Completed Tests: {playerStats.completedTests}</p>
          <p>Average Accuracy: {playerStats.averageAccuracy.toFixed(2)}%</p>
          <p>Average Progress: {playerStats.averageProgress.toFixed(2)}%</p>
          <p>Best Accuracy: {playerStats.bestAccuracy.toFixed(2)}%</p>
          
          <h4>Recent Results:</h4>
          <div>
            {playerResults.slice(-10).reverse().map((result) => (
              <div key={result.id}>
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
          Timer: {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')} | 
          Accuracy: {((accuracyCount / (userTypeValue.length || 1)) * 100).toFixed(2)}% | 
          Progress: {((userTypeValue.length / (practiceTextState.length || 1)) * 100).toFixed(2)}%
        </h4>
      </div>

      <div className="start-button-container">
        <button 
          onClick={handleStartTimer} 
          disabled={isTimerRunning || !practiceTextState}
          className="start-button"
        >
          {isTimerRunning ? 'Timer Running...' : 'Start Typing Test'}
        </button>
      </div>

      <div className="text-selection-buttons">
        <button onClick={() => handleTextSelection('first')} disabled={isTimerRunning}>First Text</button>
        <button onClick={() => handleTextSelection('second')} disabled={isTimerRunning}>Second Text</button>
        <button onClick={() => handleTextSelection('random')} disabled={isTimerRunning}>Random Text</button>
      </div>

      <div className="mainTextAreas">
        <div className='sub-header'>
          <h3>Practice text:</h3>
        </div>
        <div className="textAreas">
          <textarea 
            className='textInputs topP' 
            onChange={handleTextareaChange} 
            value={userTypeValue}
            disabled={!isTimerRunning}
          />
          <textarea className='textInputs bottomP' value={practiceTextState} readOnly/>
          {shadowBoxToggle && userTypeValue === practiceTextState && practiceTextState.length > 0 && (
            <h4 className="congratz sub-header">
              Congratulations, you have completed typing test! <br />
              You can check your results in the results section below.
            </h4>
          )}
        </div>
      </div>  
    </div>
  );
}

export default App;
