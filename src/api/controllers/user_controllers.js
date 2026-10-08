const { hashPassword } = require("../../config/hashPassword");
const { sendEmail } = require("../../config/nodemailer");
const { deleteFile } = require("../../utils/deleteFile");
const { generateSign } = require("../../utils/jwt");
const User = require("../models/user_model")
const bcrypt = require('bcrypt')

// Campos del usuario que pueden salir en las respuestas de login y registro.
// La web solo usa estos; la contraseña (ni su hash) no sale nunca.
const publicUser = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    rol: user.rol,
    avatar: user.avatar,
    playList: user.playList
})

const getUsers = async (req, res, next) => {
    try {
        
        const users = await User.find().populate('playList')
        return res.status(200).json(users)
        
    } catch (error) {
        return res.status(400).json('Error al encontrar usuarios')
    }
}
// El nombre llega desde la URL: es texto, no un patrón. Se escapan los caracteres
// especiales para que, por ejemplo, ".*" no devuelva a todos los usuarios.
const escapeRegex = (texto) => texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const getUserByName = async (req, res, next) => {
    try {
        // Ruta pública: solo devuelve lo que la web ya muestra (nombre, avatar y playlist).
        // Nunca email, rol ni _id.
        const user = await User.find({name: {$regex: escapeRegex(req.params.name), $options: "i"}})
        .select('name avatar playList -_id')
        .populate({
            path: 'playList',  // Poblamos las canciones en la playlist
            populate: {
                path: 'musicians',  // Poblamos los músicos dentro de cada canción
                model: 'musicians'
            }
        });
        return res.status(200).json(user)
    } catch (error) {
        return res.status(400).json('No se ha encontrado este usuario')
    }
}

// Playlist del usuario que ha iniciado sesión: el id sale del token (isAuth), no de la URL.
const getMyPlaylist = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'playList',
            populate: {
                path: 'musicians',
                model: 'musicians'
            }
        })
        return res.status(200).json(user.playList)
    } catch (error) {
        return res.status(400).json('No se ha podido cargar la playlist')
    }
}
const register = async (req, res, next) => {
    try {
        const newUser = new User(req.body);
        if(req.file){
            newUser.avatar = req.file.path
        }
        newUser.rol = 'user'
        const userDuplicated = await User.findOne({email: req.body.email});
        if(userDuplicated) return res.status(400).json('Este email ya esta registrado')
            
        newUser.password = hashPassword(req.body.password)
        const user = await newUser.save()

        sendEmail({email: newUser.email})
        return res.status(201).json(publicUser(user))
        
    } catch (error) {
        return res.status(400).json('Error en el registro de usuario')
    }
}
const login = async (req, res, next) => {
    try {
        const { email, password} = req.body
        // password tiene select:false en el modelo, así que hay que pedirla aquí a propósito
        const user = await User.findOne({email}).select('+password')
        if( !user) return res.status(400).json('Usuario o contraseña incorrectos')

            if(bcrypt.compareSync(password, user.password)){
                const token = generateSign(user._id)
                return res.status(200).json({token, user: publicUser(user)})
            }else{
                return res.status(400).json('Usuario o contraseña incorrectos')
            }
    } catch (error) {
        return res.status(400).json('Usuario o contraseña incorrectos')
    }
}
const updateUser = async (req, res, next) => {
    try {
        const {id} = req.params

       const newUser = new User(req.body)
       const oldUser = await User.findById(id)

       newUser._id = id
       newUser.rol = oldUser.rol
       if(req.file){
        console.log(oldUser.avatar);
        
        newUser.avatar = req.file.path
        deleteFile(oldUser.avatar)
        
    }else{
        newUser.avatar = oldUser.avatar
    }
        const allSongs = [...oldUser.playList, ...newUser.playList];
     const songsFiltered = [];
     const songIds = new Set();

     allSongs.forEach((song) => {
         const songId = song._id.toString();
         if (!songIds.has(songId)) {
             songIds.add(songId);
             songsFiltered.push(song);
         }
     });

     newUser.playList = songsFiltered;
        

        

        const user = await User.findByIdAndUpdate(id, newUser, {new:true})
        return res.status(200).json({message:'Usuario actualizado correctamente', user})
    } catch (error) {
        return res.status(400).json('Error al actualizar el usuario')
    }
}

const removeSongFromPlaylist = async (req, res, next) => {
    try {
      const { id } = req.params; // ID del usuario
      const { songId } = req.body; // ID de la canción que se quiere eliminar
  
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      // Filtrar las canciones, eliminando la que tiene el ID especificado
      user.playList = user.playList.filter((song) => song.toString() !== songId);
  
      // Guardar cambios en el usuario
      await user.save();
  
      return res.status(200).json({ message: 'Canción eliminada correctamente', user });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: 'Error al eliminar la canción de la playlist' });
    }
  };
  




const deleteUser = async (req, res, next) => {
    try {
        const {id} = req.params
        const userDeleted = await User.findByIdAndDelete(id)
        deleteFile(userDeleted.avatar)
        return res.status(200).json({message:'Usuario eliminado correctamente', userDeleted})
        
    } catch (error) {
        return res.status(400).json('Error al eliminar el usuario')
    }
}

const checksessions = async (req, res) => {
    try {
        return res.status(200).json(req.user)
    } catch (error) {
        return res.status(400).json('Ha habido un error')
    }
}

module.exports = {
    login,
    register,
    getUserByName,
    updateUser,
    removeSongFromPlaylist,
    deleteUser,
    getUsers,
    checksessions,
    getMyPlaylist

}