
/**
 * @constructor
 * @extends {InspectorBackendClass.Connection}
 * @param {string} url
 * @param {function(!InspectorBackendClass.Connection)} onConnectionReady
 */
WebInspector.WebSocketConnection = function(url, onConnectionReady)
{
    InspectorBackendClass.Connection.call(this);
    this._socket = new WebSocket(url);
    this._socket.onmessage = this._onMessage.bind(this);
    this._socket.onerror = this._onError.bind(this);
    this._socket.onopen = onConnectionReady.bind(null, this);
    this._socket.onclose = this.connectionClosed.bind(this, "websocket_closed");
}

/**
 * @param {string} url
 * @param {function(!InspectorBackendClass.Connection)} onConnectionReady
 */
WebInspector.WebSocketConnection.Create = function(url, onConnectionReady)
{
    new WebInspector.WebSocketConnection(url, onConnectionReady);
}

WebInspector.WebSocketConnection.prototype = {

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

    __proto__: InspectorBackendClass.Connection.prototype
}
