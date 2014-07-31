var http = require('http'),
    https = require('https'),
    express = require('express'),
    session = require('express-session'),
    favicon = require('serve-favicon'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    cors = require('cors'),
    moment = require('moment'),
    showdown = require('showdown'),
    passport = require('passport'),
    TwitterStrategy = require('passport-twitter').Strategy,
    credentials = require('./credentials.js'),
    userOauth = {
      callback: 'http://agameofchess.com/auth/twitter/callback',
      consumer_key: credentials.twitter.key,
      consumer_secret: credentials.twitter.secret
    },
    mainController = require('./controllers/mainController.js'),
    User = require('./models/user.js');

var app = express();

app.use(favicon(__dirname + '/public/images/favicon.png'));

app.engine('jade', require('jade').__express);

app.set('view engine', 'jade');

// app.set('view options', { layout: false });

app.set('port', process.env.PORT || 80);

app.use(function(req, res, next) {
  domain = require('domain').create();
  domain.on('error', function(err) {
    console.error('DOMAIN ERROR CAUGHT\n', err.stack);
    try {
      setTimeout(function() {
        console.error('Failsafe shutdown');
        process.exit(1);
      }, 5000);
      server.close();
      try {
        next(err);
      } catch(error) {
        console.error('Express error mechanism failed.\n', error.stack);
        res.statusCode = 500;
        res.setHeader('content-type', 'text/plain');
        res.end('Server error.');
      }
    } catch(error) {
      console.error('Unable to send 500 response.\n', error.stack);
    }
  });
  domain.add(req);
  domain.add(res);
  domain.run(next);
});

switch(app.get('env')) {
  case 'development':
    app.use(require('morgan')('dev'));
    break;
  case 'production':
    app.use(require('express-logger')({ path: __dirname + '/log/requests.log'}));
    break;
}

app.use(methodOverride());
app.use(cookieParser(credentials.cookieSecret));
app.use(session({secret: credentials.sessionSecret, saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var options = {
  server: {
     socketOptions: { keepAlive: 1 }
  }
};
switch(app.get('env')) {
  case 'development':
    mongoose.connect('mongodb://localhost/test', options);
    break;
  case 'production':
    mongoose.connect(credentials.mongo.connectionString, options);
    break;
  default:
    throw new Error('Unknown execution environment: ' + app.get('env'));
}

passport.use(new TwitterStrategy({
    consumerKey: credentials.twitter.key,
    consumerSecret: credentials.twitter.secret,
    callbackURL: "http://agameofchess.com/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    User.findOne({uid: profile.id}, function(err, user) {
      if(user) {
        done(null, user);
      } else {
        var user = new User();
        user.provider = "twitter";
        user.uid = profile.id;
        user.name = profile.displayName;
        user.image = profile._json.profile_image_url;
        user.save(function(err) {
          if(err) { throw err; }
          done(null, user);
        });
      }
      userOauth.token = token;
      userOauth.token_secret = tokenSecret;
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.uid);
});

passport.deserializeUser(function(uid, done) {
  User.findOne({uid: uid}, function (err, user) {
    done(err, user);
  });
});

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' }));
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/', loggedIn, function (req, res) {
  req.session.oauth = userOauth;
  mainController.index(req, res);
});
app.get('/login', mainController.login);
app.get('/game', function(req, res) {
  res.sendfile('./static/index.html');
});

app.use(function(req, res, next) {
  res.status(404);
  res.sendfile('./static/404.html');
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.sendfile('./static/500.html');
});

var server = http.createServer(app).listen(app.get('port'), function() {
  console.log( 'aGameOfChess started in ' + app.get('env') +
    ' mode on ' + app.get('port'));
});

var io = require('socket.io').listen(server);

io.on('connection', function(socket){
  console.log('a user connected');
});

// functions
function loggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
}
