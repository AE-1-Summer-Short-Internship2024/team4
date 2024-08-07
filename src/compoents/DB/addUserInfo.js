import React, { useState, useEffect } from 'react';
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from '../../firebase';
import { onAuthStateChanged } from "firebase/auth";

//家族の情報を入力してDBに格納するコンポーネント
const AddHouseholdData = () => {
  const [userId, setUserId] = useState(null);
  const [householdCount, setHouseholdCount] = useState(0);
  const [householdData, setHouseholdData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleHouseholdCountChange = (e) => {
    const count = parseInt(e.target.value);
    setHouseholdCount(count);
    setHouseholdData(Array.from({ length: count }, () => ({ ageCategory: '', gender: '' })));
    setError(''); // リセットエラーメッセージ
  };

  const handleHouseholdDataChange = (index, field, value) => {
    const newHouseholdData = [...householdData];
    newHouseholdData[index] = { ...newHouseholdData[index], [field]: value };
    setHouseholdData(newHouseholdData);
  };
  //世帯の人数が入力されていない場合と、家族メンバーの全てのフィールドが入力されていない場合にエラーメッセージを返す関数
  const validateData = () => {
    if (householdCount === 0) {
      return '家族の人数を入力してください。';
    }

    for (let i = 0; i < householdData.length; i++) {
      const { ageCategory, gender } = householdData[i];
      if (!ageCategory || !gender) {
        return `家族メンバー ${i + 1} の全てのフィールドを入力してください。`;
      }
    }

    return '';
  };

  //DBに格納ボタンを押したら、データにエラーがないかチェックして、エラーがなければデータをDBに格納する関数
  const handleSubmit = async () => {
    const validationError = validateData();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!userId) {
      alert("Please sign in first");
      return;
    }

    try {
      const householdObject = householdData.reduce((acc, data, index) => {
        acc[`household${index + 1}`] = {
          ageCategory: data.ageCategory,
          gender: data.gender
        };
        return acc;
      }, {});

      await setDoc(doc(db, "usersFamData", userId), { household: householdObject });

      alert('Household data added successfully');
      setHouseholdCount(0);
      setHouseholdData([]);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div>
      <h1>家族の情報を入力</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>
          家族の人数を入力
          <input
            type="number"
            value={householdCount}
            onChange={handleHouseholdCountChange}
            placeholder="Number of household members"
          />
        </label>
      </div>

      {householdData.map((_, index) => (
        <div key={index}>
          <h3>{index + 1}人目の性別・年代</h3>
          <div>
            <label>
              世代:
              <select
                value={householdData[index]?.ageCategory || ''}
                onChange={(e) => handleHouseholdDataChange(index, 'ageCategory', e.target.value)}
              >
                <option value="">世代の選択</option>
                <option value="Infant">乳幼児 0~2歳</option>
                <option value="Child">子供 3歳~小6</option>
                <option value="Teen">子供 中学生以上</option>
                <option value="Adult">成人 18歳以上</option>
                <option value="Senior">高齢者 65歳以上</option>
              </select>
            </label>
          </div>
          <div>
            <label>
              性別:
              <input
                type="radio"
                name={`gender-${index}`}
                value="male"
                checked={householdData[index]?.gender === 'male'}
                onChange={(e) => handleHouseholdDataChange(index, 'gender', e.target.value)}
              /> 男性
              <input
                type="radio"
                name={`gender-${index}`}
                value="female"
                checked={householdData[index]?.gender === 'female'}
                onChange={(e) => handleHouseholdDataChange(index, 'gender', e.target.value)}
              /> 女性
            </label>
          </div>
        </div>
      ))}

      <button onClick={handleSubmit}>DBに送信</button>
    </div>
  );
};

export default AddHouseholdData;
