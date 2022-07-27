"use strict";
// main agv
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
exports.Agv = void 0;
var movingGameObject_1 = require("./movingGameObject");
var Agv = /** @class */ (function (_super) {
    __extends(Agv, _super);
    function Agv(x, y, sizeWidth, sizeHeight, serverId, clientId, desX, desY) {
        var _this = _super.call(this, x, y, sizeWidth, sizeHeight, serverId, clientId) || this;
        _this.finish = false;
        _this.desX = desX;
        _this.desY = desY;
        return _this;
    }
    return Agv;
}(movingGameObject_1.movingGameObject));
exports.Agv = Agv;
//# sourceMappingURL=Agv.js.map