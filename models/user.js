var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  provider: String,
  uid: String,
  name: String,
  image: String,
  friends: [],
  hasFriends: {type: Boolean, default: false},
  created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('User', userSchema);
