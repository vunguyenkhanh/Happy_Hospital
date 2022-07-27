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
exports.RunningState = void 0;
var node_1 = require("../node");
var HybridState_1 = require("./HybridState");
var IdleState_1 = require("./IdleState");
var Constant_1 = require("../../Constant");
var waitingPeriod_1 = require("../statistic/waitingPeriod");
var RunningState = /** @class */ (function (_super) {
    __extends(RunningState, _super);
    function RunningState(isLastMoving) {
        if (isLastMoving === void 0) { isLastMoving = false; }
        var _this = _super.call(this) || this;
        _this._isLastMoving = isLastMoving;
        _this._agvIsDestroyed = false;
        return _this;
    }
    RunningState.prototype.move = function (agv) {
        var _a, _b, _c;
        if (this._agvIsDestroyed)
            //|| this._isEliminated)
            return;
        // nếu không có đường đi đến đích thì không làm gì
        if (!agv.path) {
            return;
        }
        if (agv.isDisable) {
            agv.setVelocity(0, 0);
            return;
        }
        if (agv.cur == agv.path.length - 1) {
            // nếu đã đến đích thì không làm gì
            agv.setVelocity(0, 0);
            if (this._isLastMoving) {
                var mainScene = agv.scene;
                mainScene.autoAgvs.delete(agv);
                (_a = mainScene.forcasting) === null || _a === void 0 ? void 0 : _a.rememberDoneAutoAgv(agv.getAgvID());
                this._agvIsDestroyed = true;
                agv.destroy();
                return;
            }
            else {
                agv.hybridState = new IdleState_1.IdleState(performance.now());
            }
            return;
        }
        // nodeNext: nút tiếp theo cần đến
        if (agv.cur + 1 >= agv.path.length) {
            console.log('Loi roi do: ' + (agv.cur + 1));
        }
        var nodeNext = agv.graph.nodes[agv.path[agv.cur + 1].x][agv.path[agv.cur + 1].y];
        //Khoảng cách của autoAgv với các actors khác đã va chạm
        var shortestDistance = Constant_1.Constant.minDistance(agv, agv.collidedActors);
        /**
         * nếu nút tiếp theo đang ở trạng thái bận
         * thì Agv chuyển sang trạng thái chờ
         */
        if (nodeNext.state == node_1.StateOfNode2D.BUSY ||
            shortestDistance < Constant_1.Constant.SAFE_DISTANCE) {
            agv.setVelocity(0, 0);
            if (agv.waitT)
                return;
            agv.waitT = performance.now();
            (_b = agv.scene.forcasting) === null || _b === void 0 ? void 0 : _b.addDuration(agv.getAgvID(), new waitingPeriod_1.WaitingDuration(Math.floor(agv.waitT / 1000)));
        }
        else {
            /*
             * Nếu tất cả các actor đều cách autoAgv một khoảng cách an toàn
             */
            if (shortestDistance >= Constant_1.Constant.SAFE_DISTANCE) {
                //Thì gỡ hết các actors trong danh sách đã gây ra va chạm
                agv.collidedActors.clear();
            }
            /**
             * nếu Agv từ trạng thái chờ -> di chuyển
             * thì cập nhật u cho node hiện tại
             */
            if (agv.waitT) {
                agv.curNode.setU((performance.now() - agv.waitT) / 1000);
                (_c = agv.scene.forcasting) === null || _c === void 0 ? void 0 : _c.updateDuration(agv.getAgvID(), Math.floor(agv.waitT / 1000), Math.floor(performance.now() / 1000));
                agv.waitT = 0;
            }
            // di chuyển đến nút tiếp theo
            if (Math.abs(agv.x - nodeNext.x * 32) > 1 ||
                Math.abs(agv.y - nodeNext.y * 32) > 1) {
                agv.scene.physics.moveTo(agv, nodeNext.x * 32, nodeNext.y * 32, 32);
            }
            else {
                /**
                 * Khi đã đến nút tiếp theo thì cập nhật trạng thái
                 * cho nút trước đó, nút hiện tại và Agv
                 */
                agv.curNode.setState(node_1.StateOfNode2D.EMPTY);
                agv.curNode = nodeNext;
                agv.curNode.setState(node_1.StateOfNode2D.BUSY);
                agv.cur++;
                agv.setX(agv.curNode.x * 32);
                agv.setY(agv.curNode.y * 32);
                agv.setVelocity(0, 0);
                agv.stepsMoved++;
                // cap nhat lai duong di Agv moi 10 buoc di chuyen;
                // hoac sau 10s di chuyen
                if (agv.stepsMoved % 10 == 0 ||
                    performance.now() - agv.timesMoved > 10000) {
                    agv.timesMoved = performance.now();
                    agv.cur = 0;
                    agv.path = agv.calPathAStar(agv.curNode, agv.endNode);
                }
            }
        }
    };
    return RunningState;
}(HybridState_1.HybridState));
exports.RunningState = RunningState;
//# sourceMappingURL=RunningState.js.map