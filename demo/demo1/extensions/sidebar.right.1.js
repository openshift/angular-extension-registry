angular.module('myapp')
.config([
  'extensionRegistryProvider',
  function(extensionRegistryProvider) {

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

    extensionRegistryProvider.register('sidebar-left', extensionsSidebar);

}]);
