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
import bodyParser from 'body-parser'
import { MongoClient, ObjectId } from 'mongodb'
import { NOTES, MONGOLAB_URI, MONGO_DBNAME } from './consts'

// Create app
var app = express()

// Configure handlebars
app.engine('.hbs', handlebars({
    extname: '.hbs',
    defaultLayout: 'default',
    helpers: {
        join: (items, block) => items ? items.join(" ") : ""
    }
}))
app.set('view engine', '.hbs')

// Parsers
app.use(bodyParser.urlencoded({ extended: true }))

// Create index route
app.get('/', async (req, res) => {
    // Mongo client
    var client;

    try {
        // Connect to mongo
        client = await MongoClient.connect(MONGOLAB_URI, {
            useNewUrlParser: true })

        // Query for all notes
        let notes = await client.db(MONGO_DBNAME).collection('notes')
            .find({}).toArray()

        // Render notes and close client
        res.render('index', { notes: notes })
        client.close()
    }
    catch (error) {
        // Send error and close client
        res.send(error.stack)
        if (client) client.close()
    }
})

// Get new form
app.get('/new', (req, res) => {
    res.render('note-form', { note: null, action: 'new' })
})

// Post new form
app.post('/new', async (req, res) => {
    // Mongo client
    var client;

    try {
        // Connect to mongo
        client = await MongoClient.connect(MONGOLAB_URI, {
            useNewUrlParser: true })

        // Insert new note
        let result = await client.db(MONGO_DBNAME).collection('notes')
            .insertOne({
                labels: req.body.labels.split(/\s+/),
                content: req.body.content
            })

        // Redirect back to home and close client
        res.redirect('/')
        client.close()
    }
    catch (error) {
        // Send error and close client
        res.send(error.stack)
        if (client) client.close()
    }
})

// Get id route
app.get('/:id', async (req, res) => {
    // Mongo client
    var client;

    try {
        // Connect to mongo
        client = await MongoClient.connect(MONGOLAB_URI, {
            useNewUrlParser: true })

        // Query for the note by the given id
        let note = await client.db(MONGO_DBNAME).collection('notes')
            .find({ _id: ObjectId(req.params.id) }).limit(1).next()

        // Render note and close client
        res.render('note-view', note)
        client.close()
    }
    catch (error) {
        // Send error and close client
        res.send(error.stack)
        if (client) client.close()
    }
})

// Get edit form
app.get('/:id/edit', async (req, res) => {
    // Mongo client
    var client;

    try {
        // Connect to mongo
        client = await MongoClient.connect(MONGOLAB_URI, {
            useNewUrlParser: true })

        // Query for the note by the given id
        let note = await client.db(MONGO_DBNAME).collection('notes')
            .find({ _id: ObjectId(req.params.id) }).limit(1).next()

        // Render note and close client
        res.render('note-form', { note: note, action: `${note._id}/edit` })
        client.close()
    }
    catch (error) {
        // Send error and close client
        res.send(error.stack)
        if (client) client.close()
    }
})

// Post edit form
app.post('/:id/edit', async (req, res) => {
    // Mongo client
    var client;

    try {
        // Connect to mongo
        client = await MongoClient.connect(MONGOLAB_URI, {
            useNewUrlParser: true })

        // Replace note
        let result = await client.db(MONGO_DBNAME).collection('notes')
            .replaceOne({ _id: ObjectId(req.params.id) }, {
                labels: req.body.labels.split(/\s+/),
                content: req.body.content
            })

        // Redirect back to home and close client
        res.redirect('/')
        client.close()
    }
    catch (error) {
        // Send error and close client
        res.send(error.stack)
        if (client) client.close()
    }
})

// Note delete form
app.get('/:id/delete', async (req, res) => {
    // Mongo client
    var client;

    try {
        // Connect to mongo
        client = await MongoClient.connect(MONGOLAB_URI, {
            useNewUrlParser: true })

        // Query for the note by the given id
        let note = await client.db(MONGO_DBNAME).collection('notes')
            .find({ _id: ObjectId(req.params.id) }).limit(1).next()

        // Render note form
        res.render('note-delete', { note: note })
        client.close()
    }
    catch (error) {
        // Send error and close client
        res.send(error.stack)
        if (client) client.close()
    }
})

// Delete note
app.post('/:id/delete', async (req, res) => {
    // Mongo client
    var client;

    try {
        // Connect to mongo
        client = await MongoClient.connect(MONGOLAB_URI, {
            useNewUrlParser: true })

        // Delete note
        let result = await client.db(MONGO_DBNAME).collection('notes')
            .deleteOne({ _id: ObjectId(req.params.id) })

        // Redirect back to home and close client
        res.redirect('/')
        client.close()
    }
    catch (error) {
        // Send error and close client
        res.send(error.stack)
        if (client) client.close()
    }
})

// Export app
export default app
