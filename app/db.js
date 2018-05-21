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
    MONGO_COLLEC_NOTES,
    MONGO_COLLEC_USERS
} from './consts'

/**
 * Returns the users collection in the given client
 *
 * @param {MongoClient} client mongo client to retrieve from
 *
 * @return {Collection} users collection
 */
export function usersCollection(client) {
    return client.db(MONGO_DBNAME)
        .collection(MONGO_COLLEC_USERS)
}

/**
 * Returns the notes collection in the given client
 *
 * @param {MongoClient} client mongo client to retrieve from
 *
 * @return {Collection} notes collection
 */
export function notesCollection(client) {
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
