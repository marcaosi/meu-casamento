const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const mongodb = require('mongodb')
const mongo = mongodb.MongoClient
// const urlDb = 'mongodb://localhost:27017/'
const urlDb = 'mongodb+srv://marcaosi:marcao1996@cluster0-bj0ai.mongodb.net/test'

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

app.get('/gift', (req, res) => {
    res.render('formGift')
})

app.post('/gift', (req, res) => {
    let gift = req.body
    gift.status = 'Disponível'

    mongo.connect(urlDb, (err, db) => {
        if(!err){
            const dbo = db.db('meucasamento')
            dbo.collection('gifts').insert(gift)
            res.redirect('/')
        }else{
            console.log("Impossível conectar no banco de dados => \n" + err)
        }
    })
})

app.get('/markGift/:id', (req, res) => {
    mongo.connect(urlDb, (err, db) => {
        if(!err){
            const dbo = db.db('meucasamento')
            let id = new mongodb.ObjectID(req.params.id)
            dbo.collection('gifts').find({_id:id}).toArray((err, result) => {
                if(err){
                    res.status(500).send('erro'+err)
                }else{
                    // console.log(result)
                    let gift = result[0]
                    if(gift){
                        res.render('markGift', {
                            gift
                        })
                    }else{
                        res.redirect('/')
                    }
                    
                }
            })
        }else{
            console.log("Impossível conectar no banco de dados => \n" + err)
        }
    })
})

app.get('/', (req, res) => {
    mongo.connect(urlDb, (err, db) => {
        if(!err){
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
        }else{
            console.log("Impossível conectar no banco de dados => \n" + err)
        }
    })
})