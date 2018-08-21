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
import mongoose from 'mongoose'

// Debug
const debug = require('debug')('note-hemn:model:user');

// Generate salt
const SALT = genSaltSync(BCRYPT_SALT_ROUNDS)

// User schema
let User = new mongoose.Schema({
    login: {
        local: {
            email: String,
            passhash: String
        }
    },
    name: String
})

// Signup new user using local strategy
User.statics.localSignup = function(name, email, password, verify, cb) {
    if (password === verify) hash(password, SALT, (err, passhash) => {
        debug('Hashed password')
        if (err) cb(err)
        else this.find({ 'login.local.email': email }, (err, user) => {
            if (err) cb(err)
            else if (user) {
                debug('User already exists')
                cb(new Error('User already exists!'))
            } else
                this.create({
                    login: {
                        local: {
                            email,
                            passhash
                        }
                    },
                    name
                }, cb)
        })
    })
    else cb(new Error('Password and verify do not match!'))
}

// Local login
User.statics.localLogin = function(email, password, cb) {
    this.findOne({ 'login.local.email': email }, (err, user) => {
        if (err) cb(err)
        else if (user) {
            debug('Found user...')
            user.localValid(password, (err2, valid) => {
                if (err2) cb(err2)
                else if (valid) cb(null, user)
                else cb(new Error('User was not found!'))
            })
        }
        else cb(new Error('User was not found!'))
    })
}

// Check if local user is valid with password
User.methods.localValid = function(password, cb) {
    compare(password, this.login.local.passhash, cb)
}

// Export new User
export default mongoose.model('User', User)
