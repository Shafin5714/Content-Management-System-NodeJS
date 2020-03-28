const express = require('express')
const passport = require('passport')
const LocalStratgy = require('passport-local').Strategy  //using the strategy property
const bcrypt = require('bcryptjs')
const User = require('../models/UserModel')
const Post = require('../models/PostModel')
const router = express.Router()
const defaultController = require('../controllers/defaultController')
router.all('/*',(req,res,next)=>{
    req.app.locals.layout='default'
    next()
})

router.route('/').get(defaultController.index)
router.route('/page/:page').get(defaultController.indexWithPage)

// defining local strategies
passport.use(new LocalStratgy({
    usernameField:'email',
    passReqToCallback:true
},(req,email,password,done)=>{
    User.findOne({email:email}).then(user=>{
        if(!user){
            return done(null,false,req.flash('error-message','User not found with this email'))
        }
        bcrypt.compare(password,user.password,(err,passwordMatched)=>{
            if(err){
                return err
            }
            if(!passwordMatched){
                return done(null,false,req.flash('error-message','Invalid username or password') )
            }
            return done(null,user,req.flash('success-message','Login Successful'))
        })
    })
}))
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

router.route('/login').get(defaultController.loginGet).post(passport.authenticate('local',{
    successRedirect:'/admin',
    failureRedirect:'/login',
    failureFlash:true,
    successFlash:true,
    session:true

}), defaultController.loginPost)
router.route('/register').get(defaultController.registerGet).post(defaultController.registerPost)
router.route('/post/:id').get(defaultController.singlePost).post(defaultController.submitComment)
router.route('/autocomplete').get(defaultController.autocomplete)

router.get('/logout',(req,res)=>{
    req.logout()
    req.flash('success-message','Logout was successful')
    res.redirect('/')
})
 module.exports = router