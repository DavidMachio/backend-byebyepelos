const { deleteFile } = require('../../utils/deleteFile')
const Song = require('../models/song_model')

const createSong = async (req, res, next) => {
    try {
      const songData = {
        ...req.body,
        musicians: req.body.musicians ? JSON.parse(req.body.musicians) : [],
      };
  
      const newSong = new Song(songData);
  
      if (req.file) {
        newSong.imagen = req.file.path;
      }
  
      const songDuplicated = await Song.findOne({ titulo: req.body.titulo });
      if (songDuplicated) return res.status(400).json('Ya existe una canción con este título');
  
      await newSong.save();
      return res.status(201).json(newSong);
    } catch (error) {
      console.log(error);
      return res.status(500).json('Error al crear la canción');
    }
  };
  

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
      const { id } = req.params;
  
      if (typeof req.body.musicians === 'string') {
        req.body.musicians = JSON.parse(req.body.musicians);
      }
  
      const oldSong = await Song.findById(id);
      const newSong = new Song(req.body);
      newSong._id = id;
  
      if (req.file) {
        deleteFile(oldSong.imagen);
        newSong.imagen = req.file.path;
      } else {
        newSong.imagen = oldSong.imagen;
      }
  
      newSong.album = req.body.album || oldSong.album;
      newSong.musicians = [...new Set(req.body.musicians)];
  
      const song = await Song.findByIdAndUpdate(id, newSong, { new: true }).populate("musicians");
      return res.status(200).json({ message: "Canción actualizada correctamente", song });
    } catch (error) {
      console.log(error);
      return res.status(400).json("Error al actualizar la canción");
    }
  };
  
  
  
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