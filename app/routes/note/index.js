/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import { Router } from 'express'
import Note from '../../models/note'
import { authenticate } from '../../passport'
import mongoose from 'mongoose'
import edit from './edit'
import deleteR from './delete'
import newR from './new'

// Debug
const debug = require('debug')('note-hemn:routes:note')

export default function noteRouter() {
    // Declare router
    let note = Router()

    // Param id
    note.param('id', (req, res) => {
        authenticate(req, res, () => {
            debug(`Finding param for id: ${id}...`)
            Note.findOne({
                user: req.user._id,
                _id: mongoose.Types.ObjectId(id)
            })
            .exec()
            .then(note => {
                req.note = note
                next()
            })
        })
    })

    // Note routes
    note.use('/:id/edit', edit())
    note.use('/:id/delete', deleteR())
    note.use('/new', newR())

    // Index route
    note.get('/', authenticate, (req, res) => {
        Note.find({
            user: req.user._id
        })
        .populate('labels')
        .exec()
        .then(notes => {
            res.render('note-index', {
                success: req.flash('success'),
                error: req.flash('error'),
                user: req.user,
                notes: notes
            })
        })
        .catch(err => {
            req.flash('error', err.message)
            res.render('note-index', {
                success: req.flash('success'),
                error: req.flash('error'),
                user: req.user,
                notes: notes
            })
        })
    })

    // Return router
    return note
}
