import { Client, FieldsetQueueSkillsType, MatchRound, FieldsetAudienceDisplay } from "vex-tm-client";
import { config } from 'dotenv-safe';
config();

const client = new Client({
  address: process.env.TM_HOST_ADDR,
  authorization: {
    client_id: process.env.API_CLIENT_ID,
    client_secret: process.env.API_CLIENT_SECRET,
    grant_type: "client_credentials",
    expiration_date: process.env.API_EXPIRATION_DATE,
  },
  clientAPIKey: process.env.API_CLIENT_API_KEY
});

const result = await client.connect();
if (!result.success) {
  console.error("Could not connect to TM instance", result);
}

const divisions = await client.getDivisions();
if (!divisions.success) {
  console.error("divisions", divisions);
}

console.log(divisions);

const division = divisions.data[0];

const teams = await division.getTeams();
if (!teams.success) {
  console.error("teams", teams);
}

console.log(teams);

const matches = await division.getMatches();
if (!matches.success) {
  console.error("matches", matches);
}

for (const match of matches.data) {
  console.log(match);
}

const rankings = await division.getRankings(MatchRound.Qualification);
if (!rankings.success) {
  console.error("rankings", rankings);
}

console.log(rankings);

const fieldsets = await client.getFieldsets();
if (!fieldsets.success) {
  console.error("fieldsets", fieldsets);
}

console.log(fieldsets);

const fieldset = fieldsets.data[0];
const fields = await fieldset.getFields();
if (!fields.success) {
  console.error("fields", fields);
}

console.log(fields.data);

const connection = await fieldset.connect();
if (!connection.success) {
  console.error("connection", connection);
}

fieldset.on("matchStarted", (event) => console.log(event));
fieldset.on("matchStopped", (event) => console.log(event));
fieldset.on("fieldActivated", (event) =>
  console.log(event)
);
fieldset.on("fieldMatchAssigned", (event) =>
  console.log(event)
);
fieldset.on("audienceDisplayChanged", (event) =>
  console.log(event)
);

// fieldset.on("matchStopped", async (event) => {
//   await fieldset.setAudienceDisplay(FieldsetAudienceDisplay.SkillsRankings);
// });

process.on("exit", () => {
  fieldset.disconnect();
});
