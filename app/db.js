/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import { MongoClient, ObjectId } from 'mongodb'
import {
    MONGO_URI,
    MONGO_DBNAME,
    MONGO_COLLEC_NOTES
} from './consts'

/**
 * Returns the notes collection in the given client
 *
 * @param {MongoClient} client mongo client to retrieve from
 *
 * @return {Collection} notes collection
 */
function notesCollection(client) {
    return client.db(MONGO_DBNAME)
        .collection(MONGO_COLLEC_NOTES)
}

/**
 * Connects to mongodb client
 *
 * @return {Promise<MongoClient>} mongodb client connection
 */
export function dbConnect() {
    return MongoClient.connect(MONGO_URI, {
        useNewUrlParser: true
    })
}

/**
 * Returns a mongodb filter for the given id to be used in querying
 *
 * @param {string} id the id to get
 *
 * @return {object} the mongo filter
 */
export function idFilter(id) {
    return { _id: ObjectId(id) }
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
 * @return {Promise<[CreateResult]>} result of creation
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
 * @return {Promise<[UpdateResult]>} result of updating
 */
export function updateNote(client, id, note) {
    return notesCollection(client)
        .replaceOne(idFilter(id), note)
}
