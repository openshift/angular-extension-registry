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
