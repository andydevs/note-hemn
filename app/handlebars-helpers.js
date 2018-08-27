/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import _ from 'lodash'

/**
 * String representation of labels
 *
 * @param {[Label]} labels labels to parse
 * @param {object} opts handlebars options
 */
export const labelString = (labels, opts) =>
     labels ? labels.map(label => label.name).join(' ') : ''

/**
 * Note color parsed from labels
 *
 * @param {[Label]} labels the labels to get the color from
 * @param {object} opts handlebars options
 */
export const noteColor = (labels, opts) =>
    labels && labels.length > 0 ? labels[0].color : 'primary'

/**
 * Display notes in a grid
 *
 * @param {[Note]} notes to display in a grid
 * @param {object} opts handlebars options
 */
export const grid = (notes, opts) => _(notes)
    .map(note => `<div class="col-md-4">${opts.fn(note)}</div>`)
    .chunk(3)
    .map(row => `<div class="row">${row.join('')}</div>`)
    .join('')
