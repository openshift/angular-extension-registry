angular.module('myapp', [
  'extension-registry'
])

.config([
  function() {
    // nothing to do here, ATM
  }
])
.controller('myController', function() {
  console.log('hello', 'world');
});
