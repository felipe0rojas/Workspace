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

            subtotalDeProductoIndividual();

            contenedorMain.appendChild(envio);

            chequeoDeEnvio();

            contenedorMain.appendChild(infoCostos);

            costosFinales();

            formaDePago();

            contenedorMain.appendChild(btnComprar);

            (() => {
                'use strict'
                const forms = document.querySelectorAll('.needs-validation')

                Array.from(forms).forEach(form => {
                    form.addEventListener('submit', event => {

                        if (!form.checkValidity()) {
                            event.preventDefault()
                            event.stopPropagation()

                            }else if (form.checkValidity()){
                                event.preventDefault()
                                event.stopPropagation()
                                document.getElementById("alerta-compra-exitosa").setAttribute("style", "visibility: visible;")
                        }

                        form.classList.add('was-validated')
                    }, false)
                })
            })()

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
        </div>
    </div>`;

    contenedorMain.appendChild(tituloDeCarrito);


    function tablaDeCarrito() {
        console.log(productoEnLS);
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
        let arrayProductosNoBorrados = [];

        for (let i = 0; i < productoEnLS.length; i++) {
            productos.innerHTML += `
        <tr>
            <td style="max-width: 15vh;max-height: 15vh;"><img src=${productoEnLS[i].image} class="img-producto-carrito"></img></td>
            <td id="nombreProducto"><p>${productoEnLS[i].name}</p></td>
            <td><p>${productoEnLS[i].currency} ${productoEnLS[i].unitCost}</p></td>
            <td><input type="number"  id="cantidadDeProducto${i}" value="1" min="1" style="border-radius: .25rem; padding: .375rem .75rem; border: 1px solid #ced4da; max-width: 8vh;"></td> 
            <td id="subtotal${i}"></td>
            <td> <button id="borrar${[i]}"><i class="fa fa-trash" aria-hidden="true"></i></button></td>
        <tr>`;

        }

        for (let i = 0; i < productoEnLS.length; i++) {
            document.getElementById("borrar" + [i]).addEventListener("click", function () {

                productoEnLS.splice(i, 1);

                for (let i = 0; i < productoEnLS.length; i++) {
                    arrayProductosNoBorrados.push(productoEnLS[i])
                }

                arrayProductosNoBorrados.splice(0, 1);

                localStorage.setItem("Carrito", JSON.stringify(arrayProductosNoBorrados));

                location.reload();
            })

        }

        contenedorMain.appendChild(productos);

    }

    function subtotalDeProductoIndividual() {
        for (let i = 0; i < productoEnLS.length; i++) {
            let cantidadAComprar = document.getElementById("cantidadDeProducto" + [i]);

            let subtotalDeCompra = document.getElementById("subtotal" + [i]);

            if (productoEnLS[i].currency == "USD") {
                subtotalDeCompra.setAttribute("data-valor", multiplicacion());
            } else {
                // Dolar cotizado a 40 pesos
                subtotalDeCompra.setAttribute("data-valor", Math.round(multiplicacion() * 0.025));
            }

            subtotalDeCompra.innerHTML = `<p><b>${productoEnLS[i].currency} ${multiplicacion()}</b></p>`

            cantidadAComprar.addEventListener("input", function () {
                if (productoEnLS[i].currency == "USD") {
                    subtotalDeCompra.setAttribute("data-valor", multiplicacion());
                } else {
                    subtotalDeCompra.setAttribute("data-valor", Math.round(multiplicacion() * 0.025));
                }
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
    envio.innerHTML = `
    
    <hr size=8px style="border-radius: 3px;">
    <form id="form-carrito" class="row g-3 needs-validation" novalidate>
        <div class="modal fade" id="modal-de-pago" tabindex="-1" aria-labelledby="modal-de-pagoLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
            
                <div class="modal-content">
                
                    <div class="modal-header">
                        <h1 class="modal-title fs-5">Forma de pago</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="formaDePago" id="formaDePago1" value="option1" required>
                            <label class="form-check-label" for="formaDePago1">
                                Tarjeta de crédito
                            </label>
                            <hr>
                            <div id="datosTarjeta">
                                <div class="form-floating mb-3">
                                    <input type="number" class="form-control" id="numDeTarjeta" placeholder="Número de tarjeta" required>
                                    <label for="floatingInput">Número de tarjeta</label>
                                </div>

                                <div class="form-floating mb-3">
                                    <input type="number" class="form-control" id="codSeguridad" placeholder="Código de seg." required>
                                    <label for="floatingInput">Código de seg.</label>
                                </div>

                                <div class="form-floating mb-3">
                                    <input type="month" min="2022-11" class="form-control" id="vencimiento" placeholder="Vencimiento" required>
                                    <label for="floatingInput">Vencimiento</label>
                                </div>
                            </div>
                        </div>

                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="formaDePago" id="formaDePago2" value="option2" required>
                            <label class="form-check-label" for="formaDePago2">
                                Transferencia bancaria
                            </label>
                            <hr>
                            <div class="form-floating mb-3">
                                <input type="number" class="form-control" id="numCuentaDeBanco" placeholder="Número de cuenta" required>
                                <label for="floatingInput">Número de cuenta</label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Guardar</button>
                    </div>
                </div>
            </div>
        </div>
        
        <div style="display:flex; justify-content:space-evenly;">
            <div id="opcionesDeEnvio">
                <h3 style="text-align:center;">Tipo De Envío</h3>
                <p><input type="radio" name="tipo-de-envio" value="0.15" required style="margin-right:0.5vw">Premium 2 a 5 días (15%)</p>
                <p><input type="radio" name="tipo-de-envio" value="0.07" required style="margin-right:0.5vw">Express 5 a 8 días (7%)</p>
                <p><input type="radio" name="tipo-de-envio" value="0.05" required style="margin-right:0.5vw">Standard 12 a 15 días (5%)</p>
                <small style="visibility: hidden;">Selecciona un envio</small>
            </div>
            <div>
                <h3 style="text-align:center;">Dirección de envío</h3>
                <div style="display:flex; flex-direction: column;">
                    <div class="form-floating m-3">
                        <input type="text" class="form-control" id="envio-calle" placeholder="Calle" required>
                        <label for="envio-calle">Calle</label>
                        <p class="invalid-feedback">Ingrese una calle</p>
                    </div>

                    <div style="display:flex;">
                        <div class="form-floating m-3">
                            <input type="number" class="form-control" id="envio-numero" placeholder="Número"  required>
                            <label for="envio-numero">Número</label>
                            <p class="invalid-feedback">Ingrese su número de puerta</p>
                        </div>

                        <div class="form-floating m-3">
                            <input type="text" class="form-control" id="envio-apartamento" placeholder="Apartamento"  required>
                            <label for="envio-apartamento">Apartamento</label>
                            <p class="invalid-feedback">Ingrese un número de apartamento</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </form>
    <hr size=8px style="border-radius: 3px;">
    `
    function chequeoDeEnvio() {

        let tipoDeEnvio = document.getElementById("opcionesDeEnvio").getElementsByTagName('input');

        document.getElementById("opcionesDeEnvio").addEventListener("input", function () {

            document.getElementById("opcionesDeEnvio").getElementsByTagName('small')[0].setAttribute("style", "visibility: hidden");

            console.log(tipoDeEnvio);
            for (let i = 0; i < 3; i++) {

                if (tipoDeEnvio[i].checked) {
                    tipoDeEnvio[i].required = true;

                } else {

                    tipoDeEnvio[i].required = false;

                }
            }
        })

        document.getElementById("form-carrito").addEventListener("submit", function () {

            if (!tipoDeEnvio[0].checked && !tipoDeEnvio[1].checked && !tipoDeEnvio[2].checked) {
                document.getElementById("opcionesDeEnvio").getElementsByTagName('small')[0].setAttribute("style", "visibility: visible; color: #dc3545;");
            }
        })
    }

    let infoCostos = document.createElement("div");
    infoCostos.innerHTML = `
    <div>
        <h3>Costos</h3>
        <div>
        <ul class="list-group">
            <li class="list-group-item" style="max-height: 50px">
                <div style="display:flex; justify-content:space-between;">
                    Subtotal
                    <p id="subtotalFinal"></p>
                </div>
            </li>
            <li class="list-group-item" style="max-height: 50px">
                <div style="display:flex; justify-content:space-between;">
                    Costo de envío<br>
                    <p id="costoDeEnvio"></p>
                </div>
            </li>
            <li class="list-group-item">
                <div style="display:flex; justify-content:space-between;">
                    Total ($)
                    <p id="totalDeCompra"></p>    
                </div>
            </li>
        </ul>
        <div>
            <button type="button" id="boton-seleccion-de-pago" class="btn btn-link ps-0" data-bs-toggle="modal" data-bs-target="#modal-de-pago">Seleccionar un método de pago</button>
            <small id="pago-no-valido" style="visibility: hidden;">Selecciona un método de pago</small>
        </div>
    </div>
    `

    function costosFinales() {
        setInterval(function () {


            //Calculo del subtotal de la compra

            let textoSubtotal = document.getElementById("subtotalFinal");
            let subtotalesIndividuales = [];
            let sumaSubtotal = 0;
            for (let i = 0; i < productoEnLS.length; i++) {

                let valorDeSubtotal = document.getElementById("subtotal" + [i]);
                subtotalesIndividuales.push(Number(valorDeSubtotal.dataset.valor));

                numeros = subtotalesIndividuales;
                sumaSubtotal += numeros[i];
            }
            textoSubtotal.innerHTML = `<p>USD ${sumaSubtotal}</p>`


            // Calculo del envío

            let precioEnvio = 0;
            let chequeoTipoDeEnvio = document.getElementsByName("tipo-de-envio");
            chequeoTipoDeEnvio.forEach((e => {
                if (e.checked) {
                    precioEnvio = (sumaSubtotal * e.value);
                }
            }))
            document.getElementById("costoDeEnvio").innerHTML = `<p>USD ${Math.round(precioEnvio)}</p>`


            // Calculo del total de la compra

            document.getElementById("totalDeCompra").innerHTML = `<p><b>USD ${(Math.round(precioEnvio)) + (sumaSubtotal)}</b></p>`



        }, 500)
    }


    function formaDePago() {

        let pagoConTarjeta = document.getElementById("formaDePago1");
        let pagoPorBanco = document.getElementById("formaDePago2");
        let datosDeTarjeta = document.getElementById('datosTarjeta').getElementsByTagName('input');

        setInterval(function () {

            if (pagoPorBanco.checked) {

                for (let i = 0; i < datosDeTarjeta.length; i++) {
                    datosDeTarjeta[i].disabled = true
                }
                document.getElementById("numCuentaDeBanco").disabled = false;
                document.getElementById("formaDePago1").required = false;
                document.getElementById("formaDePago2").required = true;

                document.getElementById("pago-no-valido").setAttribute("style", "visibility: hidden");

            } else if (pagoConTarjeta.checked) {

                for (let i = 0; i < datosDeTarjeta.length; i++) {
                    datosDeTarjeta[i].disabled = false;

                }
                document.getElementById("numCuentaDeBanco").disabled = true;
                document.getElementById("formaDePago1").required = true;
                document.getElementById("formaDePago2").required = false;

                document.getElementById("pago-no-valido").setAttribute("style", "visibility: hidden");
            }
        }
            , 500)

        document.getElementById("form-carrito").addEventListener("submit", function(){
            if(!datosDeTarjeta[0].checkValidity() || !datosDeTarjeta[1].checkValidity() || !datosDeTarjeta[2].checkValidity() || !document.getElementById("numCuentaDeBanco").checkValidity()){
                
                document.getElementById("pago-no-valido").setAttribute("style", "visibility: visible; color: #dc3545;");

            }
        })
    }

    let btnComprar = document.createElement("div");
    btnComprar.innerHTML = `
    <div class="d-grid gap-2 col-8 mx-auto">
        <input type="submit" class="btn btn-primary my-2" value="Pagar" form="form-carrito">
    </div>
    <div class="alert alert-success alert-dismissible" role="alert" id="alerta-compra-exitosa" style="visibility: hidden;">
    ¡Has comprado con éxito!
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    `;

})