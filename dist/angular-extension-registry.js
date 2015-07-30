angular.module('extension-registry', [
  'ngSanitize',
  'extension-registry-utils'
])

.config(function() {
  // currently nothing to do here.
});

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
      // provide a list, ask if it contains any number of subsequent items
      // example:
      // contains([1,2,3,4,5], 3)     // T
      // contains([1,2,3,4,5], 3,5)   // T
      // contains([1,2,3,4,5], 7)     // F
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
          isArray: isArray,
          isObject: isObject,
          isNumber: isNumber
        };
})());

angular.module('extension-registry')

.provider('extensionInput', [
  'extensionRegistryUtils',
  function(utils) {
    var registry = {},
        subscribers = {},
        keyStart = 1000,
        split = utils.split,
        each = utils.each,
        map = utils.map,
        contains = utils.contains,
        filter = utils.filter,
        flatten = utils.flatten,
        reduce = utils.reduce,
        ownKeys = utils.ownKeys,
        toArray = utils.toArray;

    // API methods
    var // data provider API
        register = function(name, list) {
          var key = keyStart++;
          if(!registry[name]) {
            registry[name] = {};
          }
          if(list) {
            registry[name][key] = list;
          }
          each(toArray(subscribers), function(fn) {
            fn && fn();
          });
          return {
            deregister: function() {
              delete registry[name][key];
            }
          };
        },
        // consumer API
        get = function(name, filters) {
          var names = split(name, ' '),
              registrations = map(names, function(n) {
                return registry[n];
              }),
              registrationLists = reduce(registrations, function(memo, next, i, list) {
                var lists = map(ownKeys(next), function(key) {
                  return next[key];
                });
                return memo.concat(flatten(lists));
              }, []),
              flattened = flatten(registrationLists),
              filtered = filter(flattened, function(item, index, list) {
                if(contains(filters, item.type)) {
                  return item;
                }
              });
          return filtered;
        },
        subscribe = function(fn) {
          var key = keyStart++;
          subscribers[key] = fn;
          return {
            unsubscribe: function() {
              delete subscribers[key];
            }
          };
        };

    // In the provider context (Angular's initialization phase)
    // only the register method is useful.
    this.register = register;

    // all methods available in service context (Angular's run phase)
    this.$get = [
        '$log',
        function($log) {
          return {
            register: register,
            get: get,
            subscribe: subscribe
          };
        }];
  }
]);

angular.module('extension-registry')
  .directive('extensionOutput', function() {
    return {
      restrict: 'AE',
      scope: {
        name: '@name',
        filters: '@filters',
        context: '@context'
      },
      transclude: true,
      templateUrl: '__extension-output.html',
      controller: [
        '$scope',
        'extensionInput',
        function($scope, extensionInput) {
          this.initialize = function(name, filters, context) {
            $scope.items = extensionInput.get(name, filters);
            $scope.context = context;
            var registry = extensionInput.subscribe(function() {
              $scope.items = extensionInput.get(name, filters);
            });

            $scope.$on('$destroy', function() {
              registry.unsubscribe();
            });
          };
        }
      ],
      link: function($scope, $elem, $attrs, ctrl) {
        var name = $attrs.extensionName,
            filters = $attrs.extensionTypes && $attrs.extensionTypes.split(' ') || [],
            context = $attrs.extensionContext || {};
        ctrl.initialize(name, filters, context);
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
