"use strict";

const Options = require("./Options");
const errorCodes = require("./errorCodes");

const DevToolsStubErrorCode = errorCodes.DevToolsStubErrorCode;
const _DevToolsErrorCode = errorCodes._DevToolsErrorCode;

/**
 * @constructor
 * @param {string} domain
 */
function AgentPrototype(domain)
{
    this._replyArgs = {};
    this._hasErrorData = {};
    this._domain = domain;
    this._suppressErrorLogging = false;
}

AgentPrototype.prototype = {
    /**
     * @param {!Connection} connection
     */
    setConnection: function(connection)
    {
        this._connection = connection;
    },

    /**
     * @param {string} methodName
     * @param {!Array.<!Object>} signature
     * @param {!Array.<string>} replyArgs
     * @param {boolean} hasErrorData
     */
    registerCommand: function(methodName, signature, replyArgs, hasErrorData)
    {
        var domainAndMethod = this._domain + "." + methodName;

        /**
         * @param {...*} vararg
         * @this {AgentPrototype}
         * @return {!Promise.<*>}
         */
        function sendMessagePromise(vararg)
        {
            var params = Array.prototype.slice.call(arguments);
            return AgentPrototype.prototype._sendMessageToBackendPromise.call(this, domainAndMethod, signature, params);
        }

        this[methodName] = sendMessagePromise;

        /**
         * @param {...*} vararg
         * @this {AgentPrototype}
         */
        function invoke(vararg)
        {
            var params = [domainAndMethod].concat(Array.prototype.slice.call(arguments));
            AgentPrototype.prototype._invoke.apply(this, params);
        }

        this["invoke_" + methodName] = invoke;

        this._replyArgs[domainAndMethod] = replyArgs;
        if (hasErrorData)
            this._hasErrorData[domainAndMethod] = true;
    },

    /**
     * @param {string} method
     * @param {!Array.<!Object>} signature
     * @param {!Array.<*>} args
     * @param {boolean} allowExtraUndefinedArg
     * @param {function(string)} errorCallback
     * @return {?Object}
     */
    _prepareParameters: function(method, signature, args, allowExtraUndefinedArg, errorCallback)
    {
        var params = {};
        var hasParams = false;
        for (var i = 0; i < signature.length; ++i) {
            var param = signature[i];
            var paramName = param["name"];
            var typeName = param["type"];
            var optionalFlag = param["optional"];

            if (!args.length && !optionalFlag) {
                errorCallback("Protocol Error: Invalid number of arguments for method '" + method + "' call. It must have the following arguments '" + JSON.stringify(signature) + "'.");
                return null;
            }

            var value = args.shift();
            if (optionalFlag && typeof value === "undefined")
                continue;

            if (typeof value !== typeName) {
                errorCallback("Protocol Error: Invalid type of argument '" + paramName + "' for method '" + method + "' call. It must be '" + typeName + "' but it is '" + typeof value + "'.");
                return null;
            }

            params[paramName] = value;
            hasParams = true;
        }

        if (args.length === 1 && (!allowExtraUndefinedArg || (typeof args[0] !== "undefined"))) {
            errorCallback("Protocol Error: Optional callback argument for method '" + method + "' call must be a function but its type is '" + typeof args[0] + "'.");
            return null;
        }

        if (args.length > 1) {
            errorCallback("Protocol Error: Extra " + args.length + " arguments in a call to method '" + method + "'.");
            return null;
        }

        return hasParams ? params : null
    },

    /**
     * @param {string} method
     * @param {!Array.<!Object>} signature
     * @param {!Array.<*>} args
     * @return {!Promise.<*>}
     */
    _sendMessageToBackendPromise: function(method, signature, args)
    {
        var errorMessage;
        /**
         * @param {string} message
         */
        function onError(message)
        {
            console.error(message);
            errorMessage = message;
        }
        var userCallback = (args.length && typeof args.peekLast() === "function") ? args.pop() : null;
        var params = this._prepareParameters(method, signature, args, !userCallback, onError);
        if (errorMessage)
            return Promise.reject(new Error(errorMessage));
        else
            return new Promise(promiseAction.bind(this));

        /**
         * @param {function(?)} resolve
         * @param {function(!Error)} reject
         * @this {AgentPrototype}
         */
        function promiseAction(resolve, reject)
        {
            /**
             * @param {...*} vararg
             */
            function callback(vararg)
            {
                var result = userCallback ? userCallback.apply(null, arguments) : undefined;
                resolve(result);
            }
            this._connection._wrapCallbackAndSendMessageObject(this._domain, method, params, callback);
        }
    },

    /**
     * @param {string} method
     * @param {?Object} args
     * @param {?function(*)} callback
     */
    _invoke: function(method, args, callback)
    {
        this._connection._wrapCallbackAndSendMessageObject(this._domain, method, args, callback);
    },

    /**
     * @param {!Object} messageObject
     * @param {string} methodName
     * @param {function(*)|function(?Protocol.Error, ?Object)} callback
     */
    dispatchResponse: function(messageObject, methodName, callback)
    {
        if (messageObject.error && messageObject.error.code !== _DevToolsErrorCode && messageObject.error.code !== DevToolsStubErrorCode && !Options.suppressRequestErrors && !this._suppressErrorLogging) {
            var id = Options.dumpInspectorProtocolMessages ? " with id = " + messageObject.id : "";
            console.error("Request " + methodName + id + " failed. " + JSON.stringify(messageObject.error));
        }

        var argumentsArray = [];
        argumentsArray[0] = messageObject.error ? messageObject.error.message: null;

        if (this._hasErrorData[methodName])
            argumentsArray[1] = messageObject.error ? messageObject.error.data : null;

        if (messageObject.result) {
            var paramNames = this._replyArgs[methodName] || [];
            for (var i = 0; i < paramNames.length; ++i)
                argumentsArray.push(messageObject.result[paramNames[i]]);
        }

        callback.apply(null, argumentsArray);
    },

    suppressErrorLogging: function()
    {
        this._suppressErrorLogging = true;
    }
}

module.exports = AgentPrototype;
