angular.module('extension-registry')
  .directive('extensionRenderer', function() {
    return {
      restrict: 'AE',
      scope: {
        item: '=',
        index: '='
      },
      templateUrl: '__extension-renderer.html',
      // TODO: may remove controller/link, there is nothing special about the renderer yet
      controller: [function() {}],
      link: function($scope, $elem, $attrs, ctrl) {
        // var item = $attrs.item;
      }
    };
  });
