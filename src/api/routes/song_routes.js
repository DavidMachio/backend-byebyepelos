const { isAdmin } = require('../../middlewares/auth')
const upload = require('../../middlewares/file')
const { createSong, getSongs, getSongById, updateSong, deleteSong } = require('../controllers/song_controllers')

const songRouter = require('express').Router()


songRouter.post('/', isAdmin, upload.single('imagen'), createSong)
songRouter.get('/', getSongs)
songRouter.get('/:id', getSongById)
songRouter.put('/:id', isAdmin, upload.single('imagen'), updateSong)
songRouter.delete('/:id', isAdmin, deleteSong)


module.exports = songRouter