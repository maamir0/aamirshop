const mongoose = require("mongoose");

const catogorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: [true, "This Catogory Already exists"],
  },
  subTitle: { type: String },
  image: { type: String },
  promotional: { type: Boolean, default: false },
});

catogorySchema.index({ name: "text", description: "text" });

const Catogory = mongoose.model("Catogory", catogorySchema);

module.exports = Catogory;
