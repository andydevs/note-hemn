/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */

/**
 * Authenticate user middleware. Redirect to login if not authenticated
 */
export function authenticate(req, res, next) {
    if (req.session && req.session.user) next()
    else {
        req.flash('error', 'Must log in!')
        res.redirect('/user/login')
    }
}
