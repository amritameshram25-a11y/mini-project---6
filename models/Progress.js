const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  studentName: String,
  courseName: String,
  completionPercentage: {
    type: Number,
    min: 0,
    max: 100
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Progress", progressSchema);