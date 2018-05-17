angular.module('magicMirrorApp')
    .controller('AppController', ['$rootScope', '$scope', '$timeout', 'voiceService', 'smartHomeService', AppController])

function AppController($rootScope, $scope, $timeout, voiceService, smartHomeService) {

    $scope.listening = true;
    $scope.showContent = true;


    $scope.$on("voice-wakeUp", function () {
        $scope.$apply(function () {
            $scope.listening = true;
            $scope.showContent = true;
        });
    });

    $scope.$on("voice-sleep", function () {
        $scope.$apply(function () {
            $scope.listening = false;
            $scope.showContent = false;
        });
    });


    var showPage = function (page) {
        if (voiceService.isListening()) {
            window.location = "#/" + page;
            $scope.showContent = true;
        }
    }
    voiceService.addCommand("Show Dashboard", function () {
        showPage("dashboard");
    });
    voiceService.addCommand("Show Maps", function () {
        showPage("maps");
    });

    voiceService.addCommand("Show Videos", function () {
        showPage("videos");
    });

    voiceService.addCommand("Show News", function () {
        showPage("news");
    });

    voiceService.addCommand("Show Weather", function () {
        showPage("weather");
    });

    voiceService.addCommand("Show Calendar", function () {
        showPage("calendar");
    });

    voiceService.addCommand("Show Time", function () {
        showPage("time");
    });

    voiceService.addCommand("Show Home", function () {
        showPage("smarthome");
    });

    voiceService.addCommand("Show Music", function () {
        showPage("music");
    });

    voiceService.start();
    

    var backgrounds = getBackgrounds();
    var currentImageIndex = Math.floor((Math.random() * backgrounds.length) + 1);

    var updateImage = function () {
        $scope.currentBackgroundImage = backgrounds[currentImageIndex].url;
        $timeout(function(){
            $("img.scale").imageScale();
        },5000);
        
    }
    updateImage();

    var nextImage = function () {
        $timeout(function () {
            if (currentImageIndex == backgrounds.length - 1) {
                currentImageIndex = 0;
            }
            updateImage();
            nextImage();
            currentImageIndex = Math.floor((Math.random() * backgrounds.length) + 1);
        }, 60000);
    }
    nextImage();
}