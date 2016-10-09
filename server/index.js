const app = require("express")();
const http = require("http").Server(app);
const fs = require("fs");
const io = require("socket.io")(http);
const Big = require("big.js");
const CronJob = require("cron").CronJob;
const debugLog = require("debug-log")("debug");

const fileName = "score.json";

var trumpCount;
var hillaryCount;

app.disable("x-powered-by");

app.get("/ping", function(req, res) {
    res.send("pong");
});

io.on("connection", function(socket) {
    socket.emit("score.trump", trumpCount)
    socket.emit("score.hillary", hillaryCount);
    debugLog("a user connected");
    socket.on("trump", function(msg) {
        trumpCount = trumpCount.plus(1);
        socket.broadcast.emit("score.trump", trumpCount)
    });
    socket.on("hillary", function(msg) {
        hillaryCount = hillaryCount.plus(1);
        socket.broadcast.emit("score.hillary", hillaryCount);
    });
});

http.listen(3000, function() {
    var backup = JSON.parse(fs.readFileSync(fileName, "utf8"));
    trumpCount = new Big(backup.t);
    hillaryCount = new Big(backup.h);
    console.log("process.env.NODE_ENV=" + process.env.NODE_ENV);
    console.log("listening on *:3000");
});

const exitHandler = function(options, err) {
    console.log("exitHandler");
    if (err) console.log("- " + err.stack);
    fs.writeFileSync(fileName + ".exit", JSON.stringify({"t": trumpCount.toFixed(), "h": hillaryCount.toFixed()}), "utf8");
    if (options.exit) process.exit();
}

const saveFile = function(fileName) {
    debugLog("Backing up score...");
    fs.writeFile(fileName, JSON.stringify({"t": trumpCount.toFixed(), "h": hillaryCount.toFixed()}), "utf8", function(err) {
        if (err) {
            console.log("ERROR: File backup failed.");
        } else {
            debugLog("Backup succeeded!");
        }
    });
}

//do something when app is closing
process.on("exit", exitHandler.bind(null));

//catches ctrl+c event
process.on("SIGINT", exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on("uncaughtException", exitHandler.bind(null, {exit:true}));

// Save score to file every 10 seconds:
setInterval(function() {
    saveFile(fileName);
}, 10000);
