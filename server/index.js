const app = require("express")();
const http = require("http").Server(app);
const fs = require("fs");

const io = require("socket.io")(http, {
    path: "/presidentclicker/socket.io",
    transports: ["websocket"],
    origins: process.env.NODE_ENV === "production" ?
        "http://presidentclicker.com:*" : "http://localhost:8080" // disable localhost in prod
});
const Big = require("big.js");
const debugLog = require("debug-log")("debug");

const pg = require("pg");
const config = {
    host: process.env.DB_SETTINGS_HOST || "localhost",
    user: process.env.DB_SETTINGS_USER || "presidentclicker",
    password: process.env.DB_SETTINGS_PASSWORD || "vaihdamut",
    database: process.env.DB_SETTINGS_DATABASE || "presidentclicker",
};
const pool = new pg.Pool(config);

const CronJob = require("cron").CronJob;

const exitFileName = "score.json.exit";

var trumpCount;
var trumpCountPreviousBackup = new Big(-1);
var hillaryCount;
var hillaryCountPreviousBackup = new Big(-1);

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
    pool.query("select hillary, trump from score", function(err, result) {
        if (err) {
            debugLog(err.toString());
        }
        console.log("Got score from database:\nhillary: " + result.rows[0].hillary + "\ntrump " + result.rows[0].trump);
        trumpCount = new Big(result.rows[0].trump);
        hillaryCount = new Big(result.rows[0].hillary);
    });
    console.log("process.env.NODE_ENV=" + process.env.NODE_ENV);
    console.log("listening on *:3000");
    debugLog("DB settings:");
    debugLog("process.env.DB_SETTINGS_HOST=" + process.env.DB_SETTINGS_HOST);
    debugLog("process.env.DB_SETTINGS_USER=" + process.env.DB_SETTINGS_USER);
    debugLog("process.env.DB_SETTINGS_PASSWORD=" + process.env.DB_SETTINGS_PASSWORD);
    debugLog("process.env.DB_SETTINGS_DATABASE=" + process.env.DB_SETTINGS_DATABASE);
});

const exitHandler = function(options, err) {
    console.log("exitHandler");
    if (err) console.log("- " + err.stack);
    try {
        fs.writeFileSync(exitFileName, JSON.stringify({
            "t": trumpCount.toFixed(),
            "h": hillaryCount.toFixed()
        }), "utf8");
    } catch (err) {
        console.log("Error writing exit file");
    }
    if (options.exit) process.exit();
}

//do something when app is closing
process.on("exit", exitHandler.bind(null));

//catches ctrl+c event
process.on("SIGINT", exitHandler.bind(null, {
    exit: true
}));

//catches uncaught exceptions
process.on("uncaughtException", exitHandler.bind(null, {
    exit: true
}));

// Save score to DB every 10 seconds if either score has changed:
setInterval(function() {
    if (trumpCount && trumpCountPreviousBackup && hillaryCount && hillaryCountPreviousBackup) {
        if (!trumpCount.eq(trumpCountPreviousBackup) || !hillaryCount.eq(hillaryCountPreviousBackup)) {
            pool.query("update score set hillary = $1, trump = $2", [hillaryCount.toFixed(), trumpCount.toFixed()],
                function(err, result) {
                    debugLog("Database insert to score succeeded!");
                    trumpCountPreviousBackup = new Big(trumpCount);
                    hillaryCountPreviousBackup = new Big(hillaryCount);
                });
        }
    }
}, 10000);

// Save score every 15 mins:
const scoreHistoryJob = new CronJob("* 0,15,30,45 * * * *", function() {
      debugLog("scoreHistoryJob started!");
    pool.query("insert into score_history (timestamp, hillary, trump, SOCKETS_SOCKETS_LENGTH, SOCKETS_CONNECTED_LENGTH) values (current_timestamp, $1, $2, $3, $4)", [hillaryCount.toFixed(), trumpCount.toFixed(), Object.keys(io.sockets.sockets).length, Object.keys(io.sockets.connected).length],
        function(err, result) {
            debugLog("Database insert to score_history succeeded!");
        });
  }, function () {
      console.log("scoreHistoryJob stopped!")
  },
  true /* Start the job right now */
);

// Manually garbage collect every 30 secs if flag set
setInterval(function() {
    if (global.gc) {
        debugLog("Calling global.gc()");
        global.gc();
    } else {
        console.log("Garbage collection unavailable.  Pass --expose-gc " +
            "when launching node to enable forced garbage collection.");
    }
}, 30000);
