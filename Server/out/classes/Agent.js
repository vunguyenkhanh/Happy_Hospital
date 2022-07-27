"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agent = void 0;
var movingGameObject_1 = require("./movingGameObject");
var algorithm_1 = require("../algorithm");
var position_1 = require("./position");
var socketEvents = __importStar(require("../socketEvents"));
var Agent = /** @class */ (function (_super) {
    __extends(Agent, _super);
    function Agent(x, y, sizeWidth, sizeHeight, serverId, agentObject, groundPos, socket, clientId, desX, desY, astar) {
        var _this = _super.call(this, x, y, sizeWidth, sizeHeight, serverId, clientId) || this;
        _this.vertexs = [];
        _this.id = agentObject.id;
        _this.desX = desX;
        _this.desY = desY;
        // this.vertexs = calPathAstarGrid(
        //   52,
        //   28,
        //   groundPos,
        //   new Position(agentObject.startPos.x, agentObject.startPos.y),
        //   new Position(agentObject.endPos.x, agentObject.endPos.y)
        // )
        _this.vertexs = astar.search(new position_1.Position(agentObject.startPos.x, agentObject.startPos.y), new position_1.Position(agentObject.endPos.x, agentObject.endPos.y));
        _this.groundPos = groundPos;
        console.log("Agent ".concat(_this.id, " \u0111\u00E3 \u0111\u01B0\u1EE3c t\u1EA1o \u0111\u01B0\u1EDDng \u0111i v\u00E0 th\u00EAm v\u00E0o m\u00E0n ch\u01A1i!"));
        socket.emit(socketEvents.events.sendAgentPathToClient, {
            id: _this.id,
            vertexs: _this.vertexs,
        });
        return _this;
    }
    Agent.prototype.recal = function (pos, socket) {
        this.vertexs = (0, algorithm_1.calPathAstarGrid)(52, 28, this.groundPos, new position_1.Position(pos.x, pos.y), new position_1.Position(this.desX, this.desY));
        socket.emit(socketEvents.events.sendAgentPathToClient, {
            id: this.id,
            vertexs: this.vertexs,
        });
    };
    return Agent;
}(movingGameObject_1.movingGameObject));
exports.Agent = Agent;
//# sourceMappingURL=Agent.js.map