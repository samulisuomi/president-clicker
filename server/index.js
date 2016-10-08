var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var trumpCount;
var hillaryCount;

app.get("/", function(req, res) {
    res.send("/");
});

io.on("connection", function(socket) {
    socket.emit("score.trump", trumpCount)
    socket.emit("score.hillary", hillaryCount);
    console.log("a user connected");
    socket.on("trump", function(msg) {
        trumpCount++;
        socket.broadcast.emit("score.trump", trumpCount)
    });
    socket.on("hillary", function(msg) {
        hillaryCount++;
        socket.broadcast.emit("score.hillary", hillaryCount);
    });
});

http.listen(3000, function() {
    trumpCount = 0;
    hillaryCount = 0;
    console.log("listening on *:3000");
});

// Send score to everyone every n seconds:
