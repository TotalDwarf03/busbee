var mapsPlaceholder = {}; // Placeholder object to store map instances

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

  var { map, layerSwitcher } = initDefaultMap();

  if (path.includes("/stops.html")) {
    console.log("Initializing map for stops page.");
    initStopMap(map);
  } else if (path.includes("/pollution.html")) {
    console.log("Initializing map for pollution page.");
    initPollutionMap(map, layerSwitcher);
  } else if (path.includes("/routes.html")) {
    console.log("Initializing map for routes page.");
    initRouteMap(map);
  } else {
    console.log("No further map configuration needed for this page.");
  }
}

/**
 * Function to initialize the OpenLayers map with multiple base layers.
 * @returns {Object} An object containing the OpenLayers Map and Layer Switcher control.
 */
function initDefaultMap() {
  const manchester = ol.proj.fromLonLat([-2.2426, 53.4808]);

  var map = new ol.Map({
    target: "map",
    layers: [
      new ol.layer.Group({
        title: "Base Maps",
        fold: "closed",
        layers: [
          new ol.layer.Tile({
            title: "OpenStreetMap",
            visible: false,
            type: "base",
            source: new ol.source.OSM(),
          }),
          new ol.layer.Group({
            title: "World Imagery",
            fold: "closed",
            combine: true,
            visible: false,
            type: "base",
            layers: [
              new ol.layer.Tile({
                title: "Esri World Imagery",
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
            type: "base",
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
            type: "base",
            source: new ol.source.XYZ({
              url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png",
              minZoom: 0,
              maxZoom: 20,
              attributions:
                '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }),
          }),
        ],
      }),
    ],
    view: new ol.View({
      center: manchester,
      zoom: 10,
    }),
  });

  var layerSwitcher = new LayerSwitcher({
    groupSelectStyle: "none",
  });
  map.addControl(layerSwitcher);

  return { map, layerSwitcher };
}

/**
 * Function to initialize the OpenLayers map for displaying stops.
 *
 * @param {ol.Map} map - The OpenLayers Map object to initialize for stops.
 */
function initStopMap(map) {
  const geojsonStops = fetch("./datasets/stops/stops.geojson").then(
    (response) => response.json(),
  );

  geojsonStops.then((data) => {
    const vectorSource = new ol.source.Vector({
      features: new ol.format.GeoJSON().readFeatures(data, {
        featureProjection: "EPSG:3857",
      }),
    });

    const clusterSource = new ol.source.Cluster({
      distance: 80,
      source: vectorSource,
    });

    const clusters = new ol.layer.Vector({
      source: clusterSource,
      style: function (feature) {
        const size = feature.get("features").length;
        let style;
        if (size > 1) {
          style = new ol.style.Style({
            image: new ol.style.Circle({
              radius: 10 + Math.min(size, 20),
              stroke: new ol.style.Stroke({
                color: "#fff",
              }),
              fill: new ol.style.Fill({
                color: "#3399CC",
              }),
            }),
            text: new ol.style.Text({
              text: size > 1 ? size.toString() : "",
              fill: new ol.style.Fill({
                color: "#fff",
              }),
            }),
          });
        } else {
          // Use icon for individual stops
          const stopFeature = feature.get("features")[0];
          style = new ol.style.Style({
            image: new ol.style.Icon({
              anchor: [0.5, 1],
              src: "./assets/bus-stop-icon.png",
              scale: 0.2,
            }),
          });
        }
        return style;
      },
    });
    map.addLayer(clusters);

    // Add a popup on click to show stop information
    // If there are multiple stops in a cluster, zoom in instead
    const overlayContainerElement = document.createElement("div");
    overlayContainerElement.className = "ol-popup";

    const overlayLayer = new ol.Overlay({
      element: overlayContainerElement,
    });

    map.addOverlay(overlayLayer);

    map.on("click", function (event) {
      map.forEachFeatureAtPixel(event.pixel, function (feature, layer) {
        const clusteredFeatures = feature.get("features");

        // If only one stop in cluster, show popup and pan to it
        if (clusteredFeatures.length === 1) {
          const stopFeature = clusteredFeatures[0];

          const coordinate = stopFeature.getGeometry().getCoordinates();

          overlayLayer.setPosition(coordinate);
          overlayContainerElement.innerHTML =
            "<b>Stop Name:</b> " +
            stopFeature.get("CommonName") +
            "<br><b>Stop ID (ATCO code):</b> " +
            stopFeature.get("AtcoCode") +
            "<br><b>Location:</b> " +
            stopFeature.get("Latitude") +
            ", " +
            stopFeature.get("Longitude");
          overlayContainerElement.style =
            "background-color: white; padding: 5px; border: 1px solid black;";

          // Pan to the stop
          map.getView().animate({ center: coordinate, duration: 500 });
        } else {
          // Zoom in on the cluster
          const extent = ol.extent.createEmpty();
          clusteredFeatures.forEach(function (feat) {
            ol.extent.extend(extent, feat.getGeometry().getExtent());
          });
          map
            .getView()
            .fit(extent, { duration: 500, padding: [50, 50, 50, 50] });
        }
      });

      // Hide popup when clicking outside features
      if (!map.hasFeatureAtPixel(event.pixel)) {
        overlayLayer.setPosition(undefined);
        overlayContainerElement.innerHTML = "";
      }
    });
  });

  // Add a stops heatmap layer
  const heatmapLayer = new ol.layer.Heatmap({
    source: new ol.source.Vector({
      url: "./datasets/stops/stops.geojson",
      format: new ol.format.GeoJSON(),
    }),
    blur: 15,
    radius: 8,
    opacity: 0.6,
    visible: false,
    title: "Stop Density Heatmap",
  });

  map.addLayer(heatmapLayer);

  console.log("Stop map initialized.");
}

/**
 * Function to initialize the OpenLayers map for displaying pollution data.
 *
 * @param {ol.Map} map - The OpenLayers Map object to initialize for pollution data.
 * @param {ol.control.LayerSwitcher} layerControl - The LayerSwitcher control for managing layers.
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
  var layerGroup = new ol.layer.Group({
    title: "Pollution Layers",
    fold: "closed",
    layers: [],
  });

  for (const [name, config] of Object.entries(pollutionLayerConfigs)) {
    const layer = new ol.layer.Tile({
      title: name,
      source: new ol.source.TileWMS({
        url: config.url,
        params: { LAYERS: config.layer, TILED: true },
        serverType: "geoserver",
        crossOrigin: "anonymous",
      }),
      visible: false,
    });

    pollutionLayers[name] = layer;
    layerGroup.getLayers().push(layer);
  }

  map.addLayer(layerGroup);

  // Add pollution layer to layer control
  layerControl.renderPanel();

  // Add a marker to indicate where Manchester is
  var manchesterMarker = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([-2.2426, 53.4808])),
  });

  var markerStyle = new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 1],
      src: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
      scale: 0.05,
    }),
  });

  manchesterMarker.setStyle(markerStyle);

  var vectorSource = new ol.source.Vector({
    features: [manchesterMarker],
  });

  var markerVectorLayer = new ol.layer.Vector({
    source: vectorSource,
  });

  map.addLayer(markerVectorLayer);

  // Add a popup for Manchester marker
  var overlayContainerElement = document.createElement("div");
  overlayContainerElement.className = "ol-popup";

  var overlayLayer = new ol.Overlay({
    element: overlayContainerElement,
  });

  map.addOverlay(overlayLayer);

  // Add a click event to the map to handle popup display
  map.on("click", function (event) {
    // Show popup when Manchester marker is clicked
    map.forEachFeatureAtPixel(event.pixel, function (feature, layer) {
      if (feature === manchesterMarker) {
        var coordinate = feature.getGeometry().getCoordinates();

        overlayLayer.setPosition(coordinate);
        overlayContainerElement.innerHTML =
          "<b>Manchester</b><br>City of Manchester, UK.";
        overlayContainerElement.style =
          "background-color: white; padding: 5px; border: 1px solid black;";
      }
    });

    // Hide popup when clicking outside features
    if (!map.hasFeatureAtPixel(event.pixel)) {
      overlayLayer.setPosition(undefined);
      overlayContainerElement.innerHTML = "";
    }
  });

  // Open the popup by default
  map.once("postrender", function () {
    var coordinate = manchesterMarker.getGeometry().getCoordinates();
    overlayLayer.setPosition(coordinate);
    overlayContainerElement.innerHTML =
      "<b>Manchester</b><br>City of Manchester, UK.";
    overlayContainerElement.style =
      "background-color: white; padding: 5px; border: 1px solid black;";
  });

  // Change the map view to be less zoomed in to see pollution overlays better
  map.setView(
    new ol.View({
      center: ol.proj.fromLonLat([-2.2426, 53.4808]),
      zoom: 6,
    }),
  );

  // Add a listener to each layer change event
  // If the visibility of a pollution layer changes, update the legend accordingly
  layerGroup.getLayers().forEach(function (layer) {
    layer.on("change:visible", function () {
      const layerName = layer.get("title");
      if (layer.getVisible()) {
        const legendUrl = pollutionLayerConfigs[layerName].legend;

        // Remove any existing legend control
        if (map._pollutionLegendControl) {
          map.removeControl(map._pollutionLegendControl);
        }

        // Create a new legend control
        const LegendControl = new ol.control.Control({
          element: document.createElement("div"),
        });
        LegendControl.element.className = "ol-control pollution-legend";
        LegendControl.element.style.bottom = "0";
        LegendControl.element.style.right = "0";
        LegendControl.element.style.position = "absolute";
        LegendControl.element.innerHTML =
          '<img src="' + legendUrl + '" alt="Legend" style="width:120px;">';

        map.addControl(LegendControl);
        map._pollutionLegendControl = LegendControl;
      } else {
        // If the layer is hidden, remove the legend
        if (map._pollutionLegendControl) {
          map.removeControl(map._pollutionLegendControl);
          map._pollutionLegendControl = null;
        }
      }
    });
  });

  console.log("Pollution map initialized.");
}

/**
 * Function to initialize the OpenLayers map for displaying routes.
 *
 * @param {ol.Map} map - The OpenLayers Map object to initialize for routes.
 */
function initRouteMap(map) {
  // Store the map instance globally for use in other functions
  mapsPlaceholder.openlayersMap = map;

  // Load the UI (Function from routeSelection.js)
  populatePage();

  console.log("Route map initialized.");
}

/**
 * Function to remove any existing route from the OpenLayers map.
 */
function removeRouteFromMap() {
  var map = mapsPlaceholder.openlayersMap;

  // Remove existing route layer if present
  if (map._routeLayer) {
    map.removeLayer(map._routeLayer);
    map._routeLayer = null;
  }
}

/**
 * Function to draw a route on the openLayers Map.
 *
 * @param {Object} geojsonData - The GeoJSON data for the route to be drawn.
 * @param {string} route - The selected route number.
 * @param {string} day - The selected day type (i.e. weekday, saturday, sunday or bank holiday).
 * @param {string} direction - The selected direction (i.e. inbound or outbound or circular).
 * @param {string} variant - The selected route variant.
 */
function drawRouteOnMap(geojsonData, route, day, direction, variant) {
  var map = mapsPlaceholder.openlayersMap;

  // Remove any existing route layers
  removeRouteFromMap();

  // Create a new vector source and layer for the route
  const routeSource = new ol.source.Vector({
    features: new ol.format.GeoJSON().readFeatures(geojsonData, {
      featureProjection: "EPSG:3857",
    }),
  });

  const routeLayer = new ol.layer.Vector({
    source: routeSource,
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: "#0000FF",
        width: 4,
        opacity: 0.7,
      }),
    }),
  });

  map.addLayer(routeLayer);

  // Add popup to show route information
  const overlayContainerElement = document.createElement("div");
  overlayContainerElement.className = "ol-popup";

  const overlayLayer = new ol.Overlay({
    element: overlayContainerElement,
  });

  map.addOverlay(overlayLayer);

  // Show popup with route distance when the route is clicked
  map.on("click", function (event) {
    map.forEachFeatureAtPixel(event.pixel, function (feature, layer) {
      if (layer === routeLayer) {
        const coordinate = feature
          .getGeometry()
          .getClosestPoint(map.getView().getCenter());

        overlayLayer.setPosition(coordinate);
        overlayContainerElement.innerHTML =
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
          "\"'>View Timetable</button>";
        overlayContainerElement.style =
          "background-color: white; padding: 5px; border: 1px solid black;";
      }
    });

    // Hide popup when clicking outside features
    if (!map.hasFeatureAtPixel(event.pixel)) {
      overlayLayer.setPosition(undefined);
      overlayContainerElement.innerHTML = "";
    }
  });

  // Store the route layer on the map instance for future reference
  map._routeLayer = routeLayer;

  // Fit the map view to the route extent
  const routeExtent = routeSource.getExtent();
  map.getView().fit(routeExtent, { duration: 1000, padding: [50, 50, 50, 50] });
}

loadOpenLayers();
