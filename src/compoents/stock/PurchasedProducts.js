import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db, auth } from '../../firebase';
import { onAuthStateChanged } from "firebase/auth";
import './PurchasedProducts.css';

const PurchasedProducts = () => {
  const [userId, setUserId] = useState(null);
  const [products, setProducts] = useState([]);
  const [inventoryData, setInventoryData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchProducts = async () => {
      if (userId) {
        try {
          const userProductRef = doc(db, "userProductData", userId);
          const userProductSnap = await getDoc(userProductRef);

          const inventoryRef = doc(db, "inventoryData", userId);
          const inventorySnap = await getDoc(inventoryRef);

          if (userProductSnap.exists() && inventorySnap.exists()) {
            const userProductData = userProductSnap.data().products;
            const inventoryData = inventorySnap.data();

            const purchasedProducts = [];
            Object.keys(userProductData).forEach(category => {
              userProductData[category].forEach(product => {
                const inventoryProduct = inventoryData[product.id];
                const inventoryQuantity = inventoryProduct ? inventoryProduct.quantity : 0;
                if (product.purchased || inventoryQuantity > 0) {
                  purchasedProducts.push({
                    ...product,
                    category,
                    inventoryQuantity
                  });
                }
              });
            });

            purchasedProducts.sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate));

            setProducts(purchasedProducts);
            setInventoryData(inventoryData);
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

  const handleUpdateExpirationDate = async (id, category, value) => {
    const updatedProducts = products.map(product =>
      product.id === id ? { ...product, expirationDate: value } : product
    );

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

  const handleUpdateInventoryQuantity = async (id, value) => {
    const updatedInventoryData = { ...inventoryData, [id]: { quantity: value } };
    setInventoryData(updatedInventoryData);

    const inventoryRef = doc(db, "inventoryData", userId);
    await setDoc(inventoryRef, updatedInventoryData);

    const updatedProducts = products.map(product => {
      if (product.id === id) {
        if (value < extractNumber(product.quantity)) {
          const updatedProduct = { ...product, purchased: false, inventoryQuantity: value };
          updateProductPurchasedStatus(updatedProduct);
          return updatedProduct;
        } else if (value >= extractNumber(product.quantity)) {
          const updatedProduct = { ...product, purchased: true, inventoryQuantity: value };
          updateProductPurchasedStatus(updatedProduct);
          return updatedProduct;
        }
      }
      return product;
    });

    setProducts(updatedProducts);
  };

  const updateProductPurchasedStatus = async (productToUpdate) => {
    const docRef = doc(db, `userProductData/${userId}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const allProducts = docSnap.data().products;
      const categoryProducts = allProducts[productToUpdate.category];
      const productIndex = categoryProducts.findIndex(product => product.id === productToUpdate.id);
      if (productIndex !== -1) {
        categoryProducts[productIndex] = productToUpdate;
        await updateDoc(docRef, { products: allProducts });
      }
    }
  };

  const extractNumber = (quantityString) => {
    const match = quantityString.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const saveInventoryData = async () => {
    try {
      const updatedInventoryData = { ...inventoryData };

      const updatedProducts = products.map(product => {
        const inventoryQuantity = inventoryData[product.id]?.quantity || 0;
        if (inventoryQuantity < extractNumber(product.quantity)) {
          product.purchased = false;
        } else if (inventoryQuantity >= extractNumber(product.quantity)) {
          product.purchased = true;
        }
        updateProductPurchasedStatus(product);
        return { ...product, inventoryQuantity };
      });

      setProducts(updatedProducts);

      const inventoryRef = doc(db, "inventoryData", userId);
      await setDoc(inventoryRef, updatedInventoryData);

      console.log("Inventory data successfully updated!");
    } catch (error) {
      console.error("Error saving inventory data: ", error);
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
              <label>
                在庫数:
                <input
                  type="number"
                  min="0"
                  value={inventoryData[product.id]?.quantity || 0}
                  onChange={(e) => handleUpdateInventoryQuantity(product.id, parseInt(e.target.value, 10))}
                />
                <p> / {product.quantity}</p>
              </label>
              {product.expirationDate && (
                <label>
                  消費期限:
                  <input
                    type="date"
                    value={product.expirationDate}
                    onChange={(e) => handleUpdateExpirationDate(product.id, product.category, e.target.value)}
                  />
                </label>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No purchased products available</p>
      )}
      <button onClick={saveInventoryData}>在庫データを保存</button>
    </div>
  );
};

export default PurchasedProducts;
