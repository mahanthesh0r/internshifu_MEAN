const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const nodemailer = require('nodemailer');



//Email Verification
var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "coolmonteee@gmail.com",
        pass: "rockingmonty"
    }
});

var rand, mailOptions, host, link;

//Register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });
    //Send Email Verification
    rand=Math.floor((Math.random() * 100)+54);
    host=req.get('host');
    link="http://"+req.get('host')+"/users/verify?id="+rand;
    mailOptions={
        to: req.body.email,
        subject: "Please Confirm your Email account",
        html: "Hello,<br> Please click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
            res.end("error");
        }else{
            console.log("Message sent: "+ response.message);
            res.end("sent");
        }
    });

    User.addUser(newUser, (err, user) =>{
        if(err){
            res.json({success: false, msg:'Failed to register user'});
        }else{
            res.json({success: true, msg:'User registered'});
        }
    });
});

//Email Verify
router.get('/verify', (req,res,next) => {
    console.log(req.protocol+"://"+req.get('host'));
    if((req.protocol+"://"+req.get('host'))==("http://"+host))
    {
        console.log("Domain is matched. Information is from authentic email");
        if(req.query.id==rand){
            console.log("email is verified");
            res.end("<h1>Email "+ mailOptions.to+" is been successfully verified <br> <a href='/login'>Click here to Login</a>");
        }
        else {
            console.log("email is not verified");
            res.end("<h1>Bad Request</h1>");
        }
    } else{
        res.end("<h1>Request is from unknown source");
    }
});

// Authenticate
router.post('/authenticate', (req,res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if(err) throw err;
        if(!user){
            return res.json({ success: false, msg: 'User not found'});
        }
        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: 604800 // 1 week
                });

                res.json({
                    success: true,
                    token: 'JWT ' +token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
            } else{
                return res.json({success: false, msg: 'Wrong password'});
            }
        });
    });


});

//Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
res.json({user: req.user});
});

//Update User
router.put('/user/:id', function(req, res, next){
    User.findByIdAndUpdate(req.params.id,
    {
        $set: {
            dob: req.body.dob, 
            phone: req.body.phone, 
            graduation: req.body.graduation,
            college: req.body.college, 
            profession: req.body.profession,
            website: req.body.website,
            github: req.body.github,
            otherlinks: req.body.otherlinks,
            prolanguage: req.body.prolanguage,
            framework: req.body.framework,
            otherskills: req.body.otherskills,
        }
    },
    {
        new: true
    },
    function(err, updatedUser){
        if(err){
            res.send("Error updating User");
        }else{
            res.json(updatedUser);
        }
    }
    )
});
module.exports = router;