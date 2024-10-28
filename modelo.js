//Dependecias
const mysql = require('mysql')
var jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')


//Inicio del modelo
let modelo = {};

const hostDB = 'localhost';
const userDB = 'root';
const passDB = '';
const database = 'prueba';

modelo.inicio = function(nombre,callback)
{
  callback(null,{nombre: nombre,status:'conectado'})
}

modelo.verificarUsuario = function(email,pass,callback)
{
  var conexion = mysql.createConnection(
    {
      host: hostDB,
      user: userDB,
      password: passDB,
      database: database
    });
  
  conexion.connect((err) =>
    {
      if (err) throw err;
    });
  
  if (conexion) 
    {
      var consulta = "select * from doctores where correo = '" + email + "' and pass = '" + pass + "'";

      conexion.query(consulta, function(err, filas){
        if (err) 
        {
          console.log(err);
        }
        else
        {
          if(filas.length >= 1)
          {
            var token = jwt.sign({ email: email }, 'claveToken2024');
            callback(null,{status: 'OK', datos: filas, mensaje: "Usuario encontrado", token: token});
          }
          else
          {
            callback(null,{status: 'OK', datos: null, mensaje:"Usuario no encontrado"});
          }
        }

      })

    }

    conexion.end((err) =>
      {
          // The connection is terminated gracefully
          // Ensures all previously enqueued queries are still
          // before sending a COM_QUIT packet to the MySQL server.
      });
}


modelo.enviarEmail = function(email,token, callback)
{
  //transporter que es un objeto que maneja el envío de correos electrónicos. 
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'ejemplo@gmail.com',
      pass: 'rzdaazwrztlbcwaf' //https://security.google.com/settings/security/apppasswords
    }
  });

  //setup email data with unicode symbols
  let mailOptions = {
    from: 'ejemplo@gmail.com',
    to: email,
    subject: 'Confirmacion de cuenta',
    html: '<p> Has click en el siguiente link <a href="http://localhost:3000/confirmarToken?token='+ token +'"> click aqui </a> para confirmar tu correo</p>'
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if(error)
    {
      console.log('Correo NO enviado correctamente');
      callback(null,{status: 'FAIL', mensaje: "Correo no enviado"});
    }
    else
    {
      console.log('Correo enviado correctamente');
      callback(null,{status: 'OK', mensaje: "Correo enviado correctamente"});
    }
  })




}


module.exports = modelo;