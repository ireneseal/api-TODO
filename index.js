require("dotenv").config();
const express = require("express");

const servidor = express();

servidor.use("/prueba", express.static("./pruebas_api"));

servidor.get("/api-todo", (peticion, respuesta)=>{
    respuesta.send("metodo GET")
});

servidor.post("/api-todo", async(peticion, respuesta)=>{
    respuesta.send("metodo POST")
});

servidor.put("/api-todo", (peticion, respuesta)=>{
    respuesta.send("metodo PUT")
});

servidor.delete("/api-todo", (peticion, respuesta)=>{
    respuesta.send("metodo DELETE")
});

servidor.use((peticion, respuesta)=>{
    respuesta.json({error : "not found"})
}); //El .use es para todas las url que resten, que no sean ninguna de las anteriores



servidor.listen(process.env.PORT);
//Este servidor es local, pero si subimos esto a la nube, se nos otorga un puerto dentro de una variable de entorno