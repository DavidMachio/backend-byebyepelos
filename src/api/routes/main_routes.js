const userRouter = require("./user_routes");
const musicianRouter = require('./musicians_routes')
const albumRouter = require('./album_routes');
const songRouter = require("./song_routes");

const mainRouter = require("express").Router();

mainRouter.use("/users", userRouter)
mainRouter.use('/musicians', musicianRouter)
mainRouter.use('/albums', albumRouter)
mainRouter.use('/songs', songRouter)

module.exports = mainRouter