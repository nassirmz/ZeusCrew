angular.module('gservice', [])
    .factory('gservice', function($http) {

      var googleMapService = {};

      // Functions
      // --------------------------------------------------------------

      // Initialize the map
      var map, directionsDisplay;
      var directionsService = new google.maps.DirectionsService();

      var initialize = function () {
        directionsDisplay = new google.maps.DirectionsRenderer();
        var SF = new google.maps.LatLng(37.7749, -122.4194);
        var mapOptions = {
          zoom: 7,
          center: SF
        };
        map = new google.maps.Map(document.getElementById('map'), mapOptions);
        directionsDisplay.setMap(map);
      };

      //get waypoints
      var getWaypoints = function (waypointArray, numStops) {
        var points = [];
        var stopDistance = Math.floor(waypointArray.length / (numStops + 1));
        for (i = 0; i < numStops; i++) {
          points.push(stopDistance + (stopDistance * i));
        }

        //initialize an empty array to hold our waypoints  
        var waypoints = [];
        points.forEach(function (index) {
          //each waypoint will be an object with a lat and lng
          var waypoint = {
            lat: waypointArray[index].lat(),
            lng: waypointArray[index].lng()
          };
          waypoints.push(waypoint);
        });
        return waypoints;
      };

      // Refresh, to re-initialize the map.
      // New data could be passed to initialize here
      googleMapService.refresh = function () {
        initialize();
      };

      // Refresh the page upon window load.
      google.maps.event.addDomListener(window, 'load',
        googleMapService.refresh());

      //calculate a route
      googleMapService.calcRoute = function (start, end, numStops) {
        var request = {
          origin: start,
          destination: end,
          travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route (request, function(result, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            var stops = [];
            var waypoints = getWaypoints(result.routes[0].overview_path, numStops);
            waypoints.forEach(function (w) {
              stops.push({
                location: new google.maps.LatLng(w.lat, w.lng),
                stopover: true
              });
            });
            var wyptRequest = {
              origin: start,
              destination: end,
              waypoints: stops,
              optimizeWaypoints: true,
              travelMode: google.maps.TravelMode.DRIVING
            };
            directionsService.route(wyptRequest, function(response, status) {
              if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                var route = response.routes[0];
              }
            });
          }
        });
      };


      return googleMapService;
    });