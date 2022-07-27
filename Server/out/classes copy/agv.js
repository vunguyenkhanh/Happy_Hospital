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
exports.Agv = void 0;
var actor_1 = require("./actor");
var text_1 = require("./text");
var socketEvents = __importStar(require("../socketEvents"));
var Agv = /** @class */ (function (_super) {
    __extends(Agv, _super);
    function Agv(scene, x, y, desX, desY, pathLayer) {
        var _this = _super.call(this, scene, x, y, 'agv') || this;
        _this.isImmortal = false; // biến cần cho xử lý overlap =))
        _this.isDisable = false; // biến cần cho xử lý overlap =))
        _this.justPressed = 0;
        _this.sizeWidth = 32;
        _this.sizeHeight = 32;
        _this.overlapCount = 0;
        _this.startTime = 0;
        _this.overing = false;
        _this.playerControl = {
            t: true,
            l: true,
            b: true,
            r: true,
            keyW: false,
            keyA: false,
            keyS: false,
            keyD: false,
            action: 'hold', // hold, released
        };
        _this.isAgentOverlapsed = true;
        _this.startTime = Date.now() / 1000;
        _this.desX = desX;
        _this.desY = desY;
        _this.pathLayer = pathLayer;
        _this.text = new text_1.Text(_this.scene, _this.x, _this.y - _this.height * 0.5, 'AGV', '16px', '#00FF00');
        _this.desText = new text_1.Text(_this.scene, _this.desX, _this.desY, 'DES', '16px', '#00FF00');
        // KEYS
        _this.keyW = _this.scene.input.keyboard.addKey('W');
        _this.keyA = _this.scene.input.keyboard.addKey('A');
        _this.keyS = _this.scene.input.keyboard.addKey('S');
        _this.keyD = _this.scene.input.keyboard.addKey('D');
        // PHYSICS
        _this.getBody().setSize(32, 32);
        _this.setOrigin(0, 0);
        _this.estimateArrivalTime(x, y, desX, desY);
        // socket: send agv to server
        socketEvents.sendGameObjectToServer({
            x: _this.x,
            y: _this.y,
            width: _this.sizeWidth,
            height: _this.sizeHeight,
            serverId: '',
            gameObjectType: socketEvents.gameObjectType.agv,
        });
        return _this;
    }
    Agv.prototype.getTilesWithin = function () {
        return this.pathLayer.getTilesWithinWorldXY(this.x, this.y, 31, 31);
    };
    Agv.prototype.ToastInvalidMove = function () {
        this.scene.rexUI.add
            .toast({
            x: 800,
            y: window.innerHeight - 35,
            orientation: 0,
            background: this.scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0xffffff),
            text: this.scene.add.text(0, 0, '', {
                fontSize: '24px',
                color: '#000000',
            }),
            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
            },
            duration: {
                in: 0,
                hold: 500,
                out: 0,
            },
        })
            .showMessage('Di chuyển không hợp lệ!');
    };
    Agv.prototype.ToastOverLay = function () {
        this.scene.rexUI.add
            .toast({
            x: 800,
            y: window.innerHeight - 35,
            background: this.scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0xffffff),
            text: this.scene.add.text(0, 0, '', {
                fontSize: '24px',
                color: '#000000',
            }),
            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
            },
            duration: {
                in: 0,
                hold: 100,
                out: 0,
            },
        })
            .showMessage(this.isAgentOverlapsed
            ? 'AGV va chạm với Agent!'
            : 'AGV va chạm với Auto AGV!');
    };
    Agv.prototype.Toastcomplete = function () {
        var now = Date.now() / 1000;
        this.scene.rexUI.add
            .toast({
            x: 800,
            y: window.innerHeight - 35,
            background: this.scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0xffffff),
            text: this.scene.add.text(0, 0, '', {
                fontSize: '24px',
                color: '#000000',
            }),
            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
            },
            duration: {
                in: 0,
                hold: 100,
                out: 0,
            },
        })
            .showMessage('Bạn đã di chuyển đến đích. Số lần va chạm: ' +
            this.overlapCount +
            ', Thời gian di chuyển: ' +
            Math.floor(now - this.startTime) +
            's');
    };
    Agv.prototype.update = function () {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        this.getBody().setVelocity(0);
        this.text.setPosition(this.x, this.y - this.height * 0.5);
        if (this.isDisable)
            return;
        if (Math.floor(this.x / 32) === 50 &&
            this.y / 32 > 13 &&
            this.y / 32 < 14) {
            this.overing = true;
            this.Toastcomplete();
            setTimeout(function () {
                _this.isDisable = true;
            }, 2000);
            return;
        }
        // directions top, left, bottom, right
        var t, l, b, r;
        t = true;
        l = true;
        b = true;
        r = true;
        this.playerControl.t = true;
        this.playerControl.l = true;
        this.playerControl.b = true;
        this.playerControl.r = true;
        var tiles = this.getTilesWithin();
        for (var i = 0; i < tiles.length; i++) {
            if (tiles[i].properties.direction == 'top') {
                // current direction of the player
                b = false;
                this.playerControl.b = false;
                if ((_a = this.keyS) === null || _a === void 0 ? void 0 : _a.isDown) {
                    this.ToastInvalidMove();
                }
            }
            if (tiles[i].properties.direction == 'left') {
                r = false;
                this.playerControl.r = false;
                if ((_b = this.keyD) === null || _b === void 0 ? void 0 : _b.isDown) {
                    this.ToastInvalidMove();
                }
            }
            if (tiles[i].properties.direction == 'bottom') {
                t = false;
                this.playerControl.t = false;
                if ((_c = this.keyW) === null || _c === void 0 ? void 0 : _c.isDown) {
                    this.ToastInvalidMove();
                }
            }
            if (tiles[i].properties.direction == 'right') {
                l = false;
                this.playerControl.l = false;
                if ((_d = this.keyA) === null || _d === void 0 ? void 0 : _d.isDown) {
                    this.ToastInvalidMove();
                }
            }
        }
        if ((_e = this.keyW) === null || _e === void 0 ? void 0 : _e.isDown) {
            this.playerControl.keyW = true;
            this.justPressed > 500 ? (this.justPressed = 2) : this.justPressed++;
            if (t) {
                this.body.velocity.y = -32;
            }
        }
        if ((_f = this.keyA) === null || _f === void 0 ? void 0 : _f.isDown) {
            this.playerControl.keyA = true;
            this.justPressed > 500 ? (this.justPressed = 2) : this.justPressed++;
            if (l) {
                this.body.velocity.x = -32;
            }
        }
        if ((_g = this.keyS) === null || _g === void 0 ? void 0 : _g.isDown) {
            this.playerControl.keyS = true;
            this.justPressed > 500 ? (this.justPressed = 2) : this.justPressed++;
            if (b) {
                this.body.velocity.y = 32;
            }
        }
        if ((_h = this.keyD) === null || _h === void 0 ? void 0 : _h.isDown) {
            this.playerControl.keyD = true;
            this.justPressed > 500 ? (this.justPressed = 2) : this.justPressed++;
            if (r) {
                this.body.velocity.x = 32;
            }
        }
        // avoid emit socket at 60 frame per sec, which causes a lot of bandwidth
        if (this.justPressed == 1) {
            this.playerControl.action = 'hold';
            this.emitPlayerControl(this.playerControl);
        }
        if (this.playerControl.keyW && ((_j = this.keyW) === null || _j === void 0 ? void 0 : _j.isUp)) {
            // just press W previously and release the key W --> no more pressing W
            this.playerControl.keyW = false;
            this.playerControl.action = 'release';
            this.justPressed = 0;
            this.emitPlayerControl(this.playerControl);
        }
        if (this.playerControl.keyA && ((_k = this.keyA) === null || _k === void 0 ? void 0 : _k.isUp)) {
            this.playerControl.keyA = false;
            this.playerControl.action = 'release';
            this.justPressed = 0;
            this.emitPlayerControl(this.playerControl);
        }
        if (this.playerControl.keyS && ((_l = this.keyS) === null || _l === void 0 ? void 0 : _l.isUp)) {
            this.playerControl.keyS = false;
            this.playerControl.action = 'release';
            this.justPressed = 0;
            this.emitPlayerControl(this.playerControl);
        }
        if (this.playerControl.keyD && ((_m = this.keyD) === null || _m === void 0 ? void 0 : _m.isUp)) {
            this.playerControl.keyD = false;
            this.playerControl.action = 'release';
            this.justPressed = 0;
            this.emitPlayerControl(this.playerControl);
        }
    };
    Agv.prototype.emitPlayerControl = function (playerControl) {
        var tmp = {
            t: playerControl === null || playerControl === void 0 ? void 0 : playerControl.t,
            l: playerControl === null || playerControl === void 0 ? void 0 : playerControl.l,
            b: playerControl === null || playerControl === void 0 ? void 0 : playerControl.b,
            r: playerControl === null || playerControl === void 0 ? void 0 : playerControl.r,
            keyW: playerControl === null || playerControl === void 0 ? void 0 : playerControl.keyW,
            keyA: playerControl === null || playerControl === void 0 ? void 0 : playerControl.keyA,
            keyS: playerControl === null || playerControl === void 0 ? void 0 : playerControl.keyS,
            keyD: playerControl === null || playerControl === void 0 ? void 0 : playerControl.keyD,
            action: playerControl === null || playerControl === void 0 ? void 0 : playerControl.action,
        };
        socketEvents.socket.emit(socketEvents.events.updateServerPlayerControl, tmp);
    };
    Agv.prototype.handleOverlap = function (isAgent) {
        var _this = this;
        if (isAgent === void 0) { isAgent = true; }
        if (isAgent) {
            this.isAgentOverlapsed = true;
            this.overlapCount++;
        }
        else
            this.isAgentOverlapsed = false;
        this.ToastOverLay();
        if (!this.isImmortal) {
            this.isDisable = true;
            setTimeout(function () {
                _this.isImmortal = true;
                _this.isDisable = false;
                setTimeout(function () {
                    _this.isImmortal = false;
                }, 2000);
            }, 1000);
        }
    };
    return Agv;
}(actor_1.Actor));
exports.Agv = Agv;
//# sourceMappingURL=agv.js.map