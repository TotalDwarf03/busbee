/**
 * Function to load the CSS and JS for Leaflet mapping library.
 */
function loadLeaflet() {
  // Load Leaflet CSS
  const leafletCSS = document.createElement("link");
  leafletCSS.rel = "stylesheet";
  leafletCSS.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  document.head.appendChild(leafletCSS);

  // Load Leaflet JS
  const leafletScript = document.createElement("script");
  leafletScript.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
  leafletScript.onload = () => {
    console.log("Leaflet mapping library loaded.");
  };
  document.head.appendChild(leafletScript);

  leafletScript.onload = () => {
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

  var map = initDefaultMap();

  if (path.includes("/stops.html")) {
    console.log("Initializing map for stops page.");
    initStopMap(map);
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
 * Function to initialize the Leaflet map with default settings.
 *
 * @return {L.Map} The initialized Leaflet Map object.
 */
function initDefaultMap() {
  var map = L.map("map").setView([51.505, -0.09], 13);

  var osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  });

  const OPNVKarte = L.tileLayer(
    "https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png",
    {
      maxZoom: 18,
      attribution:
        'Map <a href="https://memomaps.de/">memomaps.de</a> <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  );

  var Stadia_AlidadeSmooth = L.tileLayer(
    "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.{ext}",
    {
      minZoom: 0,
      maxZoom: 20,
      attribution:
        '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      ext: "png",
    },
  ).addTo(map);

  var Stadia_AlidadeSmoothDark = L.tileLayer(
    "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}",
    {
      minZoom: 0,
      maxZoom: 20,
      attribution:
        '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      ext: "png",
    },
  );

  // Add Leaflet Layer Controls
  var baseMaps = {
    OpenStreetMap: osm,
    OPNVKarte: OPNVKarte,
    "Stadia Alidade Smooth": Stadia_AlidadeSmooth,
    "Stadia Alidade Smooth Dark": Stadia_AlidadeSmoothDark,
  };

  var layerControl = L.control.layers(baseMaps).addTo(map);

  return map;
}

/**
 * Function to initialize the Leaflet map for displaying stops.
 *
 * @param {L.Map} map - The Leaflet Map object to initialize for stops.
 */
function initStopMap(map) {
  console.log("Stop map initialized.");
}

/**
 * Function to initialize the Leaflet map for displaying routes.
 *
 * @param {L.Map} map - The Leaflet Map object to initialize for routes.
 */
function initRouteMap(map) {
  console.log("Route map initialized.");
}

/**
 * Function to initialize the Leaflet map for displaying timetables.
 *
 * @param {L.Map} map - The Leaflet Map object to initialize for timetables.
 */
function initTimetableMap(map) {
  console.log("Timetable map initialized.");
}

loadLeaflet();
