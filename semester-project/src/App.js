import React from 'react';
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import ShopPage from './components/Shop.js';
import CartPage from './components/Cart.js';
  



function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Navigate to="/Shop" />} />
          <Route path="/Shop" element={<ShopPage />} />
          <Route path="/Cart" element={<CartPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
