module.exports = function(grunt) {
    // Required Node modules
    const exec = require('child_process').exec;
    const path = require('path');
    const { URL } = require('url'); // For parsing URLs

    // Load the pa11y-ci configuration file to reuse URL list and defaults.
    const pa11yConfig = require('./pa11yci.config.js');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Path variables
        source: '_src',
        dev: '_dev',
        scss: 'scss',
        css: 'css',
        js: 'js',
        images: 'images',
        fonts: 'fonts',
        favicons: 'favicons',

        // Accessibility using pa11y-ci (custom grunt tasks and the old task)
        exec: {
            pa11y_ci: {
                // Old pa11y-ci command.
                cmd: 'npx pa11y-ci -c pa11yci.config.js'
            },
            // Optional: Original single-page HTML report task for reference.
            pa11y_html: {
                cmd: 'npx pa11y http://localhost:3000/index-not-optimized.html --reporter html --standard WCAG2AA --timeout 30000 > accessibility-reports/pa11y-report-index-not-optimized.html',
                exitCodes: [0, 2]
            }
        },

        /* ====================================================================
         * Watch
         ==================================================================== */
        watch: {
            content: {
                files: ['<%= source %>/**/*.html'],
                tasks: ['newer:processhtml:dev']
            },
            includes: {
                files: ['<%= source %>/_includes/**/*.html'],
                tasks: ['processhtml:dev']
            },
            images: {
                files: ['<%= source %>/<%= images %>/**/*.{png,jpg,gif,svg}', '!<%= source %>/<%= images %>/<%= favicons %>/**/*'],
                tasks: ['newer:imagemin', 'copy:unoptimizedImage', 'copy:favicons']
            },
            scripts: {
                files: ['<%= source %>/<%= js %>/**/*.js'],
                tasks: ['copy:js'],
                options: {
                    spawn: false,
                }
            },
            fonts: {
                files: ['<%= source %>/<%= fonts %>/**/*'],
                tasks: ['copy:the_fonts'],
                options: {
                    spawn: false,
                }
            },
            scss: {
                files: ['<%= source %>/<%= scss %>/**/*.scss'],
                tasks: ['newer:sass:dist', 'postcss:dev'],
                options: {
                    spawn: false,
                }
            },
            partial_scss: {
                files: ['<%= source %>/<%= scss %>/**/_*.scss'],
                tasks: ['sass:partials', 'postcss:dev'],
                options: {
                    spawn: true,
                }
            },
            grunt: {
                files: ['gruntfile.js']
            }
        },

        /* ====================================================================
         * Tasks
         ==================================================================== */
        // TASK CLEAN: remove _dev folder
        clean: ["<%= dev %>"],

        // TASK IMAGEMIN: compress images
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: '<%= source %>/<%= images %>/',
                    src: ['**/*.{png,jpg,gif,svg}'],
                    dest: '<%= dev %>/<%= images %>/'
                }]
            }
        },

        // TASK SASS: compile SCSS
        sass: {
            dist: {
                options: {},
                files: {
                    '<%= dev %>/<%= css %>/main.css': '<%= source %>/<%= scss %>/main.scss'
                }
            },
            partials: {
                options: {},
                files: {
                    '<%= dev %>/<%= css %>/main.css': '<%= source %>/<%= scss %>/main.scss'
                }
            }
        },

        // TASK POSTCSS: autoprefixer
        postcss: {
            dev: {
                options: {
                    map: true,
                    processors: [
                        require('autoprefixer')({
                            overrideBrowserslist: ['last 2 versions', 'IE 9']
                        })
                    ]
                },
                src: '<%= dev %>/<%= css %>/main.css'
            }
        },

        // TASK BrowserSync: for live reloading
        browserSync: {
            dev: {
                bsFiles: {
                    src: ['<%= dev %>/**', '<%= source %>/!.sass-cache']
                },
                options: {
                    server: {
                        baseDir: "<%= dev %>/"
                    },
                    ghostMode: false,
                    open: false,
                    watchTask: true
                }
            }
        },

        // TASK Process HTML: handle includes
        processhtml: {
            dev: {
                files: [{
                    expand: true,
                    cwd: '<%= source %>/',
                    src: ['**/*.html', '!_includes/**/*.html'],
                    dest: '<%= dev %>/',
                    ext: '.html'
                }]
            }
        },

        // TASK COPY: various file copies
        copy: {
            the_fonts: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= source %>/<%= fonts %>',
                    dest: '<%= dev %>/<%= fonts %>',
                    src: ['*.*']
                }]
            },
            js: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= source %>/<%= js %>',
                    dest: '<%= dev %>/<%= js %>',
                    src: ['**/*.js']
                }]
            },
            unoptimizedImage: {
                expand: true,
                cwd: '<%= source %>/<%= images %>/',
                src: ['**/*.{png,jpg,gif,svg}'],
                dest: '<%= dev %>/<%= images %>/',
                filter: function(filepath) {
                    const dest = path.join(
                        grunt.config('copy.main.dest'),
                        path.basename(filepath)
                    );
                    return !(grunt.file.exists(dest));
                }
            },
            favicons: {
                expand: true,
                dot: true,
                cwd: '<%= source %>/<%= images %>/<%= favicons %>',
                src: ['*.ico','*.json','*.xml','*.webmanifest'],
                dest: '<%= dev %>/<%= images %>/<%= favicons %>'
            }
        }
    });

    // Load Grunt Tasks
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-exec');

    // Default task for development
    grunt.registerTask('default', ['browserSync', 'watch']);

    // Build task to prepare the _dev folder
    grunt.registerTask('build', [
        'clean',
        'processhtml:dev',
        'imagemin',
        'copy:unoptimizedImage',
        'copy:js',
        'sass:dist',
        'postcss:dev',
        'copy:the_fonts',
        'copy:favicons'
    ]);

    // ********************************************
    // Custom Task: pa11y_summary for grunt a
    //
    // Quickly check accessibility for all pages using the JSON reporter.
    // Outputs a summary of total errors per page in the terminal.
    // This task does not generate report files.
    // ********************************************
    grunt.registerTask('pa11y_summary', 'Quickly check accessibility error counts for each URL', function() {
        const done = this.async();
        const urls = pa11yConfig.urls;
        const defaults = pa11yConfig.defaults || {};
        const standard = defaults.standard || 'WCAG2AA';
        const timeout = defaults.timeout || 30000;

        if (!urls || !urls.length) {
            grunt.log.error('No URLs found in the pa11y-ci config.');
            return done(false);
        }

        let remaining = urls.length;
        let totalErrors = 0;

        urls.forEach((url) => {
            const jsonCmd = `npx pa11y "${url}" --reporter json --standard ${standard} --timeout ${timeout}`;
            grunt.log.writeln(`Checking ${url}…`);
            exec(jsonCmd, function(err, stdout, stderr) {
                let issues = [];
                try {
                    issues = JSON.parse(stdout);
                } catch (e) {
                    grunt.log.error(`Error parsing JSON for ${url}: ${e}`);
                }
                const errorCount = issues ? issues.length : 0;
                totalErrors += errorCount;
                grunt.log.writeln(`${url} => ${errorCount} error(s)`);
                remaining--;
                if (remaining === 0) {
                    grunt.log.writeln('---------------------------');
                    grunt.log.writeln(`Total errors found: ${totalErrors}`);
                    done();
                }
            });
        });
    });

    // Task "a" now uses the quick summary approach.
    grunt.registerTask('a', ['pa11y_summary']);

    // ********************************************
    // Custom Task: pa11y_html_from_config for grunt b
    //
    // Generate detailed HTML accessibility reports for each URL
    // only for pages that have one or more issues.
    // Before running, wipe the "accessibility-reports" folder so it's up to date.
    // ********************************************
    grunt.registerTask('pa11y_html_from_config', 'Generate pa11y HTML reports (only for pages with issues) from config', function() {
        const done = this.async();
        const urls = pa11yConfig.urls;
        const defaults = pa11yConfig.defaults || {};
        const standard = defaults.standard || 'WCAG2AA';
        const timeout = defaults.timeout || 30000;

        if (!urls || !urls.length) {
            grunt.log.error('No URLs found in the pa11y-ci config.');
            return done(false);
        }

        // Wipe the reports folder if it exists, then re-create it.
        if (grunt.file.exists('accessibility-reports')) {
            grunt.file.delete('accessibility-reports', { force: true });
        }
        grunt.file.mkdir('accessibility-reports');

        let remaining = urls.length;

        // Loop through each URL
        urls.forEach((url) => {
            // Generate a friendly name based on URL pathname.
            let pageName;
            try {
                const parsedUrl = new URL(url);
                let pathname = parsedUrl.pathname;
                if (pathname === '/' || pathname === '') {
                    pageName = 'home';
                } else {
                    pageName = pathname.replace(/^\//, '').replace(/\//g, '-').replace(/\.[^/.]+$/, '');
                }
            } catch (e) {
                pageName = 'unknown';
            }

            // First, run pa11y using JSON reporter to check for issues.
            const jsonCmd = `npx pa11y "${url}" --reporter json --standard ${standard} --timeout ${timeout}`;
            grunt.log.writeln(`Checking accessibility (JSON) for ${url}`);
            exec(jsonCmd, function(err, stdout, stderr) {
                let issues = [];
                try {
                    issues = JSON.parse(stdout);
                } catch (e) {
                    grunt.log.error(`Error parsing JSON for ${url}: ${e}`);
                }

                // If issues are found, generate the HTML report.
                if (issues && issues.length > 0) {
                    grunt.log.writeln(`Found ${issues.length} issue(s) for ${url} – generating HTML report...`);
                    const htmlCmd = `npx pa11y "${url}" --reporter html --standard ${standard} --timeout ${timeout}`;
                    exec(htmlCmd, function(errHtml, stdoutHtml, stderrHtml) {
                        if (errHtml && errHtml.code !== 2) {
                            grunt.log.error(`pa11y HTML check for ${url} returned error: ${errHtml}`);
                        } else {
                            const outputFile = `accessibility-reports/pa11y-report-${pageName}.html`;
                            grunt.file.write(outputFile, stdoutHtml);
                            grunt.log.writeln(`Report written to ${outputFile}`);
                        }
                        remaining--;
                        if (remaining === 0) {
                            grunt.log.writeln('All pa11y checks completed.');
                            done();
                        }
                    });
                } else {
                    grunt.log.writeln(`No accessibility issues for ${url}. Skipping report.`);
                    remaining--;
                    if (remaining === 0) {
                        grunt.log.writeln('All pa11y checks completed.');
                        done();
                    }
                }
            });
        });
    });

    // ********************************************
    // Task "b": The old grunt a behavior using pa11y-ci.
    // ********************************************
    grunt.registerTask('b', ['exec:pa11y_ci']);

    // Task "c" uses the custom HTML report generation.
    grunt.registerTask('c', ['pa11y_html_from_config']);
};
