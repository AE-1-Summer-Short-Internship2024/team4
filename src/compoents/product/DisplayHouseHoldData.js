import React, { useState, useEffect } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from '../../firebase';
import { onAuthStateChanged } from "firebase/auth";
import { calculateNeeds } from './utils/calculateNeeds';
import ProductList from './RenderProductList';

const DisplayHouseholdData = () => {
  const [userId, setUserId] = useState(null);
  const [householdData, setHouseholdData] = useState(null);
  const [error, setError] = useState('');
  const [neededProducts, setNeededProducts] = useState(null);
  //ユーザを認証して、ユーザIDを取得する
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
  //ユーザ情報の更新があったら、該当する家族の情報を取得する
  useEffect(() => {
    const fetchHouseholdData = async () => {
      if (userId) {
        try {
          const docRef = doc(db, "usersFamData", userId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data().household;
            setHouseholdData(data);
            setNeededProducts(calculateNeeds(Object.values(data)));
          } else {
            setError('No household data found');
          }
        } catch (error) {
          setError('Error fetching household data');
          console.error("Error fetching document: ", error);
        }
      }
    };

    fetchHouseholdData();
  }, [userId]);

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      <h1>家族情報</h1>
      {/* 家族の情報を、表示 */}
      {householdData ? (
        <div>
          {Object.keys(householdData).map((key) => (
            <div key={key}>
              <h3>{key}</h3>
              <p>Age Category: {householdData[key].ageCategory}</p>
              <p>Gender: {householdData[key].gender}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
　　　　{/* 必要な商品を取得したら、ProductListに渡して表示 */}
      <h2>必要な商品リスト</h2>
      {neededProducts ? (
        <ProductList products={neededProducts} />
      ) : (
        <p>Calculating...</p>
      )}
    </div>
  );
};

export default DisplayHouseholdData;
