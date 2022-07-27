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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Actor = void 0;
var phaser_1 = require("phaser");
var Constant_1 = require("../Constant");
var Actor = /** @class */ (function (_super) {
    __extends(Actor, _super);
    function Actor(scene, x, y, texture, frame) {
        var _this = _super.call(this, scene, x, y, texture, frame) || this;
        _this.expectedTime = 0;
        scene.add.existing(_this);
        scene.physics.add.existing(_this);
        _this.getBody().setCollideWorldBounds(true);
        if (texture == 'agv') {
            Actor._id++;
            _this.agvID = Actor._id;
        }
        else {
            _this.agvID = -1; //Ám chỉ đây là agent
        }
        _this.collidedActors = new Set();
        return _this;
    }
    Actor.prototype.getBody = function () {
        return this.body;
    };
    Actor.prototype.getAgvID = function () {
        return this.agvID;
    };
    Actor.prototype.getExpectedTime = function () {
        return this.expectedTime;
    };
    Actor.prototype.estimateArrivalTime = function (startX, startY, endX, endY) {
        this.expectedTime =
            this.scene.sec +
                Math.floor(Math.sqrt(Math.pow((endX - startX), 2) + Math.pow((endY - startY), 2)) * 0.085);
    };
    Actor.prototype.writeDeadline = function (table) {
        if (this.agvID != -1) {
            var enter = '';
            if (table.text.length > 0)
                enter = '\n';
            table.text =
                'DES_' +
                    this.agvID +
                    ': ' +
                    Constant_1.Constant.secondsToHMS(this.expectedTime) +
                    ' ± ' +
                    Constant_1.Constant.DURATION +
                    enter +
                    table.text;
        }
    };
    Actor.prototype.eraseDeadline = function (table) {
        if (this.agvID != -1) {
            var enter = '';
            if (table.text.length > 0)
                enter = '\n';
            var erasedStr = 'DES_' +
                this.agvID +
                ': ' +
                Constant_1.Constant.secondsToHMS(this.expectedTime) +
                ' ± ' +
                Constant_1.Constant.DURATION +
                enter;
            table.text = table.text.replace(erasedStr, '');
        }
    };
    Actor.prototype.freeze = function (actor) {
        this.collidedActors.add(actor);
    };
    Actor._id = 0;
    return Actor;
}(phaser_1.Physics.Arcade.Sprite));
exports.Actor = Actor;
//# sourceMappingURL=actor.js.map