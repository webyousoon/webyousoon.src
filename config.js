exports.config = {
  paths: {
    watched: ['app', 'vendor']
  },
  files: {
    javascripts: {
      joinTo: {
        'js/vendor.js': /^(vendor\/scripts\/(common|development)|vendor\\scripts\\(common|development))/
      }
    },
    stylesheets: {
      joinTo: {
        'css/app.css': /^(app|vendor|bower_components\/normalize.css\/normalize.css)/
      },
      order: {
        before: ['bower_components/normalize.css/normalize.css']
      }
    },
    templates: {
      joinTo: 'js/app.js'
    }
  },
  plugins: {
    sass: {
      options: {
        includePaths: ['bower_components/susy/sass']
      }
    }
  }
};
