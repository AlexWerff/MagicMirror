angular.module('magicMirrorApp').service('voiceService', function ($http, $timeout, $rootScope) {
    var commands = {};
    var listening = true;


    var start = function () {
        if (annyang) {
            annyang.onSpeechRecognized = function (text) {
                if (listening) {
                    $rootScope.$broadcast("voice-speechRecognized", text);
                }
            };
            annyang.onCommandRecognized = function (text) {
                if (listening) {
                    $rootScope.$broadcast("voice-commandRecognized", text);
                }
            };

            annyang.debug(true);
            annyang.start();
            console.log("annayang started");
        }
    }
    console.log("voice serivice started");


    var addCommand = function (command, func) {
        if (commands[command] === undefined) {
            var newCommand = {};
            newCommand[command] = func;
            var hasFirst = false;
            if (command[0] !== "*" && command[lastSpace + 1] !== ":") {
                newCommand["*a " + command] = func;
                hasFirst = true;
            }
            var lastSpace = command.lastIndexOf(" ");
            if (lastSpace > 0) {
                if (command[lastSpace + 1] !== "*" && command[lastSpace + 1] !== ":") {
                    newCommand[command + " *b"] = func;
                    if (hasFirst)
                        newCommand["*a " + command + " *b "] = func;
                }
            }
            if (annyang)
                annyang.addCommands(newCommand);
        }
    }

    var removeCommand = function (command) {
        commands[command] = undefined;
    }

    var wakeUp = function () {
        if (!listening) {
            listening = true;
            $rootScope.$broadcast("voice-wakeUp");
        }
    };

    var sleep = function () {
        if (listening) {
            listening = false;
            $rootScope.$broadcast("voice-sleep");
        }
    };
    addCommand("Sleep", sleep);
    addCommand("Wake Up", wakeUp);


    var isListening = function () {
        return listening;
    }




    return {
        start: start,
        addCommand: addCommand,
        removeCommands: removeCommand,
        isListening: isListening
    }
});