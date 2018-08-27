/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import { Router } from 'express'
import User from '../models/user.js'

// Debugger
const debug = require('debug')('note-hemn:routes:auth')

export default function authRouter(passport) {
    // Create router
    let auth = Router()

    // Signup user page
    auth.get('/signup', (req, res) => {
        let error = req.flash('error')
        debug('Flash errors:', error)
        res.render('auth-signup', {
            layout: 'base',
            error: error
        })
    })

    // Post signup
    auth.post('/signup', (req, res) => {
        // Signup new user
        let { email, password, verify } = req.body
        User.localSignup(email, password, verify, (err, user) => {
            if (err) {
                // Redirect back to signup
                debug('Error logging in:', err.message)
                req.flash('error', err.message)
                res.redirect('/auth/signup')
            } else {
                // Log in user redirect
                debug('Signed up user!')
                req.login(user, (err) => {
                    if (err) {
                        req.flash('error', err.message)
                        res.redirect('/auth/signup')
                    } else {
                        res.redirect('/')
                    }
                })
            }
        })
    })

    // Login user page
    auth.get('/login', (req, res) => {
        let error = req.flash('error')
        debug('Flash errors:', error)
        res.render('auth-login', {
            layout: 'base',
            error: error
        })
    })

    // Post user login
    auth.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: 'User was not found!'
    }))

    // User logout page
    auth.get('/logout', authenticate, (req, res) => {
        res.render('auth-logout', {
            layout: 'base',
            user: req.user
        })
    })

    // User post logout
    auth.post('/logout', authenticate, (req, res) => {
        debug('Logged out user!')
        req.logout()
        res.redirect('/auth/login')
    })

    // Return auth
    return auth
}

/**
 * Authenticate user middleware. Redirect to login if not authenticated
 */
export function authenticate(req, res, next) {
    if (req.isAuthenticated()) next()
    else res.redirect('/auth/login')
}
