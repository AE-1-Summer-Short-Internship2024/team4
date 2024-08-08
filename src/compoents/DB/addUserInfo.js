import React, { useState, useEffect } from 'react';
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from '../../firebase';
import { onAuthStateChanged } from "firebase/auth";
import './addUserInfo.css';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import {useNavigate} from 'react-router-dom';
import Slider from '@mui/material/Slider';

//家族の情報を入力してDBに格納するコンポーネント
const AddHouseholdData = () => {
  const [userId, setUserId] = useState(null);
  const [householdCount, setHouseholdCount] = useState(0);
  const [householdData, setHouseholdData] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
        return `${i + 1} 人目の情報を入力してください。`;
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
      alert("ログインしてください。");
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
      navigate('/home');  // ナビゲートする
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className='fill-in'>
      <div className='midashi'><h1>あなたの家族に必要な防災グッズを提案します。</h1></div>
      <h2>あなたと、一緒に住んでいる家族の情報を入力してください。</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className='householdcount'>
      家族の人数をスライドで入力
        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: 300, margin: '0 auto'}}>
          <Slider
            aria-label='household-count'
            defaultValue={1}
            getAriaValueText={setHouseholdCount}
            valueLabelDisplay='auto'
            step={1}
            marks
            min={1}
            max={10}
            onChange={handleHouseholdCountChange}
          />
        </Box>
      </div>

      {householdData.map((_, index) => (
        <div key={index}>
          <h3>{index + 1}人目の世代・性別</h3>
          <div>
            <Box sx={{minWidth: 120, mb:2}}>
              <FormControl fullWidth sx={{maxWidth:300}}>
                <InputLabel id="age-select-label">世代</InputLabel>
                <Select
                  labelId={"age-select-label"}
                  id="age-select"
                  name={`ageCategory-${index}`}
                  value={householdData[index].ageCategory}
                  label="世代"
                  onChange={(e) => handleHouseholdDataChange(index, 'ageCategory', e.target.value)}
                >
                  <MenuItem value={"Infant"}>乳幼児 0~2歳</MenuItem>
                  <MenuItem value={"Child"}>子供 3歳~小6</MenuItem>
                  <MenuItem value={"Teen"}>子供 中学生以上</MenuItem>
                  <MenuItem value={"Adult"}>成人 18歳以上</MenuItem>
                  <MenuItem value={"Senior"}>高齢者 65歳以上</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div>
          <div>
            <FormControl fullWidth sx = {{maxWidth:300}}>
              <FormLabel id="gender-radio-buttons">性別</FormLabel>
              <RadioGroup
                aria-labelledby="gender-radio-buttons"
                name={`gender-${index}`}
                value={householdData[index].gender}
                onChange={(e) => handleHouseholdDataChange(index, 'gender', e.target.value)}
                >
                  <FormControlLabel value="male" control={<Radio />} label="男性" />
                  <FormControlLabel value="female" control={<Radio />} label="女性" />
                </RadioGroup>
            </FormControl>
          </div>
        </div>
      ))}
      
      <Button onClick={handleSubmit} variant="contained" endIcon={<SendIcon />}>必要な防災グッズを確認する</Button>
    </div>
  );
};

export default AddHouseholdData;
