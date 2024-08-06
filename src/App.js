// frontend/src/App.js
import React, { useEffect, useState } from 'react';
import Header from './Header/Header';
import Product from './compoents/main/Product';
import InventoryControl from './compoents/InventoryControl/InventoryControl';
import {
  BrowserRouter as Router,
  Routes,
  Route,
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
          {/*<Route path="/home" element={<Product />} /> */}

          <Route path="/inventory"  element={<InventoryControl />} />
        </Routes>

      </div>
    </Router>
    </div>
  );
}

export default App;
