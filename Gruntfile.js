/**
 * Note-HEMN
 *
 * Note app using the HEMN (Handlebars, Express, Mongo, Node) stack
 *
 * Author:  Anshul Kharbanda
 * Created: 5 - 12 - 2018
 */
const sass = require('node-sass');

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
        sass: {
            options: {
                implementation: sass,
                sourceMap: true
            },
            dist: {
                files: {
                    'css/custom.css': 'scss/custom.scss'
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
                tasks: ['babel', 'express:dev'],
                options: {
                    spawn: false
                }
            },
            sass: {
                files: ['scss/**/*.scss'],
                tasks: ['sass', 'express:dev'],
                options: {
                    spawn: false
                }
            }
        }
    })

    // Load npm tasks
    grunt.loadNpmTasks('grunt-sass')
    grunt.loadNpmTasks('grunt-babel')
    grunt.loadNpmTasks('grunt-express-server')
    grunt.loadNpmTasks('grunt-contrib-watch')

    // Register tasks
    grunt.registerTask('build', ['babel', 'sass'])
    grunt.registerTask('devserver', ['build', 'express:dev', 'watch'])
}
