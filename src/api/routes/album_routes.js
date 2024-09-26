
const { isAdmin } = require('../../middlewares/auth')
const { createAlbum, getAlbums, getAlbumById, updateAlbum, deleteAlbum } = require('../controllers/album_controllers')



const albumRouter = require('express').Router()


albumRouter.post('/', [isAdmin], createAlbum)
albumRouter.get('/', getAlbums)
albumRouter.get('/:id', getAlbumById)
albumRouter.put('/:id', [isAdmin], updateAlbum)
albumRouter.delete('/:id', [isAdmin], deleteAlbum)



module.exports = albumRouter