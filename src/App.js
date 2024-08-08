// frontend/src/App.js
import React, { useEffect, useState } from 'react';
import Header from './Header/Header';
import InventoryControlHoldData from './compoents/InventoryControl/InventoryControlHoldData';
import InventoryControl from './compoents/InventoryControl/InventoryControl';
import ProductList from './compoents/product/RenderProductList';
import Login_app from './compoents/Login/Login_app';
import AddHouseholdData from './compoents/DB/addUserInfo';
import DisplayHouseholdData from './compoents/product/DisplayHouseHoldData';
import UserInfo from './compoents/user_info/UserInfo';
import PurchasedProducts from './compoents/stock/PurchasedProducts';
import AuthRoute from './compoents/Login/components/AuthRoute';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { Inventory } from '@mui/icons-material';



function App() {
  
  return (
    <div>
      <Header />

    {/* ルーティングの設定 */}
      <Router>  
      <div className="app-content">
        <Routes>
          {/* path：/home　でProductコンポネントに飛ばす。 */}
          <Route path="/inventory"  element={<PurchasedProducts />} />
          <Route path="/home" element={<DisplayHouseholdData/>} />
          <Route path="/" element={
              <AuthRoute>
                <Navigate to="/Login" />
              </AuthRoute>
            } />
            <Route path="/Login" element={<Login_app />} />
          <Route path="/add" element={< AddHouseholdData/>} />
          <Route path="/user" element={< UserInfo/>} />
          <Route path="/stock" element={< PurchasedProducts/>} />

        </Routes>

      </div>
    </Router>
    </div>
  );
}

export default App;
