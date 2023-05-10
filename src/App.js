import logo from './logo.svg';
import './App.css';

function App() {
  fetch("/api").then((res) => res.json()).then((json) => console.log(json));
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
