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
  !endTime
) {
  alert("Missing required query parameters. Returning to routes page.");
  window.location.href = "./routes.html";
}

// TODO: Load the timetable data using the above parameters
// TODO: Display the timetable data on the page
// TODO: Visualise the route on the map using Leaflet and OpenLayers

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
      .filter(
        (row) =>
          row[headers.indexOf("unique_journey_identifier")] ===
            uniqueJourneyIdentifier &&
          row[headers.indexOf("route_direction")] === routeDirection &&
          (row[headers.indexOf("operates_on_mondays")] === operatesOnMondays ||
            row[headers.indexOf("operates_on_tuesdays")] ===
              operatesOnTuesdays ||
            row[headers.indexOf("operates_on_wednesdays")] ===
              operatesOnWednesdays ||
            row[headers.indexOf("operates_on_thursdays")] ===
              operatesOnThursdays ||
            row[headers.indexOf("operates_on_fridays")] === operatesOnFridays ||
            row[headers.indexOf("operates_on_saturdays")] ===
              operatesOnSaturdays ||
            row[headers.indexOf("operates_on_sundays")] === operatesOnSundays ||
            row[headers.indexOf("bank_holidays")] === bankHolidays), // TODO: Filter by start and end time
      );

    if (!journeyData || journeyData.length === 0) {
      alert("Selected journey not found.");
      return;
    }

    console.log("Journey Data:", journeyData);
  });
