angular.module('extension-registry')
  // directive for each individual item to render
  // TODO:
  // - idea about dynamic templates
  // - http://onehungrymind.com/angularjs-dynamic-templates/
  // - need to be able to change templates based on type passed in configuration objects
  //
  .directive('extensionRenderer', function() {
    return {
      restrict: 'AE',
      scope: {
        item: '=',
        index: '='
      },
      templateUrl: '__extension-renderer.html',
      controller: [function() {}],
      link: function($scope, $elem, $attrs, ctrl) {
        // var item = $attrs.item;
      }
    };
  });
