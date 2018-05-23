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
notes.get('/new', (req, res) => {
    res.render('note-form', { note: null, action: 'new' })
})

// Post new form
notes.post('/new', async (req, res) => {
    // Within mongoclient context
    await using(dbConnect, async client => {
        // Insert new note
        let result = await createNote(client, fromRequestBody(req.body))

        // Redirect back to home and close client
        res.redirect('/')
    })
})

// Get id route
notes.get('/:id', async (req, res) => {
    // Within mongoclient context
    await using(dbConnect, async client => {
        // Query for the note by the given id
        let note = await readNote(client, req.params.id)

        // Render note and close client
        res.render('note-view', note)
    })
})

// Get edit form
notes.get('/:id/edit', async (req, res) => {
    // Within mongoclient context
    await using(dbConnect, async client => {
        // Query for the note by the given id
        let note = await readNote(client, req.params.id)

        // Render note and close client
        res.render('note-form', { note: note, action: `${note._id}/edit` })
    })
})

// Post edit form
notes.post('/:id/edit', async (req, res) => {
    // Within mongoclient context
    await using(dbConnect, async client => {
        // Replace note
        let result = await updateNote(client,
            req.params.id,
            fromRequestBody(req.body))

        // Redirect back to home and close client
        res.redirect('/')
    })
})

// Note delete form
notes.get('/:id/delete', async (req, res) => {
    // Within mongoclient context
    await using(dbConnect, async client => {
        // Query for the note by the given id
        let note = await readNote(client, req.params.id)

        // Render note form
        res.render('note-delete', { note: note })
    })
})

// Delete note
notes.post('/:id/delete', async (req, res) => {
    // Within mongoclient context
    await using(dbConnect, async client => {
        // Delete note
        let result = await deleteNote(client, req.params.id)

        // Redirect back to home and close client
        res.redirect('/')
    })
})

// Export router
export default notes
