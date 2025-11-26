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
  !bankHolidays
) {
  alert("Missing required query parameters. Returning to routes page.");
  window.location.href = "./routes.html";
}

// TODO: Load the timetable data using the above parameters
// TODO: Display the timetable data on the page
// TODO: Visualise the route on the map using Leaflet and OpenLayers
