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
    MONGO_COLLEC_USERS,
    MONGO_COLLEC_LABELS
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
 * Returns the labels collection in the given client
 *
 * @param {MongoClient} client mongo client to retrieve from
 *
 * @return {Collection} notes collection
 */
export function labelsCollection(client) {
    return client.db(MONGO_DBNAME)
        .collection(MONGO_COLLEC_LABELS)
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
 * Returns a mongodb filter for the given id and given user
 * to be used in querying
 *
 * @param {User} user the user to filter by
 * @param {string} id the id to get
 *
 * @return {object} the mongo filter
 */
export function userIdFilter(user, id) {
    return { user: user._id, _id: ObjectId(id) }
}

/**
 * Runs the callback exposing the given closable asyncronous context
 * object. If an error is thrown, ensures that context is closed before
 * error gets thrown outside context
 *
 * @param {Function} contextConstructor constructs a context asyncronously
 * @param {Function} callback block to execute within context
 */
export async function using(contextConstructor, callback) {
    // Context handler
    let context;

    try {
        // Construct context, run callback with it, and then close it
        context = await contextConstructor()
        await callback(context)
        context.close()
    }
    catch (error) {
        // Ensure context is closed before returning error
        if (context) context.close()
        throw error
    }
}
