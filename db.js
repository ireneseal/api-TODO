//FICHERO PARA INTERACTUAR CON LA BASE DE DATOS

require("dotenv").config(); //Para que pueda leer el .env --> Esto es para simular el servidor que ahora estamos usando el local
const postgres = require("postgres");

//Estos pasos son siempre los mismos, la funcion conectar y en este caso tambien la de postgress

function conectar() {
  //esta funcion directamente nos retorna la conexion
  return postgres({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
}

function getTareas() {
  return new Promise(async (fulfill, reject) => {
    let conexion = conectar();

    try {
      let tareas = await conexion`SELECT * FROM tareas`; // Para buscar las tareas en la BBDD
      conexion.end();

      fulfill(tareas);
      // Si esto se cumple, entrará en fulfill
    } catch (error) {
      reject({ error: "error" });
    }
  });
}

function crearTareas({ tarea }) {
  return new Promise(async (fulfill, reject) => {
    let conexion = conectar();
    try {
      let [{ id }] =
        await conexion`INSERT INTO tareas (tarea) VALUES (${tarea}) RETURNING id`;
      conexion.end();

      fulfill(id);
    } catch (error) {
      reject({ error: "no se pudo crear la tarea" });
    }
  });
}

function borrarTarea(id) {
    return new Promise(async (fulfill, reject) => {
      let conexion = conectar();
  
      try {
        let {count} = await conexion`DELETE FROM tareas WHERE id = ${id}`;
        conexion.end();
        //count: cuando borro o actualizo el array llega vacío, pero si lo extraigo como valor dela propiedad count del objeto --> esto me da si ha sucedido algo, si es 0 no ha sucedido nada, pasaría por error, si es entre 1-9 ha habido cambios - por tanto sí se ha borrado
        fulfill(count);

      } catch (error) {
        reject({ error: "no se pudo borrar la tarea" });
      }
    });
  }

module.exports = { getTareas, crearTareas, borrarTarea };
