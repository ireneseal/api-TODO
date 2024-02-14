require("dotenv").config()
const express = require("express");
const servidor = express();


servidor.listen(process.env.PORT);
//Este servidor es local, pero si subimos esto a la nube, se nos otorga un puerto dentro de una variable de entorno