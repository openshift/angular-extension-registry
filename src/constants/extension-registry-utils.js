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
