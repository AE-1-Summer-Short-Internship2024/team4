// src/Header.js
import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes, NavLink } from 'react-router-dom';
import './Header.css'; 

const Header = () => {
  return (
    <Router>
        <header className="header">
          <h1>備蓄くん</h1>
        </header>
        <div className="nav-container">
          <nav className="nav">
            <ul>
            <li>
                <NavLink to="/" aria-current="false">　ホーム　</NavLink> { }
              </li>
              <li>
                <NavLink to="/inventory" aria-current="false">在庫リスト</NavLink> { }
              </li>
              <li>
                <NavLink to="/userinfo" aria-current="false">ユーザ情報</NavLink> { }
              </li>
            </ul>
          </nav>
        </div>
    </Router>
  );
};

export default Header;
