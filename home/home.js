const formL = document.querySelector("#form-login")
const formC = document.querySelector("#form-create")
const loginInput = document.querySelector("#login-input")
const createInput = document.querySelector("#create-input")
const notification = document.querySelector(".notification")

formC.addEventListener("submit",async e=>{
    e.preventDefault()

    /*GET: CONSULTAS
    POST: CREAR, REGISTRAR*/

    const usuarios = await fetch("http://localhost:3000/usuarios", {method: 'GET'})
    const user = await usuarios.json()

    console.log(user);


    // Validar
      const userVal = user.find(i => i.username === createInput.value)
     

     if (!createInput.value) {
        //Campo vacio
        console.log("vacio");
        notification.textContent = "El campo de usuario no puede estar vacio"
        notification.classList.add("show-notification")

        setTimeout(()=>{
            notification.classList.remove("show-notification")
        },2500)
        
    } else if (userVal){
        //Si el usuario ya existe
        console.log("El usuario: ", userVal, " ya existe");
        notification.textContent = `El usuario "${createInput.value}" ya se encuentra registrado`
        notification.classList.add("show-notification")
  
        setTimeout(()=>{
            notification.classList.remove("show-notification")
        },2500)
        
        return;
        
     } else {
        //Si el usuario no existe
        await fetch("http://localhost:3000/usuarios", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: createInput.value})
        });

        notification.textContent = `El usuario "${createInput.value}" Registrado correctamente`
        notification.classList.add("show-notification")
  
        setTimeout(()=>{
            notification.classList.remove("show-notification")
        },3500)
        
    }
})


formL.addEventListener("submit",async e=>{
    e.preventDefault()
    
    const usuarios = await fetch("http://localhost:3000/usuarios", {method: 'GET'})
    const user = await usuarios.json()
    
    const userVal = user.find(i => i.username === loginInput.value) //busca en usuarios, en cada posicion, en la clave username
    
    if (userVal) {
        console.log(`Usuario encontrado ${userVal.username}`);
        notification.textContent = `Bienvenido ${userVal.username}!`;
        notification.classList.add("show-notification")
        
        setTimeout(()=>{
            notification.classList.remove("show-notification")
        },3500)

        window.location.href = "../tareas/tareas.html"
        
    } else if (!userVal){
        notification.textContent = "El usuario no existe"
        notification.classList.add("show-notification")
        
        setTimeout(()=>{
            notification.classList.remove("show-notification")
        },3500)
    }

    
    

})