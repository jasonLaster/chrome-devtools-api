const InspectorBackendClass = require("./InspectorBackend");
const generateCommands  = require("./generateCommands");
const protocol = require("../protocol");

function registerAgents() {
  return generateCommands(protocol);
}

module.exports = {
  InspectorBackendClass,
  registerAgents,
  protocol
}
