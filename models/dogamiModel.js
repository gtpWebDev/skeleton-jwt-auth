const mongoose = require("mongoose");
const connection = require("../config/database");

const breeds = require("../constants/dogamiInfo").breedArray;

const Schema = mongoose.Schema;

const DogamiSchema = new Schema(
  {
    dogami_id: { type: String, required: true, maxLength: 10 },
    name: { type: String, required: true, maxLength: 40 },
    breed: { type: String, required: true, enum: breeds },
  },
  { collection: "dogami" }
);

// Virtual for official dogami URL
DogamiSchema.virtual("official_dogami_url").get(function () {
  return `https://marketplace.dogami.com/dogami/${this.dogami_id}`;
});

// Virtual for dogami URL - don't think needed as with authentication approach, url will be same for all accounts
DogamiSchema.virtual("url").get(function () {
  return `/dogami/${this.dogami_id}`;
});

DogamiSchema.virtual("date_registered_formatted").get(function () {
  return this.date_of_birth ? format(this.date_registered, "PPP") : "";
});

/* Export model
    - The first argument is the singular name of the collection your model is for.
    - Mongoose automatically looks for the plural, lowercased version of your model name.
    - Thus, the model "Patient"" is for the "patients" collection in the database.
*/
module.exports = connection.model("Dogami", DogamiSchema);
