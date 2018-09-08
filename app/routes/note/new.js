/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import { Router } from 'express'
import Note from '../models/note'
import { authenticate } from '../passport'
import mongoose from 'mongoose'

// Debug
const debug = require('debug')('note-hemn:routes:note:new')

// Router
export default function newRouter() {
    // Declare router
    let newR = Router()

    // New note
    note.get('/', authenticate, (req, res) => {
        res.render('note-form', {
            user: req.user,
            action: 'new',
            note: null
        })
    })

    // Post new note
    note.post('/', authenticate, (req, res) => {
        let user = req.user
        let labels = req.body.labels.split(' ')
        let content = req.body.content
        Note.createWithLabels(user, labels, content)
            .then(note => {
                req.flash('success', 'Successfully created new note!')
                res.redirect('/note')
            })
            .catch(err => {
                req.flash('error', err.message)
                res.redirect('/note')
            })
    })

    return newR
}
