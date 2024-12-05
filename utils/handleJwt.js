/*
    Este fichero encapsula la lógica para generar y verificar tokens JWT
*/


const jwt = require("jsonwebtoken")
//obtenemos el token del .env
const JWT_SECRET = process.env.JWT_SECRET

const tokenSign = async (user) => {
    const token = await jwt.sign(
        {
            _id: user.id,
            email: user.email
        }, JWT_SECRET, {expiresIn: '2h'})
    return token
}

const verifyToken = async (token) => {
    //devuelve el token descodificado
    return jwt.verify(token, JWT_SECRET)
}
module.exports = { tokenSign, verifyToken }
