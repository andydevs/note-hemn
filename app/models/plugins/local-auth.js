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

// Debug
const debug = require('debug')('note-hemn:models:plugins:local-auth')

// Generate salt
const SALT = genSaltSync(BCRYPT_SALT_ROUNDS)

/**
 * Local auth plugin
 */
export default function localAuthPlugin(Schema, options) {
    // Signup new user using local strategy
    Schema.statics.localSignup = function(email, password, verify, cb) {
        if (password === verify) {
            hash(password, SALT, (err, passhash) => {
                debug('Hashed password')
                if (err) {
                    debug('Something bad happened!')
                    debug(err)
                    cb(err)
                }
                else this.findOne({ 'login.local.email': email }, (err, doc) => {
                    if (err) {
                        debug('Something bad happened!')
                        debug(err)
                        cb(err)
                    }
                    else if (doc) {
                        debug(`${this.modelName} already exists`)
                        cb(new Error(`${this.modelName} already exists!`))
                    }
                    else {
                        debug(`Creating new local login ${this.modelName}`)
                        this.create({
                            login: {
                                local: {
                                    email,
                                    passhash
                                }
                            }
                        }, cb)
                    }
                })
            })
        }
        else {
            cb(new Error('Password and verify do not match!'))
        }
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
