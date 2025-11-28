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
  } else if (path.includes("/visualise.html")) {
    console.log("Initializing map for visualise page.");

    // Load Leaflet TrackPlayer Plugin
    console.log("Loading Leaflet TrackPlayer plugin...");
    const trackPlayerScript = document.createElement("script");
    trackPlayerScript.src =
      "./scripts/plugins/trackplayer/leaflet-trackplayer.umd.cjs";
    document.head.appendChild(trackPlayerScript);
    trackPlayerScript.onload = () => {
      console.log("Leaflet TrackPlayer plugin loaded.");
      initVisualiseMap(map, layerControl);
    };
  } else {
    console.log("No further map configuration needed for this page.");
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
  var geojsonStops = fetch("./datasets/stops/stops.json").then((response) =>
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
 * Function to initialize the Leaflet map for visualising journeys.
 *
 * @param {L.Map} map - The Leaflet Map object to initialize for visualising journeys.
 * @param {L.Control.Layers} layerControl - The Leaflet Layer Control to add journey layers to.
 */
function initVisualiseMap(map, layerControl) {
  // Store the map instance globally for use in other functions
  mapsPlaceholder.leafletMap = map;

  // Store the layer control globally for use in other functions
  mapsPlaceholder.leafletLayerControl = layerControl;

  console.log("Visualise map initialized.");
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
      "&ServiceID=" +
      geojsonData.properties.ServiceID +
      "\"'>View Timetable</button>",
  );

  // Store the route layer on the map instance for future reference
  map._routeLayer = routeLayer;

  // Fit the map view to the route bounds
  map.fitBounds(routeLayer.getBounds());
}

/**
 * Function to visualise a journey on the map.
 *
 * @param {object} journeyData - The journey data to visualise.
 * @param {object} headers - The headers corresponding to the journey data.
 * @param {string} serviceID - The service ID of the journey to visualise.
 */
function visualiseJourneyOnMap(journeyData, headers, serviceID) {
  // Get the map instance
  var map = mapsPlaceholder.leafletMap;

  // Show loading visualisation message
  document.getElementById("loading-visualisation").style.display = "";

  // Remove any existing route layers
  removeRouteFromMap();

  // Get the coordinates from the journey data
  fetch("./datasets/naptan_stops.csv")
    .then((response) => response.text())
    .then((csvText) => {
      // Parse CSV data
      const csvLines = csvText.split("\n");
      const naptanHeaders = csvLines[0].split(",");

      for (const journeyPoint of journeyData) {
        const atcoCode = journeyPoint[headers.indexOf("location")];

        // Find the corresponding row in the Naptan CSV
        const stopRow = csvLines.find((line) => {
          const columns = line.split(",");
          return columns[0] === atcoCode;
        });

        if (stopRow) {
          // Extract latitude and longitude
          const stopColumns = stopRow.split(",");
          const latitude =
            parseFloat(stopColumns[naptanHeaders.indexOf("Latitude")]) || 0;
          const longitude =
            parseFloat(stopColumns[naptanHeaders.indexOf("Longitude")]) || 0;

          // Update the journey point with coordinates
          journeyPoint.push([latitude, longitude]);
        }
      }

      // Now that the journey data has coordinates, we need to update the headers as well
      headers.push("coordinates");

      // Now that the journey data has coordinates, we need to load the route on the map
      // We need to collect this from the routes dataset

      fetch("./datasets/routes/routes.json")
        .then((response) => response.json())
        .then((routesData) => {
          // Filter the points for the selected service ID
          const route = routesData.features.find(
            (feature) => feature.properties.ServiceID === serviceID,
          );

          if (route) {
            // Create a list of bus stop coordinates for the journey
            const stopCoordinates = journeyData
              .map((point) => point[headers.indexOf("coordinates")])
              .filter((coord) => coord); // Filter out any undefined coordinates

            // Draw the route on the map as a GeoJSON layer
            const routeLayer = L.geoJSON(route, {
              style: {
                color: "green",
                weight: 5,
                opacity: 0.7,
              },
            }).addTo(map);

            // Add markers for the start and end points
            const startMarker = L.marker(stopCoordinates[0]).addTo(map);
            startMarker.bindPopup("<b>Journey Start Point</b>");

            const endMarker = L.marker(
              stopCoordinates[stopCoordinates.length - 1],
            ).addTo(map);
            endMarker.bindPopup("<b>Journey End Point</b>");

            // Draw the route on the map
            const track = new L.TrackPlayer(stopCoordinates, {
              markerIcon: L.icon({
                iconUrl: "./assets/bus-icon.png",
                iconSize: [24, 24],
                iconAnchor: [12, 12],
              }),
              markerRotation: false,
            }).addTo(map);

            // Store the route layer on the map instance for future reference
            map._routeLayer = track;

            // Add an isPlaying attribute to the track for easier checking
            track.isPlaying = false;

            // Pan the map to focus on the starting point
            map.setView(stopCoordinates[0], 16);

            // Add play/pause control
            const trackControl = L.control({ position: "bottomleft" });
            trackControl.onAdd = function () {
              const div = L.DomUtil.create("div", "track-control");
              div.innerHTML = `
                <button id="track-play-pause" style="font-size:16px; padding:8px;"><i class="fas fa-play" aria-hidden="true"></i> Play</button>
              `;
              return div;
            };
            trackControl.addTo(map);

            // Handle play/pause button click
            document
              .getElementById("track-play-pause")
              .addEventListener("click", function () {
                if (track.isPlaying) {
                  track.pause();
                  track.isPlaying = false;
                  this.innerHTML =
                    '<i class="fas fa-play" aria-hidden="true"></i> Play';
                } else {
                  track.start();
                  track.isPlaying = true;
                  this.innerHTML =
                    '<i class="fas fa-pause" aria-hidden="true"></i> Pause';
                }
              });

            // Zoom the map in to focus more closely on the route when the visualisation starts
            track.on("start", () => {
              map.setView(stopCoordinates[0], 16);
            });

            // Add the nerd stats overlay
            const nerdStats = L.control({ position: "bottomright" });
            nerdStats.onAdd = function () {
              const div = L.DomUtil.create("div", "nerd-stats");
              div.innerHTML = `
                <blockquote style="margin: 0;">
                  <h4 style="padding: 0;">Journey Visualisation Stats</h4>
                  <div id="stats-content"></div>
                    <b>Progress:</b> <span id="stat-progress">0%</span><br>
                    <b>Current Position:</b> <span id="stat-position">N/A</span><br>
                    <b>Stops Visited:</b> <span id="stat-stops">0 / ${journeyData.length}</span>
                  </div>
                </blockquote>
`;
              return div;
            };

            // Add the nerd stats control to the map
            nerdStats.addTo(map);

            // Create a list to log the stop points reached
            const stopsReached = [];

            // Add progress event listener to deal with bus stop pauses and updating stats
            track.on("progress", (progress, { lng, lat }, index) => {
              // Update nerd stats
              document.getElementById("stat-progress").innerText =
                (progress * 100).toFixed(2) + "%";
              document.getElementById("stat-position").innerText =
                lat.toFixed(5) + ", " + lng.toFixed(5);
              document.getElementById("stat-stops").innerText = `${
                stopsReached.length
              } / ${journeyData.length}`;

              // Deal with stop points
              // If the current point is a stop, pause for 4 seconds and show popup
              const stopCoord = journeyData.find((point) => {
                const coords = point[headers.indexOf("coordinates")];
                return (
                  coords &&
                  Math.abs(coords[0] - lat) < 0.0005 &&
                  Math.abs(coords[1] - lng) < 0.0005
                );
              });

              if (stopCoord && !stopsReached.includes(stopCoord)) {
                track.pause();

                // Collect relevant stop information and display in popup

                // 1. Get the ATCO code of the current stop
                const atcoCode = stopCoord[headers.indexOf("location")];

                // 2. Find the stop details from the Naptan CSV
                const stopRow = csvLines.find((line) => {
                  const columns = line.split(",");
                  return columns[0] === atcoCode;
                });

                // 3. Extract relevant details from Naptan CSV
                const row = stopRow.split(",");

                const commonName = row[naptanHeaders.indexOf("CommonName")];
                const street = row[naptanHeaders.indexOf("Street")];
                const locality = row[naptanHeaders.indexOf("LocalityName")];
                const parentLocality =
                  row[naptanHeaders.indexOf("ParentLocalityName")];
                const grandparentLocality =
                  row[naptanHeaders.indexOf("GrandParentLocalityName")];

                // 4. Collect time information from the journey data
                const arrivalTime =
                  stopCoord[headers.indexOf("published_arrival_time")] || "N/A";
                const departureTime =
                  stopCoord[headers.indexOf("published_departure_time")] ||
                  "N/A";

                // Add a popup at the stop location
                const stopPopup = L.popup({
                  closeOnClick: false,
                  autoClose: true,
                })
                  .setLatLng([lat, lng])
                  .setContent(
                    "<h4>Bus Stop Reached</h4>" +
                      "<b>Stop Name:</b> " +
                      commonName +
                      "<br><b>ATCO Code:</b> " +
                      atcoCode +
                      "<br><b>Street:</b> " +
                      street +
                      "<br><b>Locality:</b> " +
                      locality +
                      "<br><b>Parent Locality:</b> " +
                      parentLocality +
                      "<br><b>Grandparent Locality:</b> " +
                      grandparentLocality +
                      "<hr style='margin: 0.25rem 0'>" +
                      "<b>Arrival Time:</b> " +
                      arrivalTime +
                      "<br><b>Departure Time:</b> " +
                      departureTime,
                  )
                  .openOn(map);

                // Drop a bus stop marker at the stop location
                const stopMarker = L.marker([lat, lng], {
                  icon: L.icon({
                    iconUrl: "./assets/bus-stop-icon.png",
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                  }),
                }).addTo(map);

                // After 4 seconds, close the popup and resume the track

                setTimeout(() => {
                  if (track.isPlaying) {
                    map.closePopup(stopPopup);
                    stopsReached.push(stopCoord);
                    track.start();
                  }
                }, 4000); // Pause for 4 seconds
              }
            });

            // Hide loading visualisation message
            document.getElementById("loading-visualisation").style.display =
              "none";

            // Reenable the map
            document.getElementById("map").removeAttribute("disabled");

            // Hide summary inputs div since visualisation has started
            document.getElementById("journey-summary-inputs").style.display =
              "none";

            // Scroll to the map
            document.getElementById("map").scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        });
    });
}

loadLeaflet();
