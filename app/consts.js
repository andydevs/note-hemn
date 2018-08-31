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

// Express session constants
export const EXPRESS_SESSION_SECRET = '0k4yit5chi1di5h94m6in0'
export const EXPRESS_SESSION_AGE = 30*60*1000 // Session lasts for 30 minutes

// Bcrypt salt rounds constant
export const BCRYPT_SALT_ROUNDS = 8

// MONGO CONSTANTS
export const MONGO_URI = process.env.MONGO_URI // URI constant for mongodb

// Label colors
export const LABEL_COLORS = [
    'pink',
    'red',
    'yellow',
    'green',
    'turquoise',
    'cyan',
    'blue',
    'violet',
    'gray'
]
export const TEXT_COLOR = {
    pink: 'dark',
    red: 'white',
    yellow: 'dark',
    green: 'dark',
    turquoise: 'dark',
    cyan: 'dark',
    blue: 'white',
    violet: 'white',
    gray: 'dark'
}
