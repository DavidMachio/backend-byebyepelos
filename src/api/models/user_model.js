const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email:{type:String, required:true, trim:true},
    password:{type: String, required:true, trim:true},
    name:{type: String, required: true, trim: true},
    rol:{ type: String, enum: ['user', 'admin'], default: 'user'},
    avatar: {type: String, default:'https://res.cloudinary.com/drmbhl3f6/image/upload/v1722073242/imgaeprofiledefault_tgthyk.webp'},
    playList:[{type: mongoose.Types.ObjectId, ref: 'songs'}]
}, {
    timeStamp:true
})

const User = mongoose.model('users', userSchema, 'users');

module.exports = User;