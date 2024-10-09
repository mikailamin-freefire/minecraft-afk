const express = require("express");
const http = require("http");
const mineflayer = require('mineflayer');
const pvp = require('mineflayer-pvp').plugin;
const { pathfinder, Movements, goals} = require('mineflayer-pathfinder');
const mc = require('minecraft-protocol');
const AutoAuth = require('mineflayer-auto-auth');
const app = express();

const server_ip = 'mikailserver.aternos.me';
const server_port = 30505;

const bot = mineflayer.createBot({
    host: server_ip, 
    version: false,
    username: 'AFK_BOT',
    port: server_port,
    plugins: [AutoAuth],
    AutoAuth: 'bot112022'
});

bot.loadPlugin(pvp);
bot.loadPlugin(pathfinder);

bot.on('physicTick', () => {
    const filter = entity => entity.type === 'mob' && entity.displayName === 'Zombie' || entity.displayName === 'Creeper' || entity.displayName === 'Skeleton' || entity.displayName === 'Spider';
    const entity = bot.nearestEntity(filter);
    if (entity) {
        bot.pvp.attack(entity);
    }
});

bot.on('login', (spawn) => {
    console.log("Congratulations, your player has been logged in to the server!");
    app.use(express.json());
    app.get("/", (_, res) => res.send(`Bot is running on server!\nServer informations:\n  IP: ${server_ip}\n  Port: ${server_port}`));
    app.listen(process.env.PORT);
});

bot.on('end', (reason) => {
    console.error("Bot connection failed and going to end!");
    console.log(reason);
});
