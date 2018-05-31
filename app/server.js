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
import sass from 'node-sass-middleware'
import handlebars from 'express-handlebars'
import bodyParser from 'body-parser'
import authenticate from './authenticate'
import users from './routes/users'
import notes, { indexRoute } from './routes/notes'
import { EXPRESS_SESSION_SECRET } from './consts'

// Create app
var app = express()

// Configure handlebars
app.engine('.hbs', handlebars({
    extname: '.hbs',
    defaultLayout: 'default',
    helpers: {
        lString: (labels, block) =>
            labels ? labels.map(label => label.name).join(" ") : ""
    }
}))
app.set('view engine', '.hbs')

// Support routes
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
    secret: EXPRESS_SESSION_SECRET,
    saveUninitialized: true,
    resave: false
}))

// Static routes
app.use('/jquery',
    express.static(
        path.join(__dirname, '../node_modules/jquery/dist')))
app.use('/bootstrap',
    express.static(
        path.join(__dirname, '../node_modules/bootstrap/dist')))

// App routes
app.use('/note', notes)
app.use('/user', users)

// Undex route
app.get('/', authenticate, indexRoute)

// Export app
export default app
