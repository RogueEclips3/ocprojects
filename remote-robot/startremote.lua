local robot = require("robot")
local ws = require("websocket_client")
local component = require("component")
local geolyzer = component.geolyzer
local cl

function AnalyzeBlocks()
    local blocks = "Checked blocks: "
    for i=0, 5 do
        blocks = blocks..geolyzer.analyze(i).name..","
    end
    print("Checked blocks")
    return blocks
end

local handleEvent = function(event, message)
    if event == "text" then
        for command in string.gmatch(message, "([^,]+)") do
            if command == "Client connected" then
                cl:send(AnalyzeBlocks())
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
                cl:send(AnalyzeBlocks())
            else
                pcall(robot[command])
                if command.find(command, "turn") then
                    cl:send(command);
                elseif command == "forward" or command == "back" or command == "up" or command == "down" then
                    cl:send("move"..command)
                end
            end
        end
    end
end
cl = ws.create(handleEvent, true)

function ConnectToServer()
    cl:connect("localhost", 8000, "/", false)
end
ConnectToServer()