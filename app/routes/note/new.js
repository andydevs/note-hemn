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
import mongoose from 'mongoose'

/**
 * New Router
 */
export default function newRouter() {
    // Debug
    const debug = require('debug')('note-hemn:routes:note:new')

    // Declare router
    let newR = Router()

    // New note
    newR.get('/', (req, res) => {
        res.render('note-form', {
            user: req.user,
            action: 'new',
            note: null
        })
    })

    // Post new note
    newR.post('/', (req, res) => {
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
