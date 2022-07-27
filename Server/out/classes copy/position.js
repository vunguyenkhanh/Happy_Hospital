"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Position = void 0;
var scenes_1 = require("../scenes");
var Position = /** @class */ (function () {
    function Position(x, y) {
        this.x = x;
        this.y = y;
    }
    Position.between = function (x, y) {
        return Math.sqrt(Math.pow((x.x - y.x), 2) + Math.pow((x.y - y.y), 2));
    };
    Position.prototype.validAgent = function () {
        if (this.x === scenes_1.MainScene.AGV_START_X && this.y === scenes_1.MainScene.AGV_START_Y)
            return false;
        if (this.x === scenes_1.MainScene.AGV_START_X &&
            this.y === scenes_1.MainScene.AUTO_AGV_START_Y)
            return false;
        if (this.x === scenes_1.MainScene.EXIT_X && scenes_1.MainScene.EXIT_Y.includes(this.y))
            return false;
        return true;
    };
    return Position;
}());
exports.Position = Position;
//# sourceMappingURL=position.js.map