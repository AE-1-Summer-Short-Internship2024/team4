import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from '../../firebase';
import { onAuthStateChanged } from "firebase/auth";
import './PurchasedProducts.css';

const PurchasedProducts = () => {
  const [userId, setUserId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //ユーザを認証して、userIdをセットする
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  //ユーザIDが更新されたら、DBからpurchasedがTrueの商品情報を取得する
  useEffect(() => {
    const fetchProducts = async () => {
      if (userId) {
        try {
          const docRef = doc(db, "userProductData", userId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const allProducts = docSnap.data().products;

            const purchasedProducts = [];
            Object.keys(allProducts).forEach(category => {
              allProducts[category].forEach(product => {
                if (product.purchased) {
                  purchasedProducts.push({ ...product, category });
                }
              });
            });

            // 消費期限でソート（近い順）
            purchasedProducts.sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate));

            setProducts(purchasedProducts);
          } else {
            setProducts([]);
          }
        } catch (error) {
          setError("Error fetching product data: " + error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProducts();
  }, [userId]);

  //消費期限を更新する関数
  const handleUpdateExpirationDate = async (id, category, value) => {
    const updatedProducts = products.map(product => 
      product.id === id ? { ...product, expirationDate: value } : product
    );

    // 消費期限でソート（近い順）
    updatedProducts.sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate));
    
    setProducts(updatedProducts);

    const docRef = doc(db, "userProductData", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const allProducts = docSnap.data().products;
      const productToUpdate = allProducts[category].find(product => product.id === id);
      if (productToUpdate) {
        productToUpdate.expirationDate = value;
        await updateDoc(docRef, { products: allProducts });
      }
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div className="purchased-products">
      <h1>購入済み商品リスト</h1>
      {products.length > 0 ? (
        <div className="product-grid">
          {products.map(product => (
            <div key={product.id} className="product-item">
              <h3>{product.name}</h3>
              <p>量: {product.quantity}</p>
              <label>
                消費期限:
                <input
                  type="date"
                  value={product.expirationDate}
                  onChange={(e) => handleUpdateExpirationDate(product.id, product.category, e.target.value)}
                />
              </label>
            </div>
          ))}
        </div>
      ) : (
        <p>No purchased products available</p>
      )}
    </div>
  );
};

export default PurchasedProducts;
