angular.module('magicMirrorApp')
    .controller('DashboardController', ['$rootScope', '$scope', '$timeout', '$http', 'mapsService', DashboardController])

function DashboardController($rootScope, $scope, $timeout, $http, mapsService) {
    $scope.isLoading = true;

    $scope.travelTimes = [];

    var update = function () {
        $rootScope.$broadcast("start-loading");
        feeds.forEach(function (feed) {
            getNews(feed);
        });
        getWeather("", "");
    }




    //FEEDS
    var iteratingFeeds = false;
    var feeds = getNewsRSS();
    $scope.feedData = [];
    $scope.currentFeed = {};
    var currentIndex = 0;

    var getNews = function (feed) {
        var url = "https://query.yahooapis.com/v1/public/yql?q=select * from xml where url = '" + feed.Url + "'&format=json";

        $http.get(url).success(function (data) {
            $scope.feedData = [];
            data.query.results.rss.channel.item.forEach(function (fData) {
                var tagIndex = fData.description.indexOf("<");
                var article = {
                    title: feed.Name + ": " + fData.title,
                    content: fData.description.substr(0, tagIndex < 0 ? fData.description.length : tagIndex),
                    link: fData.link
                };
                $scope.feedData.push(article);
            });
            currentIndex = 0;
            $scope.currentFeed = $scope.feedData[currentIndex];
            if (!iteratingFeeds) {
                iteratingFeeds = true;
                nextFeed();
            }
            $rootScope.$broadcast("stop-loading");
        });

    };

    var nextFeed = function () {

        $timeout(function () {
            if (currentIndex < $scope.feedData.length) {
                currentIndex++;
                $scope.$apply(function () {
                    $scope.currentFeed = $scope.feedData[currentIndex];
                });
                nextFeed();
            } else {
                currentIndex = 0;
                update();
                nextFeed();
            }
        }, 15000);

    }




    //WEATHER
    $scope.weather = {
        forecast: []
    };
    $scope.weather.city = "Unknown";

    var getWeather = function (lat, lng) {
        $http.get("http://api.openweathermap.org/data/2.5/weather?q=Bremen&appid=7c1d6f747dabfdc3f8c202cf35cd504e").success(function (weather) {
            var forecastArray = [];
            $scope.weather.temperature = weather.main.temp - 273.15;
            $scope.weather.text = weather.weather[0].main;
            $scope.weather.city = weather.name;
            $scope.loading = false;
            $rootScope.$broadcast("stop-loading");
        }).error(function (err) {
            $scope.weather.city = err;
            $rootScope.$broadcast("stop-loading");
        });
    };


    var updateMaps = function () {
        $scope.travelTimes = [];    
        //MAPS
        mapsService.getRouteFromTo("Bremen Schneeverdinger Straße", "Bremen Universität Zentralbereich", "transit", function (result) {
            var time = result.instructions[1].startTime.toLocaleTimeString();
            time = time.substr(0,time.length-3);
            $scope.travelTimes.push({
                from: "Schneeverdinger Straße",
                to: "Universität Zentralbereich",
                time: time,
                transit: result.instructions[1].transit.line.short_name
            });
        });

        mapsService.getRouteFromTo("Bremen Müdener Straße", "Bremen Hauptbahnhof", "transit", function (result) {
            var time = result.instructions[1].startTime.toLocaleTimeString();
            time = time.substr(0,time.length-3);
            $scope.travelTimes.push({
                from: "Müdener Straße",
                to: "HBF",
                time: time,
                transit: result.instructions[1].transit.line.short_name
            });
        });

        mapsService.getRouteFromTo("Bremen Schneeverdinger Straße", "Bremen Sebaldsbrück", "transit", function (result) {
            var time = result.instructions[1].startTime.toLocaleTimeString();
            time = time.substr(0,time.length-3);
            $scope.travelTimes.push({
                from: "Schneeverdinger Straße",
                to: "Sebaldsbrück",
                time: time,
                transit: result.instructions[1].transit.line.short_name
            });
        });
        
        $timeout(function(){
            updateMaps();
        },400000);
    };
    
    updateMaps();

    update();
}