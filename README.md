# BusBee

![BusBee Logo](./assets/busbee-thumbnail.png)

BusBee is a spatially enabled website that visualises bus routes, stops and timetables across Greater Manchester using the Leaflet and OpenLayers libraries.

This project was created as part of IS3S665 - GIS and the Spatial Web at the University of South Wales (USW).

The curriculum for the module can be found here: [IS3S665 - GIS and the Spatial Web](https://curriculum.southwales.ac.uk/Module/Details?moduleId=MOD009109)

## Deployment

TODO: Add deployment link here

## Features

TODO: Add features list here

## Getting Started

TODO: Add getting started instructions here

## Datasets

For information on the datasets used in this project, please refer to the `README` in the [`datasets` directory](./src/datasets/README.md).

## Linting and Formatting

This project uses GitHub Actions to run Prettier and Markdownlint on push and pull requests to the `main` branch. These action can be found in the `.github/workflows` directory.

These action will check for formatting and linting issues in the codebase. If any issues are found, the action will fail and provide feedback on what needs to be fixed.

To fix any issues, you will need to run the tools locally using the instructions below.

**Credit:**

- [Prettier](https://prettier.io/)
- [Markdownlint-cli](https://github.com/igorshubovych/markdownlint-cli)

### Prettier

To run Prettier locally, you will need to have Node.js and npm installed. You can then install Prettier using the following command:

```bash
npm install --global prettier
```

**Note:** This installs Prettier globally on your system. If you prefer to install it locally to the project, you can run `npm install --save-dev prettier` instead.

Once Prettier is installed, you can run it on the project using the following command:

```bash
prettier --write .
```

### Markdownlint

#### Docker Installation (Recommended)

To run Markdownlint using Docker, you will need to have Docker or Podman installed. You can then run the following command from the root of the project:

```bash
docker run -v $PWD:/workdir ghcr.io/igorshubovych/markdownlint-cli:latest "**/*.md"
```

If using Podman, simply replace `docker` with `podman` in the command above.

#### Node.js Installation

To run Markdownlint locally, you will need to have Node.js and npm installed. You can then install Markdownlint using the following command:

```bash
npm install --global markdownlint-cli
```

**Note:** This installs Markdownlint globally on your system. If you prefer to install it locally to the project, you can run `npm install --save-dev markdownlint-cli` instead.

Once Markdownlint is installed, you can run it on the project using the following command:

```bash
markdownlint . --fix
```

## Credits and Acknowledgements

### Data Sources

#### Local Datasets

- Bus Routes: [GM Bus Routes](https://www.data.gov.uk/dataset/136be10f-1667-474f-b52c-92bb24486739/bus-routes-1-25-000-scale-map-data)
- Bus Stops: [GM Bus Stopping Points](https://www.data.gov.uk/dataset/05252e3a-acdf-428b-9314-80ac7b17ab76/bus-stopping-points)
- Bus Timetables: [Bus Stops and Schedules](https://www.data.gov.uk/dataset/e100465a-9255-4ee0-b486-a02a17ba75fb/bus-stops-and-schedules)

#### Basemaps + Layers

- OpenStreetMap: [OpenStreetMap](https://www.openstreetmap.org/)
- Esri World Imagery: [Esri World Imagery](https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9)
- Stadia Alidade Smooth (Dark and Light): [Stadia Maps](https://stadiamaps.com/)
- Stadia Stamen Toner Labels: [Stadia Maps](https://stadiamaps.com/)

#### WMS Services

- Emission WMS Layers: [Air quality pollutant emission maps for the UK and Devolved Governments](https://uk-air.defra.gov.uk/data/wms-services#emission-maps)
  - These are used to display CO2, CO and NOx emission layers on maps.

To find out more about my experience working with WMS services, see [Working with WMS Services](./docs/wms-services.md).

### Primary Libraries & APIs

#### Leaflet

Leaflet (v1.9.4): [Leaflet](https://leafletjs.com/)

This is the latest stable version of Leaflet at the time of writing.

##### Leaflet Extensions / Plugins

- [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster): Clusters markers for improved performance and usability on maps with many markers.
- [Leaflet HeatCanvas](https://github.com/sunng87/heatcanvas): Adds heatmap layer support to Leaflet using HTML5 canvas.

#### OpenLayers

OpenLayers (v6.15.1): [OpenLayers](https://openlayers.org/)

An older version of OpenLayers is used here since the use of Node Package Manager (NPM) is not used in the module curriculum.
Version 6.15.1 is the latest version that does not require NPM for installation, and can instead use a simple script tag in the HTML.

##### OpenLayers Extensions / Plugins

- [ol-layerswitcher](https://github.com/walkermatt/ol-layerswitcher): Adds a layer switcher control to OpenLayers maps.

### Additional Imports

- Dev.css: [Dev.css](https://github.com/intergrav/dev.css)
