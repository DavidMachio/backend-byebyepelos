const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    imagen:{type: String, required:true, trim:true},
    titulo:{type:String, required:true, trim:true},
    vso: {type:String, trim:true},
    audio:{type: String, require:true ,trim:true},
    musicians:[{type: mongoose.Types.ObjectId, ref: 'musicians'}],
    album:{type: mongoose.Types.ObjectId, ref: 'albums'}
}, {
    timestamps:true
})

const Song = mongoose.model('songs', songSchema, 'songs');

module.exports = Song