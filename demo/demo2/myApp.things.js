// Simply a service/controller to
// provide the template with some dummy objects
// for prototyping
angular.module('myapp')
  .factory('things', [
    '$http',
    function($http) {
      return {
        get: function() {
          return $http.get('/demo/mocks/things.json');
        }
      }
    }
  ])
  .controller('controller.things', [
    '$scope',
    '$timeout',
    'things',
    function($scope, $timeout, things) {
      things
        .get()
        .success(function(data) {
          angular.extend($scope, {
            items: data.slice(0,2)
          });
          // force an arbitrary data update to test two way binding
          $timeout(function() {
            angular.extend($scope, {
              items: data.slice(2)
            });
          }, 2000)
        });



    }
  ])
