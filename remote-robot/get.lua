local event = require("event")
local robot = require("robot")
local component = require("component")
local tunnel = component.tunnel
local internet = require("internet")

function Feedback(data)
    tunnel.send(data)
    print(data)
end

function GetMessage()
    local name, from, to, maxdistance, distance, message1, message2 = event.pull("modem")
    if message1 ~= "stop" then
        if message1 == "move" then
            if message2 then
                if pcall(robot[message2]) then
                    Feedback("moved " .. message2)
                else
                    Feedback("cannot move " .. message2)
                end
            end
        elseif message1 == "turn" then
            if message2 then
                if pcall(robot["turn" .. message2:gsub("^%l", string.upper)]) then
                    Feedback("turned " .. message2)
                else
                    Feedback("cannot turn " .. message2)
                end
            end
        elseif message1 == "suck" then
            if message2 then
                if pcall(robot["suck" .. message2:gsub("^%l", string.upper)]) then
                    Feedback("sucked " .. message2)
                else
                    Feedback("cannot suck " .. message2)
                end
            else
                pcall(robot.suck)
                Feedback("sucked")
            end
        elseif message1 == "swing" then
            if message2 then
                if pcall(robot["swing" .. message2:gsub("^%l", string.upper)]) then
                    Feedback("swung " .. message2)
                else
                    Feedback("cannot swing " .. message2)
                end
            else
                pcall(robot.swing)
                Feedback("swung")
            end
        elseif message1 == "place" then
            if message2 then
                if pcall(robot["place" .. message2:gsub("^%l", string.upper)]) then
                    Feedback("placed " .. message2)
                else
                    Feedback("cannot place " .. message2)
                end
            else
                pcall(robot.place)
                Feedback("placed")
            end
        elseif message1 == "connect" then
            local handle = internet.open("http://127.0.0.1:5500", 5500)
            local data = handle:read(10)
            Feedback(data)
            handle:close()
        else
            Feedback(message1 .. " is not recognized as command")
        end
        GetMessage()
    else
        Feedback("stopped")
    end
end
GetMessage()