angular.module('magicMirrorApp')
    .controller('TimeController', ['$rootScope', '$scope', '$http', '$timeout', 'voiceService', TimeController])

function TimeController($rootScope, $scope, $http, $timeout, voiceService) {
    $scope.showWorldClock = true;
    $scope.worldTimes = [];

    var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'Juli', 'August', 'September', 'October', 'November', 'December'];
    var updateTime = function () {
        $scope.worldTimes = [];
        var citys = getTimeCitys();
        citys.forEach(function(city){
            var date = new Date();
            date.setUTCHours(date.getUTCHours()+city.TimeDelta);
            $scope.worldTimes.push({
                name:city.Name,
                time:(date.getUTCHours()<10 ? "0":"")+ date.getUTCHours()+":"+
                (date.getUTCMinutes()<10 ? "0":"")+date.getUTCMinutes()+":"+
                (date.getUTCSeconds()<10 ? "0":"")+date.getUTCSeconds()
            });
        });
        $timeout(function () {
            updateTime();
        }, 1000);
    };
    updateTime();
};