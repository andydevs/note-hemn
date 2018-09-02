/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import { hash, compare, genSaltSync } from 'bcryptjs'
import { BCRYPT_SALT_ROUNDS } from '../../consts'

// Promisified hash function
function hashP(password, salt) {
    return new Promise((resolve, reject) => {
        hash(password, salt, (err, passhash) => {
            if (err) reject(err)
            else resolve(passhash)
        })
    })
}

// Promisified compare function
function compareP(password, passhash) {
    return new Promise((resolve, reject) => {
        compare(password, passhash, (err, result) => {
            if (err) reject(err)
            else resolve(result)
        })
    });
}

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
            .then(doc => doc
                ? Promise.reject(new Error(`${this.modelName} already exists!`))
                : Promise.resolve())
            // Check if password !== verify
            .then(() => password !== verify)
            // If so, reject with error
            .then(result => result
                ? Promise.reject(new Error('Password and verify do not match!'))
                : Promise.resolve())
            // Hash password
            .then(() => hashP(password, SALT))
            // Create new user
            .then(passhash =>
                this.create({
                    login: {
                        local: {
                            email,
                            passhash
                        }
                    }
                }))
    }

    // Local login
    Schema.statics.localLogin = function(email, password, cb) {
        this.findOne({ 'login.local.email': email }, (err, doc) => {
            if (err) {
                debug('Something bad happened!')
                debug(err)
                cb(err)
            }
            else if (doc) {
                debug(`Found ${this.modelName}...`)
                doc.localValid(password, (err, valid) => {
                    if (err) {
                        debug('Something bad happened!')
                        debug(err)
                        cb(err)
                    }
                    else if (valid) {
                        debug('Password is valid!')
                        cb(null, doc)
                    }
                    else {
                        debug('Password is invalid!')
                        cb(null, false)
                    }
                })
            }
            else cb(null, false)
        })
    }

    // Check if local user is valid with password
    Schema.methods.localValid = function(password, cb) {
        compare(password, this.login.local.passhash, cb)
    }

    // Update password of user
    Schema.methods.localUpdatePassword = function(oldpass, password, verify, cb) {
        compare(oldpass, this.login.local.passhash, (err, valid) => {
            if (err) {
                debug('Some other error happened!')
                debug(err.message)
                cb(err)
            }
            else if (valid) {
                debug('Old password is valid!')
                if (password === verify) {
                    hash(password, SALT, (err, passhash) => {
                        if (err) {
                            debug('Something bad happened!')
                            debug(err)
                            cb(err)
                        }
                        else {
                            debug('Setting new password!')
                            this.login.local.passhash = passhash
                            this.save(cb)
                        }
                    })
                } else {
                    debug('Password and verify do not match!')
                    cb(new Error('Password and verify do not match!'))
                }
            } else {
                debug('Old password is invalid!')
                cb(new Error('Old password is invalid!'))
            }
        })
    }
}
