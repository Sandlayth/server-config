/*jslint browser: true*/
/*jslint node: true */
/*global $, jQuery, alert, List, */
"use strict";

var commenterValeur = "<hr> <div class=\"form-group\"><textarea id=\"message\" class=\"form-control animated\" placeholder=\"Votre commentaire\"></textarea><select id=\"note\"> <option disabled selected>Note</option> <option value=\"1\">1</option><option value=\"2\">2</option><option value=\"3\">3</option><option value=\"4\">4</option><option value=\"5\">5</option></select><button class=\"btn btn-info\" id=\"commenter\" type=\"button\">Publier</button>";

var map, featureList = [],
    publicSearch = [],
    priveSearch = [];

$(window).resize(function () {
    sizeLayerControl();
});

// Clic sur une école
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

$("#featureModal").on("hidden.bs.modal", function (e) {
    $(document).on("mouseout", ".feature-row", clearHighlight);
});


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
    /* cacher la barre latérale sur les petits écrans */
    if (document.body.clientWidth <= 767) {
        $("#sidebar").hide();
        map.invalidateSize();
    }
}

// mettre à jour le sidebar en fonction de la localisation / recherche
function syncSidebar() {
    /* vider la liste */
    $("#feature-list tbody").empty();
    /* Boucler dans les layers publics et retenir uniquement ceux qui sont dans la range */
    publics.eachLayer(function (layer) {
        if (map.hasLayer(publicLayer)) {
            if (map.getBounds().contains(layer.getLatLng())) {
                $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><td class="feature-name">' + layer.feature.properties.uo_lib + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
            }
        }
    });

    /* Boucler dans les layers privés et retenir uniquement ceux qui sont dans la range */
    prives.eachLayer(function (layer) {
        if (map.hasLayer(priveLayer)) {
            if (map.getBounds().contains(layer.getLatLng())) {
                $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><td class="feature-name">' + layer.feature.properties.uo_lib + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
            }
        }
    });

    /* Mettre à jour la list List.js */
    featureList = new List("features", {
        valueNames: ["feature-name"]
    });
    featureList.sort("feature-name", {
        order: "asc"
    });
}

/* Layer de base -- carte normale */
var cartoLight = L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
    maxZoom: 19
});

/* Layer de base -- imagerie vue du ciel */
var usgsImagery = L.layerGroup([L.tileLayer("http://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 15
}), L.tileLayer.wms("http://raster.nationalmap.gov/arcgis/services/Orthoimagery/USGS_EROS_Ortho_SCALE/ImageServer/WMSServer?", {
    minZoom: 16,
    maxZoom: 19,
    layers: "0",
    format: 'image/jpeg',
    transparent: true,
})]);


map = L.map("map", {
    zoom: 10,
    center: [48.8575186, 2.3450033],
    layers: [cartoLight, markerClusters, highlight],
    zoomControl: true,
});

/* ajouter les layers qui sont visibles */
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


/* supprimer les layers qui sont visibles */
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

/* Filtrer la barre pour afficher uniquement les résultats qui sont sur le cadre affiché */
map.on("moveend", function (e) {
    syncSidebar();
});

/* Désactiver le highlight quand on clique sur la map */
map.on("click", function (e) {
    highlight.clearLayers();
});

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
    collapsed: false
}).addTo(map);


/* afficher la barre de chargement pendant le chargement */
$(document).one("ajaxStop", function () {
    $("#loading").hide();
    sizeLayerControl();
    // trier les noms
    featureList = new List("features", {
        valueNames: ["feature-name"]
    });
    featureList.sort("feature-name", {
        order: "asc"
    });
});


// Patch pour rendre la carte scrollable sur écran tactile
// https://github.com/Leaflet/Leaflet/issues/2882
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
    L.DomEvent
        .disableClickPropagation(container)
        .disableScrollPropagation(container);
} else {
    L.DomEvent.disableClickPropagation(container);
}