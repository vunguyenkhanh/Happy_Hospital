"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Graph = void 0;
var node_1 = require("./node");
var Graph = /** @class */ (function () {
    function Graph(width, height, danhsachke, pathPos
    //scene: MainScene
    ) {
        this.agents = [];
        this.busy = [];
        this.width = width;
        this.height = height;
        this.nodes = new Array(width);
        this.pathPos = pathPos;
        for (var i = 0; i < width; i++) {
            this.nodes[i] = [];
            for (var j = 0; j < height; j++) {
                this.nodes[i][j] = new node_1.Node2D(i, j);
            }
        }
        for (var i = 0; i < width; i++) {
            for (var j = 0; j < height; j++) {
                for (var k = 0; k < danhsachke[i][j].length; k++) {
                    var nutke = danhsachke[i][j][k];
                    this.nodes[i][j].setNeighbor(this.nodes[nutke.x][nutke.y]);
                }
            }
        }
        for (var _i = 0, pathPos_1 = pathPos; _i < pathPos_1.length; _i++) {
            var p = pathPos_1[_i];
            this.nodes[p.x][p.y].setState(node_1.StateOfNode2D.EMPTY);
        }
        // console.log(this.nodes);
        this.busy = new Array(52);
        for (var i = 0; i < 52; i++) {
            this.busy[i] = new Array(28);
            for (var j = 0; j < 28; j++) {
                if (this.nodes[i][j].state === node_1.StateOfNode2D.EMPTY) {
                    this.busy[i][j] = 0;
                }
                else {
                    this.busy[i][j] = 2;
                }
            }
        }
    }
    Graph.prototype.setAutoAgvs = function (agvs) {
        this.autoAgvs = agvs;
    };
    Graph.prototype.getAutoAgvs = function () {
        return this.autoAgvs;
    };
    Graph.prototype.setMAgv = function (agv) {
        this.agv = agv;
    };
    Graph.prototype.setAgents = function (agents) {
        for (var _i = 0, _a = this.pathPos; _i < _a.length; _i++) {
            var p = _a[_i];
            this.nodes[p.x][p.y].setState(node_1.StateOfNode2D.EMPTY);
        }
        this.busy = new Array(52);
        for (var i = 0; i < 52; i++) {
            this.busy[i] = new Array(28);
            for (var j = 0; j < 28; j++) {
                if (this.nodes[i][j].state == node_1.StateOfNode2D.EMPTY) {
                    this.busy[i][j] = 0;
                }
                else {
                    this.busy[i][j] = 2;
                }
            }
        }
        this.agents = agents;
    };
    Graph.prototype.updateState = function () {
        var cur = new Array(52);
        for (var i = 0; i < 52; i++) {
            cur[i] = new Array(28);
            for (var j = 0; j < 28; j++) {
                cur[i][j] = 0;
            }
        }
        for (var i = 0; i < this.agents.length; i++) {
            var agent = this.agents[i];
            if (agent.active) {
                var xl = Math.floor(agent.x / 32);
                var xr = Math.floor((agent.x + 31) / 32);
                var yt = Math.floor(agent.y / 32);
                var yb = Math.floor((agent.y + 31) / 32);
                cur[xl][yt] = 1;
                cur[xl][yb] = 1;
                cur[xr][yt] = 1;
                cur[xr][yb] = 1;
            }
        }
        for (var i = 0; i < 52; i++) {
            for (var j = 0; j < 28; j++) {
                if (this.busy[i][j] === 2) {
                    continue;
                }
                else if (this.busy[i][j] === 0) {
                    if (cur[i][j] === 0)
                        continue;
                    this.nodes[i][j].setState(node_1.StateOfNode2D.BUSY);
                    this.busy[i][j] = 1;
                }
                else {
                    if (cur[i][j] === 1)
                        continue;
                    this.nodes[i][j].setState(node_1.StateOfNode2D.EMPTY);
                    this.busy[i][j] = 0;
                }
            }
        }
    };
    Graph.prototype.removeAgent = function (agent) {
        var _a;
        var i = Math.floor(agent.x / 32);
        var j = Math.floor(agent.y / 32);
        if (!((_a = this.nodes[i]) === null || _a === void 0 ? void 0 : _a[j]))
            return;
        this.nodes[i][j].setState(node_1.StateOfNode2D.EMPTY);
        this.busy[i][j] = 0;
    };
    Graph.prototype.calPathAStar = function (start, end) {
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
                    var timexoay = 0;
                    if (previous[current.x][current.y] &&
                        neighbor.x != previous[current.x][current.y].x &&
                        neighbor.y != previous[current.x][current.y].y) {
                        timexoay = 1;
                    }
                    var tempG = astar_g[current.x][current.y] + 1 + current.getW() + timexoay;
                    if (!this.isInclude(neighbor, closeSet)) {
                        if (this.isInclude(neighbor, openSet)) {
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
                    }
                    else {
                        if (tempG < astar_g[neighbor.x][neighbor.y]) {
                            openSet.push(neighbor);
                            var index = closeSet.indexOf(neighbor);
                            if (index > -1) {
                                closeSet.splice(index, 1);
                            }
                        }
                    }
                }
            }
        } //end of while (openSet.length > 0)
        console.log('Path not found!');
        return null;
    };
    Graph.prototype.isInclude = function (node, nodes) {
        for (var i = 0; i < nodes.length; i++) {
            if (node.equal(nodes[i]))
                return true;
        }
        return false;
    };
    Graph.prototype.heuristic = function (node1, node2) {
        return Math.abs(node1.x - node2.x) + Math.abs(node1.y - node2.y);
    };
    return Graph;
}());
exports.Graph = Graph;
//# sourceMappingURL=graph.js.map