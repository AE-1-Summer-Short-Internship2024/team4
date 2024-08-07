// src/Header.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './Header.css';

// Headerコンポーネントを定義
const Header = () => {
  const location = useLocation(); // 現在のURLパスを取得
  // 現在のパスと一致する場合にactiveクラスを返す関数
  const getActiveClass = (path) => location.pathname === path ? 'active' : '';

  return (
    <>
      <header className="header">
        <h1>備蓄くん</h1>
      </header>
      <div className="nav-container">
        <nav className="nav">
          <ul>
            <li>
              <a href="/home" className={getActiveClass('/home')}>　ホーム　</a>
            </li>
            <li>
              <a href="/inventory" className={getActiveClass('/inventory')}>在庫リスト</a>
            </li>
            <li>
              <a href="/userregist" className={getActiveClass('/userregist')}>ユーザ情報</a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

// Appコンポーネントを定義し、ルーティングを設定
const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/userregist" element={<Userregist />} />
      </Routes>
    </Router>
  );
};

// 各ページコンポーネントを定義
const Home = () => <div></div>;
const Inventory = () => <div></div>;
const Userregist = () => <div></div>;

export default App;
