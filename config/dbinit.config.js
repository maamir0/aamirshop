const mongoose = require("mongoose");

function initDb() {
  mongoose
    .connect(process.env.DBURI)
    .then(() => {
      console.log("db connected");
    })
    .catch((err) => console.log("Mongo Error" + err));

  const dbConnection = mongoose.connection;

  dbConnection.on("error", (err) => {
    console.log(err);
  });
}

module.exports = { initDb };
