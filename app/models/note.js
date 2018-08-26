/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import mongoose from 'mongoose'

// Note schema
let Note = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    labels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Label' }],
    content: String
})

// Export model
export default mongoose.model('Note', Note)
