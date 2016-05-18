"use strict";

const Options = require("./Options");

/**
 * @constructor
 */
function DispatcherPrototype()
{
    this._eventArgs = {};
    this._dispatcher = null;
}

DispatcherPrototype.prototype = {

    /**
     * @param {string} eventName
     * @param {!Object} params
     */
    registerEvent: function(eventName, params)
    {
        this._eventArgs[eventName] = params;
    },

    /**
     * @param {!Object} dispatcher
     */
    setDomainDispatcher: function(dispatcher)
    {
        this._dispatcher = dispatcher;
    },

    /**
     * @param {string} functionName
     * @param {!Object} messageObject
     */
    dispatch: function(functionName, messageObject)
    {
        if (!this._dispatcher)
            return;

        if (!(functionName in this._dispatcher)) {
            reportProtocolError("Protocol Error: Attempted to dispatch an unimplemented method '" + messageObject.method + "'", messageObject);
            return;
        }

        if (!this._eventArgs[messageObject.method]) {
            reportProtocolError("Protocol Error: Attempted to dispatch an unspecified method '" + messageObject.method + "'", messageObject);
            return;
        }

        var params = [];
        if (messageObject.params) {
            var paramNames = this._eventArgs[messageObject.method];
            for (var i = 0; i < paramNames.length; ++i)
                params.push(messageObject.params[paramNames[i]]);
        }

        var processingStartTime;
        if (Options.dumpInspectorTimeStats)
            processingStartTime = Date.now();

        this._dispatcher[functionName].apply(this._dispatcher, params);

        if (this.options.dumpInspectorTimeStats)
            console.log("time-stats: " + messageObject.method + " = " + (Date.now() - processingStartTime));
    }
}

module.exports = DispatcherPrototype;
