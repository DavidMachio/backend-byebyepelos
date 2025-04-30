const { deleteFile } = require('../../utils/deleteFile');
const Album = require('../models/album_model');

const createAlbum = async (req, res, next) => {
    try {
        const newAlbum = new Album(req.body);

        // Si se ha subido un archivo de portada, lo asignamos
        if (req.file) {
            newAlbum.cover = req.file.path;
        }
        
        // Parsear músicos y mezclador de la solicitud
        if (req.body.musicians) {
            newAlbum.musicians = JSON.parse(req.body.musicians); // Convertir el JSON a un array de IDs
        }

        if (req.body.mixed) {
            newAlbum.mixed = req.body.mixed;
        }

        const albumDuplicated = await Album.findOne({ title: req.body.title });
        if (albumDuplicated) return res.status(400).json('Este álbum ya existe');

        await newAlbum.save();
        return res.status(201).json(newAlbum);
    } catch (error) {
        return res.status(500).json('Error al crear un nuevo álbum');
    }
};


  
  

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
      const { id } = req.params;
      const oldAlbum = await Album.findById(id);
  
      if (!oldAlbum) {
        return res.status(404).json({ message: "Álbum no encontrado" });
      }
  
      const updatedData = {
        title: req.body.title,
        year: req.body.year,
        mixed: req.body.mixed,
      };
  
      if (req.body.musicians) {
        updatedData.musicians = JSON.parse(req.body.musicians);
      }
  
      // 🔽 ESTA ES LA PARTE QUE FALTABA
      if (req.body.songs) {
        updatedData.songs = JSON.parse(req.body.songs);
      }
  
      if (req.file) {
        updatedData.cover = req.file.path;
        if (oldAlbum.cover) {
          deleteFile(oldAlbum.cover); // asumiendo que tienes esta función
        }
      } else {
        updatedData.cover = oldAlbum.cover;
      }
  
      const updatedAlbum = await Album.findByIdAndUpdate(id, updatedData, {
        new: true,
      }).populate("musicians mixed songs");
  
      return res.status(200).json({
        message: "Álbum actualizado correctamente",
        album: updatedAlbum,
      });
    } catch (error) {
      console.error("Error al actualizar álbum:", error);
      return res.status(400).json("Error al actualizar el álbum");
    }
  };
  
  
  
  
  
  

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