local shell = require("shell")
local args = shell.parse(...)

local component = require("component")
local tunnel = component.tunnel
tunnel.send(args[1], args[2])
