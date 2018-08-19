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
import { PORT } from './consts'

// Create debug
const debug = require('debug')('note-hemn:server')

// Listen on 8080
server.listen(PORT, () => {
    debug(`Server is listening on port ${PORT}...`)
    console.log('-')
})
