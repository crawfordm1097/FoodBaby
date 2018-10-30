var app = angular.module('foodBaby', []);

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

