//validador del comercio
//import el modulo para los validadores
const {check} = require("express-validator")
const validador = require("../utils/handleValidator")

const validadorCreateItem = [
    //no compruebo el length ya que el nombre puede tener la longitud deseada
    check("nombre").exists().notEmpty().withMessage("campo obligatorio").isString().withMessage("el nombre ha de ser un string"),
    check("cif").exists().notEmpty().withMessage("Campo obligatorio")
    .isLength({ min: 9, max: 9 }).withMessage("El CIF debe tener 9 caracteres")
    .custom(value => {
        // Verificar si el CIF tiene el formato correcto
        const cifRegex = /^[ABCDEFGHJKLMNPQS]\d{7}([0-9]|[ABCDEFGHIJ])$/;
        if (!cifRegex.test(value)) {
            throw new Error("El CIF no tiene un formato válido");
        }
        return true;
    }),
    check("direccion").optional().notEmpty().withMessage("campo obligatorio"),
    check("email").exists().notEmpty().withMessage("campo obligatorio").isEmail().withMessage("El correo electrónico no tiene un formato válido"),
    check("telefonoContacto").optional().notEmpty().withMessage("campo obligatorio").isLength({min: 9, max: 9}).withMessage("numero de caracteres erroneo").isInt().withMessage("a number was expected"),
    check("contrasenia").exists().notEmpty().withMessage("campo obligatorio"),
    check("ciudad").exists().notEmpty().withMessage("campo obligatorio"),
    check("actividad").exists().notEmpty().withMessage("campo obligatorio"),

    //las restantes seran opcionales (pero no hace falta indicarlo, a menos que queramos confirmar la estructura)
    (req, res, next) => {
        return validador(req, res, next)
    }
]

//comprobamos el CIF
const validatorGetItem = [
    check("cif").exists().notEmpty().withMessage("Campo obligatorio")
    .isLength({ min: 9, max: 9 }).withMessage("El CIF debe tener 9 caracteres")
    .custom(value => {
        // Verificar si el CIF tiene el formato correcto
        const cifRegex = /^[ABCDEFGHJKLMNPQS]\d{7}([0-9]|[ABCDEFGHIJ])$/;
        if (!cifRegex.test(value)) {
            throw new Error("El CIF no tiene un formato válido");
        }
        return true;
    }),
    (req, res, next) => {
        return validador(req, res, next)
    }
]

const validadorUpdateItem = [
    //ha de haber un cif para saber que comercio se esta a actualizar (podriamos llegar a sacarlo de la url pero en mi caso en el controller del comercio se mira si coinciden por lo que es necesario)
    check("cif").exists().notEmpty().withMessage("Campo obligatorio")
    .isLength({ min: 9, max: 9 }).withMessage("El CIF debe tener 9 caracteres")
    .custom(value => {
        // Verificar si el CIF tiene el formato correcto
        const cifRegex = /^[ABCDEFGHJKLMNPQS]\d{7}([0-9]|[ABCDEFGHIJ])$/;
        if (!cifRegex.test(value)) {
            throw new Error("El CIF no tiene un formato válido");
        }
        return true;
    }),
    check("nombre").optional().notEmpty().withMessage("campo obligatorio").isString().withMessage("el nombre ha de ser un string"),
    check("direccion").optional().notEmpty(),
    check("email").optional().notEmpty().isEmail().withMessage("El correo electrónico no tiene un formato válido"),
    check("telefonoContacto").optional().notEmpty().isLength({min: 9, max: 9}).withMessage("numero de caracteres erroneo").isInt().withMessage("a number was expected"),
    check("idPagina").optional().notEmpty().isInt().withMessage("id ha de ser un numero"),
    check("contrasenia").optional().notEmpty(),
    check("ciudad").optional().notEmpty().isString().withMessage("the city must be a string"),
    check("actividad").optional().notEmpty().isString().withMessage("the activity must be a string"),

    (req, res, next) => {
        return validador(req, res, next)
    } 
]

const validarResenias = [
    //ha de haber un cif para saber que comercio se esta a actualizar (podriamos llegar a sacarlo de la url pero en mi caso en el controller del comercio se mira si coinciden por lo que es necesario)
    check("cif").exists().notEmpty().withMessage("Campo obligatorio")
    .isLength({ min: 9, max: 9 }).withMessage("El CIF debe tener 9 caracteres")
    .custom(value => {
        // Verificar si el CIF tiene el formato correcto
        const cifRegex = /^[ABCDEFGHJKLMNPQS]\d{7}([0-9]|[ABCDEFGHIJ])$/;
        if (!cifRegex.test(value)) {
            throw new Error("El CIF no tiene un formato válido");
        }
        return true;
    }),
    check("resenias").exists().notEmpty().withMessage("falta la reseña"),
    check("scoring").exists().notEmpty().withMessage("falta el score").isInt().withMessage("los scores han de introducirse como un entero"),
    (req, res, next) => {
        return validador(req, res, next)
    } 
]

const validarCredencialesComercio = [
    //para la validar hemos de tener cif y contrasenia
    check("cif").exists().notEmpty().withMessage("Campo obligatorio")
    .isLength({ min: 9, max: 9 }).withMessage("El CIF debe tener 9 caracteres")
    .custom(value => {
        // Verificar si el CIF tiene el formato correcto
        const cifRegex = /^[ABCDEFGHJKLMNPQS]\d{7}([0-9]|[ABCDEFGHIJ])$/;
        if (!cifRegex.test(value)) {
            throw new Error("El CIF no tiene un formato válido");
        }
        return true;
    }),
    check("contrasenia").exists().notEmpty().withMessage("campo obligatorio"),
    (req, res, next) => {
        return validador(req, res, next)
    } 
]

const validarCiudad = [
    //para buscar por ciudad hemos de asegurarnos de que hay una ciudad en la url
    check('nombreCiudad').exists().withMessage('El nombre de la ciudad es obligatorio'),
]

const validarActividad = [
    //para buscar por actividad hemos de asegurarnos de que hay una actividad en la url
    check('actividad').exists().withMessage('La actividad es obligatoria'),
]

//exporto el modulo recien creado por metodos
module.exports = {validadorCreateItem, validatorGetItem, validadorUpdateItem, validarResenias, validarCredencialesComercio, validarCiudad, validarActividad}