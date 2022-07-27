"use strict";
// main agv
Object.defineProperty(exports, "__esModule", { value: true });
exports.movingGameObject = void 0;
var movingGameObject = /** @class */ (function () {
    function movingGameObject(x, y, sizeWidth, sizeHeight, serverId, clientId) {
        this.x = 0;
        this.y = 0;
        this.sizeHeight = 0;
        this.sizeWidth = 0;
        this.serverId = '';
        this.clientId = '';
        this.x = x;
        this.y = y;
        this.sizeWidth = sizeWidth;
        this.sizeHeight = sizeHeight;
        this.serverId = serverId;
        this.clientId = clientId;
    }
    return movingGameObject;
}());
exports.movingGameObject = movingGameObject;
//# sourceMappingURL=movingGameObject.js.map