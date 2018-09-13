/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import { Router } from 'express'
import Label from '../../models/label.js'
import mongoose from 'mongoose'

/**
 * Delete router
 */
export default function deleteRouter() {
    // Declare debug
    const debug = require('debug')('note-hemn:routes:label:deleteR')

    // Declare router
    let deleteR = Router()

    // Delete route
    deleteR.get('/', (req, res) => {
        res.render('label-delete', {
            error: req.flash('error'),
            user: req.user,
            label: req.label
        })
    })

    // Delete post route
    deleteR.post('/', (req, res) => {
        req.label.updateNotesAndDelete()
             .then(result => {
                 res.redirect('/label')
             })
             .catch(err => {
                 req.flash('error', err.message)
                 res.redirect('/label')
             })
    })

    // Return router
    return deleteR
}
