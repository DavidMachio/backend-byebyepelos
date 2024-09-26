const Album = require('../models/album_model');

const createAlbum = async (req, res, next) => {
    try {
        const newAlbum = new Album(req.body);
        
        const albumDuplicated = await Album.findOne({title: req.body.title})
        if(albumDuplicated) return res.status(400).json('Este album ya existe')
        await newAlbum.save();
        return res.status(201).json(newAlbum)
    } catch (error) {
        return res.status(500).json('Error al crear un nuevo album')
    }
}

const getAlbums = async (req, res, next) => {
    try {
        const albums = await Album.find().populate('musicians').populate({
            path: 'songs',
            populate: {
              path: 'musicians',
            }
          }).populate({
            path: 'songs',
            populate: {
              path: 'album',
            }
          }).populate('mixed');
        return res.status(200).json(albums)
    } catch (error) {
        return res.status(400).json('Error al encontrar albums')
    }
}
const getAlbumById = async (req, res, next) => {
    try {
        const {id} = req.params
        const album = await Album.findById(id).populate('musicians')
        return res.status(200).json(album)
        
    } catch (error) {
        return res.status(400).json('Error al buscar el Album')
    }
}
const updateAlbum = async (req, res, next) => {
    try {
        const {id} = req.params
    const newAlbum = new Album(req.body)
    const oldAlbum = await Album.findById(id)

    newAlbum._id = id;

    
    
     // Concatenar todos los músicos
     const allMusicians = [...oldAlbum.musicians, ...newAlbum.musicians];
     // Crear un array para almacenar músicos filtrados
     const musiciansFiltered = [];
     const musicianIds = new Set();

     // Filtrar músicos para evitar duplicados
     allMusicians.forEach((musician) => {
         const musicianId = musician._id.toString();
         if (!musicianIds.has(musicianId)) {
             musicianIds.add(musicianId);
             musiciansFiltered.push(musician);
         }
     });

     newAlbum.musicians = musiciansFiltered;
     

     const allSongs = [...oldAlbum.songs, ...newAlbum.songs];
     const songsFiltered = [];
     const songIds = new Set();

     allSongs.forEach((song) => {
         const songId = song._id.toString();
         if (!songIds.has(songId)) {
             songIds.add(songId);
             songsFiltered.push(song);
         }
     });

     newAlbum.songs = songsFiltered;

    const album = await Album.findByIdAndUpdate(id, newAlbum, {new:true})
    return res.status(200).json({message: 'Album actualizado correctamente', album})
    } catch (error) {
        return res.status(400).json('Error al actualizar el album')
    }

}

const deleteAlbum = async (req, res, next) => {
    try {
        const {id} = req.params
    const albumDeleted = await Album.findByIdAndDelete(id)
    
    return res.status(200).json({message:'Album eliminado correctamente', albumDeleted })
    } catch (error) {
        return res.status(400).json('Error al eliminar album')
    }
}




module.exports = {
    createAlbum,
    getAlbums,
    getAlbumById,
    updateAlbum,
    deleteAlbum,
}