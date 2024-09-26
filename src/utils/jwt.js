const jwt = require('jsonwebtoken')


const generateSign = (id) => jwt.sign({id}, process.env.JWT_SECRET,{expiresIn:'30d'})
const jwtVerify = (token) => jwt.verify(token, process.env.JWT_SECRET)

module.exports = {generateSign, jwtVerify}