/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import {
    hash,
    compare,
    genSaltSync
} from 'bcryptjs'
import {
    BCRYPT_SALT_ROUNDS
} from '../../consts'
import {
    promisified,
    resolveIfTrue,
    rejectIfTrue
} from '../../promise-helpers'

// Promisified hash and compare functions
const hashP = promisified(hash)
const compareP = promisified(compare)

// Debug
const debug = require('debug')('note-hemn:models:plugins:local-auth')

// Generate salt
const SALT = genSaltSync(BCRYPT_SALT_ROUNDS)

/**
 * Local auth plugin
 */
export default function localAuthPlugin(Schema, options) {
    // Signup new user using local strategy
    Schema.statics.localSignup = function(email, password, verify) {
        // Check if user exists
        return this.findOne({ 'login.local.email': email }).exec()
            // If so, reject with error
            .then(rejectIfTrue(`${this.modelName} already exists!`))
            // Check if password === verify
            .then(() => password === verify)
            // If so, resolve, else reject with error
            .then(resolveIfTrue('Password and verify do not match!'))
            // Hash password
            .then(() => hashP(password, SALT))
            // Create new user
            .then(passhash => this.create({
                login: { local: { email, passhash } }
            }))
    }

    // Local login
    Schema.statics.localLogin = function(email, password) {
        // Find user by email
        return this.findOne({ 'login.local.email': email }).exec()
            .then(doc => doc
                // Validate password if doc exists
                ? doc.localValid(password).then(valid => valid ? doc : false)
                // Return false
                : Promise.resolve(false))
    }

    // Check if local user is valid with password
    Schema.methods.localValid = function(password) {
        return compareP(password, this.login.local.passhash)
    }

    // Update password of user
    Schema.methods.localUpdatePassword = function(oldpass, password, verify) {
        // Check old password
        return this.localValid(oldpass)
            // Resolve if valid (else reject with error)
            .then(resolveIfTrue('Old password is invalid'))
            // Compare password and verify
            .then(() => password === verify)
            // Resolve if valid (else reject with error)
            .then(resolveIfTrue('Password and verify do not match!'))
            // Hash password
            .then(() => hashP(password, SALT))
            // Set passhash in local and save
            .then(passhash => {
                this.login.local.passhash = passhash
                return this.save()
            })
    }
}
