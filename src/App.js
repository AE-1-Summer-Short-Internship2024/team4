// frontend/src/App.js
import React, { useEffect, useState } from 'react';
import Header from './Header/Header';
import ProductList from './compoents/product/RenderProductList';
import Login_app from './compoents/Login/Login_app';
import AddHouseholdData from './compoents/DB/addUserInfo';
import DisplayHouseholdData from './compoents/product/DisplayHouseHoldData';
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
      

    {/* ルーティングの設定 */}
      <Router>  
      <div className="app-content">
        <Routes>
          {/* path：/home　でProductコンポネントに飛ばす。 */}
          <Route path="/home" element={<DisplayHouseholdData/>} />
          <Route path="/Login" element={<Login_app />} />
          <Route path="/add" element={< AddHouseholdData/>} />
          <Route path="/userregist" element={<UserRegist />} />
    

        </Routes>
      </div>
    </Router>
    </div>
  );
}

export default App;
