/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import { Router } from 'express'
import { dbConnect, using } from '../db'
import authenticate from '../authenticate'
import {
    fromRequestBody,
    createNote,
    readNote,
    updateNote,
    deleteNote
} from '../models/note'

// Define Express router
var notes = Router()

// Get new form
notes.get('/new', authenticate, (req, res) => {
    res.render('note-form', { note: null, action: 'new' })
})

// Post new form
notes.post('/new', authenticate, async (req, res) => {
    // Within mongoclient context
    await using(dbConnect, async client => {
        // Insert new note
        let result = await createNote(
            client,
            req.session.user,
            fromRequestBody(req.body))

        // Redirect back to home and close client
        res.redirect('/')
    })
})

// Get id route
notes.get('/:id', authenticate, async (req, res) => {
    // Within mongoclient context
    await using(dbConnect, async client => {
        // Query for the note by the given id
        let note = await readNote(client,
            req.session.user,
            req.params.id)

        // Render note and close client
        res.render('note-view', {
            ...note,
            user: req.session.user})
    })
})

// Get edit form
notes.get('/:id/edit', authenticate, async (req, res) => {
    // Within mongoclient context
    await using(dbConnect, async client => {
        // Query for the note by the given id
        let note = await readNote(client,
            req.session.user,
            req.params.id)

        // Render note and close client
        res.render('note-form', {
            user: req.session.user,
            note: note,
            action: `${note._id}/edit`
        })
    })
})

// Post edit form
notes.post('/:id/edit', authenticate, async (req, res) => {
    // Within mongoclient context
    await using(dbConnect, async client => {
        // Replace note
        let result = await updateNote(client,
            req.params.id,
            req.session.user,
            fromRequestBody(req.body))

        // Redirect back to home and close client
        res.redirect('/')
    })
})

// Note delete form
notes.get('/:id/delete', authenticate, async (req, res) => {
    // Within mongoclient context
    await using(dbConnect, async client => {
        // Query for the note by the given id
        let note = await readNote(client,
            req.session.user,
            req.params.id)

        // Render note form
        res.render('note-delete', { note: note })
    })
})

// Delete note
notes.post('/:id/delete', authenticate, async (req, res) => {
    // Within mongoclient context
    await using(dbConnect, async client => {
        // Delete note
        let result = await deleteNote(client,
            req.session.user,
            req.params.id)

        // Redirect back to home and close client
        res.redirect('/')
    })
})

// Export router
export default notes
