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
import localAuthPlugin from './plugins/local-auth';

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

// Apply login plugins
User.plugin(localAuthPlugin, {})

// Export new User
export default mongoose.model('User', User)
