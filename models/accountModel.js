const mongoose = require("mongoose");
const connection = require("../config/database");

const { format } = require("date-fns");

const Schema = mongoose.Schema;

const AccountSchema = new Schema(
  {
    username: { type: String, required: true, maxLength: 100 },
    date_registered: { type: Date }, // temp disabled required
    // date_registered: { type: Date, required: true },
    owned_dogs: [{ type: Schema.Types.ObjectId, ref: "Dogami" }], // references mongoose model
    salt: { type: String, required: true },
    hash: { type: String, required: true },
    admin: { type: Boolean, required: true },
  },
  { collection: "accounts" }
);

// Virtual for account URL - don't think needed as with authentication approach, url will be same for all accounts
AccountSchema.virtual("url").get(function () {
  return `/account/${this._id}`;
});

AccountSchema.virtual("date_registered_formatted").get(function () {
  return this.date_registered ? format(this.date_registered, "PPP") : "";
});

/* Export model
    - The first argument is the singular name of the collection your model is for.
    - Mongoose automatically looks for the plural, lowercased version of your model name.
    - Thus, the model "Patient"" is for the "patients" collection in the database.
*/
module.exports = connection.model("Account", AccountSchema);
