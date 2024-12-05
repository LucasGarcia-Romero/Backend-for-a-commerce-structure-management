const bcryptjs = require("bcryptjs")


//Toma una contraseña en texto plano y devuelve su hash encriptado. 
const encrypt = async (clearPassword) => {
    // El número "Salt" otorga aleatoriedad a la función hash al combinarla con la password en claro.
    const hash = await bcryptjs.hash(clearPassword, 10)
    return hash
}

//Compara una contraseña en texto plano con su versión encriptada, y te devuelve si son o no correctas
const compare = async (clearPassword, hashedPassword) => {
    // Compara entre la password en texto plano y su hash calculado anteriormente para decidir si coincide.
    const result = await bcryptjs.compare(clearPassword, hashedPassword)
    return result
}
module.exports = { encrypt, compare }