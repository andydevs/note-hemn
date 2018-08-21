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
        res.render('user-signup', { layout: 'base' })
    })

    // Post signup
    users.post('/signup', (req, res) => {
        // Signup new user
        let { name, email, password, verify } = req.body
        User.localSignup(name, email, password, verify, (err, user) => {
            if (err) {
                // Redirect back to signup
                // TODO: Add flash messaging here
                res.redirect('/user/signup')
            } else {
                // Set session and redirect
                req.session.user = user
                res.redirect('/user/profile')
            }
        })
    })

    // Login user page
    users.get('/login', (req, res) => {
        res.render('user-login', { layout: 'base' })
    })

    // Post user login
    users.post('/login', (req, res) => {
        // Login user
        let { email, password } = req.body
        User.localLogin(email, password, (err, user) => {
            if (err) {
                // Redirect back to login
                // TODO: Add flash messaging here
                res.redirect('/user/login')
            } else {
                // Set session and redirect
                req.session.user = user
                res.redirect('/user/profile')
            }
        })
    })

    // User logout page
    users.get('/logout', (req, res) => {
        res.render('user-logout', { layout: 'base', user: req.session.user })
    })

    // User post logout
    users.post('/logout', (req, res) => {
        req.session.destroy()
        res.redirect('/user/login')
    })

    // User get profile
    users.get('/profile', (req, res) => {
        res.render('user-view', { user: req.session.user })
    })

    // User update-name page
    users.get('/update/name', (req, res) => {
        res.render('user-update-name', { user: req.session.user })
    })

    // User update name
    users.post('/update/name', (req, res) => {
        // Update name of user
    })

    // User update password page
    users.get('/update/password', (req, res) => {
        res.render('user-update-password', { user: req.session.user })
    })

    // User update password
    users.post('/update/password', (req, res) => {
        // Update password of user
    })

    // Return router
    return users
}
