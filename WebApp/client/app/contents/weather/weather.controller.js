angular.module('magicMirrorApp')
    .controller('WeatherController', ['$rootScope', '$scope', '$http', '$routeParams', WeatherController])

function WeatherController($rootScope, $scope, $http, $routeParams) {
    $scope.weather = {
        forecast: []
    };
    $scope.weather.city = "Unknown";
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
            getWeather(pos.coords.latitude + "," + pos.coords.longitude);
        });
    }

    var getAddressFromGoogleResult = function (data) {
        var result = {
            Zip: undefined,
            City: undefined,
            Address: undefined
        }
        data.results[0].address_components.forEach(function (comp) {
            if (comp.types[0] === "locality")
                result.City = comp.long_name;
            if (comp.types[0] === "route")
                result.Address = comp.long_name;
            if (comp.types[0] === "postal_code")
                result.Zip = comp.long_name;
        });
        return result;
    }

    var getWeatherFromCity = function (city) {
        $http.get("http://maps.googleapis.com/maps/api/geocode/json?address=" + city + "&sensor=true")
            .success(function (data) {
                var address = getAddressFromGoogleResult(data);
                if (address.Zip === undefined) {
                    $scope.weather.temperature = "-";
                    $scope.weather.sunrise = "-";
                    $scope.weather.sunset = "-";
                    $scope.weather.city = city;
                } else {
                    $scope.weather.city = address.City + " " + address.Address
                    getWeather(address.Zip);

                }
            });
    };

    var getWeather = function (latLng) {
        $.simpleWeather({
            location: latLng,
            woeid: '',
            unit: 'c',
            success: function (weather) {
                var forecastArray = [];
                /*weather.forecast.forEach(function (f) {
                    if (f.dt_txt.indexOf("12:00:00") >= 0) {
                        forecastArray.push(f);
                    }
                });*/
                $scope.weather.temperature = weather.temp;
                $scope.weather.text = weather.text;
                $scope.weather.image = weather.image;

                $scope.weather.forecast = [];
                for (var index = 0; index < 3; index++) {
                    var fore = weather.forecast[index];
                    var forecast = {
                        date: fore.date,
                        day: fore.day,
                        temp: fore.high,
                        text: fore.text,
                        image: fore.image
                    }
                    $scope.weather.forecast.push(forecast);
                }
                $scope.loading = false;
                $rootScope.$broadcast("stop-loading");
            },
            error: function (error) {
                $scope.loading = false;
                $rootScope.$broadcast("stop-loading");
            }
        });
    };

}