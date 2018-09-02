/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import _ from 'lodash'
import mongoose from 'mongoose'
import { LABEL_COLORS } from '../consts'

/**
 * Pick random color from list
 */
function randomColor() {
    return _.sample(LABEL_COLORS)
}

// Label schema
let Label = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    color: String,
    name: String
})

// Automatically either finds or creates all the labels with the given names
Label.statics.findOrCreateAll = function(user, names) {
    return this.find({ user: user._id, name: { $in: names } }).exec()
        .then(found => {
            let foundNames = found.map(label => label.name)
            let docsToCreate = names
                .filter(name => !foundNames.includes(name))
                .map(name => ({
                    user: user._id,
                    name: name,
                    color: randomColor()
                }))
            return this.insertMany(docsToCreate)
                .then(created => found.concat(created))
        })
}

// Removes label from notes and deletes label
Label.statics.updateNotesAndDelete = function(user, _id, cb) {
    return this.findOne({
        _id: mongoose.Types.ObjectId(_id),
        user: user._id
    }).exec().then(label => {
        return label.model('Note').updateMany({
            user: user._id,
            labels: { $elemMatch: { $eq: this._id } }
        }, {
            $pull: { labels: this._id }
        }).exec().then(() => label)
    })
    .then(label => label.remove())
}

// Export model
export default mongoose.model('Label', Label)
