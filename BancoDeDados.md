use equichanceDB
db.createCollection('Clientes')
db.Clientes.insertOne({
        nome : "Gustavo",
        email : "tornelli@gmail.com",
        senha : "senha1!"
})
db.Clientes.find()