exports.createRoutesForNoble = function (client) {
    try {
        var noble = require('noble');
        var peripherals = [];
        var connectedDevices = [];
        var devicesInLastScan = [];
        var currPer = null;
        var currentState = 'unknown';


        console.log('Client connected.');

        noble.on('discover', function (peripheral) {
            var containsPeripheral = false;
            peripherals.forEach(function (per) {
                if (per.address === peripheral.address)
                    containsPeripheral = true;
            });
            devicesInLastScan.push(peripheral);

            var device = {
                Type: "bluetooth",
                Name: peripheral.advertisement.localName,
                UUID: peripheral.address
            };
            if (!containsPeripheral) {
                peripherals.push(peripheral);
            }
            client.emit("deviceFound", device);
            console.log("Device found: " + JSON.stringify(device));
        });

        noble.on('stateChange', function (state) {
            currentState = state;
        });

        client.on('startScanning', function (type) {
            try {
                noble.stopScanning();
                peripherals.forEach(function (per, index) {
                    var inLastScan = false;
                    devicesInLastScan.forEach(function (dev) {
                        if (dev.address === per.address)
                            inLastScan = true;
                    });
                    if (currPer !== null && currPer.address === per.address)
                        inLastScan = true;
                    if (!inLastScan) { //Device disappeared
                        var device = {
                            Type: "bluetooth",
                            Name: per.advertisement.localName,
                            UUID: per.address
                        };
                        peripherals.splice(index, 1);
                        client.emit("deviceDisappeared", device);
                    }
                });
                noble.startScanning();
                console.log("start-scanning");
                devicesInLastScan = [];
            } catch (ex) {
                console.log(ex);
            }
        });

        var equals = function (a, b) {
            return a.replace("-", "").toUpperCase() === b.replace("-", "").toUpperCase();
        }

        var writeChar = function (command, per) {
            per.discoverServices(null, function (error, services) {
                services.forEach(function (service) {
                    if (equals(service.uuid, command.serviceUUID)) {
                        service.discoverCharacteristics(null, function (error, characteristics) {
                            characteristics.forEach(function (characteristic) {
                                if (equals(command.characteristicUUID, characteristic.uuid)) {
                                    console.log("writing...");
                                    var buffer = new Buffer(command.commandValue, 'hex');
                                    characteristic.write(buffer);
                                    characteristic.read(function (err, data) {
                                        console.log(buffer.toString('hex') + " written");
                                        per.disconnect(function (err) {
                                            console.log("successfull written");
                                            client.emit("characteristicWritten", data.toString('hex'));
                                        });
                                    });
                                }
                            });

                        });
                    }
                });
            });
        }

        client.on('writeCharacteristic', function (command) {
            try {
                peripherals.forEach(function (per) {
                    if (command.deviceUUID === per.address) {
                        console.log("writing char");
                        if (currPer !== per) {
                            if (currPer === null) {
                                per.connect(function (error) {
                                    //currPer = per;
                                    writeChar(command, per);
                                });
                            } else {
                                per.disconnect(function (err) {
                                    per.connect(function (error) {
                                        //currPer = per;
                                        writeChar(command, per);
                                    });
                                });
                            }
                        } else {
                            writeChar(command, per);
                        }

                    }
                });
            } catch (ex) {
                console.log(ex);
            }

        });

        client.on('readCharacteristic', function (command) {

        });

        client.on('discoverCharacteristics', function (uuid) {
            connectedDevices.forEach(function (per) {
                if (per.address === address) {
                    var result = {
                        uuid: uuid,
                        services: []
                    }
                    per.discoverServices(null, function (error, services) {
                        services.forEach(function (serv) {
                            var service = {
                                uuid: serv.uuid,
                                characteristics: []
                            }
                            service.discoverCharacteristics(null, function (error, characteristics) {
                                characteristics.forEach(function (char) {
                                    var characteristic = {
                                        uuid: char.uuid,
                                        mode: "Unknown"
                                    }
                                    service.characteristics.push(characteristic);
                                });
                                result.services.push(service);
                            });
                        });
                    });
                }
            });
        });

        client.on('connectDevice', function (uuid) {
            peripherals.forEach(function (per) {
                if (per.address === uuid) {
                    //per.connect(function (error) {
                    console.log('connected to peripheral: ' + per.address);
                    connectedDevices.push(per);
                    client.emit("deviceConnected", per.address);
                    //});
                }
            });
        });

        client.on('disconnectDevice', function (uuid) {
            peripherals.forEach(function (per) {
                if (per.address === address) {
                    per.disconnect(function (error) {
                        console.log('disconnected peripheral: ' + per.address);
                        client.emit("deviceDisconnected", per.address);
                    });
                }
            });
        });
    } catch (ex) {
        console.log(ex);
    }
}

exports.createRoutesForSpotify = function (client) {
    /*try {
        var spotify = null;
        var lame = require('lame');
        var Speaker = require('speaker');
        var Spotify = require('spotify-web');

        var speaker = new Speaker();
        var lameDecoder = new lame.Decoder();
        var currentTrackStream = null;
        var lameDecoderPipe = null;
        var speakerPipe = null;
        var currentTrack = null;


        // Spotify credentials... 
        var username = "1123074523";
        var password = "Laika233";

        Spotify.login(username, password, function (err, spot) {
            if (err) throw err;
            spotify = spot;
            //playTrack("7vfWgVGiLgnGbInU5lvSQg");
            client.emit("onMusicLoggedIn", "Spotify");
        });

        var getPlaylists = function (finished) {
            spotify.rootlist(username, function (err, rootlist) {
                if (err) throw err;
                if (finished !== undefined)
                    finished(rootlist.contents.items);
            });
        }

        var getPlaylist = function (playlistUri, finished) {
            spotify.playlist(playlistUri, function (err, playlist) {
                if (err) throw err;
                spotify.get(playlistUri, function (err, playlistInfo) {
                    if (finished !== undefined)
                        finished(playlist.contents.items);
                });
            });
        }

        var playTrack = function (trackID, finished) {
            if (currentTrackStream !== null) {
                lameDecoderPipe.unpipe(speakerPipe);
                currentTrackStream.unpipe(lameDecoderPipe);
            }
            console.log(trackID);
            // first get a "Track" instance from the track URI 
            spotify.get(trackID, function (err, track) {
                if (err) throw console.log(err);
                currentTrack = track;
                console.log('Playing: %s - %s', track.artist[0].name, track.name);
                // play() returns a readable stream of MP3 audio data 
                currentTrackStream = track.play();
                lameDecoderPipe = currentTrackStream.pipe(lameDecoder);
                speakerPipe = lameDecoder.pipe(speaker);
                speakerPipe.on('finish', function () {
                    if (finished !== undefined)
                        finished();
                    client.emit("onFinishedTrack", {
                        artist: track.artist[0].name,
                        name: track.name,
                        album: {
                            name: track.album.name,
                            coverImageUri: track.album.coverGroup.image[0].uri
                        },
                        duration: track.duration,
                        uri: trackID
                    });
                });

            });
        };


        client.on('playTrack', function (trackID) {
            playTrack(trackID);
        });

        client.on('getTrackInfo', function (trackID) {
            try {
                spotify.get(trackID, function (err, track) {
                    if (err) throw err;
                    client.emit("onGetTrackInfo", {
                        artist: track.artist[0].name,
                        name: track.name,
                        album: {
                            name: track.album.name,
                            coverImageUri: track.album.coverGroup.image[0].uri
                        },
                        duration: track.duration,
                        uri: trackID
                    });
                });
            } catch (ex) {
                console.log(ex);
            }
        });

        client.on('getPlaylists', function () {
            getPlaylists(function (playlists) {
                client.emit("onGetPlaylists", playlists);
            });
        });

        client.on('getPlaylist', function (uri) {
            getPlaylist(uri, function (playlist) {
                client.emit("onGetPlaylist", playlist);
            });
        });

        client.on('getCurrentTrack', function () {
            if (currentTrack !== null) {
                client.emit("onGetCurrentTrack", currentTrack.uri);
            } else {
                client.emit("onGetCurrentTrack", null);
            }

        });
    } catch (ex) {
        console.log(ex);
    }
    */

};