const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    trim: true,
  },
  _userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

const List = mongoose.model("lists", listSchema);

module.exports = { List };
