const express = require('express')
const app = express.Router()

const init = (mongo, urlDb) => {



    app.get('', (req, res) => {
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

    return app
}

module.exports = init