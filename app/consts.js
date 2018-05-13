/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */

// Port constant
export const PORT = 8080

 // Notes constant
export const NOTES = [
     {
         labels: ['foo', 'bar', 'baz'],
         content: 'Content content content'
     },
     {
         labels: ['foo', 'bar'],
         content: 'More content'
     },
]

// URI constant for mongo lab
export const MONGOLAB_URI = process.env.MONGOLAB_URI

// Mongo dbname
export const MONGO_DBNAME = 'notedb'