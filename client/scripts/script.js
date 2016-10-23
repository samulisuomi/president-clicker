$(function() {
    var socket;
    var socketOptions = {
        path: "/presidentclicker/socket.io",
        transports: ["websocket"]
    }

    if (window.location.host.indexOf("localhost") === -1) {
        socket = io("http://37.139.14.210", socketOptions);
    } else {
        socket = io("localhost:3000", socketOptions);
    }

    var trump = $("#trump");
    var hillary = $("#hillary");
    var trumpScoreWorld = $("#trumpScoreWorld");
    var hillaryScoreWorld = $("#hillaryScoreWorld");
    var trumpScoreWorldCount = null;
    var hillaryScoreWorldCount = null;
    var trumpScore = $("#trumpScore");
    var hillaryScore = $("#hillaryScore");
    var trumpScoreCount = null;
    var hillaryScoreCount = null;
    var openAbout = $("#openAbout");
    var closeAbout = $("#closeAbout");
    var about = $("#about");

    if (typeof(Storage) !== "undefined") {
        if (localStorage.h && localStorage.t) {
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

    trumpScore.text(trumpScoreCount.toFixed());
    hillaryScore.text(hillaryScoreCount.toFixed());

    function saveToLocalStorage(key, value) {
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem(key, value);
        }
    }

    socket.on("connect", function(err) {
        $("#problem").hide();
    });

    socket.io.on("connect_error", function(err) {
        trumpScoreWorldCount = null;
        hillaryScoreWorldCount = null;
        $("#problemText").html("Unfortunately there's some problem with the server connection.");
        $("#problem").show();
    });

    trump.click(function(event) {
        socket.emit("t", "1");
        trumpScoreCount = trumpScoreCount.plus(1);
        saveToLocalStorage("t", trumpScoreCount.toFixed());
        trumpScore.text(trumpScoreCount.toFixed());
        if (trumpScoreWorldCount !== null) {
            trumpScoreWorldCount = trumpScoreWorldCount.plus(1);
            trumpScoreWorld.text(trumpScoreWorldCount.toFixed());
        }
        event.stopPropagation();
        return false;
    });

    hillary.click(function(event) {
        socket.emit("h", "1");
        hillaryScoreCount = hillaryScoreCount.plus(1);
        saveToLocalStorage("h", hillaryScoreCount.toFixed());
        hillaryScore.text(hillaryScoreCount.toFixed());
        if (hillaryScoreWorldCount !== null) {
            hillaryScoreWorldCount = hillaryScoreWorldCount.plus(1);
            hillaryScoreWorld.text(hillaryScoreWorldCount.toFixed());
        }
        event.stopPropagation();
        return false;
    });

    socket.on("s.t", function(msg) {
        trumpScoreWorldCount = new Big(msg);
        trumpScoreWorld.text(trumpScoreWorldCount.toFixed());
    });

    socket.on("s.h", function(msg) {
        hillaryScoreWorldCount = new Big(msg);
        hillaryScoreWorld.text(hillaryScoreWorldCount.toFixed());
    });

    function preventZoom(event) {
        var t2 = e.timeStamp;
        var t1 = e.currentTarget.dataset.lastTouch || t2;
        var dt = t2 - t1;
        var fingers = e.touches.length;
        e.currentTarget.dataset.lastTouch = t2;

        if (!dt || dt > 500 || fingers > 1) return; // not double-tap

        event.preventDefault();
        event.target.click();
    }

    $("body").on("contextmenu", "img", function(e) {
        return false;
    });

    openAbout.click(function(event) {
        about.modal({
            fadeDuration: 100
        });
        event.stopPropagation();
        return false;
    });

    closeAbout.click(function(event) {
        $.modal.close();
        // Because there's a bug with the modal:
        about.css("display", "none");
        window.location.href
        event.stopPropagation();
        return false;
    });
});
