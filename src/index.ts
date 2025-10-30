import {config} from 'dotenv-safe';
import {
  Client,
  FieldsetAudienceDisplay,
  FieldsetQueueSkillsType,
  MatchRound
} from "vex-tm-client";

config();

const sendCompanionEvent =
    async (loc: string) => {
  console.log(loc)
  let sendLocation = `${process.env.COMPANION_ADDR}/api/location/${loc}/press`;
  console.log(sendLocation);
  await fetch(sendLocation,
              {method : "POST"});
}

const client = new Client({
  address : process.env.TM_HOST_ADDR,
  authorization : {
    client_id : process.env.API_CLIENT_ID,
    client_secret : process.env.API_CLIENT_SECRET,
    grant_type : "client_credentials",
    expiration_date : process.env.API_EXPIRATION_DATE,
  },
  clientAPIKey : process.env.API_CLIENT_API_KEY
});

const result = await client.connect();
if (!result.success) {
  console.error("Could not connect to TM instance", result);
}

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

fieldset.on("matchStarted", async (event) => {
  console.log(event);
  await sendCompanionEvent(process.env.COMPANION_MATCH_START_LOC)
});
fieldset.on("matchStopped", async (event) => {
  console.log(event);
  await sendCompanionEvent(process.env.COMPANION_MATCH_END_LOC)
});
fieldset.on("fieldActivated", async (event) => {
  console.log(event);
  await sendCompanionEvent(process.env.COMPANION_FIELD_ACTIVATION_LOC)
});
fieldset.on("fieldMatchAssigned", async (event) => console.log(event));
fieldset.on("audienceDisplayChanged", async (event) => {
  console.log(event);
  if (event.display === "IN_MATCH") {
    await sendCompanionEvent(process.env.COMPANION_IN_MATCH_LOC);
  }
});

// fieldset.on("matchStopped", async (event) => {
//   await fieldset.setAudienceDisplay(FieldsetAudienceDisplay.SkillsRankings);
// });

process.on("exit", () => { fieldset.disconnect(); });
