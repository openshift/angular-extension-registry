angular.module('myapp')
  .factory('aFactory', function() {

  })
  .run([
    '$q',
    'extensionInput',
    function($q, extensionInput) {

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

            // this probably needs to be able to call
            // a few APIs... who knows.
            // but, very important that args are used to generate
            // what is finally returned
            //
            // TODO:
            // also test $q.all([promise, promise, promise])
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
        });

        extensionInput.register('thing', function(args) {
          console.log('args', args);

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
        });

    }
  ]);
