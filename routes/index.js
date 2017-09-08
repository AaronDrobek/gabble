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

const areYouMyMother = function(req, res, next) {
  console.log(req.params.id, 'this is req params id');
   models.Message.findById(req.params.id)
   .then(function(data) {
     if(data.user_id == req.user.id){
      return next()
    }else{
      res.redirect("/list")
    }

  })
  .catch(function(err){
    res.redirect("/list")
  })
}

let tempData;

router.get("/individual/:id", function(req, res) {
  if (req.params.id === 'style.css') {
    res.render("individual", {handle: req.user.handle, likes:tempData})
    tempData = null;
  } else {
    models.Like.findAll({
      where:{
        message_id: req.params.id
      },
         include: [{ model: models.User,
           as: "Users"}]

    })

    .then(function(data) {
      tempData = data;
      console.log(data, "this is reg data");
      console.log(tempData, "this is temp data");
      res.render("individual", {handle: req.user.handle, likes: tempData})
    })
  }
})









  router.get("/destroy/:id", areYouMyMother, function(req, res) {
    models.Like.destroy({
      where: {
        message_id: req.params.id
      }
    }).then(function() {
      models.Message.destroy({
        where: {
          id: req.params.id
        }
      })
      .then(function(message) {
           console.log("this should delete", message.user_id);
           res.redirect("/list");
      })
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
      // console.log(data);
      res.render("list", {handle: req.user.handle, message: data, user: data})
      console.log(req.user.handle, "this is handle");
    })
  })




router.get("/create", isAuthenticated, function(req,res) {
  res.render("create", {handle: req.user.handle})
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

const allreadyLiked = function (req, res, next){
  models.Message.findById()
}



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


router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});


router.get("/", function(req,res){
  res.render("login")
})

module.exports = router;
