// DOM variables
const addToCartBtn = document.querySelector('.add-to-cart');
const closetBtn = document.querySelector('.close-cart');
const cleartBtn = document.querySelector('.clear-cart');

const productsDOM = document.querySelector('#all-products');

const cartItems = document.querySelector('.cart-items');
const cartContent = document.querySelector('.cart-content');
const cartItem = document.querySelector('.cart-item');
const cartTotal = document.querySelector('.cart-total');

// const cleartBtn = document.querySelector('.clear-cart');

// cart
let cart = [];

// buttons
let buttonsDOM = [];

// getting the products
class Products {
  async getProducts() {
    try {
      let result = await fetch('products.json');
      let data = await result.json();
      let products = data.items;

      products = products.map(item => {
        const { id } = item.sys;
        const { title, description, price } = item.fields;
        const image = item.fields.image.fields.file.url;
        return { id, title, description, price, image };
      });
      return products;

    } catch (error) {
      console.log(error);
    }
  }
}

// ui - display products
class UI {
  displayProducts(products) {
    let result = "";

    products.forEach(product => {
      result += `
        <div class="col-lg-4 col-md-6">
          <div class="card mb-2 shadow-sm">
          <h3 class="card-title text-center">${product.title}</h3>
            <img class="card-img" src="${product.image}">
            <div class="card-body">
              <p class="card-text">${product.description}.</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <button type="button" class="btn btn-sm btn-outline-primary">Quick view</button>
                  <button type="button" class="btn btn-sm btn-outline-success add-to-cart" data-id="${product.id}">Add to cart</button>
                </div>
                <h5 class="text-muted">$${product.price}</h5>
              </div>
            </div>
          </div>
        </div>
      `;
    });
    productsDOM.innerHTML = result;
  }


  getCartButtons() {
    const buttons = [...document.querySelectorAll('.add-to-cart')];
    buttonsDOM = buttons;

    buttons.forEach(button => {
      let id = button.dataset.id;
      let inCart = cart.find(item => item.id === id);
      if (inCart) {
        button.innerText = "In Cart";
        // button.disabled = true;
      }
      button.addEventListener('click', (event) => {
        event.target.innerText = 'In cart';
        event.target.disabled = true;
        alert('Thank you! Item was added into the cart.');
        // get product from products
        let cartItem = { ...Storage.getProduct(id), amount: 1 };

        // add product to the cart
        cart = [...cart, cartItem];

        // save cart into local storage
        Storage.saveCart(cart);

        // set cart values
        this.setCartValues(cart);
        // display cart item
        this.addCartItem(cartItem);

        // show the cart
      })

    });
  }

  setCartValues(cart) {
    let tempTotal = 0;
    let ItemsTotal = 0;

    cart.map(item => {
      tempTotal += item.price * item.amount;
      ItemsTotal += item.amount;
    });

    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    if (ItemsTotal === 0) {
      cartItems.innerText = ``;
    } else {
      cartItems.innerText = `(${ItemsTotal})`;
    }

  }
  addCartItem(item) {
    const tr = document.createElement('tr');
    tr.classList.add('cart-item');
    tr.innerHTML = `
      <tr class="cart-item">
        <td class="w-25">
          <img class="cart-img" src="${item.image}">
        </td>
        <td>${item.title}</td>
        <td class="item-price">${item.price}<span>$</span></td>
        <td class="item-qty"><input type="number" class="form-control" id="input1" value="${item.amount}"
            style="width: 3.5em">
        </td>
        <td class="item-total">178<span>$</span></td>
        <td>
          <button class="btn btn-danger" data-id="${item.id}">Remove</button>
        </td>
      </tr>
    `;
    cartContent.appendChild(tr);
  }
}

// local storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem('products'));
    return products.find(product => product.id === id);
  }

  static saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const ui = new UI();
  const products = new Products();

  // get all products
  products.getProducts().then(products => {
    ui.displayProducts(products);
    Storage.saveProducts(products);
  }).then(() => {
    ui.getCartButtons();
  });
});