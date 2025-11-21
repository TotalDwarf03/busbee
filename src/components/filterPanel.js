class FilterPanel extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
            <h2>Filters</h2>
            <fieldset onchange="updateMapLibrary(event)">
                <legend>Select Mapping Library</legend>
                <input
                type="radio"
                id="leaflet"
                name="mapping-library"
                value="leaflet"
                />
                <label for="leaflet">Leaflet.js</label><br />

                <input
                type="radio"
                id="openlayers"
                name="mapping-library"
                value="openlayers"
                />
                <label for="openlayers">OpenLayers</label><br />
            </fieldset>

            <blockquote id="load-status">
                <!-- This block will display the loading status of the mapping library -->
                <span id="load-status-message"
                ><i class="fas fa-spinner fa-spin"></i> Loading map library...</span
                >
            </blockquote>

            <blockquote>
                <p>
                  <small>
                    <b>Note:</b> Sometimes, the map may not load its base layer correctly.
                    This results in a blank or grey map area. If this happens, please try
                    refreshing the page, changing the mapping library, or toggling to a different
                    basemap layer using the layer control on the map.
                  </small>
                </p>            
            </blockquote>
        `;
  }
}

customElements.define("filter-panel", FilterPanel);
