//base de datos de los comercios (estructura unicamente)

const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const comercioScheme = new mongoose.Schema(
    {
        cif: {
            type: String,
            unique: true
        },
        nombre: {
            type: String
        },
        telefonoContacto: {
            type: String
        },
        email: {
            type: String
        },
        direccion: {
            type: String
        },
        ciudad: {
            type: String
        },
        actividad: {
            type: String
        },
        contrasenia: {
            type: String
        },
        scoring: {
            type: Number,
            default: 0
        },
        numValoraciones: {
            type: Number,
            default: 0
        },
        resenias: {
            type: [String]
        },
        fotos: {
            filename: {
                type: String
            },
            url: {
                type: String,   
            }
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

comercioScheme.plugin(mongooseDelete, { overrideMethods: "all" });

module.exports = mongoose.model("comercios", comercioScheme);