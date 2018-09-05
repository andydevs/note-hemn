/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import { Router } from 'express'

// Login router
export default function loginRouter(passport) {
    // Debugger
    const debug = require('debug')('note-hemn:routes:auth:login')

    // Create router
    let login = Router()

    // Get page
    login.get('/', (req, res) => {
        res.render('auth-login', {
            layout: 'form',
            error: req.flash('error')
        })
    })

    // Local authentication
    login.post('/local', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: 'User was not found!'
    }))

    // Return router
    return login
}
