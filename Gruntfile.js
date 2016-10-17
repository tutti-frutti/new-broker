"use strict";

module.exports = function (grunt) {
    grunt.loadNpmTasks("grunt-browser-sync");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-postcss");
    grunt.loadNpmTasks("grunt-sass");
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-csso');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-bake');

    grunt.initConfig({
        sass: {
            style: {
                files: {
                    "css/style.css": "sass/style.scss"
                }
            }
        },

        csso: {
            style: {
                options: {
                    report: "gzip"
                },
                files: {
                    // основной файл css
                    "css/style.min.css": ["css/style.css"],
                    // файлы css из плагинов для минификации и объеденения
                    "css/library.min.css": [
                    "js/slick/slick/slick.css",
                    "js/slick/slick/slick-theme.css",
                    "js/fancy/source/jquery.fancybox.css"
                ]
                }
            }
        },

        postcss: {
            style: {
                options: {
                    processors: [
            require("autoprefixer")({
                            browsers: [
              "last 1 version",
              "last 2 Chrome versions",
              "last 2 Firefox versions",
              "last 2 Opera versions",
              "last 2 Edge versions"
            ]
        })
          ]
                },
                src: "css/*.css"
            }
        },

        browserSync: {
            server: {
                bsFiles: {
                    src: ["*.html", "css/*.css", "js/*.js"]
                },
                options: {
                    server: ".",
                    watchTask: true,
                    notify: false,
                    open: true,
                    ui: false
                }
            }
        },

        watch: {
            bake: {
                files: ["app/*.html"],
                tasks: ["bake:build"]
            },
                    html: {
                        files: ["*.html"],
//                        tasks: ["copy:html"]
                    },

            style: {
                files: ["sass/**/*.{scss,sass}"],
                tasks: ["sass", "postcss", "csso"],
                options: {
                    spawn: false
                }
            }
        },

        copy: {
            build: {
                files: [{
                    expand: true,
                    src: [
                    "fonts/**/*.{woff, woff2}",
                    "img/**",
                    "js/**",
                    "css/**",
                    "*.html"
                ],
                    dest: "build"
            }]
            },
            html: {
                files: [{
                    expand: true,
                    src: ["*.html"],
                    dest: "build"
            }]
            }
        },

        clean: {
            build: ["build"],
        },

        concat: {
            options: { // "включает" использование баннера
                stripBanners: true,
                banner: "/**/"
            },
            dist: {
                // файлы для склеивания
                src: ['js/slick/slick/slick.min.js',
                    'js/fancy/source/jquery.fancybox.pack.js',
                    'js/fancy/source/helpers/jquery.fancybox-media.js',
                    'js/jquery.maskedinput.js',
                    'js/threesixty.min.js'],
                // где будут находиться склеенные файлы
                dest: 'build/js/project.js'
            }

        },
        uglify: { // сжатие файлов js
            my_target: {
                options: {
                    beautify: true
                },
                files: {
                    //минификация в той же папке, где и основной файл 
                    "build/js/project.min.js": ['build/js/project.js']
                }
            }
        },
        bake: { // команда "grunt bake"
            build: {
                options: {
                    content: "app/content.json",
                    section: "de"
                },

                files: {
                    // указываются из каких шаблонов формируются готовые страницы
                    // из base.html в index.html
                    'index1.html': 'app/base.html',
                }
            }
        }

    });

    grunt.registerTask("serve", [
    "sass", 
    "csso",
    "browserSync",
    "watch",
    "bake",
  ]);
    grunt.registerTask("build", [
    "clean",
    "copy",
    "postcss",
    "concat",
    "uglify",
  ]);
};