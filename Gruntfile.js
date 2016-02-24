/*
       /'
      //
  .  //
  |\//7
 /' " \
.   . .
| (    \
|  '._  '
/    \'-'
SVG READ ME GLIITER GUIDE
// 1. Minify dev/asets/svg to dev/asets/svg-min
// 2. Generate png fallbacks from svg-min
// 3. datauri takes svg-min + png files and creates sass $variables into seperate .scss files 
// 4. sass-convert generates .scss files to partials/_file.sass
// 5 Trusty old sass and autoprefixer for creating our css file :)
*/
module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),

        // SVG MIN
        svgmin: {
            options: {
                plugins: [
                    { removeViewBox: true }, 
                    { removeUselessStrokeAndFill: true }
                ]
            },
            dist: {
                files: [
			        {
			            expand: true,
			            cwd: "dev/assets/svg/",
			            src: ['**/*.svg'],
			            dest: 'dev/assets/svg-min/',
			            ext: '.svg'
			        }
			    ]
            }
        },

        // SVG2PNG
		svg2png: {
			all: {
				// specify files in array format with multiple src-dest mapping
				files: [
					// rasterize all SVG files in "svg-min" and its subdirectories to "img/png"
					{ cwd: 'dev/assets/svg/', src: ['*.svg'], dest: 'dev/assets/png/' }
				]
			}
		},

		// DATAURI VARIABLES
		datauri: {
			svg_target: {
				options: {
					varPrefix: '', // defaults to `data-image-`
					varSuffix: '-svg', // defaults to empty string
				},
				files: {
					"dev/assets/svg-datauri/datauri-svg.scss": "dev/assets/svg-min/*.svg"
				}
			},
			png_target: {
				options: {
					varPrefix: '', // defaults to `data-image-`
					varSuffix: '-png', // defaults to empty string
				},
				files: {
					"dev/assets/svg-datauri/datauri-png.scss": "dev/assets/png/*.png"
				}
			}
		},

		// SCSS TO SASS FOR SPRITES
		'sass-convert': {
			options: {
		      from: 'scss',
		      to: 'sass'
		    },
			// files: {
			// 	cwd: 'dev/assets/svg-sprite/view/',
			// 	src: ['*.scss'],
			// 	filePrefix: '_',
			// 	dest: 'dev/assets/sass/partials/'  
			// },
			filesdatauri: {
				cwd: 'dev/assets/svg-datauri/',
				src: ['*.scss'],
				filePrefix: '_',
				dest: 'dev/assets/sass/partials/'  
			}
		},

		// SASS
		sass: {                              
		    dist: {                          
		        options: {
		            compass: false,           
		            style: "expanded"
		        },
		        files: {                     
		            "dev/assets/css/default.noprefix.css": "dev/assets/sass/default.sass"
		        }
		    }
		},

		// AUTOPREFIXER
		autoprefixer: {
            default: {
                src: "dev/assets/css/default.noprefix.css",
                dest: "dist/assets/css/default.css"
            }
        },

		// LIVERELOAD
		livereload: {
            options: {
              base: "dist"
            },
            files: ["dist/**/*"]
        },

        // WATCH
		watch: {
		    all: {
                files: ["dev/assets/sass/**/*"],
                tasks: ["sass", "autoprefixer"]
		    },
		    options: { 
		        livereload: true 
		    }
		},
		
		/* -----------------------------
        GRUNT-SVG-SPRITE
        5 outputs to choose from - see bottom of file for reference
        -------------------------------- */
			// svg_sprite: {
			// 	complex: {
			// 		// Target basics 
			// 		expand: true,
			// 		cwd: "dev/assets/svg",
			// 		src: ["*.svg"],
			// 		dest: "dev/assets/svg-sprite",

			// 		// Target options 
			// 		options: {
			// 			shape: {
			// 				dimension: { 
			// 					maxWidth: 100, 
			// 					maxHeight: 100, 
			// 					attributes: false
			// 				},
			// 				spacing: { 
			// 					padding: 0       
			// 				}
			// 			},
			// 			mode: {
			// 				css: {
			// 					bust: false,
			// 					render: { 
			// 						scss: true
			// 					},
			// 					example: true
			// 				}
			// 			}
			// 		}
			// 	}
			// },

		/* -----------------------------
        GRUNT-GRUNTICON | https://www.npmjs.com/package/grunt-grunticon
        Good for fallbacks and nice data inline attr = data-grunticon-embed
        -------------------------------- */
			// grunticon: {
			//     myIcons: {
			//         files: [{
			//             expand: true,
			//             cwd: "dev/assets/svg/",
			//             src: ["*.svg", "*.png"],
			//             dest: "dist/assets/svg-grunticon"
			//         }],
			//         options: {
			//         	enhanceSVG: true
			//         }
			//     }
			// },

		/* -----------------------------
        SVG STORE 
        <svg><use xlink:href="assets/sprite/svg-sprite.svg#icon-ad" /></svg>
        -------------------------------- */
			// svgstore: {
			// 	default : {
			// 		files: {
			// 			'dist/assets/svg-store/svg-store.svg': ['dev/assets/svg/*.svg'],
			// 		},
			// 	},
			// 	options: {
			// 	  prefix : 'icon-', // This will prefix each ID
			// 	  svg: { // will add and overide the the default xmlns="http://www.w3.org/2000/svg" attribute to the resulting SVG
			// 	    viewBox : '0 0 100 100',
			// 	    xmlns: 'http://www.w3.org/2000/svg'
			// 	  }
			// 	},
			// 	your_target: {
			// 	  // Target-specific file lists and/or options go here.
			// 	},
			// },

	});

    // Default task(s).
	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
	grunt.loadNpmTasks('grunt-datauri-variables');
	grunt.loadNpmTasks('grunt-svg2png');
   	grunt.registerTask("default",["css"]);
   	grunt.registerTask("css", [ "svgmin", "svg2png", "datauri", "sass-convert", "sass", "autoprefixer", "watch"]);
};


/*
CSS: -----------------------------
<i class="svg-bowling">bowling</i>
.svg-bowling {
	background: url("svg/sprite.css.svg") 0 20% no-repeat;
	width: 100px;
	height: 100px;
}

VIEW: -----------------------------
<i class="svg-bowling">bowling</i>
.svg-bowling {
    background: url("svg/sprite.view.svg") 0 20% no-repeat;
    width: 100px;
    height: 100px;
}

DEFS: -----------------------------
<svg viewBox="0 0 100 100" class="svg-bowling-dims">
	<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#bowling"></use>
</svg>
.svg-bowling-dims {
    width: 100px;
    height: 100px;
}

SYMBOL: -----------------------------
<svg class="svg-bowling-dims">
	<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#bowling"></use>
</svg>
.svg-bowling-dims {
    width: 100px;
    height: 100px;
}

STACK: -----------------------------
<img src="svg/sprite.stack.svg#bowling" class="svg-bowling-dims" alt="bowling">
.svg-bowling-dims {
    width: 100px;
    height: 100px;
}
*/
