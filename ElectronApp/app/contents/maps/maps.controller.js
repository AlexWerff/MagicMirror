angular.module('magicMirrorApp')
    .controller('MapsController', ['$rootScope', '$scope', '$http', '$routeParams', '$timeout', '$window', 'NgMap', MapsController])

function MapsController($rootScope, $scope, $http, $routeParams, $timeout, $window, NgMap) {
    $scope.currentPosition = [40.74, -74.18];
    $scope.zoomLevel = 14;
    $scope.routes = [];
    $scope.markers = [];
    $scope.loading = true;
    $rootScope.$broadcast("start-loading");
    $scope.currentLocationName = "";
    $scope.initialized = false;

    $scope.mapStyle = [
        {
            "featureType": "landscape.man_made",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#f7f1df"
            }
        ]
    },
        {
            "featureType": "landscape.natural",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#d0e3b4"
            }
        ]
    },
        {
            "featureType": "landscape.natural.terrain",
            "elementType": "geometry",
            "stylers": [
                {
                    "visibility": "off"
            }
        ]
    },
        {
            "featureType": "poi",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
            }
        ]
    },
        {
            "featureType": "poi.business",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
            }
        ]
    },
        {
            "featureType": "poi.medical",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#fbd3da"
            }
        ]
    },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#bde6ab"
            }
        ]
    },
        {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "visibility": "off"
            }
        ]
    },
        {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
            }
        ]
    },
        {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#ffe15f"
            }
        ]
    },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#efd151"
            }
        ]
    },
        {
            "featureType": "road.arterial",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#ffffff"
            }
        ]
    },
        {
            "featureType": "road.local",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "black"
            }
        ]
    },
        {
            "featureType": "transit.station.airport",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#cfb2db"
            }
        ]
    },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#a2daf2"
            }
        ]
    }
];



    var setCurrentLocation = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (pos) {
                $scope.currentPosition = [pos.coords.latitude, pos.coords.longitude];
                $scope.loading = false;
                $rootScope.$broadcast("stop-loading");
                $scope.currentLocationName = "Current Location";
            });
        }
    }

    setCurrentLocation();


    var getLatLngFromCity = function (city) {
        $http.get("http://maps.googleapis.com/maps/api/geocode/json?address=" + city + "&sensor=true")
            .success(function (data) {
                var lat = data.results[0].geometry.location.lat;
                var lng = data.results[0].geometry.location.lng;
                $scope.currentPosition = [lat, lng];
                $scope.loading = false;
                $rootScope.$broadcast("stop-loading");
            });
    };


    var getRouteFromTo = function (from, to) {
        $scope.infoText = "Route from " + from + " to " + to;
        $scope.routes = [];
        $http.get("https://maps.googleapis.com/maps/api/directions/json?origin=" + from + "&destination=" + to + "&key=AIzaSyB1qsYvxrUe9W-GZazvtFZqm6SqY4cOEZs", config)
            .success(function (data) {
                var newRoute = {
                    name: $scope.infoText,
                    locationPoints: [],
                    startMarker: {
                        name: from,
                        pos: [data.routes[0].legs[0].start_location.lat, data.routes[0].legs[0].start_location.lng]
                    },
                    endMarker: {
                        name: to,
                        pos: [data.routes[0].legs[0].end_location.lat, data.routes[0].legs[0].end_location.lng]
                    },
                    distance: "2 KM",
                    time: "5:03 H"
                }
                $scope.currentPosition = newRoute.startMarker.pos;
                $scope.markers.push(newRoute.startMarker);
                $scope.markers.push(newRoute.endMarker);
                data.routes[0].legs[0].steps.forEach(function (step) {
                    newRoute.locationPoints.push([step.start_location.lat, step.start_location.lng]);
                    newRoute.locationPoints.push([step.end_location.lat, step.end_location.lng]);
                });
                $scope.routes.push(newRoute);
            });
    }

    $scope.$on("voice-goTo", function (event, data) {
        $scope.$apply(function () {
            $scope.loading = true;
            $rootScope.$broadcast("start-loading");
            if (data.value.toUpperCase() === "CURRENT LOCATION") {
                setCurrentLocation();
            } else {
                $scope.currentLocationName = data.value;
                getLatLngFromCity(data.value);
            }
        });
    });

    $scope.$on("voice-zoomIn", function (event, data) {
        $scope.$apply(function () {
            $scope.zoomLevel += 2;
        });
    });

    $scope.$on("voice-zoomOut", function (event, data) {
        $scope.$apply(function () {
            $scope.zoomLevel -= 2;
        });
    });


    $scope.$on("voice-startListening", function (event, data) {
        if (!$scope.initialized) {
            $scope.initialized = true;
            map_recenter({
                lat: $scope.currentPosition[0],
                lng: $scope.currentPosition[1]
            }, 150, -150);
        }
    });




    function map_recenter(latlng, offsetx, offsety) {
        NgMap.getMap().then(function (map) {
            google.maps.event.trigger(map, 'resize');
            var point1 = map.getProjection().fromLatLngToPoint(
                (latlng instanceof google.maps.LatLng) ? latlng : map.getCenter()
            );
            var point2 = new google.maps.Point(
                ((typeof (offsetx) == 'number' ? offsetx : 0) / Math.pow(2, map.getZoom())) || 0, ((typeof (offsety) == 'number' ? offsety : 0) / Math.pow(2, map.getZoom())) || 0
            );
            map.setCenter(map.getProjection().fromPointToLatLng(new google.maps.Point(
                point1.x - point2.x,
                point1.y + point2.y
            )));
        });
    }

    $scope.$on("voice-up", function (event, data) {
        $scope.$apply(function () {
            map_recenter({
                lat: $scope.currentPosition[0],
                lng: $scope.currentPosition[1]
            }, 0, -150);
        });
    });

    $scope.$on("voice-down", function (event, data) {
        $scope.$apply(function () {
            map_recenter({
                lat: $scope.currentPosition[0],
                lng: $scope.currentPosition[1]
            }, 0, 150);
        });
    });

    $scope.$on("voice-left", function (event, data) {
        $scope.$apply(function () {
            map_recenter({
                lat: $scope.currentPosition[0],
                lng: $scope.currentPosition[1]
            }, 150, 0);
        });
    });

    $scope.$on("voice-right", function (event, data) {
        $scope.$apply(function () {
            map_recenter({
                lat: $scope.currentPosition[0],
                lng: $scope.currentPosition[1]
            }, -150, 0);
        });
    });


}