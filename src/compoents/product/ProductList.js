import React, { useState } from 'react';
import products from './data.js';
import './ProductList.css';

const ProductList = () => {
  // 各商品の選択状態を管理するためのstateを追加
  const [selectedProducts, setSelectedProducts] = useState({});

  // 商品を選択または解除する関数
  const toggleProductSelection = (productId) => {
    setSelectedProducts((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId],
    }));
  };

  // 各カテゴリの商品リストを表示する関数
  const renderProductGrid = (productList) => {
    return (
      <div className="product-grid">
        {productList.map((product) => (
          <div
            className={`product-item ${selectedProducts[product.id] ? 'selected' : ''}`}
            key={product.id}
          >
            <a href={`#product-${product.id}`}>
              <div>{product.name};{product.quantity}</div>
            </a>
          </div>
        ))}
      </div>
    );
  };

  // 各カテゴリの詳細リストを表示する関数
  const renderProductDetails = (productList) => {
    
 console.log("rendering in child B component");
    return productList.map((product) => (
      <div id={`product-${product.id}`} key={product.id} className={`product-detail ${selectedProducts[product.id] ? 'selected' : ''}`}>
        <input
          type="checkbox"
          checked={!!selectedProducts[product.id]}
          onChange={() => toggleProductSelection(product.id)}
        />
        <h2>{product.name}</h2>
        <p>Quantity: {product.quantity}</p>
        <p>
          詳細情報を<a href={product.url} target="_blank" rel="noopener noreferrer">楽天市場</a>で確認する。
        </p>
      </div>
    ));
  };

  return (
    <div className="product-list">
      <h1>食品等</h1>
      {renderProductGrid(products.food)}

      <h1>衛生用品</h1>
      {renderProductGrid(products.hygiene)}

      <h1>生活用品</h1>
      {renderProductGrid(products.daily)}

      <div className="product-details">
        {Object.keys(products).map((category) =>
          renderProductDetails(products[category])
        )}
      </div>
    </div>
  );
};

export default ProductList;
