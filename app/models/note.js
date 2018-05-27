/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import {
    notesCollection,
    idFilter,
    userIdFilter
} from '../db'

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
export function indexNotes(client, user) {
    return notesCollection(client)
        .find({ user: user._id }).toArray()
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
export function readNote(client, user, id) {
    return notesCollection(client)
        .find(userIdFilter(user, id))
        .limit(1).next()
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
export function createNote(client, user, note) {
    return notesCollection(client)
        .insertOne({
            user: user._id,
            labels: note.labels,
            content: note.content
        })
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
export function updateNote(client, user, id, note) {
    return notesCollection(client)
        .updateOne(userIdFilter(user, id), { $set : note })
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
