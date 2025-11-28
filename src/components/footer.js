class CustomFooter extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <footer>
      <p>
        <small>&copy; 2025 BusBee. All rights reserved.</small>
      </p>
      <p>
        <small
          >Developed by Kieran Pritchard | IS3S665 GIS and the Spatial Web @ The
          University of South Wales</small
        >
      </p>
      <p>
        <small>
          <i class="fab fa-github"></i>
          <a href="https://github.com/TotalDwarf03/busbee" target="_blank"
            >Repository</a
          >
          |
          <i class="fab fa-github"></i>
          <a href="https://github.com/TotalDwarf03" target="_blank"
            >GitHub Profile</a
          >
          |
          <i class="fab fa-linkedin"></i>
          <a href="https://www.linkedin.com/in/kprit-dev/" target="_blank"
            >LinkedIn Profile</a
          >
          |
          <i class="fas fa-globe"></i>
          <a href="https://totaldwarf.dev" target="_blank">Website</a>
        </small>
      </p>
      <img
        class="footer-img"
        src="./assets/busbee-logo-hori-large.png"
        alt="BusBee"
      />
    </footer>
    `;
  }
}

customElements.define("custom-footer", CustomFooter);
