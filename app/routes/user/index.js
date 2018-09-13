/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import { Router } from 'express'
import create from './create'
import settings from './settings'

// Debugger
const debug = require('debug')('note-hemn:routes:user')

/**
 * Users router
 */
export default function userRouter() {
    // Create user router
    let user = Router()

    // User create route
    user.use('/create', create())
    user.use('/settings', settings())

    // Return router
    return user
}
