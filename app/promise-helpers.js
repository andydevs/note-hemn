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
