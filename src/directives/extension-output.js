angular.module('extension-registry')
  .directive('extensionOutput', function() {
    return {
      restrict: 'AE',
      scope: {
        extensionName: '@',
        extensionFilters: '@',
        extensionArgs: '@'
      },
      transclude: true,
      templateUrl: '__extension-output.html',
      controller: [
        '$scope',
        'extensionInput',
        function($scope, extensionInput) {
          this.initialize = function(name, filters, context) {
            $scope.items = extensionInput.get(name, filters);
            $scope.context = context;
            var registry = extensionInput.subscribe(function() {
              $scope.items = extensionInput.get(name, filters);
            });

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
