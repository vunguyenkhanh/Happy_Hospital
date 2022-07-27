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
exports.Text = void 0;
var phaser_1 = require("phaser");
var Text = /** @class */ (function (_super) {
    __extends(Text, _super);
    function Text(scene, x, y, text, fontSize, color) {
        if (fontSize === void 0) { fontSize = '16px'; }
        var _this = _super.call(this, scene, x, y, text, {
            fontSize: fontSize,
            color: color ? color : '#fff',
            stroke: '#000',
            strokeThickness: 4,
        }) || this;
        _this.setOrigin(0, 0);
        _this.setDepth(1);
        scene.add.existing(_this);
        return _this;
    }
    return Text;
}(phaser_1.GameObjects.Text));
exports.Text = Text;
//# sourceMappingURL=text.js.map