
angular.module('magicMirrorApp')
    .controller('PicturesController', ['$rootScope', '$scope', '$http', PicturesController])

function PicturesController($rootScope, $scope, $http) {

    $scope.searchResults = [];
    $scope.currentSearchIndex = 0;
    $scope.searchText = "";
    $scope.currentPicture = {};


    $scope.$on("voice-searchFor", function (event, data) {
        search(data.searchText);
        $scope.searchText = data.searchText;
    });

    $scope.$on("voice-next", function (event, data) {
        if ($scope.currentSearchIndex === ($scope.searchResults.length - 1))
            $scope.currentSearchIndex = 0;
        else
            $scope.currentSearchIndex++;
        $scope.$apply(function () {
            //$scope.yt.videoid = $scope.searchResults[$scope.currentSearchIndex].id;
        });
    });

    $scope.$on("voice-previous", function (event, data) {
        if ($scope.currentSearchIndex === 0)
            $scope.currentSearchIndex = $scope.searchResults.length - 1;
        else
            $scope.currentSearchIndex--;
        $scope.$apply(function () {
            //$scope.yt.videoid = $scope.searchResults[$scope.currentSearchIndex].id;
        });
    });


    var search = function (search) {

    };
};