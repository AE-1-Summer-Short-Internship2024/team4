import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../../firebase';
import './RenderProductList.css';

const ProductList = ({ products, userId }) => {
  // 各商品の選択状態を管理するためのstateを追加
  const [selectedProducts, setSelectedProducts] = useState({});

  useEffect(() => {
    // 初期状態として、全商品のpurchased状態を設定する
    const initialSelectedProducts = {};
    Object.keys(products).forEach(category => {
      products[category].forEach(product => {
        initialSelectedProducts[product.id] = product.purchased;
      });
    });
    setSelectedProducts(initialSelectedProducts);
  }, [products]);

  // 商品を選択または解除する関数
  const toggleProductSelection = async (productId, category) => {
    const newSelectedState = !selectedProducts[productId];
    setSelectedProducts((prevState) => ({
      ...prevState,
      [productId]: newSelectedState,
    }));

    // productsのpurchased状態を更新
    const updatedProducts = { ...products };
    const productToUpdate = updatedProducts[category].find(product => product.id === productId);
    if (productToUpdate) {
      productToUpdate.purchased = newSelectedState;
    }

    // データベースを更新
    try {
      await updateDoc(doc(db, `userProductData/${userId}`), {
        products: updatedProducts
      });
      console.log("Product purchased state successfully updated!");
    } catch (error) {
      console.error("Error updating product purchased state: ", error);
    }
  };

  // 各カテゴリの商品リストを表示する関数
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

  // 各カテゴリの詳細リストを表示する関数
  const renderProductDetails = (productList, category) => {
    // IDの昇順にソート
    const sortedProductList = [...productList].sort((a, b) => a.id - b.id);

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
      <h1>食品等</h1>
      {products.food && renderProductGrid(products.food, 'food')}

      <h1>衛生用品</h1>
      {products.hygiene && renderProductGrid(products.hygiene, 'hygiene')}

      <h1>生活用品</h1>
      {products.daily && renderProductGrid(products.daily, 'daily')}

      <div className="product-details">
        {Object.keys(products).map((category) =>
          renderProductDetails(products[category], category)
        )}
      </div>
    </div>
  );
};

export default ProductList;
