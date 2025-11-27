// Translation Table for passed parameters

const directions = {
  I: "Inbound",
  O: "Outbound",
  C: "Circular",
};

const dayTypes = {
  1: ["M", "T", "W", "Th", "F"],
  3: ["S"],
  4: ["Su"],
  5: ["BH"],
};

const dayTypeNames = {
  M: "Mon",
  T: "Tue",
  W: "Wed",
  Th: "Thu",
  F: "Fri",
  S: "Sat",
  Su: "Sun",
  BH: "Bank Hol",
};

// Get query parameters from URL
const urlParams = new URLSearchParams(window.location.search);
const route = urlParams.get("route");
const direction = urlParams.get("direction");
const variant = urlParams.get("variant");
const day = urlParams.get("day");

// If any of the parameters are missing, alert the user and redirect to the routes page
if (!route || !direction || !variant || !day) {
  alert("Missing required parameters. Redirecting to routes page.");
  window.location.href = "./routes.html";
}

// Display selected route information
document.getElementById("route-header-information").innerHTML = `
    <div style="display: flex; gap: 2rem;">
        <div>
            <span class="pill">${directions[direction]}</span>
            ${variant === "Standard Variant" ? "" : `<span class="pill variant">Variant ${variant}</span>`}
        </div>
        <div style="margin-left: auto;">
            ${["M", "T", "W", "Th", "F", "S", "Su", "BH"]
              .map((dayLabel) => {
                const isEnabled =
                  dayTypes[day] && dayTypes[day].includes(dayLabel);
                return `<span class="pill${isEnabled ? " enabled" : " disabled"}">${dayTypeNames[dayLabel]}</span>`;
              })
              .join("")}
        </div>
    </div>
`;

document.getElementById("route-heading").innerHTML = `
    <h2>Route ${route} Timetable</h2>
`;

// Fetch and display timetable data
fetch(`./datasets/timetables/processed_timetables/${route}_BUS_timetable.csv`)
  .then((response) => {
    if (!response.ok) {
      // Show a message to the user
      const timetableResultsDiv = document.getElementById("timetables");
      timetableResultsDiv.innerHTML = `
        <blockquote>
          <span><i class="fas fa-exclamation-triangle"></i> Timetable data not found for the specified route. Please try a different route.</span>
          <hr style="margin: 1rem 0;" />
          <p>
            The timetables dataset is very large and hard to work with so filtering both datasets to only include routes with timetables and vice versa
            hasn't been done for this project. This means that some routes may not have timetable data available and may not show up in the results.
          </p>
          <p>
            Data consistency improvements is an area of improvement that would be looked at with more development time.
          </p>

          <button onclick="window.location.href='./routes.html'" style="padding-bottom: 0.25rem;">Return to Routes Page</button>
        </blockquote>
      `;

      // Hide the loading indicator since data is loaded
      document.getElementById("loading-timetables").style.display = "none";

      throw new Error("Timetable data not found for the specified route.");
    }
    return response.text();
  })
  .then((data) => {
    // Parse CSV data

    const lines = data.split("\n");
    const headers = lines[0].split(",");

    // Filter rows based on direction and day

    // We are ignoring the variant for now since
    // it is not clear in the timetable data how variants are represented

    const isMonday = dayTypes[day] && dayTypes[day].includes("M");
    const isTuesday = dayTypes[day] && dayTypes[day].includes("T");
    const isWednesday = dayTypes[day] && dayTypes[day].includes("W");
    const isThursday = dayTypes[day] && dayTypes[day].includes("Th");
    const isFriday = dayTypes[day] && dayTypes[day].includes("F");
    const isSaturday = dayTypes[day] && dayTypes[day].includes("S");
    const isSunday = dayTypes[day] && dayTypes[day].includes("Su");
    const isBankHoliday = dayTypes[day] && dayTypes[day].includes("BH");

    const filteredRows = lines
      .slice(1)
      .map((line) => line.split(","))
      .filter(
        (row) =>
          row[headers.indexOf("route_direction")] === direction &&
          ((isMonday && row[headers.indexOf("operates_on_mondays")] == 1) ||
            (isTuesday && row[headers.indexOf("operates_on_tuesdays")] == 1) ||
            (isWednesday &&
              row[headers.indexOf("operates_on_wednesdays")] == 1) ||
            (isThursday &&
              row[headers.indexOf("operates_on_thursdays")] == 1) ||
            (isFriday && row[headers.indexOf("operates_on_fridays")] == 1) ||
            (isSaturday &&
              row[headers.indexOf("operates_on_saturdays")] == 1) ||
            (isSunday && row[headers.indexOf("operates_on_sundays")] == 1) ||
            (isBankHoliday && row[headers.indexOf("bank_holidays")] === "A")),
      );

    // Get a list of start and end points for each route run
    // These are identified by 'QO` and `QT` in the `record_identity` column
    // `QO` = start of route run
    // `QT` = end of route run

    const startPoints = filteredRows.filter(
      (row) => row[headers.indexOf("record_identity")] == "QO",
    );
    const endPoints = filteredRows.filter(
      (row) => row[headers.indexOf("record_identity")] == "QT",
    );

    // Join start and end points based on the `unique_journey_identifier` column
    const routeRuns = startPoints.map((startPoint) => {
      const endPoint = endPoints.find(
        (endPoint) =>
          endPoint[headers.indexOf("unique_journey_identifier")] ===
          startPoint[headers.indexOf("unique_journey_identifier")],
      );
      return {
        start: {
          stop_id: startPoint[headers.indexOf("location")],
          time: startPoint[headers.indexOf("published_departure_time")],
        },
        end: {
          stop_id: endPoint ? endPoint[headers.indexOf("location")] : "N/A",
          time: endPoint
            ? endPoint[headers.indexOf("published_arrival_time")]
            : "N/A",
        },
        direct_access: {
          unique_journey_identifier:
            startPoint[headers.indexOf("unique_journey_identifier")],
          route_direction: startPoint[headers.indexOf("route_direction")],
          operates_on_mondays:
            startPoint[headers.indexOf("operates_on_mondays")],
          operates_on_tuesdays:
            startPoint[headers.indexOf("operates_on_tuesdays")],
          operates_on_wednesdays:
            startPoint[headers.indexOf("operates_on_wednesdays")],
          operates_on_thursdays:
            startPoint[headers.indexOf("operates_on_thursdays")],
          operates_on_fridays:
            startPoint[headers.indexOf("operates_on_fridays")],
          operates_on_saturdays:
            startPoint[headers.indexOf("operates_on_saturdays")],
          operates_on_sundays:
            startPoint[headers.indexOf("operates_on_sundays")],
          bank_holidays: startPoint[headers.indexOf("bank_holidays")],
        },
      };
    });

    // Add stop names by fetching from stops dataset
    fetch(`./datasets/stops/stops.geojson`)
      .then((response) => response.json())
      .then((stopsData) => {
        var stopsMap = {};
        stopsData.features.forEach((feature) => {
          stopsMap[feature.properties.AtcoCode] = {
            stop_name: feature.properties.CommonName,
            street: feature.properties.Street,
            locality: feature.properties.LocalityName,
            parent_locality: feature.properties.ParentLocalityName,
            grandparent_locality: feature.properties.GrandParentLocalityName,
          };
        });

        // Update routeRuns with stop names
        routeRuns.forEach((run) => {
          if (stopsMap[run.start.stop_id]) {
            run.start.stop_name = stopsMap[run.start.stop_id].stop_name;
            run.start.street = stopsMap[run.start.stop_id].street;
            run.start.locality = stopsMap[run.start.stop_id].locality;
            run.start.parent_locality =
              stopsMap[run.start.stop_id].parent_locality;
            run.start.grandparent_locality =
              stopsMap[run.start.stop_id].grandparent_locality;
          } else {
            run.start.stop_name = "Unknown Stop";
            run.start.street = "";
            run.start.locality = "";
            run.start.parent_locality = "";
            run.start.grandparent_locality = "";
          }
          if (stopsMap[run.end.stop_id]) {
            run.end.stop_name = stopsMap[run.end.stop_id].stop_name;
            run.end.street = stopsMap[run.end.stop_id].street;
            run.end.locality = stopsMap[run.end.stop_id].locality;
            run.end.parent_locality = stopsMap[run.end.stop_id].parent_locality;
            run.end.grandparent_locality =
              stopsMap[run.end.stop_id].grandparent_locality;
          } else {
            run.end.stop_name = "Unknown Stop";
            run.end.street = "";
            run.end.locality = "";
            run.end.parent_locality = "";
            run.end.grandparent_locality = "";
          }
        });
      });

    // Try and find unknown stops using the NaPTAN stops dataset
    fetch(`./datasets/naptan_stops.csv`)
      .then((response) => response.text())
      .then((data) => {
        const lines = data.split("\n");
        const headers = lines[0].split(",");

        lines.slice(1).forEach((line) => {
          const row = line.split(",");
          const atcoCode = row[headers.indexOf("ATCOCode")];
          const commonName = row[headers.indexOf("CommonName")];
          const street = row[headers.indexOf("Street")];
          const locality = row[headers.indexOf("LocalityName")];
          const parentLocality = row[headers.indexOf("ParentLocalityName")];
          const grandparentLocality =
            row[headers.indexOf("GrandParentLocalityName")];
          // Update stopsData features if stop name is "Unknown Stop"
          routeRuns.forEach((run) => {
            if (
              run.start.stop_name === "Unknown Stop" &&
              run.start.stop_id === atcoCode
            ) {
              run.start.stop_name = commonName || "Unknown Stop";
              run.start.street = street || "";
              run.start.locality = locality || "";
              run.start.parent_locality = parentLocality || "";
              run.start.grandparent_locality = grandparentLocality || "";
            }
            if (
              run.end.stop_name === "Unknown Stop" &&
              run.end.stop_id === atcoCode
            ) {
              run.end.stop_name = commonName || "Unknown Stop";
              run.end.street = street || "";
              run.end.locality = locality || "";
              run.end.parent_locality = parentLocality || "";
              run.end.grandparent_locality = grandparentLocality || "";
            }
          });
        });

        // Create a list of unique start and end points

        const uniquePoints = [];
        routeRuns.forEach((run) => {
          const point = {
            start: {
              stop_id: run.start.stop_id,
              stop_name: run.start.stop_name,
              street: run.start.street,
              locality: run.start.locality,
              parent_locality: run.start.parent_locality,
              grandparent_locality: run.start.grandparent_locality,
            },
            end: {
              stop_id: run.end.stop_id,
              stop_name: run.end.stop_name,
              street: run.end.street,
              locality: run.end.locality,
              parent_locality: run.end.parent_locality,
              grandparent_locality: run.end.grandparent_locality,
            },
          };
          // Check if this point is already in the uniquePoints array
          const exists = uniquePoints.some(
            (p) =>
              p.start.stop_id === point.start.stop_id &&
              p.end.stop_id === point.end.stop_id,
          );
          if (!exists) {
            uniquePoints.push(point);
          }
        });

        // For each unique start and end point, display the information
        // This should be a heading of "Start Stop Name (Start Stop ID) to End Stop Name (End Stop ID)"
        // Then a list of route runs that start and end at those points, with their times

        const timetableResultsDiv = document.getElementById("timetables");

        uniquePoints.forEach((point) => {
          // Create a heading for this start and end point
          const heading = document.createElement("h3");
          heading.innerHTML = `<i class="fa fa-map-marker" aria-hidden="true"></i> ${point.start.stop_name} <i class="fa fa-arrow-right" aria-hidden="true"></i> <i class="fa fa-map-marker" aria-hidden="true"></i> ${point.end.stop_name}`;
          heading.style.marginTop = "2rem";
          timetableResultsDiv.appendChild(heading);

          // Add header for stop information
          const stopInfoHeader = document.createElement("h4");
          stopInfoHeader.textContent = "Stop Information:";
          stopInfoHeader.style.marginTop = "1rem";
          timetableResultsDiv.appendChild(stopInfoHeader);

          // Add additional stop information
          const infoContainer = document.createElement("div");
          infoContainer.style.display = "grid";
          infoContainer.style.gridTemplateColumns = "1fr 1fr";
          infoContainer.style.gap = "2rem";
          infoContainer.style.alignItems = "start";

          const startInfo = document.createElement("div");
          startInfo.style.width = "100%";
          startInfo.style.borderLeft = "3px solid #ccc";
          startInfo.style.paddingLeft = "1rem";
          startInfo.innerHTML = `<b>Start Stop ID:</b> ${point.start.stop_id}<br>
                     <b>Street:</b> ${point.start.street}<br>
                     <b>Locality:</b> ${point.start.locality}<br>
                     <b>Parent Locality:</b> ${point.start.parent_locality}<br>
                     <b>Grandparent Locality:</b> ${point.start.grandparent_locality}`;

          const endInfo = document.createElement("div");
          endInfo.style.width = "100%";
          endInfo.style.borderLeft = "3px solid #ccc";
          endInfo.style.paddingLeft = "1rem";
          endInfo.innerHTML = `<b>End Stop ID:</b> ${point.end.stop_id}<br>
                       <b>Street:</b> ${point.end.street}<br>
                       <b>Locality:</b> ${point.end.locality}<br>
                       <b>Parent Locality:</b> ${point.end.parent_locality}<br>
                       <b>Grandparent Locality:</b> ${point.end.grandparent_locality}`;

          infoContainer.appendChild(startInfo);
          infoContainer.appendChild(endInfo);
          timetableResultsDiv.appendChild(infoContainer);

          // Add header for route runs
          const runsHeader = document.createElement("h4");
          runsHeader.textContent = "Route Runs:";
          runsHeader.style.marginTop = "1rem";
          timetableResultsDiv.appendChild(runsHeader);

          // Create a list of route runs for this start and end point
          const runs = routeRuns.filter(
            (run) =>
              run.start.stop_id === point.start.stop_id &&
              run.end.stop_id === point.end.stop_id,
          );

          // Split runs into two columns
          const mid = Math.ceil(runs.length / 2);
          const leftRuns = runs.slice(0, mid);
          const rightRuns = runs.slice(mid);

          // Create containers for columns
          const columnsContainer = document.createElement("div");
          columnsContainer.style.display = "grid";
          columnsContainer.style.gridTemplateColumns = "1fr 1fr";
          columnsContainer.style.gap = "2rem";

          const leftCol = document.createElement("ul");
          leftCol.style.margin = "0";
          leftCol.style.padding = "0 0 0 1rem";
          leftCol.style.listStyle = "none";
          leftCol.style.width = "100%";
          leftCol.style.borderLeft = "3px solid #ccc"; // Add left border

          leftRuns.forEach((run) => {
            const queryParams = new URLSearchParams({
              route: route,
              unique_journey_identifier:
                run.direct_access.unique_journey_identifier,
              route_direction: run.direct_access.route_direction,
              operates_on_mondays: run.direct_access.operates_on_mondays,
              operates_on_tuesdays: run.direct_access.operates_on_tuesdays,
              operates_on_wednesdays: run.direct_access.operates_on_wednesdays,
              operates_on_thursdays: run.direct_access.operates_on_thursdays,
              operates_on_fridays: run.direct_access.operates_on_fridays,
              operates_on_saturdays: run.direct_access.operates_on_saturdays,
              operates_on_sundays: run.direct_access.operates_on_sundays,
              bank_holidays: run.direct_access.bank_holidays,
            });

            const li = document.createElement("li");
            li.innerHTML = `<a href="./visualise.html?${queryParams.toString()}">${run.start.time} <i class="fa fa-arrow-right" aria-hidden="true"></i> ${run.end.time}</a>`;
            leftCol.appendChild(li);
          });

          const rightCol = document.createElement("ul");
          rightCol.style.margin = "0";
          rightCol.style.padding = "0 0 0 1rem";
          rightCol.style.listStyle = "none";
          rightCol.style.width = "100%";
          rightCol.style.borderLeft = "3px solid #ccc"; // Add left border

          rightRuns.forEach((run) => {
            const queryParams = new URLSearchParams({
              route: route,
              unique_journey_identifier:
                run.direct_access.unique_journey_identifier,
              route_direction: run.direct_access.route_direction,
              operates_on_mondays: run.direct_access.operates_on_mondays,
              operates_on_tuesdays: run.direct_access.operates_on_tuesdays,
              operates_on_wednesdays: run.direct_access.operates_on_wednesdays,
              operates_on_thursdays: run.direct_access.operates_on_thursdays,
              operates_on_fridays: run.direct_access.operates_on_fridays,
              operates_on_saturdays: run.direct_access.operates_on_saturdays,
              operates_on_sundays: run.direct_access.operates_on_sundays,
              bank_holidays: run.direct_access.bank_holidays,
            });

            const li = document.createElement("li");
            li.innerHTML = `<a href="./visualise.html?${queryParams.toString()}">${run.start.time} <i class="fa fa-arrow-right" aria-hidden="true"></i> ${run.end.time}</a>`;
            rightCol.appendChild(li);
          });

          columnsContainer.appendChild(leftCol);
          columnsContainer.appendChild(rightCol);

          timetableResultsDiv.appendChild(columnsContainer);
        });

        // Hide the loading indicator since data is loaded
        document.getElementById("loading-timetables").style.display = "none";
      });
  });
