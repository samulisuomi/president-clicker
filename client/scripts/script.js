$(function() {
    var socket;
    var socketOptions = {
        path: "/presidentclicker",
        transports: ["websocket"]
    }

    if (window.location.host.indexOf("localhost") === -1) {
        socket = io("http://37.139.14.210", socketOptions);
    } else {
        socket = io("localhost:3000", socketOptions);
    }

    var trump = document.getElementById("trump");
    var hillary = document.getElementById("hillary");
    var trumpScoreWorld = document.getElementById("trumpScoreWorld");
    var hillaryScoreWorld = document.getElementById("hillaryScoreWorld");
    var trumpScoreWorldCount = -1;
    var hillaryScoreWorldCount = -1;
    var trumpScore = document.getElementById("trumpScore");
    var hillaryScore = document.getElementById("hillaryScore");
    var trumpScoreCount = 0;
    var hillaryScoreCount = 0;

    socket.on("connect", function(err) {
        $("#problem").hide();
    });

    socket.io.on("connect_error", function(err) {
        trumpScoreWorldCount = -1;
        hillaryScoreWorldCount = -1;
        $("#problem").show();
    });

    trump.onclick = function() {
        socket.emit("trump", "1");
        trumpScoreCount++;
        trumpScore.innerHTML = trumpScoreCount;
        if (trumpScoreWorldCount !== -1) {
            trumpScoreWorldCount++;
            trumpScoreWorld.innerHTML = trumpScoreWorldCount;
        }
        return false;
    };

    hillary.onclick = function() {
        socket.emit("hillary", "1");
        hillaryScoreCount++;
        hillaryScore.innerHTML = hillaryScoreCount;
        if (hillaryScoreWorldCount !== -1) {
            hillaryScoreWorldCount++;
            hillaryScoreWorld.innerHTML = hillaryScoreWorldCount;
        }
        return false;
    };

    socket.on("score.trump", function(msg) {
        trumpScoreWorldCount = Number(msg);
        trumpScoreWorld.innerHTML = trumpScoreWorldCount;
    });

    socket.on("score.hillary", function(msg) {
        hillaryScoreWorldCount = Number(msg);
        hillaryScoreWorld.innerHTML = hillaryScoreWorldCount;
    });

    function preventZoom(e) {
        var t2 = e.timeStamp;
        var t1 = e.currentTarget.dataset.lastTouch || t2;
        var dt = t2 - t1;
        var fingers = e.touches.length;
        e.currentTarget.dataset.lastTouch = t2;

        if (!dt || dt > 500 || fingers > 1) return; // not double-tap

        e.preventDefault();
        e.target.click();
    }
});
