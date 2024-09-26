const Musician = require('../models/musicians_model');

const createMusician = async (req, res, next) => {
    try {
    const newMusician = new Musician(req.body);
    const musicianDuplicated = await Musician.findOne({firstName: req.body.firstName})
    console.log(musicianDuplicated);
    if(musicianDuplicated) return res.status(400).json('Ya existe un músico con este nombre')
    await newMusician.save();
    return res.status(201).json(newMusician);
    } catch (error) {
    return res.status(500).json("Error al crear el nuevo músico");
    }
}

const getMusicians = async (requ, res, next) => {
    try {
        const musicians = await Musician.find().populate('songs')
        return res.status(200).json(musicians)
    } catch (error) {
        return res.status('400').json('Error al buscar músicos')
    }
}

const getMusicianByName = async (req, res, next) => {
    try {
        const musician = await Musician.find({firstName: {$regex: req.params.name, $options: "i"}})
        return res.status(200).json(musician)
    } catch (error) {
        return res.status(400).json('No se ha encontrado este músico')
    }
}

const getMusicianById = async (req, res, next) => {
    try {
        const {id} = req.params
        const musician = await Musician.findById(id)
        return res.status(200).json(musician)
        
    } catch (error) {
        return res.status(400).json('No se ha encontrado este musico con este id')
    }
}

const updateMusician = async (req, res, next) => {
    try {
        const {id} = req.params
        const newMusician = new Musician(req.body)
        const oldMusician = await Musician.findById(id)

        newMusician._id = id
        oldMusician.songs = [...oldMusician.songs, ...newMusician.songs]

        const musician = await Musician.findByIdAndUpdate(id, newMusician, {new:true})
        return res.status(200).json({message:'Músico actualizado correctamente', musician})
    } catch (error) {
        return res.status(400).json('Error al actualizar el músico')
    }
}

const deleteMusician = async (req, res, next) => {
    try {
        const {id} = req.params
        const musicianDeleted = await Musician.findByIdAndDelete(id)
        return res.status(200).json({message:'Músico eliminado correctamente', musicianDeleted})
        
    } catch (error) {
        return res.status(400).json('Error al eliminar el músico')
    }
}

module.exports = {
    createMusician,
    getMusicianByName,
    getMusicianById,
    getMusicians,
    updateMusician,
    deleteMusician,

}