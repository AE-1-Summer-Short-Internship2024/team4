// src/Header.js
import React from 'react';
import './Header.css';  // スタイリング用のCSSファイル（必要に応じて）

const Header = () => {
  return (
    <header className="header">
      <h1>アプリ名</h1>
      <nav>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
