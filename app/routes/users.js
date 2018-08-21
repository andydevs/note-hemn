/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import { Router } from 'express'
import User from '../model/user.js'
import { authenticate } from '../passport'

// Debugger
const debug = require('debug')('note-hemn:users')

/**
 * Users router
 */
export default function() {
    // Create users router
    var users = Router()

    // Signup user page
    users.get('/signup', (req, res) => {
        let error = req.flash('error')
        debug('Flash errors:', error)
        res.render('user-signup', {
            layout: 'base',
            error: error
        })
    })

    // Post signup
    users.post('/signup', (req, res) => {
        // Signup new user
        let { name, email, password, verify } = req.body
        User.localSignup(name, email, password, verify, (err, user) => {
            if (err) {
                // Redirect back to signup
                debug('Error logging in:', err.message)
                req.flash('error', err.message)
                res.redirect('/user/signup')
            } else {
                // Set session and redirect
                debug('Signed up user!')
                req.session.user = user
                res.redirect('/')
            }
        })
    })

    // Login user page
    users.get('/login', (req, res) => {
        let error = req.flash('error')
        debug('Flash errors:', error)
        res.render('user-login', {
            layout: 'base',
            error: error
        })
    })

    // Post user login
    users.post('/login', (req, res) => {
        // Login user
        let { email, password } = req.body
        User.localLogin(email, password, (err, user) => {
            if (err) {
                // Redirect back to login
                debug('Error logging in:', err.message)
                req.flash('error', err.message)
                res.redirect('/user/login')
            } else {
                // Set session and redirect
                debug('Logged in user!')
                req.session.user = user
                res.redirect('/')
            }
        })
    })

    // User logout page
    users.get('/logout', authenticate, (req, res) => {
        res.render('user-logout', {
            layout: 'base',
            user: req.session.user
        })
    })

    // User post logout
    users.post('/logout', authenticate, (req, res) => {
        debug('Logged out user!')
        req.session.destroy()
        res.redirect('/user/login')
    })

    // User get profile
    users.get('/profile', authenticate, (req, res) => {
        res.render('user-view', { user: req.session.user })
    })

    // User update-name page
    users.get('/update/name', authenticate, (req, res) => {
        res.render('user-update-name', { user: req.session.user })
    })

    // User update name
    users.post('/update/name', authenticate, (req, res) => {
        // Update name of user
        res.redirect('/user/profile')
    })

    // User update password page
    users.get('/update/password', authenticate, (req, res) => {
        res.render('user-update-password', { user: req.session.user })
    })

    // User update password
    users.post('/update/password', authenticate, (req, res) => {
        // Update password of user
        res.redirect('/user/profile')
    })

    // Return router
    return users
}
