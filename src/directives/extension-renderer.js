(function() {
  'use strict';

  angular.module('extension-registry')
    .directive('extensionRenderer', [
      '$compile',
      function($compile) {
        return {
          restrict: 'AE',
          scope: {
            item: '=',
            index: '=',
            context: '='
          },
          templateUrl: '__extension-renderer.html',
          link: function($scope, $elem) {
            $scope.extTpl = function(type) {
              return '__extension-'+type+'.html';
            };
            if($scope.item.type === 'dom') {
              $elem.append($scope.item.node);
              $compile($elem.contents())($scope);
            }
          }
        };
      }]);
})();
