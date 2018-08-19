/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import { genSaltSync, hash, compare } from 'bcryptjs'
import { BCRYPT_SALT_ROUNDS } from '../consts'
import { usersCollection, idFilter } from '../db'

// Debug
const debug = require('debug')('note-hemn:models:user')

// Generate salt
const SALT = genSaltSync(BCRYPT_SALT_ROUNDS)

/**
 * Returns user by email
 *
 * @param {MongoClient} client the mongo client to check
 * @param {string} email the email to check
 *
 * @return {Promise<User>} result user from email
 */
function getUserByEmail(client, email) {
    return usersCollection(client)
        .find({ email: email }).limit(1).next()
}

/**
 * Set given user in session and redirect back to home
 *
 * @param {express.Request} req request object
 * @param {express.Response} res response object
 * @param {User} user user to set in session
 */
export function setSessionAndRedirect(req, res, user) {
    debug('Setting user in session...')
    debug(user)
    req.session.user = user
    res.redirect('/')
}

/**
 * Returns the user for the given login information (or null)
 *
 * @param {MongoClient} client the mongo client to login in
 * @param {Login} login user login information
 *
 * @return {Promise<User>} result user from login
 */
export async function loginUser(client, login) {
    // Extract info needed from login
    let { email, password } = login

    // Find user and check password
    let user = await getUserByEmail(client, email)

    // If user exists
    if (user) {
        // Compare password
        let valid = await compare(password, user.passhash)

        // Return user if password matches (else null)
        return valid ? user : null
    }
    // Else just return null
    else return null
}

/**
 * Signs up the given user
 *
 * @param {MongoClient} client the mongo client to signup
 * @param {User} the user to signup
 *
 * @return {Promise<User>} result user from signup
 */
export async function signupUser(client, signup) {
    // Extract info needed from signup
    let { name, email, password, verify } = signup

    // Get user if it exists
    let user = await getUserByEmail(client, email)

    // If user already exists
    if (user) {
        // Return user exists error
        return {
            unmatch: false,
            error: false,
            exists: true,
            user: null
        }
    }
    // If password and verify match
    else if (password === verify) {
        // Hash password and insert user with passhash
        let passhash = await hash(signup.password, SALT)
        let mongoresult = await usersCollection(client)
            .insertOne({
                name: name,
                email: email,
                passhash: passhash })

        // Return result of operation
        return {
            unmatch: false,
            error: !mongoresult.result.ok,
            exists: false,
            user: mongoresult.ops[0]
        }
    }
    // Else return unmatch result
    else return {
        unmatch: true,
        error: false,
        exists: false,
        user: null
    }
}

/**
 * Updates the name of the given user to the given name
 *
 * @param {MongoClient} client the mongo client to update in
 * @param {User} user the user to update
 * @param {UpdateName} updateName the name to set
 *
 * @return {Promise<UpdateNameResult>} result of update
 */
export async function updateNameOfUser(client, user, updateName) {
    // Get name from updateName
    let { name } = name

    // Update user with id in database
    let update = await usersCollection(client)
        .updateOne(idFilter(user._id), { $set : { name: name } })

    // If update successful
    if (update.result.ok) {
        // Get user by id from database
        let user = await usersCollection(client)
            .find(idFilter(user._id))
            .limit(1).next()

        // Return user in result
        return { error: false, user: user }

    // Else return error in result
    } else return { error: true, user: null }
}

/**
 * Updates the password in the user
 *
 * @param {MongoClient} client the client to update in
 * @param {User} user the user to update
 * @param {UpdatePassword} updatePassword password info to update
 *
 * @return {Promise<UpdatePasswordResult>} result of operation
 */
export async function updatePasswordOfUser(client, user, updatePassword) {
    // Get old, new_, and verify from updatePassword
    let { old, new_, verify } = updatePassword

    // Check if old password matches
    let oldMatches = await compare(old, user.passhash)
    if (!oldMatches) return {
        user: null,
        invalid: true,
        unmatch: false,
        error: false
    }

    // Check if new password matches verify
    if (new_ !== verify) return {
        user: null,
        invalid: false,
        unmatch: true,
        error: false
    }

    // Hash new password
    let new_hash = await hash(new_, SALT)

    // Perform update action
    let update = await usersCollection(client)
        .updateOne(idFilter(user._id), { $set: { passhash: new_hash } })

    // If update was successful
    if (update.result.ok) {
        // Get user by id from database
        let updatedUser = await usersCollection(client)
            .find(idFilter(user._id))
            .limit(1)
            .next()

        // Return user in status
        return {
            user: updatedUser,
            invalid: false,
            unmatch: false,
            error: false }
    // Else return error
    } else return {
        user: null,
        invalid: false,
        unmatch: false,
        error: true }
}
