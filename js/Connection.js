"use strict";

const reportProtocolError = require("./reportProtocolError");
const AgentPrototype = require("./AgentPrototype");
const Options = require("./Options");
const errorCodes = require("./errorCodes");
const _DevToolsErrorCode = errorCodes._DevToolsErrorCode;

/**
 *  @constructor
 *  @extends {Object}
 */
const Connection = function(inspectorBackend)
{
    this._lastMessageId = 1;
    this._pendingResponsesCount = 0;
    this._agents = {};
    this._dispatchers = {};
    this._callbacks = {};
    this._initialize(inspectorBackend._agentPrototypes, inspectorBackend._dispatcherPrototypes);
    this._isConnected = true;
}

Connection.Events = {
    Disconnected: "Disconnected",
}

Connection.prototype = {
    /**
     * @param {!Object.<string, !AgentPrototype>} agentPrototypes
     * @param {!Object.<string, !DispatcherPrototype>} dispatcherPrototypes
     */
    _initialize: function(agentPrototypes, dispatcherPrototypes)
    {
        for (var domain in agentPrototypes) {
            this._agents[domain] = Object.create(agentPrototypes[domain]);
            this._agents[domain].setConnection(this);
        }

        for (var domain in dispatcherPrototypes)
            this._dispatchers[domain] = Object.create(dispatcherPrototypes[domain]);
    },

    /**
     * @return {number}
     */
    nextMessageId: function()
    {
        return this._lastMessageId++;
    },

    /**
     * @param {string} domain
     * @return {!AgentPrototype}
     */
    agent: function(domain)
    {
        return this._agents[domain];
    },

    /**
     * @return {!Object.<string, !Object>}
     */
    agentsMap: function()
    {
        return this._agents;
    },

    /**
     * @param {string} domain
     * @param {string} method
     * @param {?Object} params
     * @param {?function(*)} callback
     */
    _wrapCallbackAndSendMessageObject: function(domain, method, params, callback)
    {
        if (!this._isConnected && callback) {
            this._dispatchConnectionErrorResponse(domain, method, callback);
            return;
        }

        var messageObject = {};
        var messageId = this.nextMessageId();
        messageObject.id = messageId;
        messageObject.method = method;
        if (params)
            messageObject.params = params;

        var wrappedCallback = this._wrap(callback, domain, method);

        if (Options.dumpInspectorProtocolMessages)
            this._dumpProtocolMessage("frontend: " + JSON.stringify(messageObject));

        this.sendMessage(messageObject);
        ++this._pendingResponsesCount;
        this._callbacks[messageId] = wrappedCallback;
    },

    /**
     * @param {?function(*)} callback
     * @param {string} method
     * @param {string} domain
     * @return {function(*)}
     */
    _wrap: function(callback, domain, method)
    {
        if (!callback)
            callback = function() {};

        callback.methodName = method;
        callback.domain = domain;
        if (Options.dumpInspectorTimeStats)
            callback.sendRequestTime = Date.now();

        return callback;
    },

    /**
     * @param {!Object} messageObject
     */
    sendMessage: function(messageObject)
    {
        throw "Not implemented";
    },

    /**
     * @param {!Object|string} message
     */
    dispatch: function(message)
    {
        if (Options.dumpInspectorProtocolMessages)
            this._dumpProtocolMessage("backend: " + ((typeof message === "string") ? message : JSON.stringify(message)));

        var messageObject = /** @type {!Object} */ ((typeof message === "string") ? JSON.parse(message) : message);

        if ("id" in messageObject) { // just a response for some request
            var callback = this._callbacks[messageObject.id];
            if (!callback) {
                reportProtocolError("Protocol Error: the message with wrong id", messageObject);
                return;
            }

            var processingStartTime;
            if (Options.dumpInspectorTimeStats)
                processingStartTime = Date.now();

            this.agent(callback.domain).dispatchResponse(messageObject, callback.methodName, callback);
            --this._pendingResponsesCount;
            delete this._callbacks[messageObject.id];

            if (Options.dumpInspectorTimeStats)
                console.log("time-stats: " + callback.methodName + " = " + (processingStartTime - callback.sendRequestTime) + " + " + (Date.now() - processingStartTime));

            if (this._scripts && !this._pendingResponsesCount)
                this.runAfterPendingDispatches();
            return;
        } else {
            var method = messageObject.method.split(".");
            var domainName = method[0];
            if (!(domainName in this._dispatchers)) {
                reportProtocolError("Protocol Error: the message " + messageObject.method + " is for non-existing domain '" + domainName + "'", messageObject);
                return;
            }

            this._dispatchers[domainName].dispatch(method[1], messageObject);
        }

    },

    /**
     * @param {string} domain
     * @param {!Object} dispatcher
     */
    registerDispatcher: function(domain, dispatcher)
    {
        if (!this._dispatchers[domain])
            return;

        this._dispatchers[domain].setDomainDispatcher(dispatcher);
    },

    /**
     * @param {function()=} script
     */
    runAfterPendingDispatches: function(script)
    {
        if (!this._scripts)
            this._scripts = [];

        if (script)
            this._scripts.push(script);

        // Execute all promises.
        setTimeout(function() {
            if (!this._pendingResponsesCount)
                this._executeAfterPendingDispatches();
            else
                this.runAfterPendingDispatches();
        }.bind(this), 0);
    },

    _executeAfterPendingDispatches: function()
    {
        if (!this._pendingResponsesCount) {
            var scripts = this._scripts;
            this._scripts = [];
            for (var id = 0; id < scripts.length; ++id)
                scripts[id].call(this);
        }
    },

    _dumpProtocolMessage: function(message)
    {
        console.log(message);
    },

    /**
     * @protected
     * @param {string} reason
     */
    connectionClosed: function(reason)
    {
        this._isConnected = false;
        this._runPendingCallbacks();
        this.dispatchEventToListeners(Connection.Events.Disconnected, {reason: reason});
    },

    _runPendingCallbacks: function()
    {
        var keys = Object.keys(this._callbacks).map(function(num) { return parseInt(num, 10); });
        for (var i = 0; i < keys.length; ++i) {
            var callback = this._callbacks[keys[i]];
            this._dispatchConnectionErrorResponse(callback.domain, callback.methodName, callback);
        }
        this._callbacks = {};
    },

    /**
     * @param {string} domain
     * @param {string} methodName
     * @param {function(*)} callback
     */
    _dispatchConnectionErrorResponse: function(domain, methodName, callback)
    {
        var error = { message: "Connection is closed, can't dispatch pending " + methodName, code:  _DevToolsErrorCode, data: null};
        var messageObject = {error: error};
        setTimeout(AgentPrototype.prototype.dispatchResponse.bind(this.agent(domain), messageObject, methodName, callback), 0);
    },

    /**
     * @return {boolean}
     */
    isClosed: function()
    {
        return !this._isConnected;
    },

    /**
     * @param {!Array.<string>} domains
     */
    suppressErrorsForDomains: function(domains)
    {
        domains.forEach(function(domain) { this._agents[domain].suppressErrorLogging(); }, this);
    },

    __proto__: {}

}

/**
 * @constructor
 * @extends {Connection}
 * @param {string} url
 * @param {function(!Connection)} onConnectionReady
 */
const WebSocketConnection = function(url, inspectorBackend, onConnectionReady)
{
    Connection.call(this, inspectorBackend);
    this._socket = new WebSocket(url);
    this._socket.onmessage = this._onMessage.bind(this);
    this._socket.onerror = this._onError.bind(this);
    this._socket.onopen = onConnectionReady.bind(null, this);
    this._socket.onclose = this.connectionClosed.bind(this, "websocket_closed");
}

/**
 * @param {string} url
 * @param {function(!Connection)} onConnectionReady
 */
WebSocketConnection.Create = function(url, InspectorBackendClass, onConnectionReady)
{
    new WebSocketConnection(url, inspectorBackend, onConnectionReady);
}

WebSocketConnection.prototype = {

    /**
     * @param {!MessageEvent} message
     */
    _onMessage: function(message)
    {
        var data = /** @type {string} */ (message.data);
        this.dispatch(data);
    },

    /**
     * @param {!Event} error
     */
    _onError: function(error)
    {
        console.error(error);
    },

    /**
     * @override
     * @param {!Object} messageObject
     */
    sendMessage: function(messageObject)
    {
        var message = JSON.stringify(messageObject);
        this._socket.send(message);
    },

    __proto__: Connection.prototype
}

module.exports = WebSocketConnection;
