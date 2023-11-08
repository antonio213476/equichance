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
    nome : {type : String, required: true},
    email : {type : String, required: true},
    senha : {type : String, required: true},
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
    res.sendFile(__dirname+"/Paginas/cadastro.html")
})

app.get("/contato", async(req,res)=>{
    res.sendFile(__dirname+"/Paginas/contato.html")
})

app.get("/doe", async(req,res)=>{
    res.sendFile(__dirname+"/Paginas/doe.html")
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

    const elementosOpcionais = [endereco,bairro,complemento,CEP,UF]

    if ([nome,email,senha].some(el => el == null) ) {          
        return res.status(400).json({error : "Campos não preenchidos"})
    }

    const emailExiste = await Usuario.findOne({email:email})

    if(emailExiste) {
        return res.status(400).json({error : "Email Já Existe!"})
    }

    const usuarios = new Usuario({
        nome : nome,
        email : email,
        senha : senha,
    })

    for(let i=-1;i<elementosOpcionais.length - 1;i++) {
        let elemento = elementosOpcionais[i]
        let nome = 'error'
        if(elemento) {
            switch(i) {
                case 0:
                    nome = 'endereco'
                    break;
                case 1:
                    nome = 'bairro'
                    break;
                case 2:
                    nome = 'complemento'
                    break;
                case 3:
                    nome = 'CEP'
                    break;
                case 4:
                    nome = 'UF'
                    break;
            }
            usuarios[nome] = elemento
        }
    }

    try{
        const newUser = await usuarios.save();
        res.json({error : null, msg: "Cadastro feito com successo",userId : newUser._id})
    } catch(err) {
        res.status(400).json({err})
    }
})
