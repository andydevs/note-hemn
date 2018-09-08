/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import { Router } from 'express'
import Note from '../models/note.js'
import { authenticate } from '../passport'
import mongoose from 'mongoose'

// Debug
const debug = require('debug')('note-hemn:routes:note:delete')

// Router
export default function deleteR() {
    // Declare router
    let deleteR = Router()

    // Delete page
    note.get('/', authenticate, (req, res) => {
        res.render('note-delete', {
            error: req.flash('error'),
            user: req.user,
            note: req.note
        })
    })

    // Post delete note
    note.post('/', authenticate, (req, res) => {
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
