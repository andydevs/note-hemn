/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import path from 'path'
import express from 'express'
import session from 'express-session'
import handlebars from 'express-handlebars'
import bodyParser from 'body-parser'
import notes from './routes/notes'
import users from './routes/users'
import authenticate from './authenticate'
import { dbConnect, using } from './db'
import { indexNotes } from './models/note'
import { EXPRESS_SESSION_SECRET } from './consts'

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
app.use(session({
    secret: EXPRESS_SESSION_SECRET,
    saveUninitialized: true,
    resave: false
}))

// Routes
app.use('/jquery',
    express.static(
        path.join(__dirname, '../node_modules/jquery/dist')))
app.use('/bootstrap',
    express.static(
        path.join(__dirname, '../node_modules/bootstrap/dist')))
app.use('/note', notes)
app.use('/user', users)

// Create index route
app.get('/', authenticate, async (req, res) => {
    // Connect to mongo
    await using(dbConnect, async client => {
        // Query for all notes
        let notes = await indexNotes(client, req.session.user)

        // Render notes and close client
        res.render('index', {
            user: req.session.user,
            notes: notes })
    })
})

// Export app
export default app
