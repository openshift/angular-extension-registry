angular.module('extension-registry')

.provider('extensionInput', [
  'extensionRegistryUtils',
  function(utils) {
    var registry = {},
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

    var register = function(name, list) {
          var key = keyStart++;
          if(!registry[name]) {
            registry[name] = {};
          }
          if(list) {
            registry[name][key] = list;
          }
          return {
            deregister: function() {
              delete registry[name][key];
            }
          };
        },
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
        };

    this.register = register;

    this.$get = [
        '$log',
        function($log) {
          return {
            register: register,
            get: get
          };
        }];
  }
]);
