import React, { useState, useEffect } from 'react';
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from '../../firebase';
import Checkbox from '@mui/material/Checkbox';
import './RenderProductList.css';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';

const ProductList = ({ products, userId }) => {
  const [selectedProducts, setSelectedProducts] = useState({});
  const [inventoryData, setInventoryData] = useState({});

  useEffect(() => {
    const initialSelectedProducts = {};
    Object.keys(products).forEach(category => {
      products[category].forEach(product => {
        initialSelectedProducts[product.id] = product.purchased;
      });
    });
    setSelectedProducts(initialSelectedProducts);

    const fetchInventoryData = async () => {
      try {
        const docSnap = await getDoc(doc(db, `inventoryData/${userId}`));
        if (docSnap.exists()) {
          setInventoryData(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching inventory data: ", error);
      }
    };

    fetchInventoryData();
  }, [products, userId]);

  const extractNumber = (quantityString) => {
    const match = quantityString.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const toggleProductSelection = async (productId, category) => {
    const newSelectedState = !selectedProducts[productId];
    setSelectedProducts((prevState) => ({
      ...prevState,
      [productId]: newSelectedState,
    }));

    const updatedProducts = { ...products };
    const productToUpdate = updatedProducts[category].find(product => product.id === productId);
    if (productToUpdate) {
      productToUpdate.purchased = newSelectedState;
    }

    try {
      await updateDoc(doc(db, `userProductData/${userId}`), {
        products: updatedProducts
      });
      console.log("Product purchased state successfully updated!");
    } catch (error) {
      console.error("Error updating product purchased state: ", error);
    }
  };

  const handleInventoryChange = (productId, category, value) => {
    if (value < 0) return;

    const updatedInventoryData = { ...inventoryData, [productId]: value };
    setInventoryData(updatedInventoryData);

    const updatedProducts = { ...products };
    const productToUpdate = updatedProducts[category].find(product => product.id === productId);

    if (productToUpdate) {
      const quantityNum = extractNumber(productToUpdate.quantity);
      productToUpdate.purchased = value > quantityNum;
    }

    setSelectedProducts((prevState) => ({
      ...prevState,
      [productId]: productToUpdate.purchased,
    }));
  };

  const saveInventoryData = async () => {
    try {
      const updatedInventoryData = { ...inventoryData };
      const updatedProducts = { ...products };

      Object.keys(inventoryData).forEach(productId => {
        Object.keys(updatedProducts).forEach(category => {
          const productToUpdate = updatedProducts[category].find(product => product.id === productId);
          if (productToUpdate) {
            const quantityNum = extractNumber(productToUpdate.quantity);
            productToUpdate.purchased = (inventoryData[productId] > quantityNum - 1);

            if (inventoryData[productId] < quantityNum) {
              delete updatedInventoryData[productId];
            }
          }
        });
      });

      await setDoc(doc(db, `inventoryData/${userId}`), updatedInventoryData);

      await updateDoc(doc(db, `userProductData/${userId}`), {
        products: updatedProducts
      });

      const updatedSelectedProducts = {};
      Object.keys(updatedProducts).forEach(category => {
        updatedProducts[category].forEach(product => {
          updatedSelectedProducts[product.id] = product.purchased;
        });
      });
      setSelectedProducts(updatedSelectedProducts);

      console.log("Inventory data and product purchased states successfully saved!");
    } catch (error) {
      console.error("Error saving inventory data: ", error);
    }
  };

  const renderProductGrid = (productList, category) => {
    return (
      <div className="product-grid">
        {productList.map((product) => (
          <div
            className={`product-item ${selectedProducts[product.id] ? 'selected' : ''}`}
            key={product.id}
          >
            <a href={`#product-${product.id}`}>
              <div>{product.name}：{product.quantity}</div>
            </a>
          </div>
        ))}
      </div>
    );
  };

  const renderProductDetails = (productList, category) => {
    const sortedProductList = [...productList].sort((a, b) => a.id - b.id);

    return sortedProductList.map((product) => (
      <div id={`product-${product.id}`} key={product.id} className={`product-detail ${selectedProducts[product.id] ? 'selected' : ''}`}>
        <FormControlLabel
          checked={!!selectedProducts[product.id]}
          onChange={() => toggleProductSelection(product.id, category)}
          control={<Checkbox />}
          label="購入済み"
          labelPlacement="end"
        />
      
        
        <h2>{product.name}</h2>
        <p>量: {product.quantity}</p>
        <p>消費期限: {product.expirationDate}</p>
        <input
          type="number"
          value={inventoryData[product.id] || ''}
          onChange={(e) => handleInventoryChange(product.id, category, parseInt(e.target.value, 10))}
          placeholder="在庫数を入力"
          min="0"
        />
        <p>
          詳細情報を<Link href={product.url} underline="hover" target="_blank" rel="noopener noreferrer">楽天市場</Link>で確認する。
        </p>
      </div>
    ));
  };

  if (!products) {
    return <p>Loading...</p>;
  }

  return (
    <div className="product-list">
      <h1>食品等</h1>
      {products.food && renderProductGrid(products.food, 'food')}

      <h1>衛生用品</h1>
      {products.hygiene && renderProductGrid(products.hygiene, 'hygiene')}

      <h1>生活用品</h1>
      {products.daily && renderProductGrid(products.daily, 'daily')}

      <div className="product-details">
        {['food', 'hygiene', 'daily'].map((category) => {
          const sortedProductList = [...products[category]].sort((a, b) => a.id - b.id);
          return renderProductDetails(sortedProductList, category);
        })}
      </div>
      <button onClick={saveInventoryData}>在庫データを保存</button>
    </div>
  );
};

export default ProductList;