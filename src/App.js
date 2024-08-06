// frontend/src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');
  const [item, setItem] = useState(null);

  useEffect(() => {
    // FastAPIのエンドポイントを呼び出す
    axios.get('http://localhost:8000/')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const fetchItem = () => {
    axios.get('http://localhost:8000/items/1?q=test')
      .then(response => {
        setItem(response.data);
      })
      .catch(error => {
        console.error('Error fetching item:', error);
      });
  };

  return (
    <div>
      <h1>{message}</h1>
      <button onClick={fetchItem}>Fetch Item</button>
      {item && (
        <div>
          <p>Item ID: {item.item_id}</p>
          <p>Query: {item.q}</p>
        </div>
      )}
    </div>
  );
}

export default App;
