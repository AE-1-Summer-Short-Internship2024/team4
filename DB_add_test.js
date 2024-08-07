// src/components/AddData.js
import React, { useState } from 'react';
import { collection, addDoc } from "firebase/firestore";
//dbをfirebase.jsからインポート
import { db } from '../../firebase';

const AddData = () => {
  const [inputValue, setInputValue] = useState('');
  //変更があったら
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async () => {
    try {
    //dbのitemsのコレクションにinputとタイムスタンプをデータを追加。
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
	//input→onChange（変更があったら）handleInputChangeを呼び出す
	//button→onClick（クリックがあったら）handleSubmitを呼び出す
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