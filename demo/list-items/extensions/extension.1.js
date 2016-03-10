/* jshint unused: false */
(function() {
  'use strict';

  angular
    .module('myapp')
    .factory('aFactory', function() {

    })
    // arbitrary run block, most likely wrapper for tapping into the system
    // from the outside.
    .run([
      '$q',
      '$timeout',
      'extensionRegistry',
      function($q, $timeout, extensionRegistry) {


        // type: 'li' is not a built in type, it is defined in the controller that
        // is wrapping the 'list' extension point simply by adding a template to
        // the template cache.
        extensionRegistry.add('list', function(args) {
          return [{
            type: 'li',
            text: 'The list is: ' + args.join(',')
          },{
            type: 'li',
            text: 'The first is: ' + args[0]
          }, {
            type: 'li',
            text: 'The last is: ' + args[args.length-1]
          }, {
            type: 'li',
            text: 'Random: ' + args[(Math.floor(Math.random() * (args.length-1)) + 0)]
          }, {
            type: 'dom',
            node: $('<div>')
                    .addClass('outline-red')
                    .append('<span>')
                    .text('Hello world')
          }];
        });

      }
    ]);

})();
