const express = require ('express')
require('dotenv').config()
const cors = require('cors');
const mainRouter = require('./src/api/routes/main_routes');
const { connectDB } = require('./src/config/db');
const cloudinary = require('cloudinary').v2


const app = express();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

app.use(express.json())
app.use(cors())

connectDB()


app.use('/api/v1', mainRouter)

app.use('*', (req, res, next) => {
    return res.status(400).json('Ruta no encontrada')
})


app.listen(3000, () => {
    console.log('Servidor levantado en http://localhost:3000');
})