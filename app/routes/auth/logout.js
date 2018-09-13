/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import { Router } from 'express'
import { authenticate } from '../../passport'

/**
 * Logout router
 */
export default function logoutRouter() {
    // Debugger
    const debug = require('debug')('note-hemn:routes:auth:logout')

    // Create router
    let logout = Router()

    // Get page
    logout.get('/', authenticate, (req, res) => {
        res.render('auth-logout', {
            layout: 'form',
            user: req.user
        })
    })

    // Post logout command
    logout.post('/', authenticate, (req, res) => {
        debug('Logged out user!')
        req.logout()
        res.redirect('/auth/login')
    })

    // Return router
    return logout
}
