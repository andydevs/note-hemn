/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import mongoose from 'mongoose'
import Label from './label'

// Note schema
let Note = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    labels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Label' }],
    content: String
})

// Create note with the given labels
Note.statics.createWithLabels = function(user, labels, content, cb) {
    Label.findOrCreateAll(user, labels, (err, labels) => {
        if (err) cb(err)
        else {
            this.create({
                user: user._id,
                labels: labels.map(label => label._id),
                content: content
            }, cb)
        }
    })
}

// Export model
export default mongoose.model('Note', Note)
