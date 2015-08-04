angular.module('myapp')
.config([
  'extensionInputProvider',
  function(extensionInputProvider) {

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


    extensionInputProvider.register('bar', extensionsBar);

}]);
