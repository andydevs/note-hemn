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
 * Configure passport
 *
 * @param {Passport} passport instance
 */
export default function configurePassport(passport) {

    // Local login strategy
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (email, password, done) => {
        User.localLogin(email, password)
            .then(user => done(null, user))
            .catch(err => done(err))
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
