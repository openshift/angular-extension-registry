angular.module('myapp', [
  'extension-registry'
])

// this file is only concerned with the extension registration,
// the data is added in the myApp.data.js file.
.config([
  'extensionInputProvider',
  function(extensionInputProvider) {

    // keey a cache of the deregistration functions
    // initially can declare and add data later, if desired.
    var registries = [
      extensionInputProvider.register('sidebar-left'),
      extensionInputProvider.register('main'),
      extensionInputProvider.register('footer'),
      extensionInputProvider.register('foo'),
      extensionInputProvider.register('bar'),
      extensionInputProvider.register('shizzle')
    ];

    // randomly kill one.  decide we want to blow away a registry
    registries[registries.length] && registries[registries.length].deregister();


  }
])
.service('fooService', [
  '$q',
  function($q) {
    var items = [
      {
        foo: 'foo',
        bar: 'bar'
      },
      {
        foo: 'foo 2',
        bar: 'bar 2'
      }
    ];

    return {
      get: function() {
        // simulate promise
        return $q.when(items);
      }
    }
  }
])

.controller('fooController', [
  '$scope',
  'fooService',
  function($scope, fooService) {
    fooService.get()
              .then(function(items) {
                angular.extend($scope, {
                  items: items
                });
              });
  }
]);

