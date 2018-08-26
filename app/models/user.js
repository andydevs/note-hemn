/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import mongoose from 'mongoose'
import localAuthPlugin from './plugins/local-auth';

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
