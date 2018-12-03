var app = angular.module('foodBaby', ['ngRoute', 'ngMaterial', 'ngMessages', 'ngStorage']);

app.controller('ListingsCtrl', ($scope, $rootScope, $http, $location, $interval, $localStorage) => {
    $scope.listingsLoaded = false; //Used to control when directive runs (see ng-if in main.html)
    $scope.minDate = new Date();

    /*
        userdata is stored persistently in localstorage.
        $storage and $localstorage  are automatically synchronized.
    */
    $scope.$storage = $localStorage.$default({ userData: undefined, userListings: undefined, });

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

  $scope.$on('$routeChangeStart', function(event, route) {
      if (route.requireAuth && !$scope.$storage.userData)    // verify if user is authorized to access the route
            $location.path("/login");
  });

  $scope.checkForUser = function () {
      if ($scope.$storage.userData == undefined) {
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
          posted_by: $scope.$storage.userData._id,
          room: $scope.newEvent.roomNum,
          info: $scope.newEvent.info,
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
          room: $rootScope.currEvent.roomNum,
          food_type: $rootScope.currEvent.foodType,
          info: $rootScope.currEvent.info
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

   $scope.getProfile = function(){
    $http.get('/api/listings/user').success(function(response){
      $scope.$storage.userListings = response;
      $location.path("/profile");
    }).error(function(){
      $location.path("/login");
    });
  };

  $scope.logout = function(){
    $http.post('/user/logout').success(function(response){
        $localStorage.$reset();
        $location.path("/");
    }).error(function(response){
        $location.path("/");
    });
  };

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
      controller  : 'ProfileController',
      requireAuth : true,
    })
    .when('/account', {
        templateUrl : '../account.html',
        controller  : 'PasswordController',
        requireAuth : true,
    })
});

app.controller('SignUpController', function($scope, $location, $http) {
  $scope.signup = function() {
    $scope.usernameExists = false;
    $http.post('/api/user/register', {username:$scope.username, password:$scope.password}).success(function(res) {
      $location.path('/login');
    }).error(function(res) {
      console.log(res);
      $scope.usernameExists = true;
      $location.path('/signup');
    });
  }
  $scope.matchingPasswords = function() {
    return !$scope.password || !$scope.cpass
           || ($scope.password === $scope.cpass);
  }
});

app.controller('LoginController',  function($scope, $rootScope, $location, $http){

  $scope.login = function(){
    $scope.hasLoginFailed = false; // flag for error message when login fails

    $http.post('/user/login', {username:$scope.username,password:$scope.password}).success(function(response){
      $scope.$storage.userData = response;
      $location.path("/events");
    }).error(function(){
      $scope.hasLoginFailed = true;
      $location.path("/login");
    });
  };

});

app.controller('PasswordController', function($scope, $rootScope, $location, $http) {
    $scope.passwordMatches = true;
    $scope.validOldPassword = true;
    $scope.passwordChanged = false;
    $scope.account = {};

    $scope.matchPassword = function() {
        $scope.passwordMatches = $scope.account.newPassword == $scope.account.confirmNewPassword;
        return $scope.passwordMatches;
    };

    $scope.changePassword = function() {
      $http.put('/user/upasswd',{oldPassword:$scope.account.oldPassword,newPassword:$scope.account.newPassword}).success(function(res) {
        $scope.account.oldPassword = "";
        $scope.account.newPassword = "";
        $scope.account.confirmNewPassword = "";
        $scope.passwordChanged = true;
      }).error(function(res) {
        $scope.passwordMatches = true;
        $scope.validOldPassword = false;
        $location.path('/account');
      });
    }
});

app.controller('ProfileController',  function($scope, $rootScope, $location, $http){
  $scope.score = 0;
  $http.get('/api/user/karma/' + $scope.$storage.userData._id).then((res) => {
    $scope.score = res.data[0].count;
  });

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
});

app.controller('EventsController', function ($scope, $rootScope,  $location, $http) {
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
            roomNum: event.room,
            foodType: event.food_type,
            info: event.info,
            id: event._id
        }
    }

    $scope.scrollUp = function() {
        $('.event-tab').scrollTop(0);
    }

    // handles event upvote and downvote
    $rootScope.vote = function(listing){
        let event_id = listing._id;

        if(!$scope.$storage.userData){
            $location.path("/login");
        }else{
            $http.post('/api/user/vote/', {listing_id: event_id}).success(function(response){
                listing.meta.score += response.count;
            });
        }
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
                              },
                              info: recentevents[i].info,
                              room: recentevents[i].room
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

                      marker.properties.events.forEach(function(event) { //Create list of event info
                          html += '<h3>' + event.title + '</h3><p><b>' + (event.room == undefined ? '' : event.room + ' ') + marker.properties.location.name + ' (' + marker.properties.location.code + ')</b></p><p>'
                                      + event.time.start + ' - ' + event.time.end + '</p><p>'
                                      + event.food_type + '</p>' + (event.info == undefined ? '' : '<p>' + event.info + '</p>')
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
