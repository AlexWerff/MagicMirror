function getHomeDevices() {
    return [{
        UUID: "42f8c3fa74e94970b2ee745f676837c1",
        HomeType: "Beacon",
        AltName: "Gigaset Beacon",
        Brand: "Gigaset",
        OnDiscover: function (smartHomeService) {
            smartHomeService.sendCommandToDevice({
                deviceUUID: "0b02b67f29fa43fa865cb9d5d737b8ae",
                deviceType: "Light",
                characteristicUUID: "0000FFB200001000800000805F9B34FB",
                serviceUUID: "0000FFB000001000800000805F9B34FB",
                commandValue: "FFFFFFFF"
            });
        },
        OnDisappear: function (smartHomeService) {
            smartHomeService.sendCommandToDevice({
                deviceUUID: "0b02b67f29fa43fa865cb9d5d737b8ae",
                deviceType: "Light",
                characteristicUUID: "0000FFB200001000800000805F9B34FB",
                serviceUUID: "0000FFB000001000800000805F9B34FB",
                commandValue: "00000000"
            });
        },
        OnTick: function (timeStamp, smartHomeService) {

        },
        Commands: []
    }, {
        UUID: "e0:e5:cf:a0:06:1c", //"7cec796ba8ab"
        HomeType: "Light",
        AltName: "TV",
        Brand: "iegeek",
        OnDiscover: function (smartHomeService) {

        },
        OnDisappear: function (smartHomeService) {

        },
        OnTick: function (timeStamp, smartHomeService) {
var date = new Date(timeStamp);
            if (date.getHours() === 20 && date.getMinutes() == 1) {
                smartHomeService.sendCommandToDevice({
                    Command: "Make {{Device}} *color",
                    Value: "ECB912",
                    Service: "0000FFB000001000800000805F9B34FB",
                    Characteristics: "0000FFB200001000800000805F9B34FB"
                });
            }
        },
        Commands: [
            {
                Command: "{{Device}} Off",
                Value: "00000000",
                Service: "0000FFB000001000800000805F9B34FB",
                Characteristics: "0000FFB200001000800000805F9B34FB"
            },
            {
                Command: "{{Device}} On",
                Value: "FFFFFFFF",
                Service: "0000FFB000001000800000805F9B34FB",
                Characteristics: "0000FFB200001000800000805F9B34FB"
            },
            {
                Command: "Make {{Device}} *color",
                Value: "BBGGRR",
                Service: "0000FFB000001000800000805F9B34FB",
                Characteristics: "0000FFB200001000800000805F9B34FB"
            }

        ]
    }, {
        UUID: "7c:ec:79:6b:a8:ab", //"7cec796ba8ab"
        HomeType: "Light",
        AltName: "Window",
        Brand: "iegeek",
        OnDiscover: function (smartHomeService) {

        },
        OnDisappear: function (smartHomeService) {

        },
        OnTick: function (timeStamp, smartHomeService) {
            var date = new Date(timeStamp);
            if (date.getHours() === 20 && date.getMinutes() == 0) {
                smartHomeService.sendCommandToDevice({
                    Command: "Make {{Device}} *color",
                    Value: "ECB912",
                    Service: "0000FFB000001000800000805F9B34FB",
                    Characteristics: "0000FFB200001000800000805F9B34FB"
                });
            }
        },
        Commands: [
            {
                Command: "{{Device}} Off",
                Value: "00000000",
                Service: "0000FFB000001000800000805F9B34FB",
                Characteristics: "0000FFB200001000800000805F9B34FB"
            },
            {
                Command: "{{Device}} On",
                Value: "FFFFFFFF",
                Service: "0000FFB000001000800000805F9B34FB",
                Characteristics: "0000FFB200001000800000805F9B34FB"
            },
            {
                Command: "Make {{Device}} *color",
                Value: "BBGGRR",
                Service: "0000FFB000001000800000805F9B34FB",
                Characteristics: "0000FFB200001000800000805F9B34FB"
            }

        ]
    }, {
        UUID: "",
        HomeType: "MusicPlayer",
        AltName: "Player",
        Brand: "iegeek",
        OnDiscover: function (smartHomeService) {

        },
        OnDisappear: function (smartHomeService) {

        },
        OnTick: function (timeStamp, smartHomeService) {},
        Commands: [

        ]
    }];
}