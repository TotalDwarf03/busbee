// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);

const route = urlParams.get("route");
const uniqueJourneyIdentifier = urlParams.get("unique_journey_identifier");
const routeDirection = urlParams.get("route_direction");
const operatesOnMondays = urlParams.get("operates_on_mondays");
const operatesOnTuesdays = urlParams.get("operates_on_tuesdays");
const operatesOnWednesdays = urlParams.get("operates_on_wednesdays");
const operatesOnThursdays = urlParams.get("operates_on_thursdays");
const operatesOnFridays = urlParams.get("operates_on_fridays");
const operatesOnSaturdays = urlParams.get("operates_on_saturdays");
const operatesOnSundays = urlParams.get("operates_on_sundays");
const bankHolidays = urlParams.get("bank_holidays");
const startTime = urlParams.get("start_time");
const endTime = urlParams.get("end_time");
const startStop = urlParams.get("start_stop");
const endStop = urlParams.get("end_stop");
const serviceID = urlParams.get("ServiceID");

// Convert passed times to Date objects
const startTimeDate = new Date(`1970-01-01T${startTime}`);
const endTimeDate = new Date(`1970-01-01T${endTime}`);

// If any of the query parameters are missing, alert the user and redirect back to the routes page
if (
  !route ||
  !uniqueJourneyIdentifier ||
  !routeDirection ||
  !operatesOnMondays ||
  !operatesOnTuesdays ||
  !operatesOnWednesdays ||
  !operatesOnThursdays ||
  !operatesOnFridays ||
  !operatesOnSaturdays ||
  !operatesOnSundays ||
  !bankHolidays ||
  !startTime ||
  !endTime ||
  !startStop ||
  !endStop ||
  !serviceID
) {
  alert("Missing required query parameters. Returning to routes page.");
  window.location.href = "./routes.html";
}

// Map route direction codes to human-readable strings
const directions = {
  I: "Inbound",
  O: "Outbound",
  C: "Circular",
};

// Convert operatesOn values to a list of days
// the values also needs to be converted to booleans
const operatesOnDays = {
  Mon: operatesOnMondays == 1,
  Tue: operatesOnTuesdays == 1,
  Wed: operatesOnWednesdays == 1,
  Thu: operatesOnThursdays == 1,
  Fri: operatesOnFridays == 1,
  Sat: operatesOnSaturdays == 1,
  Sun: operatesOnSundays == 1,
  "Bank Hol": bankHolidays === "A",
};

// Display selected parameters for confirmation
document.getElementById("route-header-information").innerHTML = `
    <div style="display: flex; gap: 2rem;">
        <div>
            <span class="pill">Route ${route}</span>
            <span class="pill">${directions[routeDirection]}</span>
        </div>
        <div style="margin-left: auto;">
            ${Object.entries(operatesOnDays)
              .map(([day, isEnabled]) => {
                return `<span class="pill${isEnabled ? " enabled" : " disabled"}">${day}</span>`;
              })
              .join("")}
        </div>
    </div>
`;

document.getElementById("route-heading").innerHTML = `
    <h2>${startStop} (${startTime.substring(0, 5)}) <i class="fas fa-arrow-right" aria-hidden="true"></i> ${endStop} (${endTime.substring(0, 5)})</h2>
`;

fetch(`./datasets/timetables/processed_timetables/${route}_BUS_timetable.csv`)
  .then((response) => response.text())
  .then((data) => {
    // Parse CSV data
    const lines = data.split("\n");
    const headers = lines[0].split(",");

    // Find the row for the selected journey
    const journeyData = lines
      .slice(1)
      .map((line) => line.split(","))
      .filter((row) => {
        // Check journey and direction
        if (
          row[headers.indexOf("unique_journey_identifier")] !==
            uniqueJourneyIdentifier ||
          row[headers.indexOf("route_direction")] !== routeDirection
        ) {
          return false;
        }

        // Check operates on any selected day or bank holiday
        if (
          row[headers.indexOf("operates_on_mondays")] != operatesOnMondays ||
          row[headers.indexOf("operates_on_tuesdays")] != operatesOnTuesdays ||
          row[headers.indexOf("operates_on_wednesdays")] !=
            operatesOnWednesdays ||
          row[headers.indexOf("operates_on_thursdays")] !=
            operatesOnThursdays ||
          row[headers.indexOf("operates_on_fridays")] != operatesOnFridays ||
          row[headers.indexOf("operates_on_saturdays")] !=
            operatesOnSaturdays ||
          row[headers.indexOf("operates_on_sundays")] != operatesOnSundays ||
          row[headers.indexOf("bank_holidays")] !== bankHolidays
        ) {
          return false;
        }

        // Convert times to Date objects for comparison
        const arrivalTimeStr = row[headers.indexOf("published_arrival_time")];
        const departureTimeStr =
          row[headers.indexOf("published_departure_time")];

        // Determine which time to use based on record identity
        // QO = departure time (for origin records)
        // QT = arrival time (for terminus records)
        // For other records, use arrival time if available, otherwise departure time
        let timeStr;

        if (row[headers.indexOf("record_identity")] === "QO") {
          timeStr = departureTimeStr;
        } else if (row[headers.indexOf("record_identity")] === "QT") {
          timeStr = arrivalTimeStr;
        } else {
          timeStr = arrivalTimeStr || departureTimeStr;
        }

        if (!timeStr) return false;

        const recordTime = new Date(`1970-01-01T${timeStr}`);

        return recordTime >= startTimeDate && recordTime <= endTimeDate;
      });

    if (!journeyData || journeyData.length === 0) {
      alert("Selected journey not found.");
      return;
    }

    // Update the page with journey data
    document.getElementById("route-description").innerHTML = `
      <h3>Journey Summary</h3>
      <p>The selected journey makes <strong>${journeyData.length} stops</strong> between <strong>${startStop}</strong> and <strong>${endStop}</strong>, starting at <strong>${startTime.substring(0, 5)}</strong> and ending at <strong>${endTime.substring(0, 5)}</strong>.</p>
      <div id="journey-summary-inputs">
        <p>Click the button below to visualise the journey on the map:</p>
        <div style="width: 100%; text-align: center;">
          <button id="visualise-journey-button">
            <i class="fas fa-play-circle" aria-hidden="true"></i> Load Visualisation
          </button>
        </div>
      </div>
      `;

    document
      .getElementById("visualise-journey-button")
      .addEventListener("click", () => {
        // Run the visualisation with the journey data
        visualiseJourneyOnMap(journeyData, headers, serviceID);
      });
  });
