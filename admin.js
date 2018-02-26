const express = require('express')
const mongodb = require('mongodb')
const app = express.Router()

const init = (mongo, urlDb) => {

    app.get('/gift', (req, res) => {
        res.render('formGift',{gift:{}})
    })

    app.post('/gift', (req, res) => {
        let gift = req.body
        gift.status = 'Disponível'
    
        mongo.connect(urlDb, (err, db) => {
            if(!err){
                const dbo = db.db('meucasamento')
                dbo.collection('gifts').insert(gift)
                res.redirect('/admin')
            }else{
                console.log("Impossível conectar no banco de dados => \n" + err)
                res.redirect('/admin')
            }
        })
    })

    app.get('/gift/:id', (req, res) => {
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
                        res.render('formGift', {
                            gift
                        })
                    }
                })
            }else{
                console.log("Impossível conectar no banco de dados => \n" + err)
            }
        })
    })
    
    app.post('/gift/:id', (req, res) => {
        let gift = req.body
        gift.status = 'Disponível'
    
        mongo.connect(urlDb, (err, db) => {
            if(!err){
                const dbo = db.db('meucasamento')
                let id = new mongodb.ObjectID(gift.id)
                dbo.collection('gifts').find({_id:id}).toArray((err, results) => {
                    if(err) res.status(500).send('erro'+err)
                    else{
                        if(results.length === 0){
                            console.log('não existe')
                        }else{
                            dbo.collection('gifts').updateOne(
                                {
                                    _id: id
                                },
                                {
                                    $set:gift
                                },
                                (err, obj) => {
                                    if(err) res.status(500).send('erro: '+err)
                                    else res.redirect('/admin')
                                }
                            )
                        }

                    }
                })
                // res.redirect('/admin')
            }else{
                console.log("Impossível conectar no banco de dados => \n" + err)
                res.redirect('/admin')
            }
        })
    })


    app.get('/', (req, res) => {
        mongo.connect(urlDb, (err, db) => {
            if(!err){
                const dbo = db.db('meucasamento')
                dbo.collection('gifts').find({}).toArray((err, results) => {
                    if(!err){
                        res.render('admin/manageGifts', {
                            gifts: results
                        })
                    }else{
                        res.redirect('/')
                    }
                })
                
            }else{
                console.log("Impossível conectar no banco de dados => \n" + err)
            }
        })
        
    })

    app.get('/gift/:id/delete', (req, res) => {
        mongo.connect(urlDb, (err, db) => {
            if(!err){
                const dbo = db.db('meucasamento')
                const id = new mongodb.ObjectID(req.params.id)
                dbo.collection('gifts').deleteOne({_id:id}, (err, obj) => {
                    if(err) {
                        console.log(err)
                        res.redirect('/')
                    }else{
                        res.redirect('/admin')
                    }
                })
                
            }else{
                console.log("Impossível conectar no banco de dados => \n" + err)
            }
        })
        
    })

    return app
}

module.exports = init