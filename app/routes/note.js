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

export default function noteRouter() {
    // Declare router
    let note = Router()

    // Index route
    note.get('/', authenticate, (req, res) => {
        Note.find({ user: req.user._id }, (err, notes) => {
            if (err) req.flash('error', err.message)
            res.render('index', {
                error: req.flash('error'),
                user: req.user,
                notes: notes
            })
        })
    })

    // View route
    note.get('/:id', authenticate, (req, res) => {
        Note.findOne({
            user: req.user._id,
            _id: req.params.id
        }, (err, note) => {
            if (err) req.flash('error', err.message)
            res.render('note-view', {
                error: req.flash('error'),
                user: req.user,
                note: note
            })
        })
    })

    // Return router
    return note
}
