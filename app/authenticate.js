/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */

/**
 * Authentication middleware
 *
 * @param {express.Request} req request object
 * @param {express.Response} res response object
 * @param {Function} next middleware next call
 */
export function authenticate(req, res, next) {
    if (req.session && req.session.user) next()
    else res.redirect('/user/login')
}
