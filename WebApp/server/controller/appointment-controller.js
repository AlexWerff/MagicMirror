exports.getAppointments = function (from, to, username, limit, res) {
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect("mongodb://localhost:27017/mirrorapp", function (err, db) {
        var collection = db.collection('appointments');
        if (collection !== null) {
            var cursor = collection.find({
                username: username
            }).sort({
                from: 1
            });
            var result = [];
            var currentIndex = 0;
            cursor.each(function (err, appointment) {
                if (appointment === null)
                    res.send(result);
                if (currentIndex < limit) {
                    result.push(appointment);
                    currentIndex++;
                }
            });
        }
        else
            res.send("[]");

    });
}

//FORMAT
/*var newAppointment = {
        from: 0,
        to: 0,
        title: "New Appointment",
        where: {
            lat: 0,
            lng: 0
        },
        username:"User"
    }*/
exports.postAppointment = function (appointment, res) {
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect("mongodb://localhost:27017/mirrorapp", function (err, db) {
        db.collection('appointments').insertOne(appointment);
        res.send("OK");
    });

}