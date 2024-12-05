//validador del comercio
//import el modulo para los validadores
const {check} = require("express-validator")
const validador = require("../utils/handleValidator")

const validadorRegister = [
    check("nombreUsuario").exists().notEmpty().withMessage("campo obligatorio").isLength( {max: 20} ).withMessage("el nombre es demasiado largo"),
    check("email").exists().notEmpty().withMessage("campo obligatorio"),
    check("contrasenia").exists().notEmpty().withMessage("campo obligatorio").isLength( {min:8, max: 16} ).withMessage("la longitud no es valida"),
    check("edad").exists().notEmpty().withMessage("campo obligatorio").isInt().withMessage("la edad ha de ser un numero"),
    check("ciudad").exists().notEmpty().withMessage("campo obligatorio"),
    check("permiteRecibirOfertas").exists().notEmpty().withMessage("campo obligatorio").isBoolean().withMessage("este campo ha de ser true o false"),
    check("rol").optional().notEmpty(),
    check("intereses").optional().notEmpty(),
    (req, res, next) => {
        return validador(req, res, next)
    }
]

//comprobamos el email
const validatorGetEmail = [
    check("email").exists().notEmpty().withMessage("email vacio"),
    (req, res, next) => {
        return validador(req, res, next)
    }
]
const validadorLogin = [
    check("email").exists().notEmpty().withMessage("campo obligatorio"),
    check("contrasenia").exists().notEmpty().withMessage("campo obligatorio").isLength( {min:8, max: 16} ).withMessage("la longitud no es valida"),
    (req, res, next) => {
        return validador(req, res, next)
    }
]

const validadorUpdateUser = [
    check("nombreUsuario").optional().notEmpty().withMessage("campo obligatorio").isLength( {max: 20} ).withMessage("el nombre es demasiado largo"),
    check("email").exists().optional().withMessage("campo obligatorio"),
    check("contrasenia").optional().notEmpty().withMessage("campo obligatorio").isLength( {min:8, max: 25} ).withMessage("la longitud no es valida"),
    check("edad").optional().notEmpty().withMessage("campo obligatorio").isInt().withMessage("la edad ha de ser un numero"),
    check("ciudad").optional().notEmpty().withMessage("campo obligatorio"),
    check("permiteRecibirOfertas").optional().notEmpty().withMessage("campo obligatorio").isBoolean().withMessage("este campo ha de ser true o false"),
    check("rol").optional().notEmpty(),
    check("intereses").optional().notEmpty(),
    (req, res, next) => {
        return validador(req, res, next)
    }
]

const validarIntereses = [
    check("intereses").exists().notEmpty().withMessage("campo obligatorio"),
    (req, res, next) => {
        return validador(req, res, next)
    }
]

//exporto el modulo recien creado por metodos
module.exports = {validatorGetEmail, validadorRegister, validadorLogin, validarIntereses, validadorUpdateUser}