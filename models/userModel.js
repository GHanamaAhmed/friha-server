const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  provider: {
    type: String,
  },
  clientId: {
    type: String,
  },
  email: {
    type: String,
  },
  birthday: {
    type: String,
  },
  role: {
    type: String,
    enum: ["client", "admin"],
  },
  phone: {
    type: String,
  },
  Photo: {
    type: String,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  sex: {
    type: String,
  },
});
userSchema.pre("save", function (next) {
  this.firstName = this.firstName.toLowerCase();
  this.lastName = this.lastName.toLowerCase();
  next();
});
module.exports = mongoose.model("user", userSchema);
