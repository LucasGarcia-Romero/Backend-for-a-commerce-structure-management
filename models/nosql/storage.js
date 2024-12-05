const mongoose = require("mongoose")
const mongooseDelete = require("mongoose-delete")

const UserScheme = new mongoose.Schema(
    {
        filename: {
            type: String
        },
        url: {
            type: String,   
            unique: true
        }
    },
    {
        timestamps: true, // TODO createdAt, updatedAt
        versionKey: false
    }
)
module.exports = mongoose.model("storage", UserScheme) // storage es el nombre de la colección en mongoDB (o de la tabla en SQL)