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
import { NOTES } from './consts'

// Create app
var app = express()

// Configure handlebars
app.engine('.hbs', handlebars({
    extname: '.hbs',
    defaultLayout: 'default' }))
app.set('view engine', '.hbs')

// Create index route
app.get('/', (req, res) => {
    res.render('index', { notes: NOTES })
})

// Get id route
app.get('/:id', (req, res) => {
    res.render('note', NOTES[req.params.id])
})

// Export app
export default app
