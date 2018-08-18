/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import {
    labelsCollection,
    userIdFilter
} from '../db'
import { LABEL_COLORS } from '../consts'

/**
 * Generate random color for new label
 *
 * @return {string} random color name
 */
function randomColor() {
    return LABEL_COLORS[Math.floor(Math.random()*LABEL_COLORS.length)]
}

/**
 * Returns the given label in the given user label collection by the given id
 *
 * @param {MongoClient} client the mongo client to get label in
 * @param {User} user the user to find labels for
 * @param {stirng} id the id of the label to find
 *
 * @return {Promise<Label>} the label of the given name
 */
export function getLabelById(client, user, id) {
    return labelsCollection(client)
        .find({ user: user._id, _id: id })
        .limit(1)
        .next()
}

/**
 * Returns the given label in the given user label collection by the given name
 *
 * @param {MongoClient} client the mongo client to get label in
 * @param {User} user the user to find labels for
 * @param {stirng} name the name of the label to find
 *
 * @return {Promise<Label>} the label of the given name
 */
export function getLabelByName(client, user, name) {
    return labelsCollection(client)
        .find({ user: user._id, name: name })
        .limit(1)
        .next()
}

/**
 * Creates a new label with a random color and the given name.
 *
 * @param {MongoClient} client the client to create the label in
 * @param {User} user the user to create the label for
 * @param {string} name the name of the label
 *
 * @return {Promise<Label>} the inserted label
 */
export async function createLabelWithRandomColor(client, user, name) {
    // Insert new label
    let insert = await labelsCollection(client)
        .insertOne({
            user: user._id,
            name: name,
            color: randomColor()
        })

    // Return
    return insert.result.ok ? insert.ops[0] : null
}
