require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");


app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));


app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://admin-mayank:mayank2000@cluster0.6r76q.mongodb.net/booksDB")
//


//---------For login and register-----------------------
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  history:{
    purchase:[{date: String, noOfBooks: Number }],
    sellHist: [{date: String, noOfBooks: Number }]
  }
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);


passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// --------For BOOKS--------------------------------------//
const booksSchema = {
  kind: String,
  items: [
    {
      title: String,
      authors: [String],
      description: String,
      publishedDate: String,
      previewLink: String,
      thumbnail: String
    }
  ],
}

const Book = new mongoose.model("Book", booksSchema);
app.post("/bookHomepage",function(req,res)
{
let kind = req.body.bookName;
res.redirect("/books/"+kind)
});

//--------------------REGISTER---------------------------------------------//

app.get("/home", function(req,res){
  if(req.isAuthenticated()){
    res.render("bookHomepage",{userId: req.user.username});
  }else{
    res.redirect("/login");
  }
})
//----------------------Login and LogOut--------------------------------------//

app.route("/login")
.get( function(req,res)
{
  res.render("login");
})
.post( function(req,res)
{
 const user = new User({
   username: req.body.username,
   password: req.body.password
 });

 req.login(user,function(err){
    if(err){
      console.log(alert("Wrong password"));
    }else{
      passport.authenticate("local")(req,res,function(){
        res.redirect("/home");
      });
    }
  });
});

app.get("/logout", function(req,res){
  req.logout(function(err){
    if(err){ console.log(err);}
    res.redirect("/home");
  });
});


// -----------------Purchase List---------------------------------------------//
app.get("/purchaseList", function(req,res)
 {
   if(req.isAuthenticated()){
     User.find({"books":{$ne: null}},function(err, foundUser){
       if(err){
         console.log(err);
       }else{
         res.render("purchaseList",{bookNames: foundUser});
       }
     })
   }else{
     res.redirect("/login");
   }
});

app.post("/purchaseList",function(req,res)
{
const bookName = req.body.bookname;

User.findById(req.user._id,function(err,foundUser){
if(err){
  console.log(err);
}else{
  if(foundUser){
    foundUser.books = bookName;
    foundUser.save(function(){
      res.redirect("/purchaseList")
    });
  }
}
});
});
// -----------Home page-------------------------------------------------------//
app.get("/", function(req,res)
{
  res.render("home");
});

// ---------------------------------API's---------------------------------------//

// 1. Find All Kind Books
app.route("/books").get(function(req,res){
  Book.find(function(err,foundArticles)
  {
  if(!err)
  {
    res.send(foundArticles);
  }
  else{
    res.send(err);
  }
  });
});

// 2. Find all Books of a specific kind
app.route("/books/:bookKind")
.get(function(req,res)
{
  Book.findOne({kind: req.params.bookKind}, function(err,foundArticles)
{
   if(foundArticles)
   {
     res.send(foundArticles);
   }
   else{
     res.render("error");
   }
});
});

//------------Create-------------------------------------------------------//
app.get("/register", function(req,res){
  res.render("register");
})

app.post("/register",function(req,res){
User.register({username: req.body.username},req.body.password, function(err,user){
  if(err){
    console.log(err);
    res.redirect("/register");
  }else{
    passport.authenticate("local")(req,res,function(){
      // res.send("Succesfull");
      res.redirect("/home");
    })
  }
});
});

//--------------------------Read------------------------------------------//
//1. Read user details by entering the email id
app.get("/register/:name", function(req,res){

  if(req.params.name === "all")
  {
    User.find(function(err, foundUsers)
    {
      res.send(foundUsers);
    });
  }
  else{
    User.findOne({username: req.params.name}, function(err, foundUser){
      if(foundUser){
        res.send(foundUser);
      }else{
        res.send("No user found");
      }
    });
  }
});
// -------------------------------Update-------------------------------------//
// 1. Using patch to update user email
app.patch("/register/:name", function(req,res){
User.update({username: req.params.name},{$set:req.body},function(err){
  if(!err){
    res.send("Succesfully Updated");
  }else{
    res.send(err);
  }
});
});
//---------------------------------Delete------------------------------------//
app.delete("/register/:name", function(req,res){
User.deleteOne({username: req.params.name},function(err){
  if(!err){
    res.send("Succesfully Updated");
  }else{
    res.send(err);
  }
});
});

// 2. Purchased and Sell

app.get("/register/history/:name", function(req,res){
User.find({username: req.params.name}, function(err,foundUser){

  if(foundUser){
    res.send(foundUser[0].history);
  }else{res.send(err)}
  }

)});


let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}



app.listen(port,function()
{
  console.log("Server starting at port 3000");
})
