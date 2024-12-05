/*
    Este archivo proporciona un middleware de Express que maneja los resultados de las validaciones realizadas con express-validator
    devolviendo una respuesta con errores en caso de que la validacion no sea correcta
*/

const { validationResult } = require("express-validator")

const validateResults = (req, res, next) => {
    try {
        validationResult(req).throw()
        return next()
    } catch (err) {
        res.status(403)                         //Error de fallo en el validador
        res.send({ errors: err.array() })
    }
}

module.exports = validateResults
