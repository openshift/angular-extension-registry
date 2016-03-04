(function() {
  'use strict';

  angular
    .module('extension-registry')
    .directive('extensionPoint', function() {
      return {
        restrict: 'EA',
        scope: {
          extensionName: '=',
          extensionFilters: '=',
          extensionArgs: '=',
          extensionLimit: '='
        },
        transclude: true,
        templateUrl: '__extension-point.html',
        controller: [
          '$scope',
          '$q',
          'extensionRegistry',
          function($scope, $q, extensionRegistry) {
            this.initialize = function(name, filters) {
              var resolve = function() {
                $q
                  .when(extensionRegistry.get(name, filters, $scope.extensionArgs, Number($scope.extensionLimit)))
                  .then(function(items) {
                    angular.extend($scope, {
                      items: items
                    });
                  });
                };

              resolve();

              var registry = extensionRegistry.subscribe(resolve);
              $scope.$on('$destroy', function() {
                registry.unsubscribe();
              });
            };
          }
        ],
        link: function($scope, $elem, $attrs, ctrl) {
          var name = $attrs.extensionName,
              filters = $attrs.extensionTypes && $attrs.extensionTypes.split(' ') || [],
              args = $attrs.extensionArgs || {};

          ctrl.initialize(name, filters, args);
        }
      };
    });

})();
