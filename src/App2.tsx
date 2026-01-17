import React, { useState } from 'react';

import './App.css';

// Create an interface for product item
interface Item {
  id: number;
  name: string;
  price: number;
}

// This list holds some products of a fiction store
const PRODUCTS: Item[] = [
  {
    id: 1,
    name: 'Apple',
    price: 1,
  },
  {
    id: 2,
    name: 'Book',
    price: 5,
  },
  {
    id: 3,
    name: 'Banana',
    price: 0.5,
  },
  {
    id: 4,
    name: 'Table',
    price: 200,
  },
];

const App = (): JSX.Element => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<Item[] | undefined>();

  // This function is called when the input changes
  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const enteredName = event.target.value;
    setQuery(enteredName);
  };

  // This function is triggered when the Search buttion is clicked
  const search = () => {
    const foundItems = PRODUCTS.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    setResult(foundItems);
  };

  return (
    <div className="container">
      <div className="wrapper">
        <input
          value={query}
          onChange={inputHandler}
          placeholder="Search products"
          className="input"
        />

        <button onClick={search}>Search</button>
      </div>

      {/* Display search result */}
      <div className="search-result">
        {result && result.length > 0 ? (
          result.map((item) => (
            <li key={item.id} className="item">
              <span className="item-id">{item.id}</span>
              <span className="item-name">{item.name}</span>
              <span className="item-price">{item.price}$</span>
            </li>
          ))
        ) : (
          <h2>No items found!</h2>
        )}
      </div>
    </div>
  );
};

export default App;