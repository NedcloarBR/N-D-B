require("dotenv").config();

const Discord = require("discord.js");
const Client = require("./Client/Client");
const Config = require("./Config/Config.json");

const client = new Client(Config)

client.start();