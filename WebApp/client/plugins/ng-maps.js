! function (e, t) {
    "object" == typeof exports ? module.exports = t(require("angular")) : "function" == typeof define && define.amd ? define(["angular"], t) : t(e.angular)
}(this, function (angular) {
    /**
     * AngularJS Google Maps Ver. 1.16.8
     *
     * The MIT License (MIT)
     *
     * Copyright (c) 2014, 2015, 1016 Allen Kim
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy of
     * this software and associated documentation files (the "Software"), to deal in
     * the Software without restriction, including without limitation the rights to
     * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
     * the Software, and to permit persons to whom the Software is furnished to do so,
     * subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in all
     * copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
     * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
     * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
     * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
     * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     */
    return angular.module("ngMap", []),
        function () {
            "use strict";
            var e, t = function (t, n, o, r, i, a, s) {
                e = i;
                var p = this;
                p.mapOptions, p.mapEvents, p.eventListeners, p.addObject = function (e, t) {
                    if (p.map) {
                        p.map[e] = p.map[e] || {};
                        var n = Object.keys(p.map[e]).length;
                        p.map[e][t.id || n] = t, p.map instanceof google.maps.Map && ("infoWindows" != e && t.setMap && t.setMap && t.setMap(p.map), t.centered && t.position && p.map.setCenter(t.position), "markers" == e && p.objectChanged("markers"), "customMarkers" == e && p.objectChanged("customMarkers"))
                    }
                }, p.deleteObject = function (e, t) {
                    if (t.map) {
                        var n = t.map[e];
                        for (var o in n) n[o] === t && (google.maps.event.clearInstanceListeners(t), delete n[o]);
                        t.map && t.setMap && t.setMap(null), "markers" == e && p.objectChanged("markers"), "customMarkers" == e && p.objectChanged("customMarkers")
                    }
                }, p.observeAttrSetObj = function (t, n, o) {
                    if (n.noWatcher) return !1;
                    for (var r = e.getAttrsToObserve(t), i = 0; i < r.length; i++) {
                        var s = r[i];
                        n.$observe(s, a.observeAndSet(s, o))
                    }
                }, p.zoomToIncludeMarkers = function () {
                    var e = new google.maps.LatLngBounds;
                    for (var t in p.map.markers) e.extend(p.map.markers[t].getPosition());
                    for (var n in p.map.customMarkers) e.extend(p.map.customMarkers[n].getPosition());
                    p.map.fitBounds(e)
                }, p.objectChanged = function (e) {
                    !p.map || "markers" != e && "customMarkers" != e || "auto" != p.map.zoomToIncludeMarkers || p.zoomToIncludeMarkers()
                }, p.initializeMap = function () {
                    var i = p.mapOptions,
                        u = p.mapEvents,
                        l = p.map;
                    if (p.map = s.getMapInstance(n[0]), a.setStyle(n[0]), l) {
                        var g = e.filter(o),
                            d = e.getOptions(g),
                            f = e.getControlOptions(g);
                        i = angular.extend(d, f);
                        for (var m in l) {
                            var v = l[m];
                            if ("object" == typeof v)
                                for (var y in v) p.addObject(m, v[y])
                        }
                        p.map.showInfoWindow = p.showInfoWindow, p.map.hideInfoWindow = p.hideInfoWindow
                    }
                    i.zoom = i.zoom || 15;
                    var h = i.center;
                    if (!i.center || "string" == typeof h && h.match(/\{\{.*\}\}/)) i.center = new google.maps.LatLng(0, 0);
                    else if (!(h instanceof google.maps.LatLng)) {
                        var M = i.center;
                        delete i.center, a.getGeoLocation(M, i.geoLocationOptions).then(function (e) {
                            p.map.setCenter(e);
                            var n = i.geoCallback;
                            n && r(n)(t)
                        }, function () {
                            i.geoFallbackCenter && p.map.setCenter(i.geoFallbackCenter)
                        })
                    }
                    p.map.setOptions(i);
                    for (var O in u) {
                        var b = u[O],
                            w = google.maps.event.addListener(p.map, O, b);
                        p.eventListeners[O] = w
                    }
                    p.observeAttrSetObj(c, o, p.map), p.singleInfoWindow = i.singleInfoWindow, google.maps.event.trigger(p.map, "resize"), google.maps.event.addListenerOnce(p.map, "idle", function () {
                        a.addMap(p), i.zoomToIncludeMarkers && p.zoomToIncludeMarkers(), t.map = p.map, t.$emit("mapInitialized", p.map), o.mapInitialized && r(o.mapInitialized)(t, {
                            map: p.map
                        })
                    })
                }, t.google = google;
                var c = e.orgAttributes(n),
                    u = e.filter(o),
                    l = e.getOptions(u, {
                        scope: t
                    }),
                    g = e.getControlOptions(u),
                    d = angular.extend(l, g),
                    f = e.getEvents(t, u);
                Object.keys(f).length && void 0, p.mapOptions = d, p.mapEvents = f, p.eventListeners = {}, l.lazyInit ? (p.map = {
                    id: o.id
                }, a.addMap(p)) : p.initializeMap(), l.triggerResize && google.maps.event.trigger(p.map, "resize"), n.bind("$destroy", function () {
                    s.returnMapInstance(p.map), a.deleteMap(p)
                })
            };
            t.$inject = ["$scope", "$element", "$attrs", "$parse", "Attr2MapOptions", "NgMap", "NgMapPool"], angular.module("ngMap").controller("__MapController", t)
        }(),
        function () {
            "use strict";
            var e, t = function (t, o, r, i) {
                    i = i[0] || i[1];
                    var a = e.orgAttributes(o),
                        s = e.filter(r),
                        p = e.getOptions(s, {
                            scope: t
                        }),
                        c = e.getEvents(t, s),
                        u = n(p, c);
                    i.addObject("bicyclingLayers", u), i.observeAttrSetObj(a, r, u), o.bind("$destroy", function () {
                        i.deleteObject("bicyclingLayers", u)
                    })
                },
                n = function (e, t) {
                    var n = new google.maps.BicyclingLayer(e);
                    for (var o in t) google.maps.event.addListener(n, o, t[o]);
                    return n
                },
                o = function (n) {
                    return e = n, {
                        restrict: "E",
                        require: ["?^map", "?^ngMap"],
                        link: t
                    }
                };
            o.$inject = ["Attr2MapOptions"], angular.module("ngMap").directive("bicyclingLayer", o)
        }(),
        function () {
            "use strict";
            var e, t, n, o = function (n, o, r, i) {
                    i = i[0] || i[1];
                    var a = e.filter(r),
                        s = e.getOptions(a, {
                            scope: n
                        }),
                        p = e.getEvents(n, a),
                        c = o[0].parentElement.removeChild(o[0]);
                    t(c.innerHTML.trim())(n);
                    for (var u in p) google.maps.event.addDomListener(c, u, p[u]);
                    i.addObject("customControls", c);
                    var l = s.position;
                    i.map.controls[google.maps.ControlPosition[l]].push(c), o.bind("$destroy", function () {
                        i.deleteObject("customControls", c)
                    })
                },
                r = function (r, i, a) {
                    return e = r, t = i, n = a, {
                        restrict: "E",
                        require: ["?^map", "?^ngMap"],
                        link: o
                    }
                };
            r.$inject = ["Attr2MapOptions", "$compile", "NgMap"], angular.module("ngMap").directive("customControl", r)
        }(),
        function () {
            "use strict";
            var e, t, n, o, r = function (e) {
                    e = e || {}, this.el = document.createElement("div"), this.el.style.display = "inline-block", this.el.style.visibility = "hidden", this.visible = !0;
                    for (var t in e) this[t] = e[t]
                },
                i = function () {
                    r.prototype = new google.maps.OverlayView, r.prototype.setContent = function (e, t) {
                        this.el.innerHTML = e, this.el.style.position = "absolute", t && n(angular.element(this.el).contents())(t)
                    }, r.prototype.getDraggable = function () {
                        return this.draggable
                    }, r.prototype.setDraggable = function (e) {
                        this.draggable = e
                    }, r.prototype.getPosition = function () {
                        return this.position
                    }, r.prototype.setPosition = function (e) {
                        if (e && (this.position = e), this.getProjection() && "function" == typeof this.position.lng) {
                            var n = this.getProjection().fromLatLngToDivPixel(this.position),
                                o = this,
                                r = function () {
                                    var e = Math.round(n.x - o.el.offsetWidth / 2),
                                        t = Math.round(n.y - o.el.offsetHeight - 10);
                                    o.el.style.left = e + "px", o.el.style.top = t + "px", o.el.style.visibility = "visible"
                                };
                            o.el.offsetWidth && o.el.offsetHeight ? r() : t(r, 300)
                        }
                    }, r.prototype.setZIndex = function (e) {
                        e && (this.zIndex = e), this.el.style.zIndex = this.zIndex
                    }, r.prototype.getVisible = function () {
                        return this.visible
                    }, r.prototype.setVisible = function (e) {
                        this.el.style.display = e ? "inline-block" : "none", this.visible = e
                    }, r.prototype.addClass = function (e) {
                        var t = this.el.className.trim().split(" "); - 1 == t.indexOf(e) && t.push(e), this.el.className = t.join(" ")
                    }, r.prototype.removeClass = function (e) {
                        var t = this.el.className.split(" "),
                            n = t.indexOf(e);
                        n > -1 && t.splice(n, 1), this.el.className = t.join(" ")
                    }, r.prototype.onAdd = function () {
                        this.getPanes().overlayMouseTarget.appendChild(this.el)
                    }, r.prototype.draw = function () {
                        this.setPosition(), this.setZIndex(this.zIndex), this.setVisible(this.visible)
                    }, r.prototype.onRemove = function () {
                        this.el.parentNode.removeChild(this.el)
                    }
                },
                a = function (t, n) {
                    return function (i, a, s, p) {
                        p = p[0] || p[1];
                        var c = e.orgAttributes(a),
                            u = e.filter(s),
                            l = e.getOptions(u, {
                                scope: i
                            }),
                            g = e.getEvents(i, u);
                        a[0].style.display = "none";
                        var d = new r(l);
                        i.$watch("[" + n.join(",") + "]", function () {
                            d.setContent(t, i)
                        }), d.setContent(a[0].innerHTML, i);
                        var f = a[0].firstElementChild.className;
                        d.addClass("custom-marker"), d.addClass(f), l.position instanceof google.maps.LatLng || o.getGeoLocation(l.position).then(function (e) {
                            d.setPosition(e)
                        });
                        for (var m in g) google.maps.event.addDomListener(d.el, m, g[m]);
                        p.addObject("customMarkers", d), p.observeAttrSetObj(c, s, d), a.bind("$destroy", function () {
                            p.deleteObject("customMarkers", d)
                        })
                    }
                },
                s = function (r, s, p, c) {
                    return e = p, t = r, n = s, o = c, {
                        restrict: "E",
                        require: ["?^map", "?^ngMap"],
                        compile: function (e) {
                            i(), e[0].style.display = "none";
                            var t = e.html(),
                                n = t.match(/{{([^}]+)}}/g),
                                o = [];
                            return (n || []).forEach(function (e) {
                                var t = e.replace("{{", "").replace("}}", ""); - 1 == e.indexOf("::") && -1 == e.indexOf("this.") && -1 == o.indexOf(t) && o.push(e.replace("{{", "").replace("}}", ""))
                            }), a(t, o)
                        }
                    }
                };
            s.$inject = ["$timeout", "$compile", "Attr2MapOptions", "NgMap"], angular.module("ngMap").directive("customMarker", s)
        }(),
        function () {
            "use strict";
            var e, t, n, o = function (e, t) {
                    e.panel && (e.panel = document.getElementById(e.panel) || document.querySelector(e.panel));
                    var n = new google.maps.DirectionsRenderer(e);
                    for (var o in t) google.maps.event.addListener(n, o, t[o]);
                    return n
                },
                r = function (e, o) {
                    var r = new google.maps.DirectionsService,
                        i = o;
                    i.travelMode = i.travelMode || "DRIVING";
                    var a = ["origin", "destination", "travelMode", "transitOptions", "unitSystem", "durationInTraffic", "waypoints", "optimizeWaypoints", "provideRouteAlternatives", "avoidHighways", "avoidTolls", "region"];
                    for (var s in i) - 1 === a.indexOf(s) && delete i[s];
                    i.waypoints && ("[]" == i.waypoints || "" === i.waypoints) && delete i.waypoints;
                    var p = function (n) {
                        r.route(n, function (n, o) {
                            o == google.maps.DirectionsStatus.OK && t(function () {
                                e.setDirections(n)
                            })
                        })
                    };
                    i.origin && i.destination && ("current-location" == i.origin ? n.getCurrentPosition().then(function (e) {
                        i.origin = new google.maps.LatLng(e.coords.latitude, e.coords.longitude), p(i)
                    }) : "current-location" == i.destination ? n.getCurrentPosition().then(function (e) {
                        i.destination = new google.maps.LatLng(e.coords.latitude, e.coords.longitude), p(i)
                    }) : p(i))
                },
                i = function (i, a, s, p) {
                    var c = i;
                    e = p, t = a, n = s;
                    var u = function (n, i, a, s) {
                        s = s[0] || s[1];
                        var p = c.orgAttributes(i),
                            u = c.filter(a),
                            l = c.getOptions(u, {
                                scope: n
                            }),
                            g = c.getEvents(n, u),
                            d = c.getAttrsToObserve(p),
                            f = o(l, g);
                        s.addObject("directionsRenderers", f), d.forEach(function (e) {
                            ! function (e) {
                                a.$observe(e, function (n) {
                                    if ("panel" == e) t(function () {
                                        var e = document.getElementById(n) || document.querySelector(n);
                                        e && f.setPanel(e)
                                    });
                                    else if (l[e] !== n) {
                                        var o = c.toOptionValue(n, {
                                            key: e
                                        });
                                        l[e] = o, r(f, l)
                                    }
                                })
                            }(e)
                        }), e.getMap().then(function () {
                            r(f, l)
                        }), i.bind("$destroy", function () {
                            s.deleteObject("directionsRenderers", f)
                        })
                    };
                    return {
                        restrict: "E",
                        require: ["?^map", "?^ngMap"],
                        link: u
                    }
                };
            i.$inject = ["Attr2MapOptions", "$timeout", "NavigatorGeolocation", "NgMap"], angular.module("ngMap").directive("directions", i)
        }(),
        function () {
            "use strict";
            angular.module("ngMap").directive("drawingManager", ["Attr2MapOptions",
                function (e) {
                    var t = e;
                    return {
                        restrict: "E",
                        require: ["?^map", "?^ngMap"],
                        link: function (e, n, o, r) {
                            r = r[0] || r[1];
                            var i = t.filter(o),
                                a = t.getOptions(i, {
                                    scope: e
                                }),
                                s = t.getControlOptions(i),
                                p = t.getEvents(e, i),
                                c = new google.maps.drawing.DrawingManager({
                                    drawingMode: a.drawingmode,
                                    drawingControl: a.drawingcontrol,
                                    drawingControlOptions: s.drawingControlOptions,
                                    circleOptions: a.circleoptions,
                                    markerOptions: a.markeroptions,
                                    polygonOptions: a.polygonoptions,
                                    polylineOptions: a.polylineoptions,
                                    rectangleOptions: a.rectangleoptions
                                });
                            o.$observe("drawingControlOptions", function (e) {
                                c.drawingControlOptions = t.getControlOptions({
                                    drawingControlOptions: e
                                }).drawingControlOptions, c.setDrawingMode(null), c.setMap(r.map)
                            });
                            for (var u in p) google.maps.event.addListener(c, u, p[u]);
                            r.addObject("mapDrawingManager", c), n.bind("$destroy", function () {
                                r.deleteObject("mapDrawingManager", c)
                            })
                        }
                    }
                }])
        }(),
        function () {
            "use strict";
            angular.module("ngMap").directive("dynamicMapsEngineLayer", ["Attr2MapOptions",
                function (e) {
                    var t = e,
                        n = function (e, t) {
                            var n = new google.maps.visualization.DynamicMapsEngineLayer(e);
                            for (var o in t) google.maps.event.addListener(n, o, t[o]);
                            return n
                        };
                    return {
                        restrict: "E",
                        require: ["?^map", "?^ngMap"],
                        link: function (e, o, r, i) {
                            i = i[0] || i[1];
                            var a = t.filter(r),
                                s = t.getOptions(a, {
                                    scope: e
                                }),
                                p = t.getEvents(e, a, p),
                                c = n(s, p);
                            i.addObject("mapsEngineLayers", c)
                        }
                    }
                }])
        }(),
        function () {
            "use strict";
            angular.module("ngMap").directive("fusionTablesLayer", ["Attr2MapOptions",
                function (e) {
                    var t = e,
                        n = function (e, t) {
                            var n = new google.maps.FusionTablesLayer(e);
                            for (var o in t) google.maps.event.addListener(n, o, t[o]);
                            return n
                        };
                    return {
                        restrict: "E",
                        require: ["?^map", "?^ngMap"],
                        link: function (e, o, r, i) {
                            i = i[0] || i[1];
                            var a = t.filter(r),
                                s = t.getOptions(a, {
                                    scope: e
                                }),
                                p = t.getEvents(e, a, p),
                                c = n(s, p);
                            i.addObject("fusionTablesLayers", c)
                        }
                    }
                }])
        }(),
        function () {
            "use strict";
            angular.module("ngMap").directive("heatmapLayer", ["Attr2MapOptions", "$window",
                function (e, t) {
                    var n = e;
                    return {
                        restrict: "E",
                        require: ["?^map", "?^ngMap"],
                        link: function (e, o, r, i) {
                            i = i[0] || i[1];
                            var a = n.filter(r),
                                s = n.getOptions(a, {
                                    scope: e
                                });
                            if (s.data = t[r.data] || e[r.data], !(s.data instanceof Array)) throw "invalid heatmap data";
                            s.data = new google.maps.MVCArray(s.data); {
                                var p = new google.maps.visualization.HeatmapLayer(s);
                                n.getEvents(e, a)
                            }
                            i.addObject("heatmapLayers", p)
                        }
                    }
                }])
        }(),
        function () {
            "use strict";
            var e = function (e, t, n, o, r) {
                var i = e,
                    a = function (e, o, r) {
                        var i;
                        !e.position || e.position instanceof google.maps.LatLng || delete e.position, i = new google.maps.InfoWindow(e);
                        for (var a in o) a && google.maps.event.addListener(i, a, o[a]);
                        var s = r.html().trim();
                        if (1 != angular.element(s).length) throw "info-window working as a template must have a container";
                        return i.__template = s.replace(/\s?ng-non-bindable[='"]+/, ""), i.__open = function (e, o, r) {
                            n(function () {
                                r && (o.anchor = r);
                                var n = t(i.__template)(o);
                                i.setContent(n[0]), o.$apply(), r && r.getPosition ? i.open(e, r) : r && r instanceof google.maps.LatLng ? (i.open(e), i.setPosition(r)) : i.open(e);
                                var a = i.content.parentElement.parentElement.parentElement;
                                a.className = "ng-map-info-window"
                            })
                        }, i
                    },
                    s = function (e, t, n, s) {
                        s = s[0] || s[1], t.css("display", "none");
                        var p, c = i.orgAttributes(t),
                            u = i.filter(n),
                            l = i.getOptions(u, {
                                scope: e
                            }),
                            g = i.getEvents(e, u);
                        !l.position || l.position instanceof google.maps.LatLng || (p = l.position);
                        var d = a(l, g, t);
                        p && r.getGeoLocation(p).then(function (t) {
                            d.setPosition(t), d.__open(s.map, e, t);
                            var r = n.geoCallback;
                            r && o(r)(e)
                        }), s.addObject("infoWindows", d), s.observeAttrSetObj(c, n, d), s.showInfoWindow = s.map.showInfoWindow = s.showInfoWindow || function (t, n, o) {
                            var r = "string" == typeof t ? t : n,
                                i = "string" == typeof t ? n : o;
                            if ("string" == typeof i)
                                if ("undefined" != typeof s.map.markers && "undefined" != typeof s.map.markers[i]) i = s.map.markers[i];
                                else {
                                    if ("undefined" == typeof s.map.customMarkers[i]) throw new Error("Cant open info window for id " + i + ". Marker or CustomMarker is not defined");
                                    i = s.map.customMarkers[i]
                                }
                            var a = s.map.infoWindows[r],
                                p = i ? i : this.getPosition ? this : null;
                            a.__open(s.map, e, p), s.singleInfoWindow && (s.lastInfoWindow && e.hideInfoWindow(s.lastInfoWindow), s.lastInfoWindow = r)
                        }, s.hideInfoWindow = s.map.hideInfoWindow = s.hideInfoWindow || function (e, t) {
                            var n = "string" == typeof e ? e : t,
                                o = s.map.infoWindows[n];
                            o.close()
                        }, e.showInfoWindow = s.map.showInfoWindow, e.hideInfoWindow = s.map.hideInfoWindow, r.getMap().then(function (t) {
                            if (d.visible && d.__open(t, e), d.visibleOnMarker) {
                                var n = d.visibleOnMarker;
                                d.__open(t, e, t.markers[n])
                            }
                        })
                    };
                return {
                    restrict: "E",
                    require: ["?^map", "?^ngMap"],
                    link: s
                }
            };
            e.$inject = ["Attr2MapOptions", "$compile", "$timeout", "$parse", "NgMap"], angular.module("ngMap").directive("infoWindow", e)
        }(),
        function () {
            "use strict";
            angular.module("ngMap").directive("kmlLayer", ["Attr2MapOptions",
                function (e) {
                    var t = e,
                        n = function (e, t) {
                            var n = new google.maps.KmlLayer(e);
                            for (var o in t) google.maps.event.addListener(n, o, t[o]);
                            return n
                        };
                    return {
                        restrict: "E",
                        require: ["?^map", "?^ngMap"],
                        link: function (e, o, r, i) {
                            i = i[0] || i[1];
                            var a = t.orgAttributes(o),
                                s = t.filter(r),
                                p = t.getOptions(s, {
                                    scope: e
                                }),
                                c = t.getEvents(e, s),
                                u = n(p, c);
                            i.addObject("kmlLayers", u), i.observeAttrSetObj(a, r, u), o.bind("$destroy", function () {
                                i.deleteObject("kmlLayers", u)
                            })
                        }
                    }
                }])
        }(),
        function () {
            "use strict";
            angular.module("ngMap").directive("mapData", ["Attr2MapOptions", "NgMap",
                function (e, t) {
                    var n = e;
                    return {
                        restrict: "E",
                        require: ["?^map", "?^ngMap"],
                        link: function (e, o, r) {
                            var i = n.filter(r),
                                a = n.getOptions(i, {
                                    scope: e
                                }),
                                s = n.getEvents(e, i, s);
                            t.getMap().then(function (t) {
                                for (var n in a) {
                                    var o = a[n];
                                    "function" == typeof e[o] ? t.data[n](e[o]) : t.data[n](o)
                                }
                                for (var r in s) t.data.addListener(r, s[r])
                            })
                        }
                    }
                }])
        }(),
        function () {
            "use strict";
            var e, t, n, o, r = function (n, r, i) {
                    var a = i.mapLazyLoadParams || i.mapLazyLoad;
                    if (window.lazyLoadCallback = function () {
                        e(function () {
                            r.html(o), t(r.contents())(n)
                        }, 100)
                    }, void 0 === window.google || void 0 === window.google.maps) {
                        var s = document.createElement("script");
                        s.src = a + (a.indexOf("?") > -1 ? "&" : "?") + "callback=lazyLoadCallback", document.querySelector('script[src="' + s.src + '"]') || document.body.appendChild(s)
                    } else r.html(o), t(r.contents())(n)
                },
                i = function (e, t) {
                    return !t.mapLazyLoad && void 0, o = e.html(), n = t.mapLazyLoad, void 0 !== window.google && void 0 !== window.google.maps ? !1 : (e.html(""), {
                        pre: r
                    })
                },
                a = function (n, o) {
                    return t = n, e = o, {
                        compile: i
                    }
                };
            a.$inject = ["$compile", "$timeout"], angular.module("ngMap").directive("mapLazyLoad", a)
        }(),
        function () {
            "use strict";
            angular.module("ngMap").directive("mapType", ["$parse", "NgMap",
                function (e, t) {
                    return {
                        restrict: "E",
                        require: ["?^map", "?^ngMap"],
                        link: function (n, o, r, i) {
                            i = i[0] || i[1];
                            var a, s = r.name;
                            if (!s) throw "invalid map-type name";
                            if (a = e(r.object)(n), !a) throw "invalid map-type object";
                            t.getMap().then(function (e) {
                                e.mapTypes.set(s, a)
                            }), i.addObject("mapTypes", a)
                        }
                    }
                }])
        }(),
        function () {
            "use strict";
            var e = function () {
                return {
                    restrict: "AE",
                    controller: "__MapController",
                    conrollerAs: "ngmap"
                }
            };
            angular.module("ngMap").directive("map", [e]), angular.module("ngMap").directive("ngMap", [e])
        }(),
        function () {
            "use strict";
            angular.module("ngMap").directive("mapsEngineLayer", ["Attr2MapOptions",
                function (e) {
                    var t = e,
                        n = function (e, t) {
                            var n = new google.maps.visualization.MapsEngineLayer(e);
                            for (var o in t) google.maps.event.addListener(n, o, t[o]);
                            return n
                        };
                    return {
                        restrict: "E",
                        require: ["?^map", "?^ngMap"],
                        link: function (e, o, r, i) {
                            i = i[0] || i[1];
                            var a = t.filter(r),
                                s = t.getOptions(a, {
                                    scope: e
                                }),
                                p = t.getEvents(e, a, p),
                                c = n(s, p);
                            i.addObject("mapsEngineLayers", c)
                        }
                    }
                }])
        }(),
        function () {
            "use strict";
            var e, t, n, o = function (e, t) {
                    var o;
                    if (n.defaultOptions.marker)
                        for (var r in n.defaultOptions.marker) "undefined" == typeof e[r] && (e[r] = n.defaultOptions.marker[r]);
                    e.position instanceof google.maps.LatLng || (e.position = new google.maps.LatLng(0, 0)), o = new google.maps.Marker(e), Object.keys(t).length > 0;
                    for (var i in t) i && google.maps.event.addListener(o, i, t[i]);
                    return o
                },
                r = function (r, i, a, s) {
                    s = s[0] || s[1];
                    var p, c = e.orgAttributes(i),
                        u = e.filter(a),
                        l = e.getOptions(u, r, {
                            scope: r
                        }),
                        g = e.getEvents(r, u);
                    l.position instanceof google.maps.LatLng || (p = l.position);
                    var d = o(l, g);
                    s.addObject("markers", d), p && n.getGeoLocation(p).then(function (e) {
                        d.setPosition(e), l.centered && d.map.setCenter(e);
                        var n = a.geoCallback;
                        n && t(n)(r)
                    }), s.observeAttrSetObj(c, a, d), i.bind("$destroy", function () {
                        s.deleteObject("markers", d)
                    })
                },
                i = function (o, i, a) {
                    return e = o, t = i, n = a, {
                        restrict: "E",
                        require: ["^?map", "?^ngMap"],
                        link: r
                    }
                };
            i.$inject = ["Attr2MapOptions", "$parse", "NgMap"], angular.module("ngMap").directive("marker", i)
        }(),
        function () {
            "use strict";
            angular.module("ngMap").directive("overlayMapType", ["NgMap",
                function (e) {
                    return {
                        restrict: "E",
                        require: ["?^map", "?^ngMap"],
                        link: function (t, n, o, r) {
                            r = r[0] || r[1];
                            var i = o.initMethod || "insertAt",
                                a = t[o.object];
                            e.getMap().then(function (e) {
                                if ("insertAt" == i) {
                                    var t = parseInt(o.index, 10);
                                    e.overlayMapTypes.insertAt(t, a)
                                } else "push" == i && e.overlayMapTypes.push(a)
                            }), r.addObject("overlayMapTypes", a)
                        }
                    }
                }])
        }(),
        function () {
            "use strict";
            var e = function (e, t) {
                var n = e,
                    o = function (e, o, r, i) {
                        if ("false" === r.placesAutoComplete) return !1;
                        var a = n.filter(r),
                            s = n.getOptions(a, {
                                scope: e
                            }),
                            p = n.getEvents(e, a),
                            c = new google.maps.places.Autocomplete(o[0], s);
                        for (var u in p) google.maps.event.addListener(c, u, p[u]);
                        var l = function () {
                            t(function () {
                                i && i.$setViewValue(o.val())
                            }, 100)
                        };
                        google.maps.event.addListener(c, "place_changed", l), o[0].addEventListener("change", l), r.$observe("types", function (e) {
                            if (e) {
                                var t = n.toOptionValue(e, {
                                    key: "types"
                                });
                                c.setTypes(t)
                            }
                        })
                    };
                return {
                    restrict: "A",
                    require: "?ngModel",
                    link: o
                }
            };
            e.$inject = ["Attr2MapOptions", "$timeout"], angular.module("ngMap").directive("placesAutoComplete", e)
        }(),
        function () {
            "use strict";
            var e = function (e, t) {
                    var n, o = e.name;
                    switch (delete e.name, o) {
                    case "circle":
                        e.center instanceof google.maps.LatLng || (e.center = new google.maps.LatLng(0, 0)), n = new google.maps.Circle(e);
                        break;
                    case "polygon":
                        n = new google.maps.Polygon(e);
                        break;
                    case "polyline":
                        n = new google.maps.Polyline(e);
                        break;
                    case "rectangle":
                        n = new google.maps.Rectangle(e);
                        break;
                    case "groundOverlay":
                    case "image":
                        var r = e.url,
                            i = {
                                opacity: e.opacity,
                                clickable: e.clickable,
                                id: e.id
                            };
                        n = new google.maps.GroundOverlay(r, e.bounds, i)
                    }
                    for (var a in t) t[a] && google.maps.event.addListener(n, a, t[a]);
                    return n
                },
                t = function (t, n, o) {
                    var r = t,
                        i = function (t, i, a, s) {
                            s = s[0] || s[1];
                            var p, c, u = r.orgAttributes(i),
                                l = r.filter(a),
                                g = r.getOptions(l, {
                                    scope: t
                                }),
                                d = r.getEvents(t, l);
                            c = g.name, g.center instanceof google.maps.LatLng || (p = g.center);
                            var f = e(g, d);
                            s.addObject("shapes", f), p && "circle" == c && o.getGeoLocation(p).then(function (e) {
                                f.setCenter(e), f.centered && f.map.setCenter(e);
                                var o = a.geoCallback;
                                o && n(o)(t)
                            }), s.observeAttrSetObj(u, a, f), i.bind("$destroy", function () {
                                s.deleteObject("shapes", f)
                            })
                        };
                    return {
                        restrict: "E",
                        require: ["?^map", "?^ngMap"],
                        link: i
                    }
                };
            t.$inject = ["Attr2MapOptions", "$parse", "NgMap"], angular.module("ngMap").directive("shape", t)
        }(),
        function () {
            "use strict";
            var e = function (e, t) {
                var n = e,
                    o = function (e, t, n) {
                        var o, r;
                        t.container && (r = document.getElementById(t.container), r = r || document.querySelector(t.container)), r ? o = new google.maps.StreetViewPanorama(r, t) : (o = e.getStreetView(), o.setOptions(t));
                        for (var i in n) i && google.maps.event.addListener(o, i, n[i]);
                        return o
                    },
                    r = function (e, r, i) {
                        var a = n.filter(i),
                            s = n.getOptions(a, {
                                scope: e
                            }),
                            p = n.getControlOptions(a),
                            c = angular.extend(s, p),
                            u = n.getEvents(e, a);
                        t.getMap().then(function (e) {
                            var t = o(e, c, u);
                            e.setStreetView(t), !t.getPosition() && t.setPosition(e.getCenter()), google.maps.event.addListener(t, "position_changed", function () {
                                t.getPosition() !== e.getCenter() && e.setCenter(t.getPosition())
                            });
                            var n = google.maps.event.addListener(e, "center_changed", function () {
                                t.setPosition(e.getCenter()), google.maps.event.removeListener(n)
                            })
                        })
                    };
                return {
                    restrict: "E",
                    require: ["?^map", "?^ngMap"],
                    link: r
                }
            };
            e.$inject = ["Attr2MapOptions", "NgMap"], angular.module("ngMap").directive("streetViewPanorama", e)
        }(),
        function () {
            "use strict";
            angular.module("ngMap").directive("trafficLayer", ["Attr2MapOptions",
                function (e) {
                    var t = e,
                        n = function (e, t) {
                            var n = new google.maps.TrafficLayer(e);
                            for (var o in t) google.maps.event.addListener(n, o, t[o]);
                            return n
                        };
                    return {
                        restrict: "E",
                        require: ["?^map", "?^ngMap"],
                        link: function (e, o, r, i) {
                            i = i[0] || i[1];
                            var a = t.orgAttributes(o),
                                s = t.filter(r),
                                p = t.getOptions(s, {
                                    scope: e
                                }),
                                c = t.getEvents(e, s),
                                u = n(p, c);
                            i.addObject("trafficLayers", u), i.observeAttrSetObj(a, r, u), o.bind("$destroy", function () {
                                i.deleteObject("trafficLayers", u)
                            })
                        }
                    }
                }])
        }(),
        function () {
            "use strict";
            angular.module("ngMap").directive("transitLayer", ["Attr2MapOptions",
                function (e) {
                    var t = e,
                        n = function (e, t) {
                            var n = new google.maps.TransitLayer(e);
                            for (var o in t) google.maps.event.addListener(n, o, t[o]);
                            return n
                        };
                    return {
                        restrict: "E",
                        require: ["?^map", "?^ngMap"],
                        link: function (e, o, r, i) {
                            i = i[0] || i[1];
                            var a = t.orgAttributes(o),
                                s = t.filter(r),
                                p = t.getOptions(s, {
                                    scope: e
                                }),
                                c = t.getEvents(e, s),
                                u = n(p, c);
                            i.addObject("transitLayers", u), i.observeAttrSetObj(a, r, u), o.bind("$destroy", function () {
                                i.deleteObject("transitLayers", u)
                            })
                        }
                    }
                }])
        }(),
        function () {
            "use strict";
            var e = /([\:\-\_]+(.))/g,
                t = /^moz([A-Z])/,
                n = function () {
                    return function (n) {
                        return n.replace(e, function (e, t, n, o) {
                            return o ? n.toUpperCase() : n
                        }).replace(t, "Moz$1")
                    }
                };
            angular.module("ngMap").filter("camelCase", n)
        }(),
        function () {
            "use strict";
            var e = function () {
                return function (e) {
                    try {
                        return JSON.parse(e), e
                    } catch (t) {
                        return e.replace(/([\$\w]+)\s*:/g, function (e, t) {
                            return '"' + t + '":'
                        }).replace(/'([^']+)'/g, function (e, t) {
                            return '"' + t + '"'
                        })
                    }
                }
            };
            angular.module("ngMap").filter("jsonize", e)
        }(),
        function () {
            "use strict";
            var isoDateRE = /^(\d{4}\-\d\d\-\d\d([tT][\d:\.]*)?)([zZ]|([+\-])(\d\d):?(\d\d))?$/,
                Attr2MapOptions = function ($parse, $timeout, $log, NavigatorGeolocation, GeoCoder, camelCaseFilter, jsonizeFilter) {
                    var orgAttributes = function (e) {
                            e.length > 0 && (e = e[0]);
                            for (var t = {}, n = 0; n < e.attributes.length; n++) {
                                var o = e.attributes[n];
                                t[o.name] = o.value
                            }
                            return t
                        },
                        getJSON = function (e) {
                            var t = /^[\+\-]?[0-9\.]+,[ ]*\ ?[\+\-]?[0-9\.]+$/;
                            return e.match(t) && (e = "[" + e + "]"), JSON.parse(jsonizeFilter(e))
                        },
                        getLatLng = function (e) {
                            var t = e;
                            return e[0].constructor == Array ? t = e.map(function (e) {
                                return new google.maps.LatLng(e[0], e[1])
                            }) : !isNaN(parseFloat(e[0])) && isFinite(e[0]) && (t = new google.maps.LatLng(t[0], t[1])), t
                        },
                        toOptionValue = function (input, options) {
                            var output;
                            try {
                                output = getNumber(input)
                            } catch (err) {
                                try {
                                    var output = getJSON(input);
                                    if (output instanceof Array) output = output[0].constructor == Object ? output : getLatLng(output);
                                    else if (output === Object(output)) {
                                        var newOptions = options;
                                        newOptions.doNotConverStringToNumber = !0, output = getOptions(output, newOptions)
                                    }
                                } catch (err2) {
                                    if (input.match(/^[A-Z][a-zA-Z0-9]+\(.*\)$/)) try {
                                        var exp = "new google.maps." + input;
                                        output = eval(exp)
                                    } catch (e) {
                                        output = input
                                    } else if (input.match(/^([A-Z][a-zA-Z0-9]+)\.([A-Z]+)$/)) try {
                                        var matches = input.match(/^([A-Z][a-zA-Z0-9]+)\.([A-Z]+)$/);
                                        output = google.maps[matches[1]][matches[2]]
                                    } catch (e) {
                                        output = input
                                    } else if (input.match(/^[A-Z]+$/)) try {
                                        var capitalizedKey = options.key.charAt(0).toUpperCase() + options.key.slice(1);
                                        options.key.match(/temperatureUnit|windSpeedUnit|labelColor/) ? (capitalizedKey = capitalizedKey.replace(/s$/, ""), output = google.maps.weather[capitalizedKey][input]) : output = google.maps[capitalizedKey][input]
                                    } catch (e) {
                                        output = input
                                    } else if (input.match(isoDateRE)) try {
                                        output = new Date(input)
                                    } catch (e) {
                                        output = input
                                    } else if (input.match(/^{/) && options.scope) try {
                                        var expr = input.replace(/{{/, "").replace(/}}/g, "");
                                        output = options.scope.$eval(expr)
                                    } catch (err) {
                                        output = input
                                    } else output = input
                                }
                            }
                            if (("center" == options.key || "center" == options.key) && output instanceof Array && (output = new google.maps.LatLng(output[0], output[1])), "bounds" == options.key && output instanceof Array && (output = new google.maps.LatLngBounds(output[0], output[1])), "icons" == options.key && output instanceof Array)
                                for (var i = 0; i < output.length; i++) {
                                    var el = output[i];
                                    el.icon.path.match(/^[A-Z_]+$/) && (el.icon.path = google.maps.SymbolPath[el.icon.path])
                                }
                            if ("icon" == options.key && output instanceof Object) {
                                ("" + output.path).match(/^[A-Z_]+$/) && (output.path = google.maps.SymbolPath[output.path]);
                                for (var key in output) {
                                    var arr = output[key];
                                    "anchor" == key || "origin" == key || "labelOrigin" == key ? output[key] = new google.maps.Point(arr[0], arr[1]) : ("size" == key || "scaledSize" == key) && (output[key] = new google.maps.Size(arr[0], arr[1]))
                                }
                            }
                            return output
                        },
                        getAttrsToObserve = function (e) {
                            var t = [];
                            if (!e.noWatcher)
                                for (var n in e) {
                                    var o = e[n];
                                    o && o.match(/\{\{.*\}\}/) && t.push(camelCaseFilter(n))
                                }
                            return t
                        },
                        filter = function (e) {
                            var t = {};
                            for (var n in e) n.match(/^\$/) || n.match(/^ng[A-Z]/) || (t[n] = e[n]);
                            return t
                        },
                        getOptions = function (e, t) {
                            t = t || {};
                            var n = {};
                            for (var o in e)
                                if (e[o] || 0 === e[o]) {
                                    if (o.match(/^on[A-Z]/)) continue;
                                    if (o.match(/ControlOptions$/)) continue;
                                    n[o] = "string" != typeof e[o] ? e[o] : t.doNotConverStringToNumber && e[o].match(/^[0-9]+$/) ? e[o] : toOptionValue(e[o], {
                                        key: o,
                                        scope: t.scope
                                    })
                                }
                            return n
                        },
                        getEvents = function (e, t) {
                            var n = {},
                                o = function (e) {
                                    return "_" + e.toLowerCase()
                                },
                                r = function (t) {
                                    var n = t.match(/([^\(]+)\(([^\)]*)\)/),
                                        o = n[1],
                                        r = n[2].replace(/event[ ,]*/, ""),
                                        i = $parse("[" + r + "]");
                                    return function (t) {
                                        function n(e, t) {
                                            return e[t]
                                        }
                                        var r = i(e),
                                            a = o.split(".").reduce(n, e);
                                        a && a.apply(this, [t].concat(r)), $timeout(function () {
                                            e.$apply()
                                        })
                                    }
                                };
                            for (var i in t)
                                if (t[i]) {
                                    if (!i.match(/^on[A-Z]/)) continue;
                                    var a = i.replace(/^on/, "");
                                    a = a.charAt(0).toLowerCase() + a.slice(1), a = a.replace(/([A-Z])/g, o);
                                    var s = t[i];
                                    n[a] = new r(s)
                                }
                            return n
                        },
                        getControlOptions = function (e) {
                            var t = {};
                            if ("object" != typeof e) return !1;
                            for (var n in e)
                                if (e[n]) {
                                    if (!n.match(/(.*)ControlOptions$/)) continue;
                                    var o = e[n],
                                        r = o.replace(/'/g, '"');
                                    r = r.replace(/([^"]+)|("[^"]+")/g, function (e, t, n) {
                                        return t ? t.replace(/([a-zA-Z0-9]+?):/g, '"$1":') : n
                                    });
                                    try {
                                        var i = JSON.parse(r);
                                        for (var a in i)
                                            if (i[a]) {
                                                var s = i[a];
                                                if ("string" == typeof s ? s = s.toUpperCase() : "mapTypeIds" === a && (s = s.map(function (e) {
                                                    return e.match(/^[A-Z]+$/) ? google.maps.MapTypeId[e.toUpperCase()] : e
                                                })), "style" === a) {
                                                    var p = n.charAt(0).toUpperCase() + n.slice(1),
                                                        c = p.replace(/Options$/, "") + "Style";
                                                    i[a] = google.maps[c][s]
                                                } else i[a] = "position" === a ? google.maps.ControlPosition[s] : s
                                            }
                                        t[n] = i
                                    } catch (u) {}
                                }
                            return t
                        };
                    return {
                        filter: filter,
                        getOptions: getOptions,
                        getEvents: getEvents,
                        getControlOptions: getControlOptions,
                        toOptionValue: toOptionValue,
                        getAttrsToObserve: getAttrsToObserve,
                        orgAttributes: orgAttributes
                    }
                };
            Attr2MapOptions.$inject = ["$parse", "$timeout", "$log", "NavigatorGeolocation", "GeoCoder", "camelCaseFilter", "jsonizeFilter"], angular.module("ngMap").service("Attr2MapOptions", Attr2MapOptions)
        }(),
        function () {
            "use strict";
            var e, t = function (t) {
                    var n = e.defer(),
                        o = new google.maps.Geocoder;
                    return o.geocode(t, function (e, t) {
                        t == google.maps.GeocoderStatus.OK ? n.resolve(e) : n.reject(t)
                    }), n.promise
                },
                n = function (n) {
                    return e = n, {
                        geocode: t
                    }
                };
            n.$inject = ["$q"], angular.module("ngMap").service("GeoCoder", n)
        }(),
        function () {
            "use strict";
            var e, t = function (t) {
                    var n = e.defer();
                    return navigator.geolocation ? (void 0 === t ? t = {
                        timeout: 5e3
                    } : void 0 === t.timeout && (t.timeout = 5e3), navigator.geolocation.getCurrentPosition(function (e) {
                        n.resolve(e)
                    }, function (e) {
                        n.reject(e)
                    }, t)) : n.reject("Browser Geolocation service failed."), n.promise
                },
                n = function (n) {
                    return e = n, {
                        getCurrentPosition: t
                    }
                };
            n.$inject = ["$q"], angular.module("ngMap").service("NavigatorGeolocation", n)
        }(),
        function () {
            "use strict";
            var e, t, n, o = [],
                r = function (n) {
                    var r = t.createElement("div");
                    r.style.width = "100%", r.style.height = "100%", n.appendChild(r);
                    var i = new e.google.maps.Map(r, {});
                    return o.push(i), i
                },
                i = function (e) {
                    for (var t, n = 0; n < o.length; n++) {
                        var r = o[n];
                        if (!r.inUse) {
                            var i = r.getDiv();
                            e.appendChild(i), t = r;
                            break
                        }
                    }
                    return t
                },
                a = function (e) {
                    var t = i(e);
                    return t ? n(function () {
                        google.maps.event.trigger(t, "idle")
                    }, 100) : t = r(e), t.inUse = !0, t
                },
                s = function (e) {
                    e.inUse = !1
                },
                p = function () {
                    for (var e = 0; e < o.length; e++) o[e] = null;
                    o = []
                },
                c = function (r, i, c) {
                    return t = r[0], e = i, n = c, {
                        mapInstances: o,
                        resetMapInstances: p,
                        getMapInstance: a,
                        returnMapInstance: s
                    }
                };
            c.$inject = ["$document", "$window", "$timeout"], angular.module("ngMap").factory("NgMapPool", c)
        }(),
        function () {
            "use strict";
            var e, t, n, o, r, i, a, s = {},
                p = function (n, o) {
                    var r;
                    return n.currentStyle ? r = n.currentStyle[o] : e.getComputedStyle && (r = t.defaultView.getComputedStyle(n, null).getPropertyValue(o)), r
                },
                c = function (e) {
                    var t = s[e || 0];
                    return t.map instanceof google.maps.Map ? void 0 : (t.initializeMap(), t.map)
                },
                u = function (t) {
                    function o(t) {
                        s[i] ? r.resolve(s[i].map) : t > a ? r.reject("could not find map") : e.setTimeout(function () {
                            o(t + 100)
                        }, 100)
                    }
                    t = t || {};
                    var r = n.defer(),
                        i = t.id || 0,
                        a = t.timeout || 2e3;
                    return o(0), r.promise
                },
                l = function (e) {
                    if (e.map) {
                        var t = Object.keys(s).length;
                        s[e.map.id || t] = e
                    }
                },
                g = function (e) {
                    var t = Object.keys(s).length - 1,
                        n = e.map.id || t;
                    if (e.map) {
                        for (var o in e.eventListeners) {
                            var r = e.eventListeners[o];
                            google.maps.event.removeListener(r)
                        }
                        e.map.controls && e.map.controls.forEach(function (e) {
                            e.clear()
                        })
                    }
                    e.map.heatmapLayers && Object.keys(e.map.heatmapLayers).forEach(function (t) {
                        e.deleteObject("heatmapLayers", e.map.heatmapLayers[t])
                    }), delete s[n]
                },
                d = function (e, t) {
                    var r = n.defer();
                    return !e || e.match(/^current/i) ? o.getCurrentPosition(t).then(function (e) {
                        var t = e.coords.latitude,
                            n = e.coords.longitude,
                            o = new google.maps.LatLng(t, n);
                        r.resolve(o)
                    }, function (e) {
                        r.reject(e)
                    }) : i.geocode({
                        address: e
                    }).then(function (e) {
                        r.resolve(e[0].geometry.location)
                    }, function (e) {
                        r.reject(e)
                    }), r.promise
                },
                f = function (e, t) {
                    return function (n) {
                        if (n) {
                            var o = a("set-" + e),
                                i = r.toOptionValue(n, {
                                    key: e
                                });
                            t[o] && (e.match(/center|position/) && "string" == typeof i ? d(i).then(function (e) {
                                t[o](e)
                            }) : t[o](i))
                        }
                    }
                },
                m = function (e) {
                    var t = e.getAttribute("default-style");
                    "true" == t ? (e.style.display = "block", e.style.height = "300px") : ("block" != p(e, "display") && (e.style.display = "block"), p(e, "height").match(/^(0|auto)/) && (e.style.height = "300px"))
                };
            angular.module("ngMap").provider("NgMap", function () {
                var s = {};
                this.setDefaultOptions = function (e) {
                    s = e
                };
                var p = function (p, v, y, h, M, O, b) {
                    return e = p, t = v[0], n = y, o = h, r = M, i = O, a = b, {
                        defaultOptions: s,
                        addMap: l,
                        deleteMap: g,
                        getMap: u,
                        initMap: c,
                        setStyle: m,
                        getGeoLocation: d,
                        observeAndSet: f
                    }
                };
                p.$inject = ["$window", "$document", "$q", "NavigatorGeolocation", "Attr2MapOptions", "GeoCoder", "camelCaseFilter"], this.$get = p
            })
        }(),
        function () {
            "use strict";
            var e, t = function (t, n) {
                    n = n || t.getCenter();
                    var o = e.defer(),
                        r = new google.maps.StreetViewService;
                    return r.getPanoramaByLocation(n || t.getCenter, 100, function (e, t) {
                        t === google.maps.StreetViewStatus.OK ? o.resolve(e.location.pano) : o.resolve(!1)
                    }), o.promise
                },
                n = function (e, t) {
                    var n = new google.maps.StreetViewPanorama(e.getDiv(), {
                        enableCloseButton: !0
                    });
                    n.setPano(t)
                },
                o = function (o) {
                    return e = o, {
                        getPanorama: t,
                        setPanorama: n
                    }
                };
            o.$inject = ["$q"], angular.module("ngMap").service("StreetView", o)
        }(), "ngMap"
});