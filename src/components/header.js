class CustomHeader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <header>
      <h1>BusBee</h1>
      <p>
        A spatially enabled website to explore bus routes, stops, and timetables
        across Greater Manchester.
      </p>
      <nav>
        <ul>
          <li>
            <a href="./index.html">Home <i class="fas fa-home"></i></a>
          </li>
          <li>
            <a href="./stops.html"
              >Bus Stops <i class="fas fa-map-marker-alt"></i
            ></a>
          </li>
        </ul>
      </nav>
    </header>
    `;
  }
}

customElements.define("custom-header", CustomHeader);
