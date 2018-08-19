/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */

// Create debug
const debug = require('debug')('note-hemn:authenticate')

/**
 * Authentication middleware. Check if user has logged in
 * Else redirect to login page
 *
 * @param {express.Request} req request object
 * @param {express.Response} res response object
 * @param {Function} next middleware next call
 */
export default function authenticate(req, res, next) {
    debug('Authenticating user...')
    if (req.session && req.session.user) {
        debug('Authenticated user:')
        debug(req.session.user)
        next()
    }
    else {
        debug('No authenticated user! Redirecting to login...')
        res.redirect('/user/login')
    }
}
