document.addEventListener('DOMContentLoaded', function () {
  const AUTOS_URL = 'https://japceibal.github.io/emercado-api/cats_products/' + localStorage.getItem("catID") + '.json';
  fetch(AUTOS_URL)
    .then(response => response.json())
    .then(data => {
      console.log(data.products);
      prods = data.products;
      prodsSinFiltro = data.products;
      mostrarDatos();
    })

  function tituloDescriptivo() {
    if ((localStorage.getItem("catID")) == 101) {
      let testo = document.getElementById("titulo-descriptivo")
      testo.innerHTML = `<h2>Los mejores precios en autos 0 kilómetro, de alta y media gama.</h2>`
    } else {
      if ((localStorage.getItem("catID")) == 102) {
        let testo = document.getElementById("titulo-descriptivo")
        testo.innerHTML = `<h2>Encuentra aquí los mejores precios para niños/as de cualquier edad.</h2>`
      } else {
        if ((localStorage.getItem("catID")) == 103) {
          let testo = document.getElementById("titulo-descriptivo")
          testo.innerHTML = `<h2>Muebles antiguos, nuevos y para ser armados por uno mismo.</h2>`
        } else {
          let testo = document.getElementById("titulo-descriptivo")
          testo.innerHTML = `<h2>¡Estamos trabajando para traerte lo mejor de esta sección!</h2>`
        }
      }
    }
  }

  tituloDescriptivo();
  let prods = [];

  let btnPrecioAsc = document.getElementById("precioAsc")
  let btnPrecioDesc = document.getElementById("precioDesc")
  let btnRelevancia = document.getElementById("relevancia")

  let inputMin = document.getElementById("precio-min")
  let inputMax = document.getElementById("precio-max")
  let btnFiltrar = document.getElementById("btn-filtrado")
  let btnLimpiar = document.getElementById("btn-limpiar")

  function mostrarDatos() {
    for (let i = 0; i <= prods.length; i++) {
      let newDiv = document.getElementById("auto" + [i] + "_id");
      newDiv.innerHTML += `<h1>${prods[i].name + ' - ' + prods[i].currency + ' ' + prods[i].cost}</h1>`;
      newDiv.innerHTML += `<p class="descripcion">${prods[i].description}</p>`;
      newDiv.innerHTML += `<img src=${prods[i].image}></img>`;
      newDiv.innerHTML += `<p class="vendidos${[i]}">${prods[i].soldCount} vendidos</p>`;
    }
  }

  function eliminarDatos() {
    for (let i = 0; i <= prods.length; i++) {
      let borrarElementos = document.getElementById("auto" + [i] + "_id");
      borrarElementos.innerHTML = ''
    }
  }

  btnRelevancia.addEventListener('click', function() {
    prods.sort(function (a, b) {
      if (a.soldCount > b.soldCount) {
        return -1;
      }
      if (a.soldCount < b.soldCount) {
        return 1;
      }
      return 0;
    })
    eliminarDatos();
    mostrarDatos();
  })

  btnPrecioAsc.addEventListener('click', function () {
    prods.sort(function (a, b) {
      if (a.cost < b.cost) {
        return -1;
      }
      if (a.cost > b.cost) {
        return 1;
      }
      return 0;
    })
    eliminarDatos();
    mostrarDatos();
  })

  btnPrecioDesc.addEventListener('click', function () {
    prods.sort(function (a, b) {
      if (a.cost > b.cost) {
        return -1;
      }
      if (a.cost < b.cost) {
        return 1;
      }
      return 0;
    })
    eliminarDatos();
    mostrarDatos();
  })

  btnFiltrar.addEventListener('click', function () {
    eliminarDatos();
    let min;
    if (inputMin.value !== '' && inputMin.value !== undefined) {
      min = inputMin.value
    } else {
      min = 0
    }
    let max;
    if (inputMax.value !== '' && inputMax.value !== undefined) {
      max = inputMax.value
    } else {
      max = Infinity
    }
    prods = prodsSinFiltro.filter(productos => productos.cost >= min && productos.cost <= max);
    mostrarDatos();
  })

  btnLimpiar.addEventListener('click', function () {
    eliminarDatos();
    prods = prodsSinFiltro;
    mostrarDatos();
  })
})

