angular.module('magicMirrorApp').service('smartHomeService', function ($http, $timeout, $rootScope, voiceService) {
    var devices = [];
    var knownDevices = getHomeDevices();

    var dev;

    var socket = io.connect('http://localhost:3000');
    socket.on('connect', function (data) {
        console.log("Connected to IO");
        socket.emit("startScanning", "bluetooth");
    });
    socket.on('deviceFound', function (device) {
        console.log(device);
        device.Connected = false;
        var isInKnownDevices = false;
        knownDevices.forEach(function (knownDevice) {
            if (knownDevice.UUID == device.UUID) {
                device.HomeType = knownDevice.HomeType;
                device.AltName = knownDevice.AltName;
                device.Commands = knownDevice.Commands;
                device.OnDiscover = knownDevice.OnDiscover;
                device.OnDisappear = knownDevice.OnDisappear;
                device.OnTick = knownDevice.OnTick;
                isInKnownDevices = true;
            }
        });
        if (isInKnownDevices) {
            var containsDevice = false;
            devices.forEach(function (dev) {
                if (device.UUID === dev.UUID)
                    containsDevice = true;
            });
            if (!containsDevice) {
                devices.push(device);
                if (device.OnDiscover !== undefined)
                    device.OnDiscover(instance);
                $rootScope.$broadcast("deviceFound", device);
                //socket.emit("discoverCharacteristics", device.UUID);
                connectToDevice(device.UUID);
            }
        }


    });


    voiceService.addCommand("Turn Lights (state)", function (state) {
        devices.forEach(function (device) {
            if (device.HomeType === "Light") {
                        //if(state.toLocaleLowerCase() === "on"){
            }
        });
    })

    socket.on('deviceDisappeared', function (device) {
        knownDevices.forEach(function (knownDevice) {
            if (knownDevice.UUID == device.UUID) {
                if (knownDevice.OnDisappear !== undefined)
                    knownDevice.OnDisappear(instance);
            }
        });
    });

    socket.on('characteristicWritten', function (command) {
        console.log(command);
    });

    socket.on('deviceConnected', function (uuid) {
        devices.forEach(function (device) {
            if (device.UUID == uuid) {
                device.Connected = true;
                $rootScope.$broadcast("deviceConnected", device);
                device.Commands.forEach(function (cmd) {
                    var command = cmd.Command.replace("{{Device}}", device.AltName);
                    voiceService.addCommand(command, function (value) {
                        if (value !== undefined) {
                            var colorValue = colourNameToHex(value);
                            if (colorValue !== false) {
                                value = colorValue;
                            }
                        }
                        sendCommandToDevice({
                            deviceUUID: device.UUID,
                            deviceType: device.HomeType,
                            serviceUUID: cmd.Service,
                            characteristicUUID: cmd.Characteristics,
                            commandValue: value === undefined ? cmd.Value : value
                        });
                    });
                })
            }
        });

    });


    var getTypeForDevice = function (deviceUIID) {
        var type = "Unknown";
        knownDevices.forEach(function (dev) {
            if (dev.UUID === deviceUIID)
                type = dev.HomeType;
        });
        return type;
    }


    var getDevices = function () {
        return devices;
    }

    var connectToDevice = function (UUID) {
        socket.emit("connectDevice", UUID);
    }

    var disconnectDevice = function (UUID) {
        socket.emit("disconnectDevice", UUID);
    }

    /*
        command= {
            deviceUUID:"",
            deviceType:"",
            serviceUUID:"",
            characteristicUUID:"",
            commandValue:""
        }
    */
    var sendCommandToDevice = function (command) {
        if (command.deviceType == "Light") {
            socket.emit("writeCharacteristic", command);
        }
    }


    var pollScanning = function () {
        socket.emit("startScanning", "bluetooth");
        $timeout(function () {      
            pollScanning();
        }, 30000);
    }

    pollScanning();

    var instance = {
        getDevices: getDevices,
        connectDevice: connectToDevice,
        disconnectDevice: disconnectDevice,
        sendCommandToDevice: sendCommandToDevice
    }
    return instance;
});