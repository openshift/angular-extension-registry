angular.module('extension-registry')
  .directive('extensionOutput', function() {
    return {
      restrict: 'EA',
      scope: {
        extensionName: '=',
        extensionFilters: '=',
        extensionArgs: '='
      },
      transclude: true,
      templateUrl: '__extension-output.html',
      controller: [
        '$scope',
        '$q',
        'extensionInput',
        function($scope, $q, extensionInput) {
          this.initialize = function(name, filters, args) {
            var resolve = function() {
              $q.when(extensionInput.get(name, filters, $scope.extensionArgs))
              .then(function(items) {
                angular.extend($scope, {
                  items: items
                })
              });
            }

            resolve();
            // events for handling new registries
            // and to clean up when done.
            var registry = extensionInput.subscribe(resolve);

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
        // TODO: track down $attrs[attr] vs $scope[attr] usage.
        ctrl.initialize(name, filters, args);
      }
    };
  });
