### Chrome DevTools API

The project extracts the chrome devtools frontend api. This includes:

1) the protocol file, which defines the API commands and events
2) the inspector backend which maintains the websocket connection as well
as agents, which receive commands and events.

#### registerAgents

registerAgents is a function that maps the protocol into a series of InspectorBackend
calls for registering agent commands and events.

```js
InspectorBackend.registerEvent("Inspector.inspect", ["object", "hints"]);
InspectorBackend.registerEvent("Inspector.detached", ["reason"]);
InspectorBackend.registerEvent("Inspector.targetCrashed", []);
InspectorBackend.registerCommand("Page.addScriptToEvaluateOnLoad", [{"name": "scriptSource", "type": "string", "optional": false}], ["identifier"], false);
InspectorBackend.registerCommand("Page.removeScriptToEvaluateOnLoad", [{"name": "identifier", "type": "string", "optional": false}], [], false);
InspectorBackend.registerCommand("Page.setAutoAttachToCreatedPages", [{"name": "autoAttach", "type": "boolean", "optional": false}], [], false);
InspectorBackend.registerEvent("Page.frameDetached", ["frameId"]);
InspectorBackend.registerEvent("Page.frameStartedLoading", ["frameId"]);
```
