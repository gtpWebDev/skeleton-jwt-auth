const mongoose = require("mongoose");

require("dotenv").config();

/**
 * -------------- DATABASE ----------------
 *
 * Connect to MongoDB Server using the connection strings in the `.env` file.  To implement this, place the following
 *
 * This is exposed in app.js, providing a global connection in any module using mongoose.conection
 *
 */

const devConnection = process.env.DB_STRING_DEV;
const prodConnection = process.env.DB_STRING_PROD;

// Connect to the correct environment database
if (process.env.NODE_ENV === "production") {
  mongoose.connect(prodConnection);

  mongoose.connection.on("connected", () => {
    console.log("Database connected");
  });
} else {
  mongoose.connect(devConnection);

  mongoose.connection.on("connected", () => {
    console.log("Database connected");
  });
}
