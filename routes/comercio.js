const express = require("express");
const { getItems, getItem, createItem, updateItem, deleteItem, login, addResenias, obtenerComerciosPorCiudad, obtenerComerciosPorActividad, obtenerComerciosPorCiudadYActividad, addPhoto, getPhoto, deletePhoto } = require("../controllers/comercio");
const { checkRol } = require("../middleware/rols.js"); // Correctly import checkRol
const { authMiddleware } = require("../middleware/sessions.js");
const { validadorCreateItem, validatorGetItem, validadorUpdateItem, validarResenias, validarCredencialesComercio, validarCiudad, validarActividad } = require("../validators/comercio.js");
const uploadMiddleware = require("../utils/handleStorage.js");

const comerceRouter = express.Router();

// Implement HTTP functions
/**
 * @openapi
 * /api/comercio/:
 *   get:
 *     tags:
 *       - Comercio
 *     summary: Obtener todos los comercios
 *     description: Obtiene una lista de todos los comercios.
 *     responses:
 *       200:
 *         description: Lista de comercios.
 *       500:
 *         description: Error de servidor.
 */
comerceRouter.get("/", getItems);

/**
 * @openapi
 * /api/comercio/{cif}:
 *   get:
 *     tags:
 *       - Comercio
 *     summary: Obtener un comercio
 *     description: Obtiene un comercio específico por su CIF.
 *     parameters:
 *       - name: cif
 *         in: path
 *         required: true
 *         description: CIF del comercio.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comercio encontrado.
 *       404:
 *         description: Comercio no encontrado.
 *       500:
 *         description: Error de servidor.
 */
comerceRouter.get("/:cif", validatorGetItem, getItem);

/**
 * @openapi
 * /api/comercio/register:
 *   post:
 *     tags:
 *       - Comercio
 *     summary: Registrar un nuevo comercio
 *     description: Registra un nuevo comercio en el sistema.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/comercio'
 *     responses:
 *       201:
 *         description: Comercio registrado con éxito.
 *       400:
 *         description: Error en la solicitud.
 *       500:
 *         description: Error de servidor.
 */
comerceRouter.post("/register", authMiddleware, checkRol(["admin"]), validadorCreateItem, createItem);

/**
 * @openapi
 * /api/comercio/{cif}:
 *   put:
 *     tags:
 *       - Comercio
 *     summary: Actualizar un comercio
 *     description: Actualiza los datos de un comercio existente.
 *     parameters:
 *       - name: cif
 *         in: path
 *         required: true
 *         description: CIF del comercio.
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/comercio'
 *     responses:
 *       200:
 *         description: Comercio actualizado con éxito.
 *       400:
 *         description: Error en la solicitud.
 *       404:
 *         description: Comercio no encontrado.
 *       500:
 *         description: Error de servidor.
 */
comerceRouter.put("/:cif", authMiddleware, checkRol(["admin"]), validadorUpdateItem, updateItem);

/**
 * @openapi
 * /api/comercio/{cif}:
 *   delete:
 *     tags:
 *       - Comercio
 *     summary: Eliminar un comercio
 *     description: Elimina un comercio existente del sistema.
 *     parameters:
 *       - name: cif
 *         in: path
 *         required: true
 *         description: CIF del comercio.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comercio eliminado con éxito.
 *       404:
 *         description: Comercio no encontrado.
 *       500:
 *         description: Error de servidor.
 */
comerceRouter.delete("/:cif", authMiddleware, checkRol(["admin"]), validatorGetItem, deleteItem);

/**
 * @openapi
 * /api/comercio/resenias/{cif}:
 *   put:
 *     tags:
 *       - Comercio
 *     summary: Añadir reseñas a un comercio
 *     description: Añade reseñas a un comercio existente.
 *     parameters:
 *       - name: cif
 *         in: path
 *         required: true
 *         description: CIF del comercio.
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/addReseniasComercio'
 *     responses:
 *       200:
 *         description: Reseñas añadidas con éxito.
 *       400:
 *         description: Error en la solicitud.
 *       404:
 *         description: Comercio no encontrado.
 *       500:
 *         description: Error de servidor.
 */
comerceRouter.put("/resenias/:cif", authMiddleware, checkRol(["admin", "user"]), validarResenias, addResenias);

/**
 * @openapi
 * /api/comercio/login:
 *   post:
 *     tags:
 *       - Comercio
 *     summary: Login de comercio
 *     description: Autentica un comercio en el sistema.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/loginComercio'
 *     responses:
 *       200:
 *         description: Comercio autenticado con éxito.
 *       401:
 *         description: Credenciales inválidas.
 *       500:
 *         description: Error de servidor.
 */
comerceRouter.post("/login", validarCredencialesComercio, login);

/**
 * @openapi
 * /api/comercio/ciudad/{nombreCiudad}:
 *   get:
 *     tags:
 *       - Comercio
 *     summary: Obtener comercios por ciudad
 *     description: Obtiene una lista de comercios filtrados por ciudad.
 *     parameters:
 *       - name: nombreCiudad
 *         in: path
 *         required: true
 *         description: Nombre de la ciudad.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de comercios en la ciudad.
 *       404:
 *         description: Comercios no encontrados.
 *       500:
 *         description: Error de servidor.
 */
comerceRouter.get("/ciudad/:nombreCiudad", validarCiudad, obtenerComerciosPorCiudad);

/**
 * @openapi
 * /api/comercio/actividad/{actividad}:
 *   get:
 *     tags:
 *       - Comercio
 *     summary: Obtener comercios por actividad
 *     description: Obtiene una lista de comercios filtrados por actividad.
 *     parameters:
 *       - name: actividad
 *         in: path
 *         required: true
 *         description: Tipo de actividad.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de comercios con la actividad especificada.
 *       404:
 *         description: Comercios no encontrados.
 *       500:
 *         description: Error de servidor.
 */
comerceRouter.get("/actividad/:actividad", validarActividad, obtenerComerciosPorActividad);

/**
 * @openapi
 * /api/comercio/ciudad/{nombreCiudad}/actividad/{actividad}:
 *   get:
 *     tags:
 *       - Comercio
 *     summary: Obtener comercios por ciudad y actividad
 *     description: Obtiene una lista de comercios filtrados por ciudad y actividad.
 *     parameters:
 *       - name: nombreCiudad
 *         in: path
 *         required: true
 *         description: Nombre de la ciudad.
 *         schema:
 *           type: string
 *       - name: actividad
 *         in: path
 *         required: true
 *         description: Tipo de actividad.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de comercios en la ciudad con la actividad especificada.
 *       404:
 *         description: Comercios no encontrados.
 *       500:
 *         description: Error de servidor.
 */
comerceRouter.get("/ciudad/:nombreCiudad/actividad/:actividad", validarCiudad, validarActividad, obtenerComerciosPorCiudadYActividad);

//gestion de fotos
comerceRouter.post("/photo/:cif", uploadMiddleware.single("image"), validatorGetItem, addPhoto)
comerceRouter.get('/photo/:cif', authMiddleware, validatorGetItem, getPhoto);
comerceRouter.delete('/photo/:cif', authMiddleware, validatorGetItem, deletePhoto);

module.exports = comerceRouter;