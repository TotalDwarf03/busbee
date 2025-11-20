/**
 * Update the mapping library in sessionStorage based on user selection.
 * @param {Event} e - The change event from the radio buttons.
 */
function updateMapLibrary(e) {
  const mapLibrary = e.target.value;

  sessionStorage.setItem("mapLibrary", mapLibrary);
  location.reload();
}

/**
 * Imports the mapping library functions dynamically, based on user selection.
 * @param {string} mapLibrary - The selected mapping library to load (i.e. 'leaflet' or 'openlayers').
 */
function importMapFunctions(mapLibrary) {
  // Create a script element to dynamically import the mapping library functions
  const script = document.createElement("script");
  script.src = `./scripts/${mapLibrary}.js`;
  script.defer = true;
  document.body.appendChild(script);
}

// On DOMContentLoaded, set the radio button state and import the selected mapping library
document.addEventListener("DOMContentLoaded", () => {
  // Set the checked value based on session storage
  // Default to 'leaflet' if not set
  const savedMapLibrary = sessionStorage.getItem("mapLibrary") || "leaflet";
  sessionStorage.setItem("mapLibrary", savedMapLibrary);

  document.getElementById(savedMapLibrary).checked = true;

  importMapFunctions(savedMapLibrary);
});
