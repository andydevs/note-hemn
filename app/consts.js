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

// Express session secret constant
export const EXPRESS_SESSION_SECRET = '0k4yit5chi1dish94m6in0'

// Bcrypt salt rounds constant
export const BCRYPT_SALT_ROUNDS = 8

// MONGO CONSTANTS
export const MONGO_URI = process.env.MONGOLAB_URI // URI constant for mongo lab
export const MONGO_DBNAME = 'notedb' // Mongo dbname
export const MONGO_COLLEC_NOTES = 'notes' // Mongo collection name for notes
export const MONGO_COLLEC_USERS = 'users' // Mongo collection name for users
export const MONGO_COLLEC_LABELS = 'labels' // Mongo collection name for labels
