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

    //Load OpenLayers LayerSwitcher Plugin
    // JS
    const olLayerSwitcherScript = document.createElement("script");
    olLayerSwitcherScript.src =
      "https://cdn.jsdelivr.net/npm/ol-layerswitcher@4.1.2/dist/ol-layerswitcher.js";
    document.head.appendChild(olLayerSwitcherScript);

    // CSS
    const olLayerSwitcherCSS = document.createElement("link");
    olLayerSwitcherCSS.rel = "stylesheet";
    olLayerSwitcherCSS.href =
      "https://cdn.jsdelivr.net/npm/ol-layerswitcher@4.1.2/dist/ol-layerswitcher.css";
    document.head.appendChild(olLayerSwitcherCSS);
    olLayerSwitcherScript.onload = () => {
      loadMaps();
    };
  };
}

/**
 * Function to load maps on to the page based on the current URL.
 */
function loadMaps() {
  const path = window.location.pathname;

  var map = initDefaultMap();

  if (path.includes("/stops.html")) {
    console.log("Initializing map for stops page.");
    initStopMap(map);
  } else if (path.includes("/pollution.html")) {
    console.log("Initializing map for pollution page.");
    initPollutionMap(map);
  } else if (path.includes("/routes.html")) {
    console.log("Initializing map for routes page.");
    initRouteMap(map);
  } else if (path.includes("/timetables.html")) {
    console.log("Initializing map for timetables page.");
    initTimetableMap(map);
  } else {
    console.log("No map to initialize for this page.");
  }
}

/**
 * Function to initialize the OpenLayers map with multiple base layers.
 * @returns {ol.Map} OpenLayers Map with multiple base layers and layer switcher
 */
function initDefaultMap() {
  const manchester = ol.proj.fromLonLat([-2.2426, 53.4808]);

  var map = new ol.Map({
    target: "map",
    layers: [
      new ol.layer.Tile({
        title: "OpenStreetMap",
        visible: false,
        source: new ol.source.OSM(),
      }),
      new ol.layer.Group({
        title: "World Imagery",
        fold: "closed",
        layers: [
          new ol.layer.Tile({
            title: "Esri World Imagery",
            visible: false,
            source: new ol.source.XYZ({
              url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
              attributions:
                "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
              maxZoom: 19,
            }),
          }),
          new ol.layer.Tile({
            title: "Stadia Stamen Toner Labels (Place Names)",
            type: "overlay",
            visible: false,
            source: new ol.source.XYZ({
              url: "https://tiles.stadiamaps.com/tiles/stamen_toner_labels/{z}/{x}/{y}.png",
              minZoom: 0,
              maxZoom: 20,
              attributions:
                '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }),
          }),
        ],
      }),
      new ol.layer.Tile({
        title: "Stadia Alidade Smooth",
        visible: true,
        source: new ol.source.XYZ({
          url: "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png",
          minZoom: 0,
          maxZoom: 20,
          attributions:
            '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }),
      }),
      new ol.layer.Tile({
        title: "Stadia Alidade Smooth Dark",
        visible: false,
        source: new ol.source.XYZ({
          url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png",
          minZoom: 0,
          maxZoom: 20,
          attributions:
            '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }),
      }),
    ],
    view: new ol.View({
      center: manchester,
      zoom: 13,
    }),
  });

  var layerSwitcher = new LayerSwitcher();
  map.addControl(layerSwitcher);

  return map;
}

/**
 * Function to initialize the OpenLayers map for displaying stops.
 *
 * @param {ol.Map} map - The OpenLayers Map object to initialize for stops.
 */
function initStopMap(map) {
  console.log("Stop map initialized.");
}

/**
 * Function to initialize the OpenLayers map for displaying pollution data.
 *
 * @param {ol.Map} map - The OpenLayers Map object to initialize for pollution data.
 */
function initPollutionMap(map) {
  console.log("Pollution map initialized.");
}

/**
 * Function to initialize the OpenLayers map for displaying routes.
 *
 * @param {ol.Map} map - The OpenLayers Map object to initialize for routes.
 */
function initRouteMap(map) {
  console.log("Route map initialized.");
}

/**
 * Function to initialize the OpenLayers map for displaying timetables.
 *
 * @param {ol.Map} map - The OpenLayers Map object to initialize for timetables.
 */
function initTimetableMap(map) {
  console.log("Timetable map initialized.");
}

loadOpenLayers();
