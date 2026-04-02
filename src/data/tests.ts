export type TestCategoryKey =
  | 'jsAlgorithms'
  | 'reactHooks'
  | 'jsFundamentals'
  | 'typescript'
  | 'restApi'
  | 'asyncAwait'
  | 'nextJs';

export type PracticeTest = {
  name: string;
  text: string;
};

export type TestCategory = {
  key: TestCategoryKey;
  label: string;
  tests: PracticeTest[];
};

const jsAlgorithms: PracticeTest[] = [
  {
    name: 'Bubble Sort',
    text:
      'function bubbleSort(arr) {\n  const a = [...arr];\n  for (let i = 0; i < a.length - 1; i++)\n    for (let j = 0; j < a.length - 1 - i; j++)\n      if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];\n  return a;\n}\nconst result = bubbleSort([5, 2, 8, 1, 9]);\nconsole.log(result);',
  },
  {
    name: 'Quick Sort',
    text:
      'function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const p = arr[0], left = arr.slice(1).filter(x => x <= p), right = arr.slice(1).filter(x => x > p);\n  return [...quickSort(left), p, ...quickSort(right)];\n}\nconst result = quickSort([5, 2, 8, 1, 9]);\nconsole.log(result);',
  },
  {
    name: 'Merge Sort',
    text:
      'function merge(l, r) {\n  const out = [];\n  while (l.length && r.length) out.push(l[0] <= r[0] ? l.shift() : r.shift());\n  return [...out, ...l, ...r];\n}\nfunction mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  const m = Math.floor(arr.length / 2);\n  return merge(mergeSort(arr.slice(0, m)), mergeSort(arr.slice(m)));\n}\nconst result = mergeSort([5, 2, 8, 1, 9]);\nconsole.log(result);',
  },
  {
    name: 'Binary Search',
    text:
      'function binarySearch(arr, target) {\n  let lo = 0, hi = arr.length - 1;\n  while (lo <= hi) {\n    const m = (lo + hi) >> 1;\n    if (arr[m] === target) return m;\n    arr[m] < target ? lo = m + 1 : hi = m - 1;\n  }\n  return -1;\n}\nconst result = binarySearch([1, 3, 5, 7, 9], 5);\nconsole.log(result);',
  },
  {
    name: 'Linear Search',
    text:
      'function linearSearch(arr, target) {\n  for (let i = 0; i < arr.length; i++) if (arr[i] === target) return i;\n  return -1;\n}\nconst result = linearSearch([3, 7, 2, 9, 4], 9);\nconsole.log(result);',
  },
  {
    name: 'Bubble Sort Component',
    text:
      'function SortComponent() {\n  const [arr] = useState([5, 2, 8, 1, 9]);\n  const [result, setResult] = useState([]);\n  const [isSorted, setIsSorted] = useState(false);\n  const bubbleSort = (a) => {\n    const copy = [...a];\n    for (let i = 0; i < copy.length - 1; i++)\n      for (let j = 0; j < copy.length - 1 - i; j++)\n        if (copy[j] > copy[j + 1]) [copy[j], copy[j + 1]] = [copy[j + 1], copy[j]];\n    return copy;\n  };\n  const toggleSort = () => {\n    if (!isSorted) setResult(bubbleSort(arr));\n    else setResult([]);\n    setIsSorted(!isSorted);\n  };\n  return (\n    <div>\n      <button onClick={toggleSort}>{isSorted ? \"Reset\" : \"Sort\"}</button>\n      <div>Original: {arr.join(\", \")}</div>\n      <div>Sorted: {result.join(\", \")}</div>\n    </div>\n  );\n}',
  },
];

const reactHooks: PracticeTest[] = [
  {
    name: 'useState',
    text:
      'const [count, setCount] = useState(0);\nconst increment = () => setCount(count + 1);\nreturn (\n  <div>\n    <p>Count: {count}</p>\n    <button onClick={increment}>Increment</button>\n  </div>\n);',
  },
  {
    name: 'useEffect',
    text:
      'useEffect(() => {\n  document.title = `Count: ${count}`;\n  return () => {\n    document.title = "React App";\n  };\n}, [count]);',
  },
  {
    name: 'useContext',
    text:
      'const ThemeContext = createContext("light");\nconst theme = useContext(ThemeContext);\nreturn <div className={theme}>Current theme: {theme}</div>;',
  },
  {
    name: 'useReducer',
    text:
      'const reducer = (state, action) => {\n  switch (action.type) {\n    case "increment": return { count: state.count + 1 };\n    case "decrement": return { count: state.count - 1 };\n    default: return state;\n  }\n};\nconst [state, dispatch] = useReducer(reducer, { count: 0 });',
  },
  {
    name: 'useMemo',
    text:
      'const expensiveValue = useMemo(() => {\n  return items.reduce((sum, item) => sum + item.value, 0);\n}, [items]);',
  },
  {
    name: 'useCallback',
    text:
      'const memoizedCallback = useCallback(() => {\n  doSomething(a, b);\n}, [a, b]);',
  },
  {
    name: 'useRef',
    text:
      'const inputRef = useRef(null);\nconst focusInput = () => inputRef.current?.focus();\nreturn <input ref={inputRef} />;',
  },
  {
    name: 'useLayoutEffect',
    text:
      'useLayoutEffect(() => {\n  const rect = elementRef.current.getBoundingClientRect();\n  setPosition({ x: rect.x, y: rect.y });\n}, [dependencies]);',
  },
];

const jsFundamentals: PracticeTest[] = [
  {
    name: 'Map',
    text: 'const numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(num => num * 2);\nconsole.log(doubled);',
  },
  {
    name: 'Filter',
    text: 'const numbers = [1, 2, 3, 4, 5, 6];\nconst evens = numbers.filter(num => num % 2 === 0);\nconsole.log(evens);',
  },
  {
    name: 'Reduce',
    text: 'const numbers = [1, 2, 3, 4, 5];\nconst sum = numbers.reduce((acc, num) => acc + num, 0);\nconsole.log(sum);',
  },
  {
    name: 'Arrow Functions',
    text: 'const greet = (name) => `Hello, ${name}!`;\nconst multiply = (a, b) => a * b;\nconst squared = [1, 2, 3].map(n => n * n);\nconsole.log(greet("World"), multiply(5, 3), squared);',
  },
  {
    name: 'Functions',
    text:
      'function calculateArea(width, height) {\n  return width * height;\n}\nfunction greetUser(name, age) {\n  return `Hello ${name}, you are ${age} years old`;\n}\nconsole.log(calculateArea(10, 5), greetUser("Alice", 30));',
  },
  {
    name: 'Bind/Call/Apply',
    text:
      'const person = { name: "John", age: 30 };\nfunction introduce(city, country) {\n  return `${this.name} is ${this.age} from ${city}, ${country}`;\n}\nconst bound = introduce.bind(person);\nconst called = introduce.call(person, "NYC", "USA");\nconst applied = introduce.apply(person, ["NYC", "USA"]);\nconsole.log(bound(), called, applied);',
  },
];

const typescript: PracticeTest[] = [
  {
    name: 'Basic Types',
    text:
      'let name: string = "John";\nlet age: number = 30;\nlet isActive: boolean = true;\nlet items: string[] = ["apple", "banana"];\nlet user: { name: string; age: number } = { name: "Alice", age: 25 };',
  },
  {
    name: 'Union Types',
    text:
      'type Status = "pending" | "completed" | "failed";\nlet currentStatus: Status = "pending";\ntype ID = string | number;\nlet userId: ID = "123";',
  },
  {
    name: 'Function Types',
    text:
      'function greet(name: string): string {\n  return `Hello, ${name}!`;\n}\nfunction add(a: number, b: number): number {\n  return a + b;\n}\nconst result = greet("World");\nconst sum = add(5, 3);',
  },
  {
    name: 'Interface 1',
    text:
      'interface User {\n  name: string;\n  age: number;\n  email: string;\n}\nconst user: User = {\n  name: "John",\n  age: 30,\n  email: "john@example.com"\n};',
  },
  {
    name: 'Interface 2',
    text:
      'interface Animal {\n  name: string;\n  speak(): void;\n}\nclass Dog implements Animal {\n  name: string;\n  constructor(name: string) { this.name = name; }\n  speak() { console.log(`${this.name} barks`); }\n}',
  },
  {
    name: 'Optional Properties',
    text:
      'interface Config {\n  apiUrl: string;\n  timeout?: number;\n  retries: number;\n}\nconst config: Config = {\n  apiUrl: "https://api.example.com",\n  retries: 3\n};',
  },
  {
    name: 'Generics 1',
    text:
      'function identity<T>(arg: T): T {\n  return arg;\n}\nconst num = identity<number>(42);\nconst str = identity<string>("hello");',
  },
  {
    name: 'Generics 2',
    text:
      'interface Box<T> {\n  value: T;\n}\nconst numberBox: Box<number> = { value: 42 };\nconst stringBox: Box<string> = { value: "hello" };',
  },
  {
    name: 'String Enum',
    text:
      'enum Color {\n  Red = "red",\n  Green = "green",\n  Blue = "blue"\n}\nconst favoriteColor: Color = Color.Red;',
  },
  {
    name: 'Numeric Enum',
    text:
      'enum Status {\n  Pending,\n  Completed,\n  Failed\n}\nlet currentStatus = Status.Pending;',
  },
  {
    name: 'PA/OM/PI/RE',
    text:
      'interface User { id: number; name: string; email: string; }\ntype PartialUser = Partial<User>;\ntype UserWithoutEmail = Omit<User, "email">;\ntype UserNameOnly = Pick<User, "name">;\ntype UserRecord = Record<string, User>;',
  },
];

const restApi: PracticeTest[] = [
  {
    name: 'Promises',
    text:
      'const promise = new Promise((resolve, reject) => {\n  setTimeout(() => resolve("done"), 1000);\n});\npromise.then(val => console.log(val)).catch(err => console.error(err));',
  },
  {
    name: 'Fetch + then',
    text:
      'const fetchData = () => {\n  return fetch("https://api.example.com/users")\n    .then(res => res.json())\n    .then(data => console.log(data));\n};',
  },
  {
    name: 'Fetch GET',
    text:
      'fetch("https://api.example.com/users", {\n  method: "GET",\n  headers: { "Content-Type": "application/json" }\n}).then(res => res.json()).then(data => console.log(data));',
  },
  {
    name: 'Fetch POST',
    text:
      'fetch("https://api.example.com/users", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({ name: "John", email: "john@example.com" })\n}).then(res => res.json());',
  },
  {
    name: 'Axios GET',
    text:
      'const axios = require("axios");\naxios.get("https://api.example.com/users")\n  .then(res => console.log(res.data))\n  .catch(err => console.error(err));',
  },
  {
    name: 'Axios POST',
    text:
      'axios.post("https://api.example.com/users", {\n  name: "Jane",\n  email: "jane@example.com"\n}).then(res => res.data);',
  },
  {
    name: 'Async/await',
    text:
      'async function getUsers() {\n  const response = await fetch("https://api.example.com/users");\n  const data = await response.json();\n  return data;\n}',
  },
  {
    name: 'Async try/catch',
    text:
      'async function fetchData() {\n  try {\n    const res = await fetch(url);\n    const json = await res.json();\n    return json;\n  } catch (err) {\n    console.error(err);\n  }\n}',
  },
  {
    name: 'Promise.all',
    text:
      'const urls = ["/api/a", "/api/b", "/api/c"];\nconst results = await Promise.all(urls.map(url => fetch(url).then(r => r.json())));',
  },
  {
    name: 'REST PUT',
    text:
      'const options = {\n  method: "PUT",\n  headers: { "Authorization": `Bearer ${token}` },\n  body: JSON.stringify(updates)\n};\nfetch(`${baseUrl}/users/${id}`, options);',
  },
];

const asyncAwait: PracticeTest[] = [
  {
    name: 'async react component',
    text: `import React, { useEffect, useState } from 'react';

function MyComponent() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://api.example.com/data');
        if (!response.ok) {
          throw new Error('Network error: ' + response.status);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Data:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}`,
  },
];

const nextJs: PracticeTest[] = [
  {
    name: 'v13 SSR/SSG',
    text: `import React from 'react';

export default async function PostsPage() {
  const res = await fetch('https://api.example.com/posts');
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const posts = await res.json();

  return (
    <div>
      <h1>Posts list</h1>
      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}`,
  },
  {
    name: 'v13+ ISR',
    text: `import React from 'react';

export default async function Article({ params }) {
  const res = await fetch(
    \`https://api.example.com/article/\${params.id}\`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const article = await res.json();

  return (
    <div>
      <h1>{article.title}</h1>
      <p>{article.content}</p>
    </div>
  );
}`,
  },
];

export const TEST_CATEGORIES: TestCategory[] = [
  { key: 'reactHooks', label: 'React Hooks:', tests: reactHooks },
  { key: 'jsFundamentals', label: 'JS Fundamentals:', tests: jsFundamentals },
  { key: 'typescript', label: 'TypeScript:', tests: typescript },
  { key: 'restApi', label: 'REST API:', tests: restApi },
  { key: 'asyncAwait', label: 'Async await:', tests: asyncAwait },
  { key: 'jsAlgorithms', label: 'JS Algorithms:', tests: jsAlgorithms },
  { key: 'nextJs', label: 'Next.js:', tests: nextJs },
];

