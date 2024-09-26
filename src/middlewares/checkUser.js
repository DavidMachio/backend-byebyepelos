const checkUser = (req, res, next) => {
    if(req.user.rol === 'admin' || req.user._id.toString() === req.params.id){
        next();
    }else{
        return res.status(400).json('No estás autorizado para realizar esta acción')
    }
}
module.exports = {checkUser}