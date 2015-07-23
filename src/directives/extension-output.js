angular.module('extension-registry')
  .directive('extensionOutput', function() {
    return {
      restrict: 'AE',
      scope: true,
      transclude: true,
      templateUrl: '__extension-output.html',
      controller: [
        '$scope',
        'extensionInput',
        function($scope, extensionInput) {
          this.initialize = function(name, filters) {
            $scope.items = extensionInput.get(name, filters);
          };
        }
      ],
      link: function($scope, $elem, $attrs, ctrl) {
        var name = $attrs.extensionName,
            filters = $attrs.extensionTypes && $attrs.extensionTypes.split(' ') || [];
        ctrl.initialize(name, filters);
      }
    };
  });
