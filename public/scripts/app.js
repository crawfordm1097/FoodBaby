var app = angular.module('foodBaby', ['ngRoute']);


app.controller('ListingsCtrl', ($scope, $http) => {
  $http.get('/api/listings').then((response) => {
      $scope.listings = response.data;
  }, (error) => {
    console.log('Unable to retrieve listings: ', error);
  });

  $http.get('/api/listings/recent').then((response) => {
    $scope.recent = response.data;
  }, (error) => {
    console.log('Unable to retrieve listings: ', error);
  });

  $scope.view = function(id) {
    window.location = `/api/listings/id/${id}`;
  }
});


app.config(function($routeProvider) {

  $routeProvider
    .when('/', {
      templateUrl : '../main.html',
      controller  : 'ListingsCtrl'
    })
    .when('/signup', {
      templateUrl : '../signup.html',
      controller  : 'LoginController'  // TO DO
    })
    .when('/login', {
      templateUrl : '../login.html',
      controller  : 'LoginController'
    })
    .when('/events', {
      templateUrl : '../events.html',
      controller : 'EventsController'
    })

});

app.controller('LoginController',  function($scope, $http){

  $scope.login = function(){
      $http.post('/login/auth', $scope.user).then((response) => { // on success
        console.log("Successful login");
        console.log(user);
      }, (error) =>{
        console.log(error);
      });
  };

});


app.controller('SignUpController',  function($scope, $http){

  $scope.login = function(){
      $http.post('/login/auth', $scope.user).then((response) => { // on success
        console.log("Successful login");
        console.log(user);
      }, (error) =>{
        console.log(error);
      });
  };

});

app.controller('EventsController', function ($scope, $http) {
    $scope.sortByOccurence = function (listing, includePast) {
            var now = new Date();
            var curr = new Date(listing.time.end);

            if ((includePast && curr < now) || (!includePast && curr > now)) {
                return listing;
            }
    }

});

app.directive("mapbox", function() {
  return {
      restrict: 'E',
      link: function (scope, element, attributes) {
          mapboxgl.accessToken = 'pk.eyJ1IjoiZm9vZGJhYnlnMiIsImEiOiJjam10YTdtNjAwNWg2M3dwMWw3am14emhzIn0.dlnV1DEKRSxnKRwa7I2qLw';
          var map = new mapboxgl.Map({
              container: 'map',
              style: 'mapbox://styles/mapbox/streets-v10',
              center: [-82.35256285341353, 29.641654178244437],
              zoom: 13.6868419678297,
              minZoom: 13
          });
      }
  }

})