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
import mongoose from 'mongoose'

// Debug
const debug = require('debug')('note-hemn:routes:note')

export default function noteRouter() {
    // Declare router
    let note = Router()

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

    // New note
    note.get('/new', authenticate, (req, res) => {
        res.render('note-form', {
            user: req.user,
            action: 'new',
            note: null
        })
    })

    // Post new note
    note.post('/new', authenticate, (req, res) => {
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

    // Edit route
    note.get('/:id/edit', authenticate, (req, res) => {
        Note.findOne({
            user: req.user._id,
            _id: mongoose.Types.ObjectId(req.params.id)
        })
        .populate('labels')
        .exec()
        .then(note => {
            res.render('note-form', {
                error: req.flash('error'),
                user: req.user,
                action: `${req.params.id}/edit`,
                note: note
            })
        })
        .catch(err => {
            req.flash('error', err.message)
            res.render('note-form', {
                error: req.flash('error'),
                user: req.user,
                action: `${req.params.id}/edit`,
                note: note
            })
        })
    })

    // Edit post request
    note.post('/:id/edit', authenticate, (req, res) => {
        let user = req.user
        let id = req.params.id
        let labels = req.body.labels.split(' ')
        let content = req.body.content
        Note.updateWithLabels(user, id, labels, content)
            .then(rslt => {
                req.flash('success', 'Successfully edited note!')
                res.redirect('/note')
            })
            .catch(err => {
                req.flash('error', err.message)
                res.redirect('/note')
            })
    })

    // Delete route
    note.get('/:id/delete', authenticate, (req, res) => {
        Note.findOne({
            user: req.user._id,
            _id: mongoose.Types.ObjectId(req.params.id)
        })
        .populate('labels')
        .exec()
        .then(note => {
            res.render('note-delete', {
                error: req.flash('error'),
                user: req.user,
                note: note
            })
        })
        .catch(err => {
            req.flash('error', err.message)
            res.render('note-delete', {
                error: req.flash('error'),
                user: req.user,
                note: note
            })
        })
    })

    // Post delete note
    note.post('/:id/delete', authenticate, (req, res) => {
        Note.findOneAndDelete({
            user: req.user,
            _id: mongoose.Types.ObjectId(req.params.id)
        })
        .exec()
        .then(rslt => {
            req.flash('success', 'Successfully deleted note!')
            res.redirect('/note')
        })
        .catch(err => {
            req.flash('error', err.message)
            res.redirect('/note')
        })
    })

    // Return router
    return note
}
