/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import express from 'express'
import handlebars from 'express-handlebars'
import { NOTES, MONGOLAB_URI, MONGO_DBNAME } from './consts'
import { MongoClient } from 'mongodb'

// Create app
var app = express()

// Configure handlebars
app.engine('.hbs', handlebars({
    extname: '.hbs',
    defaultLayout: 'default' }))
app.set('view engine', '.hbs')

// Create index route
app.get('/', (req, res) => {
    // Get notes from mongo. Render to index
    MongoClient.connect(MONGOLAB_URI, { useNewUrlParser: true}, (error, client) => {
        if (error) throw error
        client.db(MONGO_DBNAME)
              .collection('notes')
              .find({})
              .toArray((error, notes) => {
                  if (error) throw error
                  res.render('index', { notes: notes })
                  client.close()
              })
    })
})

// Get id route
app.get('/:id', (req, res) => {
    // Find note from mongo Render to index
    MongoClient.connect(MONGOLAB_URI, { useNewUrlParser: true}, (error, client) => {
        if (error) throw error
        client.db(MONGO_DBNAME)
              .collection('notes')
              .find({ _id: req.params.id })
              .limit(1)
              .next((error, note) => {
                  if (error) throw error
                  res.render('note', note)
                  client.close()
              })
    })
})

// Export app
export default app
