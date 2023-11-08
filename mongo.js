// Variaveis
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const port = 3000;


// mongo 
mongoose.connect('mongodb://0.0.0.0:27017/equiChanceDB',{
    serverSelectionTimeoutMS: 20000,
});

const usuarioSchema = new mongoose.Schema({
    email : {type : String, required: true},
    senha : {type : String, required: true}
})

const paoSchema = new mongoose.Schema({
    id_produtopao : {type : Number, required: true},
    descricao : {type : String},
    tipo : {type : String},
    dataValidade : {type : Date},
    quantidadeEstoque : {type : Number}
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
    const email = req.body.email
    const senha = req.body.senha 

    if ([email,senha].some(el => el == null) ) {          
        return res.status(400).json({error : "Campos não preenchidos"})
    }

    const emailExiste = await Usuario.findOne({email:email})

    if(emailExiste) {
        return res.status(400).json({error : "Email Já Existe!"})
    }

    const usuarios = new Usuario({
        email : email,
        senha : senha,
    })

    try{
        const newUser = await usuarios.save();
        res.json({error : null, msg: "Cadastro feito com successo",userId : newUser._id})
    } catch(err) {
        res.status(400).json({err})
    }
})
