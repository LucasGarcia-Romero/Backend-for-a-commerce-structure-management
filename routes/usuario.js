//este sera el router especifico de comercios, cuando hago los get, post, update, delete, ... 
//saltan los middleware (en este proyecto unicamente validators, en caso de que pase el middleware se ejecuta la accion)
const { getUsers, getUser, createUser, updateUser, loginUser, deleteUser, getUsuariosPorEInteres } = require("../controllers/usuario")
const { validatorGetEmail, validadorRegister, validadorLogin, validarIntereses, validadorUpdateUser } = require("../validators/usuario.js")
const { validatorGetItem } = require("../validators/comercio.js")
const { authMiddleware } = require("../middleware/sessions.js");

const express = require("express");

//creo el router llamando a la clase del router
const userRouter = express.Router()

/**
 * @openapi
 * /api/usuario/:
 *   get:
 *     tags:
 *       - Usuario
 *     summary: Obtener todos los usuarios
 *     description: Obtiene una lista de todos los usuarios.
 *     responses:
 *       200:
 *         description: Lista de usuarios.
 *       500:
 *         description: Error de servidor.
 */
userRouter.get("/", getUsers);

/**
 * @openapi
 * /api/usuario/{id}:
 *   get:
 *     tags:
 *       - Usuario
 *     summary: Obtener un usuario
 *     description: Obtiene un usuario específico por su ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del usuario.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error de servidor.
 */
userRouter.get("/:email", validatorGetEmail, getUser);

/**
 * @openapi
 * /api/usuario/register:
 *   post:
 *     tags:
 *       - Usuario
 *     summary: Registrar un nuevo usuario
 *     description: Registra un nuevo usuario en el sistema.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/registerUsuario'
 *     responses:
 *       201:
 *         description: Usuario registrado con éxito.
 *       400:
 *         description: Error en la solicitud.
 *       500:
 *         description: Error de servidor.
 */
userRouter.post("/register", validadorRegister, createUser);

/**
 * @openapi
 * /api/usuario/login:
 *   post:
 *     tags:
 *       - Usuario
 *     summary: Login de usuario
 *     description: Autentica un usuario en el sistema.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/loginUsuario'
 *     responses:
 *       200:
 *         description: Usuario autenticado con éxito.
 *       401:
 *         description: Credenciales inválidas.
 *       500:
 *         description: Error de servidor.
 */
userRouter.post("/login", validadorLogin, loginUser);

/**
 * @openapi
 * /api/usuario/{email}:
 *   put:
 *     tags:
 *       - Usuario
 *     summary: Actualizar un usuario
 *     description: Actualiza los datos de un usuario existente.
 *     parameters:
 *       - name: email
 *         in: path
 *         required: true
 *         description: Email del usuario.
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/modificarUsuario'
 *     responses:
 *       200:
 *         description: Usuario actualizado con éxito.
 *       400:
 *         description: Error en la solicitud.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error de servidor.
 */
userRouter.put("/:email", authMiddleware, validatorGetEmail, validadorUpdateUser, updateUser);

/**
 * @openapi
 * /api/usuario/{email}:
 *   delete:
 *     tags:
 *       - Usuario
 *     summary: Eliminar un usuario
 *     description: Elimina un usuario existente del sistema.
 *     parameters:
 *       - name: email
 *         in: path
 *         required: true
 *         description: Email del usuario.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado con éxito.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error de servidor.
 */
userRouter.delete("/:email", authMiddleware, validatorGetEmail, deleteUser);

/**
 * @openapi
 * /api/usuario/cif/{cif}/intereses/{intereses}:
 *   get:
 *     tags:
 *       - Usuario
 *     summary: Obtener usuarios por intereses y comercio
 *     description: Obtiene una lista de usuarios filtrados por intereses y comercio específico.
 *     parameters:
 *       - name: cif
 *         in: path
 *         required: true
 *         description: CIF del comercio.
 *         schema:
 *           type: string
 *       - name: intereses
 *         in: path
 *         required: true
 *         description: Intereses de los usuarios.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de usuarios con los intereses especificados.
 *       404:
 *         description: Usuarios no encontrados.
 *       500:
 *         description: Error de servidor.
 */
userRouter.get("/cif/:cif/intereses/:intereses", validatorGetItem, validarIntereses, getUsuariosPorEInteres);

module.exports = userRouter;