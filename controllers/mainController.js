var request = require('request'),
    qs = require('querystring'),
    User = require('../models/user.js');

exports.index = function(req, res) {
  var userId = req.session.passport.user,
      friends = [];
  User.findOne({uid: userId}, function(err, user) {
    if (!user.hasFriends) {
      var cursor = -1,
          count = 0,
          params,
          url;

      function getFriends(cb) {
        params = {
          user_id: req.session.passport.user,
          skip_status: true,
          include_user_entities: false,
          count: 200,
          cursor: cursor
        };
        url = 'https://api.twitter.com/1.1/friends/list.json?';
        url += qs.stringify(params);
        request.get({url: url, oauth: req.session.oauth, json: true}, function(err, response, json) {
          // console.log(json);
          if (json.errors) throw err;
          for (var i = 0; i < json.users.length; i++) {
            friends.push(json.users[i]);
          }
          cursor = json.next_cursor_str;
          if (cursor != '0' && count < 4) {
            getFriends();
          } else {
            cb();
          }
        });
      }
      function next() {
        // console.log(user);
        user.friends = friends;
        user.hasFriends = true;
        user.save(function(err) {
          if(err) throw err;
        });
        res.render('index', {title: 'aGameOfChess', user: user, friends: user.friends, friendsCount: user.friends.length, favorites: user.favorites});
      }
      getFriends(next);
    } else {
      res.render('index', {title: 'aGameOfChess', user: user, friends: user.friends, friendsCount: user.friends.length, favorites: user.favorites});
    }
  });
};
exports.login = function(req, res) {
  res.render('login', {title: 'aGameOfChess | login'});
}
exports.refresh = function(req, res) {
  var userId = req.session.passport.user;
  User.findOne({uid: userId}, function(err, user) {
    user.hasFriends = false;
    user.save(function(err) {
      if (err) throw err;
    });
    res.redirect('/');
  });
}
