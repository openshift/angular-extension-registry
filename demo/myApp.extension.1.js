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
        fn: function() {
          alert('you have clicked this ' + (clickCount++) + ' times');
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


    var extensionsSidebar = [
      {
        type: 'text',
        output: 'This is sidebar text 1.',
        className: 'test'
      },
      {
        type: 'text',
        output: 'This is sidebar text 2',
        className: 'test'
      },
    ];


    var extensionsFooter = [
      {
        type: 'text',
        output: 'This is footer text 1.',
        className: 'test'
      },
      {
        type: 'text',
        output: 'This is footer text 2',
        className: 'test'
      },
    ];


    // 5 items for foo
    var extensionsFoo = [
      {
        type: 'text',
        output: 'This is text one.',
        className: 'test'
      },
      {
        type: 'text',
        output: 'This is text two.',
        className: 'test'
      },
      {
        type: 'text',
        output: 'This is text three.',
        className: 'test'
      },
      {
        type: 'select',
        displayName: 'foo select 1',
        defaultVal: 'something',
        className: 'i am a select box test',
        options: [
          {
            label: 'foo 1 - 1',
            value: 'bar',
            className: 'shizzle first option test'
          },{
            label: 'foo 1 - 2',
            value: 'thing'
          },{
            label: 'foo 1 - 3',
            value: 'other'
          },
        ]
      },
      {
        type: 'select',
        displayName: 'foo select 2',
        defaultVal: 'something',
        className: 'i am a select box test',
        options: [
          {
            label: 'foo 2 - 1',
            value: 'bar',
            className: 'shizzle first option test'
          },{
            label: 'foo 2 - 2',
            value: 'thing'
          },{
            label: 'foo 2 - 3',
            value: 'other'
          },
        ]
      }
    ];

    // 2 items for bar
    var extensionsBar = [
      {
        type: 'text',
        output: 'This is text one.',
        className: 'test'
      },
      {
        type: 'select',
        displayName: 'bar select 1',
        defaultVal: 'something',
        className: 'i am a select box test',
        options: [
          {
            label: 'bar 1 - 1',
            value: 'bar',
            className: 'shizzle first option test'
          },{
            label: 'bar 1 - 2',
            value: 'thing'
          },{
            label: 'bar 1 - 3',
            value: 'other'
          },
        ]
      }
    ];

    // now, to add data.
    // this would be for internal use.
    extensionInputProvider.register('main', extensionsMain);
    extensionInputProvider.register('main', extensionsMain);
    extensionInputProvider.register('main', extensionsMain);
    extensionInputProvider.register('sidebar-left', extensionsSidebar);
    extensionInputProvider.register('footer', extensionsFooter);
    extensionInputProvider.register('foo', extensionsFoo);
    extensionInputProvider.register('bar', extensionsBar);
}]);
