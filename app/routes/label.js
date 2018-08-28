/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import { Router } from 'express'
import Label from '../models/label.js'
import { authenticate } from './auth'
import mongoose from 'mongoose'

// Debug
const debug = require('debug')('note-hemn:routes:label')

export default function labelRouter() {
    let label = Router()

    // Index route
    label.get('/', authenticate, (req, res) => {
        Label.find({
            user: req.user._id
        })
        .exec((err, labels) => {
            if (err) req.flash('error', err.message)
            res.render('label-index', {
                error: req.flash('error'),
                user: req.user,
                labels: labels
            })
        })
    })

    return label
}
