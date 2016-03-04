(function() {
  'use strict';
  
  angular.module('extension-registry')
    .directive('extensionRenderer', function() {
      return {
        restrict: 'AE',
        scope: {
          item: '=',
          index: '=',
          context: '='
        },
        templateUrl: '__extension-renderer.html'
      };
    });
})();
