const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email:{type:String, required:true, trim:true},
    password:{type: String, required:true, trim:true, select:false},
    name:{type: String, required: true, trim: true},
    rol:{ type: String, enum: ['user', 'admin'], default: 'user'},
    avatar: {type: String, default:'https://res.cloudinary.com/drmbhl3f6/image/upload/v1722073242/imgaeprofiledefault_tgthyk.webp'},
    playList:[{type: mongoose.Types.ObjectId, ref: 'songs'}]
}, {
    timeStamp:true,
    // Segunda barrera: aunque un usuario recién creado conserve la contraseña en memoria,
    // nunca sale en una respuesta JSON.
    toJSON: {
        transform: (doc, ret) => {
            delete ret.password
            return ret
        }
    }
})

const User = mongoose.model('users', userSchema, 'users');

module.exports = User;