const mongoose = require("mongoose");

// Extend the SessionData interface from express-session module
// to include userId property with mongoose.Types.ObjectId type
module.exports = (req, res, next) => {
  const SessionData = require("express-session").SessionData;
  SessionData.prototype.userId = mongoose.Types.ObjectId;
  next();
};
