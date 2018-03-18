/******************************************************************************\
* HTTP Logger
* 
* Christoph Soehnel
* March 18th, 2018
*
* Simple node.js app for tracking deep learning training jobs in a mongodb.
\******************************************************************************/

var express = require("express");
var mongoose = require("mongoose")
var bodyParser = require("body-parser")
var app = express();

// Change as needed
var port = 3000;

// Change as needed
var dljobSchema = new mongoose.Schema({
    machine: String,
    numberOfEpochs: Number,
    currentEpoch: Number,
    batchesPerEpoch: Number,
    currentBatch: Number,
    timePerBatch: String,
    timeElapsed: String,
    timeRemaining: String,
    lossD: Number,
    lossG: Number,
    lossL1: Number,
    EPE: Number,
    comment: String
});
var dljob = mongoose.model("dljob", dljobSchema);

mongoose.Promise = global.Promise;

// Change as needed
mongoose.connect("mongodb://mongo:27017/dlstatusmonitor");

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));

app.post("/add", (req, res) => {
    var job = new dljob(req.body);
    job.save()
    .then(item => {
        console.log(item);
        res.status(200).send(item);        
    })
    .catch(err => {
        console.log("Error creating job id " + job._id.toString() + ".");
        res.status(400).send("ERR");
    });
});

app.put("/update", (req, res) => {
    console.log(req.body)
    dljob.findOneAndUpdate({ _id: req.body.id}, {'$set': req.body.job})
    .then(item => {
        console.log(item);
        res.status(200).send(item);
    })
    .catch(err => {
        console.log("Error updating " + req.body.id + ".");
        res.status(400).send("ERR");
    });
});

app.delete("delete", (req, res) => {
    dljob.findOneAndRemove({ _id: req.body.id })
    .then(item => {
        console.log(item);
        res.status(200).send(item);
    })
    .catch(err => {
        console.log("Error deleting " + req.body.id + ".");
        res.status(400).send("ERR");
    });
});

app.get("/status", (req, res) => {
    dljob.find({})
    .then(item => {
        console.log(item);
        res.status(200).send(item);
    })
    .catch(err => {
        console.log("Error retrieving status.");
        res.status(400).send("ERR");
    });
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});