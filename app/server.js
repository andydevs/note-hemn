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
import notes from './routes/notes'
import users from './routes/users'
import { dbConnect } from './db'
import { indexNotes } from './models/note'

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

// Configure app
app.use(bodyParser.urlencoded({ extended: true }))

// Routes
app.use('/note', notes)
app.use('/user', users)

// Create index route
app.get('/', async (req, res) => {
    // Mongo client
    var client;

    try {
        // Connect to mongo
        client = await dbConnect()

        // Query for all notes
        let notes = await indexNotes(client)

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

// Export app
export default app
