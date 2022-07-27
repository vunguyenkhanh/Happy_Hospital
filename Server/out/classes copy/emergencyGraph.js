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
exports.EmergencyGraph = void 0;
var graph_1 = require("./graph");
var node_1 = require("./node");
var Constant_1 = require("../Constant");
// import { VirtualNode } from "./virtualNode";
var EmergencyGraph = /** @class */ (function (_super) {
    __extends(EmergencyGraph, _super);
    function EmergencyGraph(width, height, danhsachke, pathPos
    //scene: MainScene
    ) {
        var _this = _super.call(this, width, height, danhsachke, pathPos /*, scene*/) || this;
        _this.virtualNodes = new Array(width);
        for (var i = 0; i < width; i++) {
            _this.virtualNodes[i] = [];
            for (var j = 0; j < height; j++) {
                _this.virtualNodes[i][j] = new node_1.Node2D(i, j, true); //new VirtualNode(i, j, true);
            }
        }
        for (var i = 0; i < width; i++) {
            for (var j = 0; j < height; j++) {
                for (var k = 0; k < danhsachke[i][j].length; k++) {
                    var nutke = danhsachke[i][j][k];
                    _this.nodes[i][j].setNeighbor(_this.virtualNodes[nutke.x][nutke.y]);
                    _this.virtualNodes[i][j].setNeighbor(_this.virtualNodes[nutke.x][nutke.y]);
                    _this.virtualNodes[i][j].setNeighbor(_this.nodes[nutke.x][nutke.y]);
                }
            }
        }
        for (var _i = 0, pathPos_1 = pathPos; _i < pathPos_1.length; _i++) {
            var p = pathPos_1[_i];
            _this.virtualNodes[p.x][p.y].setState(node_1.StateOfNode2D.EMPTY);
        }
        return _this;
    }
    EmergencyGraph.prototype.updateState = function () {
        var _this = this;
        _super.prototype.updateState.call(this);
        var _loop_1 = function (j) {
            var _loop_2 = function (k) {
                var x = this_1.nodes[j][k].x;
                var y = this_1.nodes[j][k].y;
                this_1.nodes[j][k].weight = 0;
                this_1.virtualNodes[j][k].weight = 0;
                for (var i = 0; i < this_1.agents.length; i++) {
                    var dist = Math.sqrt(Math.pow((x - this_1.agents[i].x), 2) + Math.pow((y - this_1.agents[i].y), 2));
                    if (dist / this_1.agents[i].speed < Constant_1.Constant.DELTA_T) {
                        this_1.nodes[j][k].weight++;
                    }
                }
                if (this_1.getAutoAgvs() != null) {
                    this_1.getAutoAgvs().forEach(function (item) {
                        if (item.path) {
                            for (var i = 0; i < item.path.length; i++) {
                                if (item.path[i].isVirtualNode) {
                                    if (item.path[i].x == _this.virtualNodes[j][k].x &&
                                        item.path[i].y == _this.virtualNodes[j][k].y) {
                                        _this.virtualNodes[j][k].weight++;
                                    }
                                }
                                else {
                                    if (item.path[i].equal(_this.nodes[j][k])) {
                                        _this.nodes[j][k].weight++;
                                    }
                                }
                            }
                        }
                    });
                }
            };
            for (var k = 0; k < this_1.height; k++) {
                _loop_2(k);
            }
        };
        var this_1 = this;
        for (var j = 0; j < this.width; j++) {
            _loop_1(j);
        }
    };
    EmergencyGraph.prototype.calPathAStar = function (start, end) {
        /**
         * Khoi tao cac bien trong A*
         */
        var openSet = [];
        var closeSet = [];
        var path = [];
        var astar_f = new Array(this.width);
        var astar_g = new Array(this.width);
        var astar_h = new Array(this.width);
        var previous = new Array(this.width);
        for (var i = 0; i < this.width; i++) {
            astar_f[i] = new Array(this.height);
            astar_g[i] = new Array(this.height);
            astar_h[i] = new Array(this.height);
            previous[i] = new Array(this.height);
            for (var j = 0; j < this.height; j++) {
                astar_f[i][j] = 0;
                astar_g[i][j] = 0;
                astar_h[i][j] = 0;
            }
        }
        var lengthOfPath = 1;
        /**
         * Thuat toan
         */
        openSet.push(this.nodes[start.x][start.y]);
        while (openSet.length > 0) {
            var winner = 0;
            for (var i = 0; i < openSet.length; i++) {
                if (astar_f[openSet[i].x][openSet[i].y] <
                    astar_f[openSet[winner].x][openSet[winner].y]) {
                    winner = i;
                }
            }
            var current = openSet[winner];
            if (openSet[winner].equal(end)) {
                var cur = this.nodes[end.x][end.y];
                path.push(cur);
                while (previous[cur.x][cur.y] != undefined) {
                    path.push(previous[cur.x][cur.y]);
                    cur = previous[cur.x][cur.y];
                }
                path.reverse();
                //console.assert(lengthOfPath == path.length, "path has length: " + path.length + " instead of " + lengthOfPath);
                return path;
            }
            openSet.splice(winner, 1);
            closeSet.push(current);
            var neighbors = [
                current.nodeN,
                current.nodeE,
                current.nodeS,
                current.nodeW,
                current.nodeVN,
                current.nodeVE,
                current.nodeVS,
                current.nodeVW,
            ];
            for (var i = 0; i < neighbors.length; i++) {
                var neighbor = neighbors[i];
                if (neighbor != null) {
                    if (!this.isInclude(neighbor, closeSet)) {
                        var timexoay = 0;
                        if (previous[current.x][current.y] &&
                            neighbor.x != previous[current.x][current.y].x &&
                            neighbor.y != previous[current.x][current.y].y) {
                            timexoay = 1;
                        }
                        var tempG = astar_g[current.x][current.y] + 1 + current.getW() + timexoay;
                        if (_super.prototype.isInclude.call(this, neighbor, openSet)) {
                            if (tempG < astar_g[neighbor.x][neighbor.y]) {
                                astar_g[neighbor.x][neighbor.y] = tempG;
                            }
                        }
                        else {
                            astar_g[neighbor.x][neighbor.y] = tempG;
                            openSet.push(neighbor);
                            lengthOfPath++;
                        }
                        astar_h[neighbor.x][neighbor.y] = this.heuristic(neighbor, end);
                        astar_f[neighbor.x][neighbor.y] =
                            astar_h[neighbor.x][neighbor.y] + astar_g[neighbor.x][neighbor.y];
                        previous[neighbor.x][neighbor.y] = current;
                    } //end of if (!this.isInclude(neighbor, closeSet)) {
                }
            }
        } //end of while (openSet.length > 0)
        console.log('Path not found!');
        return null;
    };
    return EmergencyGraph;
}(graph_1.Graph));
exports.EmergencyGraph = EmergencyGraph;
//# sourceMappingURL=emergencyGraph.js.map