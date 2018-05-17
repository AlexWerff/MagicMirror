angular.module('magicMirrorApp')
    .controller('MapsController', ['$rootScope', '$scope', '$http', '$routeParams', '$timeout', '$window', 'NgMap', 'voiceService', 'mapsService', MapsController])

function MapsController($rootScope, $scope, $http, $routeParams, $timeout, $window, NgMap, voiceService, mapsService) {
    $scope.currentPosition = [40.74, -74.18];
    $scope.positionMarker = [40.74, -74.18];
    $scope.zoomLevel = 14;
    $scope.routes = [];
    $scope.markers = [];
    $scope.loading = true;
    $rootScope.$broadcast("start-loading");
    $scope.currentLocationName = "";
    $scope.initialized = false;
    $scope.currentStepIndex = 0;
    $scope.currentInstructions = [];

    $scope.mapStyle = mapsService.getMapStyle();



    var setCurrentLocation = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (pos) {
                $scope.currentPosition = [pos.coords.latitude, pos.coords.longitude];
                $scope.positionMarker = [pos.coords.latitude, pos.coords.longitude];
                $scope.loading = false;
                $scope.zoomLevel = 14;
                $rootScope.$broadcast("stop-loading");
                $scope.currentLocationName = "Current Location";
            });
        }
    }

    //setCurrentLocation();


    var getLatLngFromCity = function (city) {
        $http.get("http://maps.googleapis.com/maps/api/geocode/json?address=" + city + "&sensor=true")
            .success(function (data) {
                var lat = data.results[0].geometry.location.lat;
                var lng = data.results[0].geometry.location.lng;
                $scope.currentPosition = [lat, lng];
                $scope.positionMarker = [lat, lng];
                $scope.loading = false;
                $rootScope.$broadcast("stop-loading");
            });
    };

    var getRouteFromTo = function (from, to, travelMode) {
        if (travelMode === undefined)
            travelMode = "driving";
        $scope.infoText = "Route from " + from + " to " + to;
        $scope.routes = [];

        mapsService.getRouteFromTo(from, to, travelMode, function (newRoute) {
            $scope.currentPosition = newRoute.startMarker.pos;
            $scope.markers.push(newRoute.startMarker);
            $scope.markers.push(newRoute.endMarker);

            $scope.routes.push(newRoute);
            $scope.zoomLevel = 16;
            $scope.currentInstructions = newRoute.instructions.slice(0, 5);
            $rootScope.$broadcast("stop-loading");
        });
    }


    $scope.$on("voice-wakeUp", function (event, data) {
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

    voiceService.addCommand("Route from *origin to *destination", function (origin, destination) {
        getRouteFromTo(origin, destination, undefined);
    });

    voiceService.addCommand("Route from *origin to *destination by *travelMode", function (origin, destination, travelMode) {
        getRouteFromTo(origin, destination, travelMode);
    });

    voiceService.addCommand("Route to Work by *travelMode", function (travelMode) {
        var from = getHomeAddress();
        var to = getWorkAddress();
        getRouteFromTo(from.City + " " + from.Address, to.City + " " + to.Address, travelMode);
    });

    voiceService.addCommand("Route to Work", function (travelMode) {
        var from = getHomeAddress();
        var to = getWorkAddress();
        getRouteFromTo(from.City + " " + from.Address, to.City + " " + to.Address, "transit");
    });

    voiceService.addCommand("Go To *destination", function (destination) {
        if (voiceService.isListening()) {
            $scope.$apply(function () {
                $scope.loading = true;
                $rootScope.$broadcast("start-loading");
                if (destination.toUpperCase() === "CURRENT LOCATION") {
                    setCurrentLocation();
                } else {
                    $scope.currentLocationName = destination;
                    getLatLngFromCity(destination);
                }
            });
        }
    });

    voiceService.addCommand("Zoom In", function () {
        if (voiceService.isListening()) {
            $scope.$apply(function () {
                $scope.zoomLevel += 2;
            });
        }
    });

    voiceService.addCommand("Zoom Out", function () {
        if (voiceService.isListening()) {
            $scope.$apply(function () {
                $scope.zoomLevel -= 2;
            });
        }
    });

    voiceService.addCommand("Right", function () {
        if (voiceService.isListening()) {
            $scope.$apply(function () {
                map_recenter({
                    lat: $scope.currentPosition[0],
                    lng: $scope.currentPosition[1]
                }, -150, 0);
            });
        }
    });

    voiceService.addCommand("Left", function () {
        if (voiceService.isListening()) {
            $scope.$apply(function () {
                map_recenter({
                    lat: $scope.currentPosition[0],
                    lng: $scope.currentPosition[1]
                }, 150, 0);
            });
        }
    });

    voiceService.addCommand("Up", function () {
        if (voiceService.isListening()) {
            $scope.$apply(function () {
                map_recenter({
                    lat: $scope.currentPosition[0],
                    lng: $scope.currentPosition[1]
                }, 0, -150);
            });
        }
    });

    voiceService.addCommand("Down", function () {
        if (voiceService.isListening()) {
            $scope.$apply(function () {
                map_recenter({
                    lat: $scope.currentPosition[0],
                    lng: $scope.currentPosition[1]
                }, 0, 150);
            });
        }
    });

    voiceService.addCommand("Next", function () {
        $scope.currentStepIndex++;
        if ($scope.routes.length !== 0) {
            var route = $scope.routes[0];
            if ($scope.currentInstructions.length > 5) {
                $scope.currentInstructions = route.instructions.slice($scope.currentStepIndex, 5 + $scope.currentStepIndex);
            }
            var instruction = route.instructions[$scope.currentStepIndex];
            $scope.currentPosition = instruction.points[0];
        }
    });

    voiceService.addCommand("Previous", function () {
        $scope.currentStepIndex--;
        if ($scope.routes.length !== 0) {
            var route = $scope.routes[0];
            if ($scope.currentInstructions.length > 5) {
                $scope.currentInstructions = route.instructions.slice($scope.currentStepIndex, 5 + $scope.currentStepIndex);
            }
            var instruction = route.instructions[$scope.currentStepIndex];
            $scope.currentPosition = instruction.points[0];
        }
    });

    setCurrentLocation();
}