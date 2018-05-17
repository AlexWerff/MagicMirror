angular.module('magicMirrorApp')
    .controller('FooterController', ['$rootScope', '$scope', FooterController])

function FooterController($rootScope, $scope) {

    $scope.$on("start-loading", function () {
        $scope.loading = true;
    });

    $scope.$on("stop-loading", function () {
        $scope.loading = false;
    });

}