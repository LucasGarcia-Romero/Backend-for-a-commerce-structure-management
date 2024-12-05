//url para abrir slack directamente: https://app.slack.com/client/T074B9KM9J9/C0747JQJUT0
/*
para abrir el mongo atlas con la bbdd: 
    · mongodb+srv://ludivan9:legos2003@proyectowebbackend.pyxrgb1.mongodb.net/
    · abrir app mongo compass
    · en new connection (lo primero que aparece), pegar el texto de arriba
    · la bbdd sera test
*/
//Se tiene que ejecutar antes de los imports de otros archivos ya que en cuanto importa el route sustituye los valores
require('dotenv').config()

//Importamos las funciones
const morganBody = require("morgan-body")
const loggerStream = require("./utils/handleLogger")

const dbConnect = require('./config/mongo')
const routerGlobal = require("./routes")
// const routerStorage = require("./routes/storage.js");
const swaggerUi = require("swagger-ui-express")
const swaggerSpecs = require("./docs/swagger")

const express = require("express")
const cors = require("cors")

const app = express()

//Le decimos a la app de express() que use corts para evitar el error Cross-Domain
app.use(cors())
app.use(express.json())
app.use(express.static("storage"))          //Para que haya un sitio publico de  donde coger imagenes

//uso de morgan para slack
morganBody(app, {
    noColors: true,
    skip: function(req, res) {
        return res.statusCode < 400
    },
    // Configura morganBody para que se salten los logs de las respuestas que tienen un código de estado menor a 400,
    // es decir, solo se registran los errores y respuestas de redirección (4XX y 5XX).
    stream: loggerStream
})

app.use("/api-docs",
 swaggerUi.serve,
 swaggerUi.setup(swaggerSpecs)
)


app.use("/api", routerGlobal)

const port = process.env.PORT ?? 3000           //Se podria sustituir por || si no queremos aceptar al puerto 0

dbConnect()

app.listen(port, () => {
    console.log("Servidor escuchando en el puerto " + port)
})

module.exports = app