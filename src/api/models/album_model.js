const mongoose = require('mongoose')

const albumSchema = new mongoose.Schema({
    title:{type:String, required:true, trim:true},
    mixed:{type: mongoose.Types.ObjectId, ref: 'musicians'},
    year:{type: Number, required: true, trim:true},
    cover:{type: String, required:true, trim:true},
    secondCover:{type: String, trim:true},
    musicians:[{type: mongoose.Types.ObjectId, ref: 'musicians'}],
    songs:[{type: mongoose.Types.ObjectId, ref: 'songs'}]
}, {
    timeStamp:true
})

const Album = mongoose.model('albums', albumSchema, 'albums');

module.exports = Album;