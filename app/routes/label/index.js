/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import { Router } from 'express'
import Label from '../../models/label'
import mongoose from 'mongoose'
import edit from './edit'
import deleteR from './delete'

// Label router
export default function labelRouter() {
    // Debug
    const debug = require('debug')('note-hemn:routes:label')

    // Declare router
    let label = Router()

    // Declare param id
    label.param('id', (req, res, next, id) => {
        debug(`Finding param for id: ${id}...`)
        Label.findOne({
            user: req.user._id,
            _id: mongoose.Types.ObjectId(id)
        })
        .exec()
        .then(label => {
            req.label = label
            next()
        })
    })

    // Add routes
    label.use('/:id/edit', edit())
    label.use('/:id/delete', deleteR())

    // Index route
    label.get('/', (req, res) => {
        Label.find({
            user: req.user._id
        })
        .exec()
        .then(labels => {
            res.render('label-index', {
                error: req.flash('error'),
                user: req.user,
                labels: labels
            })
        })
        .catch(err => {
            req.flash('error', err.message)
            res.render('label-index', {
                error: req.flash('error'),
                user: req.user,
                labels: labels
            })
        })
    })

    // Return router
    return label
}
