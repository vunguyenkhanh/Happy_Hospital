"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameObjectType = exports.events = void 0;
exports.events = {
    newClient: 'new-client',
    disconnect: 'disconnect',
    updateServerPlayerControl: 'update-server-player-control',
    sendGameObjectToServer: 'send-game-object-to-server',
    deleteAgentOnServer: 'delete-agent-on-server',
    updateGameObjectsOnServer: 'update-game-objects-on-server',
    tellClientMainAgvOverlapped: 'tell-client-main-agv-overlapped',
    tellClientAutoAgvsOverlapped: 'tell-client-auto-agvs-overlapped',
    tellClientLoadedDataFromVadere: 'tell-client-loaded-data-from-vadere',
    userLoadedDataFromVadere: 'user-loaded-data-from-vadere',
    agentRequestNewPath: 'agent-request-new-path',
    sendAgentPathToClient: 'send-agent-path-to-client',
    onClientChangeAgvAlgorithm: 'on-client-change-agv-algorithm',
    tellClientAgentsOverlapped: 'tell-client-agents-overlapped',
    onClientLoadData: 'on-client-load-data',
    onClientSaveData: 'on-client-save-data',
    onChangeMaxAgent: 'on-change-max-agent',
    clientFinish: 'client-finish',
};
exports.gameObjectType = {
    agv: 'AGV',
    autoAgv: 'AUTOAGV',
    agent: 'AGENT',
};
//# sourceMappingURL=socketEvents.js.map