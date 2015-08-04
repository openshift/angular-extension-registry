angular.module('extension-registry')

.provider('extensionInput', [
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
        toArray = utils.toArray;

    // methods available in provider && service context
    var register = function(name, builderFn) {
          var key = keyStart++;
          if(!registry[name]) {
            registry[name] = {};
          }
          if(builderFn) {
            registry[name][key] = builderFn;
          }
          each(toArray(subscribers), function(fn) {
            fn && fn();
          });
          return {
            deregister: function() {
              delete registry[name][key];
            }
          };
        };

    // provider context export
    this.register = register;

    // service context export
    this.$get = [
        '$log',
        '$q',
        function($log, $q) {
          return {
            register: register,
            get: function(name, filters, args) {
              var names = split(name, ' '),
                  registrations = map(names, function(n) {
                    return registry[n];
                  }),
                  registrationLists = reduce(registrations, function(memo, next, i, list) {
                    var lists = map(ownKeys(next), function(key) {
                      return next[key](args);
                    });
                    return memo.concat(flatten(lists));
                  }, []),
                  flattened = flatten(registrationLists);
              // resolves the promises for objects, then will do the filtering
              return  $q.all(flattened)
                        .then(function() {
                          var args = flatten(slice(arguments));
                          return filter(args, function(item, index, list) {
                                  if(contains(filters, item.type)) {
                                    return item;
                                  }
                                });
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
            }
          };
        }];
  }
]);
