import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link} from 'react-router-dom';
import ShopPage from './components/Shop.js';
import CartPage from './components/Cart.js';
import CheckoutPage from './components/Checkout.js';
import OrderProcess from './components/Order.js';
  



function App() {
  return (
    <div className="App">
      
      <BrowserRouter>
        {/*nav bar needs to be in the BrowserRouter for it to work, otherwise Link is missing some context I think? */}
        <nav className="navbar navbar-expand-sm bg-light justify-content-around fixed-top">
          <Link to="/Shop" className="btn btn-primary">Shop</Link>
          <Link to="/Checkout" className="btn btn-primary">Checkout</Link>
          <Link to="/Cart" className="btn btn-primary">Cart</Link>
        </nav>
        {/* Dummy spacing buttons so that there's always space for the actual navbar at the top of the screen */}
        <nav className="navbar navbar-expand-sm bg-light justify-content-around bg-light">
          <Link to="/Shop" className="btn btn-primary">Shop</Link>
          <Link to="/Checkout" className="btn btn-primary">Checkout</Link>
          <Link to="/Cart" className="btn btn-primary">Cart</Link>
        </nav>
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
