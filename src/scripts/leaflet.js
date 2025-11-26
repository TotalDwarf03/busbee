var mapsPlaceholder = {}; // Placeholder object to store map instances

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

  var { map, layerControl } = initDefaultMap();

  if (path.includes("/stops.html")) {
    console.log("Initializing map for stops page.");
    console.log("Loading Marker Cluster plugin...");
    // Load Leaflet Marker Cluster Plugin
    // CSS
    const markerClusterCSS = document.createElement("link");
    markerClusterCSS.rel = "stylesheet";
    markerClusterCSS.href =
      "https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css";
    document.head.appendChild(markerClusterCSS);

    const markerClusterDefaultCSS = document.createElement("link");
    markerClusterDefaultCSS.rel = "stylesheet";
    markerClusterDefaultCSS.href =
      "https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css";
    document.head.appendChild(markerClusterDefaultCSS);

    const markerClusterScript = document.createElement("script");
    markerClusterScript.src =
      "https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js";
    document.head.appendChild(markerClusterScript);

    markerClusterScript.onload = () => {
      console.log("Marker Cluster plugin loaded.");

      console.log("Loading HeatCanvas plugin...");
      // Load HeatCanvas Plugin
      const heatCanvasScript = document.createElement("script");
      heatCanvasScript.src = "./scripts/plugins/heatcanvas/heatcanvas.js";
      document.head.appendChild(heatCanvasScript);

      heatCanvasScript.onload = () => {
        const heatCanvasLeafletScript = document.createElement("script");
        heatCanvasLeafletScript.src =
          "./scripts/plugins/heatcanvas/heatcanvas-leaflet.js";
        document.head.appendChild(heatCanvasLeafletScript);
        heatCanvasLeafletScript.onload = () => {
          console.log("HeatCanvas Leaflet plugin loaded.");
          initStopMap(map, layerControl);
        };
      };
    };
  } else if (path.includes("/pollution.html")) {
    console.log("Initializing map for pollution page.");
    initPollutionMap(map, layerControl);
  } else if (path.includes("/routes.html")) {
    console.log("Initializing map for routes page.");
    initRouteMap(map);
  } else {
    console.log("No map to initialize for this page.");
  }
}

/**
 * Function to initialize the Leaflet map with default settings.
 *
 * @return {Object} An object containing the Leaflet Map and Layer Control.
 */
function initDefaultMap() {
  const manchester = [53.4808, -2.2426];

  var map = L.map("map").setView(manchester, 10);

  var osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  });

  var Esri_WorldImagery = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
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

  // Placename Labels Layer
  // This layer is mainly for the imagery base map to show place names since it has no labels by default
  var Stadia_StamenTonerLabels = L.tileLayer(
    "https://tiles.stadiamaps.com/tiles/stamen_toner_labels/{z}/{x}/{y}{r}.{ext}",
    {
      minZoom: 0,
      maxZoom: 20,
      attribution:
        '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      ext: "png",
    },
  );

  var imageryGroup = L.layerGroup([
    Esri_WorldImagery,
    Stadia_StamenTonerLabels,
  ]);

  // Add Leaflet Layer Controls
  var baseMaps = {
    "Open Street Map": osm,
    "World Imagery": imageryGroup,
    "Stadia Alidade Smooth": Stadia_AlidadeSmooth,
    "Stadia Alidade Smooth Dark": Stadia_AlidadeSmoothDark,
  };

  var overlays = {};

  var layerControl = L.control.layers(baseMaps, overlays).addTo(map);

  return { map, layerControl };
}

/**
 * Function to initialize the Leaflet map for displaying stops.
 *
 * @param {L.Map} map - The Leaflet Map object to initialize for stops.
 * @param {L.Control.Layers} layerControl - The Leaflet Layer Control to add heatmap layer to.
 */
function initStopMap(map, layerControl) {
  var geojsonStops = fetch("./datasets/stops/stops.geojson").then((response) =>
    response.json(),
  );

  geojsonStops.then((data) => {
    var markers = L.markerClusterGroup();

    var geojsonLayer = L.geoJSON(data, {
      onEachFeature: function (feature, layer) {
        layer.bindPopup(
          "<b>Stop Name:</b> " +
            feature.properties.CommonName +
            "<br><b>Stop ID (ATCO code):</b> " +
            feature.properties.AtcoCode +
            "<br><b>Location:</b> " +
            feature.properties.Latitude +
            ", " +
            feature.properties.Longitude,
        );
      },
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
          icon: L.icon({
            iconUrl: "./assets/bus-stop-icon.png",
            iconSize: [50, 50],
            iconAnchor: [25, 50],
            popupAnchor: [0, -50],
          }),
        });
      },
    });

    markers.addLayer(geojsonLayer);
    map.addLayer(markers);
  });

  // Add Heatmap Layer

  // Wait for HeatCanvas to be loaded before using it
  if (typeof HeatCanvas === "undefined") {
    console.error(
      "HeatCanvas is not loaded. Please ensure the plugin is loaded",
    );
    return;
  }

  var heatmap = new L.TileLayer.HeatCanvas({}, { step: 0.5, opacity: 0.5 });

  geojsonStops.then((data) => {
    for (const feature of data.features) {
      heatmap.pushData(
        feature.geometry.coordinates[1],
        feature.geometry.coordinates[0],
        40,
      );
    }
  });

  layerControl.addOverlay(heatmap, "Stop Density Heatmap");

  console.log("Stop map initialized.");
}

/**
 * Function to initialize the Leaflet map for displaying pollution data.
 *
 * @param {L.Map} map - The Leaflet Map object to initialize for pollution data.
 * @param {L.Control.Layers} layerControl - The Leaflet Layer Control to add pollution layer to.
 */
function initPollutionMap(map, layerControl) {
  const pollutionLayerConfigs = {
    "CO2 Emissions": {
      url: "https://naeimaps.rcdo.co.uk/naeiserver/services/NAEI_2023/2023_CO2_viridis/MapServer/WMSServer?",
      legend:
        "https://naeimaps.rcdo.co.uk/naeiserver/services/NAEI_2023/2023_CO2_viridis/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=5&",
      layer: "5",
    },
    "NOx Emissions": {
      url: "https://naeimaps.rcdo.co.uk/naeiserver/services/NAEI_2023/2023_NOx_viridis/MapServer/WMSServer?",
      legend:
        "https://naeimaps.rcdo.co.uk/naeiserver/services/NAEI_2023/2023_NOx_viridis/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=17&",
      layer: "17",
    },
    "PM2.5 Emissions": {
      url: "https://naeimaps.rcdo.co.uk/naeiserver/services/NAEI_2023/2023_PM2_5_viridis/MapServer/WMSServer?",
      legend:
        "https://naeimaps.rcdo.co.uk/naeiserver/services/NAEI_2023/2023_PM2_5_viridis/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=19&",
      layer: "19",
    },
    "PM10 Emissions": {
      url: "https://naeimaps.rcdo.co.uk/naeiserver/services/NAEI_2023/2023_PM10_viridis/MapServer/WMSServer?",
      legend:
        "https://naeimaps.rcdo.co.uk/naeiserver/services/NAEI_2023/2023_PM10_viridis/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=13&",
      layer: "13",
    },
    "CH4 Emissions": {
      url: "https://naeimaps.rcdo.co.uk/naeiserver/services/NAEI_2023/2023_CH4_viridis/MapServer/WMSServer?",
      legend:
        "https://naeimaps.rcdo.co.uk/naeiserver/services/NAEI_2023/2023_CH4_viridis/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=5&",
      layer: "5",
    },
    "N2O Emissions": {
      url: "https://naeimaps.rcdo.co.uk/naeiserver/services/NAEI_2023/2023_N2O_viridis/MapServer/WMSServer?",
      legend:
        "https://naeimaps.rcdo.co.uk/naeiserver/services/NAEI_2023/2023_N2O_viridis/MapServer/WMSServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=5&",
      layer: "5",
    },
  };

  // Add pollution layers to the map
  var pollutionLayers = {};
  for (const [name, config] of Object.entries(pollutionLayerConfigs)) {
    pollutionLayers[name] = L.tileLayer.wms(config.url, {
      layers: config.layer,
      format: "image/png",
      transparent: true,
    });
    pollutionLayers[name].legend = config.legend;
  }

  // Add pollution layer to layer control
  for (const [name, layer] of Object.entries(pollutionLayers)) {
    layerControl.addOverlay(layer, name);
  }

  // Add a marker to indicate where Manchester is
  var manchesterMarker = L.marker([53.4808, -2.2426]).addTo(map);
  manchesterMarker
    .bindPopup("<b>Manchester</b><br>City of Manchester, UK.")
    .openPopup();

  // Change the map view to be less zoomed in to see pollution overlays better
  map.setView([53.4808, -2.2426], 6);

  // When a pollution layer is added, show its legend
  map.on("overlayadd", function (eventLayer) {
    console.log("Overlay added: " + eventLayer.name);

    if (pollutionLayers[eventLayer.name]) {
      const legendUrl = pollutionLayers[eventLayer.name].legend;
      // Remove any existing legend control
      if (map._pollutionLegendControl) {
        map.removeControl(map._pollutionLegendControl);
      }

      // Create a new legend control
      const LegendControl = L.Control.extend({
        options: { position: "bottomright" },
        onAdd: function () {
          const div = L.DomUtil.create(
            "div",
            "leaflet-control pollution-legend",
          );
          div.innerHTML =
            '<img src="' + legendUrl + '" alt="Legend" style="width:120px;">';
          return div;
        },
      });
      map._pollutionLegendControl = new LegendControl();
      map.addControl(map._pollutionLegendControl);
    }
  });

  // When a pollution layer is removed, clear the legend
  map.on("overlayremove", function (eventLayer) {
    if (pollutionLayers[eventLayer.name]) {
      if (map._pollutionLegendControl) {
        map.removeControl(map._pollutionLegendControl);
        map._pollutionLegendControl = null;
      }
    }
  });

  console.log("Pollution map initialized.");
}

/**
 * Function to initialize the Leaflet map for displaying routes.
 *
 * @param {L.Map} map - The Leaflet Map object to initialize for routes.
 */
function initRouteMap(map) {
  // Store the map instance globally for use in other functions
  mapsPlaceholder.leafletMap = map;

  // Load the UI (Function from routeSelection.js)
  populatePage();

  console.log("Route map initialized.");
}

/**
 * Function to remove any existing route from the Leaflet map.
 */
function removeRouteFromMap() {
  // Get the map instance
  var map = mapsPlaceholder.leafletMap;

  // Remove any existing route layers
  if (map._routeLayer) {
    map.removeLayer(map._routeLayer);
    map._routeLayer = null;
  }
}

/**
 * Function to draw a route on the Leaflet map.
 *
 * @param {Object} geojsonData - The GeoJSON data for the route to be drawn.
 * @param {string} route - The selected route number.
 * @param {string} day - The selected day type (i.e. weekday, saturday, sunday or bank holiday).
 * @param {string} direction - The selected direction (i.e. inbound or outbound or circular).
 * @param {string} variant - The selected route variant.
 */
function drawRouteOnMap(geojsonData, route, day, direction, variant) {
  // Get the map instance
  var map = mapsPlaceholder.leafletMap;

  // Remove any existing route layers
  removeRouteFromMap();

  // Create a new GeoJSON layer for the route
  const routeLayer = L.geoJSON(geojsonData, {
    style: {
      color: "blue",
      weight: 5,
      opacity: 0.7,
    },
  }).addTo(map);

  // Add popup to show route information
  routeLayer.bindPopup(
    "<h3>Route Distance:</h3>" +
      (geojsonData.properties.totaldist
        ? " " +
          Math.round(geojsonData.properties.totaldist) +
          " units <small>(Nearest whole number)</small>"
        : " N/A") +
      "<br><button style='margin: 1.25em 0px;' onclick='window.location.href=\"./timetables.html?route=" +
      route +
      "&direction=" +
      direction +
      "&variant=" +
      variant +
      "&day=" +
      day +
      "\"'>View Timetable</button>",
  );

  // Store the route layer on the map instance for future reference
  map._routeLayer = routeLayer;

  // Fit the map view to the route bounds
  map.fitBounds(routeLayer.getBounds());
}

loadLeaflet();
