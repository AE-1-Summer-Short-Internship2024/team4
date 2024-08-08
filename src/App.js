// frontend/src/App.js
import React, { useEffect, useState } from 'react';
import Header from './Header/Header';
import InventoryControl from './compoents/InventoryControl/InventoryControl';
import ProductList from './compoents/product/RenderProductList';
import Login_app from './compoents/Login/Login_app';
import AddHouseholdData from './compoents/DB/addUserInfo';
import DisplayHouseholdData from './compoents/product/DisplayHouseHoldData';
import UserInfo from './compoents/user_info/UserInfo';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";


function App() {
  
  return (
    <div>
      <Header />

    {/* ルーティングの設定 */}
      <Router>  
      <div className="app-content">
        <Routes>
          {/* path：/home　でProductコンポネントに飛ばす。 */}
          <Route path="/inventory"  element={<InventoryControl />} />
          <Route path="/home" element={<DisplayHouseholdData/>} />
          <Route path="/" element={<Navigate to="/Login" />} />
          <Route path="/Login" element={<Login_app />} />
          <Route path="/add" element={< AddHouseholdData/>} />
          <Route path="/user" element={< UserInfo/>} />

        </Routes>

      </div>
    </Router>
    </div>
  );
}

export default App;
