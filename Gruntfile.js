/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */

/**
 * Configures grunt
 *
 * @param {object} grunt grunt instance
 */
module.exports = function(grunt) {
    // Initialize grunt
    grunt.initConfig({
        babel: {
            dist: {
                files: {
                    'build/constants.js': 'app/constants.js',
                    'build/server.js': 'app/server.js',
                    'build/index.js': 'app/index.js'
                }
            }
        }
    })

    // Load npm tasks
    grunt.loadNpmTasks('grunt-babel')

    // Register tasks
    grunt.registerTask('build', ['babel'])
}
