angular.module('magicMirrorApp')
    .controller('CalendarController', ['$rootScope', '$scope', CalendarController])

function CalendarController($rootScope, $scope) {
    $scope.appointments = [];
    $scope.appointments.push({
        name: "Meeting with Steve",
        date: new Date()
    });

    $scope.appointments.push({
        name: "Meeting with Dave",
        date: new Date()
    });

    $scope.appointments.push({
        name: "Meeting with Collin",
        date: new Date()
    });

    $scope.appointments.push({
        name: "Meeting with Sarah",
        date: new Date()
    });
}