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
const debug = require('debug')('note-hemn:routes:user')

/**
 * Users router
 */
export default function userRouter() {
    // Create user router
    let user = Router()

    // User get profile
    user.get('/profile', authenticate, (req, res) => {
        res.render('user-view', { user: req.user })
    })

    // User update-name page
    user.get('/update/name', authenticate, (req, res) => {
        res.render('user-update-name', { user: req.user })
    })

    // User update name
    user.post('/update/name', authenticate, (req, res) => {
        // Update name of user
        req.user.name = req.body.name
        req.user.save((err, updated) => {
            res.redirect('/user/profile')
        })
    })

    // User update password page
    user.get('/update/password', authenticate, (req, res) => {
        res.render('user-update-password', {
            user: req.user,
            error: req.flash('error')
        })
    })

    // User update password
    user.post('/update/password', authenticate, (req, res) => {
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
    return user
}
