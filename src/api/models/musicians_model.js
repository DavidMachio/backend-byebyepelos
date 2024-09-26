const mongoose = require('mongoose');

const musiciansSchema = new mongoose.Schema({
    foto:{type: String, default:'https://res.cloudinary.com/drmbhl3f6/image/upload/v1722073242/imgaeprofiledefault_tgthyk.webp', trim:true},
    firstName:{type:String, required:true, trim:true},
    secondName:{type:String, required:true, trim:true},
    songs:[{type: mongoose.Types.ObjectId, ref: 'songs'}]
}, {
    timestamps:true
})

const Musician = mongoose.model('musicians', musiciansSchema, ('musicians'))

module.exports = Musician