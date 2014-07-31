var request = require('request'),
    qs = require('querystring');

// Controller actions
exports.index = function(req, res) {
  var params = {
    user_id: req.session.passport.user
  };
  var url = 'https://api.twitter.com/1.1/followers/list.json?';
  url += qs.stringify(params);
  //req.session.oauth has the data
  request.get({url: url, oauth: req.session.oauth, json: true}, function(err, response, json) {
    console.log(json);
    res.render('index', {image: req.user.image, title: 'aGameOfChess'});
  });
};
exports.login = function(req, res) {
  res.render('login', {title: 'aGameOfChess | login'});
}
