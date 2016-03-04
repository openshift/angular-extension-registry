angular.module('extension-registry', [
  'ngSanitize',
  'extension-registry-utils'
]);

angular.module('extension-registry-utils', [

])
// ONLY constants are available to a provider,
// thus, this collection of functions is a constant.
.constant('extensionRegistryUtils', (function() {

  var // utils
      unbind = Function.prototype.bind.bind(Function.prototype.call),
      // strings
      split = unbind(String.prototype.split),
      // is of type
      toString = unbind(Object.prototype.toString),
      isArray = function(obj) {
        return toString(obj) === '[object Array]';
      },
      isObject = function(obj) {
        return toString(obj) === '[object Object]';
      },
      isNumber = function(obj) {
        return toString(obj) === '[object Number]';
      },
      isFunction = function(obj) {
        return toString(obj) === '[object Function]';
      },
      // arrays
      slice = unbind(Array.prototype.slice),
      each = function(arr, fn) {
        for(var i = 0; i < arr.length; i++) {
          fn(arr[i], i, arr);
        }
      },
      map = function(arr, fn) {
        var list = [];
        for(var i = 0; i < arr.length; i++) {
          list.push(fn(arr[i], i, arr));
        }
        return list;
      },
      filter = function(arr, fn) {
        var list = [];
        for(var i=0;i<arr.length;i++) {
          if(fn(arr[i],i, arr)) {
            list.push(arr[i]);
          }
        }
        return list;
      },
      reduce = function(arr, fn, memo) {
        for(i = 0; i < arr.length; i++) {
          memo = fn(memo, arr[i], i, arr);
        }
        return memo;
      },
      contains = function() {
        var list = arguments[0],
            rest = slice(arguments, 1),
            successes = [];
        each(rest, function(toMatch) {
          each(list, function(item) {
            if(item === toMatch) {
                successes.push(true);
            }
          });
        });
        if(successes.length === rest.length) {
          return true;
        }
        return false;
      },
      flatten = function(arr) {
        var flattened = [];
        each(arr, function(item, i) {
          if(isArray(item)) {
            flattened = flattened.concat(flatten(item));
          } else {
            flattened = flattened.concat(item);
          }
        });
        return flattened;
      },
      // objects
      ownKeys = function(obj) {
        var list = [];
        for(var prop in obj) {
          if(obj.hasOwnProperty(prop)) {
            list.push(prop);
          }
        }
        return list;
      },
      toArray = function(obj) {
        var list = [];
        for(var prop in obj) {
          if(obj.hasOwnProperty(prop)) {
            list.push(obj[prop]);
          }
        }
        return list;
      };

  return {
          // utils
          unbind: unbind,
          // strings
          split: split,
          // arrays/lists
          slice: slice,
          contains: contains,
          each: each,
          map: map,
          reduce: reduce,
          filter: filter,
          flatten: flatten,
          ownKeys: ownKeys,
          toArray: toArray,
          isFunction: isFunction,
          isObject: isObject,
          isNumber: isNumber
        };
})());

angular.module('extension-registry')

.provider('extensionRegistry', [
  'extensionRegistryUtils',
  function(utils) {
    var registry = {},
        subscribers = {},
        keyStart = 1000,
        split = utils.split,
        slice = utils.slice,
        each = utils.each,
        map = utils.map,
        contains = utils.contains,
        filter = utils.filter,
        flatten = utils.flatten,
        reduce = utils.reduce,
        ownKeys = utils.ownKeys,
        toArray = utils.toArray,
        isFunction = utils.isFunction;

    // methods available in provider && service context
    var
        notify = function() {
          each(toArray(subscribers), function(fn) {
            fn && fn();
          });
        },
        register = function(name, builderFn) {
          var key = keyStart++;
          if(!registry[name]) {
            registry[name] = {};
          }
          if(builderFn && isFunction(builderFn)) {
            registry[name][key] = builderFn;
            notify();
          }
          return {
            deregister: function() {
              delete registry[name][key];
              notify();
            }
          };
        },
        dump = function() {
          return registry;
        },
        clean = function() {
          registry = {};
        };

    // provider context export
    this.register = register;
    this.dump = dump;
    this.clean = clean;

    // service context export
    this.$get = [
        '$log',
        '$q',
        function($log, $q) {
          return {
            register: register,
            get: function(names, filters, args, limit) {
                return $q.all(
                          flatten(
                            reduce(
                              map(
                                split(names, ' '),
                                function(n) {
                                  return registry[n];
                                }),
                              function(memo, next, i, list) {
                                return memo.concat(
                                  flatten(
                                    map(
                                      ownKeys(next),
                                      function(key) {
                                        return next[key] && next[key](args);
                                      })));
                              }, [])))
                          .then(function() {
                            return reduce(
                                    filter(
                                      flatten(
                                        slice(arguments)),
                                        function(item, index, list) {
                                          if(contains(filters, item && item.type)) {
                                            return item;
                                          }
                                        }),
                                    function(memo, next, i, list) {
                                      if(memo.length >= limit) {
                                        return memo;
                                      }
                                      memo.push(next);
                                      return memo;
                                    }, []);
                                  });
            },
            subscribe: function(fn) {
              var key = keyStart++;
              subscribers[key] = fn;
              return {
                unsubscribe: function() {
                  delete subscribers[key];
                }
              };
            },
            dump: dump,
            clean: clean
          };
        }];
  }
]);

angular.module('extension-registry')
  .directive('extensionPoint', function() {
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
          this.initialize = function(name, filters, args) {
            var resolve = function() {
              $q
                .when(extensionRegistry.get(name, filters, $scope.extensionArgs, Number($scope.extensionLimit)))
                .then(function(items) {
                  angular.extend($scope, {
                    items: items
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

        ctrl.initialize(name, filters, args);
      }
    };
  });

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
