/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import { notesCollection, idFilter, userIdFilter } from '../db'
import {
    getLabelByName,
    getLabelById,
    createLabelWithRandomColor
} from './label'

/**
 * Converts a list of label names into a list of new label documents
 *
 * @param {MongoClient} client client to find labels in
 * @param {User} user user to find labels from
 * @param {[string]} labels list of label names
 *
 * @return {Promise<[Label]>} list of label documents
 */
async function labelMongoDocsFromNames(client, user, labels) {
    // Convert label names into label documents
    let labeldocs = []
    for (let label of labels) {
        // Check if label exsits
        let doc = await getLabelByName(client, user, label)

        // If it does just push it to the docs list
        if (doc) labeldocs.push(doc)
        else {
            // Create new doc and push to array
            let doc = await createLabelWithRandomColor(client, user, label)
            labeldocs.push(doc)
        }
    }

    // Return document ids
    return labeldocs.map(doc => doc._id)
}

/**
* Converts a list of label ids into a list of new label documents
*
* @param {MongoClient} client client to find labels in
* @param {User} user user to find labels from
* @param {[string]} labels list of label ids
*
* @return {Promise<[Label]>} list of label documents
 */
async function labelMongoDocsFromIds(client, user, labels) {
    // Convert label names into label documents
    let labeldocs = []
    for (let label of labels) {
        // Find label by id
        let doc = await getLabelById(client, user, label)

        // Push it to the docs list
        labeldocs.push(doc)
    }

    // Return documents
    return labeldocs
}

/**
 * Returns the note parsed from the request body
 *
 * @param {object} body request body
 *
 * @return {Note} note parsed from request body
 */
export function fromRequestBody(body) {
    return {
        labels: body.labels.split(/\s+/),
        content: body.content
    }
}

 /**
  * Returns the list of notes in the database
  *
  * @param {MongoClient} client mongo client to retrieve from
  * @param {User} user the user to index notes for
  *
  * @return {Promise<[Note]>} note array
  */
export async function indexNotes(client, user) {
    // Get notes from collection
    let notes = await notesCollection(client)
        .find({ user: user._id }).toArray()

    // Populate label info for all notes
    for (var note of notes) {
        let labeldocs = await labelMongoDocsFromIds(client, user, note.labels)
        note.labels = labeldocs
    }

    // Return notes
    return notes
}

 /**
  * Returns the note specified by the given id in the database
  *
  * @param {MongoClient} client the mongo client to connect to
  * @param {User} user the user to find notes for
  * @param {string} id the id of the note to retrieve
  *
  * @return {Promise<Note>} the note associated with the given id
  */
export async function readNote(client, user, id) {
    // Get note from client
    let note = await notesCollection(client)
        .find(userIdFilter(user, id))
        .limit(1).next()

    // Get list of full label documents and set in note
    if (note) {
        let labeldocs = await labelMongoDocsFromIds(client, user, note.labels)
        note.labels = labeldocs
    }

    // Return note
    return note
}

 /**
  * Creates a new note in the database
  *
  * @param {MongoClient} client mongo client to create in
  * @param {User} user the user to create a note with
  * @param {Note} note the note to create
  *
  * @return {Promise<CreateResult>} result of creation
  */
export async function createNote(client, user, note) {
    // Create/Get label documents
    let labeldocs = await labelMongoDocsFromNames(client, user, note.labels)

    // Insert note with label documents
    let insertResult = notesCollection(client)
        .insertOne({
            user: user._id,
            labels: labeldocs,
            content: note.content
        })

    // Return create result
    return insertResult
}

 /**
  * Updates the note of the given id with the given new note info
  *
  * @param {MongoClient} client mongo client to update in
  * @param {User} user the user to update notes with
  * @param {string} id the id of the note to update
  * @param {Note} note the new note to update to
  *
  * @return {Promise<UpdateResult>} result of updating
  */
export async function updateNote(client, user, id, note) {
    // Create/Get label documents
    let labeldocs = await labelMongoDocsFromNames(client, user, note.labels)

    // Update note
    let result = await notesCollection(client)
        .updateOne(userIdFilter(user, id), { $set : {
            labels : labeldocs,
            content: note.content
        }})

    // Return result of update
    return result
}

 /**
  * Deletes the note of the given id from the database
  *
  * @param {MongoClient} client mongo client to delete
  * @param {User} user the user to delte notes in
  * @param {string} id the id of the note to delete
  *
  * @return {Promise<DeleteResult>} result of deleting
  */
export function deleteNote(client, user, id) {
    return notesCollection(client)
        .deleteOne(userIdFilter(user, id))
}
