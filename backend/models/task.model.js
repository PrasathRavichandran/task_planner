const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    trim: true,
  },
  _listId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

const Task = mongoose.model("tasks", taskSchema);

module.exports = {Task};
