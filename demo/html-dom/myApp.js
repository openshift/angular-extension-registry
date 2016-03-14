angular.module('myapp', [
  'extension-registry'
])

.config([
  function() {
    // nothing to do here, ATM
  }
])
.controller('myController', [
  '$scope',
  function($scope) {
    console.log('hello world.');
    $scope.items = [1,2,3,4,5];
  }
])
// arbitrary extension
.run([
  'extensionRegistry',
  function(extensionRegistry) {
    //dom-nodes
    extensionRegistry.add('dom-nodes', function() {
      return [{
        type: 'dom',
        node: '<div> This is html stuff. with directives! <span ng-repeat="item in [1,2,3,4,5]">{{item}},</span></div>'
      }, {
        type: 'dom',
        node: $('<div>')
                .append('<span>A jQuery node, with directives! <span ng-repeat="item in [1,2,3,4,5]">{{item}},</span>')
      }];
    })
  }
]);
