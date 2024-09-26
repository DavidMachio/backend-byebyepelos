const User = require("../api/models/user_model")
const { jwtVerify } = require("../utils/jwt")

const isAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.replace('Bearer ', '')

        const {id} = jwtVerify(token)

        const user = await User.findById(id)

        user.password = null
        req.user = user
        next()
    } catch (error) {
       return res.status(401).json('No estas autorizado')
    }
} 
const isAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization.replace('Bearer ', '')

        const {id} = jwtVerify(token)

        const user = await User.findById(id)

        user.password = null
        req.user = user
   
        if(req.user.rol === 'admin')
        {next()}else{
            return res.status(401).json('No estas autorizado')
        }
        
    } catch (error) {
        return res.status(401).json('No estas autorizado')
    }
}
        



module.exports = {isAuth, isAdmin}