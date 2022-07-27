"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calPathAstarGrid = exports.calPathAstar = void 0;
var position_1 = require("../classes/position");
var GraphNode = /** @class */ (function () {
    function GraphNode(x, y, g, h, pV) {
        this.x = x;
        this.y = y;
        this.g = g;
        this.h = h;
        this.f = g + h;
        this.pV = pV;
    }
    return GraphNode;
}());
var Cell = /** @class */ (function () {
    function Cell(x, y) {
        this.x = x;
        this.y = y;
        this.movable = false;
    }
    return Cell;
}());
var calPathAstar = function (adjacentList, start, end) {
    var openList = [];
    var closedList = [];
    var result = [];
    openList.push(new GraphNode(start.x, start.y, 0, Math.abs(start.y - end.y) + Math.abs(start.x - end.x), null));
    while (openList.length > 0) {
        var smallestF = openList[0].f;
        var currentNode = openList[0];
        for (var _i = 0, openList_1 = openList; _i < openList_1.length; _i++) {
            var i = openList_1[_i];
            if (i.f < smallestF) {
                smallestF = i.f;
                currentNode = i;
            }
        }
        var _a = [currentNode.x, currentNode.y], x = _a[0], y = _a[1];
        if (!adjacentList[x]) {
            openList.splice(openList.indexOf(currentNode), 1);
            closedList.push(currentNode);
            continue;
        }
        var _loop_1 = function (i) {
            var _d = [i.x, i.y], nodeX = _d[0], nodeY = _d[1];
            if (closedList.findIndex(function (i) { return i.x === nodeX && i.y === nodeY; }) != -1)
                return "continue";
            var nodeG = currentNode.g + 1;
            var nodeH = Math.abs(nodeY - end.y) + Math.abs(nodeX - end.x);
            if (nodeH === 0) {
                result.push(end);
                while (currentNode) {
                    result.push(new position_1.Position(currentNode.x, currentNode.y));
                    currentNode = currentNode.pV;
                }
                return { value: result };
            }
            openList.push(new GraphNode(nodeX, nodeY, nodeG, nodeH, currentNode));
        };
        for (var _b = 0, _c = adjacentList[x][y]; _b < _c.length; _b++) {
            var i = _c[_b];
            var state_1 = _loop_1(i);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        openList.splice(openList.indexOf(currentNode), 1);
        closedList.push(currentNode);
    }
    return [];
};
exports.calPathAstar = calPathAstar;
var calPathAstarGrid = function (width, height, movableCells, start, end) {
    var getNeighbor = function (x, y) {
        var check = x == start.x && y == start.y;
        var res = check
            ? [
                { x: x, y: y + 1 },
                { x: x, y: y - 1 },
                { x: x + 1, y: y },
                { x: x - 1, y: y },
            ]
            : [
                { x: x + 1, y: y + 1 },
                { x: x, y: y + 1 },
                { x: x + 1, y: y - 1 },
                { x: x, y: y - 1 },
                { x: x + 1, y: y },
                { x: x - 1, y: y },
                { x: x - 1, y: y - 1 },
                { x: x - 1, y: y + 1 },
            ];
        return res.filter(function (i) { return i.x >= 0 && i.x < width && i.y >= 0 && i.y < height; });
    };
    var grid = [[]];
    for (var i = 0; i < width; i++) {
        if (!grid[i])
            grid[i] = [];
        for (var j = 0; j < height; j++) {
            grid[i][j] = new Cell(i, j);
        }
    }
    for (var _i = 0, movableCells_1 = movableCells; _i < movableCells_1.length; _i++) {
        var i = movableCells_1[_i];
        grid[i.x][i.y].movable = true;
    }
    var openList = [];
    var closedList = [];
    var result = [];
    openList.push(new GraphNode(start.x, start.y, 0, Math.abs(start.y - end.y) + Math.abs(start.x - end.x), null));
    while (openList.length > 0) {
        var smallestF = openList[0].f;
        var currentNode = openList[0];
        for (var _a = 0, openList_2 = openList; _a < openList_2.length; _a++) {
            var i = openList_2[_a];
            if (i.f < smallestF) {
                smallestF = i.f;
                currentNode = i;
            }
        }
        var _b = [currentNode.x, currentNode.y], x = _b[0], y = _b[1];
        var _loop_2 = function (i) {
            var _e = [
                i.x,
                i.y,
                currentNode.g +
                    (i.x != currentNode.x && i.y != currentNode.y ? 1.4 : 1),
                Math.abs(end.y - i.y) + Math.abs(end.x - i.x),
            ], newX = _e[0], newY = _e[1], newG = _e[2], newH = _e[3];
            if (grid[newX][newY].movable == false)
                return "continue";
            if (closedList.findIndex(function (i) { return i.x == newX && i.y == newY; }) != -1)
                return "continue";
            var newNodeIndex = openList.findIndex(function (i) { return i.x == newX && i.y == newY; });
            if (newNodeIndex != -1) {
                var node = openList[newNodeIndex];
                if (node.f > newG + newH) {
                    openList[newNodeIndex] = new GraphNode(newX, newY, newG, newH, currentNode);
                }
                return "continue";
            }
            if (newH === 0) {
                result.push(end);
                while (currentNode) {
                    result.push(new position_1.Position(currentNode.x, currentNode.y));
                    currentNode = currentNode.pV;
                }
                return { value: result };
            }
            var newNode = new GraphNode(newX, newY, newG, newH, currentNode);
            openList.push(newNode);
        };
        for (var _c = 0, _d = getNeighbor(x, y); _c < _d.length; _c++) {
            var i = _d[_c];
            var state_2 = _loop_2(i);
            if (typeof state_2 === "object")
                return state_2.value;
        }
        openList.splice(openList.indexOf(currentNode), 1);
        closedList.push(currentNode);
    }
    return [];
};
exports.calPathAstarGrid = calPathAstarGrid;
//# sourceMappingURL=index.js.map