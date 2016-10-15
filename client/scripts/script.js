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
    var trumpScoreWorldCount = null;
    var hillaryScoreWorldCount = null;
    var trumpScore = document.getElementById("trumpScore");
    var hillaryScore = document.getElementById("hillaryScore");
    var trumpScoreCount = null;
    var hillaryScoreCount = null;

    if (typeof(Storage) !== "undefined") {
        console.log(localStorage.h);
        console.log(localStorage.t);
        if (localStorage.h && localStorage.t) {
            console.log(":)");
            trumpScoreCount = new Big(localStorage.t);
            hillaryScoreCount = new Big(localStorage.h);
        } else {
            trumpScoreCount = new Big(0);
            hillaryScoreCount = new Big(0);
        }
    } else {
        console.log("localStorage not supported :{");
        trumpScoreCount = new Big(0);
        hillaryScoreCount = new Big(0);
    }

    trumpScore.innerHTML = trumpScoreCount.toFixed();
    hillaryScore.innerHTML = hillaryScoreCount.toFixed();

    function saveToLocalStorage(key, value) {
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem(key, value);
            console.log("saved");
        }
    }

    socket.on("connect", function(err) {
        $("#problem").hide();
    });

    socket.io.on("connect_error", function(err) {
        trumpScoreWorldCount = null;
        hillaryScoreWorldCount = null;
        $("#problem").show();
    });

    trump.onclick = function() {
        socket.emit("t", "1");
        trumpScoreCount = trumpScoreCount.plus(1);
        saveToLocalStorage("t", trumpScoreCount.toFixed());
        trumpScore.innerHTML = trumpScoreCount.toFixed();
        if (trumpScoreWorldCount !== null) {
            trumpScoreWorldCount = trumpScoreWorldCount.plus(1);
            trumpScoreWorld.innerHTML = trumpScoreWorldCount.toFixed();
        }
        return false;
    };

    hillary.onclick = function() {
        socket.emit("h", "1");
        hillaryScoreCount = hillaryScoreCount.plus(1);
        saveToLocalStorage("h", hillaryScoreCount.toFixed());
        hillaryScore.innerHTML = hillaryScoreCount.toFixed();
        if (hillaryScoreWorldCount !== null) {
            hillaryScoreWorldCount = hillaryScoreWorldCount.plus(1);
            hillaryScoreWorld.innerHTML = hillaryScoreWorldCount.toFixed();
        }
        return false;
    };

    socket.on("s.t", function(msg) {
        trumpScoreWorldCount = new Big(msg);
        trumpScoreWorld.innerHTML = trumpScoreWorldCount.toFixed();
    });

    socket.on("s.h", function(msg) {
        hillaryScoreWorldCount = new Big(msg);
        hillaryScoreWorld.innerHTML = hillaryScoreWorldCount.toFixed();
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

    $("body").on("contextmenu", "img", function(e) {
        console.log(":)");
        return false;
    });
});
