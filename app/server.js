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

// Port constant
const PORT = 8080

const NOTES = [
    { labels: ['foo', 'bar', 'baz'], text: 'Content content content' },
    { labels: ['foo', 'bar'], text: 'More content' }
]

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

// Export app
export default app
