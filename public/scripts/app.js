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
      controller  : 'SignUpController'
    })
    .when('/login', {
      templateUrl : '../login.html',
      controller  : 'LoginController'
    })
    .when('/profile', {
      templateUrl : '../profile.html',
      controller  : 'ProfileController'
    })

});

app.controller('LoginController',  function($scope, $location, $http){

 
  $scope.login = function(){
    console.log("Attempting Login");

    $scope.hasLoginFailed = false; // flag for error message when login fails

    $http({
      
      method:"POST",
      url:'/user/login',
      data:{username:$scope.username,password:$scope.password},

    }).success(function(response){

      $scope.userData = response;
      console.log("Login successful!");
      $location.path("/profile");

    }).error(function(response){

      console.log("Login Failed!");
      $scope.hasLoginFailed = true;
      $location.path("/login");

    });

  };

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