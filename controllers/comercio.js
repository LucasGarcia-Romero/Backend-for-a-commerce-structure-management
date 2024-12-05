/**
 * Obtener lista de la base de datos
 * @param {*} req
 * @param {*} res
 */

const { comercioModel } = require('../models')
const handleError = require('../utils/handleError')
const {matchedData} = require('express-validator')
const { encrypt, compare } = require('../utils/handlePassword')
const { tokenSign, verifyToken } = require('../utils/handleJwt')

//recojo todos los comercios de la bbdd
const getItems = async (req, res) => {
    try {
        let query = comercioModel.find({ deleted: { $ne: true } })
        const { ordenadoXCif } = req.query

        //con esto permitire al http indicar si desea obtener los resultados ordenados por CIF
        if (ordenadoXCif) {
            query = query.sort({ cif: 1 })
        }

        //en caso de no haberse indicado como tal el orden sera el originario en la base de datos al no entrar al if
        const data = await query.exec(); 
        res.send(data);
    } catch (err) {
        handleError(res, 'error en el GET', 403)
    }
}

//recojo el comercios correspondiente al CIF de la bbdd
const getItem = async (req, res) => {
    //Request contiene información sobre la solicitud realizada por el cliente, como los parámetros de la URL, los encabezados, el cuerpo de la solicitud
    const cif = req.params.cif;
    try {
        //para otener el valor, al igual que el GET general pero usando el findOne (al igual que el mongo)
        const data = await comercioModel.findOne({ cif, deleted: { $ne: true } })
        res.send(data);
    } catch(err) {
        handleHttpError(res, 'error en el GET', 403)
    }
}

//crea un nuevo comercio en la BBDD
const createItem = async (req, res) => {
    try {
        requestData  = matchedData(req)               //si uso const {cif} = matchedData(req), solo tomaria el cif, sin llaves cojo todo el objeto
        const contrasenia = await encrypt(requestData.contrasenia)
        const body = {...requestData , contrasenia}                                 // Con "..." duplicamos el objeto y le añadimos o sobreescribimos una propiedad
        const data = await comercioModel.create(body)
        data.set('contrasenia', undefined, { strict: false })          //Sirve para que al hacer un get, nunca se devuelva el pasword
        const dataFinal = {
            token: await tokenSign(data),
            dataFinal: data
        }
        res.send(dataFinal)


    } catch (err) {
        handleError(res, 'error en el CREATE', 500)

    }
}



//actualiza un nuevo comercio en la BBDD
/*
funciona por medio de sustitucion de todos los datos
- problema: han de introducirse todos los datos de nuevo, incluido el cif
- posible mejora: indicar solo una serie de datos y confirmar si el valor ha sido introducido
*/
const updateItem = async (req, res) => {
    //Request contiene información sobre la solicitud realizada por el cliente, como los parámetros de la URL, los encabezados, el cuerpo de la solicitud
    try {
        //tomo los datos a actualizar
        const cif = req.params.cif

        const requestData = matchedData(req);
        const contrasenia = await encrypt(requestData.contrasenia);
        // Construye el objeto body con la contraseña encriptada
        const body = { ...requestData, contrasenia };
        
        //el cif es un dato inmodificable porque ha de coincidir
        if(body.cif != cif){
            handleError(res, 'No se puede modificar el cif', 403)

        }
        //en caso de que el CIF coincida con alguno de los datos se actualiza
        else{
            // Buscando el documento por cif y altero su valor
            //usare el omitUndefined: true, para solo sustituir los datos introducidos (los que esten undefined no se sustituiran)
            const data = await comercioModel.findOneAndUpdate({ cif: cif }, body, { new: true, omitUndefined: true })
            // Debug statement to see what data is found
            if (!data) {
                console.log("No data found for CIF:", cif);
            } else {
                console.log("Data found:", data);
            }
            res.send(data)
        }        
    } catch(err) {
        console.log(err)
        handleError(res, 'error en el UPDATE', 403)
    }
};

const addResenias = async (req, res) => {
    try{
        //tomo el comercio
        const cif = req.params.cif
        const comercio = await comercioModel.findOne({ cif : cif })
        if (!comercio) {
            return res.status(404).send("Comercio no encontrado")
        }
        //tomo los parametros
        const requestData = matchedData(req);
        //aumento en 1 el numero de puntuaciones
        comercio.numValoraciones=comercio.numValoraciones+1
        //calculo el nuevo score
        comercio.scoring = (comercio.scoring*(comercio.numValoraciones-1)+requestData.scoring)/comercio.numValoraciones

        // Agregar las nuevas reseñas al arreglo existente de reseñas
        comercio.resenias = comercio.resenias.concat(requestData.resenias);

        // Guardar los cambios en el modelo del comercio
        await comercio.save()
        res.send(comercio)

    } catch (err) {
        // Manejar errores
        handleError(res, 'error en el PUT')
    }
};

const deleteItem = async (req, res) => {
    /*
    tendra dos tipos de DELETE logico donde lo marcaremos como borrado pero lo mantendremos en la memoria en caso de querer utilizarlosy borrado basico donde eliminaremos la informacion 
    - pros logico: permite la recuperacion de los datos
    - contras logico: no se libera la memoria
    - caso optimo: mantener como logico hasta el fin de un TTL y luego eliminarlo de manera completa (como ocurriria con los archivos en la papelera de reciclaje)
    */
    try {
        const { Logico } = req.query
        const cif = req.params.cif
        let data

        //borrado logico
        if(Logico){
            //vamos a trabajarlo a modo de update alterando el valor del deleted
            // Buscar el comercio por CIF
            const existingItem = await comercioModel.findOne({ cif })
            // Si no se encuentra el comercio, devolver un error
            if (!existingItem) {
                return res.status(404).send("Comercio no encontrado");
            }
            // Marcar el comercio como eliminado lógicamente
            existingItem.deleted = true; // Suponiendo que existe un campo "deleted" en el esquema para indicar el estado de eliminación

            // Guardar los cambios en la base de datos
            data = await existingItem.save()
        }
        //borrado basico
        else{
            data = await comercioModel.findOneAndDelete({ cif: cif })
        }
        if (!data) {
            return res.status(404).send("Comercio no encontrado")
        }
        res.send(data);
    } catch (err) {
        // Manejar errores
        handleError(res, 'error en el DELETE')
    }
};

const login = async(req, res) => {

    try{
        const requestData = req.body;

        const comercio = await comercioModel.findOne({ cif: requestData.cif });

        // Verificar si el comercio existe
        if (!comercio) {
            return res.status(404).json({ error: "El comercio no existe" });
        }
        const concide = await compare(requestData.contrasenia, comercio.contrasenia); // Comparar la contraseña proporcionada con la contraseña almacenada en la base de datos
        
        if (!concide) {
            return res.status(401).json({ error: "Credenciales no validas" });
        }

        // Eliminar la contraseña del objeto de usuario antes de enviar la respuesta
        comercio.set('contrasenia', undefined, { strict: false });

        const data = {
            token: await tokenSign(comercio), // Suponiendo que tengas una función tokenSign para generar tokens de autenticación
            data: comercio
        };

        res.status(200).send(data);

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error en el servidor' })
    }
};

const obtenerComerciosPorCiudad = async (req, res) => {
    try {
        const nombreCiudad = req.params.nombreCiudad
        const OrdenadoXScoring = req.query.OrdenadoXScoring;

        // Aquí podrías realizar la lógica para buscar los comercios por la ciudad proporcionada
        const comercios = await comercioModel.find({ ciudad: nombreCiudad })
        //con esto permitire al http indicar si desea obtener los resultados ordenados por score
        if (OrdenadoXScoring) {
            comercios.sort((a, b) => b.scoring - a.scoring);
        }
        // Devolver los comercios encontrados como respuesta
        res.json({ comercios })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error en el servidor' })
    }
};

const obtenerComerciosPorActividad = async (req, res) => {
    try {
        const actividad = req.params.actividad
        const OrdenadoXScoring = req.query.OrdenadoXScoring;

        // Aquí podrías realizar la lógica para buscar los comercios por la ciudad proporcionada
        const comercios = await comercioModel.find({ actividad: actividad })
        //con esto permitire al http indicar si desea obtener los resultados ordenados por score
        if (OrdenadoXScoring) {
            comercios.sort((a, b) => b.scoring - a.scoring);
        }
        // Devolver los comercios encontrados como respuesta
        res.json({ comercios })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error en el servidor' })
    }
};

const obtenerComerciosPorCiudadYActividad = async (req, res) => {
    try {
        const OrdenadoXScoring = req.query.OrdenadoXScoring;

        const nombreCiudad = req.params.nombreCiudad
        const actividad = req.params.actividad
        const comercios = await comercioModel.find({ ciudad: nombreCiudad, actividad: actividad })
        //con esto permitire al http indicar si desea obtener los resultados ordenados por score
        if (OrdenadoXScoring) {
            comercios.sort((a, b) => b.scoring - a.scoring);
        }
        res.json({ comercios })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error en el servidor' })
    }
};

const addPhoto = async (req, res) => {
    try{
        const requestData = matchedData(req)
        const cif = requestData.cif
        //tomo el file
        const { file } = req  
        //compruebo file
        if(!file){
            return handleHttpError(res, "Error al introducir la foto", 400)
        }
        //tomo el comercio
        const comercio = await comercioModel.findOneAndUpdate(
            { cif: cif},
            {
                $set: {
                    fotos: {
                        filename: file.filename,
                        url: process.env.PUBLIC_URL + "/" + file.filename,
                    },
                },
            },
            { new: true }
        )
        //compruebo comercio
        if(!comercio){
            return handleHttpError(res, "No hay comercio con ese cif", 404)
        }
        res.send(comercio)
    } catch (error){
        console.error(error)
        res.status(500).json({ error: 'Error en el servidor' })        
    }
};

const getPhoto = async (req, res) => {
    try {
        const { cif } = req.params;

        // Encuentra el comercio por CIF
        const comercio = await comercioModel.findOne({ cif: cif });
        
        // Comprueba si existe el comercio
        if (!comercio) {
            return handleHttpError(res, "No hay comercio con ese CIF", 404);
        }

        // Comprueba si tiene fotos
        if (!comercio.fotos || !comercio.fotos.filename) {
            return handleHttpError(res, "No hay foto para este comercio", 404);
        }

        res.json(comercio.fotos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const deletePhoto = async (req, res) => {
    try {
        const { cif } = req.params;

        // Encuentra el comercio por CIF
        const comercio = await comercioModel.findOne({ cif: cif });
        
        // Comprueba si existe el comercio
        if (!comercio) {
            return handleHttpError(res, "No hay comercio con ese CIF", 404);
        }

        // Comprueba si tiene fotos
        if (!comercio.fotos || !comercio.fotos.filename) {
            return handleHttpError(res, "No hay foto para este comercio", 404);
        }

        // Elimina la información de la foto del comercio
        comercio.fotos = undefined;
        await comercio.save();

        res.json({ message: 'Foto eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

//Exports
module.exports = { getItems, getItem, createItem, updateItem, deleteItem, login, addResenias, obtenerComerciosPorCiudad, obtenerComerciosPorActividad, obtenerComerciosPorCiudadYActividad, addPhoto, getPhoto, deletePhoto }