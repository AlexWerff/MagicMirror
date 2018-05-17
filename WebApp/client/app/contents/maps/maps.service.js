angular.module('magicMirrorApp').service('mapsService', function ($http, $timeout, $rootScope, voiceService) {


    var getMapStyle = function () {
        return [
            {
                "featureType": "landscape.man_made",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#faf5ed"
            },
                    {
                        "lightness": "0"
            },
                    {
                        "gamma": "1"
            }
        ]
    },
            {
                "featureType": "poi.park",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#bae5a6"
            }
        ]
    },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [
                    {
                        "weight": "1.00"
            },
                    {
                        "gamma": "1.8"
            },
                    {
                        "saturation": "0"
            }
        ]
    },
            {
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "hue": "#ffb200"
            }
        ]
    },
            {
                "featureType": "road.arterial",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "lightness": "0"
            },
                    {
                        "gamma": "1"
            }
        ]
    },
            {
                "featureType": "transit.station.airport",
                "elementType": "all",
                "stylers": [
                    {
                        "hue": "#b000ff"
            },
                    {
                        "saturation": "23"
            },
                    {
                        "lightness": "-4"
            },
                    {
                        "gamma": "0.80"
            }
        ]
    },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#a0daf2"
            }
        ]
    }
];
    }

    var getRouteFromTo = function (from, to, travelMode,finished) {
        var travel = travelMode === "transit" ?
            google.maps.DirectionsTravelMode.TRANSIT : google.maps.DirectionsTravelMode.DRIVING


        var directionsService = new google.maps.DirectionsService();
        var directionsRequest = {
            origin: from,
            destination: to,
            travelMode: travel,
            unitSystem: google.maps.UnitSystem.METRIC
        };
        directionsService.route(directionsRequest, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                var dep = 0;
                if (response.routes[0].legs[0].departure_time === undefined) {
                    dep = Date.now();
                } else {
                    dep = response.routes[0].legs[0].departure_time.value
                }
                var newRoute = {
                    name: from+"-"+to+"by"+travelMode,
                    locationPoints: [],
                    instructions: [],
                    startMarker: {
                        name: from,
                        pos: [response.routes[0].legs[0].start_location.lat(), response.routes[0].legs[0].start_location.lng()]
                    },
                    endMarker: {
                        name: to,
                        pos: [response.routes[0].legs[0].end_location.lat(), response.routes[0].legs[0].end_location.lng()]
                    },
                    distance: (response.routes[0].legs[0].distance.value / 1000) + " Km",
                    time: Math.round((response.routes[0].legs[0].duration.value / 60)) + " min",
                    departure: dep,
                    arrival: 0
                }
                var currentTime = newRoute.departure.getTime();
                response.routes[0].overview_path.forEach(function (path) {
                    newRoute.locationPoints.push([path.lat(), path.lng()]);
                });
                response.routes[0].legs[0].steps.forEach(function (step) {
                    newRoute.instructions.push({
                        text: step.instructions.replace("<b>", "").replace("</b>", ""),
                        startTime: new Date(currentTime),
                        endTime: new Date(currentTime + step.duration.value * 1000),
                        distance: step.distance,
                        transit:step.transit,
                        points: [[step.start_location.lat(), step.start_location.lng()], [step.end_location.lat(), step.end_location.lng()]]
                    });
                    currentTime += step.duration.value * 1000;
                });
                newRoute.instructions.push({
                    text: "Ankunft",
                    startTime: new Date(currentTime),
                    endTime: new Date(currentTime),
                    distance: 0,
                    points: [newRoute.endMarker.pos, newRoute.endMarker.pos]
                });
                newRoute.arrival = currentTime;
                if (finished !== undefined)
                    finished(newRoute);
            }
            //Error has occured
        });
    }

    var result = {
        getMapStyle: getMapStyle,
        getRouteFromTo: getRouteFromTo
    }


    return result;
});