const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function (url) {
  let result = {};
  showSpinner();
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = 'ok';
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = 'error';
      result.data = error;
      hideSpinner();
      return result;
    });
}

let barraNav = document.getElementsByClassName("navbar-nav w-100 justify-content-between")[0];
let botonUsuario = document.createElement('div');
botonUsuario.setAttribute("class", "dropdown");
barraNav.appendChild(botonUsuario);
botonUsuario.innerHTML = `<li><button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
            ${localStorage.getItem('nametag')}
          </button><ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton2">
            <li><a class="dropdown-item" href="cart.html">Mi carrito</a></li>
            <li><a class="dropdown-item" href="my-profile.html">Mi perfil</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" id="botonCerrarSesion">Cerrar sesión</a></li>
          </ul></li>'`

let cerrarSesion = document.getElementById("botonCerrarSesion");
cerrarSesion.addEventListener('click', function () {
  localStorage.removeItem("nametag");
  window.location.href = 'index.html';
})

document.addEventListener('DOMContentLoaded', function () {
  if (localStorage.getItem("nametag") == null) {
    alert("Debes estar logueado para ver esta página");
    window.location.href = 'index.html';
  }
})