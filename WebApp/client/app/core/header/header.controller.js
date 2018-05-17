angular.module('magicMirrorApp')
    .controller('HeaderController', ['$rootScope', '$scope', '$timeout', 'voiceService','smartHomeService', HeaderController])

function HeaderController($rootScope, $scope, $timeout, voiceService,smartHomeService) {


    $scope.date = {
        hours: new Date().getHours(),
        minutes: new Date().getMinutes(),
        weekday: "",
        date: ""
    }

    $scope.voiceText = '';//'Say "Wake Up"';

    $scope.$on("voice-speechRecognized", function (args, text) {
        $scope.voiceText = text;
    });

    $scope.$on("voice-commandRecognized", function (args, text) {
        $scope.voiceText = text;
    });

    $scope.$on("voice-sleep", function () {
        $scope.voiceText = 'Say "Wake Up"';
    });

    $scope.$on("voice-wakeUp", function () {
        $scope.voiceText = "Listening...";
    });


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
        smartHomeService.getDevices().forEach(function (device) {
            if (device.OnTick !== undefined) {
                device.OnTick(Date.now(),smartHomeService);
            }
        });
        $timeout(function () {
            updateTime();
        }, 60000);

    };
    updateTime();

}