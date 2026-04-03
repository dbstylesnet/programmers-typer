export type TestCategoryKey =
  | 'jsAlgorithms'
  | 'reactHooks'
  | 'jsFundamentals'
  | 'typescript'
  | 'restApi'
  | 'asyncAwait'
  | 'nextJs';

/** Two-part copy for the EXPLANATION block: plain language for beginners */
export type TestExplanationParts = {
  whatItDoes: string;
  typicalUse: string;
};

export type PracticeTest = {
  name: string;
  text: string;
  explanation: TestExplanationParts;
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
    explanation: {
      whatItDoes:
        'Imagine you are lining up books on a shelf by height, but you can only compare two neighbors at a time. Bubble sort keeps walking the line from left to right; whenever the left book is taller than the right one, you swap them. You repeat that whole pass again and again. Each time, the biggest items “float” toward the end like bubbles, until nothing is out of order anymore. It is easy to picture, which is why teachers love it—but it does a lot of extra work on long lists.',
      typicalUse:
        'In day-to-day apps you rarely ship bubble sort for huge datasets; teams reach for faster algorithms instead. You still bump into the idea when you are learning, practicing for interviews, or reading someone’s first homework solution. Think of it as training wheels: great for understanding what “sorted” means, not usually your go-to for production scale.',
    },
  },
  {
    name: 'Quick Sort',
    text:
      'function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const p = arr[0], left = arr.slice(1).filter(x => x <= p), right = arr.slice(1).filter(x => x > p);\n  return [...quickSort(left), p, ...quickSort(right)];\n}\nconst result = quickSort([5, 2, 8, 1, 9]);\nconsole.log(result);',
    explanation: {
      whatItDoes:
        'Quick sort is a bit like organizing a messy pile by picking one item as a reference—the “pivot”—and putting everything smaller on one side and everything bigger on the other. Then you do the same thing inside each smaller pile until there is nothing left to split. Because you keep cutting the problem in half, it tends to feel fast in practice, especially compared to bubble sort, though the exact speed depends on how lucky your pivot choices are.',
      typicalUse:
        'When an app needs to sort big lists often—leaderboards, spreadsheets in the browser, analytics views, anything where users expect instant reordering—engineers often rely on algorithms in this family (or whatever the language runtime already uses under the hood). You might not write quick sort from scratch every week, but understanding it helps you see why sorting big data is not always “free.”',
    },
  },
  {
    name: 'Merge Sort',
    text:
      'function merge(l, r) {\n  const out = [];\n  while (l.length && r.length) out.push(l[0] <= r[0] ? l.shift() : r.shift());\n  return [...out, ...l, ...r];\n}\nfunction mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  const m = Math.floor(arr.length / 2);\n  return merge(mergeSort(arr.slice(0, m)), mergeSort(arr.slice(m)));\n}\nconst result = mergeSort([5, 2, 8, 1, 9]);\nconsole.log(result);',
    explanation: {
      whatItDoes:
        'Picture two sorted stacks of playing cards. Merge sort splits your list down until you have tiny one-card “stacks,” then merges pairs of stacks by always pulling the smaller front card first. When two sorted halves become one sorted whole, you repeat that merge step up the tree. The neat part is the behavior is very predictable: it always takes about the same amount of work for a given size, which can be comforting when you are reasoning about performance.',
      typicalUse:
        'Teams reach for merge-style thinking when they need stable sorts (if two items tie, their original order stays) or when they merge streams that are already sorted—think combining log lines, joining sorted API pages, or multi-step table sorting. You might use a built-in sort that uses similar ideas rather than coding merge sort by hand, but the mental model shows up in interviews and in data-heavy features.',
    },
  },
  {
    name: 'Binary Search',
    text:
      'function binarySearch(arr, target) {\n  let lo = 0, hi = arr.length - 1;\n  while (lo <= hi) {\n    const m = (lo + hi) >> 1;\n    if (arr[m] === target) return m;\n    arr[m] < target ? lo = m + 1 : hi = m - 1;\n  }\n  return -1;\n}\nconst result = binarySearch([1, 3, 5, 7, 9], 5);\nconsole.log(result);',
    explanation: {
      whatItDoes:
        'Binary search is the “phone book” trick: if names are alphabetical and you open the book in the middle, you can tell in one glance whether your name is in the left half or the right half. You throw away the wrong half and repeat. Each step cuts the remaining space in half, so even a huge sorted list gets found in relatively few steps. The catch is simple: your data must already be sorted, or the trick does not work.',
      typicalUse:
        'Anywhere you repeatedly look things up in ordered data—finding a version in a changelog, jumping to a timestamp in logs, powering fast lookups behind autocomplete, or checking IDs in a sorted table. If your data is not sorted, you sort once or keep it sorted so this pattern stays available; it is one of the most useful ideas to recognize as you grow past beginner loops.',
    },
  },
  {
    name: 'Linear Search',
    text:
      'function linearSearch(arr, target) {\n  for (let i = 0; i < arr.length; i++) if (arr[i] === target) return i;\n  return -1;\n}\nconst result = linearSearch([3, 7, 2, 9, 4], 9);\nconsole.log(result);',
    explanation: {
      whatItDoes:
        'Linear search is the straightforward approach we all use without thinking: start at the front, look at item one, then two, then three, until you either find what you want or run out of items. No preparation needed—your list can be messy, duplicated, or tiny. The downside is that if the thing you want is at the end of a long line, you still have to walk the whole line.',
      typicalUse:
        'Perfect when you only have a handful of things, or when data is unsorted and you are prototyping. Many beginners write this first; then, as lists grow, you learn maps, sets, or sorting plus binary search so lookups stop feeling slow. Do not feel bad starting here—everyone does.',
    },
  },
  {
    name: 'Bubble Sort Component',
    text:
      'function SortComponent() {\n  const [arr] = useState([5, 2, 8, 1, 9]);\n  const [result, setResult] = useState([]);\n  const [isSorted, setIsSorted] = useState(false);\n  const bubbleSort = (a) => {\n    const copy = [...a];\n    for (let i = 0; i < copy.length - 1; i++)\n      for (let j = 0; j < copy.length - 1 - i; j++)\n        if (copy[j] > copy[j + 1]) [copy[j], copy[j + 1]] = [copy[j + 1], copy[j]];\n    return copy;\n  };\n  const toggleSort = () => {\n    if (!isSorted) setResult(bubbleSort(arr));\n    else setResult([]);\n    setIsSorted(!isSorted);\n  };\n  return (\n    <div>\n      <button onClick={toggleSort}>{isSorted ? \"Reset\" : \"Sort\"}</button>\n      <div>Original: {arr.join(\", \")}</div>\n      <div>Sorted: {result.join(\", \")}</div>\n    </div>\n  );\n}',
    explanation: {
      whatItDoes:
        'This snippet mixes the same bubble-sort idea with React’s state. When someone clicks “Sort,” you run the algorithm on a copy of the array, stash the result in state, and React redraws the UI so the user sees the numbers in order. Click “Reset” and you clear that result. It is a friendly bridge between “algorithms on paper” and “something a person actually clicks in a browser.”',
      typicalUse:
        'You will see this pattern in tutorials, portfolio demos, coding bootcamp homework, or small internal tools where the goal is to show how an algorithm behaves—not to crunch millions of rows. For heavy production sorting, teams usually delegate to optimized libraries or the database, but this version is wonderful for learning.',
    },
  },
];

const reactHooks: PracticeTest[] = [
  {
    name: 'useState',
    text:
      'const [count, setCount] = useState(0);\nconst increment = () => setCount(count + 1);\nreturn (\n  <div>\n    <p>Count: {count}</p>\n    <button onClick={increment}>Increment</button>\n  </div>\n);',
    explanation: {
      whatItDoes:
        'useState gives your component a piece of memory that React keeps for you between renders. You get back two things: the current value (like count) and a function to change it (setCount). When you call that setter, React knows something important changed, so it runs your component again and updates what appears on screen. If you are new, think of it as: “this variable belongs to this screen, and when I change it, redraw.”',
      typicalUse:
        'You will use this constantly: what the user typed in a text box, whether a menu is open, which step of a form you are on, how many items are in a tiny counter demo—basically any time the UI should react to a click or keystroke. It is usually the first hook people learn, and honestly you never really stop needing it.',
    },
  },
  {
    name: 'useEffect',
    text:
      'useEffect(() => {\n  document.title = `Count: ${count}`;\n  return () => {\n    document.title = "React App";\n  };\n}, [count]);',
    explanation: {
      whatItDoes:
        'Rendering JSX is supposed to stay pure and predictable, but real apps also need side work: hit an API, subscribe to a WebSocket, update the browser tab title, start a timer. useEffect is React’s way of saying, “after you have painted this screen, go do this extra stuff.” You can also return a cleanup function from the effect—React runs it when dependencies change or when the user navigates away—so you unsubscribe or clear timers instead of leaking them.',
      typicalUse:
        'Fetching a list when a page loads, listening for window resize, syncing document.title with your app state, firing analytics when something changes, or subscribing to a live channel. If you are unsure whether something belongs in render or in an effect, ask: “should this run because the user sees the component?” If yes, effect territory is common.',
    },
  },
  {
    name: 'useContext',
    text:
      'const ThemeContext = createContext("light");\nconst theme = useContext(ThemeContext);\nreturn <div className={theme}>Current theme: {theme}</div>;',
    explanation: {
      whatItDoes:
        'Sometimes a value—like “dark mode” or “logged-in user”—needs to reach deeply nested components. Passing it as props through every layer in between gets old fast; people call that “prop drilling.” Context lets a parent wrap children in a Provider with a value, and any descendant can call useContext to read it directly. You still should not put everything in context (it can make updates hard to trace), but for a few app-wide settings it feels like a breath of fresh air.',
      typicalUse:
        'Color theme toggles, the current locale for translations, who is signed in, or feature flags that many screens read. Picture a tree of components: instead of threading the same prop through ten wrappers, the ones that care just subscribe to the context.',
    },
  },
  {
    name: 'useReducer',
    text:
      'const reducer = (state, action) => {\n  switch (action.type) {\n    case "increment": return { count: state.count + 1 };\n    case "decrement": return { count: state.count - 1 };\n    default: return state;\n  }\n};\nconst [state, dispatch] = useReducer(reducer, { count: 0 });',
    explanation: {
      whatItDoes:
        'useReducer is like having a tiny state machine inside your component. You keep one state object, and instead of many separate setters you dispatch actions with a type—{ type: "increment" }—and a reducer function decides the next state. That sounds like extra ceremony at first, but when several buttons all tweak the same blob of data, it keeps updates organized and easier to debug than a pile of separate useState calls.',
      typicalUse:
        'Shopping carts, multi-step wizards, big forms with lots of fields, or any screen where one user action should update several related values at once. If you have heard of Redux, this is the same mental model but scoped to one component subtree.',
    },
  },
  {
    name: 'useMemo',
    text:
      'const expensiveValue = useMemo(() => {\n  return items.reduce((sum, item) => sum + item.value, 0);\n}, [items]);',
    explanation: {
      whatItDoes:
        'On every render your function runs again from top to bottom. Sometimes you compute something expensive—summing thousands of rows, filtering a huge list—and you do not want to redo that work unless the inputs actually changed. useMemo wraps that calculation, remembers the last answer, and only recomputes when the dependencies you list (like items) change. Think “cache this derived value for me.”',
      typicalUse:
        'Totals on a cart, derived lists for tables, or values you pass into React.memo children so they skip re-rendering when the underlying data did not move. You do not need it everywhere—premature useMemo can clutter code—but it helps when you measure a real slowdown.',
    },
  },
  {
    name: 'useCallback',
    text:
      'const memoizedCallback = useCallback(() => {\n  doSomething(a, b);\n}, [a, b]);',
    explanation: {
      whatItDoes:
        'In JavaScript, a new function is a new object each render. That usually does not matter, but if you pass a callback to a memoized child or list it in a dependency array, “new function every time” can trigger extra renders or effects. useCallback returns the same function reference until its dependencies change, so you can say: “this handler is still the same one as last render if a and b did not change.”',
      typicalUse:
        'Handing stable click handlers into long lists wrapped in React.memo, or satisfying dependency arrays in useEffect without accidentally re-running the effect every single render. Pair it with useMemo when you are optimizing; skip it until you have a concrete reason.',
    },
  },
  {
    name: 'useRef',
    text:
      'const inputRef = useRef(null);\nconst focusInput = () => inputRef.current?.focus();\nreturn <input ref={inputRef} />;',
    explanation: {
      whatItDoes:
        'useRef gives you a plain object with a .current field that sticks around for the whole life of the component. Changing .current does not tell React to re-render—unlike setState. People often attach it to a DOM node via the ref prop so you can call focus(), measure size, or scroll. You can also stash timers, animation frame IDs, or “the latest props” you want an old callback to see.',
      typicalUse:
        'Focus the search box when a modal opens, measure a div before positioning a tooltip, store setInterval IDs so you clear them on unmount, or hold a mutable flag without causing another paint. It is one of those tools that feels confusing until the day you need it—and then it clicks.',
    },
  },
  {
    name: 'useLayoutEffect',
    text:
      'useLayoutEffect(() => {\n  const rect = elementRef.current.getBoundingClientRect();\n  setPosition({ x: rect.x, y: rect.y });\n}, [dependencies]);',
    explanation: {
      whatItDoes:
        'useLayoutEffect is the sibling of useEffect with tighter timing: React runs it immediately after DOM changes but before the browser shows the frame to the user. That lets you measure where something landed on screen and adjust—say, move a tooltip so it does not hang off the edge—without the user seeing a one-frame flicker. The trade-off is it can block painting, so you reserve it for layout-sensitive tweaks.',
      typicalUse:
        'Positioning popovers and tooltips from measured element rects, syncing scroll position, or running tiny DOM corrections where a visible jump would feel buggy. If useEffect causes a flash, layout effect is sometimes the fix—just do not overuse it on heavy work.',
    },
  },
  {
    name: 'React.memo',
    text:
      'const TodoRow = React.memo(function TodoRow({ title, done }) {\n  return (\n    <li className={done ? "completed" : ""}>\n      <span>{title}</span>\n    </li>\n  );\n});\n\nfunction TodoList({ items }) {\n  return (\n    <ul>\n      {items.map((item) => (\n        <TodoRow key={item.id} title={item.title} done={item.done} />\n      ))}\n    </ul>\n  );\n}',
    explanation: {
      whatItDoes:
        'React.memo wraps a component and tells React: “if this component’s props are shallowly the same as last time, reuse the last output instead of running the function again.” It is not a hook, but it lives next to the hooks mental model because people pair it with useCallback and useMemo. Your component still re-renders when its props actually change; it just skips work when the parent re-renders for unrelated reasons.',
      typicalUse:
        'Long lists, heavy child trees, or charts where the parent updates often but most rows or tiles receive the same props. Profile with the React DevTools before wrapping everything—memo helps when you have measured a real cost, not as a default blanket on every component.',
    },
  },
  {
    name: 'Suspense',
    text:
      'import { Suspense, lazy } from "react";\n\nconst ReportChart = lazy(() => import("./ReportChart"));\n\nfunction AnalyticsPage({ range }) {\n  return (\n    <div>\n      <h1>Analytics</h1>\n      <Suspense fallback={<p>Loading chart…</p>}>\n        <ReportChart range={range} />\n      </Suspense>\n    </div>\n  );\n}',
    explanation: {
      whatItDoes:
        'Suspense is a boundary: you wrap async UI (often code-split with lazy(), or data-fetching patterns that suspend) and give React a fallback—usually a spinner or skeleton—to show while the child is not ready yet. When the lazy chunk loads or the suspended work resolves, React swaps in the real component. Think of it as “this subtree might pause; here is what to paint meanwhile.”',
      typicalUse:
        'Route-level code splitting, heavy widgets loaded on demand, and modern data APIs that integrate with suspense boundaries. You will see it in Next.js and React 18+ examples whenever the app should stay responsive while something slower loads in the background.',
    },
  },
];

const jsFundamentals: PracticeTest[] = [
  {
    name: 'Map',
    text: 'const numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(num => num * 2);\nconsole.log(doubled);',
    explanation: {
      whatItDoes:
        'map is your “transform every item” helper. You give it an array and a small function; it runs that function on each element and collects the return values into a brand-new array. The original array stays untouched, which is nice when you do not want to accidentally mutate data you got from props or an API.',
      typicalUse:
        'Almost every React list: you fetch an array of users and map each one to a <li> or a table row. Same idea for doubling numbers, formatting currency strings, or turning raw JSON into view-friendly objects. Once map clicks, you will reach for it constantly.',
    },
  },
  {
    name: 'Filter',
    text: 'const numbers = [1, 2, 3, 4, 5, 6];\nconst evens = numbers.filter(num => num % 2 === 0);\nconsole.log(evens);',
    explanation: {
      whatItDoes:
        'filter looks at each item and asks your function: “should we keep this?” If you return true, the item stays; if false, it is left out. You get a new array with only the survivors. Length can shrink; nothing is modified in place.',
      typicalUse:
        'A search field that narrows a product list, a toggle for “show only completed todos,” hiding admin-only menu links for normal users, or trimming an API response down to what the screen actually needs. Pair filter with map often: filter first to shrink, then map to display.',
    },
  },
  {
    name: 'Reduce',
    text: 'const numbers = [1, 2, 3, 4, 5];\nconst sum = numbers.reduce((acc, num) => acc + num, 0);\nconsole.log(sum);',
    explanation: {
      whatItDoes:
        'reduce can feel weird at first because it is super general. You walk the array once while carrying a running value—the “accumulator.” Each step you combine the current item with that accumulator and pass the new accumulator forward. At the end you return one result: maybe a sum, maybe an object that groups items by key, maybe even another array you built step by step.',
      typicalUse:
        'Shopping cart totals, counting votes, grouping rows by category for a chart, or turning a list into a lookup object like { id: user }. Beginners often avoid reduce; then one day you need a single pass that builds something rich, and it starts to make sense.',
    },
  },
  {
    name: 'Arrow Functions',
    text: 'const greet = (name) => `Hello, ${name}!`;\nconst multiply = (a, b) => a * b;\nconst squared = [1, 2, 3].map(n => n * n);\nconsole.log(greet("World"), multiply(5, 3), squared);',
    explanation: {
      whatItDoes:
        'Arrow functions are a compact syntax for writing small functions: (x) => x * 2 instead of function (x) { return x * 2; }. They also capture this from the surrounding scope, which saves headaches in older class-based code. For beginners, the big win is readability inside map, filter, and event handlers.',
      typicalUse:
        'Everywhere in modern frontends: inline onClick handlers, callbacks passed to array methods, little helpers next to your data. In React you will see them constantly in JSX. You can still use the function keyword when you want a hoisted named function—both styles have a place.',
    },
  },
  {
    name: 'Functions',
    text:
      'function calculateArea(width, height) {\n  return width * height;\n}\nfunction greetUser(name, age) {\n  return `Hello ${name}, you are ${age} years old`;\n}\nconsole.log(calculateArea(10, 5), greetUser("Alice", 30));',
    explanation: {
      whatItDoes:
        'A regular function is a reusable chunk of logic with a name, parameters, and an optional return value. You define it once and call it whenever you need that behavior. function declarations are “hoisted,” meaning the engine knows about them before it runs line-by-line, so you can sometimes call them above where they appear in the file—handy once you are comfortable reading stack traces.',
      typicalUse:
        'Validation helpers, formatting dates and money, calculating shipping, anything you export from a utils file and import in many components. When logic grows past a few lines or gets reused, pull it into a named function so your JSX stays readable.',
    },
  },
  {
    name: 'Bind/Call/Apply',
    text:
      'const person = { name: "John", age: 30 };\nfunction introduce(city, country) {\n  return `${this.name} is ${this.age} from ${city}, ${country}`;\n}\nconst bound = introduce.bind(person);\nconst called = introduce.call(person, "NYC", "USA");\nconst applied = introduce.apply(person, ["NYC", "USA"]);\nconsole.log(bound(), called, applied);',
    explanation: {
      whatItDoes:
        'In JavaScript, this depends on how a function is called—not always obvious. call and apply let you invoke a function while explicitly choosing what this should point to; call takes arguments separately, apply takes them as an array. bind is different: it creates a new function with this (and optionally some arguments) baked in, which you can pass around and call later.',
      typicalUse:
        'You see these more in older object-oriented code, some Node APIs, or libraries that were written before arrow functions were everywhere. Modern React often avoids manual this juggling, but when you inherit a legacy codebase, recognizing bind/call/apply saves a lot of confusion.',
    },
  },
];

const typescript: PracticeTest[] = [
  {
    name: 'Basic Types',
    text:
      'let name: string = "John";\nlet age: number = 30;\nlet isActive: boolean = true;\nlet items: string[] = ["apple", "banana"];\nlet user: { name: string; age: number } = { name: "Alice", age: 25 };',
    explanation: {
      whatItDoes:
        'TypeScript lets you attach labels to your data: this is a string, that is a number, here is an array of strings, this object must have name and age. The compiler then checks your code before it runs and gently yells if you try to treat a number like text or forget a required field. Your editor also gets much smarter autocomplete because it knows what each variable is supposed to be.',
      typicalUse:
        'From day one in a TS project: describing JSON from your API, typing React props, configuration objects, and shared models imported across files. Think of it as spell-check for your program’s shape—it catches a whole class of “oops” bugs while you type.',
    },
  },
  {
    name: 'Union Types',
    text:
      'type Status = "pending" | "completed" | "failed";\nlet currentStatus: Status = "pending";\ntype ID = string | number;\nlet userId: ID = "123";',
    explanation: {
      whatItDoes:
        'A union type means “this value can be A or B—or only one of these exact strings.” Instead of any string for a status, you might allow only "pending" | "shipped" | "delivered." The compiler then stops you from assigning a typo like "pendng" and forces you to handle each branch in if/switch. It is a friendly way to model real-world variation without giving up safety.',
      typicalUse:
        'Loading vs error vs success in UI, IDs that sometimes arrive as numbers and sometimes as strings from messy backends, theme names, button variants—anywhere you have a small set of legal options instead of the wide open world of string.',
    },
  },
  {
    name: 'Function Types',
    text:
      'function greet(name: string): string {\n  return `Hello, ${name}!`;\n}\nfunction add(a: number, b: number): number {\n  return a + b;\n}\nconst result = greet("World");\nconst sum = add(5, 3);',
    explanation: {
      whatItDoes:
        'You spell out the contract of a function: these parameter types go in, this type comes out. Callers then get red squiggles if they pass the wrong thing, and your editor can suggest parameter names and return fields. It is documentation that the computer actually enforces.',
      typicalUse:
        'Shared utilities in a lib folder, API client methods, and callback props you pass between components. Whenever two parts of the app need to agree on how a function looks, typing it saves endless Slack messages.',
    },
  },
  {
    name: 'Interface 1',
    text:
      'interface User {\n  name: string;\n  age: number;\n  email: string;\n}\nconst user: User = {\n  name: "John",\n  age: 30,\n  email: "john@example.com"\n};',
    explanation: {
      whatItDoes:
        'An interface is a named recipe for an object: “a User has name, age, and email, each with these types.” Anything you mark as User must include those fields with compatible types. You can extend interfaces and reuse them, which helps your mental model stay consistent across the app.',
      typicalUse:
        'Modeling API responses, defining component props, sharing shapes between packages in a monorepo—basically anytime you say “this blob of JSON should always look like this.” Beginners often start with interfaces before they need fancier type tricks.',
    },
  },
  {
    name: 'Interface 2',
    text:
      'interface Animal {\n  name: string;\n  speak(): void;\n}\nclass Dog implements Animal {\n  name: string;\n  constructor(name: string) { this.name = name; }\n  speak() { console.log(`${this.name} barks`); }\n}',
    explanation: {
      whatItDoes:
        'Here the interface describes what any “Animal” must look like—at least a name and a speak method. A class can sign a contract: class Dog implements Animal means TypeScript checks that Dog really has everything Animal promised. If you forget speak(), the compiler complains before your users do.',
      typicalUse:
        'Plugin systems where many classes expose the same methods, game entities with shared behavior, or domain models in larger apps. Even if you prefer functions in React, you will still see this pattern in libraries and backends.',
    },
  },
  {
    name: 'Optional Properties',
    text:
      'interface Config {\n  apiUrl: string;\n  timeout?: number;\n  retries: number;\n}\nconst config: Config = {\n  apiUrl: "https://api.example.com",\n  retries: 3\n};',
    explanation: {
      whatItDoes:
        'The question mark on a property means “this field might not exist.” TypeScript forces you to check before you use it—optional chaining or an if—so you do not assume timeout is there when the server never sent it. Required fields stay strict; optional ones reflect messy reality.',
      typicalUse:
        'Settings objects where some keys are advanced, API responses where certain fields appear only for premium users, or forms where optional notes can be blank. It matches how JSON actually shows up in the wild.',
    },
  },
  {
    name: 'Generics 1',
    text:
      'function identity<T>(arg: T): T {\n  return arg;\n}\nconst num = identity<number>(42);\nconst str = identity<string>("hello");',
    explanation: {
      whatItDoes:
        'Generics let you write one function that works for many types without throwing away type information. The T is a placeholder: whoever calls the function picks what T is—number, User, anything—and TypeScript tracks that through the return value. You avoid copy-pasting the same logic for every type.',
      typicalUse:
        'Tiny helpers like “first element of array,” wrappers around fetch that parse JSON as a specific type, or shared list components. Once generics click, a lot of library code you read suddenly makes sense.',
    },
  },
  {
    name: 'Generics 2',
    text:
      'interface Box<T> {\n  value: T;\n}\nconst numberBox: Box<number> = { value: 42 };\nconst stringBox: Box<string> = { value: "hello" };',
    explanation: {
      whatItDoes:
        'Box<T> means “a box that holds a T.” You might have Box<number> or Box<string>; the structure is the same—there is a value field—but the type inside changes. TypeScript keeps the inner type linked so you cannot accidentally put a string where a number box was expected.',
      typicalUse:
        'Reusable UI components (a list of T), API response wrappers, cache slots, or any container type you use in more than one place with different payloads.',
    },
  },
  {
    name: 'String Enum',
    text:
      'enum Color {\n  Red = "red",\n  Green = "green",\n  Blue = "blue"\n}\nconst favoriteColor: Color = Color.Red;',
    explanation: {
      whatItDoes:
        'A string enum groups named choices that are still real strings at runtime—Color.Red might actually be "red". You refer to Color.Red in code instead of spelling the string by hand, so typos turn into compile errors and your editor can autocomplete the options.',
      typicalUse:
        'Theme names, Redux action types, dropdown values that must line up with the backend, CSS class variants—any fixed set of string tokens you do not want scattered as magic strings.',
    },
  },
  {
    name: 'Numeric Enum',
    text:
      'enum Status {\n  Pending,\n  Completed,\n  Failed\n}\nlet currentStatus = Status.Pending;',
    explanation: {
      whatItDoes:
        'Numeric enums give friendly names to numbers. TypeScript can auto-number them (0, 1, 2…) or you can assign specific values. At runtime you still have numbers, which can be handy when talking to old APIs or bit flags, even if string enums are often nicer for new web code.',
      typicalUse:
        'Interop with systems that expect integers, ordered steps where the numeric order matters, or legacy codebases that already store status codes as numbers. Newer projects sometimes prefer string unions instead, but numeric enums are still everywhere in the wild.',
    },
  },
  {
    name: 'PA/OM/PI/RE',
    text:
      'interface User { id: number; name: string; email: string; }\ntype PartialUser = Partial<User>;\ntype UserWithoutEmail = Omit<User, "email">;\ntype UserNameOnly = Pick<User, "name">;\ntype UserRecord = Record<string, User>;',
    explanation: {
      whatItDoes:
        'TypeScript ships helpers that reshape types without rewriting them by hand. Partial<User> means every field of User becomes optional—great for patches. Omit<User, "email"> removes a key. Pick<User, "name"> keeps only name. Record<string, User> means “any string key maps to a User.” You compose big types from small ones instead of duplicating.',
      typicalUse:
        'Update forms where you only send changed fields, public DTOs that hide internal columns, lookup tables keyed by id, or narrowing big API models down to what one screen needs. These utilities are bread-and-butter in real TS codebases.',
    },
  },
];

const restApi: PracticeTest[] = [
  {
    name: 'Promises',
    text:
      'const promise = new Promise((resolve, reject) => {\n  setTimeout(() => resolve("done"), 1000);\n});\npromise.then(val => console.log(val)).catch(err => console.error(err));',
    explanation: {
      whatItDoes:
        'A Promise is JavaScript’s way of saying “I do not have the answer yet, but I will.” You start some work that finishes later—network, timer, reading a file—and you get an object you can chain .then onto for success and .catch for failure. It flattens “callback soup” into a straighter line than nested functions.',
      typicalUse:
        'Everything async in the browser and Node eventually touches Promises: fetch, many database drivers, fs.promises. async/await is syntactic sugar on top of Promises, so understanding .then helps you read stack traces and older code.',
    },
  },
  {
    name: 'Fetch + then',
    text:
      'const fetchData = () => {\n  return fetch("https://api.example.com/users")\n    .then(res => res.json())\n    .then(data => console.log(data));\n};',
    explanation: {
      whatItDoes:
        'fetch returns a Promise for the HTTP response. That response is not automatically a JavaScript object—you often call .json() which itself returns another Promise. Chaining .then means “when fetch finishes, parse JSON; when that finishes, do something with data.” Each step hands the next step a value, which reads flatter than nested callbacks.',
      typicalUse:
        'Older tutorials, legacy codebases, or teammates who prefer promise chains over async/await. You will still read this style in production; knowing it helps you migrate or debug without panicking.',
    },
  },
  {
    name: 'Fetch GET',
    text:
      'fetch("https://api.example.com/users", {\n  method: "GET",\n  headers: { "Content-Type": "application/json" }\n}).then(res => res.json()).then(data => console.log(data));',
    explanation: {
      whatItDoes:
        'GET means “give me data, do not change anything on the server.” You call fetch with method GET (often the default) and optional headers—here Content-Type hints you expect JSON back. Then you parse res.json() into plain objects you can use in your UI.',
      typicalUse:
        'Populating a table of users, loading a profile page, fetching configuration, anything where the user is only reading. It is the bread and butter of talking to REST APIs from the browser.',
    },
  },
  {
    name: 'Fetch POST',
    text:
      'fetch("https://api.example.com/users", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({ name: "John", email: "john@example.com" })\n}).then(res => res.json());',
    explanation: {
      whatItDoes:
        'POST usually means “create something new” or “submit this payload.” You stringify a JavaScript object into JSON for the body, set headers so the server knows it is JSON, and send it off. The response might include the created record or an id you show back to the user.',
      typicalUse:
        'Sign-up and login flows, posting a new comment, creating a project, submitting a contact form—any time the user’s input should become a new row or event on the server.',
    },
  },
  {
    name: 'Axios GET',
    text:
      'const axios = require("axios");\naxios.get("https://api.example.com/users")\n  .then(res => console.log(res.data))\n  .catch(err => console.error(err));',
    explanation: {
      whatItDoes:
        'axios wraps the browser’s HTTP layer in a friendlier API. axios.get hits a URL; the response body already lives on res.data (often already parsed as JSON). .catch gathers network or status errors in one place. Many teams add interceptors once so every request attaches auth headers automatically.',
      typicalUse:
        'Apps that picked axios years ago and built middleware around it: shared base URL, retries, auth injection, consistent error toasts. You will maintain plenty of axios code even if fetch is built in.',
    },
  },
  {
    name: 'Axios POST',
    text:
      'axios.post("https://api.example.com/users", {\n  name: "Jane",\n  email: "jane@example.com"\n}).then(res => res.data);',
    explanation: {
      whatItDoes:
        'axios.post sends your JavaScript object as JSON without you manually calling JSON.stringify. The server’s reply lands in res.data again. Error handling stays similar to GET: network failures and non-2xx statuses route through catch or interceptors depending on how the project configured axios.',
      typicalUse:
        'Creating records from admin panels, saving form drafts, anything that mirrors the fetch POST use case but in a codebase that standardized on axios. BFF layers in Node often use axios to talk to upstream services too.',
    },
  },
  {
    name: 'Async/await',
    text:
      'async function getUsers() {\n  const response = await fetch("https://api.example.com/users");\n  const data = await response.json();\n  return data;\n}',
    explanation: {
      whatItDoes:
        'Mark a function async and you may use await inside it. Each await pauses that function until the Promise resolves, but it does not freeze the whole browser—other code keeps running. It reads top-to-bottom like synchronous code while still being non-blocking under the hood.',
      typicalUse:
        'Modern React data loading, Express route handlers, scripts that fetch then transform then save—any multi-step I/O where promise chains felt hard to read. Most new code you write will look like this.',
    },
  },
  {
    name: 'Async try/catch',
    text:
      'async function fetchData() {\n  try {\n    const res = await fetch(url);\n    const json = await res.json();\n    return json;\n  } catch (err) {\n    console.error(err);\n  }\n}',
    explanation: {
      whatItDoes:
        'await is great until something throws—network down, 500 error, invalid JSON. try/catch around your awaits lets you handle those failures in one place: log them, show a message, return a default. Without it, an unhandled rejection can leave your UI stuck or noisy in the console.',
      typicalUse:
        'Real user-facing features: show “could not load” states, report to error tracking, retry once, or fall back to cached data. Basically any production fetch path should think about what happens when the world is not perfect.',
    },
  },
  {
    name: 'Promise.all',
    text:
      'const urls = ["/api/a", "/api/b", "/api/c"];\nconst results = await Promise.all(urls.map(url => fetch(url).then(r => r.json())));',
    explanation: {
      whatItDoes:
        'Promise.all takes an array of Promises and returns one Promise that finishes when they all succeed. If any single one fails, the whole thing rejects. Results come back in the same order as the input array, which is handy when you care about lining up responses with labels.',
      typicalUse:
        'Dashboards that need profile + stats + notifications together, prefetching related data in parallel, or batching independent API calls so you wait once instead of one-after-another. Use Promise.allSettled when you want partial success instead of all-or-nothing.',
    },
  },
  {
    name: 'REST PUT',
    text:
      'const options = {\n  method: "PUT",\n  headers: { "Authorization": `Bearer ${token}` },\n  body: JSON.stringify(updates)\n};\nfetch(`${baseUrl}/users/${id}`, options);',
    explanation: {
      whatItDoes:
        'PUT is the HTTP verb teams often use when you replace or fully update an existing resource at a stable URL—here /users/:id. You send JSON in the body and usually prove who you are with an Authorization header (Bearer token). The server swaps in the new representation.',
      typicalUse:
        'Saving account settings, updating a post the user owns, syncing a whole record from an edit form—anytime REST style says “this id already exists, overwrite or replace it.” (Some APIs use PATCH for partial updates instead; naming varies by backend.)',
    },
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
    explanation: {
      whatItDoes:
        'When the component first appears, useEffect fires. Inside, you define an async function that awaits fetch, checks response.ok, parses JSON, and calls setData—or setError if something went wrong. React then re-renders: first maybe “Loading…”, then either an error message or the pretty-printed data. The empty dependency array [] means “run this once on mount.”',
      typicalUse:
        'Client-rendered pages where data arrives after the user lands: dashboards, detail panels, settings backed by an API. It is the pattern beginners learn first before server components; you will see it in countless tutorials and real codebases.',
    },
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
    explanation: {
      whatItDoes:
        'In the App Router, a default export can be an async server component. That means fetch runs on the server—before HTML ships to the browser—so the first response can already include real titles and excerpts. The user’s first paint is meaningful content instead of a spinner while JavaScript fetches in the client.',
      typicalUse:
        'Marketing sites, blogs, documentation, product grids—anywhere search engines and humans benefit from HTML that already contains text. You still mix in client components when you need interactivity; this piece is about the initial load story.',
    },
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
    explanation: {
      whatItDoes:
        'ISR means “keep a cached copy of this page, but refresh it on a timer.” next: { revalidate: 60 } tells Next to serve a fast cached version most of the time, then regenerate in the background at most every 60 seconds. Visitors get speed; editors see updates without waiting for a full redeploy every minute.',
      typicalUse:
        'News sites, e-commerce catalogs, docs that change a few times a day—content that should feel fresh but does not need a unique database hit on every single page view. It sits between static export and fully dynamic SSR.',
    },
  },
];

export const TEST_CATEGORIES: TestCategory[] = [
  { key: 'reactHooks', label: 'React:', tests: reactHooks },
  { key: 'jsFundamentals', label: 'JS Fundamentals:', tests: jsFundamentals },
  { key: 'typescript', label: 'TypeScript:', tests: typescript },
  { key: 'restApi', label: 'REST API:', tests: restApi },
  { key: 'asyncAwait', label: 'Async await:', tests: asyncAwait },
  { key: 'jsAlgorithms', label: 'JS Algorithms:', tests: jsAlgorithms },
  { key: 'nextJs', label: 'Next.js:', tests: nextJs },
];
