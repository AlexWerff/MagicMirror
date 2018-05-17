angular.module('magicMirrorApp')
    .controller('DashboardController', ['$rootScope', '$scope', '$timeout', DashboardController])

function DashboardController($rootScope, $scope, $timeout) {
    $scope.person = "";
    $scope.$on("voice-helloPerson", function (args, data) {
        $scope.$apply(function () {
            $scope.person = data.person;
            $timeout(function () {
                $scope.person = "";
            }, 10000);
        });
    });

    $scope.commands = [];

    $scope.$on("voice-help", function (args, data) {
        $scope.commands.push('Say "Show Weather" to show Weather');
        $scope.commands.push('Say "Show Maps" to show Maps');
        $scope.commands.push('Say "Show Videos" to show Videos');
        $scope.commands.push('Say "Show Calendar" to show Calendar');
        $scope.commands.push('Say "Show News" to show News');
        $scope.commands.push('Say "Clear" to clear Mirror');
    });

    $scope.$on("voice-clear", function (args, data) {
        $scope.commands = [];
        $scope.person = "";
    });
}