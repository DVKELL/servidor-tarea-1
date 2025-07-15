const user = JSON.parse(localStorage.getItem("usuario")); //Obtiene los datos almacenados en el LS
const formulario = document.querySelector("#form-todos");
const lista = document.querySelector("#todos-list");
const inputF = document.querySelector("#form-input");
const cerrarBtn = document.querySelector("#cerrar-btn");

const notification = document.querySelector(".notification");

// validar si existe un usuario
if (!user) {
    //Si no hay nada en el LS, se cambiar la URL al inicio
    window.location.href = "../home/index.html";
} else {
    const obtenerLista = async () => {
        // Apunta a la BD para obtener los datos del array "tareas" y lo guarda en la variable
        const respuesta = await fetch("http://localhost:3000/tareas", {
            method: "GET",
        });

        //El array de respuestas se convierte en un objeto utilizable
        const list = await respuesta.json();

        // console.log("muestra lo que hay en el array TAREAS:", list);

        //Filtra la respuesta en cada posicion valida si el username_id es === al id que esta guardado en el LS
        const userList = list.filter((i) => i.username_id === user.id);
        console.log("tareas: ", userList);

        //Por cada tarea crea un li, le otorga el id de su posicion y el texto
        userList.forEach((i) => {
            const listadoTareas = document.createElement("li");
            listadoTareas.innerHTML = `
            <li id=${i.id} class="todo-item">
            <button class="delete-btn">&#10006;</button>
            <p>${i.descripcion}</p>
            <button class="check-btn">&#10003;</button>
          </li> 
            `;
            //Cada posicion se agrega al listado
            lista.appendChild(listadoTareas);
        });
    };

    //Se llaman a la funcion
    obtenerLista();

    //Al enviar el formulario
    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();

        await fetch("http://localhost:3000/tareas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                descripcion: inputF.value,
                username_id: user.id,
            }),
            //Enviamos a la BD la tarea ingresada en el input y se lleva el id del usuario conectado
        });
        obtenerLista();
    });

    lista.addEventListener("click", async (e) => {
        e.preventDefault();
        if (e.target.classList.contains("delete-btn")) {
            const id = e.target.parentElement.id;

            //Elimina el ID seleccionado de la BD tareas
            await fetch(`http://localhost:3000/tareas/${id}`, {
                method: "DELETE",
            });

            e.target.parentElement.remove();
        } else if (e.target.classList.contains("check-btn")) {
            console.log(e.target.parentElement.querySelector("p"));

            const id = e.target.parentElement.id;

            const respuestaJSON = await fetch(
                `http://localhost:3000/tareas/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        checked: e.target.parentElement.querySelector("p")
                            ? false
                            : true,
                        //Valida si el elemento seleccionado tiene la clase, si la tiene, se la pone en false y si no la tiene, la pone en true
                    }),
                }
            );
            const response = await respuestaJSON.json();
            e.target.parentElement
                .querySelector("p")
                .classList.toggle("check-todo");
        }
    });
}

cerrarBtn.addEventListener("click", (e) => {
    e.preventDefault();

    localStorage.removeItem("usuario");

    window.location.href = "../home/index.html";
});
