angular.module('magicMirrorApp')
    .controller('SmartHomeController', ['$rootScope', '$scope', '$http', '$timeout', 'voiceService', 'smartHomeService', SmartHomeController])

function SmartHomeController($rootScope, $scope, $http, $timeout, voiceService, smartHomeService) {
    $scope.devices = smartHomeService.getDevices();
    $scope.$on("deviceFound", function (event, args) {
        $scope.devices = smartHomeService.getDevices();
    });


    $scope.$on("deviceConnected", function (event, device) {
        
    });

    voiceService.addCommand("Connect *deviceAltName", function (deviceAltName) {
        $scope.devices.forEach(function (device) {
            if (device.AltName.toLowerCase() == deviceAltName.toLowerCase())
                smartHomeService.connectDevice(device.UUID);
        });
    });
    





};