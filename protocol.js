{
    "version": { "major": "1", "minor": "1" },
    "domains": [{
        "domain": "Inspector",
        "hidden": true,
        "types": [],
        "commands": [
            {
                "name": "enable",
                "description": "Enables inspector domain notifications.",
                "handlers": ["browser", "renderer"]
            },
            {
                "name": "disable",
                "description": "Disables inspector domain notifications."
            }
        ],
        "events": [
            {
                "name": "evaluateForTestInFrontend",
                "parameters": [
                    { "name": "testCallId", "type": "integer" },
                    { "name": "script", "type": "string" }
                ]
            },
            {
                "name": "inspect",
                "parameters": [
                    { "name": "object", "$ref": "Runtime.RemoteObject" },
                    { "name": "hints", "type": "object" }
                ]
            },
            {
                "name": "detached",
                "description": "Fired when remote debugging connection is about to be terminated. Contains detach reason.",
                "parameters": [
                    { "name": "reason", "type": "string", "description": "The reason why connection has been terminated." }
                ],
                "handlers": ["browser"]
            },
            {
                "name": "targetCrashed",
                "description": "Fired when debugging target has crashed",
                "handlers": ["browser"]
            }
        ]
    },
    {
        "domain": "Memory",
        "hidden": true,
        "types": [
            {
                "id": "PressureLevel",
                "type": "string",
                "enum": ["moderate", "critical"],
                "description": "Memory pressure level."
            }
        ],
        "commands": [
            {
                "name": "getDOMCounters",
                "returns": [
                    { "name": "documents", "type": "integer" },
                    { "name": "nodes", "type": "integer" },
                    { "name": "jsEventListeners", "type": "integer" }
                ]
            },
            {
                "name": "setPressureNotificationsSuppressed",
                "description": "Enable/disable suppressing memory pressure notifications in all processes.",
                "parameters": [
                    { "name": "suppressed", "type": "boolean", "description": "If true, memory pressure notifications will be suppressed."}
                ],
                "handlers": ["browser"]
            },
            {
                "name": "simulatePressureNotification",
                "description": "Simulate a memory pressure notification in all processes.",
                "parameters": [
                    { "name": "level", "$ref": "PressureLevel", "description": "Memory pressure level of the notification." }
                ],
                "handlers": ["browser"]
            }
        ]
    },
    {
        "domain": "Page",
        "description": "Actions and events related to the inspected page belong to the page domain.",
        "types": [
            {
                "id": "ResourceType",
                "type": "string",
                "enum": ["Document", "Stylesheet", "Image", "Media", "Font", "Script", "TextTrack", "XHR", "Fetch", "EventSource", "WebSocket", "Manifest", "Other"],
                "description": "Resource type as it was perceived by the rendering engine."
            },
            {
              "id": "FrameId",
              "type": "string",
              "description": "Unique frame identifier."
            },
            {
                "id": "Frame",
                "type": "object",
                "description": "Information about the Frame on the page.",
                "properties": [
                    { "name": "id", "type": "string", "description": "Frame unique identifier." },
                    { "name": "parentId", "type": "string", "optional": true, "description": "Parent frame identifier." },
                    { "name": "loaderId", "$ref": "Network.LoaderId", "description": "Identifier of the loader associated with this frame." },
                    { "name": "name", "type": "string", "optional": true, "description": "Frame's name as specified in the tag." },
                    { "name": "url", "type": "string", "description": "Frame document's URL." },
                    { "name": "securityOrigin", "type": "string", "description": "Frame document's security origin." },
                    { "name": "mimeType", "type": "string", "description": "Frame document's mimeType as determined by the browser." }
                ]
            },
            {
                "id": "FrameResource",
                "type": "object",
                "description": "Information about the Resource on the page.",
                "properties": [
                    { "name": "url", "type": "string", "description": "Resource URL." },
                    { "name": "type", "$ref": "ResourceType", "description": "Type of this resource." },
                    { "name": "mimeType", "type": "string", "description": "Resource mimeType as determined by the browser." },
                    { "name": "failed", "type": "boolean", "optional": true, "description": "True if the resource failed to load." },
                    { "name": "canceled", "type": "boolean", "optional": true, "description": "True if the resource was canceled during loading." }
                ],
                "hidden": true
            },
            {
                "id": "FrameResourceTree",
                "type": "object",
                "description": "Information about the Frame hierarchy along with their cached resources.",
                "properties": [
                    { "name": "frame", "$ref": "Frame", "description": "Frame information for this tree item." },
                    { "name": "childFrames", "type": "array", "optional": true, "items": { "$ref": "FrameResourceTree" }, "description": "Child frames." },
                    { "name": "resources", "type": "array", "items": { "$ref": "FrameResource" }, "description": "Information about frame resources." }
                ],
                "hidden": true
            },
            {
                "id": "ScriptIdentifier",
                "type": "string",
                "description": "Unique script identifier.",
                "hidden": true
            },
            {
                "id": "NavigationEntry",
                "type": "object",
                "description": "Navigation history entry.",
                "properties": [
                  { "name": "id", "type": "integer", "description": "Unique id of the navigation history entry." },
                  { "name": "url", "type": "string", "description": "URL of the navigation history entry." },
                  { "name": "title", "type": "string", "description": "Title of the navigation history entry." }
                ],
                "hidden": true
            },
            {
                "id": "ScreencastFrameMetadata",
                "type": "object",
                "description": "Screencast frame metadata",
                "properties": [
                    { "name": "offsetTop", "type": "number", "hidden": true, "description": "Top offset in DIP." },
                    { "name": "pageScaleFactor", "type": "number", "hidden": true, "description": "Page scale factor." },
                    { "name": "deviceWidth", "type": "number", "hidden": true, "description": "Device screen width in DIP." },
                    { "name": "deviceHeight", "type": "number", "hidden": true, "description": "Device screen height in DIP." },
                    { "name": "scrollOffsetX", "type": "number", "hidden": true, "description": "Position of horizontal scroll in CSS pixels." },
                    { "name": "scrollOffsetY", "type": "number", "hidden": true, "description": "Position of vertical scroll in CSS pixels." },
                    { "name": "timestamp", "type": "number", "optional": true, "hidden": true, "description": "Frame swap timestamp." }
                ],
                "hidden": true
            },
            {
                "id": "DialogType",
                "description": "Javascript dialog type",
                "type": "string",
                "enum": ["alert", "confirm", "prompt", "beforeunload"],
                "hidden": true
            }
        ],
        "commands": [
            {
                "name": "enable",
                "description": "Enables page domain notifications.",
                "handlers": ["browser", "renderer"]
            },
            {
                "name": "disable",
                "description": "Disables page domain notifications.",
                "handlers": ["browser", "renderer"]
            },
            {
                "name": "addScriptToEvaluateOnLoad",
                "parameters": [
                    { "name": "scriptSource", "type": "string" }
                ],
                "returns": [
                    { "name": "identifier", "$ref": "ScriptIdentifier", "description": "Identifier of the added script." }
                ],
                "hidden": true
            },
            {
                "name": "removeScriptToEvaluateOnLoad",
                "parameters": [
                    { "name": "identifier", "$ref": "ScriptIdentifier" }
                ],
                "hidden": true
            },
            {
                "name": "setAutoAttachToCreatedPages",
                "parameters": [
                    { "name": "autoAttach", "type": "boolean", "description": "If true, browser will open a new inspector window for every page created from this one." }
                ],
                "description": "Controls whether browser will open a new inspector window for connected pages.",
                "hidden": true
            },
            {
                "name": "reload",
                "parameters": [
                    { "name": "ignoreCache", "type": "boolean", "optional": true, "description": "If true, browser cache is ignored (as if the user pressed Shift+refresh)." },
                    { "name": "scriptToEvaluateOnLoad", "type": "string", "optional": true, "description": "If set, the script will be injected into all frames of the inspected page after reload." }
                ],
                "description": "Reloads given page optionally ignoring the cache.",
                "handlers": ["browser", "renderer"]
            },
            {
                "name": "navigate",
                "parameters": [
                    { "name": "url", "type": "string", "description": "URL to navigate the page to." }
                ],
                "returns": [
                    { "name": "frameId", "$ref": "FrameId", "hidden": true, "description": "Frame id that will be navigated." }
                ],
                "description": "Navigates current page to the given URL.",
                "handlers": ["browser", "renderer"]
            },
            {
              "name": "getNavigationHistory",
              "returns": [
                { "name": "currentIndex", "type": "integer", "description": "Index of the current navigation history entry." },
                { "name": "entries", "type": "array", "items": { "$ref": "NavigationEntry" }, "description": "Array of navigation history entries." }
              ],
              "description": "Returns navigation history for the current page.",
              "hidden": true,
              "handlers": ["browser"]
            },
            {
              "name": "navigateToHistoryEntry",
              "parameters": [
                  { "name": "entryId", "type": "integer", "description": "Unique id of the entry to navigate to." }
              ],
              "description": "Navigates current page to the given history entry.",
              "hidden": true,
              "handlers": ["browser"]
            },
            {
                "name": "getCookies",
                "returns": [
                    { "name": "cookies", "type": "array", "items": { "$ref": "Network.Cookie" }, "description": "Array of cookie objects." }
                ],
                "description": "Returns all browser cookies. Depending on the backend support, will return detailed cookie information in the <code>cookies</code> field.",
                "handlers": ["browser"],
                "async": true,
                "hidden": true,
                "redirect": "Network"
            },
            {
                "name": "deleteCookie",
                "parameters": [
                    { "name": "cookieName", "type": "string", "description": "Name of the cookie to remove." },
                    { "name": "url", "type": "string", "description": "URL to match cooke domain and path." }
                ],
                "description": "Deletes browser cookie with given name, domain and path.",
                "handlers": ["browser"],
                "async": true,
                "hidden": true,
                "redirect": "Network"
            },
            {
                "name": "getResourceTree",
                "description": "Returns present frame / resource tree structure.",
                "returns": [
                    { "name": "frameTree", "$ref": "FrameResourceTree", "description": "Present frame / resource tree structure." }
                ],
                "hidden": true
            },
            {
                "name": "getResourceContent",
                "async": true,
                "description": "Returns content of the given resource.",
                "parameters": [
                    { "name": "frameId", "$ref": "FrameId", "description": "Frame id to get resource for." },
                    { "name": "url", "type": "string", "description": "URL of the resource to get content for." }
                ],
                "returns": [
                    { "name": "content", "type": "string", "description": "Resource content." },
                    { "name": "base64Encoded", "type": "boolean", "description": "True, if content was served as base64." }
                ],
                "hidden": true
            },
            {
                "name": "searchInResource",
                "async": true,
                "description": "Searches for given string in resource content.",
                "parameters": [
                    { "name": "frameId", "$ref": "FrameId", "description": "Frame id for resource to search in." },
                    { "name": "url", "type": "string", "description": "URL of the resource to search in." },
                    { "name": "query", "type": "string", "description": "String to search for."  },
                    { "name": "caseSensitive", "type": "boolean", "optional": true, "description": "If true, search is case sensitive." },
                    { "name": "isRegex", "type": "boolean", "optional": true, "description": "If true, treats string parameter as regex." }
                ],
                "returns": [
                    { "name": "result", "type": "array", "items": { "$ref": "Debugger.SearchMatch" }, "description": "List of search matches." }
                ],
                "hidden": true
            },
            {
                "name": "setDocumentContent",
                "description": "Sets given markup as the document's HTML.",
                "parameters": [
                    { "name": "frameId", "$ref": "FrameId", "description": "Frame id to set HTML for." },
                    { "name": "html", "type": "string", "description": "HTML content to set."  }
                ],
                "hidden": true
            },
            {
                "name": "setDeviceMetricsOverride",
                "description": "Overrides the values of device screen dimensions (window.screen.width, window.screen.height, window.innerWidth, window.innerHeight, and \"device-width\"/\"device-height\"-related CSS media query results).",
                "parameters": [
                    { "name": "width", "type": "integer", "description": "Overriding width value in pixels (minimum 0, maximum 10000000). 0 disables the override." },
                    { "name": "height", "type": "integer", "description": "Overriding height value in pixels (minimum 0, maximum 10000000). 0 disables the override." },
                    { "name": "deviceScaleFactor", "type": "number", "description": "Overriding device scale factor value. 0 disables the override." },
                    { "name": "mobile", "type": "boolean", "description": "Whether to emulate mobile device. This includes viewport meta tag, overlay scrollbars, text autosizing and more." },
                    { "name": "fitWindow", "type": "boolean", "description": "Whether a view that exceeds the available browser window area should be scaled down to fit." },
                    { "name": "scale", "type": "number", "optional": true, "description": "Scale to apply to resulting view image. Ignored in |fitWindow| mode." },
                    { "name": "offsetX", "type": "number", "optional": true, "description": "X offset to shift resulting view image by. Ignored in |fitWindow| mode." },
                    { "name": "offsetY", "type": "number", "optional": true, "description": "Y offset to shift resulting view image by. Ignored in |fitWindow| mode." },
                    { "name": "screenWidth", "type": "integer", "optional": true, "description": "Overriding screen width value in pixels (minimum 0, maximum 10000000). Only used for |mobile==true|." },
                    { "name": "screenHeight", "type": "integer", "optional": true, "description": "Overriding screen height value in pixels (minimum 0, maximum 10000000). Only used for |mobile==true|." },
                    { "name": "positionX", "type": "integer", "optional": true, "description": "Overriding view X position on screen in pixels (minimum 0, maximum 10000000). Only used for |mobile==true|." },
                    { "name": "positionY", "type": "integer", "optional": true, "description": "Overriding view Y position on screen in pixels (minimum 0, maximum 10000000). Only used for |mobile==true|." },
                    { "name": "screenOrientation", "$ref": "Emulation.ScreenOrientation", "optional": true, "description": "Screen orientation override." }
                ],
                "handlers": ["browser"],
                "redirect": "Emulation",
                "hidden": true
            },
            {
                "name": "clearDeviceMetricsOverride",
                "description": "Clears the overriden device metrics.",
                "handlers": ["browser"],
                "redirect": "Emulation",
                "hidden": true
            },
            {
                "name": "setGeolocationOverride",
                "description": "Overrides the Geolocation Position or Error. Omitting any of the parameters emulates position unavailable.",
                "parameters": [
                    { "name": "latitude", "type": "number", "optional": true, "description": "Mock latitude"},
                    { "name": "longitude", "type": "number", "optional": true, "description": "Mock longitude"},
                    { "name": "accuracy", "type": "number", "optional": true, "description": "Mock accuracy"}
                ],
                "redirect": "Emulation",
                "handlers": ["browser"]
            },
            {
                "name": "clearGeolocationOverride",
                "description": "Clears the overriden Geolocation Position and Error.",
                "redirect": "Emulation",
                "handlers": ["browser"]
            },
            {
                "name": "setDeviceOrientationOverride",
                "description": "Overrides the Device Orientation.",
                "parameters": [
                    { "name": "alpha", "type": "number", "description": "Mock alpha"},
                    { "name": "beta", "type": "number", "description": "Mock beta"},
                    { "name": "gamma", "type": "number", "description": "Mock gamma"}
                ],
                "redirect": "DeviceOrientation",
                "hidden": true
            },
            {
                "name": "clearDeviceOrientationOverride",
                "description": "Clears the overridden Device Orientation.",
                "redirect": "DeviceOrientation",
                "hidden": true
            },
            {
                "name": "setTouchEmulationEnabled",
                "parameters": [
                    { "name": "enabled", "type": "boolean", "description": "Whether the touch event emulation should be enabled." },
                    { "name": "configuration", "type": "string", "enum": ["mobile", "desktop"], "optional": true, "description": "Touch/gesture events configuration. Default: current platform." }
                ],
                "description": "Toggles mouse event-based touch event emulation.",
                "hidden": true,
                "redirect": "Emulation",
                "handlers": ["browser", "renderer"]
            },
            {
                "name": "captureScreenshot",
                "async": true,
                "description": "Capture page screenshot.",
                "returns": [
                    { "name": "data", "type": "string", "description": "Base64-encoded image data (PNG)." }
                ],
                "hidden": true,
                "handlers": ["browser"]
            },
            {
                "name": "startScreencast",
                "description": "Starts sending each frame using the <code>screencastFrame</code> event.",
                "parameters": [
                    { "name": "format", "type": "string", "optional": true, "enum": ["jpeg", "png"], "description": "Image compression format." },
                    { "name": "quality", "type": "integer", "optional": true, "description": "Compression quality from range [0..100]." },
                    { "name": "maxWidth", "type": "integer", "optional": true, "description": "Maximum screenshot width." },
                    { "name": "maxHeight", "type": "integer", "optional": true, "description": "Maximum screenshot height." },
                    { "name": "everyNthFrame", "type": "integer", "optional": true, "description": "Send every n-th frame." }
                ],
                "hidden": true,
                "handlers": ["browser", "renderer"]
            },
            {
                "name": "stopScreencast",
                "description": "Stops sending each frame in the <code>screencastFrame</code>.",
                "hidden": true,
                "handlers": ["browser", "renderer"]
            },
            {
                "name": "screencastFrameAck",
                "description": "Acknowledges that a screencast frame has been received by the frontend.",
                "parameters": [
                    { "name": "sessionId", "type": "integer", "description": "Frame number." }
                ],
                "hidden": true,
                "handlers": ["browser"]
            },
            {
                "name": "handleJavaScriptDialog",
                "description": "Accepts or dismisses a JavaScript initiated dialog (alert, confirm, prompt, or onbeforeunload).",
                "parameters": [
                    { "name": "accept", "type": "boolean", "description": "Whether to accept or dismiss the dialog." },
                    { "name": "promptText", "type": "string", "optional": true, "description": "The text to enter into the dialog prompt before accepting. Used only if this is a prompt dialog." }
                ],
                "hidden": true,
                "handlers": ["browser"]
            },
            {
                "name": "setColorPickerEnabled",
                "parameters": [
                    { "name": "enabled", "type": "boolean", "description": "Shows / hides color picker" }
                ],
                "description": "Shows / hides color picker",
                "hidden": true,
                "handlers": ["browser"]
            },
            {
                "name": "setOverlayMessage",
                "parameters": [
                    { "name": "message", "type": "string", "optional": true, "description": "Overlay message to display when paused in debugger." }
                ],
                "hidden": true,
                "description": "Sets overlay message."
            },
            {
                "name": "requestAppBanner",
                "returns": [
                  { "name": "result", "type": "boolean" }
                ],
                "hidden": true,
                "handlers": ["browser"]
            }
        ],
        "events": [
            {
                "name": "domContentEventFired",
                "parameters": [
                    { "name": "timestamp", "type": "number" }
                ]
            },
            {
                "name": "loadEventFired",
                "parameters": [
                    { "name": "timestamp", "type": "number" }
                ]
            },
            {
                "name": "frameAttached",
                "description": "Fired when frame has been attached to its parent.",
                "parameters": [
                    { "name": "frameId", "$ref": "FrameId", "description": "Id of the frame that has been attached." },
                    { "name": "parentFrameId", "$ref": "FrameId", "description": "Parent frame identifier." }
                ]
            },
            {
                "name": "frameNavigated",
                "description": "Fired once navigation of the frame has completed. Frame is now associated with the new loader.",
                "parameters": [
                    { "name": "frame", "$ref": "Frame", "description": "Frame object." }
                ]
            },
            {
                "name": "frameDetached",
                "description": "Fired when frame has been detached from its parent.",
                "parameters": [
                    { "name": "frameId", "$ref": "FrameId", "description": "Id of the frame that has been detached." }
                ]
            },
            {
                "name": "frameStartedLoading",
                "description": "Fired when frame has started loading.",
                "parameters": [
                    { "name": "frameId", "$ref": "FrameId", "description": "Id of the frame that has started loading." }
                ],
                "hidden": true
            },
            {
                "name": "frameStoppedLoading",
                "description": "Fired when frame has stopped loading.",
                "parameters": [
                    { "name": "frameId", "$ref": "FrameId", "description": "Id of the frame that has stopped loading." }
                ],
                "hidden": true
            },
            {
                "name": "frameScheduledNavigation",
                "description": "Fired when frame schedules a potential navigation.",
                "parameters": [
                    { "name": "frameId", "$ref": "FrameId", "description": "Id of the frame that has scheduled a navigation." },
                    { "name": "delay", "type": "number", "description": "Delay (in seconds) until the navigation is scheduled to begin. The navigation is not guaranteed to start." }
                ],
                "hidden": true
            },
            {
                "name": "frameClearedScheduledNavigation",
                "description": "Fired when frame no longer has a scheduled navigation.",
                "parameters": [
                    { "name": "frameId", "$ref": "FrameId", "description": "Id of the frame that has cleared its scheduled navigation." }
                ],
                "hidden": true
            },
            {
                "name": "frameResized",
                "hidden": true
            },
            {
                "name": "javascriptDialogOpening",
                "description": "Fired when a JavaScript initiated dialog (alert, confirm, prompt, or onbeforeunload) is about to open.",
                "parameters": [
                    { "name": "message", "type": "string", "description": "Message that will be displayed by the dialog." },
                    { "name": "type", "$ref": "DialogType", "description": "Dialog type." }
                ],
                "hidden": true
            },
            {
                "name": "javascriptDialogClosed",
                "description": "Fired when a JavaScript initiated dialog (alert, confirm, prompt, or onbeforeunload) has been closed.",
                "parameters": [
                    { "name": "result", "type": "boolean", "description": "Whether dialog was confirmed." }
                ],
                "hidden": true
            },
            {
                "name": "screencastFrame",
                "description": "Compressed image data requested by the <code>startScreencast</code>.",
                "parameters": [
                    { "name": "data", "type": "string", "description": "Base64-encoded compressed image." },
                    { "name": "metadata", "$ref": "ScreencastFrameMetadata", "description": "Screencast frame metadata."},
                    { "name": "sessionId", "type": "integer", "description": "Frame number."}
                ],
                "hidden": true,
                "handlers": ["browser"]
            },
            {
                "name": "screencastVisibilityChanged",
                "description": "Fired when the page with currently enabled screencast was shown or hidden </code>.",
                "parameters": [
                    { "name": "visible", "type": "boolean", "description": "True if the page is visible." }
                ],
                "hidden": true,
                "handlers": ["browser"]
            },
            {
                "name": "colorPicked",
                "description": "Fired when a color has been picked.",
                "parameters": [
                    { "name": "color", "$ref": "DOM.RGBA", "description": "RGBA of the picked color." }
                ],
                "hidden": true,
                "handlers": ["browser"]
            },
            {
                "name": "interstitialShown",
                "description": "Fired when interstitial page was shown",
                "hidden": true,
                "handlers": ["browser"]
            },
            {
                "name": "interstitialHidden",
                "description": "Fired when interstitial page was hidden",
                "hidden": true,
                "handlers": ["browser"]
            }
        ]
    },
    {
        "domain": "Rendering",
        "description": "This domain allows to control rendering of the page.",
        "hidden": true,
        "commands": [
            {
                "name": "setShowPaintRects",
                "description": "Requests that backend shows paint rectangles",
                "parameters": [
                    { "name": "result", "type": "boolean", "description": "True for showing paint rectangles" }
                ]
            },
            {
                "name": "setShowDebugBorders",
                "description": "Requests that backend shows debug borders on layers",
                "parameters": [
                    { "name": "show", "type": "boolean", "description": "True for showing debug borders" }
                ]
            },
            {
                "name": "setShowFPSCounter",
                "description": "Requests that backend shows the FPS counter",
                "parameters": [
                    { "name": "show", "type": "boolean", "description": "True for showing the FPS counter" }
                ]
            },
            {
                "name": "setShowScrollBottleneckRects",
                "description": "Requests that backend shows scroll bottleneck rects",
                "parameters": [
                    { "name": "show", "type": "boolean", "description": "True for showing scroll bottleneck rects" }
                ]
            },
            {
                "name": "setShowViewportSizeOnResize",
                "description": "Paints viewport size upon main frame resize.",
                "parameters": [
                    { "name": "show", "type": "boolean", "description": "Whether to paint size or not." }
                ]
            }
        ]
    },
    {
        "domain": "Emulation",
        "description": "This domain emulates different environments for the page.",
        "hidden": true,
        "types": [
            {
                "id": "ScreenOrientation",
                "type": "object",
                "description": "Screen orientation.",
                "properties": [
                    { "name": "type",  "type": "string", "enum": ["portraitPrimary", "portraitSecondary", "landscapePrimary", "landscapeSecondary"], "description": "Orientation type." },
                    { "name": "angle",  "type": "integer", "description": "Orientation angle." }
                ]
            }
        ],
        "commands": [
            {
                "name": "setDeviceMetricsOverride",
                "description": "Overrides the values of device screen dimensions (window.screen.width, window.screen.height, window.innerWidth, window.innerHeight, and \"device-width\"/\"device-height\"-related CSS media query results).",
                "parameters": [
                    { "name": "width", "type": "integer", "description": "Overriding width value in pixels (minimum 0, maximum 10000000). 0 disables the override." },
                    { "name": "height", "type": "integer", "description": "Overriding height value in pixels (minimum 0, maximum 10000000). 0 disables the override." },
                    { "name": "deviceScaleFactor", "type": "number", "description": "Overriding device scale factor value. 0 disables the override." },
                    { "name": "mobile", "type": "boolean", "description": "Whether to emulate mobile device. This includes viewport meta tag, overlay scrollbars, text autosizing and more." },
                    { "name": "fitWindow", "type": "boolean", "description": "Whether a view that exceeds the available browser window area should be scaled down to fit." },
                    { "name": "scale", "type": "number", "optional": true, "description": "Scale to apply to resulting view image. Ignored in |fitWindow| mode." },
                    { "name": "offsetX", "type": "number", "optional": true, "description": "X offset to shift resulting view image by. Ignored in |fitWindow| mode." },
                    { "name": "offsetY", "type": "number", "optional": true, "description": "Y offset to shift resulting view image by. Ignored in |fitWindow| mode." },
                    { "name": "screenWidth", "type": "integer", "optional": true, "description": "Overriding screen width value in pixels (minimum 0, maximum 10000000). Only used for |mobile==true|." },
                    { "name": "screenHeight", "type": "integer", "optional": true, "description": "Overriding screen height value in pixels (minimum 0, maximum 10000000). Only used for |mobile==true|." },
                    { "name": "positionX", "type": "integer", "optional": true, "description": "Overriding view X position on screen in pixels (minimum 0, maximum 10000000). Only used for |mobile==true|." },
                    { "name": "positionY", "type": "integer", "optional": true, "description": "Overriding view Y position on screen in pixels (minimum 0, maximum 10000000). Only used for |mobile==true|." },
                    { "name": "screenOrientation", "$ref": "ScreenOrientation", "optional": true, "description": "Screen orientation override." }
                ],
                "handlers": ["browser"]
            },
            {
                "name": "clearDeviceMetricsOverride",
                "description": "Clears the overriden device metrics.",
                "handlers": ["browser"]
            },
            {
                "name": "resetPageScaleFactor",
                "description": "Requests that page scale factor is reset to initial values."
            },
            {
                "name": "setPageScaleFactor",
                "description": "Sets a specified page scale factor.",
                "parameters": [
                    { "name": "pageScaleFactor", "type": "number", "description": "Page scale factor." }
                ]
            },
            {
                "name": "setScriptExecutionDisabled",
                "description": "Switches script execution in the page.",
                "parameters": [
                    { "name": "value", "type": "boolean", "description": "Whether script execution should be disabled in the page." }
                ]
            },
            {
                "name": "setGeolocationOverride",
                "description": "Overrides the Geolocation Position or Error. Omitting any of the parameters emulates position unavailable.",
                "parameters": [
                    { "name": "latitude", "type": "number", "optional": true, "description": "Mock latitude"},
                    { "name": "longitude", "type": "number", "optional": true, "description": "Mock longitude"},
                    { "name": "accuracy", "type": "number", "optional": true, "description": "Mock accuracy"}
                ],
                "handlers": ["browser"]
            },
            {
                "name": "clearGeolocationOverride",
                "description": "Clears the overriden Geolocation Position and Error.",
                "handlers": ["browser"]
            },
            {
                "name": "setTouchEmulationEnabled",
                "parameters": [
                    { "name": "enabled", "type": "boolean", "description": "Whether the touch event emulation should be enabled." },
                    { "name": "configuration", "type": "string", "enum": ["mobile", "desktop"], "optional": true, "description": "Touch/gesture events configuration. Default: current platform." }
                ],
                "description": "Toggles mouse event-based touch event emulation.",
                "handlers": ["browser", "renderer"]
            },
            {
                "name": "setEmulatedMedia",
                "parameters": [
                    { "name": "media", "type": "string", "description": "Media type to emulate. Empty string disables the override." }
                ],
                "description": "Emulates the given media for CSS media queries."
            },
            {
                "name": "setCPUThrottlingRate",
                "parameters": [
                    { "name": "rate", "type": "number", "description": "Throttling rate as a slowdown factor (1 is no throttle, 2 is 2x slowdown, etc)." }
                ],
                "description": "Enables CPU throttling to emulate slow CPUs."
            },
            {
                "name": "canEmulate",
                "description": "Tells whether emulation is supported.",
                "returns": [
                    { "name": "result", "type": "boolean", "description": "True if emulation is supported." }
                ],
                "handlers": ["browser"]
            }
        ]
    },
    {
        "domain": "Runtime",
        "description": "Runtime domain exposes JavaScript runtime by means of remote evaluation and mirror objects. Evaluation results are returned as mirror object that expose object type, string representation and unique identifier that can be used for further object reference. Original objects are maintained in memory unless they are either explicitly released or are released along with the other objects in their object group.",
        "types": [
            {
                "id": "ScriptId",
                "type": "string",
                "description": "Unique script identifier."
            },
            {
                "id": "RemoteObjectId",
                "type": "string",
                "description": "Unique object identifier."
            },
            {
                "id": "RemoteObject",
                "type": "object",
                "description": "Mirror object referencing original JavaScript object.",
                "properties": [
                    { "name": "type", "type": "string", "enum": ["object", "function", "undefined", "string", "number", "boolean", "symbol"], "description": "Object type." },
                    { "name": "subtype", "type": "string", "optional": true, "enum": ["array", "null", "node", "regexp", "date", "map", "set", "iterator", "generator", "error"], "description": "Object subtype hint. Specified for <code>object</code> type values only." },
                    { "name": "className", "type": "string", "optional": true, "description": "Object class (constructor) name. Specified for <code>object</code> type values only." },
                    { "name": "value", "type": "any", "optional": true, "description": "Remote object value in case of primitive values or JSON values (if it was requested), or description string if the value can not be JSON-stringified (like NaN, Infinity, -Infinity, -0)." },
                    { "name": "description", "type": "string", "optional": true, "description": "String representation of the object." },
                    { "name": "objectId", "$ref": "RemoteObjectId", "optional": true, "description": "Unique object identifier (for non-primitive values)." },
                    { "name": "preview", "$ref": "ObjectPreview", "optional": true, "description": "Preview containing abbreviated property values. Specified for <code>object</code> type values only.", "hidden": true },
                    { "name": "customPreview", "$ref": "CustomPreview", "optional": true, "hidden": true}
                ]
            },
            {   "id": "CustomPreview",
                "type": "object",
                "hidden": true,
                "properties": [
                    { "name": "header", "type": "string"},
                    { "name": "hasBody", "type": "boolean"},
                    {"name": "formatterObjectId", "$ref": "RemoteObjectId"},
                    {"name": "configObjectId", "$ref": "RemoteObjectId", "optional": true}
                ]
            },
            {
                "id": "ObjectPreview",
                "type": "object",
                "hidden": true,
                "description": "Object containing abbreviated remote object value.",
                "properties": [
                    { "name": "type", "type": "string", "enum": ["object", "function", "undefined", "string", "number", "boolean", "symbol"], "description": "Object type." },
                    { "name": "subtype", "type": "string", "optional": true, "enum": ["array", "null", "node", "regexp", "date", "map", "set", "iterator", "generator", "error"], "description": "Object subtype hint. Specified for <code>object</code> type values only." },
                    { "name": "description", "type": "string", "optional": true, "description": "String representation of the object." },
                    { "name": "lossless", "type": "boolean", "description": "Determines whether preview is lossless (contains all information of the original object)." },
                    { "name": "overflow", "type": "boolean", "description": "True iff some of the properties or entries of the original object did not fit." },
                    { "name": "properties", "type": "array", "items": { "$ref": "PropertyPreview" }, "description": "List of the properties." },
                    { "name": "entries", "type": "array", "items": { "$ref": "EntryPreview" }, "optional": true, "description": "List of the entries. Specified for <code>map</code> and <code>set</code> subtype values only." }
                ]
            },
            {
                "id": "PropertyPreview",
                "type": "object",
                "hidden": true,
                "properties": [
                    { "name": "name", "type": "string", "description": "Property name." },
                    { "name": "type", "type": "string", "enum": ["object", "function", "undefined", "string", "number", "boolean", "symbol", "accessor"], "description": "Object type. Accessor means that the property itself is an accessor property." },
                    { "name": "value", "type": "string", "optional": true, "description": "User-friendly property value string." },
                    { "name": "valuePreview", "$ref": "ObjectPreview", "optional": true, "description": "Nested value preview." },
                    { "name": "subtype", "type": "string", "optional": true, "enum": ["array", "null", "node", "regexp", "date", "map", "set", "iterator", "generator", "error"], "description": "Object subtype hint. Specified for <code>object</code> type values only." }
                ]
            },
            {
                "id": "EntryPreview",
                "type": "object",
                "hidden": true,
                "properties": [
                    { "name": "key", "$ref": "ObjectPreview", "optional": true, "description": "Preview of the key. Specified for map-like collection entries." },
                    { "name": "value", "$ref": "ObjectPreview", "description": "Preview of the value." }
                ]
            },
            {
                "id": "PropertyDescriptor",
                "type": "object",
                "description": "Object property descriptor.",
                "properties": [
                    { "name": "name", "type": "string", "description": "Property name or symbol description." },
                    { "name": "value", "$ref": "RemoteObject", "optional": true, "description": "The value associated with the property." },
                    { "name": "writable", "type": "boolean", "optional": true, "description": "True if the value associated with the property may be changed (data descriptors only)." },
                    { "name": "get", "$ref": "RemoteObject", "optional": true, "description": "A function which serves as a getter for the property, or <code>undefined</code> if there is no getter (accessor descriptors only)." },
                    { "name": "set", "$ref": "RemoteObject", "optional": true, "description": "A function which serves as a setter for the property, or <code>undefined</code> if there is no setter (accessor descriptors only)." },
                    { "name": "configurable", "type": "boolean", "description": "True if the type of this property descriptor may be changed and if the property may be deleted from the corresponding object." },
                    { "name": "enumerable", "type": "boolean", "description": "True if this property shows up during enumeration of the properties on the corresponding object." },
                    { "name": "wasThrown", "type": "boolean", "optional": true, "description": "True if the result was thrown during the evaluation." },
                    { "name": "isOwn", "optional": true, "type": "boolean", "description": "True if the property is owned for the object.", "hidden": true },
                    { "name": "symbol", "$ref": "RemoteObject", "optional": true, "description": "Property symbol object, if the property is of the <code>symbol</code> type.", "hidden": true }
                ]
            },
            {
                "id": "InternalPropertyDescriptor",
                "type": "object",
                "description": "Object internal property descriptor. This property isn't normally visible in JavaScript code.",
                "properties": [
                    { "name": "name", "type": "string", "description": "Conventional property name." },
                    { "name": "value", "$ref": "RemoteObject", "optional": true, "description": "The value associated with the property." }
                ],
                "hidden": true
            },
            {
                "id": "CallArgument",
                "type": "object",
                "description": "Represents function call argument. Either remote object id <code>objectId</code> or primitive <code>value</code> or neither of (for undefined) them should be specified.",
                "properties": [
                    { "name": "value", "type": "any", "optional": true, "description": "Primitive value, or description string if the value can not be JSON-stringified (like NaN, Infinity, -Infinity, -0)." },
                    { "name": "objectId", "$ref": "RemoteObjectId", "optional": true, "description": "Remote object handle." },
                    { "name": "type", "optional": true, "hidden": true, "type": "string", "enum": ["object", "function", "undefined", "string", "number", "boolean", "symbol"], "description": "Object type." }
                ]
            },
            {
                "id": "ExecutionContextId",
                "type": "integer",
                "description": "Id of an execution context."
            },
            {
                "id": "ExecutionContextDescription",
                "type": "object",
                "description": "Description of an isolated world.",
                "properties": [
                    { "name": "id", "$ref": "ExecutionContextId", "description": "Unique id of the execution context. It can be used to specify in which execution context script evaluation should be performed." },
                    { "name": "type", "type": "string", "optional": true, "description": "Context type. It is used e.g. to distinguish content scripts from web page script.", "hidden": true },
                    { "name": "origin", "type": "string", "description": "Execution context origin.", "hidden": true},
                    { "name": "name", "type": "string", "description": "Human readable name describing given context.", "hidden": true},
                    { "name": "frameId", "type": "string", "description": "Id of the owning frame. May be an empty string if the context is not associated with a frame." }
                ]
            },
            {
                "id": "ExceptionDetails",
                "type": "object",
                "description": "Detailed information on exception (or error) that was thrown during script compilation or execution.",
                "properties": [
                    { "name": "text", "type": "string", "description": "Exception text." },
                    { "name": "url", "type": "string", "optional": true, "description": "URL of the message origin." },
                    { "name": "scriptId", "type": "string", "optional": true, "description": "Script ID of the message origin." },
                    { "name": "line", "type": "integer", "optional": true, "description": "Line number in the resource that generated this message." },
                    { "name": "column", "type": "integer", "optional": true, "description": "Column number in the resource that generated this message." },
                    { "name": "stack", "$ref": "StackTrace", "optional": true, "description": "JavaScript stack trace for assertions and error messages." }
                ]
            },
            {
                "id": "CallFrame",
                "type": "object",
                "description": "Stack entry for runtime errors and assertions.",
                "properties": [
                    { "name": "functionName", "type": "string", "description": "JavaScript function name." },
                    { "name": "scriptId", "$ref": "ScriptId", "description": "JavaScript script id." },
                    { "name": "url", "type": "string", "description": "JavaScript script name or url." },
                    { "name": "lineNumber", "type": "integer", "description": "JavaScript script line number." },
                    { "name": "columnNumber", "type": "integer", "description": "JavaScript script column number." }
                ]
            },
            {
                "id": "StackTrace",
                "type": "object",
                "description": "Call frames for assertions or error messages.",
                "properties": [
                    { "name": "description", "type": "string", "optional": true, "description": "String label of this stack trace. For async traces this may be a name of the function that initiated the async call." },
                    { "name": "callFrames", "type": "array", "items": { "$ref": "CallFrame" }, "description": "JavaScript function name." },
                    { "name": "parent", "$ref": "StackTrace", "optional": true, "hidden": true, "hidden": true, "description": "Asynchronous JavaScript stack trace that preceded this stack, if available." }
                ]
            }
        ],
        "commands": [
            {
                "name": "evaluate",
                "parameters": [
                    { "name": "expression", "type": "string", "description": "Expression to evaluate." },
                    { "name": "objectGroup", "type": "string", "optional": true, "description": "Symbolic group name that can be used to release multiple objects." },
                    { "name": "includeCommandLineAPI", "type": "boolean", "optional": true, "description": "Determines whether Command Line API should be available during the evaluation.", "hidden": true },
                    { "name": "doNotPauseOnExceptionsAndMuteConsole", "type": "boolean", "optional": true, "description": "Specifies whether evaluation should stop on exceptions and mute console. Overrides setPauseOnException state.", "hidden": true },
                    { "name": "contextId", "$ref": "ExecutionContextId", "optional": true, "description": "Specifies in which isolated context to perform evaluation. Each content script lives in an isolated context and this parameter may be used to specify one of those contexts. If the parameter is omitted or 0 the evaluation will be performed in the context of the inspected page." },
                    { "name": "returnByValue", "type": "boolean", "optional": true, "description": "Whether the result is expected to be a JSON object that should be sent by value." },
                    { "name": "generatePreview", "type": "boolean", "optional": true, "hidden": true, "description": "Whether preview should be generated for the result." }
                ],
                "returns": [
                    { "name": "result", "$ref": "RemoteObject", "description": "Evaluation result." },
                    { "name": "wasThrown", "type": "boolean", "optional": true, "description": "True if the result was thrown during the evaluation." },
                    { "name": "exceptionDetails", "$ref": "ExceptionDetails", "optional": true, "hidden": true, "description": "Exception details."}
                ],
                "description": "Evaluates expression on global object."
            },
            {
                "name": "callFunctionOn",
                "parameters": [
                    { "name": "objectId", "$ref": "RemoteObjectId", "description": "Identifier of the object to call function on." },
                    { "name": "functionDeclaration", "type": "string", "description": "Declaration of the function to call." },
                    { "name": "arguments", "type": "array", "items": { "$ref": "CallArgument", "description": "Call argument." }, "optional": true, "description": "Call arguments. All call arguments must belong to the same JavaScript world as the target object." },
                    { "name": "doNotPauseOnExceptionsAndMuteConsole", "type": "boolean", "optional": true, "description": "Specifies whether function call should stop on exceptions and mute console. Overrides setPauseOnException state.", "hidden": true },
                    { "name": "returnByValue", "type": "boolean", "optional": true, "description": "Whether the result is expected to be a JSON object which should be sent by value." },
                    { "name": "generatePreview", "type": "boolean", "optional": true, "hidden": true, "description": "Whether preview should be generated for the result." }
                ],
                "returns": [
                    { "name": "result", "$ref": "RemoteObject", "description": "Call result." },
                    { "name": "wasThrown", "type": "boolean", "optional": true, "description": "True if the result was thrown during the evaluation." }
                ],
                "description": "Calls function with given declaration on the given object. Object group of the result is inherited from the target object."
            },
            {
                "name": "getProperties",
                "parameters": [
                    { "name": "objectId", "$ref": "RemoteObjectId", "description": "Identifier of the object to return properties for." },
                    { "name": "ownProperties", "optional": true, "type": "boolean", "description": "If true, returns properties belonging only to the element itself, not to its prototype chain." },
                    { "name": "accessorPropertiesOnly", "optional": true, "type": "boolean", "description": "If true, returns accessor properties (with getter/setter) only; internal properties are not returned either.", "hidden": true },
                    { "name": "generatePreview", "type": "boolean", "optional": true, "hidden": true, "description": "Whether preview should be generated for the results." }
                ],
                "returns": [
                    { "name": "result", "type": "array", "items": { "$ref": "PropertyDescriptor" }, "description": "Object properties." },
                    { "name": "internalProperties", "optional": true, "type": "array", "items": { "$ref": "InternalPropertyDescriptor" }, "description": "Internal object properties (only of the element itself).", "hidden": true },
                    { "name": "exceptionDetails", "$ref": "ExceptionDetails", "optional": true, "hidden": true, "description": "Exception details."}
                ],
                "description": "Returns properties of a given object. Object group of the result is inherited from the target object."
            },
            {
                "name": "releaseObject",
                "parameters": [
                    { "name": "objectId", "$ref": "RemoteObjectId", "description": "Identifier of the object to release." }
                ],
                "description": "Releases remote object with given id."
            },
            {
                "name": "releaseObjectGroup",
                "parameters": [
                    { "name": "objectGroup", "type": "string", "description": "Symbolic object group name." }
                ],
                "description": "Releases all remote objects that belong to a given group."
            },
            {
                "name": "run",
                "hidden": true,
                "description": "Tells inspected instance(worker or page) that it can run in case it was started paused."
            },
            {
                "name": "enable",
                "description": "Enables reporting of execution contexts creation by means of <code>executionContextCreated</code> event. When the reporting gets enabled the event will be sent immediately for each existing execution context."
            },
            {
                "name": "disable",
                "hidden": true,
                "description": "Disables reporting of execution contexts creation."
            },
            {
                "name": "isRunRequired",
                "returns": [
                    { "name": "result", "type": "boolean", "description": "True if the Runtime is in paused on start state." }
                ],
                "hidden": true
            },
            {
                "name": "setCustomObjectFormatterEnabled",
                "parameters": [
                    {
                        "name": "enabled",
                        "type": "boolean"
                    }
                ],
                "hidden": true
            },
            {
                "name": "compileScript",
                "hidden": true,
                "parameters": [
                    { "name": "expression", "type": "string", "description": "Expression to compile." },
                    { "name": "sourceURL", "type": "string", "description": "Source url to be set for the script." },
                    { "name": "persistScript", "type": "boolean", "description": "Specifies whether the compiled script should be persisted." },
                    { "name": "executionContextId", "$ref": "ExecutionContextId", "description": "Specifies in which isolated context to perform script run. Each content script lives in an isolated context and this parameter is used to specify one of those contexts." }
                ],
                "returns": [
                    { "name": "scriptId", "$ref": "ScriptId", "optional": true, "description": "Id of the script." },
                    { "name": "exceptionDetails", "$ref": "ExceptionDetails", "optional": true, "description": "Exception details."}
                ],
                "description": "Compiles expression."
            },
            {
                "name": "runScript",
                "hidden": true,
                "parameters": [
                    { "name": "scriptId", "$ref": "ScriptId", "description": "Id of the script to run." },
                    { "name": "executionContextId", "$ref": "ExecutionContextId", "description": "Specifies in which isolated context to perform script run. Each content script lives in an isolated context and this parameter is used to specify one of those contexts." },
                    { "name": "objectGroup", "type": "string", "optional": true, "description": "Symbolic group name that can be used to release multiple objects." },
                    { "name": "doNotPauseOnExceptionsAndMuteConsole", "type": "boolean", "optional": true, "description": "Specifies whether script run should stop on exceptions and mute console. Overrides setPauseOnException state." },
                    { "name": "includeCommandLineAPI", "type": "boolean", "optional": true, "description": "Determines whether Command Line API should be available during the evaluation." }
                ],
                "returns": [
                    { "name": "result", "$ref": "RemoteObject", "description": "Run result." },
                    { "name": "exceptionDetails", "$ref": "ExceptionDetails", "optional": true, "description": "Exception details."}
                ],
                "description": "Runs script with given id in a given context."
            }
        ],
        "events": [
            {
                "name": "executionContextCreated",
                "parameters": [
                    { "name": "context", "$ref": "ExecutionContextDescription", "description": "A newly created execution contex." }
                ],
                "description": "Issued when new execution context is created."
            },
            {
                "name": "executionContextDestroyed",
                "parameters": [
                    { "name": "executionContextId", "$ref": "ExecutionContextId", "description": "Id of the destroyed context" }
                ],
                "description": "Issued when execution context is destroyed."
            },
            {
                "name": "executionContextsCleared",
                "description": "Issued when all executionContexts were cleared in browser"
            }
        ]
    },
    {
        "domain": "Console",
        "description": "Console domain defines methods and events for interaction with the JavaScript console. Console collects messages created by means of the <a href='http://getfirebug.com/wiki/index.php/Console_API'>JavaScript Console API</a>. One needs to enable this domain using <code>enable</code> command in order to start receiving the console messages. Browser collects messages issued while console domain is not enabled as well and reports them using <code>messageAdded</code> notification upon enabling.",
        "types": [
            {
                "id": "Timestamp",
                "type": "number",
                "description": "Number of seconds since epoch.",
                "hidden": true
            },
            {
                "id": "ConsoleMessage",
                "type": "object",
                "description": "Console message.",
                "properties": [
                    { "name": "source", "type": "string", "enum": ["xml", "javascript", "network", "console-api", "storage", "appcache", "rendering", "security", "other", "deprecation"], "description": "Message source." },
                    { "name": "level", "type": "string", "enum": ["log", "warning", "error", "debug", "info", "revokedError"], "description": "Message severity." },
                    { "name": "text", "type": "string", "description": "Message text." },
                    { "name": "type", "type": "string", "optional": true, "enum": ["log", "dir", "dirxml", "table", "trace", "clear", "startGroup", "startGroupCollapsed", "endGroup", "assert", "profile", "profileEnd"], "description": "Console message type." },
                    { "name": "scriptId", "type": "string", "optional": true, "description": "Script ID of the message origin." },
                    { "name": "url", "type": "string", "optional": true, "description": "URL of the message origin." },
                    { "name": "line", "type": "integer", "optional": true, "description": "Line number in the resource that generated this message." },
                    { "name": "column", "type": "integer", "optional": true, "description": "Column number in the resource that generated this message." },
                    { "name": "repeatCount", "type": "integer", "optional": true, "description": "Repeat count for repeated messages." },
                    { "name": "parameters", "type": "array", "items": { "$ref": "Runtime.RemoteObject" }, "optional": true, "description": "Message parameters in case of the formatted message." },
                    { "name": "stack", "$ref": "Runtime.StackTrace", "optional": true, "description": "JavaScript stack trace for assertions and error messages." },
                    { "name": "networkRequestId", "$ref": "Network.RequestId", "optional": true, "description": "Identifier of the network request associated with this message." },
                    { "name": "timestamp", "$ref": "Timestamp", "description": "Timestamp, when this message was fired.", "hidden": true },
                    { "name": "executionContextId", "$ref": "Runtime.ExecutionContextId", "optional": true, "description": "Identifier of the context where this message was created", "hidden": true },
                    { "name": "messageId", "type": "integer", "hidden": true, "optional": true, "description": "Message id." },
                    { "name": "relatedMessageId", "type": "integer", "hidden": true, "optional": true, "description": "Related message id." }
                ]
            }
        ],
        "commands": [
            {
                "name": "enable",
                "description": "Enables console domain, sends the messages collected so far to the client by means of the <code>messageAdded</code> notification."
            },
            {
                "name": "disable",
                "description": "Disables console domain, prevents further console messages from being reported to the client."
            },
            {
                "name": "clearMessages",
                "description": "Clears console messages collected in the browser."
            }
        ],
        "events": [
            {
                "name": "messageAdded",
                "parameters": [
                    { "name": "message", "$ref": "ConsoleMessage", "description": "Console message that has been added." }
                ],
                "description": "Issued when new console message is added."
            },
            {
                "name": "messageRepeatCountUpdated",
                "parameters": [
                    { "name": "count", "type": "integer", "description": "New repeat count value." },
                    { "name": "timestamp", "$ref": "Timestamp", "description": "Timestamp of most recent message in batch.", "hidden": true }
                ],
                "description": "Is not issued. Will be gone in the future versions of the protocol.",
                "deprecated": true
            },
            {
                "name": "messagesCleared",
                "description": "Issued when console is cleared. This happens either upon <code>clearMessages</code> command or after page navigation."
            }
        ]
    },
    {
        "domain": "Security",
        "description": "Security",
        "hidden": true,
        "types": [
            {
                "id": "SecurityState",
                "type": "string",
                "enum": ["unknown", "neutral", "insecure", "warning", "secure", "info"],
                "description": "The security level of a page or resource."
            },
            {
                "id": "SecurityStateExplanation",
                "type": "object",
                "properties": [
                    { "name": "securityState", "$ref": "SecurityState", "description": "Security state representing the severity of the factor being explained." },
                    { "name": "summary", "type": "string", "description": "Short phrase describing the type of factor." },
                    { "name": "description", "type": "string", "description": "Full text explanation of the factor." },
                    { "name": "certificateId", "$ref": "Network.CertificateId", "optional": true, "description": "Associated certificate id." }
                ],
                "description": "An explanation of an factor contributing to the security state."
            },
            {
                "id": "MixedContentStatus",
                "type": "object",
                "properties": [
                    { "name": "ranInsecureContent", "type": "boolean", "description": "True if the page ran insecure content such as scripts." },
                    { "name": "displayedInsecureContent", "type": "boolean", "description": "True if the page displayed insecure content such as images." },
                    { "name": "ranInsecureContentStyle", "$ref": "SecurityState", "description": "Security state representing a page that ran insecure content." },
                    { "name": "displayedInsecureContentStyle", "$ref": "SecurityState", "description": "Security state representing a page that displayed insecure content." }
                ],
                "description": "Information about mixed content on the page."
            }
        ],
        "commands": [
            {
                "name": "enable",
                "description": "Enables tracking security state changes.",
                "handlers": ["browser"]
            },
            {
                "name": "disable",
                "description": "Disables tracking security state changes.",
                "handlers": ["browser"]
            }
        ],
        "events": [
            {
                "name": "securityStateChanged",
                "description": "The security state of the page changed.",
                "parameters": [
                    { "name": "securityState", "$ref": "SecurityState", "description": "Security state." },
                    { "name": "explanations", "type": "array", "items": { "$ref": "SecurityStateExplanation" }, "description": "List of explanations for the security state. If the overall security state is `insecure` or `warning`, at least one corresponding explanation should be included.", "optional": true },
                    { "name": "mixedContentStatus", "$ref": "MixedContentStatus", "description": "Information about mixed content on the page.", "optional": true },
                    { "name": "schemeIsCryptographic", "type": "boolean", "description": "True if the page was loaded over cryptographic transport such as HTTPS.", "optional": true }
                ],
                "handlers": ["browser"]
            }
        ]
    },
    {
        "domain": "Network",
        "description": "Network domain allows tracking network activities of the page. It exposes information about http, file, data and other requests and responses, their headers, bodies, timing, etc.",
        "types": [
            {
                "id": "LoaderId",
                "type": "string",
                "description": "Unique loader identifier."
            },
            {
                "id": "RequestId",
                "type": "string",
                "description": "Unique request identifier."
            },
            {
                "id": "Timestamp",
                "type": "number",
                "description": "Number of seconds since epoch."
            },
            {
                "id": "Headers",
                "type": "object",
                "description": "Request / response headers as keys / values of JSON object."
            },
            {
                "id": "ResourceTiming",
                "type": "object",
                "description": "Timing information for the request.",
                "properties": [
                    { "name": "requestTime", "type": "number", "description": "Timing's requestTime is a baseline in seconds, while the other numbers are ticks in milliseconds relatively to this requestTime." },
                    { "name": "proxyStart", "type": "number", "description": "Started resolving proxy." },
                    { "name": "proxyEnd", "type": "number", "description": "Finished resolving proxy." },
                    { "name": "dnsStart", "type": "number", "description": "Started DNS address resolve." },
                    { "name": "dnsEnd", "type": "number", "description": "Finished DNS address resolve." },
                    { "name": "connectStart", "type": "number", "description": "Started connecting to the remote host." },
                    { "name": "connectEnd", "type": "number", "description": "Connected to the remote host." },
                    { "name": "sslStart", "type": "number", "description": "Started SSL handshake." },
                    { "name": "sslEnd", "type": "number", "description": "Finished SSL handshake." },
                    { "name": "workerStart", "type": "number", "description": "Started running ServiceWorker.", "hidden": true },
                    { "name": "workerReady", "type": "number", "description": "Finished Starting ServiceWorker.", "hidden": true },
                    { "name": "sendStart", "type": "number", "description": "Started sending request." },
                    { "name": "sendEnd", "type": "number", "description": "Finished sending request." },
                    { "name": "receiveHeadersEnd", "type": "number", "description": "Finished receiving response headers." }
                ]
            },
            {
                "id": "ResourcePriority",
                "type": "string",
                "enum": ["VeryLow", "Low", "Medium", "High", "VeryHigh"],
                "description": "Loading priority of a resource request."
            },
            {
                "id": "Request",
                "type": "object",
                "description": "HTTP request data.",
                "properties": [
                    { "name": "url", "type": "string", "description": "Request URL." },
                    { "name": "method", "type": "string", "description": "HTTP request method." },
                    { "name": "headers", "$ref": "Headers", "description": "HTTP request headers." },
                    { "name": "postData", "type": "string", "optional": true, "description": "HTTP POST request data." },
                    { "name": "mixedContentType", "optional": true, "type": "string", "enum": ["blockable", "optionally-blockable", "none"], "description": "The mixed content status of the request, as defined in http://www.w3.org/TR/mixed-content/" },
                    { "name": "initialPriority", "$ref": "ResourcePriority", "description": "Priority of the resource request at the time request is sent."}
                ]
            },
            {
                "id": "CertificateId",
                "type": "integer",
                "description": "An internal certificate ID value."
            },
            {
                "id": "CertificateSubject",
                "type": "object",
                "description": "Subject of a certificate.",
                "properties": [
                    { "name": "name", "type": "string", "description": "Certificate subject name." },
                    { "name": "sanDnsNames", "type": "array", "items": { "type": "string" }, "description": "Subject Alternative Name (SAN) DNS names." },
                    { "name": "sanIpAddresses", "type": "array", "items": { "type": "string" }, "description": "Subject Alternative Name (SAN) IP addresses." }
                ]
            },
            {
                "id": "CertificateDetails",
                "type": "object",
                "description": "Details about a request's certificate.",
                "properties": [
                    { "name": "subject", "$ref": "CertificateSubject", "description": "Certificate subject." },
                    { "name": "issuer", "type": "string", "description": "Name of the issuing CA." },
                    { "name": "validFrom", "$ref": "Timestamp", "description": "Certificate valid from date." },
                    { "name": "validTo", "$ref": "Timestamp", "description": "Certificate valid to (expiration) date" }
                ]
            },
            {
                "id": "CertificateValidationDetails",
                "type": "object",
                "description": "Details about the validation status of a request's certificate.",
                "properties": [
                    { "name": "numUnknownScts", "type": "integer", "description": "The number of SCTs from unknown logs." },
                    { "name": "numInvalidScts", "type": "integer", "description": "The number of invalid SCTs." },
                    { "name": "numValidScts", "type": "integer", "description": "The number of valid SCTs." }
                ]
            },
            {
                "id": "SecurityDetails",
                "type": "object",
                "description": "Security details about a request.",
                "properties": [
                    { "name": "protocol", "type": "string", "description": "Protocol name (e.g. \"TLS 1.2\" or \"QUIC\")." },
                    { "name": "keyExchange", "type": "string", "description": "Key Exchange used by the connection." },
                    { "name": "cipher", "type": "string", "description": "Cipher name." },
                    { "name": "mac", "type": "string", "optional": true, "description": "TLS MAC. Note that AEAD ciphers do not have separate MACs." },
                    { "name": "certificateId", "$ref": "CertificateId", "description": "Certificate ID value." },
                    { "name": "certificateValidationDetails", "$ref": "CertificateValidationDetails", "optional": true, "description": "Validation details for the request's certficate." }
                ]
            },
            {
                "id": "BlockedReason",
                "type": "string",
                "description": "The reason why request was blocked.",
                "enum": ["csp", "mixed-content", "origin", "inspector", "other"],
                "hidden": true
            },
            {
                "id": "Response",
                "type": "object",
                "description": "HTTP response data.",
                "properties": [
                    { "name": "url", "type": "string", "description": "Response URL. This URL can be different from CachedResource.url in case of redirect." },
                    { "name": "status", "type": "number", "description": "HTTP response status code." },
                    { "name": "statusText", "type": "string", "description": "HTTP response status text." },
                    { "name": "headers", "$ref": "Headers", "description": "HTTP response headers." },
                    { "name": "headersText", "type": "string", "optional": true, "description": "HTTP response headers text." },
                    { "name": "mimeType", "type": "string", "description": "Resource mimeType as determined by the browser." },
                    { "name": "requestHeaders", "$ref": "Headers", "optional": true, "description": "Refined HTTP request headers that were actually transmitted over the network." },
                    { "name": "requestHeadersText", "type": "string", "optional": true, "description": "HTTP request headers text." },
                    { "name": "connectionReused", "type": "boolean", "description": "Specifies whether physical connection was actually reused for this request." },
                    { "name": "connectionId", "type": "number", "description": "Physical connection id that was actually used for this request." },
                    { "name": "remoteIPAddress", "type": "string", "optional": true, "hidden": true, "description": "Remote IP address." },
                    { "name": "remotePort", "type": "integer", "optional": true, "hidden": true, "description": "Remote port."},
                    { "name": "fromDiskCache", "type": "boolean", "optional": true, "description": "Specifies that the request was served from the disk cache." },
                    { "name": "fromServiceWorker", "type": "boolean", "optional": true, "description": "Specifies that the request was served from the ServiceWorker." },
                    { "name": "encodedDataLength", "type": "number", "optional": false, "description": "Total number of bytes received for this request so far." },
                    { "name": "timing", "$ref": "ResourceTiming", "optional": true, "description": "Timing information for the given request." },
                    { "name": "protocol", "type": "string", "optional": true, "description": "Protocol used to fetch this request." },
                    { "name": "securityState", "$ref": "Security.SecurityState", "description": "Security state of the request resource." },
                    { "name": "securityDetails", "$ref": "SecurityDetails", "optional": true, "description": "Security details for the request." }
                ]
            },
            {
                "id": "WebSocketRequest",
                "type": "object",
                "description": "WebSocket request data.",
                "hidden": true,
                "properties": [
                    { "name": "headers", "$ref": "Headers", "description": "HTTP request headers." }
                ]
            },
            {
                "id": "WebSocketResponse",
                "type": "object",
                "description": "WebSocket response data.",
                "hidden": true,
                "properties": [
                    { "name": "status", "type": "number", "description": "HTTP response status code." },
                    { "name": "statusText", "type": "string", "description": "HTTP response status text." },
                    { "name": "headers", "$ref": "Headers", "description": "HTTP response headers." },
                    { "name": "headersText", "type": "string", "optional": true, "description": "HTTP response headers text." },
                    { "name": "requestHeaders", "$ref": "Headers", "optional": true, "description": "HTTP request headers." },
                    { "name": "requestHeadersText", "type": "string", "optional": true, "description": "HTTP request headers text." }
                ]
            },
            {
                "id": "WebSocketFrame",
                "type": "object",
                "description": "WebSocket frame data.",
                "hidden": true,
                "properties": [
                    { "name": "opcode", "type": "number", "description": "WebSocket frame opcode." },
                    { "name": "mask", "type": "boolean", "description": "WebSocke frame mask." },
                    { "name": "payloadData", "type": "string", "description": "WebSocke frame payload data." }
                ]
            },
            {
                "id": "CachedResource",
                "type": "object",
                "description": "Information about the cached resource.",
                "properties": [
                    { "name": "url", "type": "string", "description": "Resource URL. This is the url of the original network request." },
                    { "name": "type", "$ref": "Page.ResourceType", "description": "Type of this resource." },
                    { "name": "response", "$ref": "Response", "optional": true, "description": "Cached response data." },
                    { "name": "bodySize", "type": "number", "description": "Cached response body size." }
                ]
            },
            {
                "id": "Initiator",
                "type": "object",
                "description": "Information about the request initiator.",
                "properties": [
                    { "name": "type", "type": "string", "enum": ["parser", "script", "other"], "description": "Type of this initiator." },
                    { "name": "stack", "$ref": "Runtime.StackTrace", "optional": true, "description": "Initiator JavaScript stack trace, set for Script only." },
                    { "name": "url", "type": "string", "optional": true, "description": "Initiator URL, set for Parser type only." },
                    { "name": "lineNumber", "type": "number", "optional": true, "description": "Initiator line number, set for Parser type only." }
                ]
            },
            {
                "id": "Cookie",
                "type": "object",
                "description": "Cookie object",
                "properties": [
                    { "name": "name", "type": "string", "description": "Cookie name." },
                    { "name": "value", "type": "string", "description": "Cookie value." },
                    { "name": "domain", "type": "string", "description": "Cookie domain." },
                    { "name": "path", "type": "string", "description": "Cookie path." },
                    { "name": "expires", "type": "number", "description": "Cookie expires." },
                    { "name": "size", "type": "integer", "description": "Cookie size." },
                    { "name": "httpOnly", "type": "boolean", "description": "True if cookie is http-only." },
                    { "name": "secure", "type": "boolean", "description": "True if cookie is secure." },
                    { "name": "session", "type": "boolean", "description": "True in case of session cookie." }
                ],
                "hidden": true
            }
        ],
        "commands": [
            {
                "name": "enable",
                "description": "Enables network tracking, network events will now be delivered to the client."
            },
            {
                "name": "disable",
                "description": "Disables network tracking, prevents network events from being sent to the client."
            },
            {
                "name": "setUserAgentOverride",
                "description": "Allows overriding user agent with the given string.",
                "parameters": [
                    { "name": "userAgent", "type": "string", "description": "User agent to use." }
                ]
            },
            {
                "name": "setExtraHTTPHeaders",
                "description": "Specifies whether to always send extra HTTP headers with the requests from this page.",
                "parameters": [
                    { "name": "headers", "$ref": "Headers", "description": "Map with extra HTTP headers." }
                ]
            },
            {
                "name": "getResponseBody",
                "async": true,
                "description": "Returns content served for the given request.",
                "parameters": [
                    { "name": "requestId", "$ref": "RequestId", "description": "Identifier of the network request to get content for." }
                ],
                "returns": [
                    { "name": "body", "type": "string", "description": "Response body." },
                    { "name": "base64Encoded", "type": "boolean", "description": "True, if content was sent as base64." }
                ]
            },
            {
                "name": "addBlockedURL",
                "description": "Blocks specific URL from loading.",
                "parameters": [
                    { "name": "url", "type": "string", "description": "URL to block." }
                ],
                "hidden": true
            },
            {
                "name": "removeBlockedURL",
                "description": "Cancels blocking of a specific URL from loading.",
                "parameters": [
                    { "name": "url", "type": "string", "description": "URL to stop blocking." }
                ],
                "hidden": true
            },
            {
                "name": "replayXHR",
                "description": "This method sends a new XMLHttpRequest which is identical to the original one. The following parameters should be identical: method, url, async, request body, extra headers, withCredentials attribute, user, password.",
                "parameters": [
                    { "name": "requestId", "$ref": "RequestId", "description": "Identifier of XHR to replay." }
                ],
                "hidden": true
            },
            {
                "name": "setMonitoringXHREnabled",
                "parameters": [
                    { "name": "enabled", "type": "boolean", "description": "Monitoring enabled state." }
                ],
                "description": "Toggles monitoring of XMLHttpRequest. If <code>true</code>, console will receive messages upon each XHR issued.",
                "hidden": true
            },
            {
                "name": "canClearBrowserCache",
                "description": "Tells whether clearing browser cache is supported.",
                "returns": [
                    { "name": "result", "type": "boolean", "description": "True if browser cache can be cleared." }
                ]
            },
            {
                "name": "clearBrowserCache",
                "description": "Clears browser cache.",
                "handlers": ["browser"]
            },
            {
                "name": "canClearBrowserCookies",
                "description": "Tells whether clearing browser cookies is supported.",
                "returns": [
                    { "name": "result", "type": "boolean", "description": "True if browser cookies can be cleared." }
                ]
            },
            {
                "name": "clearBrowserCookies",
                "description": "Clears browser cookies.",
                "handlers": ["browser"]
            },
            {
                "name": "getCookies",
                "returns": [
                    { "name": "cookies", "type": "array", "items": { "$ref": "Cookie" }, "description": "Array of cookie objects." }
                ],
                "description": "Returns all browser cookies. Depending on the backend support, will return detailed cookie information in the <code>cookies</code> field.",
                "handlers": ["browser"],
                "async": true,
                "hidden": true
            },
            {
                "name": "deleteCookie",
                "parameters": [
                    { "name": "cookieName", "type": "string", "description": "Name of the cookie to remove." },
                    { "name": "url", "type": "string", "description": "URL to match cooke domain and path." }
                ],
                "description": "Deletes browser cookie with given name, domain and path.",
                "handlers": ["browser"],
                "async": true,
                "hidden": true
            },
            {
                "name": "canEmulateNetworkConditions",
                "description": "Tells whether emulation of network conditions is supported.",
                "returns": [
                  { "name": "result", "type": "boolean", "description": "True if emulation of network conditions is supported." }
                ],
                "hidden": true,
                "handlers": ["browser"]
            },
            {
                "name": "emulateNetworkConditions",
                "description": "Activates emulation of network conditions.",
                "parameters": [
                    { "name": "offline", "type": "boolean", "description": "True to emulate internet disconnection." },
                    { "name": "latency", "type": "number", "description": "Additional latency (ms)." },
                    { "name": "downloadThroughput", "type": "number", "description": "Maximal aggregated download throughput." },
                    { "name": "uploadThroughput", "type": "number", "description": "Maximal aggregated upload throughput." }
                ],
                "hidden": true,
                "handlers": ["browser", "renderer"]
            },
            {
                "name": "setCacheDisabled",
                "parameters": [
                    { "name": "cacheDisabled", "type": "boolean", "description": "Cache disabled state." }
                ],
                "description": "Toggles ignoring cache for each request. If <code>true</code>, cache will not be used."
            },
            {
                "name": "setDataSizeLimitsForTest",
                "parameters": [
                    { "name": "maxTotalSize", "type": "integer", "description": "Maximum total buffer size." },
                    { "name": "maxResourceSize", "type": "integer", "description": "Maximum per-resource size." }
                ],
                "description": "For testing.",
                "hidden": true
            },
            {
                "name": "getCertificateDetails",
                "description": "Returns details for the given certificate.",
                "parameters": [
                    { "name": "certificateId", "$ref": "CertificateId", "description": "ID of the certificate to get details for." }
                ],
                "returns": [
                    { "name": "result", "$ref": "CertificateDetails", "description": "Certificate details." }
                ],
                "handlers": ["browser"]
            },
            {
                "name": "showCertificateViewer",
                "description": "Displays native dialog with the certificate details.",
                "parameters": [
                    { "name": "certificateId", "$ref": "CertificateId", "description": "Certificate id." }
                ],
                "handlers": ["browser"]
            }
        ],
        "events": [
            {
                "name": "requestWillBeSent",
                "description": "Fired when page is about to send HTTP request.",
                "parameters": [
                    { "name": "requestId", "$ref": "RequestId", "description": "Request identifier." },
                    { "name": "frameId", "$ref": "Page.FrameId", "description": "Frame identifier.", "hidden": true },
                    { "name": "loaderId", "$ref": "LoaderId", "description": "Loader identifier." },
                    { "name": "documentURL", "type": "string", "description": "URL of the document this request is loaded for." },
                    { "name": "request", "$ref": "Request", "description": "Request data." },
                    { "name": "timestamp", "$ref": "Timestamp", "description": "Timestamp." },
                    { "name": "wallTime", "$ref": "Timestamp", "hidden": true, "description": "UTC Timestamp." },
                    { "name": "initiator", "$ref": "Initiator", "description": "Request initiator." },
                    { "name": "redirectResponse", "optional": true, "$ref": "Response", "description": "Redirect response data." },
                    { "name": "type", "$ref": "Page.ResourceType", "optional": true, "hidden": true, "description": "Type of this resource." }
                ]
            },
            {
                "name": "requestServedFromCache",
                "description": "Fired if request ended up loading from cache.",
                "parameters": [
                    { "name": "requestId", "$ref": "RequestId", "description": "Request identifier." }
                ]
            },
            {
                "name": "responseReceived",
                "description": "Fired when HTTP response is available.",
                "parameters": [
                    { "name": "requestId", "$ref": "RequestId", "description": "Request identifier." },
                    { "name": "frameId", "$ref": "Page.FrameId", "description": "Frame identifier.", "hidden": true },
                    { "name": "loaderId", "$ref": "LoaderId", "description": "Loader identifier." },
                    { "name": "timestamp", "$ref": "Timestamp", "description": "Timestamp." },
                    { "name": "type", "$ref": "Page.ResourceType", "description": "Resource type." },
                    { "name": "response", "$ref": "Response", "description": "Response data." }
                ]
            },
            {
                "name": "dataReceived",
                "description": "Fired when data chunk was received over the network.",
                "parameters": [
                    { "name": "requestId", "$ref": "RequestId", "description": "Request identifier." },
                    { "name": "timestamp", "$ref": "Timestamp", "description": "Timestamp." },
                    { "name": "dataLength", "type": "integer", "description": "Data chunk length." },
                    { "name": "encodedDataLength", "type": "integer", "description": "Actual bytes received (might be less than dataLength for compressed encodings)." }
                ]
            },
            {
                "name": "loadingFinished",
                "description": "Fired when HTTP request has finished loading.",
                "parameters": [
                    { "name": "requestId", "$ref": "RequestId", "description": "Request identifier." },
                    { "name": "timestamp", "$ref": "Timestamp", "description": "Timestamp." },
                    { "name": "encodedDataLength", "type": "number", "description": "Total number of bytes received for this request." }
                ]
            },
            {
                "name": "loadingFailed",
                "description": "Fired when HTTP request has failed to load.",
                "parameters": [
                    { "name": "requestId", "$ref": "RequestId", "description": "Request identifier." },
                    { "name": "timestamp", "$ref": "Timestamp", "description": "Timestamp." },
                    { "name": "type", "$ref": "Page.ResourceType", "description": "Resource type." },
                    { "name": "errorText", "type": "string", "description": "User friendly error message." },
                    { "name": "canceled", "type": "boolean", "optional": true, "description": "True if loading was canceled." },
                    { "name": "blockedReason", "$ref": "BlockedReason", "optional": true, "description": "The reason why loading was blocked, if any.", "hidden": true }
                ]
            },
            {
                "name": "webSocketWillSendHandshakeRequest",
                "description": "Fired when WebSocket is about to initiate handshake.",
                "parameters": [
                    { "name": "requestId", "$ref": "RequestId", "description": "Request identifier." },
                    { "name": "timestamp", "$ref": "Timestamp", "description": "Timestamp." },
                    { "name": "wallTime", "$ref": "Timestamp", "hidden": true, "description": "UTC Timestamp." },
                    { "name": "request", "$ref": "WebSocketRequest", "description": "WebSocket request data." }
                ],
                "hidden": true
            },
            {
                "name": "webSocketHandshakeResponseReceived",
                "description": "Fired when WebSocket handshake response becomes available.",
                "parameters": [
                    { "name": "requestId", "$ref": "RequestId", "description": "Request identifier." },
                    { "name": "timestamp", "$ref": "Timestamp", "description": "Timestamp." },
                    { "name": "response", "$ref": "WebSocketResponse", "description": "WebSocket response data." }
                ],
                "hidden": true
            },
            {
                "name": "webSocketCreated",
                "description": "Fired upon WebSocket creation.",
                "parameters": [
                    { "name": "requestId", "$ref": "RequestId", "description": "Request identifier." },
                    { "name": "url", "type": "string", "description": "WebSocket request URL." }
                ],
                "hidden": true
            },
            {
                "name": "webSocketClosed",
                "description": "Fired when WebSocket is closed.",
                "parameters": [
                    { "name": "requestId", "$ref": "RequestId", "description": "Request identifier." },
                    { "name": "timestamp", "$ref": "Timestamp", "description": "Timestamp." }
                ],
                "hidden": true
            },
            {
                "name": "webSocketFrameReceived",
                "description": "Fired when WebSocket frame is received.",
                "parameters": [
                    { "name": "requestId", "$ref": "RequestId", "description": "Request identifier." },
                    { "name": "timestamp", "$ref": "Timestamp", "description": "Timestamp." },
                    { "name": "response", "$ref": "WebSocketFrame", "description": "WebSocket response data." }
                ],
                "hidden": true
            },
            {
                "name": "webSocketFrameError",
                "description": "Fired when WebSocket frame error occurs.",
                "parameters": [
                    { "name": "requestId", "$ref": "RequestId", "description": "Request identifier." },
                    { "name": "timestamp", "$ref": "Timestamp", "description": "Timestamp." },
                    { "name": "errorMessage", "type": "string", "description": "WebSocket frame error message." }
                ],
                "hidden": true
            },
            {
                "name": "webSocketFrameSent",
                "description": "Fired when WebSocket frame is sent.",
                "parameters": [
                    { "name": "requestId", "$ref": "RequestId", "description": "Request identifier." },
                    { "name": "timestamp", "$ref": "Timestamp", "description": "Timestamp." },
                    { "name": "response", "$ref": "WebSocketFrame", "description": "WebSocket response data." }
                ],
                "hidden": true
            },
            {
                "name": "eventSourceMessageReceived",
                "description": "Fired when EventSource message is received.",
                "parameters": [
                    { "name": "requestId", "$ref": "RequestId", "description": "Request identifier." },
                    { "name": "timestamp", "$ref": "Timestamp", "description": "Timestamp." },
                    { "name": "eventName", "type": "string", "description": "Message type." },
                    { "name": "eventId", "type": "string", "description": "Message identifier." },
                    { "name": "data", "type": "string", "description": "Message content." }
                ],
                "hidden": true
            }
        ]
    },
    {
        "domain": "Database",
        "hidden": true,
        "types": [
            {
                "id": "DatabaseId",
                "type": "string",
                "description": "Unique identifier of Database object.",
                "hidden": true
            },
            {
                "id": "Database",
                "type": "object",
                "description": "Database object.",
                "hidden": true,
                "properties": [
                    { "name": "id", "$ref": "DatabaseId", "description": "Database ID." },
                    { "name": "domain", "type": "string", "description": "Database domain." },
                    { "name": "name", "type": "string", "description": "Database name." },
                    { "name": "version", "type": "string", "description": "Database version." }
                ]
            },
            {
                "id": "Error",
                "type": "object",
                "description": "Database error.",
                "properties": [
                    { "name": "message", "type": "string", "description": "Error message." },
                    { "name": "code", "type": "integer", "description": "Error code." }
                ]
            }
        ],
        "commands": [
            {
                "name": "enable",
                "description": "Enables database tracking, database events will now be delivered to the client."
            },
            {
                "name": "disable",
                "description": "Disables database tracking, prevents database events from being sent to the client."
            },
            {
                "name": "getDatabaseTableNames",
                "parameters": [
                    { "name": "databaseId", "$ref": "DatabaseId" }
                ],
                "returns": [
                    { "name": "tableNames", "type": "array", "items": { "type": "string" } }
                ]
            },
            {
                "name": "executeSQL",
                "async": true,
                "parameters": [
                    { "name": "databaseId", "$ref": "DatabaseId" },
                    { "name": "query", "type": "string" }
                ],
                "returns": [
                    { "name": "columnNames", "type": "array", "optional": true, "items": { "type": "string" } },
                    { "name": "values", "type": "array", "optional": true, "items": { "type": "any" }},
                    { "name": "sqlError", "$ref": "Error", "optional": true }
                ]
            }
        ],
        "events": [
            {
                "name": "addDatabase",
                "parameters": [
                    { "name": "database", "$ref": "Database" }
                ]
            }
        ]
    },
    {
        "domain": "IndexedDB",
        "hidden": true,
        "types": [
            {
                "id": "DatabaseWithObjectStores",
                "type": "object",
                "description": "Database with an array of object stores.",
                "properties": [
                    { "name": "name", "type": "string", "description": "Database name." },
                    { "name": "version", "type": "integer", "description": "Database version." },
                    { "name": "objectStores", "type": "array", "items": { "$ref": "ObjectStore" }, "description": "Object stores in this database." }
                ]
            },
            {
                "id": "ObjectStore",
                "type": "object",
                "description": "Object store.",
                "properties": [
                    { "name": "name", "type": "string", "description": "Object store name." },
                    { "name": "keyPath", "$ref": "KeyPath", "description": "Object store key path." },
                    { "name": "autoIncrement", "type": "boolean", "description": "If true, object store has auto increment flag set." },
                    { "name": "indexes", "type": "array", "items": { "$ref": "ObjectStoreIndex" }, "description": "Indexes in this object store." }
                ]
            },
            {
                "id": "ObjectStoreIndex",
                "type": "object",
                "description": "Object store index.",
                "properties": [
                    { "name": "name", "type": "string", "description": "Index name." },
                    { "name": "keyPath", "$ref": "KeyPath", "description": "Index key path." },
                    { "name": "unique", "type": "boolean", "description": "If true, index is unique." },
                    { "name": "multiEntry", "type": "boolean", "description": "If true, index allows multiple entries for a key." }
                ]
            },
            {
                "id": "Key",
                "type": "object",
                "description": "Key.",
                "properties": [
                    { "name": "type", "type": "string", "enum": ["number", "string", "date", "array"], "description": "Key type." },
                    { "name": "number", "type": "number", "optional": true, "description": "Number value." },
                    { "name": "string", "type": "string", "optional": true, "description": "String value." },
                    { "name": "date", "type": "number", "optional": true, "description": "Date value." },
                    { "name": "array", "type": "array", "optional": true, "items": { "$ref": "Key" }, "description": "Array value." }
                ]
            },
            {
                "id": "KeyRange",
                "type": "object",
                "description": "Key range.",
                "properties": [
                    { "name": "lower", "$ref": "Key", "optional": true, "description": "Lower bound." },
                    { "name": "upper", "$ref": "Key", "optional": true, "description": "Upper bound." },
                    { "name": "lowerOpen", "type": "boolean", "description": "If true lower bound is open." },
                    { "name": "upperOpen", "type": "boolean", "description": "If true upper bound is open." }
                ]
            },
            {
                "id": "DataEntry",
                "type": "object",
                "description": "Data entry.",
                "properties": [
                    { "name": "key", "type": "string", "description": "JSON-stringified key object." },
                    { "name": "primaryKey", "type": "string", "description": "JSON-stringified primary key object." },
                    { "name": "value", "type": "string", "description": "JSON-stringified value object." }
                ]
            },
            {
                "id": "KeyPath",
                "type": "object",
                "description": "Key path.",
                "properties": [
                    { "name": "type", "type": "string", "enum": ["null", "string", "array"], "description": "Key path type." },
                    { "name": "string", "type": "string", "optional": true, "description": "String value." },
                    { "name": "array", "type": "array", "optional": true, "items": { "type": "string" }, "description": "Array value." }
                ]
            }
        ],
        "commands": [
            {
                "name": "enable",
                "description": "Enables events from backend."
            },
            {
                "name": "disable",
                "description": "Disables events from backend."
            },
            {
                "name": "requestDatabaseNames",
                "async": true,
                "parameters": [
                    { "name": "securityOrigin", "type": "string", "description": "Security origin." }
                ],
                "returns": [
                    { "name": "databaseNames", "type": "array", "items": { "type": "string" }, "description": "Database names for origin." }
                ],
                "description": "Requests database names for given security origin."
            },
            {
                "name": "requestDatabase",
                "async": true,
                "parameters": [
                    { "name": "securityOrigin", "type": "string", "description": "Security origin." },
                    { "name": "databaseName", "type": "string", "description": "Database name." }
                ],
                "returns": [
                    { "name": "databaseWithObjectStores", "$ref": "DatabaseWithObjectStores", "description": "Database with an array of object stores." }
                ],
                "description": "Requests database with given name in given frame."
            },
            {
                "name": "requestData",
                "async": true,
                "parameters": [
                    { "name": "securityOrigin", "type": "string", "description": "Security origin." },
                    { "name": "databaseName", "type": "string", "description": "Database name." },
                    { "name": "objectStoreName", "type": "string", "description": "Object store name." },
                    { "name": "indexName", "type": "string", "description": "Index name, empty string for object store data requests." },
                    { "name": "skipCount", "type": "integer", "description": "Number of records to skip." },
                    { "name": "pageSize", "type": "integer", "description": "Number of records to fetch." },
                    { "name": "keyRange", "$ref": "KeyRange", "optional": true, "description": "Key range." }
                ],
                "returns": [
                    { "name": "objectStoreDataEntries", "type": "array", "items": { "$ref": "DataEntry" }, "description": "Array of object store data entries." },
                    { "name": "hasMore", "type": "boolean", "description": "If true, there are more entries to fetch in the given range." }
                ],
                "description": "Requests data from object store or index."
            },
            {
                "name": "clearObjectStore",
                "async": true,
                "parameters": [
                    { "name": "securityOrigin", "type": "string", "description": "Security origin." },
                    { "name": "databaseName", "type": "string", "description": "Database name." },
                    { "name": "objectStoreName", "type": "string", "description": "Object store name." }
                ],
                "returns": [
                ],
                "description": "Clears all entries from an object store."
            }
        ]
    },
    {
        "domain": "CacheStorage",
        "hidden": true,
        "types": [
            {
                "id": "CacheId",
                "type": "string",
                "description": "Unique identifier of the Cache object."
            },
            {
                "id": "DataEntry",
                "type": "object",
                "description": "Data entry.",
                "properties": [
                    { "name": "request", "type": "string", "description": "Request url spec." },
                    { "name": "response", "type": "string", "description": "Response stataus text." }
                ]
            },
            {
                "id": "Cache",
                "type": "object",
                "description": "Cache identifier.",
                "properties": [
                    { "name": "cacheId", "$ref": "CacheId", "description": "An opaque unique id of the cache." },
                    { "name": "securityOrigin", "type": "string", "description": "Security origin of the cache." },
                    { "name": "cacheName", "type": "string", "description": "The name of the cache." }
                ]
            }
        ],
        "commands": [
            {
                "name": "requestCacheNames",
                "async": true,
                "parameters": [
                    { "name": "securityOrigin", "type": "string", "description": "Security origin." }
                ],
                "returns": [
                    { "name": "caches", "type": "array", "items": { "$ref": "Cache" }, "description": "Caches for the security origin." }
                ],
                "description": "Requests cache names."
            },
            {
                "name": "requestEntries",
                "async": true,
                "parameters": [
                    { "name": "cacheId", "$ref": "CacheId", "description": "ID of cache to get entries from." },
                    { "name": "skipCount", "type": "integer", "description": "Number of records to skip." },
                    { "name": "pageSize", "type": "integer", "description": "Number of records to fetch." }
                ],
                "returns": [
                    { "name": "cacheDataEntries", "type": "array", "items": { "$ref": "DataEntry" }, "description": "Array of object store data entries." },
                    { "name": "hasMore", "type": "boolean", "description": "If true, there are more entries to fetch in the given range." }
                ],
                "description": "Requests data from cache."
            },
            {
                "name": "deleteCache",
                "async": true,
                "parameters": [
                    { "name": "cacheId", "$ref": "CacheId", "description": "Id of cache for deletion." }
                ],
                "description": "Deletes a cache."
            },
            {
                "name": "deleteEntry",
                "async": true,
                "parameters": [
                    { "name": "cacheId", "$ref": "CacheId", "description": "Id of cache where the entry will be deleted." },
                    { "name": "request", "type": "string", "description": "URL spec of the request." }
                ],
                "description": "Deletes a cache entry."
            }
        ]
    },
    {
        "domain": "DOMStorage",
        "hidden": true,
        "description": "Query and modify DOM storage.",
        "types": [
            {
                "id": "StorageId",
                "type": "object",
                "description": "DOM Storage identifier.",
                "hidden": true,
                "properties": [
                    { "name": "securityOrigin", "type": "string", "description": "Security origin for the storage." },
                    { "name": "isLocalStorage", "type": "boolean", "description": "Whether the storage is local storage (not session storage)." }
                ]
            },
            {
                "id": "Item",
                "type": "array",
                "description": "DOM Storage item.",
                "hidden": true,
                "items": { "type": "string" }
            }
        ],
        "commands": [
            {
                "name": "enable",
                "description": "Enables storage tracking, storage events will now be delivered to the client."
            },
            {
                "name": "disable",
                "description": "Disables storage tracking, prevents storage events from being sent to the client."
            },
            {
                "name": "getDOMStorageItems",
                "parameters": [
                    { "name": "storageId", "$ref": "StorageId" }
                ],
                "returns": [
                    { "name": "entries", "type": "array", "items": { "$ref": "Item" } }
                ]
            },
            {
                "name": "setDOMStorageItem",
                "parameters": [
                    { "name": "storageId", "$ref": "StorageId" },
                    { "name": "key", "type": "string" },
                    { "name": "value", "type": "string" }
                ]
            },
            {
                "name": "removeDOMStorageItem",
                "parameters": [
                    { "name": "storageId", "$ref": "StorageId" },
                    { "name": "key", "type": "string" }
                ]
            }
        ],
        "events": [
            {
                "name": "domStorageItemsCleared",
                "parameters": [
                    { "name": "storageId",  "$ref": "StorageId" }
                ]
            },
            {
                "name": "domStorageItemRemoved",
                "parameters": [
                    { "name": "storageId",  "$ref": "StorageId" },
                    { "name": "key", "type": "string" }
                ]
            },
            {
                "name": "domStorageItemAdded",
                "parameters": [
                    { "name": "storageId",  "$ref": "StorageId" },
                    { "name": "key", "type": "string" },
                    { "name": "newValue", "type": "string" }
                ]
            },
            {
                "name": "domStorageItemUpdated",
                "parameters": [
                    { "name": "storageId",  "$ref": "StorageId" },
                    { "name": "key", "type": "string" },
                    { "name": "oldValue", "type": "string" },
                    { "name": "newValue", "type": "string" }
                ]
            }
        ]
    },
    {
        "domain": "ApplicationCache",
        "hidden": true,
        "types": [
            {
                "id": "ApplicationCacheResource",
                "type": "object",
                "description": "Detailed application cache resource information.",
                "properties": [
                    { "name": "url", "type": "string", "description": "Resource url." },
                    { "name": "size", "type": "integer", "description": "Resource size." },
                    { "name": "type", "type": "string", "description": "Resource type." }
                ]
            },
            {
                "id": "ApplicationCache",
                "type": "object",
                "description": "Detailed application cache information.",
                "properties": [
                    { "name": "manifestURL", "type": "string", "description": "Manifest URL." },
                    { "name": "size", "type": "number", "description": "Application cache size." },
                    { "name": "creationTime", "type": "number", "description": "Application cache creation time." },
                    { "name": "updateTime", "type": "number", "description": "Application cache update time." },
                    { "name": "resources", "type": "array", "items": { "$ref": "ApplicationCacheResource" }, "description": "Application cache resources." }
                ]
            },
            {
                "id": "FrameWithManifest",
                "type": "object",
                "description": "Frame identifier - manifest URL pair.",
                "properties": [
                    { "name": "frameId", "$ref": "Page.FrameId", "description": "Frame identifier." },
                    { "name": "manifestURL", "type": "string", "description": "Manifest URL." },
                    { "name": "status", "type": "integer", "description": "Application cache status." }
                ]
            }
        ],
        "commands": [
            {
                "name": "getFramesWithManifests",
                "returns": [
                    { "name": "frameIds", "type": "array", "items": { "$ref": "FrameWithManifest" }, "description": "Array of frame identifiers with manifest urls for each frame containing a document associated with some application cache." }
                ],
                "description": "Returns array of frame identifiers with manifest urls for each frame containing a document associated with some application cache."
            },
            {
                "name": "enable",
                "description": "Enables application cache domain notifications."
            },
            {
                "name": "getManifestForFrame",
                "parameters": [
                    { "name": "frameId", "$ref": "Page.FrameId", "description": "Identifier of the frame containing document whose manifest is retrieved." }
                ],
                "returns": [
                    { "name": "manifestURL", "type": "string", "description": "Manifest URL for document in the given frame." }
                ],
                "description": "Returns manifest URL for document in the given frame."
            },
            {
                "name": "getApplicationCacheForFrame",
                "parameters": [
                    { "name": "frameId", "$ref": "Page.FrameId", "description": "Identifier of the frame containing document whose application cache is retrieved." }
                ],
                "returns": [
                    { "name": "applicationCache", "$ref": "ApplicationCache", "description": "Relevant application cache data for the document in given frame." }
                ],
                "description": "Returns relevant application cache data for the document in given frame."
            }
        ],
        "events": [
            {
                "name": "applicationCacheStatusUpdated",
                "parameters": [
                    { "name": "frameId", "$ref": "Page.FrameId", "description": "Identifier of the frame containing document whose application cache updated status." },
                    { "name": "manifestURL", "type": "string", "description": "Manifest URL." },
                    { "name": "status", "type": "integer", "description": "Updated application cache status." }
                ]
            },
            {
                "name": "networkStateUpdated",
                "parameters": [
                    { "name": "isNowOnline", "type": "boolean" }
                ]
            }
        ]
    },
    {
        "domain": "DOM",
        "description": "This domain exposes DOM read/write operations. Each DOM Node is represented with its mirror object that has an <code>id</code>. This <code>id</code> can be used to get additional information on the Node, resolve it into the JavaScript object wrapper, etc. It is important that client receives DOM events only for the nodes that are known to the client. Backend keeps track of the nodes that were sent to the client and never sends the same node twice. It is client's responsibility to collect information about the nodes that were sent to the client.<p>Note that <code>iframe</code> owner elements will return corresponding document elements as their child nodes.</p>",
        "types": [
            {
                "id": "NodeId",
                "type": "integer",
                "description": "Unique DOM node identifier."
            },
            {
                "id": "BackendNodeId",
                "type": "integer",
                "description": "Unique DOM node identifier used to reference a node that may not have been pushed to the front-end.",
                "hidden": true
            },
            {
                "id": "BackendNode",
                "type": "object",
                "properties": [
                    { "name": "nodeType", "type": "integer", "description": "<code>Node</code>'s nodeType." },
                    { "name": "nodeName", "type": "string", "description": "<code>Node</code>'s nodeName." },
                    { "name": "backendNodeId", "$ref": "BackendNodeId" }
                ],
                "hidden": true,
                "description": "Backend node with a friendly name."
            },
            {
                "id": "PseudoType",
                "type": "string",
                "enum": [
                    "first-line",
                    "first-letter",
                    "before",
                    "after",
                    "backdrop",
                    "selection",
                    "first-line-inherited",
                    "scrollbar",
                    "scrollbar-thumb",
                    "scrollbar-button",
                    "scrollbar-track",
                    "scrollbar-track-piece",
                    "scrollbar-corner",
                    "resizer",
                    "input-list-button"
                ],
                "description": "Pseudo element type."
            },
            {
                "id": "ShadowRootType",
                "type": "string",
                "enum": ["user-agent", "open", "closed"],
                "description": "Shadow root type."
            },
            {
                "id": "Node",
                "type": "object",
                "properties": [
                    { "name": "nodeId", "$ref": "NodeId", "description": "Node identifier that is passed into the rest of the DOM messages as the <code>nodeId</code>. Backend will only push node with given <code>id</code> once. It is aware of all requested nodes and will only fire DOM events for nodes known to the client." },
                    { "name": "nodeType", "type": "integer", "description": "<code>Node</code>'s nodeType." },
                    { "name": "nodeName", "type": "string", "description": "<code>Node</code>'s nodeName." },
                    { "name": "localName", "type": "string", "description": "<code>Node</code>'s localName." },
                    { "name": "nodeValue", "type": "string", "description": "<code>Node</code>'s nodeValue." },
                    { "name": "childNodeCount", "type": "integer", "optional": true, "description": "Child count for <code>Container</code> nodes." },
                    { "name": "children", "type": "array", "optional": true, "items": { "$ref": "Node" }, "description": "Child nodes of this node when requested with children." },
                    { "name": "attributes", "type": "array", "optional": true, "items": { "type": "string" }, "description": "Attributes of the <code>Element</code> node in the form of flat array <code>[name1, value1, name2, value2]</code>." },
                    { "name": "documentURL", "type": "string", "optional": true, "description": "Document URL that <code>Document</code> or <code>FrameOwner</code> node points to." },
                    { "name": "baseURL", "type": "string", "optional": true, "description": "Base URL that <code>Document</code> or <code>FrameOwner</code> node uses for URL completion.", "hidden": true },
                    { "name": "publicId", "type": "string", "optional": true, "description": "<code>DocumentType</code>'s publicId." },
                    { "name": "systemId", "type": "string", "optional": true, "description": "<code>DocumentType</code>'s systemId." },
                    { "name": "internalSubset", "type": "string", "optional": true, "description": "<code>DocumentType</code>'s internalSubset." },
                    { "name": "xmlVersion", "type": "string", "optional": true, "description": "<code>Document</code>'s XML version in case of XML documents." },
                    { "name": "name", "type": "string", "optional": true, "description": "<code>Attr</code>'s name." },
                    { "name": "value", "type": "string", "optional": true, "description": "<code>Attr</code>'s value." },
                    { "name": "pseudoType", "$ref": "PseudoType", "optional": true, "description": "Pseudo element type for this node." },
                    { "name": "shadowRootType", "$ref": "ShadowRootType", "optional": true, "description": "Shadow root type." },
                    { "name": "frameId", "$ref": "Page.FrameId", "optional": true, "description": "Frame ID for frame owner elements.", "hidden": true },
                    { "name": "contentDocument", "$ref": "Node", "optional": true, "description": "Content document for frame owner elements." },
                    { "name": "shadowRoots", "type": "array", "optional": true, "items": { "$ref": "Node" }, "description": "Shadow root list for given element host.", "hidden": true },
                    { "name": "templateContent", "$ref": "Node", "optional": true, "description": "Content document fragment for template elements.", "hidden": true },
                    { "name": "pseudoElements", "type": "array", "items": { "$ref": "Node" }, "optional": true, "description": "Pseudo elements associated with this node.", "hidden": true },
                    { "name": "importedDocument", "$ref": "Node", "optional": true, "description": "Import document for the HTMLImport links." },
                    { "name": "distributedNodes", "type": "array", "items": { "$ref": "BackendNode" }, "optional": true, "description": "Distributed nodes for given insertion point.", "hidden": true }
                ],
                "description": "DOM interaction is implemented in terms of mirror objects that represent the actual DOM nodes. DOMNode is a base node mirror type."
            },
            {
                "id": "RGBA",
                "type": "object",
                "properties": [
                    { "name": "r", "type": "integer", "description": "The red component, in the [0-255] range." },
                    { "name": "g", "type": "integer", "description": "The green component, in the [0-255] range." },
                    { "name": "b", "type": "integer", "description": "The blue component, in the [0-255] range." },
                    { "name": "a", "type": "number", "optional": true, "description": "The alpha component, in the [0-1] range (default: 1)." }
                ],
                "description": "A structure holding an RGBA color."
            },
            {
                "id": "Quad",
                "type": "array",
                "items": { "type": "number" },
                "minItems": 8,
                "maxItems": 8,
                "description": "An array of quad vertices, x immediately followed by y for each point, points clock-wise.",
                "hidden": true
            },
            {
                "id": "BoxModel",
                "type": "object",
                "hidden": true,
                "properties": [
                    { "name": "content", "$ref": "Quad", "description": "Content box" },
                    { "name": "padding", "$ref": "Quad", "description": "Padding box" },
                    { "name": "border", "$ref": "Quad", "description": "Border box" },
                    { "name": "margin", "$ref": "Quad", "description": "Margin box" },
                    { "name": "width", "type": "integer", "description": "Node width" },
                    { "name": "height", "type": "integer", "description": "Node height" },
                    { "name": "shapeOutside", "$ref": "ShapeOutsideInfo", "optional": true, "description": "Shape outside coordinates" }
                ],
                "description": "Box model."
            },
            {
                "id": "ShapeOutsideInfo",
                "type": "object",
                "hidden": true,
                "properties": [
                    { "name": "bounds", "$ref": "Quad", "description": "Shape bounds" },
                    { "name": "shape", "type": "array", "items": { "type": "any"}, "description": "Shape coordinate details" },
                    { "name": "marginShape", "type": "array", "items": { "type": "any"}, "description": "Margin shape bounds" }
                ],
                "description": "CSS Shape Outside details."
            },
            {
                "id": "Rect",
                "type": "object",
                "hidden": true,
                "properties": [
                    { "name": "x", "type": "number", "description": "X coordinate" },
                    { "name": "y", "type": "number", "description": "Y coordinate" },
                    { "name": "width", "type": "number", "description": "Rectangle width" },
                    { "name": "height", "type": "number", "description": "Rectangle height" }
                ],
                "description": "Rectangle."
            },
            {
                "id": "HighlightConfig",
                "type": "object",
                "properties": [
                    { "name": "showInfo", "type": "boolean", "optional": true, "description": "Whether the node info tooltip should be shown (default: false)." },
                    { "name": "showRulers", "type": "boolean", "optional": true, "description": "Whether the rulers should be shown (default: false)." },
                    { "name": "showExtensionLines", "type": "boolean", "optional": true, "description": "Whether the extension lines from node to the rulers should be shown (default: false)." },
                    { "name": "displayAsMaterial", "type": "boolean", "optional": true, "hidden": true},
                    { "name": "contentColor", "$ref": "RGBA", "optional": true, "description": "The content box highlight fill color (default: transparent)." },
                    { "name": "paddingColor", "$ref": "RGBA", "optional": true, "description": "The padding highlight fill color (default: transparent)." },
                    { "name": "borderColor", "$ref": "RGBA", "optional": true, "description": "The border highlight fill color (default: transparent)." },
                    { "name": "marginColor", "$ref": "RGBA", "optional": true, "description": "The margin highlight fill color (default: transparent)." },
                    { "name": "eventTargetColor", "$ref": "RGBA", "optional": true, "hidden": true, "description": "The event target element highlight fill color (default: transparent)." },
                    { "name": "shapeColor", "$ref": "RGBA", "optional": true, "hidden": true, "description": "The shape outside fill color (default: transparent)." },
                    { "name": "shapeMarginColor", "$ref": "RGBA", "optional": true, "hidden": true, "description": "The shape margin fill color (default: transparent)." },
                    { "name": "selectorList", "type": "string", "optional": true, "description": "Selectors to highlight relevant nodes."}
                ],
                "description": "Configuration data for the highlighting of page elements."
            },
            {
                "id": "InspectMode",
                "type": "string",
                "hidden": true,
                "enum": [
                    "searchForNode",
                    "searchForUAShadowDOM",
                    "showLayoutEditor",
                    "none"
                ]
            }
        ],
        "commands": [
            {
                "name": "enable",
                "description": "Enables DOM agent for the given page."
            },
            {
                "name": "disable",
                "description": "Disables DOM agent for the given page."
            },
            {
                "name": "getDocument",
                "returns": [
                    { "name": "root", "$ref": "Node", "description": "Resulting node." }
                ],
                "description": "Returns the root DOM node to the caller."
            },
            {
                "name": "requestChildNodes",
                "parameters": [
                    { "name": "nodeId", "$ref": "NodeId", "description": "Id of the node to get children for." },
                    { "name": "depth", "type": "integer", "optional": true, "description": "The maximum depth at which children should be retrieved, defaults to 1. Use -1 for the entire subtree or provide an integer larger than 0.", "hidden": true }
                ],
                "description": "Requests that children of the node with given id are returned to the caller in form of <code>setChildNodes</code> events where not only immediate children are retrieved, but all children down to the specified depth."
            },
            {
                "name": "querySelector",
                "parameters": [
                    { "name": "nodeId", "$ref": "NodeId", "description": "Id of the node to query upon." },
                    { "name": "selector", "type": "string", "description": "Selector string." }
                ],
                "returns": [
                    { "name": "nodeId", "$ref": "NodeId", "description": "Query selector result." }
                ],
                "description": "Executes <code>querySelector</code> on a given node."
            },
            {
                "name": "querySelectorAll",
                "parameters": [
                    { "name": "nodeId", "$ref": "NodeId", "description": "Id of the node to query upon." },
                    { "name": "selector", "type": "string", "description": "Selector string." }
                ],
                "returns": [
                    { "name": "nodeIds", "type": "array", "items": { "$ref": "NodeId" }, "description": "Query selector result." }
                ],
                "description": "Executes <code>querySelectorAll</code> on a given node."
            },
            {
                "name": "setNodeName",
                "parameters": [
                    { "name": "nodeId", "$ref": "NodeId", "description": "Id of the node to set name for." },
                    { "name": "name", "type": "string", "description": "New node's name." }
                ],
                "returns": [
                    { "name": "nodeId", "$ref": "NodeId", "description": "New node's id." }
                ],
                "description": "Sets node name for a node with given id."
            },
            {
                "name": "setNodeValue",
                "parameters": [
                    { "name": "nodeId", "$ref": "NodeId", "description": "Id of the node to set value for." },
                    { "name": "value", "type": "string", "description": "New node's value." }
                ],
                "description": "Sets node value for a node with given id."
            },
            {
                "name": "removeNode",
                "parameters": [
                    { "name": "nodeId", "$ref": "NodeId", "description": "Id of the node to remove." }
                ],
                "description": "Removes node with given id."
            },
            {
                "name": "setAttributeValue",
                "parameters": [
                    { "name": "nodeId", "$ref": "NodeId", "description": "Id of the element to set attribute for." },
                    { "name": "name", "type": "string", "description": "Attribute name." },
                    { "name": "value", "type": "string", "description": "Attribute value." }
                ],
                "description": "Sets attribute for an element with given id."
            },
            {
                "name": "setAttributesAsText",
                "parameters": [
                    { "name": "nodeId", "$ref": "NodeId", "description": "Id of the element to set attributes for." },
                    { "name": "text", "type": "string", "description": "Text with a number of attributes. Will parse this text using HTML parser." },
                    { "name": "name", "type": "string", "optional": true, "description": "Attribute name to replace with new attributes derived from text in case text parsed successfully." }
                ],
                "description": "Sets attributes on element with given id. This method is useful when user edits some existing attribute value and types in several attribute name/value pairs."
            },
            {
                "name": "removeAttribute",
                "parameters": [
                    { "name": "nodeId", "$ref": "NodeId", "description": "Id of the element to remove attribute from." },
                    { "name": "name", "type": "string", "description": "Name of the attribute to remove." }
                ],
                "description": "Removes attribute with given name from an element with given id."
            },
            {
                "name": "getOuterHTML",
                "parameters": [
                    { "name": "nodeId", "$ref": "NodeId", "description": "Id of the node to get markup for." }
                ],
                "returns": [
                    { "name": "outerHTML", "type": "string", "description": "Outer HTML markup." }
                ],
                "description": "Returns node's HTML markup."
            },
            {
                "name": "setOuterHTML",
                "parameters": [
                    { "name": "nodeId", "$ref": "NodeId", "description": "Id of the node to set markup for." },
                    { "name": "outerHTML", "type": "string", "description": "Outer HTML markup to set." }
                ],
                "description": "Sets node HTML markup, returns new node id."
            },
            {
                "name": "performSearch",
                "parameters": [
                    { "name": "query", "type": "string", "description": "Plain text or query selector or XPath search query." },
                    { "name": "includeUserAgentShadowDOM", "type": "boolean", "optional": true, "description": "True to search in user agent shadow DOM.", "hidden": true }
                ],
                "returns": [
                    { "name": "searchId", "type": "string", "description": "Unique search session identifier." },
                    { "name": "resultCount", "type": "integer", "description": "Number of search results." }
                ],
                "description": "Searches for a given string in the DOM tree. Use <code>getSearchResults</code> to access search results or <code>cancelSearch</code> to end this search session.",
                "hidden": true
            },
            {
                "name": "getSearchResults",
                "parameters": [
                    { "name": "searchId", "type": "string", "description": "Unique search session identifier." },
                    { "name": "fromIndex", "type": "integer", "description": "Start index of the search result to be returned." },
                    { "name": "toIndex", "type": "integer", "description": "End index of the search result to be returned." }
                ],
                "returns": [
                    { "name": "nodeIds", "type": "array", "items": { "$ref": "NodeId" }, "description": "Ids of the search result nodes." }
                ],
                "description": "Returns search results from given <code>fromIndex</code> to given <code>toIndex</code> from the sarch with the given identifier.",
                "hidden": true
            },
            {
                "name": "discardSearchResults",
                "parameters": [
                    { "name": "searchId", "type": "string", "description": "Unique search session identifier." }
                ],
                "description": "Discards search results from the session with the given id. <code>getSearchResults</code> should no longer be called for that search.",
                "hidden": true
            },
            {
                "name": "requestNode",
                "parameters": [
                    { "name": "objectId", "$ref": "Runtime.RemoteObjectId", "description": "JavaScript object id to convert into node." }
                ],
                "returns": [
                    { "name": "nodeId", "$ref": "NodeId", "description": "Node id for given object." }
                ],
                "description": "Requests that the node is sent to the caller given the JavaScript node object reference. All nodes that form the path from the node to the root are also sent to the client as a series of <code>setChildNodes</code> notifications."
            },
            {
                "name": "setInspectMode",
                "hidden": true,
                "parameters": [
                    { "name": "mode", "$ref": "InspectMode", "description": "Set an inspection mode." },
                    { "name": "highlightConfig", "$ref": "HighlightConfig", "optional": true, "description": "A descriptor for the highlight appearance of hovered-over nodes. May be omitted if <code>enabled == false</code>." }
                ],
                "description": "Enters the 'inspect' mode. In this mode, elements that user is hovering over are highlighted. Backend then generates 'inspectNodeRequested' event upon element selection."
            },
            {
                "name": "highlightRect",
                "parameters": [
                    { "name": "x", "type": "integer", "description": "X coordinate" },
                    { "name": "y", "type": "integer", "description": "Y coordinate" },
                    { "name": "width", "type": "integer", "description": "Rectangle width" },
                    { "name": "height", "type": "integer", "description": "Rectangle height" },
                    { "name": "color", "$ref": "RGBA", "optional": true, "description": "The highlight fill color (default: transparent)." },
                    { "name": "outlineColor", "$ref": "RGBA", "optional": true, "description": "The highlight outline color (default: transparent)." }
                ],
                "description": "Highlights given rectangle. Coordinates are absolute with respect to the main frame viewport."
            },
            {
                "name": "highlightQuad",
                "parameters": [
                    { "name": "quad", "$ref": "Quad", "description": "Quad to highlight" },
                    { "name": "color", "$ref": "RGBA", "optional": true, "description": "The highlight fill color (default: transparent)." },
                    { "name": "outlineColor", "$ref": "RGBA", "optional": true, "description": "The highlight outline color (default: transparent)." }
                ],
                "description": "Highlights given quad. Coordinates are absolute with respect to the main frame viewport.",
                "hidden": true
            },
            {
                "name": "highlightNode",
                "parameters": [
                    { "name": "highlightConfig", "$ref": "HighlightConfig",  "description": "A descriptor for the highlight appearance." },
                    { "name": "nodeId", "$ref": "NodeId", "optional": true, "description": "Identifier of the node to highlight." },
                    { "name": "backendNodeId", "$ref": "BackendNodeId", "optional": true, "description": "Identifier of the backend node to highlight." },
                    { "name": "objectId", "$ref": "Runtime.RemoteObjectId", "optional": true, "description": "JavaScript object id of the node to be highlighted.", "hidden": true }
                ],
                "description": "Highlights DOM node with given id or with the given JavaScript object wrapper. Either nodeId or objectId must be specified."
            },
            {
                "name": "hideHighlight",
                "description": "Hides DOM node highlight."
            },
            {
                "name": "highlightFrame",
                "parameters": [
                    { "name": "frameId", "$ref": "Page.FrameId", "description": "Identifier of the frame to highlight." },
                    { "name": "contentColor", "$ref": "RGBA", "optional": true, "description": "The content box highlight fill color (default: transparent)." },
                    { "name": "contentOutlineColor", "$ref": "RGBA", "optional": true, "description": "The content box highlight outline color (default: transparent)." }
                ],
                "description": "Highlights owner element of the frame with given id.",
                "hidden": true
            },
            {
                "name": "pushNodeByPathToFrontend",
                "parameters": [
                    { "name": "path", "type": "string", "description": "Path to node in the proprietary format." }
                ],
                "returns": [
                    { "name": "nodeId", "$ref": "NodeId", "description": "Id of the node for given path." }
                ],
                "description": "Requests that the node is sent to the caller given its path. // FIXME, use XPath",
                "hidden": true
            },
            {
                "name": "pushNodesByBackendIdsToFrontend",
                "parameters": [
                    { "name": "backendNodeIds", "type": "array", "items": {"$ref": "BackendNodeId"}, "description": "The array of backend node ids." }
                ],
                "returns": [
                    { "name": "nodeIds", "type": "array", "items": {"$ref": "NodeId"}, "description": "The array of ids of pushed nodes that correspond to the backend ids specified in backendNodeIds." }
                ],
                "description": "Requests that a batch of nodes is sent to the caller given their backend node ids.",
                "hidden": true
            },
            {
                "name": "setInspectedNode",
                "parameters": [
                    { "name": "nodeId", "$ref": "NodeId", "description": "DOM node id to be accessible by means of $x command line API." }
                ],
                "description": "Enables console to refer to the node with given id via $x (see Command Line API for more details $x functions).",
                "hidden": true
            },
            {
                "name": "resolveNode",
                "parameters": [
                    { "name": "nodeId", "$ref": "NodeId", "description": "Id of the node to resolve." },
                    { "name": "objectGroup", "type": "string", "optional": true, "description": "Symbolic group name that can be used to release multiple objects." }
                ],
                "returns": [
                    { "name": "object", "$ref": "Runtime.RemoteObject", "description": "JavaScript object wrapper for given node." }
                ],
                "description": "Resolves JavaScript node object for given node id."
            },
            {
                "name": "getAttributes",
                "parameters": [
                    { "name": "nodeId", "$ref": "NodeId", "description": "Id of the node to retrieve attibutes for." }
                ],
                "returns": [
                    { "name": "attributes", "type": "array", "items": { "type": "string" }, "description": "An interleaved array of node attribute names and values." }
                ],
                "description": "Returns attributes for the specified node."
            },
            {
                "name": "copyTo",
                "parameters": [
                    { "name": "nodeId", "$ref": "NodeId", "description": "Id of the node to copy." },
                    { "name": "targetNodeId", "$ref": "NodeId", "description": "Id of the element to drop the copy into." },
                    { "name": "insertBeforeNodeId", "$ref": "NodeId", "optional": true, "description": "Drop the copy before this node (if absent, the copy becomes the last child of <code>targetNodeId</code>)." }
                ],
                "returns": [
                    { "name": "nodeId", "$ref": "NodeId", "description": "Id of the node clone." }
                ],
                "description": "Creates a deep copy of the specified node and places it into the target container before the given anchor.",
                "hidden": true
            },
            {
                "name": "moveTo",
                "parameters": [
                    { "name": "nodeId", "$ref": "NodeId", "description": "Id of the node to move." },
                    { "name": "targetNodeId", "$ref": "NodeId", "description": "Id of the element to drop the moved node into." },
                    { "name": "insertBeforeNodeId", "$ref": "NodeId", "optional": true, "description": "Drop node before this one (if absent, the moved node becomes the last child of <code>targetNodeId</code>)." }
                ],
                "returns": [
                    { "name": "nodeId", "$ref": "NodeId", "description": "New id of the moved node." }
                ],
                "description": "Moves node into the new container, places it before the given anchor."
            },
            {
                "name": "undo",
                "description": "Undoes the last performed action.",
                "hidden": true
            },
            {
                "name": "redo",
                "description": "Re-does the last undone action.",
                "hidden": true
            },
            {
                "name": "markUndoableState",
                "description": "Marks last undoable state.",
                "hidden": true
            },
            {
                "name": "focus",
                "parameters": [
                    { "name": "nodeId", "$ref": "NodeId", "description": "Id of the node to focus." }
                ],
                "description": "Focuses the given element.",
                "hidden": true
            },
            {
                "name": "setFileInputFiles",
                "parameters": [
                    { "name": "nodeId", "$ref": "NodeId", "description": "Id of the file input node to set files for." },
                    { "name": "files", "type": "array", "items": { "type": "string" }, "description": "Array of file paths to set." }
                ],
                "description": "Sets files for the given file input element.",
                "hidden": true,
                "handlers": ["browser", "renderer"]
            },
            {
                "name": "getBoxModel",
                "parameters": [
                    { "name": "nodeId", "$ref": "NodeId", "description": "Id of the node to get box model for." }
                ],
                "returns": [
                    { "name": "model", "$ref": "BoxModel", "description": "Box model for the node." }
                ],
                "description": "Returns boxes for the currently selected nodes.",
                "hidden": true
            },
            {
                "name": "getNodeForLocation",
                "parameters": [
                    { "name": "x", "type": "integer", "description": "X coordinate." },
                    { "name": "y", "type": "integer", "description": "Y coordinate." }
                ],
                "returns": [
                    { "name": "nodeId", "$ref": "NodeId", "description": "Id of the node at given coordinates." }
                ],
                "description": "Returns node id at given location.",
                "hidden": true
            },
            {
                "name": "getRelayoutBoundary",
                "parameters": [
                    { "name": "nodeId", "$ref": "NodeId", "description": "Id of the node." }
                ],
                "returns": [
                    { "name": "nodeId", "$ref": "NodeId", "description": "Relayout boundary node id for the given node." }
                ],
                "description": "Returns the id of the nearest ancestor that is a relayout boundary.",
                "hidden": true
            },
            {
                "name": "getHighlightObjectForTest",
                "parameters": [
                    { "name": "nodeId", "$ref": "NodeId", "description": "Id of the node to get highlight object for." }
                ],
                "returns": [
                    { "name": "highlight", "type": "object", "description": "Highlight data for the node." }
                ],
                "description": "For testing.",
                "hidden": true
            }
        ],
        "events": [
            {
                "name": "documentUpdated",
                "description": "Fired when <code>Document</code> has been totally updated. Node ids are no longer valid."
            },
            {
                "name": "inspectNodeRequested",
                "parameters": [
                    { "name": "backendNodeId", "$ref": "BackendNodeId", "description": "Id of the node to inspect." }
                ],
                "description": "Fired when the node should be inspected. This happens after call to <code>setInspectMode</code>.",
                "hidden" : true
            },
            {
                "name": "setChildNodes",
                "parameters": [
                    { "name": "parentId", "$ref": "NodeId", "description": "Parent node id to populate with children." },
                    { "name": "nodes", "type": "array", "items": { "$ref": "Node" }, "description": "Child nodes array." }
                ],
                "description": "Fired when backend wants to provide client with the missing DOM structure. This happens upon most of the calls requesting node ids."
            },
            {
                "name": "attributeModified",
                "parameters": [
                    { "name": "nodeId", "$ref": "NodeId", "description": "Id of the node that has changed." },
                    { "name": "name", "type": "string", "description": "Attribute name." },
                    { "name": "value", "type": "string", "description": "Attribute value." }
                ],
                "description": "Fired when <code>Element</code>'s attribute is modified."
            },
            {
                "name": "attributeRemoved",
                "parameters": [
                    { "name": "nodeId", "$ref": "NodeId", "description": "Id of the node that has changed." },
                    { "name": "name", "type": "string", "description": "A ttribute name." }
                ],
                "description": "Fired when <code>Element</code>'s attribute is removed."
            },
            {
                "name": "inlineStyleInvalidated",
                "parameters": [
                    { "name": "nodeIds", "type": "array", "items": { "$ref": "NodeId" }, "description": "Ids of the nodes for which the inline styles have been invalidated." }
                ],
                "description": "Fired when <code>Element</code>'s inline style is modified via a CSS property modification.",
                "hidden": true
            },
            {
                "name": "characterDataModified",
                "parameters": [
                    { "name": "nodeId", "$ref": "NodeId", "description": "Id of the node that has changed." },
                    { "name": "characterData", "type": "string", "description": "New text value." }
                ],
                "description": "Mirrors <code>DOMCharacterDataModified</code> event."
            },
            {
                "name": "childNodeCountUpdated",
                "parameters": [
                    { "name": "nodeId", "$ref": "NodeId", "description": "Id of the node that has changed." },
                    { "name": "childNodeCount", "type": "integer", "description": "New node count." }
                ],
                "description": "Fired when <code>Container</code>'s child node count has changed."
            },
            {
                "name": "childNodeInserted",
                "parameters": [
                    { "name": "parentNodeId", "$ref": "NodeId", "description": "Id of the node that has changed." },
                    { "name": "previousNodeId", "$ref": "NodeId", "description": "If of the previous siblint." },
                    { "name": "node", "$ref": "Node", "description": "Inserted node data." }
                ],
                "description": "Mirrors <code>DOMNodeInserted</code> event."
            },
            {
                "name": "childNodeRemoved",
                "parameters": [
                    { "name": "parentNodeId", "$ref": "NodeId", "description": "Parent id." },
                    { "name": "nodeId", "$ref": "NodeId", "description": "Id of the node that has been removed." }
                ],
                "description": "Mirrors <code>DOMNodeRemoved</code> event."
            },
            {
                "name": "shadowRootPushed",
                "parameters": [
                    { "name": "hostId", "$ref": "NodeId", "description": "Host element id." },
                    { "name": "root", "$ref": "Node", "description": "Shadow root." }
                ],
                "description": "Called when shadow root is pushed into the element.",
                "hidden": true
            },
            {
                "name": "shadowRootPopped",
                "parameters": [
                    { "name": "hostId", "$ref": "NodeId", "description": "Host element id." },
                    { "name": "rootId", "$ref": "NodeId", "description": "Shadow root id." }
                ],
                "description": "Called when shadow root is popped from the element.",
                "hidden": true
            },
            {
                "name": "pseudoElementAdded",
                "parameters": [
                    { "name": "parentId", "$ref": "NodeId", "description": "Pseudo element's parent element id." },
                    { "name": "pseudoElement", "$ref": "Node", "description": "The added pseudo element." }
                ],
                "description": "Called when a pseudo element is added to an element.",
                "hidden": true
            },
            {
                "name": "pseudoElementRemoved",
                "parameters": [
                    { "name": "parentId", "$ref": "NodeId", "description": "Pseudo element's parent element id." },
                    { "name": "pseudoElementId", "$ref": "NodeId", "description": "The removed pseudo element id." }
                ],
                "description": "Called when a pseudo element is removed from an element.",
                "hidden": true
            },
            {
                "name": "distributedNodesUpdated",
                "parameters": [
                    { "name": "insertionPointId", "$ref": "NodeId", "description": "Insertion point where distrubuted nodes were updated." },
                    { "name": "distributedNodes", "type": "array", "items": { "$ref": "BackendNode" }, "description": "Distributed nodes for given insertion point." }
                ],
                "description": "Called when distrubution is changed.",
                "hidden": true
            },
            {
                "name": "nodeHighlightRequested",
                "parameters": [
                    {"name": "nodeId", "$ref": "NodeId"}
                ],
                "hidden": true
            }
        ]
    },
    {
        "domain": "CSS",
        "hidden": true,
        "description": "This domain exposes CSS read/write operations. All CSS objects (stylesheets, rules, and styles) have an associated <code>id</code> used in subsequent operations on the related object. Each object type has a specific <code>id</code> structure, and those are not interchangeable between objects of different kinds. CSS objects can be loaded using the <code>get*ForNode()</code> calls (which accept a DOM node id). A client can also discover all the existing stylesheets with the <code>getAllStyleSheets()</code> method (or keeping track of the <code>styleSheetAdded</code>/<code>styleSheetRemoved</code> events) and subsequently load the required stylesheet contents using the <code>getStyleSheet[Text]()</code> methods.",
        "types": [
            {
                "id": "StyleSheetId",
                "type": "string"
            },
            {
                "id": "StyleSheetOrigin",
                "type": "string",
                "enum": ["injected", "user-agent", "inspector", "regular"],
                "description": "Stylesheet type: \"injected\" for stylesheets injected via extension, \"user-agent\" for user-agent stylesheets, \"inspector\" for stylesheets created by the inspector (i.e. those holding the \"via inspector\" rules), \"regular\" for regular stylesheets."
            },
            {
                "id": "PseudoElementMatches",
                "type": "object",
                "properties": [
                    { "name": "pseudoType", "$ref": "DOM.PseudoType", "description": "Pseudo element type."},
                    { "name": "matches", "type": "array", "items": { "$ref": "RuleMatch" }, "description": "Matches of CSS rules applicable to the pseudo style."}
                ],
                "description": "CSS rule collection for a single pseudo style."
            },
            {
                "id": "InheritedStyleEntry",
                "type": "object",
                "properties": [
                    { "name": "inlineStyle", "$ref": "CSSStyle", "optional": true, "description": "The ancestor node's inline style, if any, in the style inheritance chain." },
                    { "name": "matchedCSSRules", "type": "array", "items": { "$ref": "RuleMatch" }, "description": "Matches of CSS rules matching the ancestor node in the style inheritance chain." }
                ],
                "description": "Inherited CSS rule collection from ancestor node."
            },
            {
                "id": "RuleMatch",
                "type": "object",
                "properties": [
                    { "name": "rule", "$ref": "CSSRule", "description": "CSS rule in the match." },
                    { "name": "matchingSelectors", "type": "array", "items": { "type": "integer" }, "description": "Matching selector indices in the rule's selectorList selectors (0-based)." }
                ],
                "description": "Match data for a CSS rule."
            },
            {
                "id": "Value",
                "type": "object",
                "properties": [
                    { "name": "text", "type": "string", "description": "Value text." },
                    { "name": "range", "$ref": "SourceRange", "optional": true, "description": "Value range in the underlying resource (if available)." }
                ],
                "description": "Data for a simple selector (these are delimited by commas in a selector list)."
            },
            {
                "id": "SelectorList",
                "type": "object",
                "properties": [
                    { "name": "selectors", "type": "array", "items": { "$ref": "Value" }, "description": "Selectors in the list." },
                    { "name": "text", "type": "string", "description": "Rule selector text." }
                ],
                "description": "Selector list data."
            },
            {
                "id": "CSSStyleSheetHeader",
                "type": "object",
                "properties": [
                    { "name": "styleSheetId", "$ref": "StyleSheetId", "description": "The stylesheet identifier."},
                    { "name": "frameId", "$ref": "Page.FrameId", "description": "Owner frame identifier."},
                    { "name": "sourceURL", "type": "string", "description": "Stylesheet resource URL."},
                    { "name": "sourceMapURL", "type": "string", "optional": true, "description": "URL of source map associated with the stylesheet (if any)." },
                    { "name": "origin", "$ref": "StyleSheetOrigin", "description": "Stylesheet origin."},
                    { "name": "title", "type": "string", "description": "Stylesheet title."},
                    { "name": "ownerNode", "$ref": "DOM.BackendNodeId", "optional": true, "description": "The backend id for the owner node of the stylesheet." },
                    { "name": "disabled", "type": "boolean", "description": "Denotes whether the stylesheet is disabled."},
                    { "name": "hasSourceURL", "type": "boolean", "optional": true, "description": "Whether the sourceURL field value comes from the sourceURL comment." },
                    { "name": "isInline", "type": "boolean", "description": "Whether this stylesheet is created for STYLE tag by parser. This flag is not set for document.written STYLE tags." },
                    { "name": "startLine", "type": "number", "description": "Line offset of the stylesheet within the resource (zero based)." },
                    { "name": "startColumn", "type": "number", "description": "Column offset of the stylesheet within the resource (zero based)." }
                ],
                "description": "CSS stylesheet metainformation."
            },
            {
                "id": "CSSRule",
                "type": "object",
                "properties": [
                    { "name": "styleSheetId", "$ref": "StyleSheetId", "optional": true, "description": "The css style sheet identifier (absent for user agent stylesheet and user-specified stylesheet rules) this rule came from." },
                    { "name": "selectorList", "$ref": "SelectorList", "description": "Rule selector data." },
                    { "name": "origin", "$ref": "StyleSheetOrigin", "description": "Parent stylesheet's origin."},
                    { "name": "style", "$ref": "CSSStyle", "description": "Associated style declaration." },
                    { "name": "media", "type": "array", "items": { "$ref": "CSSMedia" }, "optional": true, "description": "Media list array (for rules involving media queries). The array enumerates media queries starting with the innermost one, going outwards." }
                ],
                "description": "CSS rule representation."
            },
            {
                "id": "SourceRange",
                "type": "object",
                "properties": [
                    { "name": "startLine", "type": "integer", "description": "Start line of range." },
                    { "name": "startColumn", "type": "integer", "description": "Start column of range (inclusive)." },
                    { "name": "endLine", "type": "integer", "description": "End line of range" },
                    { "name": "endColumn", "type": "integer", "description": "End column of range (exclusive)." }
                ],
                "description": "Text range within a resource. All numbers are zero-based."
            },
            {
                "id": "ShorthandEntry",
                "type": "object",
                "properties": [
                    { "name": "name", "type": "string", "description": "Shorthand name." },
                    { "name": "value", "type": "string", "description": "Shorthand value." },
                    { "name": "important", "type": "boolean", "optional": true, "description": "Whether the property has \"!important\" annotation (implies <code>false</code> if absent)." }
                ]
            },
            {
                "id": "CSSComputedStyleProperty",
                "type": "object",
                "properties": [
                    { "name": "name", "type": "string", "description": "Computed style property name." },
                    { "name": "value", "type": "string", "description": "Computed style property value." }
                ]
            },
            {
                "id": "CSSStyle",
                "type": "object",
                "properties": [
                    { "name": "styleSheetId", "$ref": "StyleSheetId", "optional": true, "description": "The css style sheet identifier (absent for user agent stylesheet and user-specified stylesheet rules) this rule came from." },
                    { "name": "cssProperties", "type": "array", "items": { "$ref": "CSSProperty" }, "description": "CSS properties in the style." },
                    { "name": "shorthandEntries", "type": "array", "items": { "$ref": "ShorthandEntry" }, "description": "Computed values for all shorthands found in the style." },
                    { "name": "cssText", "type": "string", "optional": true, "description": "Style declaration text (if available)." },
                    { "name": "range", "$ref": "SourceRange", "optional": true, "description": "Style declaration range in the enclosing stylesheet (if available)." }
                ],
                "description": "CSS style representation."
            },
            {
                "id": "CSSProperty",
                "type": "object",
                "properties": [
                    { "name": "name", "type": "string", "description": "The property name." },
                    { "name": "value", "type": "string", "description": "The property value." },
                    { "name": "important", "type": "boolean", "optional": true, "description": "Whether the property has \"!important\" annotation (implies <code>false</code> if absent)." },
                    { "name": "implicit", "type": "boolean", "optional": true, "description": "Whether the property is implicit (implies <code>false</code> if absent)." },
                    { "name": "text", "type": "string", "optional": true, "description": "The full property text as specified in the style." },
                    { "name": "parsedOk", "type": "boolean", "optional": true, "description": "Whether the property is understood by the browser (implies <code>true</code> if absent)." },
                    { "name": "disabled", "type": "boolean", "optional": true, "description": "Whether the property is disabled by the user (present for source-based properties only)." },
                    { "name": "range", "$ref": "SourceRange", "optional": true, "description": "The entire property range in the enclosing style declaration (if available)." }
                ],
                "description": "CSS property declaration data."
            },
            {
                "id": "CSSMedia",
                "type": "object",
                "properties": [
                    { "name": "text", "type": "string", "description": "Media query text." },
                    { "name": "source", "type": "string", "enum": ["mediaRule", "importRule", "linkedSheet", "inlineSheet"], "description": "Source of the media query: \"mediaRule\" if specified by a @media rule, \"importRule\" if specified by an @import rule, \"linkedSheet\" if specified by a \"media\" attribute in a linked stylesheet's LINK tag, \"inlineSheet\" if specified by a \"media\" attribute in an inline stylesheet's STYLE tag." },
                    { "name": "sourceURL", "type": "string", "optional": true, "description": "URL of the document containing the media query description." },
                    { "name": "range", "$ref": "SourceRange", "optional": true, "description": "The associated rule (@media or @import) header range in the enclosing stylesheet (if available)." },
                    { "name": "parentStyleSheetId", "$ref": "StyleSheetId", "optional": true, "description": "Identifier of the stylesheet containing this object (if exists)." },
                    { "name": "mediaList", "type": "array", "items": { "$ref": "MediaQuery" }, "optional": true, "hidden": true, "description": "Array of media queries." }
                ],
                "description": "CSS media rule descriptor."
            },
            {
                "id": "MediaQuery",
                "type": "object",
                "properties": [
                    { "name": "expressions", "type": "array", "items": { "$ref": "MediaQueryExpression" }, "description": "Array of media query expressions." },
                    { "name": "active", "type": "boolean", "description": "Whether the media query condition is satisfied." }
                ],
                "description": "Media query descriptor.",
                "hidden": true
            },
            {
                "id": "MediaQueryExpression",
                "type": "object",
                "properties": [
                    { "name": "value", "type": "number", "description": "Media query expression value."},
                    { "name": "unit", "type": "string", "description": "Media query expression units."},
                    { "name": "feature", "type": "string", "description": "Media query expression feature."},
                    { "name": "valueRange", "$ref": "SourceRange", "optional": true, "description": "The associated range of the value text in the enclosing stylesheet (if available)." },
                    { "name": "computedLength", "type": "number", "optional": true, "description": "Computed length of media query expression (if applicable)."}
                ],
                "description": "Media query expression descriptor.",
                "hidden": true
            },
            {
                "id": "PlatformFontUsage",
                "type": "object",
                "properties": [
                    { "name": "familyName", "type": "string", "description": "Font's family name reported by platform."},
                    { "name": "glyphCount", "type": "number", "description": "Amount of glyphs that were rendered with this font."}
                ],
                "description": "Information about amount of glyphs that were rendered with given font.",
                "hidden": true
            },
            {
                "id": "CSSKeyframesRule",
                "type": "object",
                "properties": [
                    { "name": "animationName", "$ref": "Value", "description": "Animation name." },
                    { "name": "keyframes", "type": "array", "items": { "$ref": "CSSKeyframeRule" }, "description": "List of keyframes." }
                ],
                "description": "CSS keyframes rule representation."
            },
            {
                "id": "CSSKeyframeRule",
                "type": "object",
                "properties": [
                    { "name": "styleSheetId", "$ref": "StyleSheetId", "optional": true, "description": "The css style sheet identifier (absent for user agent stylesheet and user-specified stylesheet rules) this rule came from." },
                    { "name": "origin", "$ref": "StyleSheetOrigin", "description": "Parent stylesheet's origin."},
                    { "name": "keyText", "$ref": "Value", "description": "Associated key text." },
                    { "name": "style", "$ref": "CSSStyle", "description": "Associated style declaration." }
                ],
                "description": "CSS keyframe rule representation."
            },
            {
                "id": "StyleDeclarationEdit",
                "type": "object",
                "properties": [
                    { "name": "styleSheetId", "$ref": "StyleSheetId", "description": "The css style sheet identifier." },
                    { "name": "range", "$ref": "SourceRange", "description": "The range of the style text in the enclosing stylesheet." },
                    { "name": "text", "type": "string", "description": "New style text."}
                ],
                "description": "A descriptor of operation to mutate style declaration text."
            }
        ],
        "commands": [
            {
                "name": "enable",
                "async": true,
                "description": "Enables the CSS agent for the given page. Clients should not assume that the CSS agent has been enabled until the result of this command is received."
            },
            {
                "name": "disable",
                "description": "Disables the CSS agent for the given page."
            },
            {
                "name": "getMatchedStylesForNode",
                "parameters": [
                    { "name": "nodeId", "$ref": "DOM.NodeId" }
                ],
                "returns": [
                    { "name": "inlineStyle", "$ref": "CSSStyle", "optional": true, "description": "Inline style for the specified DOM node." },
                    { "name": "attributesStyle", "$ref": "CSSStyle", "optional": true, "description": "Attribute-defined element style (e.g. resulting from \"width=20 height=100%\")."},
                    { "name": "matchedCSSRules", "type": "array", "items": { "$ref": "RuleMatch" }, "optional": true, "description": "CSS rules matching this node, from all applicable stylesheets." },
                    { "name": "pseudoElements", "type": "array", "items": { "$ref": "PseudoElementMatches" }, "optional": true, "description": "Pseudo style matches for this node." },
                    { "name": "inherited", "type": "array", "items": { "$ref": "InheritedStyleEntry" }, "optional": true, "description": "A chain of inherited styles (from the immediate node parent up to the DOM tree root)." },
                    { "name": "cssKeyframesRules", "type": "array", "items": { "$ref": "CSSKeyframesRule" }, "optional": true, "description": "A list of CSS keyframed animations matching this node." }
                ],
                "description": "Returns requested styles for a DOM node identified by <code>nodeId</code>."
            },
            {
                "name": "getInlineStylesForNode",
                "parameters": [
                    { "name": "nodeId", "$ref": "DOM.NodeId" }
                ],
                "returns": [
                    { "name": "inlineStyle", "$ref": "CSSStyle", "optional": true, "description": "Inline style for the specified DOM node." },
                    { "name": "attributesStyle", "$ref": "CSSStyle", "optional": true, "description": "Attribute-defined element style (e.g. resulting from \"width=20 height=100%\")."}
                ],
                "description": "Returns the styles defined inline (explicitly in the \"style\" attribute and implicitly, using DOM attributes) for a DOM node identified by <code>nodeId</code>."
            },
            {
                "name": "getComputedStyleForNode",
                "parameters": [
                    { "name": "nodeId", "$ref": "DOM.NodeId" }
                ],
                "returns": [
                    { "name": "computedStyle", "type": "array", "items": { "$ref": "CSSComputedStyleProperty" }, "description": "Computed style for the specified DOM node." }
                ],
                "description": "Returns the computed style for a DOM node identified by <code>nodeId</code>."
            },
            {
                "name": "getPlatformFontsForNode",
                "parameters": [
                    { "name": "nodeId", "$ref": "DOM.NodeId" }
                ],
                "returns": [
                    { "name": "fonts", "type": "array", "items": { "$ref": "PlatformFontUsage" }, "description": "Usage statistics for every employed platform font." }
                ],
                "description": "Requests information about platform fonts which we used to render child TextNodes in the given node.",
                "hidden": true
            },
            {
                "name": "getStyleSheetText",
                "parameters": [
                    { "name": "styleSheetId", "$ref": "StyleSheetId" }
                ],
                "returns": [
                    { "name": "text", "type": "string", "description": "The stylesheet text." }
                ],
                "description": "Returns the current textual content and the URL for a stylesheet."
            },
            {
                "name": "setStyleSheetText",
                "parameters": [
                    { "name": "styleSheetId", "$ref": "StyleSheetId" },
                    { "name": "text", "type": "string" }
                ],
                "returns": [
                    { "name": "sourceMapURL", "type": "string", "optional": true, "description": "URL of source map associated with script (if any)." }
                ],
                "description": "Sets the new stylesheet text."
            },
            {
                "name": "setRuleSelector",
                "parameters": [
                    { "name": "styleSheetId", "$ref": "StyleSheetId" },
                    { "name": "range", "$ref": "SourceRange" },
                    { "name": "selector", "type": "string" }
                ],
                "returns": [
                    { "name": "selectorList", "$ref": "SelectorList", "description": "The resulting selector list after modification." }
                ],
                "description": "Modifies the rule selector."
            },
            {
                "name": "setKeyframeKey",
                "parameters": [
                    { "name": "styleSheetId", "$ref": "StyleSheetId" },
                    { "name": "range", "$ref": "SourceRange" },
                    { "name": "keyText", "type": "string" }
                ],
                "returns": [
                    { "name": "keyText", "$ref": "Value", "description": "The resulting key text after modification." }
                ],
                "description": "Modifies the keyframe rule key text."
            },
            {
                "name": "setStyleTexts",
                "parameters": [
                    { "name": "edits", "type": "array", "items": { "$ref": "StyleDeclarationEdit" }}
                ],
                "returns": [
                    { "name": "styles", "type": "array", "items": { "$ref": "CSSStyle" }, "description": "The resulting styles after modification." }
                ],
                "description": "Applies specified style edits one after another in the given order."
            },
            {
                "name": "setMediaText",
                "parameters": [
                    { "name": "styleSheetId", "$ref": "StyleSheetId" },
                    { "name": "range", "$ref": "SourceRange" },
                    { "name": "text", "type": "string" }
                ],
                "returns": [
                    { "name": "media", "$ref": "CSSMedia", "description": "The resulting CSS media rule after modification." }
                ],
                "description": "Modifies the rule selector."
            },
            {
                "name": "createStyleSheet",
                "parameters": [
                    { "name": "frameId", "$ref": "Page.FrameId", "description": "Identifier of the frame where \"via-inspector\" stylesheet should be created."}
                ],
                "returns": [
                    { "name": "styleSheetId", "$ref": "StyleSheetId", "description": "Identifier of the created \"via-inspector\" stylesheet." }
                ],
                "description": "Creates a new special \"via-inspector\" stylesheet in the frame with given <code>frameId</code>."
            },
            {
                "name": "addRule",
                "parameters": [
                    { "name": "styleSheetId", "$ref": "StyleSheetId", "description": "The css style sheet identifier where a new rule should be inserted." },
                    { "name": "ruleText", "type": "string", "description": "The text of a new rule." },
                    { "name": "location", "$ref": "SourceRange", "description": "Text position of a new rule in the target style sheet." }
                ],
                "returns": [
                    { "name": "rule", "$ref": "CSSRule", "description": "The newly created rule." }
                ],
                "description": "Inserts a new rule with the given <code>ruleText</code> in a stylesheet with given <code>styleSheetId</code>, at the position specified by <code>location</code>."
            },
            {
                "name": "forcePseudoState",
                "parameters": [
                    { "name": "nodeId", "$ref": "DOM.NodeId", "description": "The element id for which to force the pseudo state." },
                    { "name": "forcedPseudoClasses", "type": "array", "items": { "type": "string", "enum": ["active", "focus", "hover", "visited"] }, "description": "Element pseudo classes to force when computing the element's style." }
                ],
                "description": "Ensures that the given node will have specified pseudo-classes whenever its style is computed by the browser."
            },
            {
                "name": "getMediaQueries",
                "returns": [
                    { "name": "medias", "type": "array", "items": { "$ref": "CSSMedia" } }
                ],
                "description": "Returns all media queries parsed by the rendering engine.",
                "hidden": true
            },
            {
                "name": "setEffectivePropertyValueForNode",
                "parameters": [
                    { "name": "nodeId", "$ref": "DOM.NodeId", "description": "The element id for which to set property." },
                    { "name": "propertyName", "type": "string"},
                    { "name": "value", "type": "string"}
                ],
                "description": "Find a rule with the given active property for the given node and set the new value for this property",
                "hidden": true
            },
            {
                "name": "getBackgroundColors",
                "parameters": [
                    { "name": "nodeId", "$ref": "DOM.NodeId", "description": "Id of the node to get background colors for." }
                ],
                "returns": [
                    { "name": "backgroundColors", "type": "array", "items": { "type": "string" }, "description": "The range of background colors behind this element, if it contains any visible text. If no visible text is present, this will be undefined. In the case of a flat background color, this will consist of simply that color. In the case of a gradient, this will consist of each of the color stops. For anything more complicated, this will be an empty array. Images will be ignored (as if the image had failed to load).", "optional": true }
                ],
                "hidden": true
            }
        ],
        "events": [
            {
                "name": "mediaQueryResultChanged",
                "description": "Fires whenever a MediaQuery result changes (for example, after a browser window has been resized.) The current implementation considers only viewport-dependent media features."
            },
            {
                "name": "styleSheetChanged",
                "parameters": [
                    { "name": "styleSheetId", "$ref": "StyleSheetId" }
                ],
                "description": "Fired whenever a stylesheet is changed as a result of the client operation."
            },
            {
                "name": "styleSheetAdded",
                "parameters": [
                    { "name": "header", "$ref": "CSSStyleSheetHeader", "description": "Added stylesheet metainfo." }
                ],
                "description": "Fired whenever an active document stylesheet is added."
            },
            {
                "name": "styleSheetRemoved",
                "parameters": [
                    { "name": "styleSheetId", "$ref": "StyleSheetId", "description": "Identifier of the removed stylesheet." }
                ],
                "description": "Fired whenever an active document stylesheet is removed."
            },
            {
                "name": "layoutEditorChange",
                "parameters": [
                    { "name": "styleSheetId", "$ref": "StyleSheetId", "description": "Identifier of the stylesheet where the modification occurred." },
                    { "name": "changeRange", "$ref": "SourceRange", "description": "Range where the modification occurred." }
                ]
            }
        ]
    },
    {
        "domain": "IO",
        "description": "Input/Output operations for streams produced by DevTools.",
        "hidden": true,
        "types": [
            {
                "id": "StreamHandle",
                "type": "string"
            }
        ],
        "commands": [
            {
                "name": "read",
                "description": "Read a chunk of the stream",
                "async": true,
                "parameters": [
                    { "name": "handle", "$ref": "StreamHandle", "description": "Handle of the stream to read." },
                    { "name": "offset", "type": "integer", "optional": true, "description": "Seek to the specified offset before reading (if not specificed, proceed with offset following the last read)." },
                    { "name": "size", "type": "integer", "optional": true,  "description": "Maximum number of bytes to read (left upon the agent discretion if not specified)." }
                ],
                "returns": [
                    { "name": "data", "type": "string", "description": "Data that were read." },
                    { "name": "eof", "type": "boolean", "description": "Set if the end-of-file condition occured while reading." }
                ],
                "handlers": ["browser"]
            },
            {
                "name": "close",
                "description": "Close the stream, discard any temporary backing storage.",
                "parameters": [
                    { "name": "handle", "$ref": "StreamHandle", "description": "Handle of the stream to close." }
                ],
                "handlers": ["browser"]
            }
        ]
    },
    {
        "domain": "Debugger",
        "description": "Debugger domain exposes JavaScript debugging capabilities. It allows setting and removing breakpoints, stepping through execution, exploring stack traces, etc.",
        "types": [
            {
                "id": "BreakpointId",
                "type": "string",
                "description": "Breakpoint identifier."
            },
            {
                "id": "CallFrameId",
                "type": "string",
                "description": "Call frame identifier."
            },
            {
                "id": "Location",
                "type": "object",
                "properties": [
                    { "name": "scriptId", "$ref": "Runtime.ScriptId", "description": "Script identifier as reported in the <code>Debugger.scriptParsed</code>." },
                    { "name": "lineNumber", "type": "integer", "description": "Line number in the script (0-based)." },
                    { "name": "columnNumber", "type": "integer", "optional": true, "description": "Column number in the script (0-based)." }
                ],
                "description": "Location in the source code."
            },
            {
                "id": "ScriptPosition",
                "hidden": true,
                "type": "object",
                "properties": [
                    { "name": "line", "type": "integer" },
                    { "name": "column", "type": "integer" }
                ],
                "description": "Location in the source code."
            },
            {
                "id": "FunctionDetails",
                "hidden": true,
                "type": "object",
                "properties": [
                    { "name": "location", "$ref": "Location", "optional": true, "description": "Location of the function, none for native functions." },
                    { "name": "functionName", "type": "string", "description": "Name of the function." },
                    { "name": "isGenerator", "type": "boolean", "description": "Whether this is a generator function." },
                    { "name": "scopeChain", "type": "array", "optional": true, "items": { "$ref": "Scope" }, "description": "Scope chain for this closure." }
                ],
                "description": "Information about the function."
            },
            {
                "id": "GeneratorObjectDetails",
                "hidden": true,
                "type": "object",
                "properties": [
                    { "name": "function", "$ref": "Runtime.RemoteObject", "description": "Generator function." },
                    { "name": "functionName", "type": "string", "description": "Name of the generator function." },
                    { "name": "status", "type": "string", "enum": ["running", "suspended", "closed"], "description": "Current generator object status." },
                    { "name": "location", "$ref": "Location", "optional": true, "description": "If suspended, location where generator function was suspended (e.g. location of the last 'yield'). Otherwise, location of the generator function." }
                ],
                "description": "Information about the generator object."
            },
            {
                "id": "CollectionEntry",
                "hidden": true,
                "type": "object",
                "properties": [
                    { "name": "key", "$ref": "Runtime.RemoteObject", "optional": true, "description": "Entry key of a map-like collection, otherwise not provided." },
                    { "name": "value", "$ref": "Runtime.RemoteObject", "description": "Entry value." }
                ],
                "description": "Collection entry."
            },
            {
                "id": "CallFrame",
                "type": "object",
                "properties": [
                    { "name": "callFrameId", "$ref": "CallFrameId", "description": "Call frame identifier. This identifier is only valid while the virtual machine is paused." },
                    { "name": "functionName", "type": "string", "description": "Name of the JavaScript function called on this call frame." },
                    { "name": "functionLocation", "$ref": "Location", "optional": true, "hidden": true, "description": "Location in the source code." },
                    { "name": "location", "$ref": "Location", "description": "Location in the source code." },
                    { "name": "scopeChain", "type": "array", "items": { "$ref": "Scope" }, "description": "Scope chain for this call frame." },
                    { "name": "this", "$ref": "Runtime.RemoteObject", "description": "<code>this</code> object for this call frame." },
                    { "name": "returnValue", "$ref": "Runtime.RemoteObject", "optional": true, "hidden": true, "description": "The value being returned, if the function is at return point." }
                ],
                "description": "JavaScript call frame. Array of call frames form the call stack."
            },
            {
                "id": "Scope",
                "type": "object",
                "properties": [
                    { "name": "type", "type": "string", "enum": ["global", "local", "with", "closure", "catch", "block", "script"], "description": "Scope type." },
                    { "name": "object", "$ref": "Runtime.RemoteObject", "description": "Object representing the scope. For <code>global</code> and <code>with</code> scopes it represents the actual object; for the rest of the scopes, it is artificial transient object enumerating scope variables as its properties." },
                    { "name": "name", "type": "string", "optional": true, "hidden": true },
                    { "name": "startLocation", "$ref": "Location", "optional": true, "hidden": true, "description": "Location in the source code where scope starts" },
                    { "name": "endLocation", "$ref": "Location", "optional": true, "hidden": true, "description": "Location in the source code where scope ends" }
                ],
                "description": "Scope description."
            },
            {
                "id": "SetScriptSourceError",
                "type": "object",
                "properties": [
                    { "name": "message", "type": "string", "description": "Compiler error message" },
                    { "name": "lineNumber", "type": "integer", "description": "Compile error line number (1-based)" },
                    { "name": "columnNumber", "type": "integer", "description": "Compile error column number (1-based)" }
                ],
                "description": "Error data for setScriptSource command. Contains uncompilable script source error.",
                "hidden": true
            },
            {
                "id": "PromiseDetails",
                "type": "object",
                "description": "Information about the promise. All fields but id are optional and if present they reflect the new state of the property on the promise with given id.",
                "properties": [
                    { "name": "id", "type": "integer", "description": "Unique id of the promise." },
                    { "name": "status", "type": "string", "optional": true, "enum": ["pending", "resolved", "rejected"], "description": "Status of the promise." },
                    { "name": "parentId", "type": "integer", "optional": true, "description": "Id of the parent promise." },
                    { "name": "creationTime", "type": "number", "optional": true, "description": "Creation time of the promise." },
                    { "name": "settlementTime", "type": "number", "optional": true, "description": "Settlement time of the promise." },
                    { "name": "creationStack", "$ref": "Runtime.StackTrace", "optional": true, "description": "JavaScript stack trace on promise creation." },
                    { "name": "settlementStack", "$ref": "Runtime.StackTrace", "optional": true, "description": "JavaScript stack trace on promise settlement." }
                ],
                "hidden": true
            },
            {
                "id": "AsyncOperation",
                "type": "object",
                "description": "Information about the async operation.",
                "properties": [
                    { "name": "id", "type": "integer", "description": "Unique id of the async operation." },
                    { "name": "stack", "$ref": "Runtime.StackTrace", "optional": true, "description": "Stack trace where async operation was scheduled." }
                ],
                "hidden": true
            },
            {
                "id": "SearchMatch",
                "type": "object",
                "description": "Search match for resource.",
                "properties": [
                    { "name": "lineNumber", "type": "number", "description": "Line number in resource content." },
                    { "name": "lineContent", "type": "string", "description": "Line with match content." }
                ],
                "hidden": true
            }
        ],
        "commands": [
            {
                "name": "enable",
                "description": "Enables debugger for the given page. Clients should not assume that the debugging has been enabled until the result for this command is received."
            },
            {
                "name": "disable",
                "description": "Disables debugger for given page."
            },
            {
                "name": "setBreakpointsActive",
                "parameters": [
                    { "name": "active", "type": "boolean", "description": "New value for breakpoints active state." }
                ],
                "description": "Activates / deactivates all breakpoints on the page."
            },
            {
                "name": "setSkipAllPauses",
                "hidden": true,
                "parameters": [
                    { "name": "skipped", "type": "boolean", "description": "New value for skip pauses state." }
                ],
                "description": "Makes page not interrupt on any pauses (breakpoint, exception, dom exception etc)."
            },
            {
                "name": "setBreakpointByUrl",
                "parameters": [
                    { "name": "lineNumber", "type": "integer", "description": "Line number to set breakpoint at." },
                    { "name": "url", "type": "string", "optional": true, "description": "URL of the resources to set breakpoint on." },
                    { "name": "urlRegex", "type": "string", "optional": true, "description": "Regex pattern for the URLs of the resources to set breakpoints on. Either <code>url</code> or <code>urlRegex</code> must be specified." },
                    { "name": "columnNumber", "type": "integer", "optional": true, "description": "Offset in the line to set breakpoint at." },
                    { "name": "condition", "type": "string", "optional": true, "description": "Expression to use as a breakpoint condition. When specified, debugger will only stop on the breakpoint if this expression evaluates to true." }
                ],
                "returns": [
                    { "name": "breakpointId", "$ref": "BreakpointId", "description": "Id of the created breakpoint for further reference." },
                    { "name": "locations", "type": "array", "items": { "$ref": "Location" }, "description": "List of the locations this breakpoint resolved into upon addition." }
                ],
                "description": "Sets JavaScript breakpoint at given location specified either by URL or URL regex. Once this command is issued, all existing parsed scripts will have breakpoints resolved and returned in <code>locations</code> property. Further matching script parsing will result in subsequent <code>breakpointResolved</code> events issued. This logical breakpoint will survive page reloads."
            },
            {
                "name": "setBreakpoint",
                "parameters": [
                    { "name": "location", "$ref": "Location", "description": "Location to set breakpoint in." },
                    { "name": "condition", "type": "string", "optional": true, "description": "Expression to use as a breakpoint condition. When specified, debugger will only stop on the breakpoint if this expression evaluates to true." }
                ],
                "returns": [
                    { "name": "breakpointId", "$ref": "BreakpointId", "description": "Id of the created breakpoint for further reference." },
                    { "name": "actualLocation", "$ref": "Location", "description": "Location this breakpoint resolved into." }
                ],
                "description": "Sets JavaScript breakpoint at a given location."
            },
            {
                "name": "removeBreakpoint",
                "parameters": [
                    { "name": "breakpointId", "$ref": "BreakpointId" }
                ],
                "description": "Removes JavaScript breakpoint."
            },
            {
                "name": "continueToLocation",
                "parameters": [
                    { "name": "location", "$ref": "Location", "description": "Location to continue to." },
                    { "name": "interstatementLocation", "type": "boolean", "optional": true, "hidden": true, "description": "Allows breakpoints at the intemediate positions inside statements." }
                ],
                "description": "Continues execution until specific location is reached."
            },
            {
                "name": "stepOver",
                "description": "Steps over the statement."
            },
            {
                "name": "stepInto",
                "description": "Steps into the function call."
            },
            {
                "name": "stepOut",
                "description": "Steps out of the function call."
            },
            {
                "name": "pause",
                "description": "Stops on the next JavaScript statement."
            },
            {
                "name": "resume",
                "description": "Resumes JavaScript execution."
            },
            {
                "name": "stepIntoAsync",
                "description": "Steps into the first async operation handler that was scheduled by or after the current statement.",
                "hidden": true
            },
            {
                "name": "searchInContent",
                "parameters": [
                    { "name": "scriptId", "$ref": "Runtime.ScriptId", "description": "Id of the script to search in." },
                    { "name": "query", "type": "string", "description": "String to search for."  },
                    { "name": "caseSensitive", "type": "boolean", "optional": true, "description": "If true, search is case sensitive." },
                    { "name": "isRegex", "type": "boolean", "optional": true, "description": "If true, treats string parameter as regex." }
                ],
                "returns": [
                    { "name": "result", "type": "array", "items": { "$ref": "SearchMatch" }, "description": "List of search matches." }
                ],
                "description": "Searches for given string in script content."
            },
            {
                "name": "canSetScriptSource",
                "returns": [
                    { "name": "result", "type": "boolean", "description": "True if <code>setScriptSource</code> is supported." }
                ],
                "description": "Always returns true."
            },
            {
                "name": "setScriptSource",
                "parameters": [
                    { "name": "scriptId", "$ref": "Runtime.ScriptId", "description": "Id of the script to edit." },
                    { "name": "scriptSource", "type": "string", "description": "New content of the script." },
                    { "name": "preview", "type": "boolean", "optional": true, "description": " If true the change will not actually be applied. Preview mode may be used to get result description without actually modifying the code.", "hidden": true }
                ],
                "returns": [
                    { "name": "callFrames", "type": "array", "optional": true, "items": { "$ref": "CallFrame" }, "description": "New stack trace in case editing has happened while VM was stopped." },
                    { "name": "stackChanged", "type": "boolean", "optional": true, "description": "Whether current call stack  was modified after applying the changes.", "hidden": true },
                    { "name": "asyncStackTrace", "$ref": "Runtime.StackTrace", "optional": true, "description": "Async stack trace, if any.", "hidden": true },
                    { "name": "compileError", "optional": true, "$ref": "SetScriptSourceError", "description": "Error data if any." }
                ],
                "description": "Edits JavaScript source live."
            },
            {
                "name": "restartFrame",
                "parameters": [
                    { "name": "callFrameId", "$ref": "CallFrameId", "description": "Call frame identifier to evaluate on." }
                ],
                "returns": [
                    { "name": "callFrames", "type": "array", "items": { "$ref": "CallFrame" }, "description": "New stack trace." },
                    { "name": "asyncStackTrace", "$ref": "Runtime.StackTrace", "optional": true, "description": "Async stack trace, if any." }
                ],
                "hidden": true,
                "description": "Restarts particular call frame from the beginning."
            },
            {
                "name": "getScriptSource",
                "parameters": [
                    { "name": "scriptId", "$ref": "Runtime.ScriptId", "description": "Id of the script to get source for." }
                ],
                "returns": [
                    { "name": "scriptSource", "type": "string", "description": "Script source." }
                ],
                "description": "Returns source for the script with given id."
            },
            {
                "name": "getFunctionDetails",
                "hidden": true,
                "parameters": [
                    { "name": "functionId", "$ref": "Runtime.RemoteObjectId", "description": "Id of the function to get details for." }
                ],
                "returns": [
                    { "name": "details", "$ref": "FunctionDetails", "description": "Information about the function." }
                ],
                "description": "Returns detailed information on given function."
            },
            {
                "name": "getGeneratorObjectDetails",
                "hidden": true,
                "parameters": [
                    { "name": "objectId", "$ref": "Runtime.RemoteObjectId", "description": "Id of the generator object to get details for." }
                ],
                "returns": [
                    { "name": "details", "$ref": "GeneratorObjectDetails", "description": "Information about the generator object." }
                ],
                "description": "Returns detailed information on given generator object."
            },
            {
                "name": "getCollectionEntries",
                "hidden": true,
                "parameters": [
                    { "name": "objectId", "$ref": "Runtime.RemoteObjectId", "description": "Id of the collection to get entries for." }
                ],
                "returns": [
                    { "name": "entries", "type": "array", "items": { "$ref": "CollectionEntry" }, "description": "Array of collection entries." }
                ],
                "description": "Returns entries of given collection."
            },
            {
                "name": "setPauseOnExceptions",
                "parameters": [
                    { "name": "state", "type": "string", "enum": ["none", "uncaught", "all"], "description": "Pause on exceptions mode." }
                ],
                "description": "Defines pause on exceptions state. Can be set to stop on all exceptions, uncaught exceptions or no exceptions. Initial pause on exceptions state is <code>none</code>."
            },
            {
                "name": "evaluateOnCallFrame",
                "parameters": [
                    { "name": "callFrameId", "$ref": "CallFrameId", "description": "Call frame identifier to evaluate on." },
                    { "name": "expression", "type": "string", "description": "Expression to evaluate." },
                    { "name": "objectGroup", "type": "string", "optional": true, "description": "String object group name to put result into (allows rapid releasing resulting object handles using <code>releaseObjectGroup</code>)." },
                    { "name": "includeCommandLineAPI", "type": "boolean", "optional": true, "description": "Specifies whether command line API should be available to the evaluated expression, defaults to false.", "hidden": true },
                    { "name": "doNotPauseOnExceptionsAndMuteConsole", "type": "boolean", "optional": true, "description": "Specifies whether evaluation should stop on exceptions and mute console. Overrides setPauseOnException state.", "hidden": true },
                    { "name": "returnByValue", "type": "boolean", "optional": true, "description": "Whether the result is expected to be a JSON object that should be sent by value." },
                    { "name": "generatePreview", "type": "boolean", "optional": true, "hidden": true, "description": "Whether preview should be generated for the result." }
                ],
                "returns": [
                    { "name": "result", "$ref": "Runtime.RemoteObject", "description": "Object wrapper for the evaluation result." },
                    { "name": "wasThrown", "type": "boolean", "optional": true, "description": "True if the result was thrown during the evaluation." },
                    { "name": "exceptionDetails", "$ref": "Runtime.ExceptionDetails", "optional": true, "hidden": true, "description": "Exception details."}
                ],
                "description": "Evaluates expression on a given call frame."
            },
            {
                "name": "setVariableValue",
                "parameters": [
                    { "name": "scopeNumber", "type": "integer", "description": "0-based number of scope as was listed in scope chain. Only 'local', 'closure' and 'catch' scope types are allowed. Other scopes could be manipulated manually." },
                    { "name": "variableName", "type": "string", "description": "Variable name." },
                    { "name": "newValue", "$ref": "Runtime.CallArgument", "description": "New variable value." },
                    { "name": "callFrameId", "$ref": "CallFrameId", "optional": true, "description": "Id of callframe that holds variable." },
                    { "name": "functionObjectId", "$ref": "Runtime.RemoteObjectId", "optional": true, "description": "Object id of closure (function) that holds variable." }
                ],
                "hidden": true,
                "description": "Changes value of variable in a callframe or a closure. Either callframe or function must be specified. Object-based scopes are not supported and must be mutated manually."
            },
            {
                "name": "getStepInPositions",
                "parameters": [
                    { "name": "callFrameId", "$ref": "CallFrameId", "description": "Id of a call frame where the current statement should be analized" }
                ],
                "returns": [
                    { "name": "stepInPositions", "type": "array", "items": { "$ref": "Location" }, "optional": true, "description": "experimental" }
                ],
                "hidden": true,
                "description": "Lists all positions where step-in is possible for a current statement in a specified call frame"
            },
            {
                "name": "getBacktrace",
                "returns": [
                    { "name": "callFrames", "type": "array", "items": { "$ref": "CallFrame" }, "description": "Call stack the virtual machine stopped on." },
                    { "name": "asyncStackTrace", "$ref": "Runtime.StackTrace", "optional": true, "description": "Async stack trace, if any." }
                ],
                "hidden": true,
                "description": "Returns call stack including variables changed since VM was paused. VM must be paused."
            },
            {
                "name": "setAsyncCallStackDepth",
                "parameters": [
                    { "name": "maxDepth", "type": "integer", "description": "Maximum depth of async call stacks. Setting to <code>0</code> will effectively disable collecting async call stacks (default)." }
                ],
                "hidden": true,
                "description": "Enables or disables async call stacks tracking."
            },
            {
                "name": "enablePromiseTracker",
                "parameters": [
                    { "name": "captureStacks", "type": "boolean", "optional": true, "description": "Whether to capture stack traces for promise creation and settlement events (default: false)." }
                ],
                "hidden": true,
                "description": "Enables promise tracking, information about <code>Promise</code>s created or updated will now be stored on the backend."
            },
            {
                "name": "disablePromiseTracker",
                "hidden": true,
                "description": "Disables promise tracking."
            },
            {
                "name": "getPromiseById",
                "parameters": [
                    { "name": "promiseId", "type": "integer" },
                    { "name": "objectGroup", "type": "string", "optional": true, "description": "Symbolic group name that can be used to release multiple objects." }
                ],
                "returns": [
                    { "name": "promise", "$ref": "Runtime.RemoteObject", "description": "Object wrapper for <code>Promise</code> with specified ID, if any." }
                ],
                "hidden": true,
                "description": "Returns <code>Promise</code> with specified ID."
            },
            {
                "name": "flushAsyncOperationEvents",
                "hidden": true,
                "description": "Fires pending <code>asyncOperationStarted</code> events (if any), as if a debugger stepping session has just been started."
            },
            {
                "name": "setAsyncOperationBreakpoint",
                "parameters": [
                    { "name": "operationId", "type": "integer", "description": "ID of the async operation to set breakpoint for." }
                ],
                "hidden": true,
                "description": "Sets breakpoint on AsyncOperation callback handler."
            },
            {
                "name": "removeAsyncOperationBreakpoint",
                "parameters": [
                    { "name": "operationId", "type": "integer", "description": "ID of the async operation to remove breakpoint for." }
                ],
                "hidden": true,
                "description": "Removes AsyncOperation breakpoint."
            },
            {
                "name": "setBlackboxedRanges",
                "parameters": [
                    { "name": "scriptId", "$ref": "Runtime.ScriptId", "description": "Id of the script." },
                    { "name": "positions", "type": "array", "items": { "$ref": "ScriptPosition" } }
                ],
                "hidden": true,
                "description": "Makes backend skip steps in the script in blackboxed ranges. VM will try leave blacklisted scripts by performing 'step in' several times, finally resorting to 'step out' if unsuccessful. Positions array contains positions where blackbox state is changed. First interval isn't blackboxed. Array should be sorted."
            }
        ],
        "events": [
            {
                "name": "globalObjectCleared",
                "description": "Called when global has been cleared and debugger client should reset its state. Happens upon navigation or reload."
            },
            {
                "name": "scriptParsed",
                "parameters": [
                    { "name": "scriptId", "$ref": "Runtime.ScriptId", "description": "Identifier of the script parsed." },
                    { "name": "url", "type": "string", "description": "URL or name of the script parsed (if any)." },
                    { "name": "startLine", "type": "integer", "description": "Line offset of the script within the resource with given URL (for script tags)." },
                    { "name": "startColumn", "type": "integer", "description": "Column offset of the script within the resource with given URL." },
                    { "name": "endLine", "type": "integer", "description": "Last line of the script." },
                    { "name": "endColumn", "type": "integer", "description": "Length of the last line of the script." },
                    { "name": "executionContextId", "$ref": "Runtime.ExecutionContextId", "description": "Specifies script creation context.", "hidden": true },
                    { "name": "hash", "type": "string", "hidden": true, "description": "Content hash of the script."},
                    { "name": "isContentScript", "type": "boolean", "optional": true, "description": "Determines whether this script is a user extension script." },
                    { "name": "isInternalScript", "type": "boolean", "optional": true, "description": "Determines whether this script is an internal script.", "hidden": true },
                    { "name": "isLiveEdit", "type": "boolean", "optional": true, "description": "True, if this script is generated as a result of the live edit operation.", "hidden": true },
                    { "name": "sourceMapURL", "type": "string", "optional": true, "description": "URL of source map associated with script (if any)." },
                    { "name": "hasSourceURL", "type": "boolean", "optional": true, "description": "True, if this script has sourceURL.", "hidden": true },
                    { "name": "deprecatedCommentWasUsed", "type": "boolean", "optional": true, "hidden": true, "description": "True, if '//@ sourceURL' or '//@ sourceMappingURL' was used."}
                ],
                "description": "Fired when virtual machine parses script. This event is also fired for all known and uncollected scripts upon enabling debugger."
            },
            {
                "name": "scriptFailedToParse",
                "parameters": [
                    { "name": "scriptId", "$ref": "Runtime.ScriptId", "description": "Identifier of the script parsed." },
                    { "name": "url", "type": "string", "description": "URL or name of the script parsed (if any)." },
                    { "name": "startLine", "type": "integer", "description": "Line offset of the script within the resource with given URL (for script tags)." },
                    { "name": "startColumn", "type": "integer", "description": "Column offset of the script within the resource with given URL." },
                    { "name": "endLine", "type": "integer", "description": "Last line of the script." },
                    { "name": "endColumn", "type": "integer", "description": "Length of the last line of the script." },
                    { "name": "executionContextId", "$ref": "Runtime.ExecutionContextId", "description": "Specifies script creation context.", "hidden": true },
                    { "name": "hash", "type": "string", "hidden": true, "description": "Content hash of the script."},
                    { "name": "isContentScript", "type": "boolean", "optional": true, "description": "Determines whether this script is a user extension script." },
                    { "name": "isInternalScript", "type": "boolean", "optional": true, "description": "Determines whether this script is an internal script.", "hidden": true },
                    { "name": "sourceMapURL", "type": "string", "optional": true, "description": "URL of source map associated with script (if any)." },
                    { "name": "hasSourceURL", "type": "boolean", "optional": true, "description": "True, if this script has sourceURL.", "hidden": true },
                    { "name": "deprecatedCommentWasUsed", "type": "boolean", "optional": true, "hidden": true, "description": "True, if '//@ sourceURL' or '//@ sourceMappingURL' was used."}
                ],
                "description": "Fired when virtual machine fails to parse the script."
            },
            {
                "name": "breakpointResolved",
                "parameters": [
                    { "name": "breakpointId", "$ref": "BreakpointId", "description": "Breakpoint unique identifier." },
                    { "name": "location", "$ref": "Location", "description": "Actual breakpoint location." }
                ],
                "description": "Fired when breakpoint is resolved to an actual script and location."
            },
            {
                "name": "paused",
                "parameters": [
                    { "name": "callFrames", "type": "array", "items": { "$ref": "CallFrame" }, "description": "Call stack the virtual machine stopped on." },
                    { "name": "reason", "type": "string", "enum": [ "XHR", "DOM", "EventListener", "exception", "assert", "CSPViolation", "debugCommand", "promiseRejection", "AsyncOperation", "other" ], "description": "Pause reason." },
                    { "name": "data", "type": "object", "optional": true, "description": "Object containing break-specific auxiliary properties." },
                    { "name": "hitBreakpoints", "type": "array", "optional": true, "items": { "type": "string" }, "description": "Hit breakpoints IDs", "hidden": true },
                    { "name": "asyncStackTrace", "$ref": "Runtime.StackTrace", "optional": true, "description": "Async stack trace, if any.", "hidden": true }
                ],
                "description": "Fired when the virtual machine stopped on breakpoint or exception or any other stop criteria."
            },
            {
                "name": "resumed",
                "description": "Fired when the virtual machine resumed execution."
            },
            {
                "name": "promiseUpdated",
                "parameters": [
                    { "name": "eventType", "type": "string", "enum": ["new", "update", "gc"], "description": "Type of the event." },
                    { "name": "promise", "$ref": "PromiseDetails", "description": "Information about the updated <code>Promise</code>." }
                ],
                "description": "Fired when a <code>Promise</code> is created, updated or garbage collected.",
                "hidden": true
            },
            {
                "name": "asyncOperationStarted",
                "parameters": [
                    { "name": "operation", "$ref": "AsyncOperation", "description": "Information about the async operation." }
                ],
                "description": "Fired when an async operation is scheduled (while in a debugger stepping session).",
                "hidden": true
            },
            {
                "name": "asyncOperationCompleted",
                "parameters": [
                    { "name": "id", "type": "integer", "description": "ID of the async operation that was completed." }
                ],
                "description": "Fired when an async operation is completed (while in a debugger stepping session).",
                "hidden": true
            }
        ]
    },
    {
        "domain": "DOMDebugger",
        "description": "DOM debugging allows setting breakpoints on particular DOM operations and events. JavaScript execution will stop on these operations as if there was a regular breakpoint set.",
        "types": [
            {
                "id": "DOMBreakpointType",
                "type": "string",
                "enum": ["subtree-modified", "attribute-modified", "node-removed"],
                "description": "DOM breakpoint type."
            },
            {
                "id": "EventListener",
                "type": "object",
                "description": "Object event listener.",
                "properties": [
                    { "name": "type", "type": "string", "description": "<code>EventListener</code>'s type." },
                    { "name": "useCapture", "type": "boolean", "description": "<code>EventListener</code>'s useCapture." },
                    { "name": "location", "$ref": "Debugger.Location", "description": "Handler code location." },
                    { "name": "handler", "$ref": "Runtime.RemoteObject", "optional": true, "description": "Event handler function value." },
                    { "name": "originalHandler", "$ref": "Runtime.RemoteObject", "optional": true, "description": "Event original handler function value." }
                ],
                "hidden": true
            }
        ],
        "commands": [
            {
                "name": "setDOMBreakpoint",
                "parameters": [
                    { "name": "nodeId", "$ref": "DOM.NodeId", "description": "Identifier of the node to set breakpoint on." },
                    { "name": "type", "$ref": "DOMBreakpointType", "description": "Type of the operation to stop upon." }
                ],
                "description": "Sets breakpoint on particular operation with DOM."
            },
            {
                "name": "removeDOMBreakpoint",
                "parameters": [
                    { "name": "nodeId", "$ref": "DOM.NodeId", "description": "Identifier of the node to remove breakpoint from." },
                    { "name": "type", "$ref": "DOMBreakpointType", "description": "Type of the breakpoint to remove." }
                ],
                "description": "Removes DOM breakpoint that was set using <code>setDOMBreakpoint</code>."
            },
            {
                "name": "setEventListenerBreakpoint",
                "parameters": [
                    { "name": "eventName", "type": "string", "description": "DOM Event name to stop on (any DOM event will do)." },
                    { "name": "targetName", "type": "string", "optional": true, "description": "EventTarget interface name to stop on. If equal to <code>\"*\"</code> or not provided, will stop on any EventTarget.", "hidden": true }
                ],
                "description": "Sets breakpoint on particular DOM event."
            },
            {
                "name": "removeEventListenerBreakpoint",
                "parameters": [
                    { "name": "eventName", "type": "string", "description": "Event name." },
                    { "name": "targetName", "type": "string", "optional": true, "description": "EventTarget interface name.", "hidden": true }
                ],
                "description": "Removes breakpoint on particular DOM event."
            },
            {
                "name": "setInstrumentationBreakpoint",
                "parameters": [
                    { "name": "eventName", "type": "string", "description": "Instrumentation name to stop on." }
                ],
                "description": "Sets breakpoint on particular native event.",
                "hidden": true
            },
            {
                "name": "removeInstrumentationBreakpoint",
                "parameters": [
                    { "name": "eventName", "type": "string", "description": "Instrumentation name to stop on." }
                ],
                "description": "Removes breakpoint on particular native event.",
                "hidden": true
            },
            {
                "name": "setXHRBreakpoint",
                "parameters": [
                    { "name": "url", "type": "string", "description": "Resource URL substring. All XHRs having this substring in the URL will get stopped upon." }
                ],
                "description": "Sets breakpoint on XMLHttpRequest."
            },
            {
                "name": "removeXHRBreakpoint",
                "parameters": [
                    { "name": "url", "type": "string", "description": "Resource URL substring." }
                ],
                "description": "Removes breakpoint from XMLHttpRequest."
            },
            {
                "name": "getEventListeners",
                "hidden": true,
                "parameters": [
                    { "name": "objectId", "$ref": "Runtime.RemoteObjectId", "description": "Identifier of the object to return listeners for." }
                ],
                "returns": [
                    { "name": "listeners", "type": "array", "items": { "$ref": "EventListener" }, "description": "Array of relevant listeners." }
                ],
                "description": "Returns event listeners of the given object."
            }
        ]
    },
    {
        "domain": "Profiler",
        "hidden": true,
        "types": [
            {
                "id": "CPUProfileNode",
                "type": "object",
                "description": "CPU Profile node. Holds callsite information, execution statistics and child nodes.",
                "properties": [
                    { "name": "functionName", "type": "string", "description": "Function name." },
                    { "name": "scriptId", "$ref": "Runtime.ScriptId", "description": "Script identifier." },
                    { "name": "url", "type": "string", "description": "URL." },
                    { "name": "lineNumber", "type": "integer", "description": "1-based line number of the function start position." },
                    { "name": "columnNumber", "type": "integer", "description": "1-based column number of the function start position." },
                    { "name": "hitCount", "type": "integer", "description": "Number of samples where this node was on top of the call stack." },
                    { "name": "callUID", "type": "number", "description": "Call UID." },
                    { "name": "children", "type": "array", "items": { "$ref": "CPUProfileNode" }, "description": "Child nodes." },
                    { "name": "deoptReason", "type": "string", "description": "The reason of being not optimized. The function may be deoptimized or marked as don't optimize."},
                    { "name": "id", "type": "integer", "description": "Unique id of the node." },
                    { "name": "positionTicks", "type": "array", "items": { "$ref": "PositionTickInfo" }, "description": "An array of source position ticks." }
                ]
            },
            {
                "id": "CPUProfile",
                "type": "object",
                "description": "Profile.",
                "properties": [
                    { "name": "head", "$ref": "CPUProfileNode" },
                    { "name": "startTime", "type": "number", "description": "Profiling start time in seconds." },
                    { "name": "endTime", "type": "number", "description": "Profiling end time in seconds." },
                    { "name": "samples", "optional": true, "type": "array", "items": { "type": "integer" }, "description": "Ids of samples top nodes." },
                    { "name": "timestamps", "optional": true, "type": "array", "items": { "type": "number" }, "description": "Timestamps of the samples in microseconds." }
                ]
            },
            {
                "id": "PositionTickInfo",
                "type": "object",
                "description": "Specifies a number of samples attributed to a certain source position.",
                "properties": [
                    { "name": "line", "type": "integer", "description": "Source line number (1-based)." },
                    { "name": "ticks", "type": "integer", "description": "Number of samples attributed to the source line." }
                ]
            }
        ],
        "commands": [
            {
                "name": "enable"
            },
            {
                "name": "disable"
            },
            {
                "name": "setSamplingInterval",
                "parameters": [
                    { "name": "interval", "type": "integer", "description": "New sampling interval in microseconds." }
                ],
                "description": "Changes CPU profiler sampling interval. Must be called before CPU profiles recording started."
            },
            {
                "name": "start"
            },
            {
                "name": "stop",
                "returns": [
                    { "name": "profile", "$ref": "CPUProfile", "description": "Recorded profile." }
                ]
            }
        ],
        "events": [
            {
                "name": "consoleProfileStarted",
                "parameters": [
                    { "name": "id", "type": "string" },
                    { "name": "location", "$ref": "Debugger.Location", "description": "Location of console.profile()." },
                    { "name": "title", "type": "string", "optional": true, "description": "Profile title passed as argument to console.profile()." }

                ],
                "description": "Sent when new profile recodring is started using console.profile() call."
            },
            {
                "name": "consoleProfileFinished",
                "parameters": [
                    { "name": "id", "type": "string" },
                    { "name": "location", "$ref": "Debugger.Location", "description": "Location of console.profileEnd()." },
                    { "name": "profile", "$ref": "CPUProfile" },
                    { "name": "title", "type": "string", "optional": true, "description": "Profile title passed as argunet to console.profile()." }
                ]
            }
        ]
    },
    {
        "domain": "HeapProfiler",
        "hidden": true,
        "types": [
            {
                "id": "HeapSnapshotObjectId",
                "type": "string",
                "description": "Heap snapshot object id."
            },
            {
                "id": "SamplingHeapProfileNode",
                "type": "object",
                "description": "Sampling Heap Profile node. Holds callsite information, allocation statistics and child nodes.",
                "properties": [
                    { "name": "functionName", "type": "string", "description": "Function name." },
                    { "name": "scriptId", "$ref": "Runtime.ScriptId", "description": "Script identifier." },
                    { "name": "url", "type": "string", "description": "URL." },
                    { "name": "lineNumber", "type": "integer", "description": "1-based line number of the function start position." },
                    { "name": "columnNumber", "type": "integer", "description": "1-based column number of the function start position." },
                    { "name": "totalSize", "type": "number", "description": "Total allocations size in bytes." },
                    { "name": "children", "type": "array", "items": { "$ref": "SamplingHeapProfileNode" }, "description": "Child nodes." }
                ]
            },
            {
                "id": "SamplingHeapProfile",
                "type": "object",
                "description": "Profile.",
                "properties": [
                    { "name": "head", "$ref": "SamplingHeapProfileNode" }
                ]
            }
        ],
        "commands": [
            {
                "name": "enable"
            },
            {
                "name": "disable"
            },
            {
                "name": "startTrackingHeapObjects",
                "parameters": [
                    { "name": "trackAllocations", "type": "boolean", "optional": true }
                ]
            },
            {
                "name": "stopTrackingHeapObjects",
                "parameters": [
                    { "name": "reportProgress", "type": "boolean", "optional": true, "description": "If true 'reportHeapSnapshotProgress' events will be generated while snapshot is being taken when the tracking is stopped." }
                ]

            },
            {
                "name": "takeHeapSnapshot",
                "parameters": [
                    { "name": "reportProgress", "type": "boolean", "optional": true, "description": "If true 'reportHeapSnapshotProgress' events will be generated while snapshot is being taken." }
                ]
            },
            {
                "name": "collectGarbage"
            },
            {
                "name": "getObjectByHeapObjectId",
                "parameters": [
                    { "name": "objectId", "$ref": "HeapSnapshotObjectId" },
                    { "name": "objectGroup", "type": "string", "optional": true, "description": "Symbolic group name that can be used to release multiple objects." }
                ],
                "returns": [
                    { "name": "result", "$ref": "Runtime.RemoteObject", "description": "Evaluation result." }
                ]
            },
            {
                "name": "addInspectedHeapObject",
                "parameters": [
                    { "name": "heapObjectId", "$ref": "HeapSnapshotObjectId", "description": "Heap snapshot object id to be accessible by means of $x command line API." }
                ],
                "description": "Enables console to refer to the node with given id via $x (see Command Line API for more details $x functions)."
            },
            {
                "name": "getHeapObjectId",
                "parameters": [
                    { "name": "objectId", "$ref": "Runtime.RemoteObjectId", "description": "Identifier of the object to get heap object id for." }
                ],
                "returns": [
                    { "name": "heapSnapshotObjectId", "$ref": "HeapSnapshotObjectId", "description": "Id of the heap snapshot object corresponding to the passed remote object id." }
                ]
            },
            {
                "name": "startSampling"
            },
            {
                "name": "stopSampling",
                "returns": [
                    { "name": "profile", "$ref": "SamplingHeapProfile", "description": "Recorded sampling heap profile." }
                ]
            }
        ],
        "events": [
            {
                "name": "addHeapSnapshotChunk",
                "parameters": [
                    { "name": "chunk", "type": "string" }
                ]
            },
            {
                "name": "resetProfiles"
            },
            {
                "name": "reportHeapSnapshotProgress",
                "parameters": [
                    { "name": "done", "type": "integer" },
                    { "name": "total", "type": "integer" },
                    { "name": "finished", "type": "boolean", "optional": true }
                ]
            },
            {
                "name": "lastSeenObjectId",
                "description": "If heap objects tracking has been started then backend regulary sends a current value for last seen object id and corresponding timestamp. If the were changes in the heap since last event then one or more heapStatsUpdate events will be sent before a new lastSeenObjectId event.",
                "parameters": [
                    { "name": "lastSeenObjectId", "type": "integer" },
                    { "name": "timestamp", "type": "number" }
                ]
            },
            {
                "name": "heapStatsUpdate",
                "description": "If heap objects tracking has been started then backend may send update for one or more fragments",
                "parameters": [
                    { "name": "statsUpdate", "type": "array", "items": { "type": "integer" }, "description": "An array of triplets. Each triplet describes a fragment. The first integer is the fragment index, the second integer is a total count of objects for the fragment, the third integer is a total size of the objects for the fragment."}
                ]
            }
        ]
    },
    {
        "domain": "Worker",
        "hidden": true,
        "types": [],
        "commands": [
            {
                "name": "enable"
            },
            {
                "name": "disable"
            },
            {
                "name": "sendMessageToWorker",
                "parameters": [
                    { "name": "workerId", "type": "string" },
                    { "name": "message", "type": "string" }
                ]
            },
            {
                "name": "connectToWorker",
                "parameters": [
                    { "name": "workerId", "type": "string" }
                ]
            },
            {
                "name": "disconnectFromWorker",
                "parameters": [
                    { "name": "workerId", "type": "string" }
                ]
            },
            {
                "name": "setAutoconnectToWorkers",
                "parameters": [
                    { "name": "value", "type": "boolean" }
                ]
            }
        ],
        "events": [
            {
                "name": "workerCreated",
                "parameters": [
                    { "name": "workerId", "type": "string" },
                    { "name": "url", "type": "string" },
                    { "name": "inspectorConnected", "type": "boolean" }
                ]
            },
            {
                "name": "workerTerminated",
                "parameters": [
                    { "name": "workerId", "type": "string" }
                ]
            },
            {
                "name": "dispatchMessageFromWorker",
                "parameters": [
                    { "name": "workerId", "type": "string" },
                    { "name": "message", "type": "string" }
                ]
            }
        ]
    },
    {
        "domain": "ServiceWorker",
        "hidden": true,
        "types": [
            {
                "id": "ServiceWorkerRegistration",
                "type": "object",
                "description": "ServiceWorker registration.",
                "properties": [
                    { "name": "registrationId", "type": "string" },
                    { "name": "scopeURL", "type": "string" },
                    { "name": "isDeleted", "type": "boolean" },
                    { "name": "forceUpdateOnPageLoad", "type": "boolean", "optional": true }
                ]
            },
            {
                "id": "ServiceWorkerVersionRunningStatus",
                "type": "string",
                "enum": ["stopped", "starting", "running", "stopping"]
            },
            {
                "id": "ServiceWorkerVersionStatus",
                "type": "string",
                "enum": ["new", "installing", "installed", "activating", "activated", "redundant"]
            },
            {
                "id": "TargetID",
                "type": "string"
            },
            {
                "id": "ServiceWorkerVersion",
                "type": "object",
                "description": "ServiceWorker version.",
                "properties": [
                    { "name": "versionId", "type": "string" },
                    { "name": "registrationId", "type": "string" },
                    { "name": "scriptURL", "type": "string" },
                    { "name": "runningStatus", "$ref": "ServiceWorkerVersionRunningStatus" },
                    { "name": "status", "$ref": "ServiceWorkerVersionStatus" },
                    { "name": "scriptLastModified", "type": "number", "optional": true, "description": "The Last-Modified header value of the main script." },
                    { "name": "scriptResponseTime", "type": "number", "optional": true, "description": "The time at which the response headers of the main script were received from the server.  For cached script it is the last time the cache entry was validated." },
                    { "name": "controlledClients", "type": "array", "optional": true, "items": { "$ref": "TargetID" } }
                ]
            },
            {
                "id": "ServiceWorkerErrorMessage",
                "type": "object",
                "description": "ServiceWorker error message.",
                "properties": [
                    { "name": "errorMessage", "type": "string" },
                    { "name": "registrationId", "type": "string" },
                    { "name": "versionId", "type": "string" },
                    { "name": "sourceURL", "type": "string" },
                    { "name": "lineNumber", "type": "integer" },
                    { "name": "columnNumber", "type": "integer" }
                ]
            },
            {
                "id": "TargetInfo",
                "type": "object",
                "properties": [
                    { "name": "id", "$ref": "TargetID" },
                    { "name": "type", "type": "string" },
                    { "name": "title", "type": "string" },
                    { "name": "url", "type": "string" }
                ]
            }
        ],
        "commands": [
            {
                "name": "enable",
                "handlers": ["browser"]
            },
            {
                "name": "disable",
                "handlers": ["browser"]
            },
            {
                "name": "sendMessage",
                "parameters": [
                    { "name": "workerId", "type": "string" },
                    { "name": "message", "type": "string" }
                ],
                "handlers": ["browser"]
            },
            {
                "name": "stop",
                "parameters": [
                    { "name": "workerId", "type": "string" }
                ],
                "handlers": ["browser"]
            },
            {
                "name": "unregister",
                "parameters": [
                    { "name": "scopeURL", "type": "string" }
                ],
                "handlers": ["browser"]
            },
            {
                "name": "updateRegistration",
                "parameters": [
                    { "name": "scopeURL", "type": "string" }
                ],
                "handlers": ["browser"]
            },
            {
                "name": "startWorker",
                "parameters": [
                    { "name": "scopeURL", "type": "string" }
                ],
                "handlers": ["browser"]
            },
            {
                "name": "stopWorker",
                "parameters": [
                    { "name": "versionId", "type": "string" }
                ],
                "handlers": ["browser"]
            },
            {
                "name": "inspectWorker",
                "parameters": [
                    { "name": "versionId", "type": "string" }
                ],
                "handlers": ["browser"]
            },
            {
                "name": "setDebugOnStart",
                "parameters": [
                    { "name": "debugOnStart", "type": "boolean" }
                ],
                "handlers": ["browser"]
            },
            {
                "name": "setForceUpdateOnPageLoad",
                "parameters": [
                    { "name": "registrationId", "type": "string" },
                    { "name": "forceUpdateOnPageLoad", "type": "boolean" }
                ],
                "handlers": ["browser"]
            },
            {
                "name": "deliverPushMessage",
                "parameters": [
                    { "name": "origin", "type": "string" },
                    { "name": "registrationId", "type": "string" },
                    { "name": "data", "type": "string" }
                ],
                "handlers": ["browser"]
            },
            {
                "name": "getTargetInfo",
                "parameters": [
                    { "name": "targetId", "$ref": "TargetID" }
                ],
                "returns": [
                    { "name": "targetInfo","$ref": "TargetInfo" }
                ],
                "handlers": ["browser"]
            },
            {
                "name": "activateTarget",
                "parameters": [
                    { "name": "targetId", "$ref": "TargetID" }
                ],
                "handlers": ["browser"]
            }
        ],
        "events": [
            {
                "name": "workerCreated",
                "parameters": [
                    { "name": "workerId", "type": "string" },
                    { "name": "url", "type": "string" },
                    { "name": "versionId", "type": "string" }
                ],
                "handlers": ["browser"]
            },
            {
                "name": "workerTerminated",
                "parameters": [
                    { "name": "workerId", "type": "string" }
                ],
                "handlers": ["browser"]
            },
            {
                "name": "dispatchMessage",
                "parameters": [
                    { "name": "workerId", "type": "string" },
                    { "name": "message", "type": "string" }
                ],
                "handlers": ["browser"]
            },
            {
                "name": "workerRegistrationUpdated",
                "parameters": [
                    { "name": "registrations", "type": "array", "items": { "$ref": "ServiceWorkerRegistration" } }
                ],
                "handlers": ["browser"]
            },
            {
                "name": "workerVersionUpdated",
                "parameters": [
                    { "name": "versions", "type": "array", "items": { "$ref": "ServiceWorkerVersion" } }
                ],
                "handlers": ["browser"]
            },
            {
                "name": "workerErrorReported",
                "parameters": [
                    { "name": "errorMessage", "$ref": "ServiceWorkerErrorMessage" }
                ],
                "handlers": ["browser"]
            },
            {
                "name": "debugOnStartUpdated",
                "parameters": [
                    { "name": "debugOnStart", "type": "boolean" }
                ],
                "handlers": ["browser"]
            }
        ]
    },
    {
        "domain": "Input",
        "types": [
            {
                "id": "TouchPoint",
                "type": "object",
                "hidden": true,
                "properties": [
                    { "name": "state", "type": "string", "enum": ["touchPressed", "touchReleased", "touchMoved", "touchStationary", "touchCancelled"], "description": "State of the touch point." },
                    { "name": "x", "type": "integer", "description": "X coordinate of the event relative to the main frame's viewport."},
                    { "name": "y", "type": "integer", "description": "Y coordinate of the event relative to the main frame's viewport. 0 refers to the top of the viewport and Y increases as it proceeds towards the bottom of the viewport."},
                    { "name": "radiusX", "type": "integer", "optional": true, "description": "X radius of the touch area (default: 1)."},
                    { "name": "radiusY", "type": "integer", "optional": true, "description": "Y radius of the touch area (default: 1)."},
                    { "name": "rotationAngle", "type": "number", "optional": true, "description": "Rotation angle (default: 0.0)."},
                    { "name": "force", "type": "number", "optional": true, "description": "Force (default: 1.0)."},
                    { "name": "id", "type": "number", "optional": true, "description": "Identifier used to track touch sources between events, must be unique within an event."}
                ]
            },
            {
                "id": "GestureSourceType",
                "type": "string",
                "hidden": true,
                "enum": ["default", "touch", "mouse"]
            }
        ],
        "commands": [
            {
                "name": "dispatchKeyEvent",
                "parameters": [
                    { "name": "type", "type": "string", "enum": ["keyDown", "keyUp", "rawKeyDown", "char"], "description": "Type of the key event." },
                    { "name": "modifiers", "type": "integer", "optional": true, "description": "Bit field representing pressed modifier keys. Alt=1, Ctrl=2, Meta/Command=4, Shift=8 (default: 0)." },
                    { "name": "timestamp", "type": "number", "optional": true, "description": "Time at which the event occurred. Measured in UTC time in seconds since January 1, 1970 (default: current time)." },
                    { "name": "text", "type": "string", "optional": true, "description": "Text as generated by processing a virtual key code with a keyboard layout. Not needed for for <code>keyUp</code> and <code>rawKeyDown</code> events (default: \"\")" },
                    { "name": "unmodifiedText", "type": "string", "optional": true, "description": "Text that would have been generated by the keyboard if no modifiers were pressed (except for shift). Useful for shortcut (accelerator) key handling (default: \"\")." },
                    { "name": "keyIdentifier", "type": "string", "optional": true, "description": "Unique key identifier (e.g., 'U+0041') (default: \"\")." },
                    { "name": "code", "type": "string", "optional": true, "description": "Unique DOM defined string value for each physical key (e.g., 'KeyA') (default: \"\")." },
                    { "name": "key", "type": "string", "optional": true, "description": "Unique DOM defined string value describing the meaning of the key in the context of active modifiers, keyboard layout, etc (e.g., 'AltGr') (default: \"\")." },
                    { "name": "windowsVirtualKeyCode", "type": "integer", "optional": true, "description": "Windows virtual key code (default: 0)." },
                    { "name": "nativeVirtualKeyCode", "type": "integer", "optional": true, "description": "Native virtual key code (default: 0)." },
                    { "name": "autoRepeat", "type": "boolean", "optional": true, "description": "Whether the event was generated from auto repeat (default: false)." },
                    { "name": "isKeypad", "type": "boolean", "optional": true, "description": "Whether the event was generated from the keypad (default: false)." },
                    { "name": "isSystemKey", "type": "boolean", "optional": true, "description": "Whether the event was a system key event (default: false)." }
                ],
                "description": "Dispatches a key event to the page.",
                "handlers": ["browser"]
            },
            {
                "name": "dispatchMouseEvent",
                "parameters": [
                    { "name": "type", "type": "string", "enum": ["mousePressed", "mouseReleased", "mouseMoved"], "description": "Type of the mouse event." },
                    { "name": "x", "type": "integer", "description": "X coordinate of the event relative to the main frame's viewport."},
                    { "name": "y", "type": "integer", "description": "Y coordinate of the event relative to the main frame's viewport. 0 refers to the top of the viewport and Y increases as it proceeds towards the bottom of the viewport."},
                    { "name": "modifiers", "type": "integer", "optional": true, "description": "Bit field representing pressed modifier keys. Alt=1, Ctrl=2, Meta/Command=4, Shift=8 (default: 0)." },
                    { "name": "timestamp", "type": "number", "optional": true, "description": "Time at which the event occurred. Measured in UTC time in seconds since January 1, 1970 (default: current time)." },
                    { "name": "button", "type": "string", "enum": ["none", "left", "middle", "right"], "optional": true, "description": "Mouse button (default: \"none\")." },
                    { "name": "clickCount", "type": "integer", "optional": true, "description": "Number of times the mouse button was clicked (default: 0)." }
                ],
                "description": "Dispatches a mouse event to the page.",
                "handlers": ["browser"]
            },
            {
                "name": "dispatchTouchEvent",
                "hidden": true,
                "parameters": [
                    { "name": "type", "type": "string", "enum": ["touchStart", "touchEnd", "touchMove"], "description": "Type of the touch event." },
                    { "name": "touchPoints", "type": "array", "items": { "$ref": "TouchPoint" }, "description": "Touch points." },
                    { "name": "modifiers", "type": "integer", "optional": true, "description": "Bit field representing pressed modifier keys. Alt=1, Ctrl=2, Meta/Command=4, Shift=8 (default: 0)." },
                    { "name": "timestamp", "type": "number", "optional": true, "description": "Time at which the event occurred. Measured in UTC time in seconds since January 1, 1970 (default: current time)." }
                ],
                "description": "Dispatches a touch event to the page."
            },
            {
                "name": "emulateTouchFromMouseEvent",
                "hidden": true,
                "parameters": [
                    { "name": "type", "type": "string", "enum": ["mousePressed", "mouseReleased", "mouseMoved", "mouseWheel"], "description": "Type of the mouse event." },
                    { "name": "x", "type": "integer", "description": "X coordinate of the mouse pointer in DIP."},
                    { "name": "y", "type": "integer", "description": "Y coordinate of the mouse pointer in DIP."},
                    { "name": "timestamp", "type": "number", "description": "Time at which the event occurred. Measured in UTC time in seconds since January 1, 1970." },
                    { "name": "button", "type": "string", "enum": ["none", "left", "middle", "right"], "description": "Mouse button." },
                    { "name": "deltaX", "type": "number", "optional": true, "description": "X delta in DIP for mouse wheel event (default: 0)."},
                    { "name": "deltaY", "type": "number", "optional": true, "description": "Y delta in DIP for mouse wheel event (default: 0)."},
                    { "name": "modifiers", "type": "integer", "optional": true, "description": "Bit field representing pressed modifier keys. Alt=1, Ctrl=2, Meta/Command=4, Shift=8 (default: 0)." },
                    { "name": "clickCount", "type": "integer", "optional": true, "description": "Number of times the mouse button was clicked (default: 0)." }
                ],
                "description": "Emulates touch event from the mouse event parameters.",
                "handlers": ["browser"]
            },
            {
                "name": "synthesizePinchGesture",
                "async": true,
                "parameters": [
                    { "name": "x", "type": "integer", "description": "X coordinate of the start of the gesture in CSS pixels." },
                    { "name": "y", "type": "integer", "description": "Y coordinate of the start of the gesture in CSS pixels." },
                    { "name": "scaleFactor", "type": "number", "description": "Relative scale factor after zooming (>1.0 zooms in, <1.0 zooms out)." },
                    { "name": "relativeSpeed", "type": "integer", "optional": true, "description": "Relative pointer speed in pixels per second (default: 800)." },
                    { "name": "gestureSourceType", "$ref": "GestureSourceType", "optional": true, "description": "Which type of input events to be generated (default: 'default', which queries the platform for the preferred input type)." }
                ],
                "description": "Synthesizes a pinch gesture over a time period by issuing appropriate touch events.",
                "hidden": true,
                "handlers": ["browser"]
            },
            {
                "name": "synthesizeScrollGesture",
                "async": true,
                "parameters": [
                    { "name": "x", "type": "integer", "description": "X coordinate of the start of the gesture in CSS pixels." },
                    { "name": "y", "type": "integer", "description": "Y coordinate of the start of the gesture in CSS pixels." },
                    { "name": "xDistance", "type": "integer", "optional": true, "description": "The distance to scroll along the X axis (positive to scroll left)." },
                    { "name": "yDistance", "type": "integer", "optional": true, "description": "The distance to scroll along the Y axis (positive to scroll up)." },
                    { "name": "xOverscroll", "type": "integer", "optional": true, "description": "The number of additional pixels to scroll back along the X axis, in addition to the given distance." },
                    { "name": "yOverscroll", "type": "integer", "optional": true, "description": "The number of additional pixels to scroll back along the Y axis, in addition to the given distance." },
                    { "name": "preventFling", "type": "boolean", "optional": true, "description": "Prevent fling (default: true)." },
                    { "name": "speed", "type": "integer", "optional": true, "description": "Swipe speed in pixels per second (default: 800)." },
                    { "name": "gestureSourceType", "$ref": "GestureSourceType", "optional": true, "description": "Which type of input events to be generated (default: 'default', which queries the platform for the preferred input type)." },
                    { "name": "repeatCount", "type": "integer", "optional": true, "description": "The number of times to repeat the gesture (default: 0)." },
                    { "name": "repeatDelayMs", "type": "integer", "optional": true, "description": "The number of milliseconds delay between each repeat. (default: 250)." },
                    { "name": "interactionMarkerName", "type": "string", "optional": true, "description": "The name of the interaction markers to generate, if not empty (default: \"\")." }
                ],
                "description": "Synthesizes a scroll gesture over a time period by issuing appropriate touch events.",
                "hidden": true,
                "handlers": ["browser"]
            },
            {
                "name": "synthesizeTapGesture",
                "async": true,
                "parameters": [
                    { "name": "x", "type": "integer", "description": "X coordinate of the start of the gesture in CSS pixels." },
                    { "name": "y", "type": "integer", "description": "Y coordinate of the start of the gesture in CSS pixels." },
                    { "name": "duration", "type": "integer", "optional": true, "description": "Duration between touchdown and touchup events in ms (default: 50)." },
                    { "name": "tapCount", "type": "integer", "optional": true, "description": "Number of times to perform the tap (e.g. 2 for double tap, default: 1)." },
                    { "name": "gestureSourceType", "$ref": "GestureSourceType", "optional": true, "description": "Which type of input events to be generated (default: 'default', which queries the platform for the preferred input type)." }
                ],
                "description": "Synthesizes a tap gesture over a time period by issuing appropriate touch events.",
                "hidden": true,
                "handlers": ["browser"]
            }
        ],
        "events": []
    },
    {
        "domain": "LayerTree",
        "hidden": true,
        "types": [
            {
                "id": "LayerId",
                "type": "string",
                "description": "Unique Layer identifier."
            },
            {
                "id": "SnapshotId",
                "type": "string",
                "description": "Unique snapshot identifier."
            },
            {
                "id": "ScrollRect",
                "type": "object",
                "description": "Rectangle where scrolling happens on the main thread.",
                "properties": [
                    { "name": "rect", "$ref": "DOM.Rect", "description": "Rectangle itself." },
                    { "name": "type", "type": "string", "enum": ["RepaintsOnScroll", "TouchEventHandler", "WheelEventHandler"], "description": "Reason for rectangle to force scrolling on the main thread" }
                ]
            },
            {
                "id": "PictureTile",
                "type": "object",
                "description": "Serialized fragment of layer picture along with its offset within the layer.",
                "properties": [
                    { "name": "x", "type": "number", "description": "Offset from owning layer left boundary" },
                    { "name": "y", "type": "number", "description": "Offset from owning layer top boundary" },
                    { "name": "picture", "type": "string", "description": "Base64-encoded snapshot data." }
                ]
            },
            {
                "id": "Layer",
                "type": "object",
                "description": "Information about a compositing layer.",
                "properties": [
                    { "name": "layerId", "$ref": "LayerId", "description": "The unique id for this layer." },
                    { "name": "parentLayerId", "$ref": "LayerId", "optional": true, "description": "The id of parent (not present for root)." },
                    { "name": "backendNodeId", "$ref": "DOM.BackendNodeId", "optional": true, "description": "The backend id for the node associated with this layer." },
                    { "name": "offsetX", "type": "number", "description": "Offset from parent layer, X coordinate." },
                    { "name": "offsetY", "type": "number", "description": "Offset from parent layer, Y coordinate." },
                    { "name": "width", "type": "number", "description": "Layer width." },
                    { "name": "height", "type": "number", "description": "Layer height." },
                    { "name": "transform", "type": "array", "items": { "type": "number" }, "minItems": 16, "maxItems": 16, "optional": true, "description": "Transformation matrix for layer, default is identity matrix" },
                    { "name": "anchorX", "type": "number", "optional": true, "description": "Transform anchor point X, absent if no transform specified" },
                    { "name": "anchorY", "type": "number", "optional": true, "description": "Transform anchor point Y, absent if no transform specified" },
                    { "name": "anchorZ", "type": "number", "optional": true, "description": "Transform anchor point Z, absent if no transform specified" },
                    { "name": "paintCount", "type": "integer", "description": "Indicates how many time this layer has painted." },
                    { "name": "drawsContent", "type": "boolean", "description": "Indicates whether this layer hosts any content, rather than being used for transform/scrolling purposes only." },
                    { "name": "invisible", "type": "boolean", "optional": true, "description": "Set if layer is not visible." },
                    { "name": "scrollRects", "type": "array", "items": { "$ref": "ScrollRect"}, "optional": true, "description": "Rectangles scrolling on main thread only."}
                ]
            },
            {
                "id": "PaintProfile",
                "type": "array",
                "description": "Array of timings, one per paint step.",
                "items": {
                    "type": "number",
                    "description": "A time in seconds since the end of previous step (for the first step, time since painting started)"
                }
            }
        ],
        "commands": [
            {
                "name": "enable",
                "description": "Enables compositing tree inspection."
            },
            {
                "name": "disable",
                "description": "Disables compositing tree inspection."
            },
            {
                "name": "compositingReasons",
                "parameters": [
                    { "name": "layerId", "$ref": "LayerId", "description": "The id of the layer for which we want to get the reasons it was composited." }
                ],
                "description": "Provides the reasons why the given layer was composited.",
                "returns": [
                    { "name": "compositingReasons", "type": "array", "items": { "type": "string" }, "description": "A list of strings specifying reasons for the given layer to become composited." }
                ]
            },
            {
                "name": "makeSnapshot",
                "parameters": [
                    { "name": "layerId", "$ref": "LayerId", "description": "The id of the layer." }
                ],
                "description": "Returns the layer snapshot identifier.",
                "returns": [
                    { "name": "snapshotId", "$ref": "SnapshotId", "description": "The id of the layer snapshot." }
                ]
            },
            {
                "name": "loadSnapshot",
                "parameters": [
                    { "name": "tiles", "type": "array", "items": { "$ref": "PictureTile" }, "minItems": 1, "description": "An array of tiles composing the snapshot." }
                ],
                "description": "Returns the snapshot identifier.",
                "returns": [
                    { "name": "snapshotId", "$ref": "SnapshotId", "description": "The id of the snapshot." }
                ]
            },
            {
                "name": "releaseSnapshot",
                "parameters": [
                    { "name": "snapshotId", "$ref": "SnapshotId", "description": "The id of the layer snapshot." }
                ],
                "description": "Releases layer snapshot captured by the back-end."
            },
            {
                "name": "profileSnapshot",
                "parameters": [
                    { "name": "snapshotId", "$ref": "SnapshotId", "description": "The id of the layer snapshot." },
                    { "name": "minRepeatCount", "type": "integer", "optional": true, "description": "The maximum number of times to replay the snapshot (1, if not specified)." },
                    { "name": "minDuration", "type": "number", "optional": true, "description": "The minimum duration (in seconds) to replay the snapshot." },
                    { "name": "clipRect", "$ref": "DOM.Rect", "optional": true, "description": "The clip rectangle to apply when replaying the snapshot." }
                ],
                "returns": [
                    { "name": "timings", "type": "array", "items": { "$ref": "PaintProfile" }, "description": "The array of paint profiles, one per run." }
                ]
            },
            {
                "name": "replaySnapshot",
                "parameters": [
                    { "name": "snapshotId", "$ref": "SnapshotId", "description": "The id of the layer snapshot." },
                    { "name": "fromStep", "type": "integer", "optional": true, "description": "The first step to replay from (replay from the very start if not specified)." },
                    { "name": "toStep", "type": "integer", "optional": true, "description": "The last step to replay to (replay till the end if not specified)." },
                    { "name": "scale", "type": "number", "optional": true, "description": "The scale to apply while replaying (defaults to 1)." }
                ],
                "description": "Replays the layer snapshot and returns the resulting bitmap.",
                "returns": [
                    { "name": "dataURL", "type": "string", "description": "A data: URL for resulting image." }
                ]
            },
            {
                "name": "snapshotCommandLog",
                "parameters": [
                    { "name": "snapshotId", "$ref": "SnapshotId", "description": "The id of the layer snapshot." }
                ],
                "description": "Replays the layer snapshot and returns canvas log.",
                "returns": [
                    { "name": "commandLog", "type": "array", "items": { "type": "object" }, "description": "The array of canvas function calls." }
                ]
            }
        ],
        "events": [
            {
                "name": "layerTreeDidChange",
                "parameters": [
                    { "name": "layers", "type": "array", "items": { "$ref": "Layer" }, "optional": true, "description": "Layer tree, absent if not in the comspositing mode." }
                ]
            },
            {
                "name": "layerPainted",
                "parameters": [
                    { "name": "layerId", "$ref": "LayerId", "description": "The id of the painted layer." },
                    { "name": "clip", "$ref": "DOM.Rect", "description": "Clip rectangle." }
                ]
            }
        ]
    },
    {
        "domain": "DeviceOrientation",
        "hidden": true,
        "commands": [
            {
                "name": "setDeviceOrientationOverride",
                "description": "Overrides the Device Orientation.",
                "parameters": [
                    { "name": "alpha", "type": "number", "description": "Mock alpha"},
                    { "name": "beta", "type": "number", "description": "Mock beta"},
                    { "name": "gamma", "type": "number", "description": "Mock gamma"}
                ]
            },
            {
                "name": "clearDeviceOrientationOverride",
                "description": "Clears the overridden Device Orientation."
            }
        ]
    },
    {
        "domain": "Tracing",
        "commands": [
            {
                "name": "start",
                "async": true,
                "description": "Start trace events collection.",
                "parameters": [
                    { "name": "categories", "type": "string", "optional": true, "description": "Category/tag filter" },
                    { "name": "options", "type": "string", "optional": true, "description": "Tracing options" },
                    { "name": "bufferUsageReportingInterval", "type": "number", "optional": true, "description": "If set, the agent will issue bufferUsage events at this interval, specified in milliseconds" },
                    { "name": "transferMode", "type": "string", "enum": ["ReportEvents", "ReturnAsStream"], "optional": true, "description": "Whether to report trace events as series of dataCollected events or to save trace to a stream (defaults to <code>ReportEvents</code>)." }
                ],
                "handlers": ["browser", "renderer"]
            },
            {
                "name": "end",
                "async": true,
                "description": "Stop trace events collection.",
                "handlers": ["browser", "renderer"]
            },
            {
                "name": "getCategories",
                "async": true,
                "description": "Gets supported tracing categories.",
                "returns": [
                    { "name": "categories", "type": "array", "items": { "type": "string" }, "description": "A list of supported tracing categories." }
                ],
                "handlers": ["browser"]
            },
            {
                "name": "requestMemoryDump",
                "async": true,
                "description": "Request a global memory dump.",
                "returns": [
                    { "name": "dumpGuid", "type": "string", "description": "GUID of the resulting global memory dump." },
                    { "name": "success", "type": "boolean", "description": "True iff the global memory dump succeeded." }
                ],
                "handlers": ["browser"]
            },
            {
                "name": "recordClockSyncMarker",
                "description": "Record a clock sync marker in the trace.",
                "parameters": [
                    { "name": "syncId", "type": "string", "description": "The ID of this clock sync marker" }
                ],
                "handlers": ["browser"]
            }
        ],
        "events": [
            {
                "name": "dataCollected",
                "parameters": [
                    { "name": "value", "type": "array", "items": { "type": "object" } }
                ],
                "description": "Contains an bucket of collected trace events. When tracing is stopped collected events will be send as a sequence of dataCollected events followed by tracingComplete event.",
                "handlers": ["browser"]
            },
            {
                "name": "tracingComplete",
                "description": "Signals that tracing is stopped and there is no trace buffers pending flush, all data were delivered via dataCollected events.",
                "parameters": [
                    { "name": "stream", "$ref": "IO.StreamHandle", "optional": true, "description": "A handle of the stream that holds resulting trace data." }
                ],
                "handlers": ["browser"]
            },
            {
                "name": "bufferUsage",
                "parameters": [
                    { "name": "percentFull", "type": "number", "optional": true, "description": "A number in range [0..1] that indicates the used size of event buffer as a fraction of its total size." },
                    { "name": "eventCount", "type": "number", "optional": true, "description": "An approximate number of events in the trace log." },
                    { "name": "value", "type": "number", "optional": true, "description": "A number in range [0..1] that indicates the used size of event buffer as a fraction of its total size." }
                ],
                "handlers": ["browser"]
            }
        ]
    },
    {
        "domain": "Animation",
        "hidden": true,
        "types": [
            {
                "id": "Animation",
                "type": "object",
                "hidden": true,
                "properties": [
                    { "name": "id", "type": "string", "description": "<code>Animation</code>'s id." },
                    { "name": "name", "type": "string", "description": "<code>Animation</code>'s name." },
                    { "name": "pausedState", "type": "boolean", "hidden": "true", "description": "<code>Animation</code>'s internal paused state." },
                    { "name": "playState", "type": "string", "description": "<code>Animation</code>'s play state." },
                    { "name": "playbackRate", "type": "number", "description": "<code>Animation</code>'s playback rate." },
                    { "name": "startTime", "type": "number", "description": "<code>Animation</code>'s start time." },
                    { "name": "currentTime", "type": "number", "description": "<code>Animation</code>'s current time." },
                    { "name": "source", "$ref": "AnimationEffect", "description": "<code>Animation</code>'s source animation node." },
                    { "name": "type", "type": "string", "enum": ["CSSTransition", "CSSAnimation", "WebAnimation"], "description": "Animation type of <code>Animation</code>." },
                    { "name": "cssId", "type": "string", "optional": true, "description": "A unique ID for <code>Animation</code> representing the sources that triggered this CSS animation/transition."}
                ],
                "description": "Animation instance."
            },
            {
                "id": "AnimationEffect",
                "type": "object",
                "hidden": true,
                "properties": [
                    { "name": "delay", "type": "number", "description": "<code>AnimationEffect</code>'s delay." },
                    { "name": "endDelay", "type": "number", "description": "<code>AnimationEffect</code>'s end delay." },
                    { "name": "playbackRate", "type": "number", "description": "<code>AnimationEffect</code>'s playbackRate." },
                    { "name": "iterationStart", "type": "number", "description": "<code>AnimationEffect</code>'s iteration start." },
                    { "name": "iterations", "type": "number", "description": "<code>AnimationEffect</code>'s iterations." },
                    { "name": "duration", "type": "number", "description": "<code>AnimationEffect</code>'s iteration duration." },
                    { "name": "direction", "type": "string", "description": "<code>AnimationEffect</code>'s playback direction." },
                    { "name": "fill", "type": "string", "description": "<code>AnimationEffect</code>'s fill mode." },
                    { "name": "backendNodeId", "$ref": "DOM.BackendNodeId", "description": "<code>AnimationEffect</code>'s target node." },
                    { "name": "keyframesRule", "$ref": "KeyframesRule", "optional": true, "description": "<code>AnimationEffect</code>'s keyframes." },
                    { "name": "easing", "type": "string", "description": "<code>AnimationEffect</code>'s timing function." }
                ],
                "description": "AnimationEffect instance"
            },
            {
                "id": "KeyframesRule",
                "type": "object",
                "properties": [
                    { "name": "name", "type": "string", "optional": true, "description": "CSS keyframed animation's name." },
                    { "name": "keyframes", "type": "array", "items": { "$ref": "KeyframeStyle" }, "description": "List of animation keyframes." }
                ],
                "description": "Keyframes Rule"
            },
            {
                "id": "KeyframeStyle",
                "type": "object",
                "properties": [
                    { "name": "offset", "type": "string", "description": "Keyframe's time offset." },
                    { "name": "easing", "type": "string", "description": "<code>AnimationEffect</code>'s timing function." }
                ],
                "description": "Keyframe Style"
            }
        ],
        "commands": [
            {
                "name": "enable",
                "description": "Enables animation domain notifications."
            },
            {
                "name": "disable",
                "description": "Disables animation domain notifications."
            },
            {
                "name": "getPlaybackRate",
                "returns": [
                    { "name": "playbackRate", "type": "number", "description": "Playback rate for animations on page."}
                ],
                "description": "Gets the playback rate of the document timeline."
            },
            {
                "name": "setPlaybackRate",
                "parameters": [
                    { "name": "playbackRate", "type": "number", "description": "Playback rate for animations on page" }
                ],
                "description": "Sets the playback rate of the document timeline."
            },
            {
                "name": "getCurrentTime",
                "parameters": [
                    { "name": "id", "type": "string", "description": "Id of animation." }
                ],
                "returns": [
                    { "name": "currentTime", "type": "number", "description": "Current time of the page." }
                ],
                "description": "Returns the current time of the an animation."
            },
            {
                "name": "setPaused",
                "parameters": [
                    { "name": "animations", "type": "array", "items": { "type": "string" }, "description": "Animations to set the pause state of." },
                    { "name": "paused", "type": "boolean", "description": "Paused state to set to." }
                ],
                "description": "Sets the paused state of a set of animations."
            },
            {
                "name": "setTiming",
                "parameters": [
                    { "name": "animationId", "type": "string", "description": "Animation id." },
                    { "name": "duration", "type": "number", "description": "Duration of the animation." },
                    { "name": "delay", "type": "number", "description": "Delay of the animation." }
                ],
                "description": "Sets the timing of an animation node."
            },
            {
                "name": "seekAnimations",
                "parameters": [
                    { "name": "animations", "type": "array", "items": { "type": "string" }, "description": "List of animation ids to seek." },
                    { "name": "currentTime", "type": "number", "description": "Set the current time of each animation." }
                ],
                "description": "Seek a set of animations to a particular time within each animation."
            },
            {
                "name": "releaseAnimations",
                "parameters": [
                    { "name": "animations", "type": "array", "items": { "type": "string" }, "description": "List of animation ids to seek." }
                ],
                "description": "Releases a set of animations to no longer be manipulated."
            },
            {
                "name": "resolveAnimation",
                "parameters": [
                    { "name": "animationId", "type": "string", "description": "Animation id." }
                ],
                "returns": [
                    { "name": "remoteObject", "$ref": "Runtime.RemoteObject", "description": "Corresponding remote object." }
                ],
                "description": "Gets the remote object of the Animation."
            }
        ],
        "events": [
            {
                "name": "animationCreated",
                "parameters": [
                    { "name": "id", "type": "string", "description": "Id of the animation that was created." }
                ],
                "description": "Event for each animation that has been created."
            },
            {
                "name": "animationStarted",
                "parameters": [
                    { "name": "animation", "$ref": "Animation", "description": "Animation that was started." }
                ],
                "description": "Event for animation that has been started."
            },
            {
                "name": "animationCanceled",
                "parameters": [
                    { "name": "id", "type": "string", "description": "Id of the animation that was cancelled."}
                ],
                "description": "Event for when an animation has been cancelled."
            }
        ]
    },
    {
        "domain": "Accessibility",
        "hidden": true,
        "types": [
            {
                "id": "AXNodeId",
                "type": "string",
                "description": "Unique accessibility node identifier."
            },
            {
                "id": "AXValueType",
                "type": "string",
                "enum": [ "boolean", "tristate", "booleanOrUndefined", "idref", "idrefList", "integer", "node", "nodeList", "number", "string", "computedString", "token", "tokenList", "domRelation", "role", "internalRole", "valueUndefined" ],
                "description": "Enum of possible property types."
            },
            {
                "id": "AXValueSourceType",
                "type": "string",
                "enum": [ "attribute", "implicit", "style", "contents", "placeholder", "relatedElement" ],
                "description": "Enum of possible property sources."
            },
            { "id": "AXValueNativeSourceType",
              "type": "string",
              "enum": [ "figcaption", "label", "labelfor", "labelwrapped", "legend", "tablecaption", "title", "other" ],
              "description": "Enum of possible native property sources (as a subtype of a particular AXValueSourceType)."
            },
            {
                "id": "AXValueSource",
                "type": "object",
                "properties": [
                    { "name": "type", "$ref": "AXValueSourceType", "description": "What type of source this is." },
                    { "name": "value", "$ref": "AXValue", "description": "The value of this property source.", "optional": true },
                    { "name": "attribute", "type": "string", "description": "The name of the relevant attribute, if any.", "optional": true },
                    { "name": "attributeValue", "$ref": "AXValue", "description": "The value of the relevant attribute, if any.", "optional": true },
                    { "name": "superseded", "type": "boolean", "description": "Whether this source is superseded by a higher priority source.", "optional": true },
                    { "name": "nativeSource", "$ref": "AXValueNativeSourceType", "description": "The native markup source for this value, e.g. a <label> element.", "optional": true },
                    { "name": "nativeSourceValue", "$ref": "AXValue", "description": "The value, such as a node or node list, of the native source.", "optional": true },
                    { "name": "invalid", "type": "boolean", "description": "Whether the value for this property is invalid.", "optional": true },
                    { "name": "invalidReason", "type": "string", "description": "Reason for the value being invalid, if it is.", "optional": true }
                ],
                "description": "A single source for a computed AX property."
            },
            {
                "id": "AXRelatedNode",
                "type": "object",
                "properties": [
                    { "name": "backendNodeId", "$ref": "DOM.BackendNodeId", "description": "The BackendNodeId of the related node." },
                    { "name": "idref", "type": "string", "description": "The IDRef value provided, if any.", "optional": true },
                    { "name": "text", "type": "string", "description": "The text alternative of this node in the current context.", "optional": true }
                ]
            },
            {
                "id": "AXProperty",
                "type": "object",
                "properties": [
                    { "name": "name", "type": "string", "description": "The name of this property." },
                    { "name": "value", "$ref": "AXValue", "description": "The value of this property." }
                ]
            },
            {
                "id": "AXValue",
                "type": "object",
                "properties": [
                    { "name": "type", "$ref": "AXValueType", "description": "The type of this value." },

                    { "name": "value", "type": "any", "description": "The computed value of this property.", "optional": true },
                    { "name": "relatedNodes", "type": "array", "items": { "$ref": "AXRelatedNode" }, "description": "One or more related nodes, if applicable.", "optional": true },
                    { "name": "sources", "type": "array", "items": { "$ref": "AXValueSource" }, "description": "The sources which contributed to the computation of this property.", "optional": true }
                ],
                "description": "A single computed AX property."
            },
            {
                "id": "AXGlobalStates",
                "type": "string",
                "enum": [ "disabled", "hidden", "hiddenRoot", "invalid" ],
                "description": "States which apply to every AX node."
            },
            {
                "id": "AXLiveRegionAttributes",
                "type": "string",
                "enum": [ "live", "atomic", "relevant", "busy", "root" ],
                "description": "Attributes which apply to nodes in live regions."
            },
            {
                "id": "AXWidgetAttributes",
                "type": "string",
                "enum": [ "autocomplete", "haspopup", "level", "multiselectable", "orientation", "multiline", "readonly", "required", "valuemin", "valuemax", "valuetext" ],
                "Description": "Attributes which apply to widgets."
            },
            {
                "id": "AXWidgetStates",
                "type": "string",
                "enum": [ "checked", "expanded", "pressed", "selected" ],
                "description": "States which apply to widgets."
            },
            {
                "id": "AXRelationshipAttributes",
                "type": "string",
                "enum": [ "activedescendant", "flowto", "controls", "describedby", "labelledby", "owns" ],
                "description": "Relationships between elements other than parent/child/sibling."
            },
            {
                "id": "AXNode",
                "type": "object",
                "properties": [
                    { "name": "nodeId", "$ref": "AXNodeId", "description": "Unique identifier for this node." },
                    { "name": "ignored", "type": "boolean", "description": "Whether this node is ignored for accessibility" },
                    { "name": "ignoredReasons", "type": "array", "items": { "$ref": "AXProperty" }, "description": "Collection of reasons why this node is hidden.", "optional": true },
                    { "name": "role", "$ref": "AXValue", "description": "This <code>Node</code>'s role, whether explicit or implicit.", "optional": true},
                    { "name": "name", "$ref": "AXValue", "description": "The accessible name for this <code>Node</code>.", "optional": true },
                    { "name": "description", "$ref": "AXValue", "description": "The accessible description for this <code>Node</code>.", "optional": true },
                    { "name": "value", "$ref": "AXValue", "description": "The value for this <code>Node</code>.", "optional": true },
                    { "name": "properties", "type": "array", "items": { "$ref": "AXProperty" }, "description": "All other properties", "optional": true }
                ],
                "description": "A node in the accessibility tree."
            }
        ],
        "commands": [
            {
                "name": "getAXNode",
                "parameters": [
                    { "name": "nodeId", "$ref": "DOM.NodeId", "description": "ID of node to get accessibility node for." }
                ],
                "returns": [
                    { "name": "accessibilityNode", "$ref": "AXNode", "description": "The <code>Accessibility.AXNode</code> for this DOM node, if it exists.", "optional": true }
                ],
                "description": "Fetches the accessibility node for this DOM node, if it exists.",
                "hidden": true
            }
        ]
    }]
}
