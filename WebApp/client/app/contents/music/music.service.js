angular.module('magicMirrorApp').service('musicService', function ($http, $timeout, $rootScope, voiceService) {

    var socket = io.connect('http://localhost:3000');
    var onGetPlaylists = undefined;
    var onGetPlaylist = undefined;
    var onGetTrackInfo = undefined;
    var onFinishedPlaying = undefined;
    var onFetchCurrentTrack = undefined;

    var playlists = [];
    var currentPlaylist = undefined;
    var currentTrackUri = undefined;



    socket.on('connect', function (data) {
        console.log("Connected to MusicIO");
    });

    socket.on('onMusicLoggedIn', function (service) {
        sync();
    });


    socket.on('onGetPlaylists', function (playlists) {
        if (onGetPlaylists !== undefined)
            onGetPlaylists(playlists);
    });

    socket.on('onGetPlaylist', function (playlist) {
        if (onGetPlaylist !== undefined)
            onGetPlaylist(playlist);
    });

    socket.on('onGetTrackInfo', function (trackInfo) {
        $rootScope.$broadcast("music-onGetTrackInfo", trackInfo);
    });

    socket.on('onFinishedTrack', function (trackInfo) {
        if (onFinishedPlaying !== undefined)
            onFinishedPlaying(trackInfo);
    });

    socket.on('onGetCurrentTrack', function (trackUri) {
        currentTrackUri = trackUri;
        if (onFetchCurrentTrack !== undefined)
            onFetchCurrentTrack();
    });


    var requestTrackInfo = function (trackUri) {
        socket.emit("getTrackInfo", trackUri);
    };

    var playTrack = function (trackUri, finished) {
        onFinishedPlaying = finished;
        socket.emit("playTrack", trackUri);
    }

    var fetchPlaylist = function (playlistUri, finished) {
        onGetPlaylist = finished;
        socket.emit("getPlaylist", playlistUri);
    }

    var fetchPlaylists = function (finished) {
        onGetPlaylists = finished;
        socket.emit("getPlaylists");
    }

    var fetchCurrentTrack = function (finished) {
        socket.emit("getCurrentTrack");
    }

    var selectPlaylist = function (playlistUri) {
        playlists.forEach(function (list) {
            if (list.uri === playlistUri)
                currentPlaylist = list;
        });
    };


    var getPlaylists = function () {
        return playlists;
    }

    var getPlaylist = function (playlistUri) {
        playlists.forEach(function (list) {
            if (list.uri === playlistUri) {
                return list;
            }
        });
    };

    var getCurrentTrack = function () {
        return currentTrack;
    }

    var getCurrentPlaylist = function () {
        return currentPlaylist;
    }

    var sync = function () {

        fetchPlaylists(function (plays) { //cache
            playlists = [];
            var counter = 0;
            plays.forEach(function (list, index) {
                fetchPlaylist(list.uri, function (tracks) {
                    var newPlaylist = {
                        uri: list.uri,
                        tracks: []
                    };
                    playlists.push(newPlaylist);
                    tracks.forEach(function (track) {
                        newPlaylist.tracks.push({
                            artist: "Unknown",
                            name: "Unknown",
                            album: {
                                name: "Unknown",
                                coverImageUri: ""
                            },
                            duration: 0,
                            uri: track.uri
                        });
                    });
                    counter++;
                    if (counter === plays.length) {
                        fetchCurrentTrack(function () {
                            $rootScope.$broadcast("musicSynced");
                        });
                    }
                });
            });
        });
    };



    var result = {
        playTrack: playTrack,
        requestTrackInfo: requestTrackInfo,
        getPlaylist: getPlaylist,
        getPlaylists: getPlaylists,
        getCurrentTrackUri: getCurrentTrack,
        selectPlaylist: selectPlaylist,
        getCurrentPlaylist: getCurrentPlaylist,
        sync: sync
    }

    return result;

});