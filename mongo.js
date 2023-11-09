// Variaveis
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cheerio = require('cheerio')
const fs = require("fs");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const port = 3000;


// mongo 
mongoose.connect('mongodb://127.0.0.1:27017/equiChanceDB',{
    serverSelectionTimeoutMS: 20000,
});

const usuarioSchema = new mongoose.Schema({
    nome : {type : String},
    email : {type : String},
    senha : {type : String},
    endereco : {type : String},
    bairro : {type : String},
    complemento : {type : String},
    CEP : {type : Number},
    UF : {type : String},
})

const Usuario = mongoose.model("Usuario", usuarioSchema)

app.get("/", async(req,res)=>{
    res.sendFile(__dirname+"/index.html")
})

app.get("/cadastro", async(req,res)=>{
    res.sendFile(__dirname+"/cadastro.html")
})

app.get("/contato", async(req,res)=>{
    res.sendFile(__dirname+"/contato.html")
})

app.get("/doe", async(req,res)=>{
    res.sendFile(__dirname+"/doe.html")
})

app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`)
})  


app.post("/cadastro",async(req,res)=>{
    const nome = req.body.nome
    const email = req.body.email 
    const senha = req.body.senha 
    const endereco = req.body.endereco
    const bairro = req.body.bairro 
    const complemento = req.body.complemento
    const CEP = req.body.CEP 
    const UF = req.body.UF 

    const todosElementos = [nome,email,senha,endereco,bairro,complemento,CEP,UF]



    if (!nome || !email || !senha) {
        fs.readFile('./cadastro.html', function(err, data) {
          if (err) throw err;
          var $ = cheerio.load(data);
      
          $("#erroCadastro").text("Campos obrigatórios não preenchidos.");
          return res.send($.html()); 
        });
        return
    }

    const emailExiste = await Usuario.findOne({email:email})

    if(emailExiste) {
        fs.readFile('./cadastro.html', function(err, data) {
            if (err) throw err;
            var $ = cheerio.load(data);
        
            $("#erroCadastro").text("Email já cadastrado!");
            return res.send($.html()); 
          });
          return
    }

    const usuarios = new Usuario({
        nome : nome,
        email : email,
        senha : senha,
    })

    for(let i=2;i<todosElementos.length - 1;i++) {
        let elemento = todosElementos[i]
        let nome = 'error'
        if(elemento) {
            switch(i) {
                case 2:
                    nome = 'endereco'
                    break;
                case 3:
                    nome = 'bairro'
                    break;
                case 4:
                    nome = 'complemento'
                    break;
                case 5:
                    nome = 'CEP'
                    break;
                case 6:
                    nome = 'UF'
                    break;
            }
            usuarios[nome] = elemento
        }
    }
     
    // falar no site que o cadastro deu certo e depois rediricionar para a home 
    try{
        const newUser = await usuarios.save();

        fs.readFile('./cadastro.html', function(err, data) {
            if (err) throw err;
            var $ = cheerio.load(data);

            

            $("#data").text(JSON.stringify(todosElementos));
            return res.send($.html()); 
          });
        return false
    } catch(err) {
        res.status(400).json({err})
    }
})
