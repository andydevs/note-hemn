/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */

// Port constant
export const PORT = process.env.PORT || 8080

// MONGO CONSTANTS
export const MONGO_URI = process.env.MONGOLAB_URI // URI constant for mongo lab
export const MONGO_DBNAME = 'notedb' // Mongo dbname
export const MONGO_COLLEC_NOTES = 'notes' // Mongo collection name for notes
