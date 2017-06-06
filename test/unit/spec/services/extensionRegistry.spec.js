'use strict';

describe('angularExtensionRegistry', () => {
  var extensionRegistry;
  var rootScope;

  beforeEach(angular.mock.module('extension-registry'));
  beforeEach(angular.mock.inject(function($rootScope, _extensionRegistry_) {
      extensionRegistry = _extensionRegistry_;
      rootScope = $rootScope;
  }));

  describe('.add()', () => {
      describe('when a data object is registered to an endpoint', () => {
        it('should be able to get the object from the endpoint', () => {
          var endpointName = 'test-endpoint';
          var textFilter = ['text'];
          var endpointArgs = ['foo', 'bar'];
          // TODO: shouldn't have to pass a limit at all
          var endpointLimit = 50;
          var data = [{
            type: 'text',
            text: 'This is some text'
          }];

          extensionRegistry.add(endpointName, () => {
            return data;
          });

          extensionRegistry
            .get(endpointName, textFilter, endpointArgs, endpointLimit)
            .then((items) => {
              expect(items.length).toEqual(1);
            });

          rootScope.$digest();
        });
      });

      describe('when multiple data objects with different types are registered to an endpoint', () => {
        var endpointName = 'test-endpoint';
        var allFilters = ['text', 'link', 'dom', 'other'];
        var highLimit = 5000;
        var endpointArgs = ['foo', 'bar'];
        var data = [
          {type: 'text'},
          {type: 'text'},
          {type: 'link'},
          {type: 'link'},
          {type: 'dom'},
          {type: 'other'}
        ];
        // helper so we can grow the text cases
        var typeCounter = function(items, types) {
          types = _.isArray(types) ? types : [types];
          return _.reduce(
                  items,
                  function(result, next) {
                    if(_.includes(types, next.type)) {
                      result++;
                    }
                    return result;
                  }, 0);
        };

        it('should be able to limit the number of objects retrieved', () => {
          extensionRegistry.add(endpointName, () => {
            return data;
          });
          // test a few arbitrary limits
          extensionRegistry
            .get(endpointName, allFilters, endpointArgs, 1)
            .then((items) => {
              expect(items.length).toEqual(1);
            });
          extensionRegistry
            .get(endpointName, allFilters, endpointArgs, 2)
            .then((items) => {
              expect(items.length).toEqual(2);
            });
          extensionRegistry
            .get(endpointName, allFilters, endpointArgs, 5)
            .then((items) => {
              expect(items.length).toEqual(5);
            });

          rootScope.$digest();
        });

        it('should be able to filter the retrieved items by type', () => {
          var toTest = [
            // single
            ['text', typeCounter(data, 'text')],
            ['link', typeCounter(data, 'link')],
            ['dom', typeCounter(data, 'dom')],
            ['other', typeCounter(data, 'other')]
          ];

          extensionRegistry.add(endpointName, () => {
            return data;
          });

          // toTest = an array of arrays of 1. a filter type and 2. an expected count
          _.each(toTest, (filterToTest) => {
            var filter = [_.first(filterToTest)];
            var count = _.last(filterToTest);
            extensionRegistry
              .get(endpointName, filter, endpointArgs, highLimit)
              .then((items) => {
                expect(items.length).toEqual(count);
              });
          });

          rootScope.$digest();
        });

        it('should be able to filter items by multiple types', function() {
          var toTest = [
            [['text', 'link'], typeCounter(data, ['text', 'link'])],
            [['dom', 'other'], typeCounter(data, ['dom', 'other'])],
          ];

          extensionRegistry.add(endpointName, () => {
            return data;
          });

          // toTest = an array of arrays of 1. a filter type and 2. an expected count
          _.each(toTest, (filterToTest) => {
            var filter = _.first(filterToTest);
            var count = _.last(filterToTest);
            extensionRegistry
              .get(endpointName, filter, endpointArgs, highLimit)
              .then((items) => {
                expect(items.length).toEqual(count);
                expect(_.includes(items, {type: 'foo'})).toEqual(false);
                expect(_.includes(items, {type: 'bar'})).toEqual(false);
              });
          });

          rootScope.$digest();
        });
      });

      describe('when a promise for data objects is registered', () => {
        // TODO: verify data from a resolved promise is included w/other data
        xit('should do....');
      });

      describe('when multiple endpoints are registered', () => {
        // TODO: verify registered data does not leak into other endpoints
        xit('should do...');
      });

      // NOTE: depends on PR #64
      describe('when data items with a weight property are registered', () => {
        xit('should order items by weight', () => {
          // TODO: test a single registry ordering
          // TODO: test multiple registries sorting & ordering
          // TODO; test including a promise resolution
        });
      });

      describe('when there is a delay before data is registered', () => {
        // TODO:
        // - validate an initial set via .notify()
        // - validate an updated set via a later call to .notify()
        // - note that notify is an internal function and prob does not need
        //   a separate describe() entry
      });
  });

  describe('.get()', () => {
    // NOTE: .add() and .get() are tested in unison above
    // it probably makes sense to sort them...
  });

  describe('.remove()', () => {
    describe('when data is deregistered', () => {
      // TODO: verify that .add() returns a handler w/a .remove() method
      // TODO: verify that extensionRegistry.remove(handler) does the same as above
      // TODO: verify other data is not removed if multiple registries
      });
  });

  // NOTE: this is an internal util
  describe('.clean()', () => {
    xit('should clear the registry');
  });

  // NOTE: this is an internal util
  describe('.dump()', () => {
    // TODO; it should probably return a copy of the registry
    // so that it cannot be manipulated
    xit('should return the registry');
  });

  describe('.addType()', () => {
    describe('when a new type is added', () => {
      // TODO:
      xit('should add the type to the template cache');
    });
  });

});
