class Tarea {
  constructor(id, textoTarea, estado, contenedor) {
    this.id = id;
    this.textoTarea = textoTarea; //Por scope esto solo vive dentro de esta funcion y no más adelante. Por eso la podemos llamar despues
    this.DOM = null; //componente html
    this.editando = false;
    this.crearComponente(estado, contenedor);
  } //Todo lo que cree en constructor más adelante puede accederse

  crearComponente(estado, contenedor) {
    //Estas son variables locales, solo están encuadradas dentro del metodo (crearComponente)

    this.DOM = document.createElement("div");
    this.DOM.classList.add("tarea");

    //Crear el texto de la tarea
    let textoTarea = document.createElement("h2");
    textoTarea.classList.add("visible");
    textoTarea.innerText = this.textoTarea;

    //Crear el input
    let inputTarea = document.createElement("input");
    inputTarea.setAttribute("type", "text");
    inputTarea.value = this.textoTarea;

    //Crear el boton EDITAR
    let botonEditar = document.createElement("button");
    botonEditar.classList.add("boton");
    botonEditar.innerHTML = "Editar";
    botonEditar.addEventListener("click", () => this.editarTarea());

    //Crear el boton BORRAR
    let botonBorrar = document.createElement("button");
    botonBorrar.classList.add("boton");
    botonBorrar.innerHTML = "Borrar";
    botonBorrar.addEventListener("click", () => this.borrarTarea()); //La funcion flecha no crea un contexto a parte

    //Crear boton ESTADO
    let botonEstado = document.createElement("button");
    botonEstado.classList.add("estado", estado ? "terminada" : null);
    botonEstado.appendChild(document.createElement("span"));
    botonEstado.addEventListener("click", () => {
      this.toggleEstado().then(({ resultado }) => {
        console.log(resultado);
        if (resultado == "fulfill") {
          return botonEstado.classList.toggle("terminada");
        }
        console.log("error");
      });
    });

    this.DOM.appendChild(textoTarea);
    this.DOM.appendChild(inputTarea);
    this.DOM.appendChild(botonEditar);
    this.DOM.appendChild(botonBorrar);
    this.DOM.appendChild(botonEstado);
    contenedor.appendChild(this.DOM);
  }
  borrarTarea() {
    fetch("/api-todo/borrar/" + this.id, {
      method: "DELETE",
    })
      .then((respuesta) => respuesta.json())
      .then(({ resultado }) => {
        //Sabemos que va a venir un objeto con un valor resultado, asique desestructuramos para coger el valor "fulfill" o "reject" en una variable
        if (resultado == "fulfill") {
          return this.DOM.remove();
        }
        console.log("error al borrar la tarea");
      });
  }
  toggleEstado() {
    return fetch(`/api-todo/actualizar/${this.id}/2`, {
      method: "PUT",
    }).then((respuesta) => respuesta.json());
    //En este caso no hace falta el siguiente .then, porque pasamos al callback de toggleEstado()
  }

  //Editar tarea será un método asincrono
  async editarTarea() {
    if (this.editando) {
      //guardar
      //children[0] --> es el h2
      //children[1] --> es el input
      let textoTemporal = this.DOM.children[1].value; //Lo que ha escrito el usuario, se guarda aquí de forma temporal

      if (
        textoTemporal.trim() != "" &&
        textoTemporal.trim() != this.textoTarea
      ) {
        //En este caso metemos el fetch en una variable porque estamos esperando la respuesta de fulfill o reject para poder actuar
        let { resultado } = await fetch(`/api-todo/actualizar/${this.id}/1`, {
          method: "PUT",
          body: JSON.stringify({ tarea: textoTemporal.trim() }),
          headers: {
            "Content-type": "application/json",
          },
        }).then((respuesta) => respuesta.json());
        //Aquí luego hemos metido la variable resultado que ya ha esperado a recibir una respuesta "fulfill" o "reject"
        if (resultado == "fulfill") {
          this.textoTarea = textoTemporal;
        }
      }

      this.DOM.children[0].innerText = this.textoTarea;
      this.DOM.children[0].classList.add("visible");
      this.DOM.children[1].classList.remove("visible");
      this.DOM.children[2].innerText = "editar";
      this.editando = false;
    } else {
      //editar
      this.DOM.children[0].classList.remove("visible");
      this.DOM.children[1].value = this.textoTarea;
      this.DOM.children[1].classList.add("visible");
      this.DOM.children[2].innerText = "guardar";
      this.editando = true;
    }
  }
}
