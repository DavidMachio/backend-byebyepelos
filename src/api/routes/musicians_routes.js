
const { getMusicians, getMusicianByName, deleteMusician, updateMusician, createMusician, getMusicianById } = require("../controllers/musicians_controllers");
const { isAdmin} = require("../../middlewares/auth");


const musicianRouter = require('express').Router();

musicianRouter.post('/', isAdmin, createMusician)
musicianRouter.get('/', getMusicians)
musicianRouter.get('/:id', getMusicianById)
musicianRouter.get('/:name', getMusicianByName)
musicianRouter.delete('/:id', isAdmin, deleteMusician)
musicianRouter.put('/:id', isAdmin, updateMusician)


module.exports = musicianRouter