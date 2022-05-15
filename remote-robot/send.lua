local shell = require("shell")
local args = shell.parse(...)

local event = require("event")
local component = require("component")
local tunnel = component.tunnel
tunnel.send(args[1], args[2])
local name, from, to, maxdistance, distance, message = event.pull("modem")
print(message)