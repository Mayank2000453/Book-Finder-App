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

mongoose.connect("mongodb://localhost:27017/booksDB")
//

//---------For login and register-----------------------
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  books: String
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

//------------------FOR BOOKS-------------------------------------------------//

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

// app.get("/bookHomepage",function(req,res)
// {
//
//
// })
app.post("/bookHomepage",function(req,res)
{
let kind = req.body.bookName;
res.redirect("/books/"+kind)
});

// --------------------------------------------------------------------
// app.route("/shoopingList").get()
// .post(function(req,res)
// {
//   let nameOfBook = req.body.bookName;
// })
// .put(function(req,res)
// {
//   User.updateOne(
//     { email: req.body.username},
//     { $push : {title: req.body.bookName}},
//     function(err, result)
//     {
//       if(!err)
//       {
//         res.redirect("/register/"+req.body.username);
//       }
//       else{res.send(err);}
//     }
//   )
// })


//--------------------REGISTER---------------------------------------------//

app.get("/home", function(req,res){
  if(req.isAuthenticated()){
    res.render("bookHomepage",{userId: req.body.username});
  }else{
    res.redirect("/login");
  }
})

// -------------------Home for authentication--------------------------------//

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
      res.redirect("/home");
    })
  }
});
});


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

//  API for purchase list
// 
// app.get("/purchaseList/all/:anonymmous",function(req,res){
// User.findOne({})
// })


// app.route("/purchaseList/:anonymmous")
// .get(function(req,res)
// {
//   const name = req.params.anonymmous;
//   const currUser = req.user._id;
//   User.find(function(err,foundUser){
//     res.send(0.books)
//   }
// });



// ------Update books in the list--------------------------------------------//




// --------------Update and Delete  CUSTOM--------------------------------------//
app.route("/register/:anonymmous")
.get(function(req,res)
{
const name = req.params.anonymmous;

if(name === "all")
{
  User.find(function(err, foundUsers)
  {
    res.send(foundUsers);
  })
}
else{

  User.findOne({email: req.params.anonymmous},function(err,foundUser)
{
if(foundUser){
  res.send(foundUser);
}else{
  res.send("No user found");
}
});
}
})
.put(function(req,res)
{
  User.updateOne(
    { email: req.body.username},
    { $push : {title: req.body.bookName}},
    function(err, result)
    {
      if(!err)
      {
        res.redirect("/register/"+req.body.username);
      }
      else{res.send(err);}
    }
  );
    // User.updateMany(
    //   {email: req.params.anonymmous},
    //   {email: req.body.email, password: req.body.password},
    //   {overwrite: true},
    //   function(err)
    //   {
    //     if(!err)
    //     {
    //       res.send("Succesfully Updated");
    //     }
    //     else{
    //       res.send(err);
    //     }
    //   }
    // );
})
.delete(function(req,res)
{
  User.deleteOne(
      {email: req.params.anonymmous},
      function(err)
      {
        if(!err)
        {
          res.send("Deleted Succesfully");
        }else{
          res.send(err);
        }
      }
  )
});





// -----------Home page-------------------------------------------------------//
app.get("/", function(req,res)
{
  res.render("home");
});

// ---------------------------------------------------------------------------//






app.listen(3000,function()
{
  console.log("Server starting at port 3000");
})
