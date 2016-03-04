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
        displayName: 'via service #1 again',
        fn: function(context) {
          console.log('you clicked this', context);
        }
      }
    ];
  })
  .run([
    '$timeout',
    'fooExtensionFactory',
    'extensionRegistry',
    function($timeout, fooExtensionFactory, extensionRegistry) {

      // simulate time passing, as if API call, then add additional data
      // directives will be notified of new data & will update if necessary
      $timeout(function() {
        extensionRegistry.register('service1', fooExtensionFactory);
      }, 1000);

    }
  ]);

  // .run([
  //   'dataProvider1',
  //   'dataProvider2',
  //   function($timeout, dataProvider1, dataProvider2, extensionRegistry) {

  //     $q.when([
  //       dataProvider1.get(),
  //       dataProvider2.get()
  //     ])
  //     .then(function(data1, data2) {
  //       extensionRegistry.register('endpoint1', [
  //         // make objects with the data...
  //       ]);
  //     });

  //   }
  // ]);
