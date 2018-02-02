const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const mongo = require('mongodb').MongoClient
const urlDb = 'mongodb://localhost:27017/'



app.listen(3000, (err) => {
    console.log('Server running...')
})

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')

// app.use((req, res, next) => {
//     if(req.session.user){
//         res.locals.user = req.session.user
//     }else{
//         res.locals.user = false
//     }
//     next()
// })

app.get('/', (req, res) => {
    mongo.connect(urlDb, (err, db) => {
        const dbo = db.db('meucasamento')
        dbo.collection('gifts').find({}).toArray((err, result) => {
            if(err){
                res.status(500).send('erro')
            }else{
                res.render('index', {
                    gifts: result
                })
            }
        })
    })
})