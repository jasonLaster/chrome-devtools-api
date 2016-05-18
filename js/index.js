"use strict";

const InspectorBackendClass = require("./InspectorBackend");
const generateCommands  = require("./generateCommands");
// const WebSocketConnection  = require("./Connection");
const protocol = require("../protocol");

function createInspectorBackend(webSocketUrl, onConnection) {
  let inspectorBackend = new InspectorBackendClass();
  // WebSocketConnection.Create(webSocketUrl, inspectorBackend, onConnection);

  return inspectorBackend;
}

function registerAgents() {
  return generateCommands(protocol);
}

module.exports = {
  InspectorBackendClass,
  registerAgents,
  protocol
}
