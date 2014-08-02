var request = require('request'),
    qs = require('querystring'),
    _ = require('underscore'),
    User = require('../models/user.js');

exports.favorite = function(req, res) {
  var fid = req.params.id,
      friend;

  User.findOne({uid: req.session.passport.user}, function(err, user) {
    user.favorites.push(fid);
    user.save(function(err) {
      if(err) throw err;
    });
    friend = _.find(user.friends, function(friend) { return friend.id === fid });
    res.json({friend: friend});
  });
};
exports.unfavorite = function(req, res) {
  var fid = req.params.id,
      friend;

  User.findOne({uid: req.session.passport.user}, function(err, user) {
    var i = user.favorites.indexOf(fid);
    user.favorites.splice(i, 1);
    user.save(function(err) {
      if (err) throw err;
    });
    friend = _.find(user.friends, function(friend) { return friend.id === fid });
    res.json({friend: friend});
  });
}
