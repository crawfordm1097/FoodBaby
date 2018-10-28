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



