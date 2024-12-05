/*
    Implementa de gestión de errores, cuando ocurra un error devido a los validators llama a esta funcion
*/

const handleHttpError = (res, message, code = 403) => {
    res.status(code).send(message)
}

module.exports = handleHttpError