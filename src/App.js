import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <div id="panels">
        <div id="info">
            <img id="logo" src="https://hkn.ucsd.edu/wp-content/uploads/2014/11/HKN-Logo-White.png"></img>
            <p id="instructions">Scan the barcode of your items :)</p>
            <p id="ty">Made by HKN Dev Team © 2023</p>
        </div>
        <div id="menu">
            <h1 class="title">Prices</h1>
            <hr></hr>
            <div id="prices">
                <h1 class="category">Snacks</h1>
                <table class="price-table" frame="hsides" rules="rows">
                    <tr>
                        <td>Chicken Bake</td>
                        <td>$00.00</td>
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
                <h1 class="category">Drinks</h1>
                <table class="price-table" frame="hsides" rules="rows">
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
                    <tr>
                        <td>Chicken Bake</td>
                        <td>$1.00</td>
                        <td>
                            <button class="add">+</button>
                        </td>
                    </tr>
                </table>
                <h1 class="category">Stuff</h1>
                <table class="price-table" frame="hsides" rules="rows">
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
                    <tr>
                        <td>Chicken Bake</td>
                        <td>$1.00</td>
                        <td>
                            <button class="add">+</button>
                        </td>
                    </tr>
                </table>
                <h1 class="category">Stuff Again</h1>
                <table class="price-table" frame="hsides" rules="rows">
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
                    <tr>
                        <td>Chicken Bake</td>
                        <td>$1.00</td>
                        <td>
                            <button class="add">+</button>
                        </td>
                    </tr>
                </table>
            </div>
            <hr></hr>
        </div>
        <div id="cart">
          <div id="cart-list">
            <h1 class="title">Cart</h1>
            <hr></hr>
            <div id="cart-items">
                <table>
                    <tr>
                        <div class="cart-row">
                            <p class="cart-item">Chicken Bake Chicken Bake Chicken Bake</p>
                            <p class="cart-price">$00.00</p>
                            <button class="trash">
                                <img class="trash-img" src="https://cdn-icons-png.flaticon.com/512/1843/1843344.png"></img>
                            </button>
                        </div>
                        <hr></hr>
                    </tr>
                    <tr>
                        <div class="cart-row">
                            <p class="cart-item">Chicken Bake</p>
                            <p class="cart-price">$1.00</p>
                            <button class="trash">
                                <img class="trash-img" src="https://cdn-icons-png.flaticon.com/512/1843/1843344.png"></img>
                            </button>
                        </div>
                        <hr></hr>
                    </tr>
                    <tr>
                        <div class="cart-row">
                            <p class="cart-item">Chicken Bake</p>
                            <p class="cart-price">$00.00</p>
                            <button class="trash">
                                <img class="trash-img" src="https://cdn-icons-png.flaticon.com/512/1843/1843344.png"></img>
                            </button>
                        </div>
                        <hr></hr>
                    </tr>
                    <tr>
                        <div class="cart-row">
                            <p class="cart-item">Chicken Bake</p>
                            <p class="cart-price">$00.00</p>
                            <button class="trash">
                                <img class="trash-img" src="https://cdn-icons-png.flaticon.com/512/1843/1843344.png"></img>
                            </button>
                        </div>
                        <hr></hr>
                    </tr>
                    <tr>
                        <div class="cart-row">
                            <p class="cart-item">Chicken Bake</p>
                            <p class="cart-price">$00.00</p>
                            <button class="trash">
                                <img class="trash-img" src="https://cdn-icons-png.flaticon.com/512/1843/1843344.png"></img>
                            </button>
                        </div>
                        <hr></hr>
                    </tr>
                    <tr>
                        <div class="cart-row">
                            <p class="cart-item">Chicken Bake</p>
                            <p class="cart-price">$00.00</p>
                            <button class="trash">
                                <img class="trash-img" src="https://cdn-icons-png.flaticon.com/512/1843/1843344.png"></img>
                            </button>
                        </div>
                        <hr></hr>
                    </tr>
                    <tr>
                        <div class="cart-row">
                            <p class="cart-item">Chicken Bake</p>
                            <p class="cart-price">$00.00</p>
                            <button class="trash">
                                <img class="trash-img" src="https://cdn-icons-png.flaticon.com/512/1843/1843344.png"></img>
                            </button>
                        </div>
                        <hr></hr>
                    </tr>
                    <tr>
                        <div class="cart-row">
                            <p class="cart-item">Chicken Bake</p>
                            <p class="cart-price">$00.00</p>
                            <button class="trash">
                                <img class="trash-img" src="https://cdn-icons-png.flaticon.com/512/1843/1843344.png"></img>
                            </button>
                        </div>
                        <hr></hr>
                    </tr>
                    <tr>
                        <div class="cart-row">
                            <p class="cart-item">Chicken Bake</p>
                            <p class="cart-price">$00.00</p>
                            <button class="trash">
                                <img class="trash-img" src="https://cdn-icons-png.flaticon.com/512/1843/1843344.png"></img>
                            </button>
                        </div>
                        <hr></hr>
                    </tr>
                    <tr>
                        <div class="cart-row">
                            <p class="cart-item">Chicken Bake</p>
                            <p class="cart-price">$00.00</p>
                            <button class="trash">
                                <img class="trash-img" src="https://cdn-icons-png.flaticon.com/512/1843/1843344.png"></img>
                            </button>
                        </div>
                        <hr></hr>
                    </tr>
                    <tr>
                        <div class="cart-row">
                            <p class="cart-item">Chicken Bake</p>
                            <p class="cart-price">$00.00</p>
                            <button class="trash">
                                <img class="trash-img" src="https://cdn-icons-png.flaticon.com/512/1843/1843344.png"></img>
                            </button>
                        </div>
                        <hr></hr>
                    </tr>
                    <tr>
                        <div class="cart-row">
                            <p class="cart-item">Chicken Bake</p>
                            <p class="cart-price">$00.00</p>
                            <button class="trash">
                                <img class="trash-img" src="https://cdn-icons-png.flaticon.com/512/1843/1843344.png"></img>
                            </button>
                        </div>
                        <hr></hr>
                    </tr>
                    <tr>
                        <div class="cart-row">
                            <p class="cart-item">Chicken Bake</p>
                            <p class="cart-price">$00.00</p>
                            <button class="trash">
                                <img class="trash-img" src="https://cdn-icons-png.flaticon.com/512/1843/1843344.png"></img>
                            </button>
                        </div>
                        <hr></hr>
                    </tr>
                    <tr>
                        <div class="cart-row">
                            <p class="cart-item">Chicken Bake</p>
                            <p class="cart-price">$00.00</p>
                            <button class="trash">
                                <img class="trash-img" src="https://cdn-icons-png.flaticon.com/512/1843/1843344.png"></img>
                            </button>
                        </div>
                        <hr></hr>
                    </tr>
                    <tr>
                        <div class="cart-row">
                            <p class="cart-item">Chicken Bake</p>
                            <p class="cart-price">$00.00</p>
                            <button class="trash">
                                <img class="trash-img" src="https://cdn-icons-png.flaticon.com/512/1843/1843344.png"></img>
                            </button>
                        </div>
                        <hr></hr>
                    </tr>
                    <tr>
                        <div class="cart-row">
                            <p class="cart-item">Chicken Bake</p>
                            <p class="cart-price">$00.00</p>
                            <button class="trash">
                                <img class="trash-img" src="https://cdn-icons-png.flaticon.com/512/1843/1843344.png"></img>
                            </button>
                        </div>
                        <hr></hr>
                    </tr>
                </table>
            </div>
            <hr></hr>
          </div>
          <button id="checkout">Checkout</button>
        </div>
      </div>
    </div>
  );
}

export default App;
