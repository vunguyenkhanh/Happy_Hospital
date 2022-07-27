"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AstarSearch = void 0;
var position_1 = require("../classes/position");
var BinaryHeap = /** @class */ (function () {
    function BinaryHeap(scoreFunction) {
        this.content = [];
        this.scoreFunction = scoreFunction;
    }
    BinaryHeap.prototype.push = function (element) {
        // Add the new element to the end of the array.
        this.content.push(element);
        // Allow it to sink down.
        this.sinkDown(this.content.length - 1);
    };
    BinaryHeap.prototype.pop = function () {
        // Store the first element so we can return it later.
        var result = this.content[0];
        // Get the element at the end of the array.
        var end = this.content.pop();
        // If there are any elements left, put the end element at the
        // start, and let it bubble up.
        if (this.content.length > 0) {
            if (end)
                this.content[0] = end;
            this.bubbleUp(0);
        }
        return result;
    };
    BinaryHeap.prototype.remove = function (node) {
        var index = this.content.indexOf(node);
        // When it is found, the process seen in 'pop' is repeated
        // to fill up the hole.
        var end = this.content.pop();
        if (end && index !== this.content.length - 1) {
            this.content[index] = end;
            if (this.scoreFunction(end) < this.scoreFunction(node)) {
                this.sinkDown(index);
            }
            else {
                this.bubbleUp(index);
            }
        }
    };
    BinaryHeap.prototype.size = function () {
        return this.content.length;
    };
    BinaryHeap.prototype.rescoreElement = function (node) {
        this.sinkDown(this.content.indexOf(node));
    };
    BinaryHeap.prototype.sinkDown = function (n) {
        // Fetch the element that has to be sunk.
        var element = this.content[n];
        // When at 0, an element can not sink any further.
        while (n > 0) {
            // Compute the parent element's index, and fetch it.
            var parentN = ((n + 1) >> 1) - 1;
            var parent_1 = this.content[parentN];
            // Swap the elements if the parent is greater.
            if (this.scoreFunction(element) < this.scoreFunction(parent_1)) {
                this.content[parentN] = element;
                this.content[n] = parent_1;
                // Update 'n' to continue at the new position.
                n = parentN;
            }
            // Found a parent that is less, no need to sink any further.
            else {
                break;
            }
        }
    };
    BinaryHeap.prototype.bubbleUp = function (n) {
        // Look up the target element and its score.
        var length = this.content.length;
        var element = this.content[n];
        var elemScore = this.scoreFunction(element);
        while (true) {
            // Compute the indices of the child elements.
            var child2N = (n + 1) << 1;
            var child1N = child2N - 1;
            // This is used to store the new position of the element, if any.
            var swap = null;
            var child1Score = 0;
            // If the first child exists (is inside the array)...
            if (child1N < length) {
                // Look it up and compute its score.
                var child1 = this.content[child1N];
                child1Score = this.scoreFunction(child1);
                // If the score is less than our element's, we need to swap.
                if (child1Score < elemScore) {
                    swap = child1N;
                }
            }
            // Do the same checks for the other child.
            if (child2N < length) {
                var child2 = this.content[child2N];
                var child2Score = this.scoreFunction(child2);
                if (child2Score < (swap === null ? elemScore : child1Score)) {
                    swap = child2N;
                }
            }
            // If the element needs to be moved, swap it, and continue.
            if (swap !== null) {
                this.content[n] = this.content[swap];
                this.content[swap] = element;
                n = swap;
            }
            // Otherwise, we are done.
            else {
                break;
            }
        }
    };
    return BinaryHeap;
}());
var Graph = /** @class */ (function () {
    function Graph(diagonal, width, height, groundPos, pathPos, excludedPos) {
        this.nodes = [];
        this.diagonal = false;
        this.grid = [];
        this.dirtyNodes = [];
        this.diagonal = diagonal;
        this.init(groundPos, width, height, pathPos, excludedPos);
    }
    Graph.prototype.init = function (groundPos, width, height, pathPos, excludedPos) {
        var _this = this;
        this.dirtyNodes = [];
        this.nodes = [];
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            node.clean();
        }
        this.grid = [];
        groundPos.forEach(function (pos) {
            if (!_this.grid[pos.x])
                _this.grid[pos.x] = [];
            _this.grid[pos.x][pos.y] = new GridNode(pos.x, pos.y, 1);
        });
        pathPos.forEach(function (pos) {
            if (!_this.grid[pos.x])
                _this.grid[pos.x] = [];
            _this.grid[pos.x][pos.y] = new GridNode(pos.x, pos.y, 5);
        });
        for (var x = 0; x < height; x++) {
            if (!this.grid[x])
                this.grid[x] = [];
            for (var y = 0; y < width; y++) {
                if (!this.grid[x][y])
                    this.grid[x][y] = new GridNode(x, y, 0);
            }
        }
        if (excludedPos) {
            this.grid[excludedPos.x][excludedPos.y].weight = 0;
        }
        // Cổng T
        this.grid[50][13].weight = 0;
        this.grid[50][14].weight = 0;
        this.grid[1][14].weight = 0;
        this.grid[1][13].weight = 0;
    };
    Graph.prototype.clearnDirty = function () {
        for (var _i = 0, _a = this.dirtyNodes; _i < _a.length; _i++) {
            var node = _a[_i];
            node.clean();
        }
        this.dirtyNodes = [];
    };
    Graph.prototype.markDirty = function (node) {
        this.dirtyNodes.push(node);
    };
    Graph.prototype.neighbors = function (node) {
        var ret = [];
        var x = node.x;
        var y = node.y;
        var grid = this.grid;
        //West
        if (grid[x - 1] && grid[x - 1][y]) {
            ret.push(grid[x - 1][y]);
        }
        //East
        if (grid[x + 1] && grid[x + 1][y]) {
            ret.push(grid[x + 1][y]);
        }
        //North
        if (grid[x] && grid[x][y + 1]) {
            ret.push(grid[x][y + 1]);
        }
        //South
        if (grid[x] && grid[x][y - 1]) {
            ret.push(grid[x][y - 1]);
        }
        if (this.diagonal) {
            //South-West
            if (grid[x - 1] && grid[x - 1][y - 1]) {
                ret.push(grid[x - 1][y - 1]);
            }
            //South-East
            if (grid[x + 1] && grid[x + 1][y - 1]) {
                ret.push(grid[x + 1][y - 1]);
            }
            //North-West
            if (grid[x - 1] && grid[x - 1][y + 1]) {
                ret.push(grid[x - 1][y + 1]);
            }
            //North-East
            if (grid[x + 1] && grid[x + 1][y + 1]) {
                ret.push(grid[x + 1][y + 1]);
            }
        }
        return ret;
    };
    Graph.prototype.toString = function () {
        var grid = this.grid;
        var grapString = [];
        for (var y = 0; y < grid.length; y++) {
            var row = grid[y];
            var rowString = [];
            for (var x = 0; x < row.length; x++) {
                var node = row[x];
                rowString.push(node.toString());
            }
            grapString.push(rowString.join(' '));
        }
        return grapString.join('\n');
    };
    return Graph;
}());
var GridNode = /** @class */ (function () {
    function GridNode(x, y, weight) {
        this.parent = null;
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.visited = false;
        this.closed = false;
        this.x = x;
        this.y = y;
        this.weight = weight;
    }
    GridNode.prototype.toString = function () {
        return "[".concat(this.x, " ").concat(this.y, "]");
    };
    GridNode.prototype.getCost = function (fromNeighbor) {
        if (fromNeighbor &&
            fromNeighbor.x !== this.x &&
            fromNeighbor.y !== this.y) {
            return this.weight * 1.41421;
        }
        return this.weight;
    };
    GridNode.prototype.isWall = function () {
        return this.weight === 0;
    };
    GridNode.prototype.clean = function () {
        this.parent = null;
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.visited = false;
        this.closed = false;
    };
    return GridNode;
}());
var AstarSearch = /** @class */ (function () {
    function AstarSearch(width, height, groundPos, pathPos, excludedPos) {
        // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
        this.heuristics = {
            manhattan: function (pos0, pos1) {
                var d1 = Math.abs(pos1.x - pos0.x);
                var d2 = Math.abs(pos1.y - pos0.y);
                return d1 + d2;
            },
            diagonal: function (pos0, pos1) {
                var D = 1;
                var D2 = Math.sqrt(2);
                var d1 = Math.abs(pos1.x - pos0.x);
                var d2 = Math.abs(pos1.y - pos0.y);
                return D * (d1 + d2) + (D2 - 2 * D) * Math.min(d1, d2);
            },
        };
        this.heap = new BinaryHeap(function (node) {
            return node.f;
        });
        this.graph = new Graph(true, width, height, groundPos, pathPos, excludedPos);
    }
    AstarSearch.prototype.pathTo = function (node) {
        var curr = node;
        var path = [];
        while (curr.parent) {
            path.push(new position_1.Position(curr.x, curr.y));
            curr = curr.parent;
        }
        return path;
    };
    AstarSearch.prototype.search = function (startPos, endPos, options) {
        if (options === void 0) { options = {}; }
        var start = new GridNode(startPos.x, startPos.y, 1);
        var end = new GridNode(endPos.x, endPos.y, 1);
        this.graph.clearnDirty();
        var _a = options.heuristic, heuristic = _a === void 0 ? this.heuristics.diagonal : _a, _b = options.closest, closest = _b === void 0 ? true : _b;
        var closestNode = start; // set the start node to be the closest if required
        start.h = heuristic(start, end);
        this.graph.markDirty(start);
        this.heap.push(start);
        while (this.heap.size() > 0) {
            // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
            var currentNode = this.heap.pop();
            // End case -- result has been found, return the traced path.
            if (currentNode === end) {
                return this.pathTo(currentNode);
            }
            // Normal case -- move currentNode from open to closed, process each of its neighbors.
            currentNode.closed = true;
            // Find all neighbors for the current node.
            var neighbors = this.graph.neighbors(currentNode);
            for (var i = 0, il = neighbors.length; i < il; ++i) {
                var neighbor = neighbors[i];
                if (neighbor.closed || neighbor.isWall()) {
                    // Not a valid node to process, skip to next neighbor.
                    continue;
                }
                // The g score is the shortest distance from start to current node.
                // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
                var gScore = currentNode.g + neighbor.getCost(currentNode);
                var beenVisited = neighbor.visited;
                if (!beenVisited || gScore < neighbor.g) {
                    // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
                    neighbor.visited = true;
                    neighbor.parent = currentNode;
                    neighbor.h = neighbor.h || heuristic(neighbor, end);
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;
                    this.graph.markDirty(neighbor);
                    if (closest) {
                        // If the neighbour is closer than the current closestNode or if it's equally close but has
                        // a cheaper path than the current closest node then it becomes the closest node
                        if (neighbor.h < closestNode.h ||
                            (neighbor.h === closestNode.h && neighbor.g < closestNode.g)) {
                            closestNode = neighbor;
                        }
                    }
                    if (!beenVisited) {
                        // Pushing to heap will put it in proper place based on the 'f' value.
                        this.heap.push(neighbor);
                    }
                    else {
                        // Already seen the node, but since it has been rescored we need to reorder it in the heap
                        this.heap.rescoreElement(neighbor);
                    }
                }
            }
        }
        if (closest) {
            return this.pathTo(closestNode);
        }
        // No result was found - empty array signifies failure to find path.
        return [];
    };
    return AstarSearch;
}());
exports.AstarSearch = AstarSearch;
//# sourceMappingURL=astar.js.map