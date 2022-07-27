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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agent = void 0;
var actor_1 = require("./actor");
var position_1 = require("./position");
var text_1 = require("./text");
var AStarSearch_1 = require("../algorithm/AStarSearch");
var uniqid_1 = __importDefault(require("uniqid"));
var socketEvents = __importStar(require("../socketEvents"));
var Agent = /** @class */ (function (_super) {
    __extends(Agent, _super);
    function Agent(scene, startPos, endPos, groundPos, id) {
        var _this = _super.call(this, scene, startPos.x * 32, startPos.y * 32, 'tiles_spr', 17) || this;
        _this.next = 1;
        _this.isOverlap = false;
        _this.speed = 38;
        _this.avoiding = false;
        _this.overlapTimer = 0;
        _this.activeTimer = 0;
        _this.sizeWidth = 32;
        _this.sizeHeight = 32;
        _this.startPos = startPos;
        _this.endPos = endPos;
        _this.groundPos = groundPos;
        _this.path = [];
        _this.vertexs = [];
        _this.id = id;
        _this.speed = Math.floor(Math.random() * (_this.speed - 10)) + 10;
        _this.endText = new text_1.Text(_this.scene, endPos.x * 32 + 6, endPos.y * 32, id.toString(), '28px');
        _this.scene.physics.add.overlap(_this, _this.endText, function () {
            console.log(_this.endText.text);
        });
        _this.agentText = new text_1.Text(_this.scene, startPos.x * 32, startPos.y * 32 - 16, id.toString());
        _this.astar = new AStarSearch_1.Astar(52, 28, startPos, endPos, groundPos);
        _this.vertexs = _this.astar.cal() || [];
        // console.log(this.vertexs)
        // PHYSICS
        _this.getBody().setSize(31, 31);
        _this.setOrigin(0, 0);
        _this.serverId = (0, uniqid_1.default)();
        // socket: send agents to server
        socketEvents.sendGameObjectToServer({
            x: _this.x,
            y: _this.y,
            width: _this.sizeWidth,
            height: _this.sizeHeight,
            serverId: _this.serverId,
            gameObjectType: socketEvents.gameObjectType.agent,
        });
        // this.active = false
        _this.handleAvoid(new position_1.Position(Math.floor(_this.x / 32) - 1, Math.floor(_this.y / 32)));
        return _this;
    }
    Agent.prototype.goToDestinationByVertexs = function () {
        if (this.avoiding)
            return;
        if (this.next == this.vertexs.length) {
            this.agentText.setText('DONE');
            this.agentText.setFontSize(12);
            this.agentText.setX(this.x - 1);
            this.x = this.vertexs[this.vertexs.length - 1].x * 32;
            this.y = this.vertexs[this.vertexs.length - 1].y * 32;
            this.setVelocity(0, 0);
            this.eliminate();
            return;
        }
        if (!this.active) {
            this.setVelocity(0, 0);
            return;
        }
        if (Math.abs(this.vertexs[this.next].x * 32 - this.x) > 1 ||
            Math.abs(this.vertexs[this.next].y * 32 - this.y) > 1) {
            if (this.isOverlap) {
                this.scene.physics.moveTo(this, this.vertexs[this.next].x * 32, this.vertexs[this.next].y * 32, this.speed);
            }
            else {
                this.scene.physics.moveTo(this, this.vertexs[this.next].x * 32, this.vertexs[this.next].y * 32, this.speed);
            }
            this.agentText.setX(this.x);
            this.agentText.setY(this.y - 16);
        }
        else {
            this.next++;
        }
    };
    Agent.prototype.preUpdate = function () {
        this.goToDestinationByVertexs();
    };
    Agent.prototype.getStartPos = function () {
        return this.startPos;
    };
    Agent.prototype.getEndPos = function () {
        return this.endPos;
    };
    Agent.prototype.getId = function () {
        return this.id;
    };
    Agent.prototype.eliminate = function () {
        this.scene.events.emit('destroyAgent', this);
        this.endText.destroy();
        this.agentText.destroy();
        this.destroy();
    };
    Agent.prototype.pause = function () {
        this.setVelocity(0, 0);
        this.setActive(false);
    };
    Agent.prototype.restart = function () {
        this.setActive(true);
    };
    Agent.prototype.handleOverlap = function (isStand) {
        var _this = this;
        if (isStand === void 0) { isStand = false; }
        if (this.isOverlap)
            return;
        this.isOverlap = true;
        if (this.overlapTimer)
            clearTimeout(this.overlapTimer);
        this.overlapTimer = setTimeout(function () {
            _this.isOverlap = false;
        }, 4000);
        if (isStand) {
            this.setVelocity(0, 0);
            this.setActive(false);
            if (this.activeTimer)
                clearTimeout(this.activeTimer);
            this.activeTimer = setTimeout(function () {
                _this.setActive(true);
            }, 2000);
        }
    };
    Agent.prototype.handleAvoid = function (position) {
        if (this.next == this.vertexs.length) {
            this.agentText.setText('DONE');
            this.agentText.setFontSize(12);
            this.agentText.setX(this.x - 1);
            this.x = this.vertexs[this.vertexs.length - 1].x * 32;
            this.y = this.vertexs[this.vertexs.length - 1].y * 32;
            this.setVelocity(0, 0);
            this.eliminate();
            return;
        }
        if (this.next + 1 == this.vertexs.length)
            return;
        var index = this.vertexs.findIndex(function (vertex) { return vertex.x === position.x && vertex.y === position.y; });
        this.avoiding = true;
        //When the barrier is not in the vertexs, continue to trajectory
        if (index === -1)
            return;
        // this.scene.physics.moveTo(this, this.x + 32, this.y + 32, this.speed)
        var avoidingPosition = this.astar.getAvoidPath(position, this.vertexs[this.next + 1]);
    };
    return Agent;
}(actor_1.Actor));
exports.Agent = Agent;
//# sourceMappingURL=agent.js.map