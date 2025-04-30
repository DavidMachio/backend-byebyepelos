
const { isAdmin } = require('../../middlewares/auth');
const upload = require('../../middlewares/file'); // Asegúrate de que este middleware esté configurado para manejar los archivos
const { createAlbum, getAlbums, getAlbumById, updateAlbum, deleteAlbum } = require('../controllers/album_controllers');

const albumRouter = require('express').Router();

// En esta ruta, aseguramos que se suba la imagen de portada (cover) correctamente
albumRouter.post('/', isAdmin, upload.single('cover'), createAlbum);
albumRouter.get('/', getAlbums);
albumRouter.get('/:id', getAlbumById);
albumRouter.put('/:id', isAdmin, upload.single('cover'), updateAlbum);
albumRouter.delete('/:id', isAdmin, deleteAlbum);

module.exports = albumRouter;
