var app = angular.module('foodBaby', ['ngRoute', 'ngMaterial', 'ngMessages']);

app.controller('ListingsCtrl', ($scope, $rootScope, $http, $location, $interval) => {
    $scope.listingsLoaded = false; //Used to control when directive runs (see ng-if in main.html)
    $scope.minDate = new Date();

  $http.get('/api/listings').then((response) => {
    $rootScope.listings = response.data;
    $scope.listingsLoaded = true;
  }, (error) => {
    console.log('Unable to retrieve listings: ', error);
  });

  $http.get('/api/listings/recent').then((response) => {
    $scope.recent = response.data;
  }, (error) => {
    console.log('Unable to retrieve listings: ', error);
  });

  $http.get('/api/locations').then((response) => {
    $scope.locations = response.data;
  }, (error) => {
    console.log('Unable to retrieve locations: ', error);
  });

  $scope.view = function(id) {
    window.location = `/api/listings/id/${id}`;
  }

  $scope.checkForUser = function () {
      if ($rootScope.userData == undefined) {
          $location.path('/login');
      } else {
          $scope.newEvent = {  //Reset newEvent
              date: $scope.minDate,
          };
      }
  }

  $scope.addEvent = function () {
      var event = {
          name: $scope.newEvent.name,
          time: {
              start: buildDate($scope.newEvent.date, $scope.newEvent.startTime),
              end: buildDate($scope.newEvent.date, $scope.newEvent.endTime)
          },
          location: $scope.newEvent.location._id,
          posted_by: $scope.userData._id,
          food_type: $scope.newEvent.foodType
      }

      $http.post('/api/listings', event).then((response) => {
          $('#add-event').modal('hide');

          $http.get('/api/listings').then((response) => { //Refresh listings
              $rootScope.listings = response.data;
          }, (error) => {
              console.log('Unable to refresh listings: ', error);
          });
      }, (error) => {
          console.log('Unable to add event: ',  error);
      })
  }

  $scope.deleteEvent = function (id) {
      $http.delete('/api/listings/id/' + id).then((response) => {
          $http.get('/api/listings').then((response) => { //Refresh listings
              $rootScope.listings = response.data;
          }, (error) => {
              console.log('Unable to refresh listings: ', error);
          });

      }, (error) => {
          console.log('Unable to delete event: ', error);
      })
  }

  $scope.updateEvent = function () {
      var event = {
          name: $rootScope.currEvent.name,
          time: {
              start: buildDate($scope.currEvent.date, $scope.currEvent.startTime),
              end: buildDate($scope.currEvent.date, $scope.currEvent.endTime)
          },
          location: $rootScope.currEvent.location._id,
          food_type: $rootScope.currEvent.foodType
      }

      $http.put('/api/listings/id/' + $rootScope.currEvent.id, event).then((response) => {
          $('#update-event').modal('hide');

          $http.get('/api/listings').then((response) => { //Refresh listings
              $rootScope.listings = response.data;
          }, (error) => {
              console.log('Unable to refresh listings: ', error);
          });
      }, (error) => {
          console.log('Unable to update event: ', error);
      });
  }

  $scope.checkValidTime = function (minDate, startTime, date) {
      if (minDate != undefined && startTime != undefined && date != undefined) {
          var minute = 1000 * 60;
          var start = buildDate(date, startTime);

          return (minDate > start ? new Date(minDate.getTime() + minute) : new Date(start.getTime() + minute));
      }
  }

  $interval(tick, 1000); //Update current time every second

  function tick() {
      $scope.minDate = new Date();
  }

  function buildDate(date, time) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes());
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
    .when('/events', {
        templateUrl : '../events.html',
        controller : 'EventsController'
    })
    .when('/profile', {
      templateUrl : '../profile.html',
      controller  : 'ProfileController'
    })

});

app.controller('SignUpController', function($scope, $location, $http) {
  $scope.signup = function() {
    $scope.usernameExists = false;
    $http({
      method: "POST",
      url: '/api/user/register',
      data: {username:$scope.username, password:$scope.password}
    }).success(function(res) {
      $location.path('/login');
    }).error(function(res) {
      console.log(res);
      $scope.usernameExists = true;
      $location.path('/signup');
    });
  }
  $scope.matchingPasswords = function() {
    return $scope.password === $scope.cpass;
  }
  $scope.validEmail = function() {
    return $scope.username;
  }
});

app.controller('LoginController',  function($scope, $rootScope, $location, $http){


  $scope.login = function(){
    console.log("Attempting Login");

    $scope.hasLoginFailed = false; // flag for error message when login fails

    $http({

      method:"POST",
      url:'/user/login',
      data:{username:$scope.username,password:$scope.password},

    }).success(function(response){

      $rootScope.userData = response;
      console.log("Login successful!");
      $location.path("/events");

    }).error(function(response){

      console.log("Login Failed!");
      $scope.hasLoginFailed = true;
      $location.path("/login");

    });

  };

});

app.controller('EventsController', function ($scope, $rootScope, $http) {
    $rootScope.currEvent;

    $scope.sortByOccurence = function (listing, includePast) {
            var now = new Date();
            var curr = new Date(listing.time.end);

            if ((includePast && curr < now) || (!includePast && curr > now)) {
                return listing;
            }
    }

    $scope.setEvent = function (event) {
        $rootScope.currEvent = {
            name: event.name,
            date: new Date(event.time.start),
            startTime: new Date(event.time.start),
            endTime: new Date(event.time.end),
            location: event.location,
            foodType: event.food_type,
            id: event._id
        }
    }

    $scope.scrollUp = function() {
        $('.event-tab').scrollTop(0);
    }
});

app.directive('mapbox', function() {
  return {
      restrict: 'E',
      replace: true,
      template: "<div id='map' style='width: 100%; height: 100%;'></div>",
      link: function (scope) {
          mapboxgl.accessToken = 'pk.eyJ1IjoiZm9vZGJhYnlnMiIsImEiOiJjam10YTdtNjAwNWg2M3dwMWw3am14emhzIn0.dlnV1DEKRSxnKRwa7I2qLw';
          var map = new mapboxgl.Map({
              container: 'map',
              style: 'mapbox://styles/mapbox/streets-v10',
              center: [-82.35256285341353, 29.641654178244437],
              zoom: 13.6868419678297,
              minZoom: 13
          });

          scope.$watch('listings', function(newValue, oldValue) { //Update markers on update to event

              /* Generates geojson data from the next 20 upcoming events. If events are held at the same location, the objects are merged. */
              (function generateMarkers() {
                  var recentevents = newValue.slice(0, 20);
                  var geojson, index = 0; //track indeces of unique locations
                  var fts = [];
                  var eventmap = new Map();
                  var now = new Date();

                  //create feature json for each event
                  for (var i = 0; i < recentevents.length; i++) {
                      if (now < new Date(recentevents[i].time.end)) { //Ignore past events
                          var curr = eventmap.get(recentevents[i].location.code);
                          var event = { //unique event info
                              title: recentevents[i].name,
                              food_type: recentevents[i].food_type,
                              time: {
                                  start: new Date(recentevents[i].time.start).toLocaleString(), //prettify dates
                                  end: new Date(recentevents[i].time.end).toLocaleString()
                              }
                          };

                          if (curr == undefined) { //first
                              eventmap.set(recentevents[i].location.code, index); //add to map
                              fts[index] = { //add initial object
                                  type: 'feature',
                                  geometry: {
                                      type: 'point',
                                      coordinates: [recentevents[i].location.coordinates.longitude, recentevents[i].location.coordinates.latitude]
                                  },
                                  properties: {
                                      events: [], //holds all unique event info for each event at location
                                      location: {
                                          name: recentevents[i].location.name,
                                          code: recentevents[i].location.code
                                      }
                                  }
                              }

                              fts[index].properties.events.push(event);

                              index++;
                          } else { //duplicate
                              fts[curr].properties.events.push(event);
                          }
                      }
                  }

                  //create geojson
                  geojson = {
                      type: 'featurecollection',
                      features: fts
                  };

                  createMarker(geojson);
              })();

              /* Adds markers to the map for every feature within geojson object.*/
              function createMarker(geojson) {
                  geojson.features.forEach(function (marker) {
                      var html = '';

                      marker.properties.events.forEach(function (event) { //Create list of event info
                          html += '<h3>' + event.title + '</h3><p><b>' + marker.properties.location.name + ' (' + marker.properties.location.code + ')</b></p><p>'
                                      + event.time.start + ' - ' + event.time.end + '</p><p>'
                                      + event.food_type + '</p>'
                      });

                      new mapboxgl.Marker({ color: "000000" })
                        .setLngLat(marker.geometry.coordinates)
                        .setPopup(new mapboxgl.Popup({ offset: 25 }) //add popups
                        .setHTML(html))
                        .addTo(map);
                  });
              }
          }, true);
      }
  }

})
