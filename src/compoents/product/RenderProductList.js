import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../../firebase';
import './RenderProductList.css';

const ProductList = ({ products, userId }) => {
  const [selectedProducts, setSelectedProducts] = useState({});

  useEffect(() => {
    const initialSelectedProducts = {};
    Object.keys(products).forEach(category => {
      products[category].forEach(product => {
        initialSelectedProducts[product.id] = product.purchased;
      });
    });
    setSelectedProducts(initialSelectedProducts);
  }, [products]);

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

  const renderProductGrid = (sortedProductList, category) => {
    return (
      <div className="product-grid">
        {sortedProductList.map((product) => (
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

  const renderProductDetails = (sortedProductList, category) => {
    return sortedProductList.map((product) => (
      <div id={`product-${product.id}`} key={product.id} className={`product-detail ${selectedProducts[product.id] ? 'selected' : ''}`}>
        <input
          type="checkbox"
          checked={!!selectedProducts[product.id]}
          onChange={() => toggleProductSelection(product.id, category)}
        />
        <h2>{product.name}</h2>
        <p>量: {product.quantity}</p>
        <p>消費期限: {product.expirationDate}</p>
        <p>
          詳細情報を<a href={product.url} target="_blank" rel="noopener noreferrer">楽天市場</a>で確認する。
        </p>
      </div>
    ));
  };

  if (!products) {
    return <p>Loading...</p>;
  }

  return (
    <div className="product-list">
      <h1>食品類</h1>
      {products.food && renderProductGrid([...products.food].sort((a, b) => a.id - b.id), 'food')}

      <h1>衛生用品</h1>
      {products.hygiene && renderProductGrid([...products.hygiene].sort((a, b) => a.id - b.id), 'hygiene')}

      <h1>生活用品</h1>
      {products.daily && renderProductGrid([...products.daily].sort((a, b) => a.id - b.id), 'daily')}

      <div className="product-details">
        {['food', 'hygiene', 'daily'].map((category) => {
          const sortedProductList = [...products[category]].sort((a, b) => a.id - b.id);
          return renderProductDetails(sortedProductList, category);
        })}
      </div>
    </div>
  );
};

export default ProductList;
