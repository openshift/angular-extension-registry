angular.module('myapp')
  .factory('aFactory', function() {

  })
  .run([
    '$q',
    '$timeout',
    'extensionInput',
    function($q, $timeout, extensionInput) {

        var registries = [
          extensionInput.register('thing', function(args) {
            var name;
            if(args) {
              if(args.name && args.name.first) {
                // builds:
                //   Conroy Cage's
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

            // simulate async
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
        // ensure a second block of items still works.
        extensionInput.register('thing', function(args) {
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
        extensionInput.register('thing', function(args) {
          // illustrates can return a list rather than a promise
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
              onChange: function(item) {
                console.log('selected', item);
              }
            }
          ];
        }),
        extensionInput.register('thing', function(args) {
          return [
            {
              type: 'html',
              html: [
                      '<div>',
                      args.name.first,
                      ' is an employee.'
                    ].join('')
            }
          ]
        }),
        extensionInput.register('thing', function(args) {
          // note: illustrates you can return an object
          // or an array
          return {
            type: 'text',
            text: 'this is some text'
          }
        }),
        extensionInput.register('thing', function(args) {
          console.log('Returns nothing, but can do work', args);
          return undefined;
        })
      ];


      // test some side cases
      // you must register a function, but should not error out...
      extensionInput.register('thing');
      extensionInput.register('thing', []);

      // delay and then deregister one to ensure UI updates
      $timeout(function() {
        registries[0].deregister();
      }, 4000);



    }
  ]);
