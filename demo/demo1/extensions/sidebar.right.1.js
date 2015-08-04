angular.module('myapp')
.config([
  'extensionInputProvider',
  function(extensionInputProvider) {

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

    extensionInputProvider.register('sidebar-left', extensionsSidebar);

}]);
