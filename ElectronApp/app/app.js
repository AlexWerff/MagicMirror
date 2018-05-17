var app = angular.module('magicMirrorApp', ['ngRoute','ngMap']).config(['$routeProvider', '$httpProvider',
     function ($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider.
        when('/dashboard', {
            templateUrl: 'app/contents/dashboard/dashboard.html',
            controller: 'DashboardController'
        }).
        when('/calendar', {
            templateUrl: 'app/contents/calendar/calendar.html',
            controller: 'CalendarController'
        }).
        when('/weather', {
            templateUrl: 'app/contents/weather/weather.html',
            controller: 'WeatherController'
        }).
        when('/weather/:city', {
            templateUrl: 'app/contents/weather/weather.html',
            controller: 'WeatherController'
        }).
        when('/news', {
            templateUrl: 'app/contents/news/news.html',
            controller: 'NewsController'
        }).
        when('/videos', {
            templateUrl: 'app/contents/videos/videos.html',
            controller: 'VideosController'
        }).
        when('/pictures', {
            templateUrl: 'app/contents/pictures/pictures.html',
            controller: 'PicturesController'
        }).
        when('/maps', {
            templateUrl: 'app/contents/maps/maps.html',
            controller: 'MapsController'
        }).
        otherwise({
            redirectTo: '/dashboard'
        });
     }
]);



/*run(function($rootScope, $location) {
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
      if ($rootScope.loggedInUser == null) {
            alert("CHAAANGE");
      }
    });
  });*/