// Include Server Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Require History Schema
var History = require("./models/History");

// Create Instance of Express
var app = express();
// Sets an initial port. We'll use this later in our listener
var PORT = process.env.PORT || 3000;

// Run Morgan for Logging
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.use(express.static("./public"));

// -------------------------------------------------

// MongoDB Configuration configuration (Change this URL to your own DB)
mongoose.connect("mongodb://admin:codingrocks@ds023664.mlab.com:23664/reactlocate");
var db = mongoose.connection;

db.on("error", function(err) {
  console.log("Mongoose Error: ", err);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// -------------------------------------------------

// Main "/" Route. This will redirect the user to our rendered React application
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

// This is the route we will send GET requests to retrieve our most recent search data.
// We will call this route the moment our page gets rendered
app.get("/saved", function(req, res) {

  // We will find all the records, sort it in descending order, then limit the records to 5
  History.find({}).sort([
    ["date", "descending"]
  ]).limit(5).exec(function(err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      console.log(doc);
      var sendBackArray = [];
      for (i=0; i < doc.length; i++) {
        sendBackArray.push(doc[i]);
      }
      console.log(sendBackArray);
      res.send(doc);
    }
  });

  // History.remove({}).exec(function(err, doc) {
  //   if (err) {
  //     console.log(err);
  //   }
  //   else {
  //     console.log(doc);
  //     // res.send(doc.article);
  //   }
  // });
});

// This is the route we will send POST requests to save each search.
app.post("/api", function(req, res) {
  console.log("BODY: ", req.body);

  // Here we'll save the article based on the JSON input.
  // We'll use Date.now() to always get the current date time
  History.create({
    article: req.body.article,
    date: Date.now()
  }, function(err) {
    if (err) {
      console.log(err);
    }
    else {
      res.send("Saved Search");
    }
  });
});

app.post("/delete", function(req, res) {
  console.log("BODY: ", req.body);

  History.remove({ "_id": req.body.id}).exec(function(err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      console.log(doc);
      // res.send(doc.article);
    }
  });
});

// -------------------------------------------------

// Listener
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
