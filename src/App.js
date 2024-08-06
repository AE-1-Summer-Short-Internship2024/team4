// frontend/src/App.js
import React, { useEffect, useState } from 'react';
import Header from './Header/Header';
import Product from './compoents/main/Product';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import UserRegist from './compoents/main/UserRegist';


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
          <Route path="/userregist" element={<UserRegist />} />
  
        </Routes>
      </div>
    </Router>
    </div>
  );
}

export default App;
