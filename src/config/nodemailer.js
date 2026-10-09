require('dotenv').config();

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER_MAILER,
    pass: process.env.PASSWORD_MAILER
  }
});

const mailOptions = ({email}) => {
    return {
  from: process.env.USER_MAILER,
  to: email,
  subject: 'Tu cuenta ha sido creada',
  html: getHTML({email})
}
};

// El correo no incluye la contraseña: nunca debe viajar por email.
const getHTML = ({email}) => {
    return `
    <div>
    <h4>Tu usuario: ${email}</h4>
    <p>Entra con la contraseña que elegiste al registrarte.</p>
    <a href='https://byebyepelosmusic.vercel.app'>Haz click aquí para ir a la página</a>
    </div>
    `

}
// Devuelve una promesa: quien llama debe esperarla (await). En Vercel la función se congela
// al responder, y un envío lanzado sin esperar puede no llegar a salir. Si falla, no lanza
// error (el registro no debe romperse por el correo): lo anota en el registro y devuelve false.
const sendEmail = async ({email}) => {
  try {
    const info = await transporter.sendMail(mailOptions({email}))
    console.log('Correo enviado: ' + info.response)
    return true
  } catch (error) {
    console.log('Error al enviar el correo: ' + error.message)
    return false
  }
}

module.exports = {sendEmail}

