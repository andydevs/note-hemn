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
                    'build/consts.js': 'app/consts.js',
                    'build/server.js': 'app/server.js',
                    'build/index.js': 'app/index.js'
                }
            }
        },
        express: {
            dev: {
                options: {
                    script: 'build/index.js'
                }
            }
        },
        watch: {
            scripts: {
                files: ['app/**/*.js'],
                tasks: ['express:dev'],
                options: {
                    spawn: false
                }
            }
        }
    })

    // Load npm tasks
    grunt.loadNpmTasks('grunt-babel')
    grunt.loadNpmTasks('grunt-express-server')
    grunt.loadNpmTasks('grunt-contrib-watch')

    // Register tasks
    grunt.registerTask('build', ['babel'])
    grunt.registerTask('devserver', ['build', 'express:dev', 'watch'])
}
