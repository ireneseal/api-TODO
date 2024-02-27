const contenedorTareas = document.querySelector(".tareas");
const formulario = document.querySelector("form");
const inputTexto = document.querySelector('form input[type = "text"]');

fetch("/api-todo")
  .then((respuesta) => respuesta.json())
  .then((tareas) => {
    tareas.forEach(({ id, tarea, terminada }) => {
      new Tarea(id, tarea, terminada, contenedorTareas);
    });
  });

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  if (/^[a-záéíóúñü][a-záéíóúñü0-9 ]*$/i.test(inputTexto.value)) {
    //test para testear la expresion regular
    return fetch("/api-todo/crear", {
      method: "POST",
      body: JSON.stringify({ tarea: inputTexto.value }),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((respuesta) => respuesta.json())
      .then(({ id }) => {
        if (id) {
          new Tarea(id, inputTexto.value.trim(), false, contenedorTareas); //Esto son los elementos que hay que pasarle al objeto en tarea.js
          return (inputTexto.value = "");
        }
        console.log("error");
      });
  }
});
