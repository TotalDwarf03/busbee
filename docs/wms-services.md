# Working with WMS Services

Alongside locally kept spatial data, Busbee also makes use of Web Map Services (WMS) to provide map layers.

In the project, WMS services are used to display Pollution Data across the UK, relating to road transport emissions.

As part of this process, and its use in the project, a key part has been to identify the different layers offered by the WMS service, and how to display them in Busbee.

The WMS servers used in this project can be found at the following URL:

- [Air quality pollutant emission maps for the UK and Devolved Governments](https://uk-air.defra.gov.uk/data/wms-services#emission-maps)

## QGIS to Browse Layers

In order to fully explore each WMS service, QGIS has been used to connect to the WMS service and browse the layers available.

This has allowed for easy visualisation of the different layers, and to identify which layers are most relevant to the project.

QGIS has also helped me identify key aspects of the WMS service, such as the IDs for each layer and a URL to get legend images for each layer.

## Verifying the Data

Fortunately, the WMS services used in the project are commonly used services. This has allowed me to cross-reference the data displayed in Busbee with other GIS tools, firstly QGIS, and then an online GIS viewer, provided by the serivice provider ([NAEI Emissions App](https://naei.energysecurity.gov.uk/emissionsapp/)).

This has helped verify that the data displayed in Busbee is accurate and corresponds to the data provided by the WMS service.
