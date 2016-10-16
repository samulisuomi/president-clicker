const app = require("express")();
const http = require("http").Server(app);
const fs = require("fs");
const io = require("socket.io")(http, {
    path: "/presidentclicker/socket.io",
    transports: ['websocket'],
    origins: process.env.NODE_ENV === "production" ?
      "http://presidentclicker.com:*" : "http://localhost:8080" // disable localhost in prod
});
const Big = require("big.js");
const debugLog = require("debug-log")("debug");

const fileName = "score.json";

var trumpCount;
var hillaryCount;

app.disable("x-powered-by");

app.use(function(req, res, next) {
    if (process.env.NODE_ENV === "production") {
        res.header("Access-Control-Allow-Origin", "http://presidentclicker.com");
    } else {
        res.header("Access-Control-Allow-Origin", "http://127.0.0.1");
    }
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/ping", function(req, res) {
    res.send("pong");
});

io.on("connection", function(socket) {
    socket.emit("s.t", trumpCount)
    socket.emit("s.h", hillaryCount);
    debugLog("a user connected");
    socket.on("t", function(msg) {
        trumpCount = trumpCount.plus(1);
        socket.volatile.broadcast.emit("s.t", trumpCount)
    });
    socket.on("h", function(msg) {
        hillaryCount = hillaryCount.plus(1);
        socket.volatile.broadcast.emit("s.h", hillaryCount);
    });
});

http.listen(3000, function() {
    var backup;
    try {
        backup = JSON.parse(fs.readFileSync(fileName, "utf8"));
        trumpCount = new Big(backup.t);
        hillaryCount = new Big(backup.h);
    } catch (err) {
        if (err.code === "ENOENT") {
            console.log("Backup not found, starting score from zero!");
            trumpCount = new Big(0);
            hillaryCount = new Big(0);
        } else {
            throw err;
        }
    }
    console.log("process.env.NODE_ENV=" + process.env.NODE_ENV);
    console.log("listening on *:3000");
});

const exitHandler = function(options, err) {
    console.log("exitHandler");
    if (err) console.log("- " + err.stack);
    try {
      fs.writeFileSync(fileName + ".exit", JSON.stringify({"t": trumpCount.toFixed(), "h": hillaryCount.toFixed()}), "utf8");
    } catch (err) {
        console.log("Error writing exit file");
    }
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

// Manually garbage collect every 30 secs if flag set
setInterval(function() {
    if (global.gc) {
        debugLog("Calling global.gc()");
        global.gc();
    } else {
        console.log('Garbage collection unavailable.  Pass --expose-gc ' +
            'when launching node to enable forced garbage collection.');
    }
}, 30000);
