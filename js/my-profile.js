
if (localStorage.getItem("infoPerfil") == null) {
    datosUsuario = { "primerNombre": "", "segundoNombre": "", "primerApellido": "", "segundoApellido": "", "mail": localStorage.getItem("nametag"), "telefono": "" };
    localStorage.setItem("infoPerfil", JSON.stringify(datosUsuario));
};


if (localStorage.getItem("imgPerfil") == null) {
    document.getElementById("imagen-de-perfil").setAttribute("src", "img/img_perfil.png");
} else {
    document.getElementById("imagen-de-perfil").setAttribute("src", localStorage.getItem("imgPerfil"));
}




let JSONdatos = JSON.parse(localStorage.getItem("infoPerfil"));

let contenedorDatos = document.getElementById("contenedor-datos");

let formDatos = document.createElement("div");

console.log(localStorage.getItem("infoPerfil"))

formDatos.innerHTML = `
<form id="datos-perfil" class="needs-validation" novalidate>
    <div>
        <div class="row my-4">
            <div class="col">
                <h5>Primer nombre*</h5>
                <input id="primer-nombre" type="text" class="form-control" value="${JSONdatos.primerNombre}" aria-label="primer-nombre" required>
                <p class="invalid-feedback">Campo obligatorio</p>
            </div>
            <div class="col">
                <h5>Segundo nombre</h5>
                <input id="segundo-nombre" type="text" class="form-control" value="${JSONdatos.segundoNombre}" aria-label="segundo-nombre">
            </div>
        </div>
        <div class="row my-4">
            <div class="col">
                <h5>Primer apellido*</h5>
                <input id="primer-apellido" type="text" class="form-control" value="${JSONdatos.primerApellido}" aria-label="primer-apellido" required>
                <p class="invalid-feedback">Campo obligatorio</p>
            </div>
            <div class="col">
                <h5>Segundo apellido</h5>
                <input id="segundo-apellido" type="text" class="form-control" value="${JSONdatos.segundoApellido}" aria-label="segundo-apellido">
            </div>
        </div>
        <div class="row my-4">
            <div class="col">
                <h5>Email*</h5>
                <input id="mail-usuario" type="email" class="form-control" value="${JSONdatos.mail}" aria-label="mail-usuario" required>
                <p class="invalid-feedback">Campo obligatorio</p>
            </div>
            <div class="col">
                <h5>Teléfono de contacto</h5>
                <input id="telefono-usuario" type="text" class="form-control" value="${JSONdatos.telefono}" aria-label="telefono-usuario">
            </div>
            
        </div>
        <div class="input-group my-4">
            <input type="file" class="form-control" id="inputFotoPerfil">
        </div>
    </div>
    <small>* campo obligatorio</small>  
</form>`;

contenedorDatos.appendChild(formDatos);

document.getElementById("inputFotoPerfil").addEventListener("change", () => {
    let inputImgPerfil = new FileReader();
    
    inputImgPerfil.addEventListener("load", ()=> {
        localStorage.setItem("imgPerfil", inputImgPerfil.result);
        
        document.getElementById("imagen-de-perfil").setAttribute("src", localStorage.getItem("imgPerfil"));
    })

    inputImgPerfil.readAsDataURL(document.getElementById("inputFotoPerfil").files[0]);
});

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
                    let inputDatosPerfil = document.getElementById('datos-perfil').getElementsByTagName('input');

                    datosUsuario = { 
                        "primerNombre": inputDatosPerfil[0].value, 
                        "segundoNombre": inputDatosPerfil[1].value, 
                        "primerApellido": inputDatosPerfil[2].value, 
                        "segundoApellido": inputDatosPerfil[3].value, 
                        "mail": inputDatosPerfil[4].value,  
                        "telefono": inputDatosPerfil[5].value 
                    };
    
                    
                    localStorage.removeItem("infoPerfil");
                    localStorage.setItem("infoPerfil", JSON.stringify(datosUsuario));

                    localStorage.setItem("nametag", datosUsuario.mail)

                    console.log(localStorage.getItem("infoPerfil"));
                    console.log(JSON.parse(localStorage.getItem("infoPerfil")));      
                }

            form.classList.add('was-validated')
        }, false)
    })
})()