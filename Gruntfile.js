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
                files: [{
                    expand: true,
                    cwd: 'app/',
                    src: ['**/*.js'],
                    dest: 'build/',
                    ext: '.js'
                }]
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
                tasks: ['build', 'express:dev'],
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
