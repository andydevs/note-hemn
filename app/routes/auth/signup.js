/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import { Router } from 'express'
import User from '../../models/user.js'

/**
 * Signup router
 */
export default function signupRouter() {
    // Debugger
    const debug = require('debug')('note-hemn:routes:auth:signup')

    // Create router
    let signup = Router()

    // Get page
    signup.get('/', (req, res) => {
        res.render('auth-signup', {
            layout: 'form',
            error: req.flash('error')
        })
    })

    // Post signup command
    signup.post('/', (req, res) => {
        // Signup new user
        let { email, password, verify } = req.body
        User.localSignup(email, password, verify)
            .then(user => {
                // Log in user redirect
                debug('Signed up user!')
                req.login(user, (err) => {
                    if (err) {
                        req.flash('error', err.message)
                        res.redirect('/auth/signup')
                    } else {
                        res.redirect('/user/create')
                    }
                })
            })
            .catch(err => {
                // Redirect back to signup
                debug('Error signing up:', err.message)
                req.flash('error', err.message)
                res.redirect('/auth/signup')
            })
    })

    // Return router
    return signup
}
