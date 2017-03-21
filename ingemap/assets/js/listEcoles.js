/* Surligner l'emplacement de l'école survolée */
var highlight = L.geoJson(null);

var highlightStyle = {
    stroke: false,
    fillColor: "#00FFFF",
    fillOpacity: 0.7,
    radius: 10
};

/* Groupe d'école */
var markerClusters = new L.MarkerClusterGroup({
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    disableClusteringAtZoom: 16
});


/* ****************
   Écoles publiques 
   ****************
*/
// Vider le layer 
var publicLayer = L.geoJson(null);

// afficher chacun des marqueurs qui ne serait pas groupé
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
            var content = "<table id='" + feature.properties.uai + "' class='table table-striped table-bordered table-condensed'>" + "<tr><th>Nom</th><td>" + feature.properties.uo_lib + "</td></tr>" + "<tr><th>Téléphone</th><td>" + feature.properties.numero_telephone_uai + "</td></tr>" + "<tr><th>Adresse</th><td>" + feature.properties.adresse_uai + ", " + feature.properties.code_postal_uai + " " + feature.properties.com_nom + "</td></tr>" + "<tr><th>Site web</th><td><a class='url-break' href='" + feature.properties.url + "' target='_blank'>" + feature.properties.url + "</a></td></tr>" + "<tr><th>Note</th><td id=\"note\"></td></tr><table><div id='commenter-error'></div><div id=\"commentaires\"></div>";
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
        }
    }
});

$.getJSON("data/public.geojson", function (data) {
    publics.addData(data);
    map.addLayer(publicLayer);
});



/* ****************
   Écoles privées 
   ****************
*/
// Vider le layer 
var priveLayer = L.geoJson(null);

// afficher chacun des marqueurs qui ne serait pas groupé
var prives = L.geoJson(null, {
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
            var content = "<table id='" + feature.properties.uai + "' class='table table-striped table-bordered table-condensed'>" + "<tr><th>Nom</th><td>" + feature.properties.uo_lib + "</td></tr>" + "<tr><th>Téléphone</th><td>" + feature.properties.numero_telephone_uai + "</td></tr>" + "<tr><th>Adresse</th><td>" + feature.properties.adresse_uai + ", " + feature.properties.code_postal_uai + " " + feature.properties.com_nom + "</td></tr>" + "<tr><th>Site web</th><td><a class='url-break' href='" + feature.properties.url + "' target='_blank'>" + feature.properties.url + "</a></td></tr>" + "<tr><th>Note</th><td id=\"note\"></td></tr><table><div id='commenter-error'></div><div id=\"commentaires\"></div>";
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
        }
    }
});
$.getJSON("data/prive.geojson", function (data) {
    prives.addData(data);
    map.addLayer(priveLayer);
});