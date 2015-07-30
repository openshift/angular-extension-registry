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
