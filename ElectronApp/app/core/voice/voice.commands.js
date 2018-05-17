var createVoiceCommands = function (annyang, $scope, $rootScope, $timeout) {

    var wakeUp = function () {
        if (!$scope.listening) {
            $scope.$apply(function () {
                $scope.listening = true;
                $scope.showTime = true;
                $rootScope.showContent = true;
            });
        }
        if ($scope.listening) {
            $rootScope.$broadcast("voice-startListening");
        }

    };


    var help = function () {
        if ($scope.listening) {
            $rootScope.$broadcast("voice-help");
        }
    }

    var sleep = function () {
        $scope.$apply(function () {
            $scope.listening = false;
            $scope.showTime = false;
            $rootScope.showContent = false;
        });
    };


    var showPage = function (url) {
        $rootScope.showContent = false;
        $timeout(function () {
            window.location = url;
            $rootScope.showContent = true;
        }, 1000);
    }

    var showCalendar = function () {
        if ($scope.listening) {
            showPage("#/calendar");
        }
    };

    var showDashboard = function () {
        if ($scope.listening) {
            showPage("#/dashboard");
        }
    };
    var showWeather = function () {
        if ($scope.listening) {
            showPage("#/weather");
        }
    };

    var showNews = function (topic) {
        if ($scope.listening) {
            showPage("#/news");
        }
    }

    var showVideos = function (search) {
        if ($scope.listening) {
            showPage("#/videos");
        }
    }

    var showMaps = function () {
        if ($scope.listening) {
            showPage("#/maps");
        }
    }

    var playVideo = function () {
        if ($scope.listening) {
            $rootScope.$broadcast("voice-playVideo");
        }
    }

    var pauseVideo = function () {
        if ($scope.listening) {
            $rootScope.$broadcast("voice-pauseVideo");
        }
    }

    var searchFor = function (searchText) {
        if ($scope.listening) {
            $rootScope.$broadcast("voice-searchFor", {
                searchText: searchText
            });
        }
    }

    var next = function () {
        if ($scope.listening) {
            $rootScope.$broadcast("voice-next");
        }
    }

    var previous = function () {
        if ($scope.listening) {
            $rootScope.$broadcast("voice-previous");
        }
    }


    var goTo = function (value) {
        if ($scope.listening) {
            $rootScope.$broadcast("voice-goTo", {
                value: value
            });
        }
    }

    var routeFromAToB = function (from, to) {
        if ($scope.listening) {
            $rootScope.$broadcast("voice-routeFromTo", {
                from: from,
                to: to
            });
        }
    };

    var zoomIn = function () {
        if ($scope.listening) {
            $rootScope.$broadcast("voice-zoomIn");
        }
    }

    var zoomOut = function () {
        if ($scope.listening) {
            $rootScope.$broadcast("voice-zoomOut");
        }
    }

    var up = function () {
        if ($scope.listening) {
            $rootScope.$broadcast("voice-up");
        }
    }

    var down = function () {
        if ($scope.listening) {
            $rootScope.$broadcast("voice-down");
        }
    }

    var left = function () {
        if ($scope.listening) {
            $rootScope.$broadcast("voice-left");
        }
    }

    var right = function () {
        if ($scope.listening) {
            $rootScope.$broadcast("voice-right");
        }
    }


    //DO NOT USE WILDCARDS *a and *b
    var commands = {
        //Basic Commands
        "Wake up": wakeUp,
        'Sleep': sleep,
        'Help': help,
        'Search for *text': searchFor,
        'Next': next,
        'Previous': previous,
        'Up': up,
        'Down': down,
        'Left': left,
        'Right': right,


        //Basic Navigation
        'Show Calendar': showCalendar,
        'Show Dashboard': showDashboard,
        'Show Weather': showWeather,
        'Show News': showNews,
        'Show Videos': showVideos,
        'Show Maps': showMaps,

        //Video Control
        'Play Video': playVideo,
        'Pause Video': pauseVideo,

        //Map Control
        'Route from *from to *to': routeFromAToB,
        'Go To *value': goTo,
        'Zoom In': zoomIn,
        'Zoom Out': zoomOut,

    };


    /*
        Expand commands to be recognized in a better way
        For example add to command "Listen" wildcards like "*a Listen *b".
    */
    var expandCommands = function (commands) {
        var newCommand = {};
        for (var property in commands) {
            if (commands.hasOwnProperty(property)) {
                var func = commands[property];
                if (property[0] !== "*")
                    commands["*a " + property] = func;
            }
        }
        return commands;
    }

    var clearCommandParams = function (func) {

    };




    annyang.addCommands(expandCommands(commands));
}