angular.module('magicMirrorApp')
    .controller('NewsController', ['$rootScope', '$scope', '$http', '$routeParams', '$timeout', NewsController])

function NewsController($rootScope, $scope, $http, $routeParams, $timeout) {
    var iteratingFeeds = false;
    var feeds = getNewsRSS();
    $scope.feedData = [];
    $scope.currentFeed = {};
    var currentIndex = 0;
    $rootScope.$broadcast("start-loading");

    var getNews = function (feed) {
        var url = "https://query.yahooapis.com/v1/public/yql?q=select * from xml where url = '"+feed.Url+"'&format=json";
        
        $http.get(url).success(function (data) {
            data.query.results.rss.channel.item.forEach(function (fData) {
                var tagIndex = fData.description.indexOf("<");
                var article = {
                    title: feed.Name + ": " + fData.title,
                    content: fData.description.substr(0,tagIndex <0 ? fData.description.length : tagIndex),
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


    var update = function () {
        //citeratingFeeds = false;
        feeds.forEach(function (feed) {
            getNews(feed);
        });
    }
    update();
}