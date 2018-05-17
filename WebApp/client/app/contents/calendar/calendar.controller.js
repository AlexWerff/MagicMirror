angular.module('magicMirrorApp')
    .controller('CalendarController', ['$rootScope', '$scope', 'calendarService', 'voiceService', CalendarController])

function CalendarController($rootScope, $scope, calendarService, voiceService) {
    $scope.appointments = [];
    $scope.$broadcast("start-loading");
    calendarService.getAppointments(undefined, undefined, undefined, function (data) {
        $scope.appointments = [];
        data.forEach(function (appointment) {
            if (appointment.from !== undefined) {
                addAppointment(appointment);
            }
        });
        $scope.$broadcast("stop-loading");
    });

    var addAppointment = function (rawAppointment) {
        var dateText = rawAppointment.from + " - " + rawAppointment.to;

        var fromDate = new Date(rawAppointment.from);
        if (rawAppointment.from === rawAppointment.to) {
            var minutes = fromDate.getMinutes();
            if (minutes < 10)
                minutes = "0" + minutes;
            dateText = fromDate.getHours() + ":" + minutes;
        }

        if (fromDate.getDate() === Date.now().addDays(1).getDate()) {
            dateText = "Tomorrow " + dateText;
        }

        $scope.appointments.push({
            dateText: dateText,
            title: rawAppointment.title,
            location: rawAppointment.location
        });
    }


    //Remind me to do something on 15th of March at 5PM
    voiceService.addCommand("Remind me to *title on *date at *time", function (title, date, time) {
        var d = Date.parse(date.replace("of", "") + " " + time);
        if (d !== null) {
            var newAppointment = {
                from: d.getTime(),
                to: d.getTime(),
                title: title,
                location: {},
                username: "User"
            }
            calendarService.createAppointment(newAppointment, function (appointment) {
                addAppointment(appointment);
            });
        }
    });

    //Remind me to do something on 15th of March
    voiceService.addCommand("Remind me to *title on *date", function (title, date, time) {
        var d = Date.parse(date.replace("of", "") + " " + time);
        if (d !== null) {
            var newAppointment = {
                from: d.getTime(),
                to: d.getTime(),
                title: title,
                location: {},
                username: "User"
            }
            calendarService.createAppointment(newAppointment, function (appointment) {
                addAppointment(appointment);
            });
        }
    });

    //Remind me to do something tomorrow at 5PM
    voiceService.addCommand("Remind me to *title :day at *time", function (title, day, time) {
        var d = Date.parse(day + " " + time);
        if (d !== null) {
            var newAppointment = {
                from: d.getTime(),
                to: d.getTime(),
                title: title,
                location: {},
                username: "User"
            }
            calendarService.createAppointment(newAppointment, function (appointment) {
                addAppointment(appointment);
            });
        }
    });


    //Remind me to do something tomorrow
    voiceService.addCommand("Remind me to *title :date", function (title, date) {
        var d = Date.parse(date);
        if (d !== null) {
            var newAppointment = {
                from: d.getTime(),
                to: d.getTime(),
                title: title,
                location: {},
                username: "User"
            }
            calendarService.createAppointment(newAppointment, function (appointment) {
                addAppointment(appointment);
            });
        }
    });





}