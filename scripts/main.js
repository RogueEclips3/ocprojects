window.onload = function() {
    var socket = new WebSocket("wss://joshuar2024.smtchs.org");
    socket.onopen = function(e) {
        console.log("[OPEN] Connection established");
        console.log("Sending to server");
        socket.send("My name is John");
    };

    socket.onmessage = function(event) {
        console.log(`[MESSAGE] Data received from server: ${event.data}`);
    };

    socket.onclose = function(event) {
        if (event.wasClean) {
            console.log(`[CLOSE] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            console.log('[CLOSE] Connection died');
        }
    };

    socket.onerror = function(error) {
        console.log("[ERROR] " + error);
    };
}