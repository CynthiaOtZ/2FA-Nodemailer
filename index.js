//Dependencias
var express = require('express')
var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken');

//Modelo 
const modelo = require('./modelo.js');

var app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
 
 
app.get('/', function (req, res) {
  
  modelo.inicio('cynthia',function(err, filas){
    
    if(err)
    {
      return res.status(500).json({error: 'Ocurrio un error'});
    }
    else
    {
      res.json(filas); //Devuelve las respuestas en formato json
    }   
  }); 
})


app.get('/verificar', function(req, res){
  var email = req.query.email;
  var pass = req.query.pass;

  modelo.verificarUsuario(email,pass, function(err, filas)
  {
    if(err)
    {
      return res.status(500).json({error: 'Ocurrio un error'});
    }
    else
    {
      res.json(filas); //Devuelve las respuestas en formato json
    }
  })
})


app.post('/enviarEmail', function(req,res){
  var email = req.body.email;
  var token = req.body.token;

  modelo.enviarEmail(email,token ,function(err,filas){
    if(err)
      {
        return res.status(500).json({error: 'Ocurrio un error'});
      }
      else
      {
        res.json(filas); //Devuelve las respuestas en formato json
      }
  })
  
})



app.get('/confirmarToken', function(req,res)
{
  var token = req.query.token;
  jwt.verify(token, 'claveToken2024', function(err, data)
  {
    if(err)
    {
      return res.json({ status: 'FAIL',mensaje: 'Token invalida' });
    }
    else
    {
      return res.json({ status: 'OK',mensaje: 'Token valida' });
    }
  });
})









 
app.listen(3000, function () {
  console.log('CORS-enabled web server listening on port 3000')
})