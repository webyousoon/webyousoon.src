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
      joinTo: 'css/app.css'
    },
    templates: {
      joinTo: 'js/app.js'
    }
  }
};
