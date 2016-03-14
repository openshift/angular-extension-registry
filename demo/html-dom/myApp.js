'use strict';

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
  '$window',
  'extensionRegistry',
  function($window, extensionRegistry) {
    //dom-nodes
    extensionRegistry.add('dom-nodes', function() {
      return [{
                type: 'dom',
                node: '<div> This is html stuff. with directives! <span ng-repeat="item in [1,2,3,4,5]">{{item}},</span></div>'
              }, {
                type: 'dom',
                node: $('<div>')
                        .append('<span>A jQuery node, with directives! <span ng-repeat="item in [1,2,3,4,5]">{{item}},</span>')
              },{
                type: 'dom',
                url: 'http://www.google.com',
                onClick: function() {
                  $window.open(this.url, '_blank');
                },
                node: [
                  '<div row ',
                    'ng-show="item.url" ',
                    'class="foo" ',
                    'title="A link title">',
                      '<div>',
                        '<i class="fa fa-share" aria-hidden="true"></i>',
                      '</div>',
                      '<div>',
                        '<a ng-click="item.onClick($event)" ',
                          'ng-href="item.url">',
                          'Open some link',
                        '</a>',
                      '</div>',
                    '</div>'
                ].join('')
              }];

    });
  }
]);
