const mongoose = require("mongoose");

async function dbConnect() {
  try {
    await mongoose.connect(process.env.DB_URL);
    // eslint-disable-next-line no-console
    console.log("Connected to the database");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error connecting to the database:", error);
  }
}

module.exports = dbConnect();
