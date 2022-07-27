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
exports.AutoAgv = void 0;
var actor_1 = require("./actor");
var text_1 = require("./text");
var node_1 = require("./node");
var RunningState_1 = require("./statesOfAutoAGV/RunningState");
var uniqid_1 = __importDefault(require("uniqid"));
var socketEvents = __importStar(require("../socketEvents")); // Generated by https://quicktype.io
var AutoAgv = /** @class */ (function (_super) {
    __extends(AutoAgv, _super);
    function AutoAgv(scene, x, y, endX, endY, graph) {
        var _this = _super.call(this, scene, x * 32, y * 32, 'agv') || this;
        _this.sizeWidth = 32;
        _this.sizeHeight = 32;
        _this.isDisable = false; // biến cần cho xử lý overlap =))
        _this.disableTimer = null;
        _this.startX = x * 32;
        _this.startY = y * 32;
        _this.endX = endX * 32;
        _this.endY = endY * 32;
        _this.graph = graph;
        _this.getBody().setSize(32, 32);
        _this.setOrigin(0, 0);
        _this.cur = 0;
        _this.waitT = 0;
        _this.curNode = _this.graph.nodes[x][y];
        _this.curNode.setState(node_1.StateOfNode2D.BUSY);
        _this.endNode = _this.graph.nodes[endX][endY];
        _this.firstText = new text_1.Text(_this.scene, endX * 32, endY * 32, 'DES', '16px', '#F00');
        _this.path = _this.calPathAStar(_this.curNode, _this.endNode);
        _this.stepsMoved = 0;
        _this.timesMoved = performance.now();
        _this.estimateArrivalTime(x * 32, y * 32, endX * 32, endY * 32);
        _this.hybridState = new RunningState_1.RunningState();
        _this.serverId = (0, uniqid_1.default)();
        // socket: send autoAgv to server
        socketEvents.sendGameObjectToServer({
            x: _this.x,
            y: _this.y,
            width: _this.sizeWidth,
            height: _this.sizeHeight,
            serverId: _this.serverId,
            gameObjectType: socketEvents.gameObjectType.autoAgv,
        });
        return _this;
    }
    AutoAgv.prototype.preUpdate = function (time, delta) {
        var _a;
        (_a = this.hybridState) === null || _a === void 0 ? void 0 : _a.move(this);
    };
    AutoAgv.prototype.calPathAStar = function (start, end) {
        return this.graph.calPathAStar(start, end);
    };
    AutoAgv.prototype.changeTarget = function () {
        var mainScene = this.scene;
        var agvsToGate1 = mainScene.mapOfExits.get('Gate1');
        var agvsToGate2 = mainScene.mapOfExits.get('Gate2');
        var choosenGate = agvsToGate1[2] < agvsToGate2[2] ? 'Gate1' : 'Gate2';
        var newArray = mainScene.mapOfExits.get(choosenGate);
        newArray[2]++;
        mainScene.mapOfExits.set(choosenGate, newArray);
        this.startX = this.endX;
        this.startY = this.endY;
        var xEnd = newArray[0];
        var yEnd = newArray[1];
        this.endX = xEnd * 32;
        this.endY = yEnd * 32;
        var finalAGVs = mainScene.mapOfExits.get(choosenGate)[2];
        this.endNode = this.graph.nodes[xEnd][yEnd];
        this.firstText = new text_1.Text(this.scene, xEnd * 32, yEnd * 32, 'DES_' + finalAGVs, '16px', '#F00');
        this.path = this.calPathAStar(this.curNode, this.endNode);
        this.cur = 0;
        this.stepsMoved = 0;
        this.timesMoved = performance.now();
        this.estimateArrivalTime(32 * this.startX, 32 * this.startY, this.endX * 32, this.endY * 32);
    };
    AutoAgv.prototype.update = function () {
        console.log('updated!');
        if (this.isDisable)
            return;
        _super.prototype.update.call(this);
    };
    AutoAgv.prototype.eliminate = function () {
        var _a;
        (_a = this.firstText) === null || _a === void 0 ? void 0 : _a.destroy();
        this.destroy();
    };
    AutoAgv.prototype.toJson = function () {
        var _a;
        return {
            x: this.x,
            y: this.y,
            sizeWidth: this.sizeWidth,
            sizeHeight: this.sizeHeight,
            serverId: this.serverId,
            endX: this.endX,
            endY: this.endY,
            startX: this.startX,
            startY: this.startY,
            cur: this.cur,
            waitT: this.waitT,
            stepsMoved: this.stepsMoved,
            timesMoved: this.timesMoved,
            firstText: ((_a = this.firstText) === null || _a === void 0 ? void 0 : _a.text) || '',
            visible: this.visible,
            scale: this.scale,
            type: this.type,
            originX: this.originX,
            originY: this.originY,
            alpha: this.alpha,
            name: this.name,
            textureKey: this.texture.key,
        };
    };
    AutoAgv.prototype.handleOverlap = function () {
        var _this = this;
        this.isDisable = true;
        if (this.disableTimer)
            clearTimeout(this.disableTimer);
        this.disableTimer = setTimeout(function () {
            _this.isDisable = false;
            _this.disableTimer = null;
        }, 1000);
    };
    return AutoAgv;
}(actor_1.Actor));
exports.AutoAgv = AutoAgv;
//# sourceMappingURL=AutoAgv.js.map