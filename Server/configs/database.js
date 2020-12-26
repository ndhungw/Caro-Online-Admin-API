const mongoose = require("mongoose");
const DB_URI = process.env.DB_URI;

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "Connection error:"));
    db.once("open", () => {
      console.log("Connect to database successfully!");
    });
  }
}

module.exports = new Database();
