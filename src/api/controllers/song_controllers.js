const Song = require('../models/song_model')

const createSong = async (req, res, next) => {
    try {
        const newSong = new Song(req.body)
        const songDuplicated = await Song.findOne({titulo: req.body.titulo})
        if(songDuplicated)return res.status(400).json('Ya existe una canción con este titulo')
    await newSong.save();
    return res.status(201).json(newSong)
    } catch (error) {
        return res.status(500).json('Error al crear la canción')
    }

}

const getSongs = async (req, res, next) => {
    try {
        const songs = await Song.find().populate('musicians').populate('album')
    return res.status(200).json(songs)
    } catch (error) {
        return res.status(400).json('Error al buscar las canciones')
    }
}

const getSongById = async (req, res, next) => {
    try {
        const {id} = req.params
    const song = await Song.findById(id).populate('musicians').populate('album')
    return res.status(200).json(song)
    } catch (error) {
        
    }
}

const updateSong = async (req, res, next) => {
    try {
        const {id} = req.params
        const newSong = new Song(req.body)
        const oldSong = await Song.findById(id)
        newSong._id = id
        console.log(newSong.musicians)

        const allMusicians = [...oldSong.musicians, ...newSong.musicians]
        console.log(allMusicians)
        const musiciansFiltered = [];
     const musicianIds = new Set();

     allMusicians.forEach((musician) => {
        const musicianId = musician._id.toString();
        if (!musicianIds.has(musicianId)) {
            musicianIds.add(musicianId);
            musiciansFiltered.push(musician);
        }
    });

    newSong.musicians = musiciansFiltered;

    const song = await Song.findByIdAndUpdate(id, newSong, {new: true})
    return res.status(200).json({message:'Canción acrtualizada correctamente', song})
    } catch (error) {
        console.log(error)
        return res.status(400).json('Error al actuializar el album')
    }
}

const deleteSong = async ( req, res, next) => {
    try {
        const {id} = req.params
    const song = await Song.findByIdAndDelete(id)
    return res.status(200).json({message:'Cancón eliminada correctamente', song})
    } catch (error) {
        console.log(error);
        return res.status(400).json('Error al eliminar la canción')
    }
}


module.exports = {
    createSong,
    getSongs,
    getSongById,
    updateSong,
    deleteSong,
}