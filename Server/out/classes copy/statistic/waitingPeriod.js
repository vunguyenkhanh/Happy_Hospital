"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaitingDuration = void 0;
var WaitingDuration = /** @class */ (function () {
    function WaitingDuration(begin, end, duration) {
        if (end === void 0) { end = -1; }
        if (duration === void 0) { duration = 0; }
        this.begin = -1;
        this.end = -1;
        this.duration = 0;
        this.begin = begin;
        this.end = end;
        this.duration = duration;
    }
    return WaitingDuration;
}());
exports.WaitingDuration = WaitingDuration;
//# sourceMappingURL=waitingPeriod.js.map