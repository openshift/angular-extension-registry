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
    'things',
    function($scope, things) {
      things.get()
            .success(function(data) {
              angular.extend($scope, {
                items: data
              });
            });
    }
  ])
