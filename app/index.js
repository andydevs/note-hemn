/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import server from './server'
import { PORT } from './constants'

// Listen on 8080
server.listen(PORT, () => console.log('Server is listening...'))
