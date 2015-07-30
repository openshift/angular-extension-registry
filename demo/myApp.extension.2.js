'use strict';

angular.module('myapp')
  .factory('fooExtensionFactory', function() {
    return [
      {
        type: 'text',
        output: 'via service #1',
        className: 'extension extension-pod'
      },
      {
        type: 'link',
        link: 'http://openshift.com',
        className: 'extension extension-pod',
        displayName: 'via service #2',
        fn: function() {
          console.log('you have clicked this ' + (clickCount++) + ' times');
        }
      }
    ];
  })
  .run([
    '$timeout',
    'fooExtensionFactory',
    'extensionInput',
    function($timeout, fooExtensionFactory, extensionInput) {

      extensionInput.register('main', fooExtensionFactory);

      // simulate time passing, as if API call, then add additional data
      // directives will be notified of new data & will update if necessary
      $timeout(function() {
        extensionInput.register('main', fooExtensionFactory);
      }, 1000);

    }
  ]);
