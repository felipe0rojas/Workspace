document.addEventListener('DOMContentLoaded', function () {
    const CARRITO_URL = 'https://japceibal.github.io/emercado-api/user_cart/25801.json';
    fetch(CARRITO_URL)
        .then(response => response.json())
        .then(datosCarrito => {
            console.log(datosCarrito);
            productoOrdenado = datosCarrito;

            listaDeProductosComprados();
            tablaDeCarrito();

            console.log(JSON.parse(localStorage.getItem("Carrito")));


            subtotal();
            contenedorMain.appendChild(envio);
        })

    let contenedorMain = document.getElementsByClassName("container")[1];

    let productoEnLS = [];

    function listaDeProductosComprados() {
        if (JSON.parse(localStorage.getItem("Carrito")) !== null) {

            productoEnLS.push(productoOrdenado.articles[0]);

            for (let i = 0; i < (JSON.parse(localStorage.getItem("Carrito"))).length; i++) {
                productoEnLS.push(JSON.parse(localStorage.getItem("Carrito"))[i]);
            }

        } else {
            productoEnLS.push(productoOrdenado.articles[0]);
        }
    };


    let tituloDeCarrito = document.createElement('div');

    tituloDeCarrito.innerHTML = `
    <div>
        <h1 style="text-align:center;">Carrito de compras</h1>
        <div style="display:flex; justify-content: space-between;">
            <h3>Articulos a comprar</h3>
            <div id="eliminarElementos"><button class="btn btn-danger btn-sm" type="button" style="margin:auto;">Eliminar productos</button></div>
        </div>
    </div>`;
    contenedorMain.appendChild(tituloDeCarrito);
    let eliminarCarrito = document.getElementById("eliminarElementos");
    eliminarCarrito.addEventListener("click", function () {
        localStorage.removeItem("Carrito");
        location.reload();
    })

    function tablaDeCarrito() {
        let productos = document.createElement('table');
        productos.setAttribute("class", "table align-middle");
        productos.innerHTML = `
        <table id="detalles">
        <tr>
            <th></th>
            <th>Nombre</th>
            <th>Costo</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
        </tr>`
        contenedorMain.appendChild(productos);

        for (let i = 0; i < productoEnLS.length; i++) {
            productos.innerHTML += `
        <tr>
            <td style="max-width: 15vh;max-height: 15vh;"><img src=${productoEnLS[i].image} style="max-width:50%; max-height:50%;"></img></td>
            <td id="nombreProducto"><p>${productoEnLS[i].name}</p></td>
            <td><p>${productoEnLS[i].currency} ${productoEnLS[i].unitCost}</p></td>
            <td><input type="number"  id="cantidadDeProducto${i}" value="1" min="1" style="border-radius: .25rem; padding: .375rem .75rem; border: 1px solid #ced4da; max-width: 8vh;"></td> 
            <td id="subtotal${i}"></td>
        <tr>`
        }

        contenedorMain.appendChild(productos);

    }

    function subtotal() {
        for (let i = 0; i < productoEnLS.length; i++) {
            let cantidadAComprar = document.getElementById("cantidadDeProducto" + [i]);

            let subtotalDeCompra = document.getElementById("subtotal" + [i]);
            subtotalDeCompra.innerHTML = `<p><b>${productoEnLS[i].currency} ${multiplicacion()}</b></p>`
            console.log(i)

            cantidadAComprar.addEventListener("input", function () {
                subtotalDeCompra.innerHTML = `<p><b>${productoEnLS[i].currency} ${multiplicacion()}</b></p>`
            })

            function multiplicacion() {
                if ((Math.round((cantidadAComprar.value)) * (productoEnLS[i].unitCost)) > 0) {
                    return ((Math.round(cantidadAComprar.value)) * (productoEnLS[i].unitCost));

                } else {
                    return 0
                }
            }
        }
    }

    let envio = document.createElement('div');
    envio.innerHTML = `<hr size=8px style="border-radius: 3px;">
    <div style="display:flex">
        <div>
            <h3 style="text-align:center;">Tipo De Envío</h3>
            <p><input type="radio" name="tipoDeEnvio" value="premium" required style="margin-right:0.5vw">Premium 2 a 5 días (15%)</p>
            <p><input type="radio" name="tipoDeEnvio" value="express" required style="margin-right:0.5vw">Express 5 a 8 días (7%)</p>
            <p><input type="radio" name="tipoDeEnvio" value="standard" required style="margin-right:0.5vw">Standard 12 a 15 días (5%)</p>
        </div>
        <div>
            <h3 style="text-align:center;">Dirección de envío</h3>
            <div style="align-items: flex-end; display:flex;">
            <div class="form-floating m-3">
                <input type="text" class="form-control" id="floatingInput" placeholder="Calle" style="width:20vw;" required>
                <label for="floatingInput">Calle</label>
            </div>
            <div class="form-floating m-3">
                <input type="text" class="form-control" id="floatingInput" placeholder="Número" style="width:10vw;" required>
                <label for="floatingInput">Número</label>
            </div>
            <div class="form-floating m-3">
                <input type="text" class="form-control" id="floatingInput" placeholder="Esquina" style="width:10vw;" required>
                <label for="floatingInput">Apartamento</label>
            </div>
            </div>
        </div>
    </div>
    `

})