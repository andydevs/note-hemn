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
    idFilter
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
  *
  * @return {Promise<[Note]>} note array
  */
 export function indexNotes(client) {
     return notesCollection(client)
         .find({}).toArray()
 }

 /**
  * Returns the note specified by the given id in the database
  *
  * @param {MongoClient} client the mongo client to connect to
  * @param {string} id the id of the note to retrieve
  *
  * @return {Promise<Note>} the note associated with the given id
  */
 export function readNote(client, id) {
     return notesCollection(client)
         .find(idFilter(id)).limit(1).next()
 }

 /**
  * Creates a new note in the database
  *
  * @param {MongoClient} client mongo client to create in
  * @param {Note} note the note to create
  *
  * @return {Promise<CreateResult>} result of creation
  */
 export function createNote(client, note) {
     return notesCollection(client)
         .insertOne(note)
 }

 /**
  * Updates the note of the given id with the given new note info
  *
  * @param {MongoClient} client mongo client to update in
  * @param {string} id the id of the note to update
  * @param {Note} note the new note to update to
  *
  * @return {Promise<UpdateResult>} result of updating
  */
 export function updateNote(client, id, note) {
     return notesCollection(client)
         .replaceOne(idFilter(id), note)
 }

 /**
  * Deletes the note of the given id from the database
  *
  * @param {MongoClient} client mongo client to delete
  * @param {string} id the id of the note to delete
  *
  * @return {Promise<DeleteResult>} result of deleting
  */
 export function deleteNote(client, id) {
     return notesCollection(client)
         .deleteOne(idFilter(id))
 }
