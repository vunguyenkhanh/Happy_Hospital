"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Physic = void 0;
var Physic = /** @class */ (function () {
    function Physic() {
    }
    // return a list (array) of overlapped agvs serverId with the list of agents
    Physic.prototype.checkOverlap = function (agvs, agents, socket) {
        var _this = this;
        var overlappedAgvs = [];
        agvs.forEach(function (agv) {
            var currentAgvOverlapped = false;
            var overLappedAgents = [];
            agents.forEach(function (agent) {
                if (_this.isOverLapped({
                    minAx: agv.x,
                    minAy: agv.y,
                    maxAx: agv.x + agv.sizeWidth,
                    maxAy: agv.y + agv.sizeHeight,
                }, {
                    minBx: agent.x,
                    minBy: agent.y,
                    maxBx: agent.x + agent.sizeWidth,
                    maxBy: agent.y + agent.sizeHeight,
                })) {
                    currentAgvOverlapped = true;
                    overLappedAgents.push({ agentServerId: agent.serverId });
                    // if (
                    //   agent.desX === Math.floor(agv.x / 32) &&
                    //   agent.desY === Math.floor(agv.y / 32)
                    // ) {
                    //   socket.emit(socketEvents.events.sendAgentPathToClient, {
                    //     id: agent.id,
                    //     vertexs: [],
                    //     end: true,
                    //   })
                    // } else {
                    //   agent.recal(
                    //     new Position(Math.floor(agent.x / 32), Math.floor(agent.y / 32)),
                    //     socket
                    //   )
                    // }
                    if (agv.clientId) {
                        console.log("AAGV ".concat(agv.clientId, " \u0111\u00E3 va ch\u1EA1m v\u1EDBi agent ").concat(agent.clientId));
                    }
                    else {
                        console.log("mAGV \u0111\u00E3 va ch\u1EA1m v\u1EDBi agent ".concat(agent.clientId));
                    }
                }
            });
            if (currentAgvOverlapped) {
                overlappedAgvs.push({
                    agvServerId: agv.serverId,
                    overlappedAgents: overLappedAgents,
                });
            }
        });
        return overlappedAgvs;
    };
    Physic.prototype.checkAgentOverlap = function (agents, socket) {
        var _this = this;
        var ignoreAgent = new Set();
        agents.forEach(function (agent) {
            if (ignoreAgent.has(agent.serverId)) {
                return;
            }
            agents.forEach(function (agent2) {
                if (ignoreAgent.has(agent2.serverId)) {
                    return;
                }
                if (agent.serverId !== agent2.serverId) {
                    if (_this.isOverLapped({
                        minAx: agent.x,
                        minAy: agent.y,
                        maxAx: agent.x + agent.sizeWidth,
                        maxAy: agent.y + agent.sizeHeight,
                    }, {
                        minBx: agent2.x,
                        minBy: agent2.y,
                        maxBx: agent2.x + agent2.sizeWidth,
                        maxBy: agent2.y + agent2.sizeHeight,
                    })) {
                        ignoreAgent.add(agent.serverId);
                        ignoreAgent.add(agent2.serverId);
                        console.log("Agent ".concat(agent.clientId, " \u0111\u00E3 va ch\u1EA1m v\u1EDBi agent ").concat(agent2.clientId));
                    }
                }
            });
        });
    };
    Physic.prototype.checkFinish = function (agv) {
        if (Math.floor(agv.x / 32) === Math.floor(agv.desX / 32) &&
            Math.floor(agv.y / 32) === Math.floor(agv.desY / 32)) {
            return true;
        }
        return false;
    };
    // check is overLapped box 1 and box 2
    Physic.prototype.isOverLapped = function (_a, _b) {
        // Check for the cases where the rectangles are definitely not intersecting.
        // If none of these cases are true then the rectangles must intersect. i.e.:
        var minAx = _a.minAx, minAy = _a.minAy, maxAx = _a.maxAx, maxAy = _a.maxAy;
        var minBx = _b.minBx, minBy = _b.minBy, maxBx = _b.maxBx, maxBy = _b.maxBy;
        var aLeftOfB = maxAx < minBx;
        var aRightOfB = minAx > maxBx;
        var aAboveB = minAy > maxBy;
        var aBelowB = maxAy < minBy;
        return !(aLeftOfB || aRightOfB || aAboveB || aBelowB);
    };
    return Physic;
}());
exports.Physic = Physic;
//# sourceMappingURL=Physic.js.map