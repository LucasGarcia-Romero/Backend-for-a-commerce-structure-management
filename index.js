//Se tiene que ejecutar antes de los imports de otros archivos ya que en cuanto importa el route sustituye los valores
require('dotenv').config()

//Importamos las funciones
const dbConnect = require('./config/mongo')
const routerGlobal = require("./routes")
// const routerStorage = require("./routes/storage.js");

const express = require("express")
const cors = require("cors")

const app = express()

//Le decimos a la app de express() que use corts para evitar el error Cross-Domain
app.use(cors())
//hace que todo aquello que reciba este en formato json (gran utilidad para PUT y POST)
app.use(express.json())
app.use(express.static("storage"))          //Para que haya un sitio publico de  donde coger imagenes

//con esto hago que para acceder al router normal deba llamar al /api
app.use("/api", routerGlobal)

const port = process.env.PORT ?? 3000           //Se podria sustituir por || si no queremos aceptar al puerto 0 (de esta forma si es nulo o indefinido te coge el puerto 3000)

dbConnect()

app.listen(port, () => {
    console.log("Servidor escuchando en el puerto " + port)
})