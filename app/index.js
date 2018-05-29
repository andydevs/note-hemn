/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import '@babel/polyfill'
import createDebug from 'debug'
import server from './server'
import { PORT } from './consts'

// Create debug context
var debug = createDebug('note-hemn:server')

// Listen on 8080
server.listen(PORT, () => {
    debug(`Server is listening on port ${PORT}...`)
    console.log('-')
})
