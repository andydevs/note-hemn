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
    // Declare router
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

    // Edit route
    label.get('/:id/edit', authenticate, (req, res) => {
        Label.findOne({
            _id: mongoose.Types.ObjectId(req.params.id),
            user: req.user._id
        })
        .exec((err, label) => {
            if (err) req.flash('error', err.message)
            res.render('label-form', {
                error: req.flash('error'),
                user: req.user,
                label: label
            })
        })
    })

    // Edit post route
    label.post('/:id/edit', authenticate, (req, res) => {
        Label.findOneAndUpdate({
            _id: mongoose.Types.ObjectId(req.params.id),
            user: req.user._id
        }, {
            name: req.body.name
        })
        .exec((err, label) => {
            if (err) req.flash('error', err.message)
            res.redirect('/label')
        })
    })

    // Delete route
    label.get('/:id/delete', authenticate, (req, res) => {
        Label.findOne({
            _id: mongoose.Types.ObjectId(req.params.id),
            user: req.user._id
        })
        .exec((err, label) => {
            if (err) req.flash('error', err.message)
            res.render('label-delete', {
                error: req.flash('error'),
                user: req.user,
                label: label
            })
        })
    })

    // Delete post route
    label.post('/:id/delete', authenticate, (req, res) => {
        Label.updateNotesAndDelete(req.user, req.params.id, (err, result) => {
            if (err) req.flash('error', err.message)
            res.redirect('/label')
        })
    })

    // Return router
    return label
}
