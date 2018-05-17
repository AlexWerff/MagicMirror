angular.module('magicMirrorApp')
    .controller('MusicController', ['$rootScope', '$scope', '$http', '$routeParams', '$timeout', 'musicService', 'voiceService', MusicController])

function MusicController($rootScope, $scope, $http, $routeParams, $timeout, musicService, voiceService) {
    $scope.playlists = [];
    $scope.currentTrackIndex = 1;
    var currentTrackDuration = 0;
    var playing = false;
    $scope.progressStyle = {
        width: '0%'
    };

    $scope.currentPlaylist = {
        tracks: []
    };

    $scope.getPlaylistInfo = function (playlist) {
        return playlist.uri;
    };


    var selectPlaylist = function (playlistUri) {
        musicService.selectPlaylist($scope.playlists[0].uri);
        $scope.currentPlaylist = musicService.getCurrentPlaylist();
        updateTrackData();
    };

    var updateTrackData = function () {
        musicService.requestTrackInfo($scope.currentPlaylist.tracks[$scope.currentTrackIndex - 1].uri);
        musicService.requestTrackInfo($scope.currentPlaylist.tracks[$scope.currentTrackIndex].uri);
        musicService.requestTrackInfo($scope.currentPlaylist.tracks[$scope.currentTrackIndex + 1].uri);

    }

    var onProgress = function () {
        var val = currentTrackDuration / $scope.currentPlaylist.tracks[$scope.currentTrackIndex].duration * 100;
        $scope.progressStyle.width = val + "%";
    }

    var next = function () {
        $scope.currentTrackIndex++;
        updateTrackData();
        playCurrentTrack();
    }

    var previous = function () {
        $scope.currentTrackIndex--;
        updateTrackData();
        playCurrentTrack();
    }

    var playCurrentTrack = function () {
        playing = true;
        var currentTrack = $scope.currentPlaylist.tracks[$scope.currentTrackIndex];
        musicService.playTrack(currentTrack.uri, next);
        currentTrackDuration = 0;
        onProgress();
    };

    var pauseCurrentTrack = function () {
        playing = false;
        var currentTrack = $scope.currentPlaylist.tracks[$scope.currentTrackIndex];
        musicService.pauseTrack(currentTrack.uri, next);
        onProgress();
    };

    $scope.$on("music-onGetTrackInfo", function (event, trackInfo) {
        $scope.currentPlaylist.tracks.forEach(function (track) {
            if (track.uri === trackInfo.uri) {
                $scope.$apply(function () {
                    track.artist = trackInfo.artist;
                    track.name = trackInfo.name;
                    track.duration = trackInfo.duration;
                    track.album.coverImageUri = trackInfo.album.coverImageUri;
                }, true);
            }
        });
    });

    $scope.$on("musicSynced", function () {
        $scope.playlists = musicService.getPlaylists();
        selectPlaylist($scope.playlists[0].uri);
    });


    voiceService.addCommand("Play", function () {
        playCurrentTrack();
    });

    voiceService.addCommand("Pause", function () {
        pauseCurrentTrack();
    });

    voiceService.addCommand("Next", function () {
        next();
    });

    voiceService.addCommand("Previous", function () {
        previous();
    });

}