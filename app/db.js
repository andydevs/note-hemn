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
    return client.db(MONGO_DBNAME)
        .collection(MONGO_COLLEC_NOTES)
        .find({}).toArray()
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
    return client.db(MONGO_DBNAME)
        .collection(MONGO_COLLEC_NOTES)
        .insertOne(note)
}
