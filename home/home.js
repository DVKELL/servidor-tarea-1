const formL = document.querySelector("#form-login")
const formC = document.querySelector("#form-create")
const loginInput = document.querySelector("#login-input")
const createInput = document.querySelector("#create-input")
const notification = document.querySelector(".notification")


//Para Crear el usuario
formC.addEventListener("submit",async e=>{
    e.preventDefault()

    /*GET: CONSULTAS
    POST: CREAR, REGISTRAR*/

    /*PASOS PARA CREAR UN USUARIO
    1. Obtener todos los datos de la BD para validar
    2. Convertir la informacion de la BD en datos utilizables
    3. Validar si el campo esta vacio, o si el usuario ya se encuentra creado, consultando los datos obtenidos de la BD
    4. Crear el usuario en caso que no exista y mandarlo a la BD*/

    //Se obtiene lo que esta en la bd usuarios
    const usuarios = await fetch("http://localhost:3000/usuarios", {method: 'GET'})

    //Convierte lo obtenido a un objeto utilizable
    const user = await usuarios.json()

    //Se muestra por consola al usuario
    console.log(user);


    // Validar

    //Busca en el array usuarios, por cada posicion para un match con lo que esta en el input
    //En caso true, devuelve el dato encontrado
      const userVal = user.find(i => i.username === createInput.value)
     

      //Campo vacio
     if (!createInput.value) {
        console.log("vacio");
        notification.textContent = "El campo de usuario no puede estar vacio"
        notification.classList.add("show-notification")

        setTimeout(()=>{
            notification.classList.remove("show-notification")
        },2500)
        
        //Si el usuario ya existe
    } else if (userVal){
        console.log("El usuario: ", userVal, " ya existe");
        notification.textContent = `El usuario "${createInput.value}" ya se encuentra registrado`
        notification.classList.add("show-notification")
  
        setTimeout(()=>{
            notification.classList.remove("show-notification")
        },2500)
        
        return;
        
        //Si el usuario no existe
     } else {

        //Apunta a la BD
        await fetch("http://localhost:3000/usuarios", {
            method: "POST",
            headers: {
                //Le indica al servidor lo que estamos enviando
                'Content-Type': 'application/json'
            },
            //Es la informacion que se va a enviar a la BD
            body: JSON.stringify({username: createInput.value})

            //Todo este fetch funciona para enviar la informacion del input a la BD, crea el campo username con el value del input
        });

        notification.textContent = `El usuario "${createInput.value}" Registrado correctamente`
        notification.classList.add("show-notification")
  
        setTimeout(()=>{
            notification.classList.remove("show-notification")
        },3500)
    }
})

//Ingresar con un usuario creado
formL.addEventListener("submit",async e=>{
    e.preventDefault()
    
    //1. Obtener los datos que estan en la BD y convertirlos a datos utilizables
    const usuarios = await fetch("http://localhost:3000/usuarios", {method: 'GET'})
    const user = await usuarios.json()
    
    const userVal = user.find(i => i.username === loginInput.value) //busca en usuarios, en cada posicion el valor de la clave username
    
    if (userVal) {
        console.log(`Usuario encontrado ${userVal.username}`);
        notification.textContent = `Bienvenido ${userVal.username}!`;
        notification.classList.add("show-notification")
        
        setTimeout(()=>{
            notification.classList.remove("show-notification")
        },3500)

        //Se guardan los datos de ese usuario en el LS, para ser usados despues
        localStorage.setItem("usuario", JSON.stringify(userVal))
        window.location.href = "../tareas/tareas.html"
        
    } else if (!userVal){
        notification.textContent = "El usuario no existe"
        notification.classList.add("show-notification")
        
        setTimeout(()=>{
            notification.classList.remove("show-notification")
        },3500)
    }
})