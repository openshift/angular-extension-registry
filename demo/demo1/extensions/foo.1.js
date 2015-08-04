angular.module('myapp')
.config([
  'extensionInputProvider',
  function(extensionInputProvider) {

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

    extensionInputProvider.register('foo', extensionsFoo);

}]);
