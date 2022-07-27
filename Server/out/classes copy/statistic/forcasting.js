"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Forcasting = void 0;
var Constant_1 = require("../../Constant");
var Forcasting = /** @class */ (function () {
    function Forcasting() {
        this.doNothing = 0;
        this.averageAverageWaitingTime = 0;
        this.waitingAutoAgv = new Map();
        this.doneAutoAgv = new Set();
    }
    Forcasting.prototype.rememberDoneAutoAgv = function (id) {
        if (this.doneAutoAgv == null) {
            this.doneAutoAgv = new Set();
        }
        if (!this.doneAutoAgv.has(id)) {
            this.doneAutoAgv.add(id);
        }
    };
    Forcasting.prototype.removeAutoAgv = function (id) {
        if (this.waitingAutoAgv == null) {
            return;
        }
        if (this.waitingAutoAgv.size == 0) {
            return;
        }
        if (this.waitingAutoAgv.has(id)) {
            this.waitingAutoAgv.delete(id);
        }
    };
    Forcasting.prototype.removeDuration = function (id) {
        var _this = this;
        var _a, _b, _c;
        if (this.waitingAutoAgv == null) {
            return;
        }
        if (this.waitingAutoAgv.has(id)) {
            var now_1 = Math.floor(performance.now() / 1000);
            var arr_1 = new Array();
            (_a = this.waitingAutoAgv.get(id)) === null || _a === void 0 ? void 0 : _a.forEach(function (item) {
                if (item.end != -1 && item.end < now_1 - Constant_1.Constant.DELTA_T) {
                    // console.log("Va cham luc " + item.end + " < " + (now - Constant.DELTA_T));
                    arr_1.push(item);
                }
            });
            arr_1.forEach(function (item) {
                var _a, _b;
                (_b = (_a = _this.waitingAutoAgv) === null || _a === void 0 ? void 0 : _a.get(id)) === null || _b === void 0 ? void 0 : _b.delete(item);
            });
            if (((_b = this.waitingAutoAgv.get(id)) === null || _b === void 0 ? void 0 : _b.size) == 0) {
                //Nếu tất cả quá khứ của autoAgv (có định danh id) đã xoá hết
                //và nếu autoAgv này đã đến đích
                if ((_c = this.doneAutoAgv) === null || _c === void 0 ? void 0 : _c.has(id)) {
                    //Thì xoá nó khỏi các danh sách của forcasting
                    this.waitingAutoAgv.delete(id);
                    this.doneAutoAgv.delete(id);
                }
            }
            arr_1 = [];
        }
    };
    Forcasting.prototype.addDuration = function (id, duration) {
        if (this.waitingAutoAgv == null) {
            this.waitingAutoAgv = new Map();
        }
        if (!this.waitingAutoAgv.has(id)) {
            this.waitingAutoAgv.set(id, new Set());
        }
        var m = this.waitingAutoAgv.get(id); //.add(duration);
        m.add(duration);
        this.waitingAutoAgv.set(id, m);
    };
    Forcasting.prototype.updateDuration = function (id, begin, end) {
        var _a;
        if (this.waitingAutoAgv == null) {
            return;
        }
        if (this.waitingAutoAgv.has(id)) {
            (_a = this.waitingAutoAgv.get(id)) === null || _a === void 0 ? void 0 : _a.forEach(function (item) {
                if (item.begin == begin) {
                    item.end = end;
                    item.duration = item.end - item.begin;
                }
            });
        }
    };
    Forcasting.prototype.totalAverageWaitingTime = function () {
        var _this = this;
        var result = 0;
        if (this.waitingAutoAgv == null) {
            this.waitingAutoAgv = new Map();
            return 0;
        }
        if (this.waitingAutoAgv.size == 0) {
            return 0;
        }
        var now = Math.floor(performance.now() / 1000);
        this.waitingAutoAgv.forEach(function (value, key) {
            var average = 0;
            var count = 0;
            _this.removeDuration(key); //Gỡ đi các duration quá trễ rồi
            value.forEach(function (item) {
                count++;
                if (item.end == -1) {
                    average += now - item.begin;
                }
                else {
                    average += item.duration;
                }
            });
            if (count == 0) {
                average = 0;
            }
            else {
                average = average / count;
            }
            result += average;
        });
        result = Math.floor(result * 100) / 100;
        return result;
    };
    Forcasting.prototype.log = function (text) {
        var _a, _b, _c;
        var total = this.totalAverageWaitingTime();
        var numAutoAgv = (_a = this.waitingAutoAgv) === null || _a === void 0 ? void 0 : _a.size;
        var result = 0;
        if (numAutoAgv != 0)
            result = total / numAutoAgv;
        result = Math.floor(result * 100) / 100;
        text.setText('Tu giay: ' +
            Math.floor(performance.now() / 1000 - Constant_1.Constant.DELTA_T) +
            ', #AutoAgv: ' +
            numAutoAgv +
            ' totalTime: ' +
            total +
            ' avg: ' +
            result +
            '#Stop: ' +
            ((_c = (_b = this.waitingAutoAgv) === null || _b === void 0 ? void 0 : _b.get(2)) === null || _c === void 0 ? void 0 : _c.size));
    };
    Forcasting.prototype.calculate = function () {
        var _a;
        var total = this.totalAverageWaitingTime();
        var numAutoAgv = (_a = this.waitingAutoAgv) === null || _a === void 0 ? void 0 : _a.size;
        //let result : number = 0;
        if (numAutoAgv != 0)
            this.averageAverageWaitingTime = total / numAutoAgv;
        this.averageAverageWaitingTime =
            Math.floor(this.averageAverageWaitingTime * 100) / 100;
    };
    return Forcasting;
}());
exports.Forcasting = Forcasting;
//# sourceMappingURL=forcasting.js.map