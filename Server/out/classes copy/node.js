"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node2D = exports.StateOfNode2D = void 0;
var Constant_1 = require("../Constant");
var StateOfNode2D;
(function (StateOfNode2D) {
    StateOfNode2D[StateOfNode2D["EMPTY"] = 0] = "EMPTY";
    StateOfNode2D[StateOfNode2D["BUSY"] = 1] = "BUSY";
    StateOfNode2D[StateOfNode2D["NOT_ALLOW"] = 2] = "NOT_ALLOW";
})(StateOfNode2D = exports.StateOfNode2D || (exports.StateOfNode2D = {}));
var lambda = 0.4;
var Node2D = /** @class */ (function () {
    function Node2D(x, y, isVirtualNode, state, p_random, t_min, t_max) {
        if (isVirtualNode === void 0) { isVirtualNode = false; }
        if (state === void 0) { state = StateOfNode2D.NOT_ALLOW; }
        if (p_random === void 0) { p_random = 0.05; }
        if (t_min === void 0) { t_min = 2000; }
        if (t_max === void 0) { t_max = 3000; }
        this.nodeW = null;
        this.nodeN = null;
        this.nodeS = null;
        this.nodeE = null;
        this.w_edge_W = Number.MAX_SAFE_INTEGER; // trong so canh
        this.w_edge_N = Number.MAX_SAFE_INTEGER; // trong so canh
        this.w_edge_S = Number.MAX_SAFE_INTEGER; // trong so canh
        this.w_edge_E = Number.MAX_SAFE_INTEGER; // trong so canh
        this.w = 0; // thời gian dự đoán dừng (ms)
        this.u = 0; // thời gian dừng thực tế (ms)
        this.nodeVW = null;
        this.nodeVN = null;
        this.nodeVS = null;
        this.nodeVE = null;
        this.w_edge_VW = Number.MAX_SAFE_INTEGER; // trong so canh
        this.w_edge_VN = Number.MAX_SAFE_INTEGER; // trong so canh
        this.w_edge_VS = Number.MAX_SAFE_INTEGER; // trong so canh
        this.w_edge_VE = Number.MAX_SAFE_INTEGER; // trong so canh
        this.isVirtualNode = false;
        this._weight = 0;
        this.x = x;
        this.y = y;
        this.state = state;
        this.p_random = p_random;
        this.t_min = t_min;
        this.t_max = t_max;
        this.isVirtualNode = isVirtualNode;
    }
    Node2D.prototype.getW = function () {
        if (Constant_1.Constant.MODE == Constant_1.ModeOfPathPlanning.FRANSEN)
            return this.w;
        else
            return this.weight;
    };
    Object.defineProperty(Node2D.prototype, "weight", {
        get: function () {
            return this._weight;
        },
        set: function (value) {
            this._weight = value;
        },
        enumerable: false,
        configurable: true
    });
    Node2D.prototype.setNeighbor = function (node) {
        if (node == null)
            return;
        if (node.isVirtualNode) {
            if (this.x + 1 == node.x && this.y == node.y) {
                this.nodeVE = node;
                this.w_edge_VE = 1;
            }
            else if (this.x == node.x && this.y + 1 == node.y) {
                this.nodeVS = node;
                this.w_edge_VS = 1;
            }
            else if (this.x - 1 == node.x && this.y == node.y) {
                this.nodeVW = node;
                this.w_edge_VW = 1;
            }
            else if (this.x == node.x && this.y - 1 == node.y) {
                this.nodeVN = node;
                this.w_edge_VN = 1;
            }
            return;
        }
        this.setRealNeighbor(node);
        return;
    };
    Node2D.prototype.setRealNeighbor = function (node) {
        if (this.x + 1 == node.x && this.y == node.y) {
            this.nodeE = node;
            this.w_edge_E = 1;
        }
        else if (this.x == node.x && this.y + 1 == node.y) {
            this.nodeS = node;
            this.w_edge_S = 1;
        }
        else if (this.x - 1 == node.x && this.y == node.y) {
            this.nodeW = node;
            this.w_edge_W = 1;
        }
        else if (this.x == node.x && this.y - 1 == node.y) {
            this.nodeN = node;
            this.w_edge_N = 1;
        }
    };
    Node2D.prototype.setState = function (state) {
        this.state = state;
    };
    Node2D.prototype.equal = function (node) {
        if (node.isVirtualNode != this.isVirtualNode)
            return false;
        return this.x == node.x && this.y == node.y;
    };
    Node2D.prototype.madeOf = function (node) {
        return this.equal(node);
    };
    Node2D.prototype.setU = function (u) {
        this.u = Math.floor(u);
        this.updateW();
    };
    Node2D.prototype.updateW = function () {
        this.w = (1 - lambda) * this.w + lambda * this.u;
    };
    return Node2D;
}());
exports.Node2D = Node2D;
//# sourceMappingURL=node.js.map