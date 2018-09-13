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

// Edit router
export default function editRouter() {
    // Declare debug
    const debug = require('debug')('note-hemn:routes:label:edit')

    // Declare router
    let edit = Router()

    // Get page
    edit.get('/', (req, res) => {
        debug(`Getting label for id: ${req.label._id}`)
        res.render('label-form', {
            error: req.flash('error'),
            user: req.user,
            label: req.label
        })
    })

    // Post command
    edit.post('/', (req, res) => {
        debug(`Updating label for id: ${req.label._id}`)
        req.label.name = req.body.name
        req.label.color = req.body.color
        req.label.save()
            .then(label => {
                res.redirect('/label')
            })
            .catch(err => {
                req.flash('error', err.message)
                res.redirect('/label')
            })
    })

    // Return router
    return edit
}
