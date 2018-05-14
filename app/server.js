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
import { MongoClient, ObjectId } from 'mongodb'
import { NOTES, MONGOLAB_URI, MONGO_DBNAME } from './consts'

// Create app
var app = express()

// Configure handlebars
app.engine('.hbs', handlebars({
    extname: '.hbs',
    defaultLayout: 'default' }))
app.set('view engine', '.hbs')

// Create index route
app.get('/', async (req, res) => {
    // Connect to mongo
    let client = await MongoClient.connect(MONGOLAB_URI, {
        useNewUrlParser: true })

    // Query for all notes
    let notes = await client.db(MONGO_DBNAME).collection('notes')
        .find({}).toArray()

    // Render notes and close client
    res.render('index', { notes: notes })
    client.close()
})

// Get id route
app.get('/:id', async (req, res) => {
    // Connect to mongo
    let client = await MongoClient.connect(MONGOLAB_URI, {
        useNewUrlParser: true })

    // Query for the note by the given id
    let note = await client.db(MONGO_DBNAME).collection('notes')
        .find({ _id: ObjectId(req.params.id) }).limit(1).next()

    // Render note and close client
    res.render('note', note)
    client.close()
})

// Export app
export default app
