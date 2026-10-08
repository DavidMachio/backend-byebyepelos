const { isAuth, isAdmin } = require('../../middlewares/auth');
const {checkUser} = require('../../middlewares/checkUser');
const upload = require('../../middlewares/file');
const { register, getUsers, login, updateUser, deleteUser, getUserByName, checksessions, removeSongFromPlaylist, getMyPlaylist } = require('../controllers/user_controllers');

const userRouter = require('express').Router();
//routes

userRouter.post("/register", upload.single('avatar'), register)
userRouter.post('/login', login)
userRouter.post('/checksession', isAuth, checksessions)
userRouter.put('/:id', isAuth, checkUser, upload.single('avatar'), updateUser)
userRouter.put('/:id/remove-song', isAuth, checkUser, removeSongFromPlaylist)
userRouter.delete('/:id', isAuth, checkUser, deleteUser)
userRouter.get("/",isAdmin, getUsers)
userRouter.get('/me/playlist', isAuth, getMyPlaylist)
userRouter.get("/:name", getUserByName)



module.exports = userRouter;