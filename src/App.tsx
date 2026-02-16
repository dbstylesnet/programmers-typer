 import React, { useEffect, useRef } from 'react';
import './App.css';
import { useState } from 'react';
import { saveResult, getPlayerResults, getAllPlayers, addPlayer, getPlayerStats, PlayerResult } from './database';

const bubbleSort = (arr: number[]) => {
  const a = [...arr];
  for (let i = 0; i < a.length - 1; i++)
    for (let j = 0; j < a.length - 1 - i; j++)
      if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];
  return a;
};
const quickSort = (arr: number[]): number[] => {
  if (arr.length <= 1) return arr;
  const p = arr[0], left = arr.slice(1).filter(x => x <= p), right = arr.slice(1).filter(x => x > p);
  return [...quickSort(left), p, ...quickSort(right)];
};
const merge = (l: number[], r: number[]) => {
  const out: number[] = [];
  const L = [...l], R = [...r];
  while (L.length && R.length) out.push(L[0] <= R[0] ? L.shift()! : R.shift()!);
  return [...out, ...L, ...R];
};
const mergeSort = (arr: number[]): number[] => {
  if (arr.length <= 1) return arr;
  const m = Math.floor(arr.length / 2);
  return merge(mergeSort(arr.slice(0, m)), mergeSort(arr.slice(m)));
};
const binarySearch = (arr: number[], target: number) => {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const m = (lo + hi) >> 1;
    if (arr[m] === target) return m;
    arr[m] < target ? lo = m + 1 : hi = m - 1;
  }
  return -1;
};
const linearSearch = (arr: number[], target: number) => {
  for (let i = 0; i < arr.length; i++) if (arr[i] === target) return i;
  return -1;
};

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
  const [targetTextLength, setTargetTextLength] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [algoResults, setAlgoResults] = useState<(number[] | number | null)[]>([null, null, null, null, null, null, null, null]);
  const [showAlgoDemos, setShowAlgoDemos] = useState(false);

  const completedText = 'Congratulations, you have completed typing test! You can check your results in the results section above.';
  
  const jsText1 = 'else {\n;let fact = 1;\nfor (i = 1; i <= number; i++) {\nfact *= i;\n}\nconsole.log(`The factorial of ${number} is ${fact}.`);';
  const jsText2 = 'var x = 1;\nlet y = 1;\nif (true) {\nvar x = 2;\nlet y = 2;\n}';
  const jsText3 = 'function calculateSum(arr) {\nreturn arr.reduce((acc, val) => acc + val, 0);\n}\nconst numbers = [1, 2, 3, 4, 5];\nconsole.log(calculateSum(numbers));';

  const jsAlgo1 = 'function bubbleSort(arr) {\n  const a = [...arr];\n  for (let i = 0; i < a.length - 1; i++)\n    for (let j = 0; j < a.length - 1 - i; j++)\n      if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];\n  return a;\n}\nconst result = bubbleSort([5, 2, 8, 1, 9]);\nconsole.log(result);';
  const jsAlgo2 = 'function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const p = arr[0], left = arr.slice(1).filter(x => x <= p), right = arr.slice(1).filter(x => x > p);\n  return [...quickSort(left), p, ...quickSort(right)];\n}\nconst result = quickSort([5, 2, 8, 1, 9]);\nconsole.log(result);';
  const jsAlgo3 = 'function merge(l, r) {\n  const out = [];\n  while (l.length && r.length) out.push(l[0] <= r[0] ? l.shift() : r.shift());\n  return [...out, ...l, ...r];\n}\nfunction mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  const m = Math.floor(arr.length / 2);\n  return merge(mergeSort(arr.slice(0, m)), mergeSort(arr.slice(m)));\n}\nconst result = mergeSort([5, 2, 8, 1, 9]);\nconsole.log(result);';
  const jsAlgo4 = 'function binarySearch(arr, target) {\n  let lo = 0, hi = arr.length - 1;\n  while (lo <= hi) {\n    const m = (lo + hi) >> 1;\n    if (arr[m] === target) return m;\n    arr[m] < target ? lo = m + 1 : hi = m - 1;\n  }\n  return -1;\n}\nconst result = binarySearch([1, 3, 5, 7, 9], 5);\nconsole.log(result);';
  const jsAlgo5 = 'function linearSearch(arr, target) {\n  for (let i = 0; i < arr.length; i++) if (arr[i] === target) return i;\n  return -1;\n}\nconst result = linearSearch([3, 7, 2, 9, 4], 9);\nconsole.log(result);';
  const jsAlgo6 = 'const arr = [1, 2, 3, 4, 5];\nconst result = arr.map(x => x * 2);\nconsole.log(result);';
  const jsAlgo7 = 'const arr = [1, 2, 3, 4, 5, 6];\nconst result = arr.filter(x => x % 2 === 0);\nconsole.log(result);';
  const jsAlgo8 = 'const arr = [1, 2, 3, 4, 5];\nconst result = arr.reduce((acc, val) => acc + val, 0);\nconsole.log(result);';

  const reactHook1 = 'const [count, setCount] = useState(0);\nconst increment = () => setCount(count + 1);\nreturn (\n  <div>\n    <p>Count: {count}</p>\n    <button onClick={increment}>Increment</button>\n  </div>\n);';
  const reactHook2 = 'useEffect(() => {\n  document.title = `Count: ${count}`;\n  return () => {\n    document.title = "React App";\n  };\n}, [count]);';
  const reactHook3 = 'const ThemeContext = createContext("light");\nconst theme = useContext(ThemeContext);\nreturn <div className={theme}>Current theme: {theme}</div>;';
  const reactHook4 = 'const reducer = (state, action) => {\n  switch (action.type) {\n    case "increment": return { count: state.count + 1 };\n    case "decrement": return { count: state.count - 1 };\n    default: return state;\n  }\n};\nconst [state, dispatch] = useReducer(reducer, { count: 0 });';
  const reactHook5 = 'const expensiveValue = useMemo(() => {\n  return items.reduce((sum, item) => sum + item.value, 0);\n}, [items]);';
  const reactHook6 = 'const memoizedCallback = useCallback(() => {\n  doSomething(a, b);\n}, [a, b]);';
  const reactHook7 = 'const inputRef = useRef(null);\nconst focusInput = () => inputRef.current?.focus();\nreturn <input ref={inputRef} />;';
  const reactHook8 = 'useLayoutEffect(() => {\n  const rect = elementRef.current.getBoundingClientRect();\n  setPosition({ x: rect.x, y: rect.y });\n}, [dependencies]);';
  
  const pythonText1 = 'def calculate_factorial(n):\n    if n == 0:\n        return 1\n    return n * calculate_factorial(n - 1)\n\nresult = calculate_factorial(5)\nprint(f"The factorial is {result}")';
  const pythonText2 = 'numbers = [1, 2, 3, 4, 5]\nsquared = [x**2 for x in numbers]\nfiltered = [x for x in squared if x > 10]\nprint(filtered)';
  const pythonText3 = 'def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n - 1) + fibonacci(n - 2)\n\nfor i in range(10):\n    print(f"F({i}) = {fibonacci(i)}")';
  
  const javaText1 = 'public class Calculator {\n    public static int add(int a, int b) {\n        return a + b;\n    }\n    \n    public static void main(String[] args) {\n        System.out.println(add(5, 3));\n    }\n}';
  const javaText2 = 'List<String> names = new ArrayList<>();\nnames.add("Alice");\nnames.add("Bob");\nfor (String name : names) {\n    System.out.println(name);\n}';
  const javaText3 = 'public class Factorial {\n    public static int factorial(int n) {\n        if (n <= 1) return 1;\n        return n * factorial(n - 1);\n    }\n}';

  const practiceTexts = {
    js: [jsText1, jsText2, jsText3],
    python: [pythonText1, pythonText2, pythonText3],
    java: [javaText1, javaText2, javaText3],
    jsAlgorithms: [jsAlgo1, jsAlgo2, jsAlgo3, jsAlgo4, jsAlgo5, jsAlgo6, jsAlgo7, jsAlgo8],
    reactHooks: [reactHook1, reactHook2, reactHook3, reactHook4, reactHook5, reactHook6, reactHook7, reactHook8]
  };

  useEffect(() => {
    const allTexts = [...practiceTexts.js, ...practiceTexts.python, ...practiceTexts.java, ...practiceTexts.jsAlgorithms, ...practiceTexts.reactHooks];
    const randomText = Math.floor(Math.random() * allTexts.length); 
    const selectedText = allTexts[randomText];
    setPracticeTextState(selectedText);
    setTargetTextLength(selectedText.length);
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
    if (isTimerRunning) {
      setIsTimerRunning(false);
      setStartTime(null);
      setElapsedTime(0);
      setUserTypeValue('');
      setShadowBoxToggle(false);
      setAccuracyCount(0);
    } else {
      setIsTimerRunning(true);
      setStartTime(Date.now());
      setElapsedTime(0);
      setUserTypeValue('');
      setShadowBoxToggle(false);
      setAccuracyCount(0);
      if (practiceTextState) {
        setTargetTextLength(practiceTextState.length);
      }
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 0);
    }
  };

  const handleTextSelection = (language: 'js' | 'python' | 'java' | 'jsAlgorithms' | 'reactHooks', index: number) => {
    const selectedText = practiceTexts[language][index];
    const base = practiceTexts.js.length + practiceTexts.python.length + practiceTexts.java.length;
    const jsAlgoBase = base + practiceTexts.jsAlgorithms.length;
    const selectedIndex = language === 'js' ? index : 
                         language === 'python' ? practiceTexts.js.length + index : 
                         language === 'java' ? practiceTexts.js.length + practiceTexts.python.length + index : 
                         language === 'jsAlgorithms' ? base + index :
                         jsAlgoBase + index;

    setPracticeTextState(selectedText);
    setTargetTextLength(selectedText.length);
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


  const handleTextareaKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      const textarea = event.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const spaces = '    ';
      
      const newText = text.substring(0, start) + spaces + text.substring(end);
      setUserTypeValue(newText);
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + spaces.length;
      }, 0);
    }
  };

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

    const isExactMatch = enteredText === practiceTextState;
    const isLengthMatch = enteredText.length === targetTextLength && targetTextLength > 0;
    const isCompleted = isExactMatch || isLengthMatch;
    
    if (!isExactMatch && isLengthMatch) {
      console.log('Length match completion:');
      console.log('Entered length:', enteredText.length);
      console.log('Target length:', targetTextLength);
      console.log('Entered JSON:', JSON.stringify(enteredText));
      console.log('Target JSON:', JSON.stringify(practiceTextState));
    }
    
    if (!isCompleted && enteredText.length === practiceTextState.length) {
      console.log('Lengths match but strings differ:');
      console.log('Entered length:', enteredText.length);
      console.log('Target length:', practiceTextState.length);
      console.log('Entered JSON:', JSON.stringify(enteredText));
      console.log('Target JSON:', JSON.stringify(practiceTextState));
      for (let i = 0; i < Math.min(enteredText.length, practiceTextState.length); i++) {
        if (enteredText[i] !== practiceTextState[i]) {
          console.log(`Mismatch at index ${i}: entered='${JSON.stringify(enteredText[i])}' (char code: ${enteredText.charCodeAt(i)}), target='${JSON.stringify(practiceTextState[i])}' (char code: ${practiceTextState.charCodeAt(i)})`);
          break;
        }
      }
    }

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
          <div className="statistics-container">
            <div className="stat-item">
              <div className="stat-label">Total Tests</div>
              <div className="stat-value">{playerStats.totalTests}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Average Accuracy</div>
              <div className="stat-value">{playerStats.averageAccuracy.toFixed(2)}%</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Average Progress</div>
              <div className="stat-value">{playerStats.averageProgress.toFixed(2)}%</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Best Accuracy</div>
              <div className="stat-value">{playerStats.bestAccuracy.toFixed(2)}%</div>
            </div>
          </div>
          
          <h4>Recent Results:</h4>
          <div className="recent-results-container">
            {playerResults.slice(-10).reverse().map((result) => (
              <div key={result.id} className="result-item">
                <div className="result-pair">
                  <div className="result-label">Date:</div>
                  <div className="result-value">{new Date(result.date).toLocaleString()}</div>
                </div>
                <div className="result-pair">
                  <div className="result-label">Accuracy:</div>
                  <div className="result-value">{result.accuracy.toFixed(2)}%</div>
                </div>
                <div className="result-pair">
                  <div className="result-label">Progress:</div>
                  <div className="result-value">{result.progress.toFixed(2)}%</div>
                </div>
                <div className="result-pair">
                  <div className="result-label">Duration:</div>
                  <div className="result-value">{(result.duration / 1000).toFixed(2)}s</div>
                </div>
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
          disabled={!practiceTextState}
          className={`start-button ${isTimerRunning ? 'stop-button' : ''}`}
        >
          {isTimerRunning ? 'Stop Test' : 'Start Typing Test'}
        </button>
      </div>

      <div className="text-selection-section">
        <div className="language-group">
          <h4 className="language-label">JavaScript:</h4>
          <div className="text-selection-buttons">
            <button onClick={() => handleTextSelection('js', 0)} disabled={isTimerRunning}>JS Text 1</button>
            <button onClick={() => handleTextSelection('js', 1)} disabled={isTimerRunning}>JS Text 2</button>
            <button onClick={() => handleTextSelection('js', 2)} disabled={isTimerRunning}>JS Text 3</button>
          </div>
        </div>
        <div className="language-group">
          <h4 className="language-label">Python:</h4>
          <div className="text-selection-buttons">
            <button onClick={() => handleTextSelection('python', 0)} disabled={isTimerRunning}>Python Text 1</button>
            <button onClick={() => handleTextSelection('python', 1)} disabled={isTimerRunning}>Python Text 2</button>
            <button onClick={() => handleTextSelection('python', 2)} disabled={isTimerRunning}>Python Text 3</button>
          </div>
        </div>
        <div className="language-group">
          <h4 className="language-label">Java:</h4>
          <div className="text-selection-buttons">
            <button onClick={() => handleTextSelection('java', 0)} disabled={isTimerRunning}>Java Text 1</button>
            <button onClick={() => handleTextSelection('java', 1)} disabled={isTimerRunning}>Java Text 2</button>
            <button onClick={() => handleTextSelection('java', 2)} disabled={isTimerRunning}>Java Text 3</button>
          </div>
        </div>
        <div className="language-group">
          <h4 className="language-label">JS Algorithms:</h4>
          <div className="text-selection-buttons">
            <button onClick={() => handleTextSelection('jsAlgorithms', 0)} disabled={isTimerRunning}>Bubble Sort</button>
            <button onClick={() => handleTextSelection('jsAlgorithms', 1)} disabled={isTimerRunning}>Quick Sort</button>
            <button onClick={() => handleTextSelection('jsAlgorithms', 2)} disabled={isTimerRunning}>Merge Sort</button>
            <button onClick={() => handleTextSelection('jsAlgorithms', 3)} disabled={isTimerRunning}>Binary Search</button>
            <button onClick={() => handleTextSelection('jsAlgorithms', 4)} disabled={isTimerRunning}>Linear Search</button>
            <button onClick={() => handleTextSelection('jsAlgorithms', 5)} disabled={isTimerRunning}>Map</button>
            <button onClick={() => handleTextSelection('jsAlgorithms', 6)} disabled={isTimerRunning}>Filter</button>
            <button onClick={() => handleTextSelection('jsAlgorithms', 7)} disabled={isTimerRunning}>Reduce</button>
          </div>
        </div>
        <div className="language-group">
          <h4 className="language-label">React Hooks:</h4>
          <div className="text-selection-buttons">
            <button onClick={() => handleTextSelection('reactHooks', 0)} disabled={isTimerRunning}>useState</button>
            <button onClick={() => handleTextSelection('reactHooks', 1)} disabled={isTimerRunning}>useEffect</button>
            <button onClick={() => handleTextSelection('reactHooks', 2)} disabled={isTimerRunning}>useContext</button>
            <button onClick={() => handleTextSelection('reactHooks', 3)} disabled={isTimerRunning}>useReducer</button>
            <button onClick={() => handleTextSelection('reactHooks', 4)} disabled={isTimerRunning}>useMemo</button>
            <button onClick={() => handleTextSelection('reactHooks', 5)} disabled={isTimerRunning}>useCallback</button>
            <button onClick={() => handleTextSelection('reactHooks', 6)} disabled={isTimerRunning}>useRef</button>
            <button onClick={() => handleTextSelection('reactHooks', 7)} disabled={isTimerRunning}>useLayoutEffect</button>
          </div>
        </div>
      </div>

      <div className="js-algorithms-demos">
        <button type="button" className="algo-demos-toggle" onClick={() => setShowAlgoDemos(!showAlgoDemos)}>
          {showAlgoDemos ? 'Hide' : 'Show'} JS Algorithms – run in browser
        </button>
        {showAlgoDemos && (
          <div className="algo-demos-grid">
            <div className="algo-demo-box">
              <div className="algo-demo-title">Bubble Sort</div>
              <div className="algo-demo-array">[5, 2, 8, 1, 9]</div>
              <button type="button" className="algo-demo-run" onClick={() => setAlgoResults(prev => { const r = [...prev]; r[0] = bubbleSort([5, 2, 8, 1, 9]); return r; })}>Run</button>
              <div className="algo-demo-result">{algoResults[0] != null ? (Array.isArray(algoResults[0]) ? (algoResults[0] as number[]).join(', ') : algoResults[0]) : '—'}</div>
            </div>
            <div className="algo-demo-box">
              <div className="algo-demo-title">Quick Sort</div>
              <div className="algo-demo-array">[5, 2, 8, 1, 9]</div>
              <button type="button" className="algo-demo-run" onClick={() => setAlgoResults(prev => { const r = [...prev]; r[1] = quickSort([5, 2, 8, 1, 9]); return r; })}>Run</button>
              <div className="algo-demo-result">{algoResults[1] != null ? (Array.isArray(algoResults[1]) ? (algoResults[1] as number[]).join(', ') : algoResults[1]) : '—'}</div>
            </div>
            <div className="algo-demo-box">
              <div className="algo-demo-title">Merge Sort</div>
              <div className="algo-demo-array">[5, 2, 8, 1, 9]</div>
              <button type="button" className="algo-demo-run" onClick={() => setAlgoResults(prev => { const r = [...prev]; r[2] = mergeSort([5, 2, 8, 1, 9]); return r; })}>Run</button>
              <div className="algo-demo-result">{algoResults[2] != null ? (Array.isArray(algoResults[2]) ? (algoResults[2] as number[]).join(', ') : algoResults[2]) : '—'}</div>
            </div>
            <div className="algo-demo-box">
              <div className="algo-demo-title">Binary Search (target 5)</div>
              <div className="algo-demo-array">[1, 3, 5, 7, 9]</div>
              <button type="button" className="algo-demo-run" onClick={() => setAlgoResults(prev => { const r = [...prev]; r[3] = binarySearch([1, 3, 5, 7, 9], 5); return r; })}>Run</button>
              <div className="algo-demo-result">{algoResults[3] != null ? `Index: ${algoResults[3]}` : '—'}</div>
            </div>
            <div className="algo-demo-box">
              <div className="algo-demo-title">Linear Search (target 9)</div>
              <div className="algo-demo-array">[3, 7, 2, 9, 4]</div>
              <button type="button" className="algo-demo-run" onClick={() => setAlgoResults(prev => { const r = [...prev]; r[4] = linearSearch([3, 7, 2, 9, 4], 9); return r; })}>Run</button>
              <div className="algo-demo-result">{algoResults[4] != null ? `Index: ${algoResults[4]}` : '—'}</div>
            </div>
            <div className="algo-demo-box">
              <div className="algo-demo-title">Map (×2)</div>
              <div className="algo-demo-array">[1, 2, 3, 4, 5]</div>
              <button type="button" className="algo-demo-run" onClick={() => setAlgoResults(prev => { const r = [...prev]; r[5] = [1, 2, 3, 4, 5].map(x => x * 2); return r; })}>Run</button>
              <div className="algo-demo-result">{algoResults[5] != null ? (algoResults[5] as number[]).join(', ') : '—'}</div>
            </div>
            <div className="algo-demo-box">
              <div className="algo-demo-title">Filter (evens)</div>
              <div className="algo-demo-array">[1, 2, 3, 4, 5, 6]</div>
              <button type="button" className="algo-demo-run" onClick={() => setAlgoResults(prev => { const r = [...prev]; r[6] = [1, 2, 3, 4, 5, 6].filter(x => x % 2 === 0); return r; })}>Run</button>
              <div className="algo-demo-result">{algoResults[6] != null ? (algoResults[6] as number[]).join(', ') : '—'}</div>
            </div>
            <div className="algo-demo-box">
              <div className="algo-demo-title">Reduce (sum)</div>
              <div className="algo-demo-array">[1, 2, 3, 4, 5]</div>
              <button type="button" className="algo-demo-run" onClick={() => setAlgoResults(prev => { const r = [...prev]; r[7] = [1, 2, 3, 4, 5].reduce((acc, val) => acc + val, 0); return r; })}>Run</button>
              <div className="algo-demo-result">{algoResults[7] != null ? String(algoResults[7]) : '—'}</div>
            </div>
          </div>
        )}
      </div>

      <div className="mainTextAreas">
        <div className='sub-header'>
          <h3>Practice text:</h3>
        </div>
        <div className="textAreas">
          <textarea 
            ref={textareaRef}
            className='textInputs topP' 
            onChange={handleTextareaChange}
            onKeyDown={handleTextareaKeyDown}
            value={userTypeValue}
            disabled={!isTimerRunning}
          />
          <textarea className='textInputs bottomP' value={practiceTextState} readOnly/>
          {shadowBoxToggle && practiceTextState.length > 0 && (
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
