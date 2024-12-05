const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete"); // Import mongoose-delete

const usuarioScheme = new mongoose.Schema(
    {
        //no hace falta id ya que mongoose crea _id automaticamente
        nombreUsuario: {
            type: String
        },
        email: {
            type: String,
            unique: true
        },
        contrasenia: {
            type: String
        },
        edad: {
            type: Number
        },
        ciudad: {
            type: String
        },
        intereses: {
            type: [String]
        },
        permiteRecibirOfertas: {
            type: Boolean
        },
        rol:{
            type: String,
            enum: ['user', 'admin'],
            default: "user"
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);
usuarioScheme.plugin(mongooseDelete, { overrideMethods: "all" });

module.exports = mongoose.model("usuarios", usuarioScheme);