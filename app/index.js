/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import '@babel/polyfill'
import server from './server'
import mongoose from 'mongoose'
import { MONGO_URI, PORT } from './consts'

// Create debug
const debug = require('debug')('note-hemn:server')

// Connect to mongoose
mongoose.connect(MONGO_URI, { useNewUrlParser: true }, error => {
    if (error) throw error
    else debug('Mongoose connected!')
})

// Listen on 8080
server.listen(PORT, () => {
    debug(`Server is listening on port ${PORT}...`)
    console.log('-')
})
