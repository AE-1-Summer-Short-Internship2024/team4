// frontend/src/App.js
import React, { useEffect, useState } from 'react';
import Header from './Header/Header';
import Product from './compoents/main/Product';
import AuthComponent from './compoents/Login/components/AuthComponent';
import Login_app from './compoents/Login/Login_app';
 
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";


function App() {
  
  return (
    <div>
      <Header />
      <h1>災害備蓄アプリ</h1>

    {/* ルーティングの設定 */}
      <Router>  
      <div className="app-content">
        <Routes>
          {/* path：/home　でProductコンポネントに飛ばす。 */}
          <Route path="/home" element={<Product />} />
          <Route path="/Login" element={<Login_app />} />

        </Routes>
      </div>
    </Router>
    </div>
  );
}

export default App;
