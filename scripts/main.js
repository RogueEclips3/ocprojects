let socket;
function connect() {
    return new Promise((resolve, reject) => {
        const port = 8000;
        const socketUrl = `wss://c05d-75-174-199-73.ngrok.io`;

        socket = new WebSocket(socketUrl);
        socket.onopen = (e) => {
            socket.send(JSON.stringify({"loaded": true}));
            resolve();
        }

        socket.onmessage = (data) => {
            console.log(data);
            let parsedData = JSON.parse(data.data);
            if(parsedData.append === true) {
                const newEl = document.createElement("p");
                newEl.textContent = parsedData.returnText;
                document.getElementById("websocket-returns").appendChild(newEl);
            }
        }

        socket.onerror = (e) => {
            console.log(e);
            resolve();
            connect();
        }
    });
}

function isOpen(ws) {
    return ws.readyState === ws.OPEN;
}

window.onload = function() {
    connect();
    document.getElementById("websocket-button").addEventListener("click", function(e) {
        console.log("fkjasdf")
        if(isOpen(socket)) {
            socket.send(JSON.stringify({
                10: "this is our data to send"
            }));
        }
    });
}

