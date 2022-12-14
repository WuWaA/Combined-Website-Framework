var express = require('express');
var fs = require("fs");
var passport = require('passport');
var router = express.Router();


/* Middleware */
// Session-persisted message middleware
var err, msg, success;
router.use(function (req, res, next) {
  err = req.session.error;
  msg = req.session.notice;
  success = req.session.success;

  delete req.session.error;
  delete req.session.success;
  delete req.session.notice;

  if (err) res.locals.error = "Error " + err;
  if (msg) res.locals.notice = "Message " + msg;
  if (success) res.locals.success = "Success " + success;

  next();
});

router.get('/404', function (req, res, next) {
  // trigger a 404 since no other middleware
  // will match /404 after this one, and we're not
  // responding here
  next();
});

passport.authenticateMiddleware = function authenticationMiddleware() {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/signin');
  }
};

passport.isAdmin = function adminMiddleware() {
  return function (req, res, next) {
    if (req.user.username === "admin") {
      return next();
    }
    res.redirect('/signin');
  }
};
/* Middleware End */


/* Get Requests */
// displays search page
router.get('/', passport.authenticateMiddleware(), function (req, res) {
  res.sendFile("search.html", {
    root: "public"
  });
});

// displays signin page
router.get('/signin', function (req, res) {
  res.render('signin', {
    user: req.user,
    error: err,
    success: success,
    notice: msg
  });
});

// logs user out of site
// deleting them from the session and returns to search page
router.get('/logout', passport.authenticateMiddleware(), function (req, res) {
  var name = req.user.username;
  console.log("LOG OUT: " + name)
  req.logout();
  res.redirect('/');
  req.session.notice = "You are just logged out, " + name + "!";
});

// passport.isAdmin()
router.get('/admin', passport.authenticateMiddleware(), passport.isAdmin(), function (req, res) {
  res.sendFile("admin.html", {
    root: "public"
  });
});

router.get('/search', passport.authenticateMiddleware(), function (req, res) {
  res.sendFile("search.html", {
    root: "public"
  });
})

router.get('/question', passport.authenticateMiddleware(), function (req, res) {
  res.sendFile("search.html", {
    root: "public"
  });
})
/* Get Requests End */


/* Post Requests */
// sends the request through local signup strategy
// if successful takes user to search page
// otherwise returns then to signin page
// passport.isAdmin()
router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/search',
  failureRedirect: '/signin'
}));

// sends the request through local signin strategy
// if successful takes user to search page
// otherwise returns then to signin page
router.post('/signin', passport.authenticate('local-signin', {
  successRedirect: '/search',
  failureRedirect: '/signin'
}));

router.post('/question', passport.authenticateMiddleware(), function (req, res) {
  //res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); // old method
  res.set('Content-Type', 'text/html; charset=utf-8');
  var description = [];
  var image = [];
  var input_temp_1 = req.body.question.replace(/\n/g, ' '); // multiple lines to single line
  var input_temp_2 = input_temp_1.trim().toLowerCase(); // trim spaces and transfer to lowercase
  var input = input_temp_2.replace(/\s+/g, ' '); // delete extra spaces
  var content = JSON.parse(fs.readFileSync('public/example-content.json')); // some example content for test
  var input_length = input.length;
  var content_length = Object.keys(content).length;
  console.log("Input Length: " + input_length);
  console.log("Content Length: " + content_length);

  // basic exception handling
  if (content[input] !== undefined && input_length >= 1 && input_length <= 20) {
    description.push(content[input][0]);
    image.push(content[input][1]);
  }

  // if input length too short or too long, refuse to search
  // front-end tells user input invalid, and back-end does nothing

  var html_code = "";
    html_code += '<hr>';
    html_code += '<p class="result-name">' + input.toUpperCase() + '</p>';
    html_code += '<p class="result-description">Description: ' + description[0] + '</p><br>';
    if (image[0] != '') html_code += '<img class="result-image" src="' + '/images/' + image[0] + '"><br>';
  res.render('question', {
    input: input.toUpperCase(),
    html_code: html_code
  });
})
/* Post Requests End */


/* Blocked Access */
router.get('/public', function (req, res, next) {
  res.status(404);

  res.format({
    html: function () {
      res.render('404', {
        url: req.url
      })
    },
    json: function () {
      res.json({
        error: 'Not found'
      })
    },
    default: function () {
      res.type('txt').send('Not found')
    }
  })
})

router.get('/example-content.json', function (req, res, next) {
  res.status(404);

  res.format({
    html: function () {
      res.render('404', {
        url: req.url
      })
    },
    json: function () {
      res.json({
        error: 'Not found'
      })
    },
    default: function () {
      res.type('txt').send('Not found')
    }
  })
})
/* Blocked Access End */

module.exports = router;