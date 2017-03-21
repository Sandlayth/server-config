/*jslint browser: true*/
/*jslint node: true */
/*global $, jQuery, alert, List, */
"use strict";

var commenterValeur = "<hr> <div class=\"form-group\"><textarea id=\"message\" class=\"form-control animated\" placeholder=\"Votre commentaire\"></textarea><select id=\"note\"> <option disabled selected>Note</option> <option value=\"1\">1</option><option value=\"2\">2</option><option value=\"3\">3</option><option value=\"4\">4</option><option value=\"5\">5</option></select><button class=\"btn btn-info\" id=\"commenter\" type=\"button\">Publier</button>";

var connecte = "false";
var session;

var map, featureList = [],
    publicSearch = [],
    priveSearch = [];

$(window).resize(function () {
    sizeLayerControl();
});

$(document).on("click", ".feature-row", function (e) {
    $(document).off("mouseout", ".feature-row", clearHighlight);
    sidebarClick(parseInt($(this).attr("id"), 10));
});

if (!("ontouchstart" in window)) {
    $(document).on("mouseover", ".feature-row", function (e) {
        highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
    });
}

$(document).on("mouseout", ".feature-row", clearHighlight);

$("#about-btn").click(function () {
    $("#aboutModal").modal("show");
    $(".navbar-collapse.in").collapse("hide");
    return false;
});

$("#full-extent-btn").click(function () {
    $(".navbar-collapse.in").collapse("hide");
    return false;
});

$("#login-btn").click(function () {
    if (connecte == "false") {
        $("#loginModal").modal("show");
        $(".navbar-collapse.in").collapse("hide");
    } else {
        $("#login-btn").html("<i class=\"fa fa-user white\"></i>&nbsp;&nbsp;Se connecter");
        session = "{}";
        connecte = "false";
    }
    return false;
});

$("#nav-btn").click(function () {
    $(".navbar-collapse").collapse("toggle");
    return false;
});

$("#sidebar-toggle-btn").click(function () {
    animateSidebar();
    return false;
});

$("#featureModal").on("hidden.bs.modal", function (e) {
    $(document).on("mouseout", ".feature-row", clearHighlight);
});

function animateSidebar() {
    $("#sidebar").animate({
        width: "toggle"
    }, 350, function () {
        map.invalidateSize();
    });
}

function sizeLayerControl() {
    $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

function clearHighlight() {
    highlight.clearLayers();
}


// afficher le modal de chaque école
function sidebarClick(id) {
    var layer = markerClusters.getLayer(id);
    map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
    layer.fire("click");
    /* Hide sidebar and go to the map on small screens */
    if (document.body.clientWidth <= 767) {
        $("#sidebar").hide();
        map.invalidateSize();
    }
}

// mettre à jour le sidebar en fonction de la localisation / recherche
function syncSidebar() {
    /* Empty sidebar features */
    $("#feature-list tbody").empty();
    /* Loop through publics layer and add only features which are in the map bounds */
    publics.eachLayer(function (layer) {
        if (map.hasLayer(publicLayer)) {
            if (map.getBounds().contains(layer.getLatLng())) {
                $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><td class="feature-name">' + layer.feature.properties.uo_lib + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
            }
        }
    });

    /* Loop through prives layer and add only features which are in the map bounds */
    prives.eachLayer(function (layer) {
        if (map.hasLayer(priveLayer)) {
            if (map.getBounds().contains(layer.getLatLng())) {
                $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><td class="feature-name">' + layer.feature.properties.uo_lib + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
            }
        }
    });

    /* Update list.js featureList */
    featureList = new List("features", {
        valueNames: ["feature-name"]
    });
    featureList.sort("feature-name", {
        order: "asc"
    });
}

/* Basemap Layers */
var cartoLight = L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
    maxZoom: 19
});

var usgsImagery = L.layerGroup([L.tileLayer("http://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 15
}), L.tileLayer.wms("http://raster.nationalmap.gov/arcgis/services/Orthoimagery/USGS_EROS_Ortho_SCALE/ImageServer/WMSServer?", {
    minZoom: 16,
    maxZoom: 19,
    layers: "0",
    format: 'image/jpeg',
    transparent: true,
})]);

/* Overlay Layers */
var highlight = L.geoJson(null);

var highlightStyle = {
    stroke: false,
    fillColor: "#00FFFF",
    fillOpacity: 0.7,
    radius: 10
};

/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    disableClusteringAtZoom: 16
});


function getNote(id) {
    $.post(
        'note.php', {
            "idEcole": id
        },
        function (data) {
            $("#note").html(data);
        },
        'text'
    );
}

function getCommentaires(id) {
    $.post(
        'commentaire.php', {
            "idEcole": id
        },
        function (data) {
            data = $.parseJSON(data);
            if (data.length != 0) {
                $.each(data.reviews, function (key, value) {
                    $("#commentaires").append("<hr> <div class=\"panel panel-default\"><div class=\"panel-heading\"><strong>" + value.username + "</strong> <span class=\"text-muted\">a donné une note de " + value.note + "</span> </div><div class=\"panel-body\">" + value.review + "</div></div>");
                });
            } else {
                $("#commentaires").html("<hr> Il n'y a pas de commentaires !");
            }
        },
        'text'
    );
}
/* Empty layer placeholder to add to layer control for listening when to add/remove publics to markerClusters layer */
var publicLayer = L.geoJson(null);
var publics = L.geoJson(null, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            icon: L.icon({
                iconUrl: "assets/img/favicon.ico",
                iconSize: [24, 28],
                iconAnchor: [12, 28],
                popupAnchor: [0, -25]
            }),
            title: feature.properties.uo_lib,
            riseOnHover: true
        });
    },
    onEachFeature: function (feature, layer) {
        if (feature.properties) {
            var content = "<table id='" + feature.properties.uai + "' class='table table-striped table-bordered table-condensed'>" + "<tr><th>Nom</th><td>" + feature.properties.uo_lib + "</td></tr>" + "<tr><th>Téléphone</th><td>" + feature.properties.numero_telephone_uai + "</td></tr>" + "<tr><th>Adresse</th><td>" + feature.properties.adresse_uai + ", " + feature.properties.code_postal_uai + " " + feature.properties.com_nom + "</td></tr>" + "<tr><th>Site web</th><td><a class='url-break' href='" + feature.properties.url + "' target='_blank'>" + feature.properties.url + "</a></td></tr>" + "<tr><th>Note</th><td id=\"note\"></td></tr><table><div id=\"commentaires\"></div>";
            layer.on({
                click: function (e) {
                    $("#feature-title").html(feature.properties.uo_lib);
                    if (connecte == "true") {
                        $("#feature-info").html(content).append(commenterValeur);
                    } else {
                        $("#feature-info").html(content);
                    }
                    getCommentaires(feature.properties.uai);
                    getNote(feature.properties.uai);
                    $("#featureModal").modal("show");
                    highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
                }
            });
            $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><td class="feature-name">' + layer.feature.properties.uo_lib + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
            publicSearch.push({
                name: layer.feature.properties.uo_lib,
                address: layer.feature.properties.ADDRESS1,
                source: "Publics",
                id: L.stamp(layer),
                lat: layer.feature.geometry.coordinates[1],
                lng: layer.feature.geometry.coordinates[0]
            });
        }
    }
});

$.getJSON("data/public.geojson", function (data) {
    publics.addData(data);
    map.addLayer(publicLayer);
});

/* Empty layer placeholder to add to layer control for listening when to add/remove prives to markerClusters layer */
var priveLayer = L.geoJson(null);
var prives = L.geoJson(null, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            icon: L.icon({
                iconUrl: "assets/img/favicon.ico",
                iconSize: [24, 28],
                iconAnchor: [12, 28],
                popupAnchor: [0, -25]
            }),
            title: feature.properties.NAME,
            riseOnHover: true
        });
    },
    onEachFeature: function (feature, layer) {
        if (feature.properties) {
            var content = "<table id='" + feature.properties.uai + "' class='table table-striped table-bordered table-condensed'>" + "<tr><th>Nom</th><td>" + feature.properties.uo_lib + "</td></tr>" + "<tr><th>Téléphone</th><td>" + feature.properties.numero_telephone_uai + "</td></tr>" + "<tr><th>Adresse</th><td>" + feature.properties.adresse_uai + ", " + feature.properties.code_postal_uai + " " + feature.properties.com_nom + "</td></tr>" + "<tr><th>Site web</th><td><a class='url-break' href='" + feature.properties.url + "' target='_blank'>" + feature.properties.url + "</a></td></tr>" + "<tr><th>Note</th><td id=\"note\"></td></tr><table><div id=\"commentaires\"></div>";
            layer.on({
                click: function (e) {
                    $("#feature-title").html(feature.properties.uo_lib);
                    if (connecte == "true") {
                        $("#feature-info").html(content).append(commenterValeur);
                    } else {
                        $("#feature-info").html(content);
                    }
                    getCommentaires(feature.properties.uai);
                    getNote(feature.properties.uai);
                    $("#featureModal").modal("show");
                    highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
                }
            });
            $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><td class="feature-name">' + layer.feature.properties.uo_lib + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
            priveSearch.push({
                name: layer.feature.properties.NAME,
                address: layer.feature.properties.ADRESS1,
                source: "Prives",
                id: L.stamp(layer),
                lat: layer.feature.geometry.coordinates[1],
                lng: layer.feature.geometry.coordinates[0]
            });
        }
    }
});
$.getJSON("data/prive.geojson", function (data) {
    prives.addData(data);
    map.addLayer(priveLayer);
});

map = L.map("map", {
    zoom: 10,
    center: [48.8575186, 2.3450033],
    layers: [cartoLight, markerClusters, highlight],
    zoomControl: false,
});

/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function (e) {
    if (e.layer === publicLayer) {
        markerClusters.addLayer(publics);
        syncSidebar();
    }
    if (e.layer === priveLayer) {
        markerClusters.addLayer(prives);
        syncSidebar();
    }
});

map.on("overlayremove", function (e) {
    if (e.layer === publicLayer) {
        markerClusters.removeLayer(publics);
        syncSidebar();
    }
    if (e.layer === priveLayer) {
        markerClusters.removeLayer(prives);
        syncSidebar();
    }
});

/* Filter sidebar feature list to only show features in current map bounds */
map.on("moveend", function (e) {
    syncSidebar();
});

/* Clear feature highlight when map is clicked */
map.on("click", function (e) {
    highlight.clearLayers();
});

var zoomControl = L.control.zoom({
    position: "bottomright"
}).addTo(map);

/* GPS enabled geolocation control set to follow the user's location */
var locateControl = L.control.locate({
    position: "bottomright",
    drawCircle: true,
    follow: true,
    setView: true,
    keepCurrentZoomLevel: true,
    markerStyle: {
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.8
    },
    circleStyle: {
        weight: 1,
        clickable: false
    },
    icon: "fa fa-location-arrow",
    metric: false,
    strings: {
        title: "My location",
        popup: "You are within {distance} {unit} from this point",
        outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
    },
    locateOptions: {
        maxZoom: 18,
        watch: true,
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 10000
    }
}).addTo(map);

/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
    var isCollapsed = true;
} else {
    var isCollapsed = false;
}

// Menu du côté droit

var baseLayers = {
    "Carte": cartoLight,
    "Vue Aérienne": usgsImagery
};

var groupedOverlays = {
    "Secteur d'établissement": {
        "Privé": publicLayer,
        "Public": priveLayer
    }
};

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
    collapsed: isCollapsed
}).addTo(map);

/* Highlight search box text on click */
$("#searchbox").click(function () {
    $(this).select();
});

/* Prevent hitting enter from refreshing the page */
$("#searchbox").keypress(function (e) {
    if (e.which == 13) {
        e.preventDefault();
    }
});

/* Typeahead search functionality */
$(document).one("ajaxStop", function () {
    $("#loading").hide();
    sizeLayerControl();
    featureList = new List("features", {
        valueNames: ["feature-name"]
    });
    featureList.sort("feature-name", {
        order: "asc"
    });

    var publicsBH = new Bloodhound({
        name: "Publics",
        datumTokenizer: function (d) {
            return Bloodhound.tokenizers.whitespace(d.name);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: publicSearch,
        limit: 10
    });

    var privesBH = new Bloodhound({
        name: "Prives",
        datumTokenizer: function (d) {
            return Bloodhound.tokenizers.whitespace(d.name);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: priveSearch,
        limit: 10
    });

    var geonamesBH = new Bloodhound({
        name: "GeoNames",
        datumTokenizer: function (d) {
            return Bloodhound.tokenizers.whitespace(d.name);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: "http://api.geonames.org/searchJSON?username=bootleaf&featureClass=P&maxRows=5&countryCode=US&name_startsWith=%QUERY",
            filter: function (data) {
                return $.map(data.geonames, function (result) {
                    return {
                        name: result.name + ", " + result.adminCode1,
                        lat: result.lat,
                        lng: result.lng,
                        source: "GeoNames"
                    };
                });
            },
            ajax: {
                beforeSend: function (jqXhr, settings) {
                    settings.url += "&east=" + map.getBounds().getEast() + "&west=" + map.getBounds().getWest() + "&north=" + map.getBounds().getNorth() + "&south=" + map.getBounds().getSouth();
                    $("#searchicon").removeClass("fa-search").addClass("fa-refresh fa-spin");
                },
                complete: function (jqXHR, status) {
                    $('#searchicon').removeClass("fa-refresh fa-spin").addClass("fa-search");
                }
            }
        },
        limit: 10
    });
    publicsBH.initialize();
    privesBH.initialize();
    geonamesBH.initialize();

    /* instantiate the typeahead UI */
    $("#searchbox").typeahead({
        minLength: 3,
        highlight: true,
        hint: false
    }, {
        name: "Publics",
        displayKey: "name",
        source: publicsBH.ttAdapter(),
        templates: {
            header: "<h4 class='typeahead-header'>&nbsp;Publics</h4>",
            suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
        }
    }, {
        name: "Prives",
        displayKey: "name",
        source: privesBH.ttAdapter(),
        templates: {
            header: "<h4 class='typeahead-header'>&nbsp;Prives</h4>",
            suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
        }
    }, {
        name: "GeoNames",
        displayKey: "name",
        source: geonamesBH.ttAdapter(),
        templates: {
            header: "<h4 class='typeahead-header'>&nbsp;GeoNames</h4>"
        }
    }).on("typeahead:selected", function (obj, datum) {
        if (datum.source === "Boroughs") {
            map.fitBounds(datum.bounds);
        }
        if (datum.source === "Publics") {
            if (!map.hasLayer(publicLayer)) {
                map.addLayer(publicLayer);
            }
            map.setView([datum.lat, datum.lng], 17);
            if (map._layers[datum.id]) {
                map._layers[datum.id].fire("click");
            }
        }
        if (datum.source === "Prives") {
            if (!map.hasLayer(priveLayer)) {
                map.addLayer(priveLayer);
            }
            map.setView([datum.lat, datum.lng], 17);
            if (map._layers[datum.id]) {
                map._layers[datum.id].fire("click");
            }
        }
        if (datum.source === "GeoNames") {
            map.setView([datum.lat, datum.lng], 14);
        }
        if ($(".navbar-collapse").height() > 50) {
            $(".navbar-collapse").collapse("hide");
        }
    }).on("typeahead:opened", function () {
        $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
        $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
    }).on("typeahead:closed", function () {
        $(".navbar-collapse.in").css("max-height", "");
        $(".navbar-collapse.in").css("height", "");
    });
    $(".twitter-typeahead").css("position", "static");
    $(".twitter-typeahead").css("display", "block");
});

// Leaflet patch to make layer control scrollable on touch browsers
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
    L.DomEvent
        .disableClickPropagation(container)
        .disableScrollPropagation(container);
} else {
    L.DomEvent.disableClickPropagation(container);
}