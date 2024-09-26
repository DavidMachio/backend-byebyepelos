require('dotenv').config();

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER_MAILER,
    pass: process.env.PASSWORD_MAILER
  }
});

const mailOptions = ({email, password, }) => {
    return {
  from: process.env.USER_MAILER,
  to: email,
  subject: 'Tu cuenta ha sido creada',
  html: getHTML({email, password})
}
};

const getHTML = ({email, password}) => {
    return `
    <div>
    <h4>Tu usuario: ${email}</h4>
    <h4>Tu contraseña: ${password}</h4>
    <a href='#'>Haz click aqui para ir a la página</a>
    </div>
    `

}
const sendEmail = ({email, password}) =>{
transporter.sendMail(mailOptions({email, password}), function(error, info){
    if (error) {
      return console.log(error);
    }
    console.log('Correo enviado: ' + info.response);
  });
}

module.exports = {sendEmail}

