angular.module('extension-registry', [
  'ngSanitize',
  'extension-registry-utils'
])

.config(function() {
  // currently nothing to do here.
});

// strangely this must be provided as a separate module
// so that it can be injected into the extension-registry provider
angular.module('extension-registry-utils', [

])

// aaaah, problem.
// providers CANNOT have dependencies.
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

// extensionInputProvider
// - allows user to add data sets to an internal registry
.provider('extensionInput', [
  'extensionRegistryUtils',
  function(utils) {
    var registry = {},
        // tried Date.now(), but functions run too fast and will clobber data
        // keyStart needs to simply be an arbitrary number incremented by 1.
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

    // register a new extension, arbitrary name
    var register = function(name, list) {
          var key = keyStart++;
          if(!registry[name]) {
            registry[name] = {};
          }
          if(list) {
            // keeping each set of registries in separate namespaces
            registry[name][key] = list;
          }
          return {
            // simplest for user, return a function to de-register what they just registered
            deregister: function() {
              delete registry[name][key];
            }
          };
        },
        // return a subset of items
        get = function(name, filters) {
          // impl allowing a single name on a node
          // var keys = ownKeys(registry[name]),
          //     items = reduce(keys, function(memo, next) {
          //       return memo.concat(registry[name][next]);
          //     }, []),
          //     filtered = filter(items, function(item, index, list) {
          //       if(contains(filters, item.type)) {
          //         return item;
          //       }
          //     });
          // impl allowing multiple names on a single node
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
        };

    // register data in the configuration phase
    this.register = register;

    this.$get = [
        '$log',
        function($log) {
          return {
            // can register data in the run phase as well
            register: register,
            // get a registry by its name
            // filter by type, which may be a list.
            get: get
          };
        }];
  }
]);

angular.module('extension-registry')
  .directive('extensionOutput', function() {

    return {
      restrict: 'AE',
      scope: true,
      transclude: true,
      templateUrl: '__extension-output.html',
      controller: [
        '$scope',
        'extensionInput',
        function($scope, extensionInput) {

          // use the attrs to filter out the registry,
          this.initialize = function(name, filters) {
            $scope.items = extensionInput.get(name, filters);
          };
        }
      ],
      link: function($scope, $elem, $attrs, ctrl) {
        var name = $attrs.extensionName,
            filters = $attrs.extensionTypes && $attrs.extensionTypes.split(' ') || [];
        ctrl.initialize(name, filters);
      }
    };
  });

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
