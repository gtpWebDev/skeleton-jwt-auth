const mongoose = require("mongoose");
// const connection = require("../config/database");

const { format } = require("date-fns");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: { type: String, required: true, maxLength: 100 },
    salt: { type: String, required: true },
    hash: { type: String, required: true },
    admin: { type: Boolean, required: true },
  },
  { collection: "users" }
);

// Virtual for account URL - don't think needed as with authentication approach, url will be same for all accounts
UserSchema.virtual("url").get(function () {
  return `/user/${this._id}`;
});

/* Export model
    - The first argument is the singular name of the collection your model is for.
    - Mongoose automatically looks for the plural, lowercased version of your model name.
    - Thus, the model "Patient"" is for the "patients" collection in the database.
*/
module.exports = mongoose.connection.model("User", UserSchema);
