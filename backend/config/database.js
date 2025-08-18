const mongoose = require("mongoose");
require('dotenv').config();

const ConnectDB = () => {
  mongoose
    .set("strictQuery", false)
    .connect(process.env.UserMDB)
    .then(
      console.log(`Successfully connected to the database:\t ${process.env.UserMDB}`)
    )
    .catch((err) => {
      console.log(`Database Connection Failed!!`);
      console.log(err);
    });
};

module.exports = ConnectDB;