angular.module('myapp', [
  'extension-registry'
])

// this file is only concerned with the extension registration,
// the data is added in the myApp.data.js file.
.config([
  'extensionRegistryProvider',
  function(extensionRegistryProvider) {

    // keey a cache of the deregistration functions
    // initially can declare and add data later, if desired.
    var registries = [
      extensionRegistryProvider.register('sidebar-left'),
      extensionRegistryProvider.register('main'),
      extensionRegistryProvider.register('footer'),
      extensionRegistryProvider.register('foo'),
      extensionRegistryProvider.register('bar'),
      extensionRegistryProvider.register('shizzle')
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

