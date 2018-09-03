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
import { authenticate } from './auth'

// Debugger
const debug = require('debug')('note-hemn:routes:user')

/**
 * Users router
 */
export default function userRouter() {
    // Create user router
    let user = Router()

    // User get settings view
    user.get('/settings', authenticate, (req, res) => {
        res.render('user-settings', {
            success: req.flash('success'),
            error: req.flash('error'),
            user: req.user
        })
    })

    // User update name
    user.post('/update/name', authenticate, (req, res) => {
        // Update name of user
        req.user.name = req.body.name
        req.user.save()
            .then(updated => {
                debug(`Updated value: ${updated}`)
                req.flash('success', 'Successfully updated name!')
                res.redirect('/user/settings')
            })
            .catch(err => {
                req.flash('error', err.message)
                res.redirect('/user/settings')
            })
    })

    // User update password
    user.post('/update/password', authenticate, (req, res) => {
        // Update password of user
        let { old, new_, verify } = req.body
        req.user.localUpdatePassword(old, new_, verify)
            .then(updated => {
                debug(`Updated value: ${updated}`)
                req.flash('success', 'Successfully updated password!')
                res.redirect('/user/settings')
            })
            .catch(err => {
                debug(`Error value: ${err}`)
                req.flash('error', err.message)
                res.redirect('/user/settings')
            })
    })

    // Return router
    return user
}
