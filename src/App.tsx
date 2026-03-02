import React, { useEffect, useRef } from 'react';
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
  const [targetTextLength, setTargetTextLength] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [currentLanguage, setCurrentLanguage] = useState<'jsAlgorithms' | 'reactHooks' | 'jsFundamentals' | 'typescript' | null>(null);
  const [currentTestIndex, setCurrentTestIndex] = useState<number>(0);

  const completedText = 'Congratulations, you have completed typing test! You can check your results in the results section above.';

  const jsAlgo1 = 'function bubbleSort(arr) {\n  const a = [...arr];\n  for (let i = 0; i < a.length - 1; i++)\n    for (let j = 0; j < a.length - 1 - i; j++)\n      if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];\n  return a;\n}\nconst result = bubbleSort([5, 2, 8, 1, 9]);\nconsole.log(result);';
  const jsAlgo2 = 'function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const p = arr[0], left = arr.slice(1).filter(x => x <= p), right = arr.slice(1).filter(x => x > p);\n  return [...quickSort(left), p, ...quickSort(right)];\n}\nconst result = quickSort([5, 2, 8, 1, 9]);\nconsole.log(result);';
  const jsAlgo3 = 'function merge(l, r) {\n  const out = [];\n  while (l.length && r.length) out.push(l[0] <= r[0] ? l.shift() : r.shift());\n  return [...out, ...l, ...r];\n}\nfunction mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  const m = Math.floor(arr.length / 2);\n  return merge(mergeSort(arr.slice(0, m)), mergeSort(arr.slice(m)));\n}\nconst result = mergeSort([5, 2, 8, 1, 9]);\nconsole.log(result);';
  const jsAlgo4 = 'function binarySearch(arr, target) {\n  let lo = 0, hi = arr.length - 1;\n  while (lo <= hi) {\n    const m = (lo + hi) >> 1;\n    if (arr[m] === target) return m;\n    arr[m] < target ? lo = m + 1 : hi = m - 1;\n  }\n  return -1;\n}\nconst result = binarySearch([1, 3, 5, 7, 9], 5);\nconsole.log(result);';
  const jsAlgo5 = 'function linearSearch(arr, target) {\n  for (let i = 0; i < arr.length; i++) if (arr[i] === target) return i;\n  return -1;\n}\nconst result = linearSearch([3, 7, 2, 9, 4], 9);\nconsole.log(result);';

  const reactHook1 = 'const [count, setCount] = useState(0);\nconst increment = () => setCount(count + 1);\nreturn (\n  <div>\n    <p>Count: {count}</p>\n    <button onClick={increment}>Increment</button>\n  </div>\n);';
  const reactHook2 = 'useEffect(() => {\n  document.title = `Count: ${count}`;\n  return () => {\n    document.title = "React App";\n  };\n}, [count]);';
  const reactHook3 = 'const ThemeContext = createContext("light");\nconst theme = useContext(ThemeContext);\nreturn <div className={theme}>Current theme: {theme}</div>;';
  const reactHook4 = 'const reducer = (state, action) => {\n  switch (action.type) {\n    case "increment": return { count: state.count + 1 };\n    case "decrement": return { count: state.count - 1 };\n    default: return state;\n  }\n};\nconst [state, dispatch] = useReducer(reducer, { count: 0 });';
  const reactHook5 = 'const expensiveValue = useMemo(() => {\n  return items.reduce((sum, item) => sum + item.value, 0);\n}, [items]);';
  const reactHook6 = 'const memoizedCallback = useCallback(() => {\n  doSomething(a, b);\n}, [a, b]);';
  const reactHook7 = 'const inputRef = useRef(null);\nconst focusInput = () => inputRef.current?.focus();\nreturn <input ref={inputRef} />;';
  const reactHook8 = 'useLayoutEffect(() => {\n  const rect = elementRef.current.getBoundingClientRect();\n  setPosition({ x: rect.x, y: rect.y });\n}, [dependencies]);';
  const reactHook9 = 'function SortComponent() {\n  const [arr] = useState([5, 2, 8, 1, 9]);\n  const [result, setResult] = useState([]);\n  const [isSorted, setIsSorted] = useState(false);\n  const bubbleSort = (a) => {\n    const copy = [...a];\n    for (let i = 0; i < copy.length - 1; i++)\n      for (let j = 0; j < copy.length - 1 - i; j++)\n        if (copy[j] > copy[j + 1]) [copy[j], copy[j + 1]] = [copy[j + 1], copy[j]];\n    return copy;\n  };\n  const toggleSort = () => {\n    if (!isSorted) setResult(bubbleSort(arr));\n    else setResult([]);\n    setIsSorted(!isSorted);\n  };\n  return (\n    <div>\n      <button onClick={toggleSort}>{isSorted ? "Reset" : "Sort"}</button>\n      <div>Original: {arr.join(", ")}</div>\n      <div>Sorted: {result.join(", ")}</div>\n    </div>\n  );\n}';

  const jsFund1 = 'const numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(num => num * 2);\nconsole.log(doubled);';
  const jsFund2 = 'const numbers = [1, 2, 3, 4, 5, 6];\nconst evens = numbers.filter(num => num % 2 === 0);\nconsole.log(evens);';
  const jsFund3 = 'const numbers = [1, 2, 3, 4, 5];\nconst sum = numbers.reduce((acc, num) => acc + num, 0);\nconsole.log(sum);';
  const jsFund4 = 'const greet = (name) => `Hello, ${name}!`;\nconst multiply = (a, b) => a * b;\nconst squared = [1, 2, 3].map(n => n * n);\nconsole.log(greet("World"), multiply(5, 3), squared);';
  const jsFund5 = 'function calculateArea(width, height) {\n  return width * height;\n}\nfunction greetUser(name, age) {\n  return `Hello ${name}, you are ${age} years old`;\n}\nconsole.log(calculateArea(10, 5), greetUser("Alice", 30));';
  const jsFund6 = 'const person = { name: "John", age: 30 };\nfunction introduce(city, country) {\n  return `${this.name} is ${this.age} from ${city}, ${country}`;\n}\nconst bound = introduce.bind(person);\nconst called = introduce.call(person, "NYC", "USA");\nconst applied = introduce.apply(person, ["NYC", "USA"]);\nconsole.log(bound(), called, applied);';

  const tsType1 = 'let name: string = "John";\nlet age: number = 30;\nlet isActive: boolean = true;\nlet items: string[] = ["apple", "banana"];\nlet user: { name: string; age: number } = { name: "Alice", age: 25 };';
  const tsType2 = 'type Status = "pending" | "completed" | "failed";\nlet currentStatus: Status = "pending";\ntype ID = string | number;\nlet userId: ID = "123";';
  const tsType3 = 'function greet(name: string): string {\n  return `Hello, ${name}!`;\n}\nfunction add(a: number, b: number): number {\n  return a + b;\n}\nconst result = greet("World");\nconst sum = add(5, 3);';
  const tsInterface1 = 'interface User {\n  name: string;\n  age: number;\n  email: string;\n}\nconst user: User = {\n  name: "John",\n  age: 30,\n  email: "john@example.com"\n};';
  const tsInterface2 = 'interface Animal {\n  name: string;\n  speak(): void;\n}\nclass Dog implements Animal {\n  name: string;\n  constructor(name: string) { this.name = name; }\n  speak() { console.log(`${this.name} barks`); }\n}';
  const tsInterface3 = 'interface Config {\n  apiUrl: string;\n  timeout?: number;\n  retries: number;\n}\nconst config: Config = {\n  apiUrl: "https://api.example.com",\n  retries: 3\n};';
  const tsGeneric1 = 'function identity<T>(arg: T): T {\n  return arg;\n}\nconst num = identity<number>(42);\nconst str = identity<string>("hello");';
  const tsGeneric2 = 'interface Box<T> {\n  value: T;\n}\nconst numberBox: Box<number> = { value: 42 };\nconst stringBox: Box<string> = { value: "hello" };';
  const tsEnum1 = 'enum Color {\n  Red = "red",\n  Green = "green",\n  Blue = "blue"\n}\nconst favoriteColor: Color = Color.Red;';
  const tsEnum2 = 'enum Status {\n  Pending,\n  Completed,\n  Failed\n}\nlet currentStatus = Status.Pending;';

  const practiceTexts = {
    jsAlgorithms: [jsAlgo1, jsAlgo2, jsAlgo3, jsAlgo4, jsAlgo5],
    reactHooks: [reactHook1, reactHook2, reactHook3, reactHook4, reactHook5, reactHook6, reactHook7, reactHook8, reactHook9],
    jsFundamentals: [jsFund1, jsFund2, jsFund3, jsFund4, jsFund5, jsFund6],
    typescript: [tsType1, tsType2, tsType3, tsInterface1, tsInterface2, tsInterface3, tsGeneric1, tsGeneric2, tsEnum1, tsEnum2]
  };

  const testNames: Record<string, string[]> = {
    jsAlgorithms: ['Bubble Sort', 'Quick Sort', 'Merge Sort', 'Binary Search', 'Linear Search'],
    reactHooks: ['useState', 'useEffect', 'useContext', 'useReducer', 'useMemo', 'useCallback', 'useRef', 'useLayoutEffect', 'Bubble Sort Component'],
    jsFundamentals: ['Map', 'Filter', 'Reduce', 'Arrow Functions', 'Functions', 'Bind/Call/Apply'],
    typescript: ['Basic Types', 'Union Types', 'Function Types', 'Interface 1', 'Interface 2', 'Optional Properties', 'Generics 1', 'Generics 2', 'String Enum', 'Numeric Enum']
  };

  const getTestName = (language: string | null, index: number): string => {
    if (!language || !testNames[language]) return 'Unknown Test';
    return testNames[language][index] || 'Unknown Test';
  };

  useEffect(() => {
    const allTexts = [...practiceTexts.jsAlgorithms, ...practiceTexts.reactHooks, ...practiceTexts.jsFundamentals, ...practiceTexts.typescript];
    const randomText = Math.floor(Math.random() * allTexts.length);
    const selectedText = allTexts[randomText];
    
    let lang: 'jsAlgorithms' | 'reactHooks' | 'jsFundamentals' | 'typescript' | null = null;
    let idx = 0;
    const jsAlgoLen = practiceTexts.jsAlgorithms.length;
    const reactLen = practiceTexts.reactHooks.length;
    const jsFundLen = practiceTexts.jsFundamentals.length;
    
    if (randomText < jsAlgoLen) {
      lang = 'jsAlgorithms';
      idx = randomText;
    } else if (randomText < jsAlgoLen + reactLen) {
      lang = 'reactHooks';
      idx = randomText - jsAlgoLen;
    } else if (randomText < jsAlgoLen + reactLen + jsFundLen) {
      lang = 'jsFundamentals';
      idx = randomText - jsAlgoLen - reactLen;
    } else {
      lang = 'typescript';
      idx = randomText - jsAlgoLen - reactLen - jsFundLen;
    }
    
    setPracticeTextState(selectedText);
    setTargetTextLength(selectedText.length);
    setRandomTextIndex(randomText);
    setCurrentLanguage(lang);
    setCurrentTestIndex(idx);
    
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

  const handleTextSelection = (language: 'jsAlgorithms' | 'reactHooks' | 'jsFundamentals' | 'typescript', index: number) => {
    const selectedText = practiceTexts[language][index];
    const jsAlgoBase = practiceTexts.jsAlgorithms.length;
    const reactHooksBase = jsAlgoBase + practiceTexts.reactHooks.length;
    const jsFundBase = reactHooksBase + practiceTexts.jsFundamentals.length;
    const selectedIndex = language === 'jsAlgorithms' ? index :
                         language === 'reactHooks' ? jsAlgoBase + index :
                         language === 'jsFundamentals' ? reactHooksBase + index :
                         jsFundBase + index;

    setPracticeTextState(selectedText);
    setTargetTextLength(selectedText.length);
    setRandomTextIndex(selectedIndex);
    setCurrentLanguage(language);
    setCurrentTestIndex(index);
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
      testName: getTestName(currentLanguage, currentTestIndex),
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
                  <div className="result-label">Test:</div>
                  <div className="result-value">{result.testName || 'Unknown Test'}</div>
                </div>
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

      <div className="text-selection-section">
        <p><strong style={{ textDecoration: 'underline' }}>Select test</strong></p>
        <div className="language-group">
          <h4 className="language-label">JS Algorithms:</h4>
          <div className="text-selection-buttons">
            <button onClick={() => handleTextSelection('jsAlgorithms', 0)} disabled={isTimerRunning} className={currentLanguage === 'jsAlgorithms' && currentTestIndex === 0 ? 'selected-test' : ''}>Bubble Sort</button>
            <button onClick={() => handleTextSelection('jsAlgorithms', 1)} disabled={isTimerRunning} className={currentLanguage === 'jsAlgorithms' && currentTestIndex === 1 ? 'selected-test' : ''}>Quick Sort</button>
            <button onClick={() => handleTextSelection('jsAlgorithms', 2)} disabled={isTimerRunning} className={currentLanguage === 'jsAlgorithms' && currentTestIndex === 2 ? 'selected-test' : ''}>Merge Sort</button>
            <button onClick={() => handleTextSelection('jsAlgorithms', 3)} disabled={isTimerRunning} className={currentLanguage === 'jsAlgorithms' && currentTestIndex === 3 ? 'selected-test' : ''}>Binary Search</button>
            <button onClick={() => handleTextSelection('jsAlgorithms', 4)} disabled={isTimerRunning} className={currentLanguage === 'jsAlgorithms' && currentTestIndex === 4 ? 'selected-test' : ''}>Linear Search</button>
          </div>
        </div>
        <div className="language-group">
          <h4 className="language-label">React Hooks:</h4>
          <div className="text-selection-buttons">
            <button onClick={() => handleTextSelection('reactHooks', 0)} disabled={isTimerRunning} className={currentLanguage === 'reactHooks' && currentTestIndex === 0 ? 'selected-test' : ''}>useState</button>
            <button onClick={() => handleTextSelection('reactHooks', 1)} disabled={isTimerRunning} className={currentLanguage === 'reactHooks' && currentTestIndex === 1 ? 'selected-test' : ''}>useEffect</button>
            <button onClick={() => handleTextSelection('reactHooks', 2)} disabled={isTimerRunning} className={currentLanguage === 'reactHooks' && currentTestIndex === 2 ? 'selected-test' : ''}>useContext</button>
            <button onClick={() => handleTextSelection('reactHooks', 3)} disabled={isTimerRunning} className={currentLanguage === 'reactHooks' && currentTestIndex === 3 ? 'selected-test' : ''}>useReducer</button>
            <button onClick={() => handleTextSelection('reactHooks', 4)} disabled={isTimerRunning} className={currentLanguage === 'reactHooks' && currentTestIndex === 4 ? 'selected-test' : ''}>useMemo</button>
            <button onClick={() => handleTextSelection('reactHooks', 5)} disabled={isTimerRunning} className={currentLanguage === 'reactHooks' && currentTestIndex === 5 ? 'selected-test' : ''}>useCallback</button>
            <button onClick={() => handleTextSelection('reactHooks', 6)} disabled={isTimerRunning} className={currentLanguage === 'reactHooks' && currentTestIndex === 6 ? 'selected-test' : ''}>useRef</button>
            <button onClick={() => handleTextSelection('reactHooks', 7)} disabled={isTimerRunning} className={currentLanguage === 'reactHooks' && currentTestIndex === 7 ? 'selected-test' : ''}>useLayoutEffect</button>
            <button onClick={() => handleTextSelection('reactHooks', 8)} disabled={isTimerRunning} className={currentLanguage === 'reactHooks' && currentTestIndex === 8 ? 'selected-test' : ''}>Bubble Sort Component</button>
          </div>
        </div>
        <div className="language-group">
          <h4 className="language-label">JS Fundamentals:</h4>
          <div className="text-selection-buttons">
            <button onClick={() => handleTextSelection('jsFundamentals', 0)} disabled={isTimerRunning} className={currentLanguage === 'jsFundamentals' && currentTestIndex === 0 ? 'selected-test' : ''}>Map</button>
            <button onClick={() => handleTextSelection('jsFundamentals', 1)} disabled={isTimerRunning} className={currentLanguage === 'jsFundamentals' && currentTestIndex === 1 ? 'selected-test' : ''}>Filter</button>
            <button onClick={() => handleTextSelection('jsFundamentals', 2)} disabled={isTimerRunning} className={currentLanguage === 'jsFundamentals' && currentTestIndex === 2 ? 'selected-test' : ''}>Reduce</button>
            <button onClick={() => handleTextSelection('jsFundamentals', 3)} disabled={isTimerRunning} className={currentLanguage === 'jsFundamentals' && currentTestIndex === 3 ? 'selected-test' : ''}>Arrow Functions</button>
            <button onClick={() => handleTextSelection('jsFundamentals', 4)} disabled={isTimerRunning} className={currentLanguage === 'jsFundamentals' && currentTestIndex === 4 ? 'selected-test' : ''}>Functions</button>
            <button onClick={() => handleTextSelection('jsFundamentals', 5)} disabled={isTimerRunning} className={currentLanguage === 'jsFundamentals' && currentTestIndex === 5 ? 'selected-test' : ''}>Bind/Call/Apply</button>
          </div>
        </div>
        <div className="language-group">
          <h4 className="language-label">TypeScript:</h4>
          <div className="text-selection-buttons">
            <button onClick={() => handleTextSelection('typescript', 0)} disabled={isTimerRunning} className={currentLanguage === 'typescript' && currentTestIndex === 0 ? 'selected-test' : ''}>Basic Types</button>
            <button onClick={() => handleTextSelection('typescript', 1)} disabled={isTimerRunning} className={currentLanguage === 'typescript' && currentTestIndex === 1 ? 'selected-test' : ''}>Union Types</button>
            <button onClick={() => handleTextSelection('typescript', 2)} disabled={isTimerRunning} className={currentLanguage === 'typescript' && currentTestIndex === 2 ? 'selected-test' : ''}>Function Types</button>
            <button onClick={() => handleTextSelection('typescript', 3)} disabled={isTimerRunning} className={currentLanguage === 'typescript' && currentTestIndex === 3 ? 'selected-test' : ''}>Interface 1</button>
            <button onClick={() => handleTextSelection('typescript', 4)} disabled={isTimerRunning} className={currentLanguage === 'typescript' && currentTestIndex === 4 ? 'selected-test' : ''}>Interface 2</button>
            <button onClick={() => handleTextSelection('typescript', 5)} disabled={isTimerRunning} className={currentLanguage === 'typescript' && currentTestIndex === 5 ? 'selected-test' : ''}>Optional Properties</button>
            <button onClick={() => handleTextSelection('typescript', 6)} disabled={isTimerRunning} className={currentLanguage === 'typescript' && currentTestIndex === 6 ? 'selected-test' : ''}>Generics 1</button>
            <button onClick={() => handleTextSelection('typescript', 7)} disabled={isTimerRunning} className={currentLanguage === 'typescript' && currentTestIndex === 7 ? 'selected-test' : ''}>Generics 2</button>
            <button onClick={() => handleTextSelection('typescript', 8)} disabled={isTimerRunning} className={currentLanguage === 'typescript' && currentTestIndex === 8 ? 'selected-test' : ''}>String Enum</button>
            <button onClick={() => handleTextSelection('typescript', 9)} disabled={isTimerRunning} className={currentLanguage === 'typescript' && currentTestIndex === 9 ? 'selected-test' : ''}>Numeric Enum</button>
          </div>
        </div>
      </div>

      <div className="start-button-container">
        <button 
          onClick={handleStartTimer} 
          disabled={!practiceTextState}
          className={`start-button ${isTimerRunning ? 'stop-button' : ''}`}
        >
          Start test
        </button>
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
