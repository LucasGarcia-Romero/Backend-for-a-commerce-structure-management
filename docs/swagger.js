//para abrir el swwager: hacemos run + http://localhost:3000/api-docs

const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "Tracks - Express API with Swagger (OpenAPI 3.0)",
            version: "0.1.0",
            description: "This is a CRUD API application made with Express and documented with Swagger",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "lukas",
                url: "https://u-tad.com",
                email: "lukas.perez@live.u-tad.com",
            },
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                },
            },
            schemas: {
                usuario: {
                    type: "object",
                    required: ["nombreUsuario", "email", "contrasenia", "edad", "ciudad", "intereses", "permiteRecibirOfertas", "rol"],
                    properties: {
                        nombreUsuario: {
                            type: "string",
                            example: "lukas",
                        },
                        email: {
                            type: "string",
                            example: "lucas.garcia@live.u-tad.com"
                        },
                        contrasenia: {
                            type: "string",
                            example: "password"
                        },
                        edad: {
                            type: "integer",
                            example: 20,
                        },
                        ciudad: {
                            type: "string",
                            example: "Madrid",
                        },
                        intereses: {
                            type: "array",
                            items: {
                                type: "string"
                            },
                            example: ["comida", "deportes"]
                        },
                        permiteRecibirOfertas: {
                            type: "boolean",
                            example: true,
                        },
                        rol: {
                            type: "string",
                            example: "admin",
                        }
                    },
                },
                comercio: {
                    type: "object",
                    required: ["cif", "nombre", "telefonoContacto", "email", "direccion", "contrasenia", "ciudad"],
                    properties: {
                        cif: {
                            type: "string",
                            example: "A19345678P",
                        },
                        nombre: {
                            type: "string",
                            example: "Nombre del comercio",
                        },
                        telefonoContacto: {
                            type: "string",
                            example: "111111111",
                        },
                        email: {
                            type: "string",
                            example: "Comercio@gmail.com",
                        },
                        direccion: {
                            type: "string",
                            example: "Direccion del comercio",
                        },
                        ciudad: {
                            type: "string",
                            example: "Ciudad del comercio",
                        },
                        contrasenia: {
                            type: "string",
                            example: "password"
                        },
                        actividad: {
                            type: "string",
                            example: "Actividad del comercio",
                        },
                        titulo: {
                            type: "string",
                            example: "Titulo del comercio",
                        },
                        fotos: {
                            type: "array",
                            items: {
                                type: "string",
                            },
                            example: ["FotoComercio1.jpg", "FotoComercio2.jpg"], // Ejemplo de array de strings
                        },
                        scoring: {
                            type: "array",
                            items: {
                                type: "number",
                            },
                            example: [4, 5, 3], // Ejemplo de array de números
                        },
                        resenias: {
                            type: "array",
                            items: {
                                type: "string",
                            },
                            example: ["Reseña 1", "Reseña 2"], // Ejemplo de array de strings
                        },
                    },
                },
                loginUsuario: {
                    type: "object",
                    required: ["email", "contrasenia"],
                    properties: {
                        email: {
                            type: "string",
                            example: "Usuario1@gmail.com",
                        },
                        password: {
                            type: "string",
                            example: "contrasenia1",
                        },
                    },
                },
                loginComercio: {
                    type: "object",
                    required: ["cif", "contrasenia"],
                    properties: {
                        cif: {
                            type: "string",
                            example: "A19345600D",
                        },
                        contrasenia: {
                            type: "string",
                            example: "lukas1234",
                        },
                    },
                },
                registerComercio: {
                    type: "object",
                    required: ["nombre", "cif", "direccion", "email", "telefonoContacto", "contrasenia", "ciudad", "actividad"],
                    properties: {
                        nombre: {
                            type: "string",
                            example: "Comercio09",
                        },
                        cif: {
                            type: "string",
                            example: "A19345609V",
                        },
                        direccion: {
                            type: "string",
                            example: "Direccion del comercio",
                        },
                        email: {
                            type: "string",
                            example: "Comercio@gmail.com",
                        },
                        telefonoContacto: {
                            type: "string",
                            example: "111111111",
                        },
                        ciudad: {
                            type: "string",
                            example: "Ciudad del comercio",
                        },
                        actividad: {
                            type: "string",
                            example: "Actividad del comercio",
                        },
                        contrasenia: {
                            type: "string",
                            example: "contrasenia",
                        },
                    },
                },
                addReseniasComercio: {
                    type: "object",
                    required: ["resenias", "scoring"],
                    properties: {
                        scoring: {
                            type: "array",
                            items: {
                                type: "number",
                            },
                            example: [4, 5, 3], // Ejemplo de array de números
                        },
                        resenias: {
                            type: "array",
                            items: {
                                type: "string",
                            },
                            example: ["Reseña 1", "Reseña 2"], // Ejemplo de array de strings
                        },
                    },
                },
                modificarUsuario: {
                    type: "object",
                    required: ["nombreUsuario", "email", "edad", "ciudad", "intereses", "permiteRecibirOfertas", "contrasenia", "rol"],
                    properties: {
                        nombreUsuario: {
                            type: "string",
                            example: "Usuario1",
                        },
                        email: {
                            type: "string",
                            example: "Usuario1@gmail.com",
                        },
                        edad: {
                            type: "integer",
                            example: 2,
                        },
                        ciudad: {
                            type: "string",
                            example: "Madrid",
                        },
                        intereses: {
                            type: "array",
                            items: {
                                type: "string",
                            },
                            example: ["Viajar", "Nadar"],
                        },
                        permiteRecibirOfertas: {
                            type: "boolean",
                            example: true,
                        },
                        contrasenia: {
                            type: "string",
                            example: "contrasenia1",
                        },
                        rol: {
                            type: "string",
                            example: "user",
                        },
                    },
                },
                registerUsuario: {
                    type: "object",
                    required: ["name", "email", "contrasenia", "edad", "ciudad", "intereses", "permiteRecibirOfertas"],
                    properties: {
                        name: {
                            type: "string",
                            example: "Usuario2",
                        },
                        email: {
                            type: "string",
                            example: "user2@gmail.com",
                        },
                        contrasenia: {
                            type: "string",
                            example: "contrasenia1",
                        },
                        edad: {
                            type: "string",
                            example: 12,
                        },
                        ciudad: {
                            type: "string",
                            example: "Paris",
                        },
                        intereses: {
                            type: "array",
                            items: {
                                type: "string",
                            },
                            example: ["Natacion", "Politica"],
                        },
                        permiteRecibirOfertas: {
                            type: "boolean",
                            example: true,
                        },
                    },
                },
            },
        },
    },
    apis: ["./routes/*.js"],
};

module.exports = swaggerJsdoc(options);
