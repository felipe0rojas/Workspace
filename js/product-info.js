document.addEventListener('DOMContentLoaded', function () {
    const PRODUCTO_URL = 'https://japceibal.github.io/emercado-api/products/' + localStorage.getItem("idProducto") + '.json';
    fetch(PRODUCTO_URL)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            producto = data;
            titulo();
            // imagenesDeProducto();
            carouselDeImagenes();
            botonComprar();
            infoProducto();
            // let imagenPrincipal = document.getElementById("imgGrande");
            // imagenPrincipal.innerHTML = `<img src=${producto.images[0]}></img>`
            fetchComentarios();

        })
    let contenedor = document.getElementById("contenedorMain");

    function titulo() {
        let myElement = document.createElement('h1');
        myElement.setAttribute("id", "nombreProducto");
        let myText = document.createTextNode(producto.name);
        myElement.appendChild(myText);
        contenedor.appendChild(myElement);
    }

    function botonComprar() {
        let btnCompra = document.createElement('div');
        btnCompra.innerHTML = `
        <div style="margin-top:20px;" class="d-grid gap-2">
            <button id="botonDeCompra" class="btn btn-primary" type="button" style="width:350px; margin:auto;">Comprar</button>
        </div>
        <div class="alert alert-primary" id="alerta-producto-agregado" role="alert" style="visibility: hidden;">
            Tu producto ha sido agregado al carrito. Has click <a href="cart.html" class="alert-link">aquí</a> para dirigirte al mismo.
        </div>
        `
        contenedor.appendChild(btnCompra);

        let listaProductosComprados = [];

        let botonDeCompra = document.getElementById("botonDeCompra");
        
        botonDeCompra.addEventListener("click", function () {

            productoComprado = { 
                "name": producto.name, 
                "count": 1,
                "id": producto.id, 
                "unitCost": producto.cost, 
                "currency": producto.currency, 
                "image": producto.images[0] 
            };

            if (localStorage.getItem("Carrito") == null) { 

                listaProductosComprados.push(productoComprado);
                localStorage.setItem("Carrito", JSON.stringify(listaProductosComprados));
                console.log(localStorage.getItem("Carrito"))

            } else {

                let listaProductosComprados = [];
                let productosAlLS = JSON.parse(localStorage.getItem("Carrito"));

                for (let i = 0; i < productosAlLS.length; i++) {
                    listaProductosComprados.push(productosAlLS[i]);
                }
                
                listaProductosComprados.push(productoComprado);

                let ids = listaProductosComprados.map(e => e.id)
                let productosNoDuplicados = listaProductosComprados.filter(({ id }, index) => !ids.includes(id, index + 1))

                localStorage.removeItem("Carrito")
                localStorage.setItem("Carrito", JSON.stringify(productosNoDuplicados));

                console.log(localStorage.getItem("Carrito"));
                console.log(productosNoDuplicados);
            }

            document.getElementById("alerta-producto-agregado").setAttribute("style", "visibility: visible; margin-top:50vh;");           
            
        })
    }

    function carouselDeImagenes() {
        let carousel = document.createElement('div');
        carousel.setAttribute("id", "carousel");
        contenedor.appendChild(carousel);
        carousel.innerHTML = `
        <div id="carouselExampleFade" class="carousel slide carousel-fade" data-bs-ride="carousel"  style="max-width:50%; margin:auto;">
            <div class="carousel-inner" id="contenedorImagenes">
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previo</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Siguiente</span>
            </button>
      </div>`

        let imgProducto = document.getElementsByClassName("carousel-inner")[0];

        function imgIndividuales() {
            imgProducto.innerHTML = `
            <div class="carousel-item active">
                <img src="${producto.images[0]}" class="d-block w-100">
            </div>`
            for (let i = 1; i < producto.images.length; i++) {
                imgProducto.innerHTML += `
                <div class="carousel-item"">
                    <img src="${producto.images[i]}" class="d-block w-100">
                </div>`
            }
        }
        imgIndividuales();

    }

    // Galeria de imagenes manual:

    // function imagenesDeProducto() {
    //     let imagenes = document.createElement('div');
    //     imagenes.setAttribute("id", "img");
    //     contenedor.appendChild(imagenes);
    //     let listaImagenes = document.createElement('ul');
    //     listaImagenes.setAttribute("id", "imagenesProducto");
    //     imagenes.appendChild(listaImagenes);
    //     for (let i = 0; i < producto.images.length; i++) {
    //         listaImagenes.innerHTML += `<li style="max-width: 200px;" class = "card"><img src=${producto.images[i]} id="${producto.images[i]}" class="mini-imagenes"></img></li><br>`
    //     }
    //     for (let i = 0; i < producto.images.length; i++) {
    //         let imgSeleccionada = document.getElementById(producto.images[i])
    //         imgSeleccionada.addEventListener('click', function () {
    //             imagenGrande.innerHTML = `<img src=${imgSeleccionada.id}></img>`
    //         })
    //     }
    //     let imagenGrande = document.createElement('div');
    //     imagenGrande.setAttribute("id", "imgGrande");
    //     imagenGrande.setAttribute("style", "display: flex;");
    //     imagenes.appendChild(imagenGrande);
    // }

    function infoProducto() {
        for (let i = 0; i <= 3; i++) {
            let info = document.createElement('div');
            contenedor.appendChild(info);
            info.setAttribute("id", "infoProd" + [i]);
        }
        let precio = document.getElementById("infoProd0")
        precio.innerHTML = `<h5><b>Precio</b></h5><p>${producto.currency} ${producto.cost}</p>`
        let descripcion = document.getElementById("infoProd1")
        descripcion.innerHTML = `<h5><b>Descripción</b></h5><p>${producto.description}</p>`
        let categoria = document.getElementById("infoProd2")
        categoria.innerHTML = `<h5><b>Categoría</b></h5><p>${producto.category}</p>`
        let cantidadVendidos = document.getElementById("infoProd3")
        cantidadVendidos.innerHTML = `<h5><b>Cantidad de vendidos</b></h5><p>${producto.soldCount}</p><hr>`
    }

    function fetchComentarios() {
        const COMENTARIOS_URL = 'https://japceibal.github.io/emercado-api/products_comments/' + localStorage.getItem("idProducto") + '.json';
        fetch(COMENTARIOS_URL)
            .then(response => response.json())
            .then(datosComentarios => {
                console.log(datosComentarios)
                comentarios = datosComentarios
                mostrarComentario();
                comentar();
                productosRelacionados();

                
            })
    }
    
    // Funcion para poder poner estrellas en comentarios nuevos
    function funcionEstrellas(e) {
        let estrellas;
        switch (e) {
            case 1: estrellas = `<span class="fa fa-star checked"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span>`;
                break;
            case 2: estrellas = `<span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span>`;
                break;
            case 3: estrellas = `<span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star"></span><span class="fa fa-star"></span>`;
                break;
            case 4: estrellas = `<span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star"></span>`;
                break;
            case 5: estrellas = `<span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"><span class="fa fa-star checked">`;
                break;
        }

        return {
            estrellas
        }
    }


    function mostrarComentario() {
        let tituloComentarios = document.createElement('h2');
        let myText = document.createTextNode('Comentarios');
        tituloComentarios.appendChild(myText);
        contenedor.appendChild(tituloComentarios);
        
        let comentario = document.createElement('div');
        comentario.setAttribute("class", "card");
        comentario.setAttribute("id", "test");
        let listaDeComentarios = document.createElement('ul');
        listaDeComentarios.setAttribute("class", "list-group list-group-flush");

        contenedor.appendChild(comentario);
        comentario.appendChild(listaDeComentarios);

        for (let i = 0; i < comentarios.length; i++) {
            comentario.innerHTML += `<li class="list-group-item"><p><b>${comentarios[i].user}</b> - ${comentarios[i].dateTime} - ${funcionEstrellas(comentarios[i].score).estrellas}</p><p>${comentarios[i].description}</p></li>`;
        
        }

    }

    // Agregada la opcion de comentar

    function comentar() {
        let comentar = document.createElement('div');
        contenedor.appendChild(comentar);
        comentar.innerHTML = `
            <h2>Comentar</h2>
            <label>Tu opinión</label>
			<textarea id="comentarioUsuario" class="form-control"></textarea>
            </label><br>
            <label>Tu puntuación</label>
            <select id="numEstrellas" class="custom-select" style="width:50px">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </select><br>
            <button type="button" class="btn btn-primary my-4" id="enviarComentario">Enviar</button>`

            document.getElementById("enviarComentario").addEventListener("click", function(){

                let scoreUsuario;
                let opcionesDeScore = document.getElementById("numEstrellas").getElementsByTagName('option');
                    
                for (let i = 0; i < opcionesDeScore.length; i++) {
                   if (opcionesDeScore[i].selected){
                    scoreUsuario = opcionesDeScore[i].value;
                   } 
                }

                let fecha = new Date();
                let fechaComentario = `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()} ${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`                

                comentarioUsuario = {
                    "dateTime": fechaComentario,
                    "description": document.getElementById("comentarioUsuario").value,
                    "product": localStorage.getItem("idProducto"),
                    "score": Number(scoreUsuario),
                    "user": localStorage.getItem("nametag")
                    };

                    if(comentarioUsuario.description.length > 0){

                    document.getElementById("test").innerHTML += `<li class="list-group-item"><p><b>${comentarioUsuario.user}</b> - ${comentarioUsuario.dateTime} - ${funcionEstrellas(comentarioUsuario.score).estrellas}</p><p>${comentarioUsuario.description}</p></li>`;
                    }
            })
    }
    
    

    function productosRelacionados() {
        let relatedProds = document.createElement('div');
        let relatedTitle = document.createElement('h2');
        let relatedTitle2 = document.createTextNode('A otros usuarios también les ha interesado:');
        relatedTitle.appendChild(relatedTitle2)
        contenedor.append(relatedTitle)

        for (let i = 0; i < producto.relatedProducts.length; i++) {
            relatedProds.innerHTML += `
            <div class="card" style="width: 18rem; display: inline-block; margin-right: 5px;" id=${producto.relatedProducts[i].id}>
                <img src="${producto.relatedProducts[i].image}" class="card-img-top">
                <div class="card-body">
                    <p class="card-text">${producto.relatedProducts[i].name}</p>
                </div>
          </div>`
            contenedor.appendChild(relatedProds);


        };
        for (let i = 0; i < producto.relatedProducts.length; i++) {
            redireccionAProducto = document.getElementById(producto.relatedProducts[i].id);
            redireccionAProducto.addEventListener("click", function () {
                localStorage.removeItem("idProducto");
                localStorage.setItem("idProducto", producto.relatedProducts[i].id)
                window.location.href = 'product-info.html';
            })

        }

    }

})
