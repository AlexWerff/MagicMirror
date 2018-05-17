angular.module('magicMirrorApp').constant('YT_event', {
    STOP: 0,
    PLAY: 1,
    PAUSE: 2,
    STATUS_CHANGE: 3
});


angular.module('magicMirrorApp')
    .controller('VideosController', ['$rootScope', '$scope', '$http','$window', 'YT_event', VideosController])

function VideosController($rootScope, $scope, $http,$window, YT_event) {
    //initial settings
    $scope.yt = {
        width: 600,
        height: 480,
        videoid: "",
        playerStatus: "NOT PLAYING"
    };
    $scope.searchResults = [];
    $scope.currentSearchIndex = 0;
    $scope.searchText = "";


    $scope.YT_event = YT_event;

    $scope.sendControlEvent = function (ctrlEvent) {
        this.$broadcast(ctrlEvent);
    }


    $scope.$on(YT_event.STATUS_CHANGE, function (event, data) {
        $scope.yt.playerStatus = data;
    });

    $scope.$on("voice-playVideo", function (event, data) {
        $scope.sendControlEvent(YT_event.PLAY);
    });

    $scope.$on("voice-pauseVideo", function (event, data) {
        $scope.sendControlEvent(YT_event.PAUSE);
    });

    $scope.$on("voice-searchFor", function (event, data) {
        search(data.searchText);
        $scope.searchText = data.searchText;
    });

    var next = function () {
        if ($scope.currentSearchIndex === ($scope.searchResults.length - 1))
            $scope.currentSearchIndex = 0;
        else {
            $scope.currentSearchIndex++;
            if ($scope.searchResults[$scope.currentSearchIndex].id === undefined)
                next();
        }
        $scope.yt.videoid = $scope.searchResults[$scope.currentSearchIndex].id;
    };

    var previous = function () {
        if ($scope.currentSearchIndex === 0)
            $scope.currentSearchIndex = $scope.searchResults.length - 1;
        else {
            $scope.currentSearchIndex--;
            if ($scope.searchResults[$scope.currentSearchIndex].id === undefined)
                previous();
        }
        $scope.yt.videoid = $scope.searchResults[$scope.currentSearchIndex].id;
    };

    $scope.$on("voice-next", function (event, data) {
        $scope.$apply(function () {
            next();
        });
    });

    $scope.$on("voice-previous", function (event, data) {
        $scope.$apply(function () {
            previous();
        });
    });


    var search = function (search) {
        $rootScope.$broadcast("start-loading");
        $http.get("https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + search + "&key=AIzaSyB1qsYvxrUe9W-GZazvtFZqm6SqY4cOEZs")
            .success(function (data) {
                var searchResults = [];

                data.items.forEach(function (item) {
                    var newItem = {
                        name: item.snippet.title,
                        id: item.id.videoId
                    }
                    searchResults.push(newItem);
                });
                $scope.searchResults = searchResults;
                $scope.currentSearchIndex = 0;
                if ($scope.searchResults.length > 0) {
                    $scope.currentSearchIndex = -1;
                    next();
                }
                $rootScope.$broadcast("stop-loading");

            })
            .error(function () {

            });
    };

};