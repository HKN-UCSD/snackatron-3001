import logo from './logo.svg';
import './App.css';
import { test } from './Sheets.js'

function App() {
  test();
  return (
    <div className="App">
      <div id="panels">
        <div id="info"></div>
        <div id="menu"></div>
        <div id="cart">
          <div id="cart-list">Cart</div>
          <div id="checkout">Checkout</div>
        </div>
      </div>
    </div>
  );
}

export default App;
