#! /usr/bin/env node

// This script populates some test data for the development stage
// Invoke with LCI command: - e.g.: node populatedb databaseurl
// databaseurl = "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"

// Get arguments passed on command line - in this case the database url
const userArgs = process.argv.slice(2);

const Account = require("../models/accountModel");
const Dogami = require("../models/dogamiModel");

// used to link data correctly
const accounts = [];
const dogamiArray = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");

  // delete collections if they exist
  await deleteCollection("accounts");
  await deleteCollection("dogami");

  await createDogami();
  await createAccounts();

  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function deleteCollection(collectionName) {
  const collections = await mongoose.connection.db
    .listCollections({ name: collectionName })
    .toArray();
  if (collections.length > 0) {
    // Drop the collection
    await mongoose.connection.db.dropCollection(collectionName);
    console.log(`Collection '${collectionName}' deleted successfully.`);
  }
}

async function createDogami() {
  console.log("Adding dogami");
  await Promise.all([
    dogamiCreate(0, "3896", "Henry", "Labrador"),
    dogamiCreate(1, "1576", "Dash", "Shiba Inu"),
    dogamiCreate(2, "8362", "Augie", "Welsh Corgi"),
  ]);
}

async function dogamiCreate(index, dogamiId, name, breed) {
  const dogami = new Dogami({
    index: index,
    dogami_id: dogamiId,
    name: name,
    breed: breed,
  });
  await dogami.save();
  dogamiArray[index] = dogami;
}

async function createAccounts() {
  console.log("Adding accounts");
  // works with password "123"
  await Promise.all([
    accountCreate(
      0,
      "glen", // works with password "123"
      "f929fa38ea0de15e767c87420c0c912bc5d0c99b6df071610d64f2cd55f95b18",
      "d882f18e672b6fd138156ec9d159d892cdd7ccecf7d55da2703b48b7f8a4dd2a152ff5c6dba841de91ee1303ddd4ec933a5392c2ca1b55f9250d6751d74c0883",
      true,
      [dogamiArray[0], dogamiArray[1]]
    ),
    accountCreate(
      1,
      "john", // works with password "456"
      "fd41e1e4105f9893caac816211e33c177ebe13df8aa30be25f55a97ca2363261",
      "32f3f57672e8be7df8842373820a1aa9196ca0c29ac28479dbe53857132ffb721065958495683ca26831832dd1673ef889b84422538eb48086c6a0235d07a92b",
      false,
      [dogamiArray[2]]
    ),
  ]);
}

// We pass the index to the ...Create functions so that, for example,
// condition[0] will always be the same condition, regardless of the order
// in which the elements of promise.all's argument complete.
async function accountCreate(
  index,
  username,
  salt,
  hash,
  admin,
  ownedDogArray
) {
  const dateNow = new Date();
  const account = new Account({
    index: index,
    username: username,
    date_registered: dateNow,
    salt: salt,
    hash: hash,
    admin: admin,
    owned_dogs: ownedDogArray,
  });
  await account.save();
  accounts[index] = account;
}

/*

async function createDoses() {
  console.log("Adding doses");
  await Promise.all([doseCreate(0, "08:00 am", 1)]);
  await Promise.all([doseCreate(1, "10:00 am", 1)]);
  await Promise.all([doseCreate(2, "13:00 pm", 1)]);
  await Promise.all([doseCreate(3, "19:00 pm", 1)]);
  await Promise.all([doseCreate(4, "22:00 pm", 1)]);
}

// Note, the index is used to control links between entities when constructing the data.
async function doseCreate(index, time, quantity) {
  const dose = new Dose({ time, quantity });
  await dose.save();
  doses[index] = dose;
}

async function createRegimens() {
  console.log("Adding regimens");
  await Promise.all([
    regimenCreate(0, "1 per day pre-breakfast", [doses[0]]),
    regimenCreate(1, "1 per day post-breakfast", [doses[1]]),
    regimenCreate(2, "1 per day lunch-time", [doses[2]]),
    regimenCreate(3, "1 per day dinner-time", [doses[3]]),
    regimenCreate(4, "1 per day bed-time", [doses[4]]),
    regimenCreate(5, "3 per day meal times", [doses[0], doses[2], doses[3]]),
    regimenCreate(6, "2 per day post-breakfast and supper", [
      doses[1],
      doses[4],
    ]),
  ]);
}

async function regimenCreate(index, regimenSummary, regimenDoseArray) {
  const regimen = new Regimen({
    summary: regimenSummary,
    doses: regimenDoseArray,
  });
  await regimen.save();
  regimens[index] = regimen;
  // console.log(`Added regimen: ${regimen}`);
}

async function createPatients() {
  console.log("Adding patients");
  await Promise.all([
    // monthIndex used, 0 = January
    patientCreate(0, "Mum", "Pearson", new Date("1944-03-04"), [
      conditions[0],
      conditions[1],
      conditions[2],
      conditions[3],
      conditions[4],
      conditions[5],
      conditions[6],
    ]),
    patientCreate(1, "Glen", "Pearson", new Date("1973-04-05"), [
      conditions[7],
    ]),
  ]);
}

async function patientCreate(
  index,
  firstName,
  familyName,
  dob,
  conditionArray
) {
  const patient = new Patient({
    first_name: firstName,
    family_name: familyName,
    date_of_birth: dob,
  });
  if (conditions != false) patient.conditions = conditionArray;
  await patient.save();
  patients[index] = patient;
  // console.log(`Added patient: ${patient}`);
}

async function createMedications() {
  console.log("Adding medications");
  await Promise.all([
    medicationCreate(0, "Amlodipine 10mg", "", [conditions[2]]),
    medicationCreate(1, "Levothyroxine 50mg", "", [conditions[4]]),
    medicationCreate(2, "Clopidogrel 75mg", "", [conditions[0]]),
    medicationCreate(3, "Spironolactone 25mg", "", [conditions[3]]),
    medicationCreate(4, "Propranalol 10mg", "", [conditions[2]]),
    medicationCreate(5, "Ramipril 5mg", "", [conditions[2]]),
    medicationCreate(6, "Doxazosin 4mg", "Doxy", [conditions[2]]),
    medicationCreate(7, "Simvastatin 20mg", "", [conditions[1]]),
    medicationCreate(8, "Ibuprofen 500mg", "", [conditions[7]]),
  ]);
}

async function medicationCreate(index, name, alias, conditionArray) {
  const medication = new Medication({
    name: name,
    alias: alias,
  });
  if (conditions != false) medication.conditions = conditionArray;
  await medication.save();
  medications[index] = medication;
  // console.log(`Added medication: ${medication}`);
}

async function createPrescriptions() {
  console.log("Adding prescriptions");
  await Promise.all([
    prescriptionCreate(
      0,
      patients[0],
      medications[0],
      regimens[0],
      new Date("2024-06-30"),
      78,
      "Active"
    ),
    prescriptionCreate(
      0,
      patients[0],
      medications[1],
      regimens[0],
      new Date("2024-06-30"),
      46,
      "Active"
    ),
    prescriptionCreate(
      0,
      patients[0],
      medications[2],
      regimens[1],
      new Date("2024-06-30"),
      58,
      "Active"
    ),
    prescriptionCreate(
      0,
      patients[0],
      medications[3],
      regimens[1],
      new Date("2024-06-30"),
      79,
      "Active"
    ),
    prescriptionCreate(
      0,
      patients[0],
      medications[4],
      regimens[1],
      new Date("2024-06-30"),
      27,
      "Active"
    ),
    prescriptionCreate(
      0,
      patients[0],
      medications[5],
      regimens[6],
      new Date("2024-06-30"),
      75,
      "Active"
    ),
    prescriptionCreate(
      0,
      patients[0],
      medications[6],
      regimens[4],
      new Date("2024-06-30"),
      36,
      "Active"
    ),
    prescriptionCreate(
      0,
      patients[0],
      medications[7],
      regimens[4],
      new Date("2024-06-30"),
      44,
      "Active"
    ),
    prescriptionCreate(
      0,
      patients[1],
      medications[8],
      regimens[5],
      new Date("2024-06-30"),
      10,
      "Active"
    ),
  ]);
}

async function prescriptionCreate(
  index,
  patient,
  medication,
  regimen,
  inventoryUpdateDate,
  inventoryUpdateQuantityEOD,
  status
) {
  const prescription = new Prescription({
    patient: patient,
    medication: medication,
    regimen: regimen,
    inventory_update_date: inventoryUpdateDate,
    inventory_update_quantity_endofday: inventoryUpdateQuantityEOD,
    status: status,
  });
  await prescription.save();
  prescriptions[index] = prescription;
  // console.log(`Added prescription: ${prescription}`);
}

*/
