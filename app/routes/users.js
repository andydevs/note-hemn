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
import { authenticate } from '../passport'

// Debugger
const debug = require('debug')('note-hemn:routes:users')

/**
 * Users router
 */
export default function(passport) {
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
                // Log in user redirect
                debug('Signed up user!')
                req.login(user, (err) => {
                    if (err) {
                        req.flash('error', err.message)
                        res.redirect('/user/signup')
                    } else {
                        res.redirect('/')
                    }
                })
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
    users.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/user/login',
        failureFlash: 'User was not found!'
    }))

    // User logout page
    users.get('/logout', authenticate, (req, res) => {
        res.render('user-logout', {
            layout: 'base',
            user: req.user
        })
    })

    // User post logout
    users.post('/logout', authenticate, (req, res) => {
        debug('Logged out user!')
        req.logout()
        res.redirect('/user/login')
    })

    // User get profile
    users.get('/profile', authenticate, (req, res) => {
        res.render('user-view', { user: req.user })
    })

    // User update-name page
    users.get('/update/name', authenticate, (req, res) => {
        res.render('user-update-name', { user: req.user })
    })

    // User update name
    users.post('/update/name', authenticate, (req, res) => {
        // Update name of user
        req.user.name = req.body.name
        req.user.save((err, updated) => {
            res.redirect('/user/profile')
        })
    })

    // User update password page
    users.get('/update/password', authenticate, (req, res) => {
        res.render('user-update-password', {
            user: req.user,
            error: req.flash('error')
        })
    })

    // User update password
    users.post('/update/password', authenticate, (req, res) => {
        // Update password of user
        let { old, new_, verify } = req.body
        req.user.localUpdatePassword(old, new_, verify, (err, updated) => {
            if (err) {
                req.flash('error', err.message)
                res.redirect('/user/update/password')
            } else {
                res.redirect('/user/profile')
            }
        })
    })

    // Return router
    return users
}
