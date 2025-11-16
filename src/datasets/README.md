# Datasets

This directory contains the datasets used in this project.
This file documents the datasets included here, what further processing had to be done for the project, and any other relevant information.

## Included Datasets

### GM Bus Routes

**Source:** [GM Bus Routes Dataset](https://www.data.gov.uk/dataset/136be10f-1667-474f-b52c-92bb24486739/bus-routes-1-25-000-scale-map-data)

**Repository Path:** [`./routes`](./routes/)

#### Route Data Overview

The route dataset includes around 3,400 different records, each representing a specific bus route in Greater Manchester. Each record contains the following key fields:

- `ServiceID`: A unique identifier for the bus service.
- `totaldist`: The total distance of the bus route in meters.

Alongside these attributes, each record includes a PolyLine geometry that outlines the precise path taken by the bus route.

The `ServiceID` field is particularly important as it allows for the correlation of route data with other datasets, such as bus stopping points and schedules.

The ID is composed of the following components:

service number + "_" + Suffix + "_" + Direction + "_" + Day + "_" + Variation

Where:

| Component      | Description                                               |
| -------------- | --------------------------------------------------------- |
| service number | The bus service number (i.e., 100 or X50)                 |
| Suffix         | The bus service number suffix (if any)                    |
| Direction      | I = inbound, O = outbound, C = circular                   |
| Day            | 1 = Weekdays, 3 = Saturday, 4 = Sunday, 5 = Bank Holidays |
| Variation      | A letter indicating route variation (if any)              |

Each of these components marries up with the timetable dataset, allowing us to link routes with their respective schedules and stopping points.

The dataset is offered in a range of formats, including shapefile, KML and TAB. For this project, we have used the shapefile format due to its compatibility with QGIS. The Shapefile uses the British National Grid (EPSG:27700) coordinate reference system.

The authors of this dataset provide some addition documentation for the dataset which can be found in the repository: [Supporting Information](./routes/BusRoutEMapsSupportingInfo.pdf).

#### Route Data Processing

TODO: Describe any data processing steps taken to prepare these datasets for use in the project.

### GM Bus Stopping Points

**Source:** [GM Bus Stopping Points Dataset](https://www.data.gov.uk/dataset/05252e3a-acdf-428b-9314-80ac7b17ab76/bus-stopping-points)

**Repository Path:** [`./stops`](./stops/)

#### Stops Data Overview

The bus stopping points dataset contains around 21,000 records, each representing a specific bus stop within Greater Manchester. Some of the key attributes included in each record are:

- `ATCOCode`: A unique identifier for each bus stop. This can be used to link bus stops with other datasets, such as bus timetables.
- `CommonName`: The common name of the bus stop.
- `Lattitude` and `Longitude`: The geographical coordinates of the bus stop. This can be used to make a point geometry for mapping purposes.
- `Status`: The operational status of the bus stop (i.e. `act` = Active, `del` = Deleted/Inactive).

The dataset is provided in CSV format, and uses the WGS 84 (EPSG:4326) coordinate reference system for the latitude and longitude fields.

#### Stops Data Processing

TODO: Describe any data processing steps taken to prepare these datasets for use in the project.

### Bus Stops and Schedules

**Source:** [Bus Stops and Schedules Dataset](https://www.data.gov.uk/dataset/e100465a-9255-4ee0-b486-a02a17ba75fb/bus-stops-and-schedules)

**Repository Path:** [`./timetables`](./timetables/)

#### TimeTables Data Overview

The timetables dataset contains various `.CIF` files that provide detailed information about bus schedules and stopping points. The ATCO CIF format is a standard format used in the UK for representing public transport schedules.

Each CIF file represents a different bus service (i.e. `100.CIF` for service 100). The key components of the CIF files include:

- **Service Information:** Details about the bus service, including the service number, route variations, and operational days.
- **Stopping Points:** A list of bus stops associated with the service, identified by their ATCO codes.
- **Timings:** Scheduled arrival and departure times for each bus stop along the route.

**Note:** For convenience, I have not included the raw CIF files in this repository. Instead, I have converted the relevant data into CSV format and included those files instead. More information about this conversion can be found in the processing section below.

#### TimeTables Data Processing

TODO: Describe any data processing steps taken to prepare these datasets for use in the project.
