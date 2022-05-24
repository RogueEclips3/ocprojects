local robot = require("robot")
local ws = require("websocket_client")
local component = require("component")
local geolyzer = component.geolyzer
local navigation = component.navigation
local controller = component.inventory_controller
local cl

function AnalyzeBlocks()
    local blocks = "Checked blocks: "
    for i=0, 5 do
        blocks = blocks..geolyzer.analyze(i).name..","
    end
    return blocks
end

local handleEvent = function(event, message)
    if event == "text" then
        for command in string.gmatch(message, "([^,]+)") do
            if command == "Client connected" then
                cl:send("Robot connected, facing "..navigation.getFacing())
                cl:send("Selected slot: "..robot.select())
                print("Connected to server")
            elseif command == "restart" then
                cl:disconnect()
                ConnectToServer()
                print("Restarted")
            elseif command == "stop" or command == "disconnect" then
                cl:disconnect()
                cl = nil
                print("Disconnected")
            elseif command == "checkblocks" then
                cl:send(AnalyzeBlocks())
            elseif command == "checkinv" then
                local inventory = "Inventory: "
                for i=1, robot.inventorySize() do
                    local stack = controller.getStackInInternalSlot(i)
                    if stack then
                        local entry = stack.size..";"..stack.name..";"..i
                        inventory = inventory..entry..","
                    else
                        inventory = inventory.."0;minecraft:air;"..i..","
                    end
                end
                cl:send(inventory)
            elseif string.match(command, "select") then
                local rawMessage = string.gsub(command, "select", "")
                local index = tonumber(rawMessage)
                robot.select(index)
            else
                -- controls
                if command == "forward" or command == "back" or command == "up" or command == "down" then
                    if command == "forward" then
                        if not geolyzer.detect(3) then
                            cl:send("moveforward")
                            pcall(robot[command])
                        end
                    elseif command == "back" then
                        if not geolyzer.detect(2) then
                            cl:send("moveback")
                            pcall(robot[command])
                        end
                    elseif command == "up" then
                        if not geolyzer.detect(1) then
                            cl:send("moveup")
                            pcall(robot[command])
                        end
                    else
                        if not geolyzer.detect(0) then
                            cl:send("movedown")
                            pcall(robot[command])
                        end
                    end
                else
                    pcall(robot[command])
                    if command.find(command, "turn") then
                        cl:send(command);
                    end
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