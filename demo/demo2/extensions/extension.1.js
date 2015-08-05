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

            // simulate async
            return $q.when([
              {
                type: 'link',
                href: 'http://google.com',
                displayName: name + 'google link',
                target: '_blank'
              },
              {
                type: 'link',
                displayName: name + 'google alert',
                onClick: function() {
                  alert('google!');
                }
              },
              {
                type: 'not_a_thing_i_can_be',
                href: 'http://example.com',
                displayName: name + 'i should never appear',
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
              displayName: name + 'redhat link',
              target: '_blank'
            },
            {
              type: 'link',
              displayName: name + 'redhat alert',
              onClick: function() {
                alert('redhat!');
              }
            }
          ]);
        })
      ];

      // delay and then deregister one to ensure UI updates
      $timeout(function() {
        registries[0].deregister();
      }, 4000);



    }
  ]);
