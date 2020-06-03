const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose
  .connect("mongodb://localhost:27017/task-planner", { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to the Database!");
  })
  .catch((e) => console.log(e));

module.exports = { mongoose };
