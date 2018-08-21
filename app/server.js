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
import sass from 'node-sass-middleware'
import mongoose from 'mongoose'
import path from 'path'
import * as handlebarsHelpers from './handlebars-helpers'
import users from './routes/users'
import {
    MONGO_URI,
    EXPRESS_SESSION_SECRET,
    EXPRESS_SESSION_AGE
} from './consts'

// Create debug
const debug = require('debug')('note-hemn')

// Connect to mongoose
mongoose.connect(MONGO_URI, { useNewUrlParser: true }, error => {
    if (error) throw error
    else debug('Mongoose connected!')
})

// Create app
var app = express()

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
app.use(flash())

// Sass middleware
app.use(sass({
    src: path.join(__dirname, '../scss'),
    dest: path.join(__dirname, '../css'),
    debug: false,
    prefix: '/style'
}))
app.use('/style',
    express.static(
        path.join(__dirname, '../css')))

// Static routes
app.use('/jquery',
    express.static(
        path.join(
            __dirname,
            '../node_modules/jquery/dist')))
app.use('/bootstrap',
    express.static(
        path.join(
            __dirname,
            '../node_modules/bootstrap/dist')))

// App routes
app.use('/user', users())

// Export app
export default app
