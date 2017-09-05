const express = require("express");
const User = require("../models/index");
const Message = require("../models/index");
// const Like = require("../models/index");
const models = require("../models/index")
const router = express.Router();
const bcrypt = require("bcrypt");


const passport = require('passport');

const isAuthenticated = function (req, res, next) {
  console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
      return next()
    }
    req.flash('error', 'You have to be logged in to access the page.')
    res.redirect('/')
  }


  router.get("/destroy/:id", function(req, res) {
    models.Message.destroy({
      where: {
        id: req.params.id
      }
    })
    .then(function(message) {
       if(message.user_id == req.user.id) {
         console.log("this should delete", message.user_id);
         res.render("list");

       }
    })
  })





  router.get("/list", isAuthenticated, function(req,res) {
    models.Message.findAll({
      order: [['createdAt', 'DESC']],
        include: [
          {model: models.User, as: 'Users'},
          {model: models.Like, as: 'Likes'}
        ]
      })

    .then(function(data){
      res.render("list", {handle: req.params.handle, message: data, user: data})
      console.log(req.params.handle, "this is handle");
    })
  })




router.get("/create", function(req,res) {
  models.User.findAll()
  .then(function(data){
  res.render("create", {handle: req.user.handle})
  })
})


router.post("/squawk", function(req,res) {
  messages = req.body.messages,
  user_id  = req.user.id

   let newMessage = {
     messages: messages,
     user_id: user_id
   }
   models.Message.create(newMessage)
   .then(function(data){
     res.redirect("list");
   })
 });

router.get("/like/:id", function(req,res) {
    models.Like.create({
      user_id: req.user.id,
      message_id: req.params.id
    })
  .then(function(data) {
    res.redirect("/list");
    console.log("this is like", req.like.id);
  })
})









router.get("/", function(req, res) {
  res.render("login", {
      messages: res.locals.getMessages()
  });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/list',
    failureRedirect: '/',
    failureFlash: true
}));

router.get("/signup", function(req, res) {
  res.render("signup");
});

router.post("/signup", function(req, res) {
   username = req.body.username,
   password = req.body.password,
   handle   = req.body.handle

  if (!username || !password) {
    req.flash('error', "Please, fill in all the fields.")
    res.redirect('login')
  }

  let salt = bcrypt.genSaltSync(10)
  let hashedPassword = bcrypt.hashSync(password, salt)

  let newUser = {
    username: username,
    handle: handle,
    salt: salt,
    password: hashedPassword
  }

  models.User.create(newUser).then(function() {
    res.redirect('/')
  }).catch(function(error) {
    req.flash('error', "Please, choose a different username.")
    res.redirect('/signup')
  });
});

router.get("/signup", function(req,res) {
  res.render("login");
})
router.get("/list", isAuthenticated, function(req, res) {
  res.render("list", {username: ''});
});

router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});


router.get("/", function(req,res){
  res.render("login")
})

module.exports = router;
