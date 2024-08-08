import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, auth } from '../../firebase';
import { onAuthStateChanged } from "firebase/auth";
import { calculateNeeds } from '../product/utils/calculateNeeds';
import InventoryControl from '../InventoryControl/InventoryControl';

const DisplayHouseholdData = () => {
  const [userId, setUserId] = useState(null);
  const [householdData, setHouseholdData] = useState(null);
  const [error, setError] = useState('');
  const [neededProducts, setNeededProducts] = useState(null);
  const [inventoryData, setInventoryData] = useState(null);

  　//ユーザを認証する
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

  //必要な商品情報をDBに保存する関数
  const saveProductsToDB = async (userId, products) => {
    try {
      await setDoc(doc(db, `userProductData/${userId}`), { products });
      console.log("Products successfully written!");
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  };
  //DBから商品情報を取得する関数
  const fetchProductsFromDB = async (userId) => {
    try {
      const docRef = doc(db, `userProductData/${userId}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data().products;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching products: ", error);
      return null;
    }
  };

  //DBから在庫情報を取得する関数
  const fetchInventoryDataFromDB = async (userId) => {
    try {
      const docRef = doc(db, `inventoryData/${userId}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data().inventory;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching inventory data: ", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchHouseholdData = async () => {
      if (userId) {
        try {
          const docRef = doc(db, "usersFamData", userId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data().household;
            setHouseholdData(data);

            // DBからproductsを取得
            const storedProducts = await fetchProductsFromDB(userId);
            if (storedProducts) {
              setNeededProducts(storedProducts);
            } else {
              // DBにproductsがない場合は計算して保存
              const products = calculateNeeds(Object.values(data));
              setNeededProducts(products);
              saveProductsToDB(userId, products);
            }

            // DBからinventoryを取得
            const storedInventory = await fetchInventoryDataFromDB(userId);
            setInventoryData(storedInventory || {});
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
      <h1>備蓄リスト</h1>
      {neededProducts && inventoryData ? (
        <InventoryControl 
          products={neededProducts} 
          inventory={inventoryData} 
          userId={userId} 
        />
      ) : (
        <p>ロード中...</p>
      )}
    </div>
  );
};

export default DisplayHouseholdData;
