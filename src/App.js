import logo from './logo.svg';
import Popup from './components/Popup'
import './App.css';

function App() {
  return (
    <div className="App">
      <div id="panels">
        <div id="info"></div>
        <div id="menu"></div>
        <div id="cart">
          <div id="cart-list">Cart</div>
          <div id="checkout">
            <button id="checkout-btn">Checkout</button>
            <Popup trigger={true}>
              
            </Popup>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
