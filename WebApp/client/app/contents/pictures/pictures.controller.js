
angular.module('magicMirrorApp')
    .controller('PicturesController', ['$rootScope', '$scope', '$http', PicturesController])

function PicturesController($rootScope, $scope, $http) {

    $scope.searchResults = [];
    $scope.currentSearchIndex = 0;
    $scope.searchText = "";
    $scope.currentPicture = {};


    var search = function (search) {

    };
};