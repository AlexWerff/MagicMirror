angular.module('magicMirrorApp')
    .controller('NewsController', ['$rootScope', '$scope', '$http', '$routeParams', '$timeout', NewsController])

function NewsController($rootScope, $scope, $http, $routeParams, $timeout) {
    var feeds = ['http://rss.cnn.com/rss/cnn_topstories.rss'];
    $scope.feedData = [];
    $scope.currentFeed = {};
    var currentIndex = 0;
    $rootScope.$broadcast("start-loading");

    var getNews = function (feed) {

        $http.jsonp('//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(feed)).success(function (data) {
            data.responseData.feed.entries.forEach(function (fData) {
                var article = {
                    title: fData.title,
                    content: fData.content.substr(0, fData.content.indexOf("<br>")),
                    link: fData.link
                };
                $scope.feedData.push(article);
            });
            currentIndex = 0;
            $scope.currentFeed = $scope.feedData[currentIndex];
            nextFeed();
            $rootScope.$broadcast("stop-loading");
        });
    };

    var nextFeed = function () {
        $timeout(function () {
            if (currentIndex < $scope.feedData.length)
                currentIndex++;
            else
                currentIndex = 0;
            $scope.$apply(function () {
                $scope.currentFeed = $scope.feedData[currentIndex];
            });
            nextFeed();
        }, 15000);
    }



    getNews(feeds[0]);
}