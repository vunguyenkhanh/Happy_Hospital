"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Astar = void 0;
var position_1 = require("../classes/position");
var Spot = /** @class */ (function () {
    function Spot(i, j) {
        this.neighbors = [];
        this.i = i;
        this.j = j;
        this.f = 0;
        this.g = 0;
        this.h = 0;
    }
    Spot.prototype.addNeighbors = function (ableSpot) {
        for (var k = 0; k < ableSpot.length; k++) {
            if (this.i + 1 == ableSpot[k].i && this.j == ableSpot[k].j) {
                this.neighbors.push(ableSpot[k]);
            }
            else if (this.i == ableSpot[k].i && this.j + 1 == ableSpot[k].j) {
                this.neighbors.push(ableSpot[k]);
            }
            else if (this.i - 1 == ableSpot[k].i && this.j == ableSpot[k].j) {
                this.neighbors.push(ableSpot[k]);
            }
            else if (this.i == ableSpot[k].i && this.j - 1 == ableSpot[k].j) {
                this.neighbors.push(ableSpot[k]);
            }
        }
    };
    Spot.prototype.equal = function (spot) {
        if (this.i === spot.i && this.j === spot.j)
            return true;
        return false;
    };
    return Spot;
}());
var Astar = /** @class */ (function () {
    function Astar(width, height, startPos, endPos, ablePos) {
        this.ableSpot = [];
        this.grid = [];
        this.path = [];
        this.ablePos = [];
        this.width = width;
        this.height = height;
        this.start = new Spot(startPos.x, startPos.y);
        this.end = new Spot(endPos.x, endPos.y);
        this.ablePos = ablePos;
    }
    Astar.prototype.calDefaultSplot = function (ablePos) {
        this.grid = new Array(this.width);
        for (var i = 0; i < this.width; i++) {
            this.grid[i] = [];
            for (var j = 0; j < this.height; j++) {
                this.grid[i][j] = new Spot(i, j);
            }
        }
        this.ableSpot = [];
        for (var i = 0; i < ablePos.length; i++) {
            this.ableSpot.push(this.grid[ablePos[i].x][ablePos[i].y]);
        }
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                this.grid[i][j].addNeighbors(this.ableSpot);
            }
        }
    };
    //calculate the distance between two spots
    Astar.prototype.heuristic = function (spot1, spot2) {
        return Math.sqrt(Math.pow((spot1.i - spot2.i), 2) + Math.pow((spot1.j - spot2.j), 2));
    };
    //check if the spot is in the array
    Astar.prototype.isInclude = function (spot, spots) {
        for (var i = 0; i < spots.length; i++) {
            if (spot.i === spots[i].i && spot.j === spots[i].j)
                return true;
        }
        return false;
    };
    Astar.prototype.cal = function (removePos, currentPos) {
        this.path = [];
        if (removePos && currentPos) {
            this.calDefaultSplot(this.ablePos.filter(function (pos) { return pos.x !== removePos.x || pos.y !== removePos.y; }));
            // this.calDefaultSplot(this.ablePos)
            this.start = new Spot(currentPos.x, currentPos.y);
        }
        else {
            this.calDefaultSplot(this.ablePos);
        }
        // this.calDefaultSplot(this.ablePos)
        var openSet = [];
        // Array of spots that will not selected
        var closeSet = [];
        openSet.push(this.grid[this.start.i][this.start.j]);
        while (openSet.length > 0) {
            var winner = 0;
            for (var i = 0; i < openSet.length; i++) {
                if (openSet[i].f < openSet[winner].f) {
                    winner = i;
                }
            }
            var current = openSet[winner];
            if (openSet[winner].equal(this.end)) {
                var cur = this.grid[this.end.i][this.end.j];
                this.path.push(cur);
                while (cur.previous) {
                    this.path.push(cur.previous);
                    cur = cur.previous;
                }
                this.path.reverse();
                var result = [];
                for (var k = 0; k < this.path.length; k++) {
                    result.push(new position_1.Position(this.path[k].i, this.path[k].j));
                }
                return result;
            }
            // not able to move current position
            openSet.splice(winner, 1);
            // add current position to unable set
            closeSet.push(current);
            var neighbors = current.neighbors;
            for (var i = 0; i < neighbors.length; i++) {
                var neighbor = neighbors[i];
                if (!this.isInclude(neighbor, closeSet)) {
                    var tempG = current.g + 1;
                    if (this.isInclude(neighbor, openSet)) {
                        if (tempG < neighbor.g) {
                            neighbor.g = tempG;
                        }
                    }
                    else {
                        neighbor.g = tempG;
                        openSet.push(neighbor);
                    }
                    neighbor.h = this.heuristic(neighbor, this.end);
                    neighbor.f = neighbor.h + neighbor.g;
                    neighbor.previous = current;
                }
                else {
                    var tempG = current.g + 1;
                    if (tempG < neighbor.g) {
                        openSet.push(neighbor);
                        var index = closeSet.indexOf(neighbor);
                        if (index > -1) {
                            closeSet.splice(index, 1);
                        }
                    }
                }
            }
        }
        console.log('Path not found!');
        return undefined;
    };
    Astar.prototype.getAvoidPath = function (position, nextPosition) {
        var currentSpot = this.grid[position.x][position.y];
        console.log(currentSpot);
        // console.log(this.grid)
    };
    return Astar;
}());
exports.Astar = Astar;
//# sourceMappingURL=AStarSearch.js.map