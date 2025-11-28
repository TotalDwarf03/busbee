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

##### Add Service Column

To facilitate easier linking between datasets, a new column named `Service` was added to the route dataset. This column extracts just the service number from the `ServiceID` field.

This was accomplished using the following steps in QGIS:

1. Load the `OpenData_BusRoutes_polyline.shp` into QGIS.
2. Open the Attribute Table for the layer.
3. Click on the Field Calculator button to open the Field Calculator dialog.
4. In the Field Calculator dialog:
   1. Set Output field name to `Service`.
   2. Set Output field type to `Text (string)`.
   3. Set Output field length to `10` (This is more than enough to accommodate all service numbers).
   4. Then, in the Expression box, enter the following expression to extract the service number:

      ```sql
      left("ServiceID", strpos("ServiceID", '_') - 1)
      ```

   This expression takes the substring from the start of the `ServiceID` up to (but not including) the first underscore (`_`), effectively isolating the service number.

5. Click OK to apply the changes and add the new `Service` column to the dataset.
6. Finally, export the modified layer to a new GeoJSON file.

The new `Service` attribute allows us to easily load the correct timetable for each route in the frontend application.

##### Reprojection

The original shapefile dataset uses the British National Grid (EPSG:27700) coordinate reference system. For consistency with other datasets and to facilitate web mapping applications, the dataset was reprojected to WGS 84 (EPSG:4326).

##### Add Points Along Route

To allow the website to visualise bus movement along the routes, a series of points were generated along each bus route at regular intervals. These points serve as waypoints for animating bus movement on the map.

To do this in QGIS, the following steps were taken:

1. Load the reprojected bus routes layer into QGIS.
2. Use the "Points Along Geometry" tool found in the Processing Toolbox under Vector Geometry.
3. In the "Points Along Geometry" dialog:
   1. Set the Input layer to the bus routes layer.
   2. Set the Distance between points to `0.001` degrees. I believe this is accurate enough for visualisation purposes without creating an excessive number of points.
   3. Choose an appropriate output location and format (e.g., GeoJSON).
4. Click Run to generate the points along each bus route.
5. The resulting layer contains points along each bus route, which can be used for visualising bus movement.

This layer was then exported to a GeoJSON file for use in the frontend application (`./routes/route-points.geojson`).

**Note:** Unfortunately, this dataset is never actually used in the frontend application - nor has it been added to source control - as I was unable to complete the final step of ensuring that the points were in the correct order along each route (see below). However, I have documented the intended process for completeness.

##### Fixing Point Order to Match Route (Not Completed)

**Note:** This step has not been completed since the effort is not worth it for the coursework. However, I am documenting it here for completeness. The following process outlines how I _would_ have ensured that the points along each bus route are in the correct order for animating bus movement - if I had the time to implement it.

To ensure that the points generated along each bus route are in the correct order for animating bus movement, the points would be sorted based on their distance along the route.

This requires creating a line geometry for each bus timetable route and then calculating the distance from the start of the route to each point. The points can then be ordered based on this distance.

Since the bus timetable would provide the sequence of stops, we can use this information to ensure that the points are ordered correctly.

Once the timetable line geometries are created, the following steps would be taken in QGIS:

1. Load both the bus timetable lines and the generated points layers into QGIS.
2. Open the attribute table for the points layer and start the Field Calculator.
3. Create a new field named `distance_along_route`.
4. Use the following expression to calculate the distance from the start of the route to each point:

   ```sql
   line_locate_point(geometry:=geometry(get_feature('<timetable_lines_layer>', 'ServiceID', "ServiceID")), point:=$geometry)
   ```

   Replace `'<timetable_lines_layer>'` with the actual name of the bus timetable lines layer in QGIS.

5. Click OK to apply the changes and calculate the distances.
6. Next, use "add autoincremental field" tool to create an `order` field based on the `distance_along_route` field (This is found in Processing Toolbox > Vector Geometry).
7. In the "Add autoincremental field" dialog:
   1. Set the Input layer to the points layer.
   2. Set the Sort by field to `distance_along_route`.
   3. Set the Output field name to `order`.
8. Click Run to generate the ordered field.
9. Finally, export the modified points layer to a new GeoJSON file.

This file would then get loaded into the frontend application to visualise bus movement along the routes in the correct order.

**On an aside:** It is quite disappointing that the route lines that Transport for Greater Manchester provide are not ordered correctly to match the bus timetables. This would have made this process much easier and I would've been able to complete it in the time available _sigh_.

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

##### Remove Inactive Stops

To ensure that only active bus stops are included in the dataset, any records with a `Status` of `del` (Deleted/Inactive) were removed. This was accomplished using the following steps in QGIS:

1. Load the `TfGMStoppingPoints.csv` into QGIS.
2. Filter the layer to show only active stops by applying the following filter expression:

   ```sql
   "Status" = 'act'
   ```

3. Once the filter is applied, export the filtered layer to a new GeoJSON file.

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

##### CIF to CSV Conversion

The timetable data was originally provided in CIF format, which is not easily readable or usable for analysis. To make the data more accessible, the CIF files were converted to CSV format using a custom Python script.

The script can be found on GitHub at the following link: [CIF to CSV Converter](https://github.com/TotalDwarf03/CIF-timetable-reader).

The conversion process involved the following steps:

1. Read in each CIF file.
2. Parse the relevant information, including service details, stopping points, and timings.
3. Write the parsed data to a CSV file, with appropriate headers for each column.
4. Save the resulting CSV files, prefixing each file with the service number (e.g., `100_timetable.csv` for service 100).

During the conversion, some additional logic was applied to filter the data:

- **Filter out inactive timetables:** Only save timetables with an end date of 2099-12-31, indicating they are still active.

For some of the routes, this halved the number of records in the resulting CSV files, making them more manageable for analysis.

### NaPTAN Dataset

**Source:** [NaPTAN Dataset](https://beta-naptan.dft.gov.uk/)

**Repository Path:** [`naptan_stops.csv`](./naptan_stops.csv)

#### NaPTAN Data Overview

The NaPTAN (National Public Transport Access Nodes) dataset provides a comprehensive list of public transport access points across the UK, including bus stops, train stations, and other transport nodes. The dataset includes various attributes for each access point, such as:

- `ATCOCode`: A unique identifier for each bus stop, which can be used to link with other datasets.
- `CommonName`: The common name of the bus stop.
- `Latitude` and `Longitude`: The geographical coordinates of the bus stop.
- `Status`: The operational status of the bus stop (i.e. `act` = Active, `del` = Deleted/Inactive).

The dataset is provided in CSV format and uses the WGS 84 (EPSG:4326) coordinate reference system for the latitude and longitude fields.

This dataset is used within the project to supplement the [GM Bus Stopping Points](#gm-bus-stopping-points) dataset, providing information about stops that are not included in the TfGM dataset.
The TfGM dataset focuses specifically on Greater Manchester, while the NaPTAN dataset covers the entire UK.
