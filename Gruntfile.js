/**
 * Created by Naresh Goud on 10/29/2017.
 */


module.exports = function (grunt) {
    grunt.initConfig ({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            scripts: {
                files: {
                    'dist/scripts/all.js' : ['public/components/about/about.js', 'public/components/addQuestion/addQuestion.js', 'public/components/contact/contact.js', 'public/components/dashboard/dash.js', 'public/components/getQuestion/getquestion.js', 'public/components/home/home.js', 'public/components/login/login.js', 'public/components/questionsList/questionsList.js', 'public/components/signup/signup.js', 'public/components/userprofile/userprofile.js', 'public/script/config.js', 'public/script/script.js', 'database/database.js', 'server.js']
                }
            },
            styles: {
                files: {
                    'dist/styles/all.css' : ['public/stylesheet/style.css']
                }
            }
        },

        watch: {
                files: ['public/components/**/*.js', 'public/script/*.js', 'database/*.js', 'server.js', 'public/stylesheet/*.css'],
                tasks: ['concat', 'uglify']
        },
        uglify: {
            scripts: {
                files: {
                    'dist/scripts/uglify/all.min.js': ['public/components/about/about.js', 'public/components/addQuestion/addQuestion.js', 'public/components/contact/contact.js', 'public/components/dashboard/dash.js', 'public/components/getQuestion/getquestion.js', 'public/components/home/home.js', 'public/components/login/login.js', 'public/components/questionsList/questionsList.js', 'public/components/signup/signup.js', 'public/components/userprofile/userprofile.js', 'public/script/config.js', 'public/script/script.js', 'database/database.js', 'server.js']
                }
            }
        },
        cssmin: {
            styles: {
                files: {
                    'dist/styles/uglify/all.min.css': ['public/stylesheet/style.css']
                }
            }
        }

    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('default', ['concat', 'watch', 'uglify', 'cssmin']);
};
