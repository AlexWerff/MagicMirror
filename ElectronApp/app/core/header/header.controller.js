angular.module('magicMirrorApp')
    .controller('HeaderController', ['$rootScope', '$scope', '$timeout', HeaderController])

function HeaderController($rootScope, $scope, $timeout) {

    $scope.date = {
        hours: new Date().getHours(),
        minutes: new Date().getMinutes(),
        weekday: "",
        date: ""
    }
    $rootScope.listening = false;
    $rootScope.showTime = false;


    var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'Juli', 'August', 'September', 'October', 'November', 'December'];
    var updateTime = function () {
        var date = new Date();
        $scope.date.hours = date.getHours();
        if ($scope.date.hours < 10)
            $scope.date.hours = "0" + $scope.date.hours;
        $scope.date.minutes = date.getMinutes();
        if ($scope.date.minutes < 10)
            $scope.date.minutes = "0" + $scope.date.minutes;
        $scope.date.weekday = weekdays[date.getDay()];
        $scope.date.date = date.getDate() + "th " + months[date.getMonth()] + " " + date.getFullYear();
        $timeout(function () {
            updateTime();
        }, 1000);
    };
    updateTime();

    if (annyang) {
        createVoiceCommands(annyang, $scope, $rootScope, $timeout);

        annyang.debug(true);
        // Start listening. You can call this here, or attach this call to an event, button, etc.
        annyang.start();
        console.log("annayang started");
    }

}