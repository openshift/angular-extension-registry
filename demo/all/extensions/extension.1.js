/* jshint unused: false */
(function() {
  'use strict';

  angular.module('myapp')
    .factory('aFactory', function() {

    })
    .run([
      '$q',
      '$timeout',
      'extensionRegistry',
      'things',
      function($q, $timeout, extensionRegistry, things) {

          // collecting all the registered extensions in an array
          var registries = [

            // illustrates returning nothing, but using the extension hook to
            // do some arbitrary work with the provided args as context
            extensionRegistry.add('thing', function(args) {
              args.name.last = args.name.last.toUpperCase();
              return undefined;
            }),

            // illustrates returning a single object, rather than an array
            extensionRegistry.add('thing', function(args) {
              return {
                type: 'text',
                text: 'this is some text'
              };
            }),

            // illustrates the html type
            extensionRegistry.add('thing', function(args) {
              return [
                {
                  type: 'dom',
                  node: [
                          '<div>',
                          args.name.first,
                          ' is an employee.'
                        ].join('')
                }
              ];
            }),

            // illustrates returning a list rather than a single object
            extensionRegistry.add('thing', function(args) {
              return [
                {
                  type: 'select',
                  nameText: 'select-name',
                  className: 'i am a select box test',
                  options: [
                    {
                      label: 'bar 1 - 1',
                      value: 'bar'
                    },{
                      label: 'bar 1 - 2',
                      value: 'thing'
                    },{
                      label: 'bar 1 - 3',
                      value: 'other'
                    }
                  ],
                  // a select box gets an onChange function
                  // note that deregistering a function will trigger a change
                  // event as well as re-render the UI.  A select will be
                  // reset to an initial state, possibly undesirable for
                  // a user in the midst of an interaction.
                  onChange: function(item) {
                    console.log('selected', item);
                  }
                }
              ];
            }),

            // illustrates returning a promise, such as would be done
            // if making an API call
            extensionRegistry.add('thing', function(args) {
              return $q.when([
                {
                  type: 'link',
                  href: 'http://redhat.com',
                  linkText: name + 'redhat link',
                  target: '_blank'
                },
                {
                  type: 'link',
                  linkText: name + 'redhat alert',
                  onClick: function() {
                    alert('redhat!');
                  }
                }
              ]);
            }),

            // illustrates doing some arbitrary work & a promise for a
            // list of extensions....
            extensionRegistry.add('thing', function(args) {
              // doing a little arbitrary work inside a registered function
              var name;
              if(args) {
                if(args.name && args.name.first) {
                  name = [
                    args.name.first,
                    ' ',
                    args.name.last,
                    '\'s '
                  ].join('');
                } else {
                  name = args.name + '\'s ';
                }
              }

              // simulate async operation, such as an API call
              return $q.when([
                {
                  type: 'link',
                  href: 'http://google.com',
                  linkText: name + 'google link',
                  target: '_blank'
                },
                {
                  type: 'link',
                  linkText: name + 'google alert',
                  onClick: function() {
                    alert('google!');
                  }
                },
                {
                  type: 'not_a_thing_i_can_be',
                  href: 'http://example.com',
                  linkText: name + 'i should never appear',
                  target: '_blank'
                },
              ]);
            }),
            // illustrates an actual service call using data from `/mocks`
            extensionRegistry.add('thing', function(args) {
              return things
                      .get()
                      .then(function(response) {
                        var map = [];
                        angular.forEach(response.data, function(item) {
                          map.push({
                            type: 'text',
                            text: 'Hi, I am ' + item.name.first + ' ' + item.name.last
                          });
                        });
                        return map;
                      });

            })
          ];


        // test some side cases
        // you must register a function, but should not error out...
        extensionRegistry.add('thing');
        extensionRegistry.add('thing', []);

        // the registry system is tolerant of errors to avoid one extension
        // causing other extensions to fail.  registering an error or returning
        // an error will do nothing.
        extensionRegistry.add('thing', new Error('Oh no, it broke!'));
        extensionRegistry.add('thing', function() {
          return new Error('Oh no, bad things!!!!');
        });

        // deregistering will trigger a UI update & re-render
        // will see items disappear on screen as this extension
        // is eliminated
        $timeout(function() {
          // handle itself can remove itself
          console.log('removing', 'registries[1]');
          registries[1].remove();
        }, 4000);
        $timeout(function() {
          // extension registry also knows how to remove a handle
          console.log('removing', 'registries[2]');
          extensionRegistry.remove(registries[2]);
        }, 8000);

      }
    ]);

})();
