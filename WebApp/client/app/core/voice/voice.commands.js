var createVoiceCommands = function (annyang, $scope, $rootScope, $timeout) {




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