const express = require("express");
const WebSocket = require("ws");
const SocketServer = require("ws").Server;

const server = express().listen(8000, function() {
    console.log("Server now running on port 8000");
});

const wss = new SocketServer({server: server, path: "/"});
console.log(wss.path);
wss.on("connection", function(ws) {
    console.log("[Server] Client connected");
    ws.on("close", () => console.log("[Server] Client disconnected"));
    ws.on("message", function(message)  {
        console.log("[Server] Received message: %s", message);
        wss.clients.forEach(function each(client) {
            if(client != ws && client.readyState == WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});