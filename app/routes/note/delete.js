/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import { Router } from 'express'
import Note from '../../models/note.js'
import mongoose from 'mongoose'

/**
 * Delete Router
 */
export default function deleteR() {
    // Debug
    const debug = require('debug')('note-hemn:routes:note:delete')

    // Declare router
    let deleteR = Router()

    // Delete page
    deleteR.get('/', (req, res) => {
        res.render('note-delete', {
            error: req.flash('error'),
            user: req.user,
            note: req.note
        })
    })

    // Post delete note
    deleteR.post('/', (req, res) => {
        req.note.remove()
            .then(rslt => {
                req.flash('success', 'Successfully deleted note!')
                res.redirect('/note')
            })
            .catch(err => {
                req.flash('error', err.message)
                res.redirect('/note')
            })
    })

    // Return router
    return deleteR
}
