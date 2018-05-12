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

// Create app
var app = express()

// Configure handlebars
app.engine('.hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', '.hbs')

// Create index route
app.get('/', (req, res) => res.render('index'))

// Listen on 8080
app.listen(PORT, () => console.log('Server is listening...'))
