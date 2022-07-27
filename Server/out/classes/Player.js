"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
var Agent_1 = require("./Agent");
var Agv_1 = require("./Agv");
var autoAgv_1 = require("./autoAgv");
var socketEvents = require('../socketEvents');
var astar_1 = require("../algorithm/astar");
var Player = /** @class */ (function () {
    function Player(groundPos, doorPos, pathPos) {
        this.groundPos = [];
        this.doorPos = [];
        this.defaultListTile = [];
        this.listTile = [];
        this.busyGrid = {};
        this.agv = new Agv_1.Agv(0, 0, 0, 0, '', '', 0, 0);
        this.autoAgvs = [];
        this.agents = [];
        this.doorPos = doorPos;
        this.astar = new astar_1.AstarSearch(52, 28, groundPos, pathPos);
    }
    Player.prototype.setBusyGridState = function (x, y, state) {
        if (!x || !y)
            return;
        if (!this.busyGrid[x])
            this.busyGrid[x] = {};
        this.busyGrid[x][y] = state;
    };
    Player.prototype.getBusyGridState = function (x, y) {
        return this.busyGrid[x][y];
    };
    Player.prototype.addGameObject = function (_a, socket) {
        var x = _a.x, y = _a.y, width = _a.width, height = _a.height, serverId = _a.serverId, gameObjectType = _a.gameObjectType, gameObjectAttrs = _a.gameObjectAttrs, desX = _a.desX, desY = _a.desY, clientId = _a.clientId;
        switch (gameObjectType) {
            case socketEvents.gameObjectType.agv:
                this.agv = new Agv_1.Agv(x, y, width, height, serverId, '', desX || 0, desY || 0);
                break;
            case socketEvents.gameObjectType.autoAgv:
                this.autoAgvs.push(new autoAgv_1.AutoAgv(x, y, width, height, serverId, clientId || ''));
                break;
            case socketEvents.gameObjectType.agent:
                if (gameObjectAttrs)
                    this.agents.push(new Agent_1.Agent(x, y, width, height, serverId, gameObjectAttrs, this.groundPos, socket, clientId || '', desX || 0, desY || 0, this.astar));
                break;
            default:
        }
    };
    // agents can randomly disapear
    Player.prototype.deleteAgent = function (serverId) {
        var index = -1;
        for (var i = 0; i < this.agents.length; i++) {
            if (this.agents[i].serverId === serverId) {
                index = i;
                break;
            }
        }
        if (index !== -1)
            this.agents.splice(index, 1);
    };
    Player.prototype.updateAllGameObjects = function (agvInfo, autoAgvsInfo, agentsInfo) {
        var _this = this;
        this.agv.x = agvInfo[0].x;
        this.agv.y = agvInfo[0].y;
        var i = 0;
        autoAgvsInfo.forEach(function (info) {
            var currentTmp = _this.autoAgvs[i];
            currentTmp.x = info.x;
            currentTmp.y = info.y;
            currentTmp.serverId = info.serverId;
            i++;
        });
        i = 0;
        agentsInfo.forEach(function (info) {
            var currentTmp = _this.agents[i];
            currentTmp.x = info.x;
            currentTmp.y = info.y;
            currentTmp.serverId = info.serverId;
            i++;
        });
    };
    return Player;
}());
exports.Player = Player;
//# sourceMappingURL=Player.js.map