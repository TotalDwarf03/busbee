/**
 * Function to filter and display routes based on user selections.
 */
function applyFilters() {
  // Get all UI filter values
  const routeSelect = document.getElementById("route-select");
  const dayRadio = document.getElementsByName("day");
  const directionRadio = document.getElementsByName("direction");
  const variationSelect = document.getElementById("variation");

  const selectedRoute = routeSelect.value;
  let selectedDay = "";
  let selectedDirection = "";
  const selectedVariation = variationSelect.value;

  // Get selected day
  for (const radio of dayRadio) {
    if (radio.checked) {
      selectedDay = radio.value;
      break;
    }
  }

  // Get selected direction
  for (const radio of directionRadio) {
    if (radio.checked) {
      selectedDirection = radio.value;
      break;
    }
  }

  console.log("Applying filters:");
  console.log("Selected Route:", selectedRoute);
  console.log("Selected Day:", selectedDay);
  console.log("Selected Direction:", selectedDirection);
  console.log("Selected Variation:", selectedVariation);

  // Get the routes GeoJSON
  fetch("./datasets/routes/routes.geojson")
    .then((response) => response.json())
    .then((data) => {
      // Filter the routes based on selected criteria
      const filteredRoutes = data.features.filter((route) => {
        const serviceDetails = route.properties.ServiceID.split("_");

        var [serviceNo, suffix, direction, day, variation] = serviceDetails;

        variation = variation === "" ? "Standard Variant" : variation;

        // Match selected route, direction, day, and variation
        return (
          serviceNo === selectedRoute &&
          direction === selectedDirection &&
          day === selectedDay &&
          variation === selectedVariation
        );
      });

      console.log("Filtered Routes:", filteredRoutes);

      // Update the filter status messages
      const filterStatusDiv = document.getElementById("filter-status");
      filterStatusDiv.innerHTML = `
        <p>Found <strong>${filteredRoutes.length}</strong> route(s) matching the selected criteria.</p>
        ${filteredRoutes.length === 0 ? "<p>Try adjusting your filters.</p>" : ""}
      `;

      if (filteredRoutes.length === 0) {
        console.warn("No routes match the selected criteria.");
        removeRouteFromMap();
        return;
      }

      if (filteredRoutes.length > 1) {
        console.warn(
          "Multiple routes match the selected criteria. Displaying the first one.",
        );
      }

      const routeToDisplay = filteredRoutes[0];

      drawRouteOnMap(
        routeToDisplay,
        selectedRoute,
        selectedDay,
        selectedDirection,
        selectedVariation,
      );
    })
    .catch((error) => {
      console.error("Error fetching routes GeoJSON:", error);
    });
}

/**
 * Function to populate the route selection dropdown and handle user interactions.
 */
function populatePage() {
  const routeSelect = document.getElementById("route-select");
  const routeDetailsDiv = document.getElementById("route-details");

  // Populate the route select dropdown
  let routesData = null;

  // Fetch and store the GeoJSON data
  fetch("./datasets/routes/routes.geojson")
    .then((response) => response.json())
    .then((data) => {
      routesData = data;
      const routes = data.features;

      // Populate the route select dropdown
      routes.forEach((route) => {
        const serviceId = route.properties.ServiceID.split("_")[0];
        if (!routeSelect.querySelector(`option[value="${serviceId}"]`)) {
          const option = document.createElement("option");
          option.value = serviceId;
          option.textContent = serviceId;
          routeSelect.appendChild(option);
        }
      });
    })
    .catch((error) => {
      console.error("Error fetching routes GeoJSON:", error);
    });

  // Display route details when a route is selected
  routeSelect.addEventListener("change", (event) => {
    const selectedRoute = event.target.value;
    console.log("Selected route:", selectedRoute);

    // Check if the default route option is available
    // If so, remove it so it can't be selected again
    const defaultOption = routeSelect.querySelector('option[value=""]');
    if (defaultOption) {
      routeSelect.removeChild(defaultOption);
    }

    const variationSelect = document.getElementById("variation");
    // Clear previous variations
    variationSelect.innerHTML = "";

    // Disable all day and direction radios initially
    const dayRadio = document.getElementsByName("day");
    dayRadio.forEach((radio) => {
      radio.disabled = true;
      radio.parentElement.classList.add("disabled");
    });

    const directionRadio = document.getElementsByName("direction");
    directionRadio.forEach((radio) => {
      radio.disabled = true;
      radio.parentElement.classList.add("disabled");
    });

    // Count the number of variations for the selected route
    var routeCount = 0;
    routesData.features.forEach((route) => {
      const serviceId = route.properties.ServiceID.split("_")[0];
      if (serviceId === selectedRoute) {
        routeCount++;

        // Update the variation dropdown with available variations

        // Get the last character of the ServiceID string
        // this is used to identify the variant
        let routeVariant = route.properties.ServiceID.slice(-1);

        // If the last character is "_", it indicates the standard variant
        if (routeVariant === "_") {
          routeVariant = "Standard Variant";
        }

        // Add option to variation select if it doesn't already exist
        if (!variationSelect.querySelector(`option[value="${routeVariant}"]`)) {
          const option = document.createElement("option");
          option.value = routeVariant;
          option.textContent = routeVariant;
          variationSelect.appendChild(option);
        } else {
          console.log("Variation option exists:", routeVariant);
        }

        // Update the day and direction radios based on available data
        const serviceDetails = route.properties.ServiceID.split("_");
        const [serviceNo, suffix, direction, day, variation] = serviceDetails;

        // Enable relevant day radios
        dayRadio.forEach((radio) => {
          if (radio.disabled) {
            radio.disabled = radio.value !== day;
            radio.parentElement.classList.toggle("disabled", radio.disabled);
          }
        });

        // Enable relevant direction radios
        directionRadio.forEach((radio) => {
          if (radio.disabled) {
            radio.disabled = radio.value !== direction;
            radio.parentElement.classList.toggle("disabled", radio.disabled);
          }
        });
      }
    });

    // Update the route details div
    routeDetailsDiv.innerHTML = `
            <p>
                Route <strong>${selectedRoute}</strong> has <strong>${routeCount}</strong> variation(s).
            </p>
        `;

    // Set default selections
    for (const radio of dayRadio) {
      if (!radio.disabled) {
        radio.checked = true;
        break;
      }
    }

    for (const radio of directionRadio) {
      if (!radio.disabled) {
        radio.checked = true;
        break;
      }
    }

    variationSelect.value = "Standard Variant";

    // Now that the route is selected, and the UI has been populated,
    // We can now call applyFilters to update the map
    applyFilters();
  });
}
