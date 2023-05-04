import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <div id="panels">
        <div id="info"></div>
        <div id="menu">
            <h1 class="title">Prices</h1>
            <table id="price-table" frame="hsides" rules="rows">
                <tr>
                    <h1 class="category">Snacks</h1>
                </tr>
                <tr>
                    <td>Chicken Bake</td>
                    <td>$1.00</td>
                    <td>
                        <button class="add">+</button>
                    </td>
                </tr>
                <tr>
                    <td>Chicken Bake</td>
                    <td>$1.00</td>
                    <td>
                        <button class="add">+</button>
                    </td>
                </tr>
            </table>
        </div>
        <div id="cart">
          <div id="cart-list">
            <h1 class="title">Cart</h1>
            <table id="cart-table" frame="hsides" rules="rows">
                <tr>
                    <td>Chicken Bake</td>
                    <td>$1.00</td>
                    <td>
                        <button class="trash">
                            <img class="trash-img" src="https://cdn-icons-png.flaticon.com/512/1843/1843344.png"></img>
                        </button>
                    </td>
                </tr>
                <tr>
                    <td>Chicken Bake</td>
                    <td>$1.00</td>
                    <td>
                        <button class="trash">
                            <img class="trash-img" src="https://cdn-icons-png.flaticon.com/512/1843/1843344.png"></img>
                        </button>
                    </td>
                </tr>
            </table>
          </div>
          <button id="checkout">Checkout</button>
        </div>
      </div>
    </div>
  );
}

export default App;
