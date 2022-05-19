local robot = require("robot")
local ws = require("websocket_client")
local component = require("component")
local geolyzer = component.geolyzer
local cl

local handleEvent = function(event, message)
    if event == "text" then
        for command in string.gmatch(message, "([^,]+)") do
            if command == "Client connected" then
                cl:send("Robot connected")
                print("Connected to server")
            elseif command == "restart" then
                cl:disconnect()
                ConnectToServer()
                print("Restarted")
            elseif command == "stop" or command == "disconnect" then
                cl:disconnect()
                cl = nil
                print("Disconnected")
            elseif command == "checkblock" then
                local blocks = ""
                for i=0, 5 do
                    blocks = blocks..geolyzer.analyze(i).name..","
                end
                cl:send(blocks)
            else
                pcall(robot[command])
            end
        end
    end
end
cl = ws.create(handleEvent, true)

function ConnectToServer()
    cl:connect("localhost", 8000, "/", false)
end
ConnectToServer()