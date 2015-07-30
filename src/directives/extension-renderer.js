angular.module('extension-registry')
  .directive('extensionRenderer', function() {
    return {
      restrict: 'AE',
      scope: {
        item: '=',
        index: '='
      },
      templateUrl: '__extension-renderer.html'
    };
  });
