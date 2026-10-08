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
const sendEmail = ({email}) =>{
transporter.sendMail(mailOptions({email}), function(error, info){
    if (error) {
      return console.log(error);
    }
    console.log('Correo enviado: ' + info.response);
  });
}

module.exports = {sendEmail}

