// src/components/AddData.js
import React, { useState } from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db } from './Login/firebase';

const AddData = () => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const docRef = await addDoc(collection(db, "items"), {
        value: inputValue,
        timestamp: Date.now()
      });
      alert('Data added successfully');
      setInputValue('');
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div>
      <h1>Add Data to Firebase</h1>
      <input 
        type="text" 
        value={inputValue} 
        onChange={handleInputChange} 
        placeholder="Enter some data" 
      />
      <button onClick={handleSubmit}>Add Data</button>
    </div>
  );
};

export default AddData;
