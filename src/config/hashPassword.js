const bcrypt = require('bcrypt')

//! Función para encriptar una contraseña, se le pasa una contraseña y el numero de veces que se baraja
const hashPassword = (password) => {
    return bcrypt.hashSync(password, 10)
}

module.exports = {hashPassword}