/**
 * Obtener lista de la base de datos
 * @param {*} req
 * @param {*} res
 */

const { usuarioModel, comercioModel } = require('../models')               //no se si con /models vale
const handleError = require('../utils/handleError')
const {matchedData} = require('express-validator')
const jwt = require('jsonwebtoken');
const { encrypt, compare } = require('../utils/handlePassword')
const { tokenSign, verifyToken } = require('../utils/handleJwt')


//para depurar tokens: jwt.ia

//devuelve todos los usuarios
const getUsers = async (req, res) => {
    try {
        // Obtiene todos los usuarios
        const users = await usuarioModel.find();
        res.send(users);
    } catch(err) {
        handleHttpError(res, 'Error en el GET', 403);
    }
}

//da el usuario con el id indicad
const getUser= async (req, res) => {
    //Request contiene información sobre la solicitud realizada por el cliente, como los parámetros de la URL, los encabezados, el cuerpo de la solicitud
        const email = req.params.email;
        try {
            //para otener el valor, al igual que el GET general pero usando el findOne (al igual que el mongo)
            const data = await usuarioModel.findOne({ email: email });
            res.send(data);
        } catch(err) {
            handleHttpError(res, 'error en el GET', 403);
        }
    }


//crea un nuevo usuario en la BBDD
const createUser = async (req, res) => {
    try {
        const requestData = matchedData(req);
        // Encrypta la contraseña
        const contrasenia = await encrypt(requestData.contrasenia);

        // Verificar si se ha proporcionado el rol en la solicitud, si no, asignar el rol predeterminado 'user'
        if (!requestData.rol || !requestData.rol.includes('admin')) {
            requestData.rol = 'user';
        }
        // Construye el objeto body con la contraseña encriptada
        const body = { ...requestData, contrasenia };
        // Crear el usuario
        const newUser = await usuarioModel.create(body);
        newUser.set('contrasenia', undefined, { strict: false }); // Sirve para que al hacer un get, nunca se devuelva el pasword

        // Generar el token y preparar los datos de respuesta
        const data = {
            token: await tokenSign(newUser),
            data: newUser
        };

        // Enviar los datos de respuesta
        res.send(data);
    } catch (err) {
        handleError(res, 'Error al crear el usuario en el CREATE', 500);
    }
};


//actualiza un nuevo usuario en la BBDD
/*
funciona por medio de sustitucion de todos los datos
- problema: han de introducirse todos los datos de nuevo, incluido el id
- posible mejora: indicar solo una serie de datos y confirmar si el valor ha sido introducido
*/
const updateUser = async (req, res) => {
    //Request contiene información sobre la solicitud realizada por el cliente, como los parámetros de la URL, los encabezados, el cuerpo de la solicitud

    try {
        const email = req.params.email;
        //tomo los datos a actualizar
        const requestData = matchedData(req);
        const contrasenia = await encrypt(requestData.contrasenia);
        // Construye el objeto body con la contraseña encriptada
        const body = { ...requestData, contrasenia };

        //el cif es un dato inmodificable porque ha de coincidir
        if(body.email != email){
            handleError(res, 'No se puede modificar el email', 403);
        }
        //en caso de que el email coincida se actualiza
        else{
            console.log(email)
            // Buscando el documento por cif y altero su valor
            const data = await usuarioModel.findOneAndUpdate({ email: email }, body, { new: true })
            res.send(data);
        }        
    } catch(err) {
        console.log(err);
        handleError(res, 'error en el UPDATE', 403)
    }
}

const deleteUser = async (req, res) => {
    /*
    tendra dos tipos de DELETE logico donde lo marcaremos como borrado pero lo mantendremos en la memoria en caso de querer utilizarlosy borrado basico donde eliminaremos la informacion 
    - pros logico: permite la recuperacion de los datos
    - contras logico: no se libera la memoria
    - caso optimo: mantener como logico hasta el fin de un TTL y luego eliminarlo de manera completa (como ocurriria con los archivos en la papelera de reciclaje)
    */
    try {
        const { Logico } = req.query
        const email = req.params.email
        let data

        //borrado logico
        if(Logico){
            //vamos a trabajarlo a modo de update alterando el valor del deleted
            // Buscar el comercio por CIF
            const existingItem = await usuarioModel.findOne({ email: email });
            // Si no se encuentra el comercio, devolver un error
            if (!existingItem) {
                return res.status(404).send("Usuario no encontrado");
            }
            // Marcar el comercio como eliminado lógicamente
            existingItem.deleted = true; // Suponiendo que existe un campo "deleted" en el esquema para indicar el estado de eliminación

            // Guardar los cambios en la base de datos
            data = await existingItem.save();
        }
        //borrado basico
        else{
            data = await usuarioModel.findOneAndDelete({ email: email })
        }
        if (!data) {
            return res.status(404).send("Usuario no encontrado")
        }
        res.send(data);
    } catch (err) {
        // Manejar errores
        handleError(res, 'error en el DELETE')
    }
}

const loginUser = async (req, res) => {
    try {
        const requestData = req.body; // En lugar de utilizar matchedData, obtenemos los datos directamente del cuerpo de la solicitud

        const usuario = await usuarioModel.findOne({ email: requestData.email }); // Buscar el usuario en la base de datos utilizando el correo electrónico proporcionado

        // Verificar si el usuario existe
        if (!usuario) {
            return res.status(404).json({ error: "El usuario no existe" });
        }

        const concide = await compare(requestData.contrasenia, usuario.contrasenia); // Comparar la contraseña proporcionada con la contraseña almacenada en la base de datos
        
        if (!concide) {
            return res.status(401).json({ error: "Credenciales no validas" });
        }

        // Eliminar la contraseña del objeto de usuario antes de enviar la respuesta
        usuario.set('contrasenia', undefined, { strict: false });

        const data = {
            token: await tokenSign(usuario), // Suponiendo que tengas una función tokenSign para generar tokens de autenticación
            data: usuario
        };

        res.status(200).send(data);
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

const getUsuariosPorEInteres = async(req, res) => {
    const requestData = req.params;                        // Obtenemos los parametros de la URL

    try{
        // Obtengo el comercio con ese cif
        const comercio = await comercioModel.findOne({ cif : requestData.cif });
        if (!comercio) {
          return res.status(404).json({ error: 'Comercio no encontrado' });
        }
        // Accede a la propiedad ciudad de manera más explícita
        const ciudad = comercio.get('ciudad');

        const emails = await usuarioModel.find({ciudad: ciudad, intereses: requestData.intereses, permiteRecibirOfertas: true}).select('email');
        res.json(emails);

    } catch (error) {
      res.status(500).send(error.message);
    }

}

//Exports
module.exports = {getUsers, getUser, createUser, updateUser, deleteUser, loginUser, getUsuariosPorEInteres };