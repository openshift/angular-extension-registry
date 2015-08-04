angular.module('myapp')
.config([
  'extensionInputProvider',
  function(extensionInputProvider) {

    var clickCount = 1;

    var extensionsMain = [
      {
        type: 'text',
        output: 'This is text only.',
        className: 'test'
      },
      {
        type: 'html',
        output: '<p><strong>Stuff</strong> and things.  Rendered HTML</p>',
        className: 'stuff-and-things test'
      },
      {
        type: 'link',
        link: 'http://google.com',
        target: '_blank',
        displayName: 'Google',
        className: 'link-class test'
      },
      {
        type: 'link',
        link: 'http://openshift.com',
        className: 'foo bar baz test',
        displayName: 'link with fn',
        fn: function(args) {
          list = JSON.parse(args);
          alert('you have clicked this ' + (clickCount++) + ' times');
          console.log('args', list[0], list[1]);
        }
      },
      {
        type: 'select',
        displayName: 'some list',
        defaultVal: 'something',
        className: 'i am a select box test',
        options: [
          {
            label: 'foo',
            value: 'bar',
            className: 'shizzle first option test'
          },{
            label: 'thing',
            value: 'thing'
          },{
            label: 'other',
            value: 'other'
          },
        ]
      },
    ];

    extensionInputProvider.register('main', extensionsMain);
}]);
