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
import { usersCollection } from '../db'

// Generate salt
const SALT = genSaltSync(BCRYPT_SALT_ROUNDS)

/**
 * Set given user in session and redirect back to home
 *
 * @param {express.Request} req request object
 * @param {express.Response} res response object
 * @param {User} user user to set in session
 */
export function setSessionAndRedirect(req, res, user) {
    req.session.user = user
    res.redirect('/')
}

/**
 * Returns true if the given user signup is valid
 *
 * @param {object} user the object to validate
 *
 * @return true if the object is a valid user signup
 */
export function validUserSignup(user) {
    return user.email
        && user.name
        && user.password
        && user.verify
        && user.password === user.verify;
}

/**
 * Hashes password within user signup info
 *
 * @param {UserSignup} user user signup info
 *
 * @return {UserSignupHashed} user signup with hashed password
 */
export function hashUserSignupPassword(user) {
    return hash(user.password, SALT)
        .then(passhash => ({
            name: user.name,
            email: user.email,
            passhash: passhash
        }))
}

/**
 * Signs up the given user
 *
 * @param {MongoClient} client the mongo client to signup
 * @param {User} the user to signup
 *
 * @return {Promise<User>} result user from signup
 */
export function signupUser(client, user) {
    return usersCollection(client)
        .insertOne(user)
        .then(res => res.result.ok ? res.ops[0] : null)
}

/**
 * Returns user for the given email
 *
 * @param {MongoClient} client the mongo client to retrieve from
 * @param {string} email the email to retrieve
 *
 * @return {Promise<User>} user from email
 */
export function getUserByEmail(client, email) {
    return usersCollection(client)
        .find({ email: email })
        .limit(1)
        .next()
}

/**
 * Compares the given password with the passhash stored
 * in the actual user
 *
 * @param {object} login user login info
 * @param {User} user user to compare to
 *
 * @return {Promise<Boolean>} true if the password matches the passhash
 */
export function compareUserPassword(login, user) {
    return compare(login.password, user.passhash)
}
