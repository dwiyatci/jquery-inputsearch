/**
 * Created by Glenn on 2014-04-27.
 */

module.exports = function (grunt) {

    grunt.initConfig({
        pkg   : grunt.file.readJSON('package.json'),
        jshint: {
            files: ['gruntfile.js', 'src/**/*.js']
        },
        uglify: {
            options: {
                banner  : '/*! <%= pkg.name %> v<%= pkg.version %> by <%= pkg.author.name %> - <%= grunt.template.today("dd-mm-yyyy") %> */\n',
                /**
                 *
                 * @see https://github.com/mishoo/UglifyJS2#compressor-options
                 */
                compress: {
                    drop_console: true,
                    dead_code   : true
                }
            },
            dist   : {
                files: {
                    'dist/jquery.inputsearch.min.js': ['src/jquery.inputsearch.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['jshint', 'uglify']);
};
