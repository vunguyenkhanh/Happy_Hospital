"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Player_1 = require("./classes/Player");
var Physic_1 = require("./classes/Physic");
var socketEvents = __importStar(require("./socketEvents"));
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var app = (0, express_1.default)();
var server = require('http').Server(app);
var io = require('socket.io')(server, {
    cors: {
        origin: '*',
    },
});
server.listen(process.env.PORT || 5000);
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST'],
}));
var players = {}; // currenlty there's only one socket-player
var physicObject = new Physic_1.Physic();
var overlappedAgv = [];
var overlappedAutoAgvs = [];
io.on('connection', function (socket) {
    socket.on(socketEvents.events.newClient, function (_a) {
        var _b = _a.groundPos, groundPos = _b === void 0 ? [] : _b, _c = _a.doorPos, doorPos = _c === void 0 ? [] : _c, _d = _a.pathPos, pathPos = _d === void 0 ? [] : _d;
        console.log('-----------------------------------------------------\nNew client connected!, with id: ', socket.id);
        players[socket.id] = new Player_1.Player(groundPos, doorPos, pathPos);
    });
    socket.on(socketEvents.events.disconnect, function () {
        delete players[socket.id];
        console.log('Client ' + socket.id + ' disconnected!');
    });
    socket.on(socketEvents.events.updateServerPlayerControl, function (userCommand) {
        console.log(userCommand);
        // players[socket.id].updateControl(userCommand);
    });
    socket.on(socketEvents.events.userLoadedDataFromVadere, function (importAgents) {
        console.log('User upload from vadere!');
        //
        console.table(importAgents);
        socket.emit(socketEvents.events.tellClientLoadedDataFromVadere, importAgents);
        // players[socket.id].updateControl(userCommand);
    });
    socket.on(socketEvents.events.sendGameObjectToServer, function (gameObject) {
        if (!players[socket.id])
            return;
        players[socket.id].addGameObject(gameObject, socket);
    });
    socket.on(socketEvents.events.deleteAgentOnServer, function (_a) {
        var serverId = _a.serverId, clientId = _a.clientId;
        if (!players[socket.id])
            return;
        console.log("Agent ".concat(clientId, " \u0111\u00E3 b\u1ECB xo\u00E1 kh\u1ECFi m\u00E0n ch\u01A1i!"));
        players[socket.id].deleteAgent(serverId);
    });
    socket.on(socketEvents.events.onChangeMaxAgent, function (numAgent) {
        if (!players[socket.id])
            return;
        console.log("Client \u0111\u00E3 thay \u0111\u1ED5i s\u1ED1 l\u01B0\u1EE3ng agent l\u00E0 ".concat(numAgent));
    });
    socket.on(socketEvents.events.onClientSaveData, function (data) {
        if (!players[socket.id])
            return;
        console.log("Client \u0111\u00E3 l\u01B0u d\u1EEF li\u1EC7u!");
        console.log(data);
    });
    socket.on(socketEvents.events.agentRequestNewPath, function (data) {
        if (!players[socket.id])
            return;
        var agent = players[socket.id].agents.find(function (agent) { return agent.serverId === data.id; });
        if (!agent)
            return;
        agent.recal(data.currentPos, socket);
    });
    socket.on(socketEvents.events.onClientLoadData, function (data) {
        if (!players[socket.id])
            return;
        console.log("Client \u0111\u00E3 t\u1EA3i d\u1EEF li\u1EC7u!");
        console.log(data);
    });
    socket.on(socketEvents.events.onClientChangeAgvAlgorithm, function (alm) {
        console.log('Client đã thay đổi thuật toán AGV thành ' + alm);
    });
    socket.on(socketEvents.events.updateGameObjectsOnServer, function (agvInfo, autoAgvsInfo, agentsInfo) {
        if (!players[socket.id])
            return;
        players[socket.id].updateAllGameObjects(agvInfo, autoAgvsInfo, agentsInfo);
        if (!players[socket.id].agv.finish &&
            physicObject.checkFinish(players[socket.id].agv)) {
            players[socket.id].agv.finish = true;
            console.log('Bạn đã kết thúc màn chơi!');
            socket.emit(socketEvents.events.clientFinish);
        }
        // check collide list of agvs with agents (only one main agv -- the player)
        overlappedAgv = physicObject.checkOverlap([players[socket.id].agv], players[socket.id].agents, socket);
        if (overlappedAgv.length !== 0) {
            // console.log('main player overlapped with agents!')
            socket.emit(socketEvents.events.tellClientMainAgvOverlapped, overlappedAgv);
        }
        // check collide list of auto agvs with agents
        overlappedAutoAgvs = physicObject.checkOverlap(players[socket.id].autoAgvs, players[socket.id].agents, socket);
        if (overlappedAutoAgvs.length !== 0) {
            // console.log('some auto agvs overlapped with agents!')
            socket.emit(socketEvents.events.tellClientAutoAgvsOverlapped, overlappedAutoAgvs);
        }
        physicObject.checkAgentOverlap(players[socket.id].agents, socket);
        // console.log('agents overlapped!')
        // console.log(JSON.stringify(overlappedAgv))
        // console.log(JSON.stringify(overlappedAutoAgvs));  // test player overlapped
    });
});
// setInterval(serverLoop, 1000/60);
// function serverLoop () {
//   // convert user command to velocity and new position of "all" players
//   for (const socketId in players) {
//     let player = players[socketId];
//     player.update();
//     // playersPos[socketId].x = player.x;
//     // playersPos[socketId].y = player.y;
//     playersVel[socketId].velX = player.velX;
//     playersVel[socketId].velY = player.velY;
//   }
//   console.log(playersPos);
//   // emit position to "all" socket of "all" players in every frame
//   io.emit(socketEvents.events.sendClientPosition, playersPos);
//   io.emit(socketEvents.events.sendClientVel, playersVel);
// }
//# sourceMappingURL=server.js.map