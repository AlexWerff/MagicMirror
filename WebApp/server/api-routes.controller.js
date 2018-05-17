exports.setRoutesForApp = function (app) {
    app.post('/api/postAppointment', function (req, res) {
        var appointmentController = require('./controller/appointment-controller.js');
        appointmentController.postAppointment(req.body,res);
    });

    app.get('/api/getAppointments/:from/:to/:username/:limit', function (req, res) {
        var appointmentController = require('./controller/appointment-controller.js');
        appointmentController.getAppointments(req.params.from,req.params.to,req.params.username,req.params.limit,res);
    });

};