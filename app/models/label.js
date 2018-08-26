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

// Label schema
let Label = new mongoose.Schema({
    color: String,
    name: String
})

// Generate label with random color
Label.statics.createWithRandomColor = function(name, cb) {
    // Pick a random color
    let color = LABEL_COLORS[Math.floor(Math.random()*LABEL_COLORS.length)]

    // Create a label with the given name and color
    Label.create({ name, color }, cb)
}

// Export model
export default mongoose.model('Label', Label)
