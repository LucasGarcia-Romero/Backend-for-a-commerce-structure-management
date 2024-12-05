/*
    Este archivo configura un middleware de Multer para manejar la carga de archivos en una aplicación Node.js
    Comprueba la especificacion de la carpeta de destino y el formato de nombre de los archivos subidos.
*/


const multer = require("multer")
const storage = multer.diskStorage({
    destination:__dirname + "/../storage",
    filename:function(req, file, callback){ //Sobreescribimos o renombramos
        //Tienen extensión jpg, pdf, mp4
        const ext = file.originalname.split(".").pop() //el último valor
        const filename = "file-"+Date.now()+"."+ext
        callback(null, filename)
    }
})
const uploadMiddleware = multer({storage}) //Middleware entre la ruta y el controlador
module.exports = uploadMiddleware