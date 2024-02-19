require("dotenv").config();
const express = require("express");
const { json } = require("body-parser"); //Desestructuramos y cogemos solo el jason del body-parser porque es lo unico que vamos a necesitar
const { getTareas, crearTareas } = require("./db");

const servidor = express();

////////////////////////////// MIDDLEWARE //////////////////////////////

servidor.use(json()); //esto intercepta cualquier peticion (porque no tiene una url especifica) y crea un objeto. Si no estamos enviando nada (es decir Content type : Application / json), el objeto queda vacio. Y va una a una pasando al resto de funciones (el body-parser ya tiene integrada la funcion siguiente)

servidor.use("/prueba", express.static("./pruebas_api")); //En este caso el método no es ni GET, ni POST ... sino un método genérico. Si la url que me ha entrado es /prueba y yo tengo un fichero index.js en la carpeta, se muestra. Sino salta al siguiente middleware (los específicos)

servidor.get("/api-todo", async (peticion, respuesta) => {
  try {
    let tareas = await getTareas(); // Si esto sale bien:
    respuesta.json(tareas); // colores nos retorna un array de objetos, asique es necesario pasarlo a string
  } catch (error) {
    respuesta.status(500); //Error en el servidor
    respuesta.json(error); // Para que lo convierta a un string y lo eníe a quien hizo la peticion
  }
});

servidor.post("/api-todo/crear", async (peticion, respuesta, siguiente) => {
  let { tarea } = peticion.body; //Si el objetio tiene tarea, tendrá el valor de lo que haya escrito la persona. Si no tiene tarea, devolverá undefined

  if (tarea && tarea.trim() != "") {
    //esto es para comprobar que lo que pongan en tarea es válido o no
    try {
      let id = await crearTareas({ tarea });
      return respuesta.json({ id }); //La respuesta trae el id para poder trabajar con ese id más adelante, para borrar, crear, etc
    } catch (error) {
      respuesta.status(500);
      return respuesta.json(error); //Debe retornar para que no pase al siguiente, sino siempre acabaría en el error del final
    }
  }

  siguiente({ error: "falta el argumento de la tarea en el objeto JSON" });

  //Dentro de una funcion async no puedo hacer un throw, tendria que estar dentro de una promesa

  //throw "...no me enviaste una tarea valida"; // Es un return que genera una excepcion, lo que ponga en el thow aterriza entre los paréntesis del catch
});

servidor.put("/api-todo", (peticion, respuesta) => {
  respuesta.send("metodo PUT");
});

servidor.delete("/api-todo/borrar/:", (peticion, respuesta) => {
  respuesta.send("metodo DELETE");
});

servidor.use((peticion, respuesta) => {
  respuesta.status(404);
  respuesta.json({ error: "not found" });
}); //El .use es para todas las url que resten, que no sean ninguna de las anteriores. Este sería un genérico, como el error 404, en caso de que la peticion no entre por ninguna de las anteriores

servidor.use((error, peticion, respuesta, siguiente) => {
  respuesta.status(400);
  respuesta.json({ error: "peticion no valida" }); // exprés ya sabe que al método use con 4 argumentos es siempre el que tiene que salir por error.
});

servidor.listen(process.env.PORT);
//Este servidor es local, pero si subimos esto a la nube, se nos otorga un puerto dentro de una variable de entorno
