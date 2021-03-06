/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import express from 'express'
import session from 'express-session'
import handlebars from 'express-handlebars'
import flash from 'express-flash'
import bodyParser from 'body-parser'
import passport from 'passport'
import path from 'path'
import * as handlebarsHelpers from './helpers/handlebars'
import user from './routes/user'
import auth from './routes/auth'
import note from './routes/note'
import label from './routes/label'
import configurePassport, { authenticate } from './passport'
import { EXPRESS_SESSION_SECRET, EXPRESS_SESSION_AGE } from './consts'

// Create debug
const debug = require('debug')('note-hemn')

// Configure passport
configurePassport(passport)

// Create app
const app = express()

// Configure handlebars
app.engine('.hbs', handlebars({
    extname: '.hbs',
    defaultLayout: 'default',
    helpers: handlebarsHelpers
}))
app.set('view engine', '.hbs')

// Support routes
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(session({
    secret: EXPRESS_SESSION_SECRET,
    maxAge: EXPRESS_SESSION_AGE,
    saveUninitialized: true,
    resave: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// Static routes
app.use('/style',
    express.static(
        path.join(__dirname, '../css')))
app.use('/jquery',
    express.static(
        path.join(__dirname, '../node_modules/jquery/dist')))
app.use('/bootstrap',
    express.static(
        path.join(__dirname, '../node_modules/bootstrap/dist')))
app.use('/fontawesome',
    express.static(
        path.join(__dirname, '../node_modules/@fortawesome/fontawesome-free/webfonts')))

// App routes
app.use('/auth', auth(passport))
app.use('/user', authenticate, user())
app.use('/note', authenticate, note())
app.use('/label', authenticate, label())

// Main routes
app.get('/', (req, res) => res.redirect('/note'))

// Export app
export default app
