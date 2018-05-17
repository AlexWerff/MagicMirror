angular.module('magicMirrorApp').directive('youtube', function ($window, YT_event) {
    return {
        restrict: "E",

        scope: {
            height: "@",
            width: "@",
            videoid: "@"
        },

        template: '<div></div>',

        link: function (scope, element, attrs, $rootScope) {
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            var player;

            $window.onYouTubeIframeAPIReady = function () {
                player = new YT.Player(element.children()[0], {
                    playerVars: {
                        autoplay: 0,
                        html5: 1,
                        theme: "light",
                        modesbranding: 0,
                        color: "white",
                        iv_load_policy: 3,
                        showinfo: 0,
                        controls: 0
                    },

                    height: scope.height,
                    width: scope.width,
                    videoId: scope.videoid,

                    events: {
                        'onStateChange': function (event) {

                            var message = {
                                event: YT_event.STATUS_CHANGE,
                                data: ""
                            };

                            switch (event.data) {
                            case YT.PlayerState.PLAYING:
                                message.data = "PLAYING";
                                break;
                            case YT.PlayerState.ENDED:
                                message.data = "ENDED";
                                break;
                            case YT.PlayerState.UNSTARTED:
                                message.data = "NOT PLAYING";
                                break;
                            case YT.PlayerState.PAUSED:
                                message.data = "PAUSED";
                                break;
                            }

                            scope.$apply(function () {
                                scope.$emit(message.event, message.data);
                            });
                        }
                    }
                });
                adjustPlayToWindow();
            };

            var adjustPlayToWindow = function () {
                var width = $window.innerWidth * 0.8;
                scope.width = width;
                var height = $window.innerWidth * 0.4;
                scope.height = height;
                player.setSize(scope.width, scope.height);

                // manuall $digest required as resize event
                // is outside of angular
                scope.$digest();
            }

            angular.element($window).bind('resize', function () {
                adjustPlayToWindow();
            });

            scope.$watch('videoid', function (newValue, oldValue) {
                if (newValue == oldValue) {
                    return;
                }

                player.cueVideoById(scope.videoid);

            });

            scope.$on(YT_event.STOP, function () {
                player.seekTo(0);
                player.stopVideo();
            });

            scope.$on(YT_event.PLAY, function () {
                player.playVideo();
            });

            scope.$on(YT_event.PAUSE, function () {
                player.pauseVideo();
            });

        }
    };
});