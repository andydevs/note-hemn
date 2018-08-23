/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import User from './models/user'
import { Strategy as LocalStrategy } from 'passport-local'

/**
 * Config
 */
export default function(passport) {

    // Local login strategy
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (email, password, done) => {
        User.localLogin(email, password, (err, user) => {
            done(err, user)
        })
    }))

    // Serialize user
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    // Deserialize user
    passport.deserializeUser((_id, done) => {
        User.findOne({ _id }, (err, user) => {
            done(err, user)
        })
    })

}

/**
 * Authenticate user middleware. Redirect to login if not authenticated
 */
export function authenticate(req, res, next) {
    if (req.isAuthenticated()) next()
    else {
        req.flash('error', 'Must log in!')
        res.redirect('/user/login')
    }
}
