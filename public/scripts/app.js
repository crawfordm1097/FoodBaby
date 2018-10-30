var app = angular.module('foodBaby', []);

app.controller('ListingsCtrl', ($scope, $http) => {
  $http.get('/api/listings').then((response) => {
      $scope.listings = response.data;
      var recentevents = $scope.listings.slice(0, 20);
      var geojson;
      var fts = [];

      //create feature json for each event
      for (var i = 0; i < recentevents.length; i++) {
          fts[i] = {
              type: 'feature',
              geometry: {
                  type: 'point',
                  coordinates: [recentevents[i].location.coordinates.latitude, recentevents[i].location.coordinates.longitude]
              },
              properties: {
                  title: recentevents[i].name,
                  food_type: recentevents[i].food_type,
                  time: {
                      start: recentevents[i].time.start,
                      end: recentevents[i].time.end
                  },
                  location: recentevents[i].location.address
              }
          };
      }

      //create geojson
      geojson = {
          type: 'featurecollection',
          features: fts
      };

      //createMarker(geojson); //Call create marker (defined in mapbox.js)
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

