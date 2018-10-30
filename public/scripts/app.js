var app = angular.module('foodBaby', []);

app.controller('ListingsCtrl', ($scope, $http) => {
  $http.get('/api/listings').then((response) => {
      $scope.listings = response.data;
      generateMarkers();
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

  /* Generates geojson data from the next 20 upcoming events. If events are held at the same location, the objects are merged. 
  */
  function generateMarkers() {
      var recentevents = $scope.listings.slice(0, 20);
      var geojson, index = 0; //Track indeces of unique locations
      var fts = [];
      var eventMap = new Map();

      //create feature json for each event
      for (var i = 0; i < recentevents.length; i++) {
          var curr = eventMap.get(recentevents[i].location.code);
          var event = { //Unique event info
              title: recentevents[i].name,
              food_type: recentevents[i].food_type,
              time: {
                  start: new Date(recentevents[i].time.start).toLocaleString(), //Prettify dates
                  end: new Date(recentevents[i].time.end).toLocaleString()
              }
          };

          if (curr == undefined) { //First
              eventMap.set(recentevents[i].location.code, index); //Add to map
              fts[index] = { //Add initial object
                  type: 'feature',
                  geometry: {
                      type: 'Point',
                      coordinates: [recentevents[i].location.coordinates.longitude, recentevents[i].location.coordinates.latitude]
                  },
                  properties: {
                      events: [], //Holds all unique event info for each event at location
                      location: {
                          name: recentevents[i].location.name,
                          code: recentevents[i].location.code
                      }
                  }
              }

              fts[index].properties.events.push(event);

              index++;
          } else { //Duplicate
              fts[curr].properties.events.push(event);
          }
      }

      //create geojson
      geojson = {
          type: 'featurecollection',
          features: fts
      };

      createMarker(geojson); //Call create marker (defined in mapbox.js)
  }

});

