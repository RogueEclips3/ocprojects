local event = require("event")
local robot = require("robot")

function GetMessage()
    local name, from, to, maxdistance, distance, message1, message2 = event.pull("modem")
    if message1 ~= "stop" then
        if message1 == "move" then
            if message2 then
                if pcall(robot[message2]) then
                    print("moved " .. message2)
                else
                    print("cannot move " .. message2)
                end
            end
        end
        if message1 == "turn" then
            if message2 then
                if pcall(robot["turn" .. message2:gsub("^%l", string.upper)]) then
                    print("turned " .. message2)
                else
                    print("cannot turn " .. message2)
                end
            end
        end
        if message1 == "suck" then
            if message2 then
                if pcall(robot["suck" .. message2:gsub("^%l", string.upper)]) then
                    print("sucked " .. message2)
                else
                    print("cannot suck " .. message2)
                end
            else
                pcall(robot.suck)
                print("sucked")
            end
        end
        if message1 == "swing" then
            if message2 then
                if pcall(robot["swing" .. message2:gsub("^%l", string.upper)]) then
                    print("swung " .. message2)
                else
                    print("cannot swing " .. message2)
                end
            else
                pcall(robot.swing)
                print("swung")
            end
        end
        if message1 == "place" then
            if message2 then
                if pcall(robot["place" .. message2:gsub("^%l", string.upper)]) then
                    print("placed " .. message2)
                else
                    print("cannot place " .. message2)
                end
            else
                pcall(robot.place)
                print("placed")
            end
        end
        GetMessage()
    end
end
GetMessage()
