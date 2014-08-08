var request = require('request'),
    qs = require('querystring'),
    _ = require('underscore'),
    User = require('../models/user.js');

exports.index = function(req, res) {
  var userId = req.session.passport.user,
      friends = [],
      favorites = [];
  User.findOne({uid: userId}, function(err, user) {
    if (!user.hasFriends) {
      console.log('updating friends for user' + user.name);
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
          if (json.errors) throw err;
          for (var i = 0; i < json.users.length; i++) {
            var user = formatFriend(json.users[i]);
            friends.push(user);
          }
          cursor = json.next_cursor_str;
          if (cursor != '0' && count < 10) {
            count += 1;
            getFriends(cb);
          } else {
            console.log(friends);
            cb();
          }
        });
      }
      function formatFriend(friend) {
        return {
          id: friend.id_str,
          name: friend.name,
          screen_name: friend.screen_name,
          avatar: friend.profile_image_url_https,
          banner_url: friend.profile_banner_url,
          gamesPlayed: 0,
          gamesWonAgainst: 0,
          gamesLostAgainst: 0
        };
      }
      function next() {
        // console.log(user);
        user.friends = friends;
        user.hasFriends = true;
        user.save(function(err) {
          if(err) throw err;
        });
        res.render('index', {title: 'aGameOfChess', user: user, friends: user.friends, friendsCount: user.friends.length, favorites: favorites});
      }
      getFriends(next);
    } else {
      for (var i = 0; i < user.favorites.length; i++) {
        var fid = user.favorites[i];
        favorites.push(_.find(user.friends, function(friend) { return friend.id === fid }));
      }
      res.render('index', {title: 'aGameOfChess', user: user, friends: user.friends, friendsCount: user.friends.length, favorites: favorites});
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
