(function() {
  'use strict';

  angular
    .module('extension-registry')
    .directive('extensionPoint', [
      '$compile',
      '$templateCache',
      'extensionRegistryUtils',
      function($compile, $templateCache, utils) {
        var each = utils.each,
            tplPath =  function(type) {
              return '__extension-'+type+'.html';
            };
        return {
          restrict: 'EA',
          scope: {
            extensionName: '=',
            extensionFilters: '=',
            extensionArgs: '=',
            extensionLimit: '='
          },
          transclude: true,
          templateUrl: '__extension-point.html',
          controller: [
            '$scope',
            '$q',
            'extensionRegistry',
            function($scope, $q, extensionRegistry) {
              this.initialize = function($elem, name, filters) {
                var resolve = function() {
                                $q
                                  .when(extensionRegistry
                                          .get(name, filters, $scope.extensionArgs, Number($scope.extensionLimit)))
                                  .then(function(items) {
                                    $elem.html('');
                                    each(items, function(item) {
                                      $elem
                                        .append(
                                          $compile(
                                            (item.type === 'dom') ?
                                                       item.node :
                                                       $templateCache.get(tplPath(item.type))
                                          )(angular
                                            .extend(
                                              $scope.$new(true),
                                              {item: item})));

                                    });
                                  });
                              };
                resolve();

                var registry = extensionRegistry.subscribe(resolve);
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

            angular.extend($scope, {
              extTpl: tplPath
            });

            ctrl.initialize($elem, name, filters, args);
          }
        };
      }
    ]);
})();
