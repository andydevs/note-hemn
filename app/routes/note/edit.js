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

// Debug
const debug = require('debug')('note-hemn:routes:note:edit')

// Router
export default function editRouter() {
    // Declare router
    let edit = Router()

    // Edit page
    edit.get('/', (req, res) => {
        res.render('note-form', {
            error: req.flash('error'),
            user: req.user,
            action: `${req.params.id}/edit`,
            note: req.note
        })
    })

    // Post edit note
    edit.post('/', (req, res) => {
        let labels = req.body.labels.split(' ')
        let content = req.body.content
        req.note.updateLabels(labels)
            .then(() => {
                note.content = content
                return note.save()
            })
    })

    // Return router
    return edit
}
