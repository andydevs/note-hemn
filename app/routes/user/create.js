/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import { Router } from 'express'

/**
 * Create router
 */
export default function createRouter() {
    // Debugger
    const debug = require('debug')('note-hemn:routes:user:create')

    // Create user router
    let create = Router()

    // User create view
    create.get('/', (req, res) => {
        res.render('user-create', {
            layout: 'form',
            error: req.flash('error'),
            user: req.user
        })
    })

    // User create post request
    create.post('/', (req, res) => {
        req.user.name = req.body.name
        req.user.save()
            .then(created => {
                req.flash('success', 'Welcome to Note HEMN!')
                res.redirect('/note')
            })
            .catch(err => {
                req.flash('error', err.message)
                res.redirect('/user/create')
            })
    })

    // Return router
    return create
}
