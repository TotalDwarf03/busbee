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
 * Function to initialize the Leaflet map for displaying stops.
 */
function initStopMap() {
  var map = L.map("map").setView([51.505, -0.09], 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
}

/**
 * Function to initialize the Leaflet map for displaying routes.
 */
function initRouteMap() {
  var map = L.map("map").setView([51.505, -0.09], 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
}

/**
 * Function to initialize the Leaflet map for displaying timetables.
 */
function initTimetableMap() {
  var map = L.map("map").setView([51.505, -0.09], 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
}

loadLeaflet();
