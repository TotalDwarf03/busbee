/**
 * Function to load the CSS and JS for OpenLayers mapping library.
 */
function loadOpenLayers() {
  // Load OpenLayers CSS
  const olCSS = document.createElement("link");
  olCSS.rel = "stylesheet";
  olCSS.href =
    "https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.15.1/css/ol.css";
  document.head.appendChild(olCSS);

  // Load OpenLayers JS
  const olScript = document.createElement("script");
  olScript.src =
    "https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.15.1/build/ol.js";
  document.head.appendChild(olScript);

  olScript.onload = () => {
    console.log("OpenLayers mapping library loaded.");
    document.getElementById("load-status-message").innerHTML =
      '<i class="fas fa-check"></i> Map library loaded.';

    loadMaps();
  };
}

/**
 * Function to load maps on to the page based on the current URL.
 */
function loadMaps() {
  const path = window.location.pathname;

  if (path.includes("/stops.html")) {
    console.log("Initializing map for stops page.");
    initStopMap();
  } else if (path.includes("/routes.html")) {
    console.log("Initializing map for routes page.");
    initRouteMap();
  } else if (path.includes("/timetables.html")) {
    console.log("Initializing map for timetables page.");
    initTimetableMap();
  } else {
    console.log("No map to initialize for this page.");
  }
}

/**
 * Function to initialize the OpenLayers map for displaying stops.
 */
function initStopMap() {
  var map = new ol.Map({
    target: "map",
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([-0.09, 51.505]),
      zoom: 13,
    }),
  });
}

/**
 * Function to initialize the OpenLayers map for displaying routes.
 */
function initRouteMap() {
  var map = new ol.Map({
    target: "map",
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([-0.09, 51.505]),
      zoom: 13,
    }),
  });
}

/**
 * Function to initialize the OpenLayers map for displaying timetables.
 */
function initTimetableMap() {
  var map = new ol.Map({
    target: "map",
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([-0.09, 51.505]),
      zoom: 13,
    }),
  });
}

loadOpenLayers();
