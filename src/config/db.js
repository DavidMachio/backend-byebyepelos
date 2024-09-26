const mongoose  = require("mongoose");

const connectDB = async () => {
    try {
         await mongoose.connect(process.env.DB_URL)
        console.log('Me he conectado a la BBDD 🥳');
    } catch (error) {
        console.log('No me he podido conectar a la BBDD 😡');
    }
}
module.exports = { connectDB }