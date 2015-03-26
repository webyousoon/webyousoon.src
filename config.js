exports.config = {
  paths: {
    watched: ['app', 'vendor']
  },
  files: {
    javascripts: {
      joinTo: {
        'js/app.js': /^(app)/,
        'js/vendor.js': /^(vendor\/scripts\/(common|development)|vendor\\scripts\\(common|development))/
      }
    },
    stylesheets: {
      joinTo: {
        'css/app.css': /^(app|vendor)/
      },
      order: {
        before: ['vendor/styles/normalize.css']
      }
    },
    templates: {
      joinTo: 'js/app.js'
    }
  },
  plugins: {
    autoprefixer: {
      browsers: ["last 1 version", "> 1%", "ie 8", "ie 7"],
      cascade: false
    }
  }
};
