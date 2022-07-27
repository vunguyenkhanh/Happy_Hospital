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
exports.IdleState = void 0;
var HybridState_1 = require("./HybridState");
var Constant_1 = require("../../Constant");
var RunningState_1 = require("./RunningState");
var IdleState = /** @class */ (function (_super) {
    __extends(IdleState, _super);
    function IdleState(start) {
        var _this = _super.call(this) || this;
        _this._start = start;
        _this._calculated = false;
        return _this;
    }
    IdleState.prototype.move = function (agv) {
        var _a;
        if (performance.now() - this._start < Constant_1.Constant.DURATION * 1000) {
            if (!this._calculated) {
                this._calculated = true;
                var finish = this._start / 1000;
                var mainScene = agv.scene;
                var expectedTime = agv.getExpectedTime();
                if (finish >= expectedTime - Constant_1.Constant.DURATION &&
                    finish <= expectedTime + Constant_1.Constant.DURATION) {
                    return;
                }
                else {
                    var diff = Math.max(expectedTime - Constant_1.Constant.DURATION - finish, finish - expectedTime - Constant_1.Constant.DURATION);
                    var lateness = Constant_1.Constant.getLateness(diff);
                    mainScene.harmfullness = mainScene.harmfullness + lateness;
                }
            }
            return;
        }
        else {
            (_a = agv.firstText) === null || _a === void 0 ? void 0 : _a.destroy();
            var mainScene = agv.scene;
            if (mainScene != null)
                agv.eraseDeadline(mainScene.timeTable);
            agv.hybridState = new RunningState_1.RunningState(true);
            // console.log((agv.hybridState as RunningState)._isLastMoving);
            agv.changeTarget();
        }
    };
    return IdleState;
}(HybridState_1.HybridState));
exports.IdleState = IdleState;
//# sourceMappingURL=IdleState.js.map