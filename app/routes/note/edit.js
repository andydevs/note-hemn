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
 * Edit Router
 */
export default function editRouter() {
    // Debug
    const debug = require('debug')('note-hemn:routes:note:edit')

    // Declare router
    let edit = Router()

    // Edit page
    edit.get('/', (req, res) => {
        res.render('note-form', {
            error: req.flash('error'),
            user: req.user,
            action: `${req.note.id}/edit`,
            note: req.note
        })
    })

    // Post edit note
    edit.post('/', (req, res) => {
        let labels = req.body.labels.split(' ')
        let content = req.body.content
        req.note.updateLabels(labels)
            .then(() => {
                req.note.content = content
                return req.note.save()
            })
            .then(() => {
                req.flash('success', 'Successfully updated note!')
                res.redirect('/note')
            })
            .catch(err => {
                req.flash('error', err.message)
                res.redirect('/note')
            })
    })

    // Return router
    return edit
}
