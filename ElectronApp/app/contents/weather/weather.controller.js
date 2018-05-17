angular.module('magicMirrorApp')
    .controller('WeatherController', ['$rootScope', '$scope', '$http', '$routeParams', WeatherController])

function WeatherController($rootScope, $scope, $http, $routeParams) {
    $scope.weather = {};
    $scope.weather.city = "";
    $scope.loading = true;
    $rootScope.$broadcast("start-loading");
    if ($routeParams.city !== undefined) {
        $scope.weather.city = $routeParams.city;
    }

    function FtoC(temp) {
        return Math.round((temp - 32) / (9 / 5));
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (pos) {
            $scope.currentPosition = [pos.coords.latitude, pos.coords.longitude];
            getWeatherFromLatLng(pos.coords.latitude, pos.coords.longitude);
        });
    }

    var getWeatherFromLatLng = function (lat, lng) {
        var latLng = lat + "," + lng;
        $http.get("http://maps.googleapis.com/maps/api/geocode/json?latlng=" + latLng + "&sensor=true")
            .success(function (data) {
                if (data.results[0].address_components.length < 6) {
                    $scope.weather.temperature = "-";
                    $scope.weather.sunrise = "-";
                    $scope.weather.sunset = "-";
                    $scope.weather.city = "Unknown";
                } else {
                    $scope.weather.city = data.results[0].address_components[4].long_name + " " + data.results[0].address_components[1].long_name;
                    getWeather(data.results[0].address_components[7].short_name);
                }
            });
    };

    var getWeatherFromCity = function (city) {
        $http.get("http://maps.googleapis.com/maps/api/geocode/json?address=" + city + "&sensor=true")
            .success(function (data) {
                if (data.results[0].address_components.length < 6) {
                    $scope.weather.temperature = "-";
                    $scope.weather.sunrise = "-";
                    $scope.weather.sunset = "-";
                    $scope.weather.city = city;
                } else {
                    $scope.weather.city = data.results[0].address_components[2].long_name + " " + data.results[0].address_components[1].long_name;
                    getWeather(data.results[0].address_components[5].short_name);

                }
            });
    };
    var getWeather = function (zip) {
        $http.get('https://query.yahooapis.com/v1/public/yql?q=SELECT * FROM weather.forecast WHERE location="' + zip + '" & format=json & diagnostics=true & u="c" & callback=')
            .success(function (data) {
                $scope.weather.temperature = FtoC(data.query.results.channel.item.condition.temp);
                $scope.weather.text = data.query.results.channel.item.condition.text;
                $scope.weather.sunrise = data.query.results.channel.astronomy.sunrise;
                $scope.weather.sunset = data.query.results.channel.astronomy.sunset;
                $scope.weather.image = "images/weather/" + $scope.weather.text + ".png";
                $scope.weather.forecast = [];
                data.query.results.channel.item.forecast.forEach(function (fore) {
                    var forecast = {
                        date: fore.date,
                        day: fore.day,
                        high: FtoC(fore.high),
                        low: FtoC(fore.low),
                        text: fore.text,
                        image: "images/weather/" + fore.text + ".png"
                    }
                    $scope.weather.forecast.push(forecast);
                });
                $scope.loading = false;
                $rootScope.$broadcast("stop-loading");
            })
            .error(function (err) {
                console.log('Error retrieving markets');
            });
    };

}