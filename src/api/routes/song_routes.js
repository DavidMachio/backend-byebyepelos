const { isAdmin } = require('../../middlewares/auth')
const { createSong, getSongs, getSongById, updateSong, deleteSong } = require('../controllers/song_controllers')

const songRouter = require('express').Router()


songRouter.post('/', isAdmin, createSong)
songRouter.get('/', getSongs)
songRouter.get('/:id', getSongById)
songRouter.put('/:id', isAdmin, updateSong)
songRouter.delete('/:id', isAdmin, deleteSong)


module.exports = songRouter