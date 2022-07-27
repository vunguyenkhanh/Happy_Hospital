"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Position = void 0;
var MainScene = /** @class */ (function () {
    function MainScene() {
    }
    MainScene.AGV_START_X = 1;
    MainScene.AGV_START_Y = 14;
    MainScene.AUTO_AGV_START_Y = 13;
    MainScene.AUTO_AGV_START_X = 1;
    MainScene.EXIT_X = 50;
    MainScene.EXIT_Y = [13, 14];
    return MainScene;
}());
var Position = /** @class */ (function () {
    function Position(x, y) {
        this.x = x;
        this.y = y;
    }
    Position.between = function (x, y) {
        return Math.sqrt(Math.pow((x.x - y.x), 2) + Math.pow((x.y - y.y), 2));
    };
    Position.prototype.validAgent = function () {
        if (this.x === MainScene.AGV_START_X && this.y === MainScene.AGV_START_Y)
            return false;
        if (this.x === MainScene.AGV_START_X &&
            this.y === MainScene.AUTO_AGV_START_Y)
            return false;
        if (this.x === MainScene.EXIT_X && MainScene.EXIT_Y.includes(this.y))
            return false;
        return true;
    };
    return Position;
}());
exports.Position = Position;
//# sourceMappingURL=position.js.map