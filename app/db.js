/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import { MongoClient, ObjectId } from 'mongodb'
import { MONGO_URI, MONGO_DBNAME, MONGO_COLLEC_NOTES } from './consts'

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
