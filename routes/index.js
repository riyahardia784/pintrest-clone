var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post");
const saveModel = require("./save");
const passport = require('passport');
const localStrategy= require("passport-local");
const upload= require("./multer");

passport.use(new localStrategy(userModel.authenticate()));


router.get('/', function(req, res) {
  res.render('index',{nav:false,error:req.flash('error')});
  });

router.get('/register', function(req, res) {
  res.render('register',{nav:false});
});

router.get('/profile', isLoggedIn, async function(req, res ,next) {
  const user =
   await userModel
   .findOne({username:req.session.passport.user})
   .populate("posts")
   .populate("savedPost")
   
  res.render('profile',{user, nav:true});
});

router.get('/show/posts', isLoggedIn, async function(req, res ,next) {
   const user =
   await userModel
   .findOne({username:req.session.passport.user})
   .populate("posts")
  res.render('show',{user, nav:true});
});

router.get('/show/posts/:imageId', isLoggedIn, async function(req, res ,next) {
   const user = await userModel.findOne({username:req.session.passport.user})
   .populate("posts")
   .populate("savedPost");
 const posts =await postModel.findById(req.params.imageId).populate("user");
 if (!posts) {
     // Handle case where post is not found
     return res.status(404).send("Post not found");
     
   }
   let isPostSaved = false;
   if (user && user.savedPost && user.savedPost.length > 0) {
       // user.savedPost is an array of Mongoose Objects, so we need to compare their IDs
       isPostSaved = user.savedPost.some(savedItem => savedItem._id.equals(posts._id));
   }
 
  res.render('card',{user, nav:true,isPostSaved: isPostSaved, posts});
  
});




router.get('/feed',isLoggedIn ,async function(req, res) {
 const user =await userModel.findOne({username:req.session.passport.user})
   const posts= await postModel.find()
   .populate("user")
  res.render('feed',{ user,nav:true,posts});
  });

  // ... existing routes ...










router.get('/upload', isLoggedIn, async function(req, res ,next) {
  const user = await userModel.findOne({username:req.session.passport.user});
  res.render('upload',{user, nav:true});
});

router.post('/createpost', isLoggedIn,upload.single("postimage") ,async function(req, res ,next) {
  const user = await userModel.findOne({username:req.session.passport.user});
  const post= await postModel.create({
    user:user._id,
    title:req.body.title,
    description:req.body.description,
    image:req.file.filename
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});

router.post('/fileupload', isLoggedIn, upload.single("image"), async function(req, res) {
  if (req.file) {
 const user = await userModel.findOne({username:req.session.passport.user});
 user.profileImage= req.file.filename;
 await user.save();
  }
 res.redirect("/profile");
});


router.post('/register', function(req, res) {
  const data= new userModel({

    username: req.body.username,
  name:req.body.name,
  email: req.body.email,
  contact: req.body.contact
  })
 userModel.register(data,req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile");
    })
  })
 
});

router.post('/login',passport.authenticate("local",{
  failureRedirect:"/",
  failureFlash: true,
  successRedirect:'/profile',
}), function(req, res) {  
});

router.get('/logout', function(req, res,next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/");
}


router.post('/save/:postId', isLoggedIn, async function(req, res, next) {
    try {
        const currentUser = await userModel.findOne({ username: req.session.passport.user });
        const postIdToSave = req.params.postId;

        // Check if the post is already saved by the user
        if (currentUser.savedPost.includes(postIdToSave)) {
            // Post already saved, optionally send a message or redirect
            return res.redirect('back'); // Go back to the previous page
        }

        
        currentUser.savedPost.push(postIdToSave);
        await currentUser.save();

        res.redirect('back'); 
    } catch (error) {
        console.error("Error saving post:", error);
        next(error); // Pass the error to the error handling middleware
    }
});
router.get('/save', isLoggedIn, async function(req, res, next) {
    try {
        const user = await userModel.findOne({ username: req.session.passport.user })
            .populate('savedPost'); 
        res.render('save', { user, nav: true }); 
    } catch (error) {
        console.error("Error fetching saved posts:", error);
        next(error);
    }
});

router.get('/edit', isLoggedIn, async function(req, res ,next) {
  const user =
   await userModel
   .findOne({username:req.session.passport.user}); 
  res.render('edit',{user, nav:true});
});

router.post('/edit', isLoggedIn, async function(req, res) {
  
  

  // Define the update object with only the fields you want to change
  const updateData = {
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    contact: req.body.contact
  };

  try {
    // Find the user by their ID and update the document
    // `req.user._id` comes from Passport when a user is authenticated
    const updatedUser = await userModel.findByIdAndUpdate(req.user._id, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).send("User not found.");
    }
    
    // Passport re-authenticates the user in the session
    // This updates `req.user` with the new data
    req.login(updatedUser, function(err) {
      if (err) {
        // Handle Passport login error
        console.error(err);
        return res.status(500).send("Error updating session.");
      }
      res.redirect("/profile");
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while updating the profile.");
  }
});




router.post('/editfileupload', isLoggedIn, upload.single("image"), async function(req, res) {
 const user = await userModel.findOne({username:req.session.passport.user});
 user.profileImage= req.file.filename;
 await user.save();
 res.redirect("/edit");
});

module.exports = router;
