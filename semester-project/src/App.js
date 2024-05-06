import React from 'react';
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import ShopPage from './components/Shop.js';
import CartPage from './components/Cart.js';
import CheckoutPage from './components/Checkout.js';
import OrderProcess from './components/Order.js';
  



function App() {
  return (
    <div className="App">
      <nav className="navbar navbar-expand-sm bg-light justify-content-around fixed-top">
          <a href="/Shop" className="btn btn-primary">Shop</a>
          <a href="/Checkout" className="btn btn-primary">Checkout</a>
          <a href="/Cart" className="btn btn-primary">Cart</a>
      </nav>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Navigate to="/Shop" />} />
          <Route path="/Shop" element={<ShopPage />} />
          <Route path="/Cart" element={<CartPage />} />
          <Route path="/Checkout" element={<CheckoutPage />} />
          <Route path="/Order" element={<OrderProcess />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
