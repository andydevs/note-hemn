/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */

// Server constants
export const PORT = process.env.PORT || 8080 // Server port

// Express constants
export const EXPRESS_SESSION_SECRET = '0k4yit5chi1dish94m6in0' // Session secret

// MONGO CONSTANTS
export const MONGO_URI = process.env.MONGOLAB_URI // URI constant for mongo lab
export const MONGO_DBNAME = 'notedb' // Mongo dbname
export const MONGO_COLLEC_NOTES = 'notes' // Mongo collection name for notes
export const MONGO_COLLEC_USERS = 'users' // Mongo collection name for users
