let logueo = document.getElementById("logueoJAP");
let mailIngresado = document.getElementById("casillaMail");
let passIngresada = document.getElementById("casillaPass");

logueo.addEventListener("submit",function(e){
    
    let checkMail = mailIngresado.value;
    let checkPass = passIngresada.value;
    console.log(checkMail.length);
    console.log(checkPass.length);
    if (checkMail.length>0 && checkPass.length>0){
        e.preventDefault();  
        localStorage.setItem('nametag', mailIngresado.value);
        window.location.href = 'index1.html';
    }else{
        e.preventDefault();
        alert("Complete los campos necesarios para proseguir")
    }
})
