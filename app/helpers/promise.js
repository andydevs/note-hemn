/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
import createDebug from 'debug'

/**
 * Returns a promise function that resolves if the given value is true,
 * else rejects with an error with the given error message
 *
 * @param {string} error error message
 */
export function resolveIfTrue(error) {
    const debug = createDebug('note-hemn:promise-helpers:resolveIfTrue')
    return valid => {
        debug(`Valid value: ${valid}`)
        let promise = valid
            ? Promise.resolve()
            : Promise.reject(new Error(error))
        debug('Promise value:')
        debug(promise)
        return promise
    }
}

/**
 * Returns a promise function that rejects with an error if the given
 * value is true, else resolves
 *
 * @param {string} error error message
 */
export function rejectIfTrue(error) {
    const debug = createDebug('note-hemn:promise-helpers:rejectIfTrue')
    return invalid => {
        debug(`Invalid value: ${invalid}`)
        let promise = invalid
            ? Promise.reject(new Error(error))
            : Promise.resolve()
        debug('Promise value:')
        debug(promise)
        return promise
    }
}

/**
 * Returns the promisified version of the given callback-based function
 *
 * @param {function} function with a callback arg
 */
export function promisified(func) {
    return (...args) => {
        return new Promise((resolve, reject) => {
            func(...args, (err, result) => {
                if (err) reject(err)
                else resolve(result)
            })
        })
    }
}
