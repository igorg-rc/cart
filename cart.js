// DOM variables
const cartBtn = document.querySelector('.cart-button');
const closetBtn = document.querySelector('.close-cart');
const cleartBtn = document.querySelector('.clear-cart');

const productsDOM = document.querySelector('#all-products');

const cartItems = document.querySelector('.cart-items');
const cartItem = document.querySelector('.cart-item');
const cartTotal = document.querySelector('.clear-total');

// const cleartBtn = document.querySelector('.clear-cart');

// cart
let cart = [];

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
    console.log(products);
    let result = "";
    products.forEach(product => {
      result += `
        <div class="col-lg-4 col-md-6">
          <div class="card mb-4 shadow-sm">
          <h3 class="card-title text-center">${product.title}</h3>
            <img class="card-img" src="${product.image}">
            <div class="card-body">
              <p class="card-text">${product.description}.</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <button type="button" class="btn btn-sm btn-outline-primary">Quick view</button>
                  <button type="button" class="btn btn-sm btn-outline-success" data-id="${product.id}">Add to cart</button>
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
}

// local storage
class Storage {

}


document.addEventListener('DOMContentLoaded', () => {
  const ui = new UI();
  const products = new Products();

  // get all products
  products.getProducts()
    .then(products => ui.displayProducts(products));
});

