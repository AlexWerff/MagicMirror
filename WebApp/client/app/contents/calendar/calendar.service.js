angular.module('magicMirrorApp').service('calendarService', function ($http, $timeout, $rootScope) {
    var appointments = [];
    var currentFrom = Date.now().getTime();
    var currentTo = Date.now().getTime()+(24*60*60*1000);
    var currentUser = "User";
    var limit = 5;

    var getAppointments = function (from, to, user, finished) {
        if (from !== undefined)
            currentFrom = from;
        if (to !== undefined)
            currentTo = to;
        if(user !== undefined)
            currentUser = user;

        $http.get("/api/getAppointments/" + currentFrom + "/" + currentTo + "/" + currentUser+"/"+limit).success(function (data, err) {
            appointments = data;
            if (finished !== undefined)
                finished(appointments);
        });
    };


    var createAppointment = function (appointment, finished) {
        $http.post("/api/postAppointment", appointment).success(function (data, err) {
            appointments.push(appointment);
            if (finished !== undefined)
                finished(appointment);
        });
    }

    var poll = function () {
        getAppointments();
        $timeout(poll,15000);
    }
    
    poll();
    
    var setLimit = function(lim){
        limit = lim;
    }
        

    return {
        getAppointments: getAppointments,
        createAppointment: createAppointment,
        setLimit:setLimit
    }
});