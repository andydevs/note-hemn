/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import { Router } from 'express'
import login from './login'
import signup from './signup'
import logout from './logout'

// Main router
export default function authRouter(passport) {
    // Debugger
    const debug = require('debug')('note-hemn:routes:auth')

    // Create router
    let auth = Router()

    // Add sub-routers
    auth.use('/login', login(passport))
    auth.use('/signup', signup())
    auth.use('/logout', logout())

    // Return auth
    return auth
}
