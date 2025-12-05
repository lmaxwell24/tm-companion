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
  await fetch(sendLocation, {method : "POST"});
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

const divisions = await client.getDivisions();
const division = divisions.data[0]

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
const field_map = {
  1 : process.env.COMPANION_FIELD_1_LOC,
  2 : process.env.COMPANION_FIELD_2_LOC,
  3 : process.env.COMPANION_FIELD_3_LOC
};
let current_field = 0;
let current_match =
    {division : 1, session : 1, round : "QUAL", match : 0, instance : 1};
fieldset.on("fieldActivated", async (event) => {
  console.log(event);
  await sendCompanionEvent(process.env.COMPANION_FIELD_ACTIVATION_LOC)
  current_field = event.fieldID;
  await sendCompanionEvent(field_map[event.fieldID])
  // if (event.fieldID == 1) {
  //   await sendCompanionEvent(process.env.COMPANION_FIELD_1_LOC)
  // }
  // else if (event.fieldID == 2) {
  //   await sendCompanionEvent(process.env.COMPANION_FIELD_2_LOC)
  // }
  // else if (event.fieldID == 3) {
  //   await sendCompanionEvent(process.env.COMPANION_FIELD_3_LOC)
  // }
});

fieldset.on("fieldMatchAssigned", async (event) => {
  console.log(event)
  current_match = event.match
});
fieldset.on("audienceDisplayChanged", async (event) => {
  console.log(event);
  if (event.display === "IN_MATCH") {
    await sendCompanionEvent(process.env.COMPANION_IN_MATCH_LOC);
  } else if (event.display === "INTRO") {
    await sendCompanionEvent(field_map[event.fieldID])
  } else if (event.display === "RESULTS") {
    let results = await division.getMatches();
    console.log(results)
    for (const result of results.data) {
      console.log(result)
    }
    console.log(current_match)
    let current_match_data =results.data.filter(
        (a) => a.matchInfo.matchTuple.round == current_match.round &&
               a.matchInfo.matchTuple.match == current_match.match)[0]
    console.log(current_match_data)
    let winner = current_match_data.winningAlliance
    console.log(winner)
    if(winner == 1){
      await sendCompanionEvent(process.env.COMPANION_RED_WIN);
    } else if (winner == 2){
      await sendCompanionEvent(process.env.COMPANION_BLUE_WIN);
    }else if (winner == 0){
      await sendCompanionEvent(process.env.COMPANION_TIE_WIN);
    }
  }
});

process.on("exit", () => { fieldset.disconnect(); });
