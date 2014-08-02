var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  provider: String,
  uid: String,
  name: String,
  image: String,
  friends: [],
  favorites: [], // array of friend ids who have been selected as favorites
  hasFriends: {type: Boolean, default: false},
  activeGames: [], // array of active game ids
  pendingGames: [], // array of pending game ids
  finishedGames: [], // array of finished game ids
  gamesWon: {type: Number, default: 0},
  gamesLost: {type: Number, default: 0},
  created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('User', userSchema);
