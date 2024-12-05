const handleHttpError = require("../utils/handleError")
const { verifyToken } = require("../utils/handleJwt")
const { comercioModel, usuarioModel } = require("../models")

//middleware que comprueba la autorizacion
const authMiddleware = async (req, res, next) => {
    try{
        if (!req.headers.authorization) {
            handleHttpError(res, "NOT_TOKEN", 401)
            return
        }
        // Nos llega la palabra reservada Bearer (es un estándar) y el Token, así que me quedo con la última parte
        const arraytoken = req.headers.authorization.split(' ')
        //Compruebo si el token es el correcto
        const dataToken = await verifyToken(arraytoken[1])
        if(!dataToken._id || arraytoken[0]!="Bearer") {
            handleHttpError(res, "ERROR_ID_TOKEN", 401)
            return
        }

        const user = await usuarioModel.findById(dataToken._id)
        req.user = user
        next()
    }catch(err){
        handleHttpError(res, "NOT_SESSION", 401)
    }
}

module.exports = { authMiddleware }
