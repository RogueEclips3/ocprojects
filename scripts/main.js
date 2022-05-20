import * as MAP from "./map.js";

let socket;
function connect() {
    return new Promise((resolve, reject) => {
        const socketUrl = `ws://localhost:8000`;

        socket = new WebSocket(socketUrl);
        socket.onopen = (e) => {
            resolve();
        }

        socket.onmessage = (data) => {
            if(data.data.includes("Robot connected")) {
                var direction = parseInt(data.data.replace("Robot connected, facing ", ""));
                MAP.CreateScene(direction);
            } else if(data.data.includes("Checked blocks: ")) {
                var rawMessage = data.data.replace("Checked blocks: ", "");
                var blocks = rawMessage.split(",");
                blocks.pop();
                MAP.DrawBlocks(blocks);
            } else if(data.data.includes("turn")) {
                MAP.TurnRobot(data.data.replace("turn", ""));
            } else if(data.data.includes("move")) {
                MAP.MoveRobot(data.data.replace("move", ""));
            }
            console.log(data);
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
    // send custom command
    document.getElementById("websocket-button").addEventListener("click", function(e) {
        let message = document.getElementById("websocket-message").value.split(" ");
        if(isOpen(socket)) {
            socket.send(message);
        }
    });
    // assign icon controls
    let icons = document.getElementsByTagName("i");
    for(let i = 0; i < icons.length; i++) {
        icons[i].addEventListener("click", function() {
            if(isOpen(socket)) {
                socket.send(icons[i].getAttribute("operation"));
            }
        });
    }
}
// assign wasd controls
window.addEventListener("keypress", function(event) {
    if(!$("#websocket-message").is(":focus")) {
        if(event.key == "w") {
            socket.send("forward,checkblocks");
        } else if(event.key == "s") {
            socket.send("back,checkblocks");
        } else if(event.key == "a") {
            socket.send("turnLeft");
        } else if(event.key == "d") {
            socket.send("turnRight");
        }
    }
});

export function CheckBlocks() {
    socket.send("checkblocks");
}