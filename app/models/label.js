/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import mongoose from 'mongoose'
import { LABEL_COLORS } from '../consts'

/**
 * Pick random color from list
 */
function randomColor() {
    return LABEL_COLORS[Math.floor(Math.random()*LABEL_COLORS.length)]
}

// Label schema
let Label = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    color: String,
    name: String
})

// Automatically either finds or creates all the labels with the given names
Label.statics.findOrCreateAll = function(user, names, cb) {
    this.find({ user: user._id, name: { $in: names } }, (err, found) => {
        if (err) cb(err)
        else {
            let foundNames = found.map(label => label.name)
            let docsToCreate = names
                .filter(name => !foundNames.includes(name))
                .map(name => ({
                    user: user._id,
                    name: name,
                    color: randomColor()
                }))
            this.insertMany(docsToCreate, (err, created) => {
                if (err) cb(err)
                else cb(null, found.concat(created))
            })
        }
    })
}

// Export model
export default mongoose.model('Label', Label)
