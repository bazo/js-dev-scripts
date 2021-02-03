var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __commonJS = (callback, module) => () => {
  if (!module) {
    module = {exports: {}};
    callback(module.exports, module);
  }
  return module.exports;
};
var __exportStar = (target, module, desc) => {
  __markAsModule(target);
  if (module && typeof module === "object" || typeof module === "function") {
    for (let key of __getOwnPropNames(module))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module) => {
  if (module && module.__esModule)
    return module;
  return __exportStar(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", {value: module, enumerable: true}), module);
};

// node_modules/websocket-ts/lib/backoff/backoff.js
var require_backoff = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
});

// node_modules/websocket-ts/lib/backoff/constantbackoff.js
var require_constantbackoff = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.ConstantBackoff = void 0;
  var ConstantBackoff2 = function() {
    function ConstantBackoff3(backoff) {
      this.reset = function() {
      };
      this.backoff = backoff;
    }
    ConstantBackoff3.prototype.next = function() {
      return this.backoff;
    };
    return ConstantBackoff3;
  }();
  exports.ConstantBackoff = ConstantBackoff2;
});

// node_modules/websocket-ts/lib/backoff/exponentialbackoff.js
var require_exponentialbackoff = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.ExponentialBackoff = void 0;
  var ExponentialBackoff = function() {
    function ExponentialBackoff2(initial, expMax) {
      this.initial = initial;
      this.expMax = expMax;
      this.expCurrent = 1;
      this.current = this.initial;
    }
    ExponentialBackoff2.prototype.next = function() {
      var backoff = this.current;
      if (this.expMax > this.expCurrent++)
        this.current = this.current * 2;
      return backoff;
    };
    ExponentialBackoff2.prototype.reset = function() {
      this.expCurrent = 1;
      this.current = this.initial;
    };
    return ExponentialBackoff2;
  }();
  exports.ExponentialBackoff = ExponentialBackoff;
});

// node_modules/websocket-ts/lib/backoff/linearbackoff.js
var require_linearbackoff = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.LinearBackoff = void 0;
  var LinearBackoff = function() {
    function LinearBackoff2(initial, increment, maximum) {
      this.initial = initial;
      this.increment = increment;
      this.maximum = maximum;
      this.current = this.initial;
    }
    LinearBackoff2.prototype.next = function() {
      var backoff = this.current;
      var next = this.current + this.increment;
      if (this.maximum === void 0)
        this.current = next;
      else if (next <= this.maximum)
        this.current = next;
      return backoff;
    };
    LinearBackoff2.prototype.reset = function() {
      this.current = this.initial;
    };
    return LinearBackoff2;
  }();
  exports.LinearBackoff = LinearBackoff;
});

// node_modules/websocket-ts/lib/buffer/buffer.js
var require_buffer = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
});

// node_modules/websocket-ts/lib/buffer/lrubuffer.js
var require_lrubuffer = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.LRUBuffer = void 0;
  var LRUBuffer = function() {
    function LRUBuffer2(len) {
      this.writePtr = 0;
      this.wrapped = false;
      this.buffer = Array(len);
    }
    LRUBuffer2.prototype.len = function() {
      return this.wrapped ? this.buffer.length : this.writePtr;
    };
    LRUBuffer2.prototype.cap = function() {
      return this.buffer.length;
    };
    LRUBuffer2.prototype.read = function(es) {
      if (es === null || es === void 0 || es.length === 0 || this.buffer.length === 0)
        return 0;
      if (this.writePtr === 0 && !this.wrapped)
        return 0;
      var first = this.wrapped ? this.writePtr : 0;
      var last = first - 1 < 0 ? this.buffer.length - 1 : first - 1;
      for (var i = 0; i < es.length; i++) {
        var r = (first + i) % this.buffer.length;
        es[i] = this.buffer[r];
        if (r === last)
          return i + 1;
      }
      return es.length;
    };
    LRUBuffer2.prototype.write = function(es) {
      if (es === null || es === void 0 || es.length === 0 || this.buffer.length === 0)
        return 0;
      var start = es.length > this.buffer.length ? es.length - this.buffer.length : 0;
      for (var i = 0; i < es.length - start; i++) {
        this.buffer[this.writePtr] = es[start + i];
        this.writePtr = (this.writePtr + 1) % this.buffer.length;
        if (this.writePtr === 0)
          this.wrapped = true;
      }
      return es.length;
    };
    LRUBuffer2.prototype.forEach = function(fn) {
      if (this.writePtr === 0 && !this.wrapped)
        return 0;
      var cur = this.wrapped ? this.writePtr : 0;
      var last = this.wrapped ? cur - 1 < 0 ? this.buffer.length - 1 : cur - 1 : this.writePtr - 1;
      var len = this.len();
      while (true) {
        fn(this.buffer[cur]);
        if (cur === last)
          break;
        cur = (cur + 1) % this.buffer.length;
      }
      return len;
    };
    LRUBuffer2.prototype.clear = function() {
      this.writePtr = 0;
      this.wrapped = false;
    };
    return LRUBuffer2;
  }();
  exports.LRUBuffer = LRUBuffer;
});

// node_modules/websocket-ts/lib/buffer/timebuffer.js
var require_timebuffer = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.TimeBuffer = void 0;
  var TimeBuffer = function() {
    function TimeBuffer2(maxAge) {
      this.maxAge = maxAge;
    }
    TimeBuffer2.prototype.cap = function() {
      return Number.POSITIVE_INFINITY;
    };
    TimeBuffer2.prototype.len = function() {
      this.forwardTail();
      var cur = this.tail;
      var i = 0;
      while (cur !== void 0) {
        i++;
        cur = cur.n;
      }
      return i;
    };
    TimeBuffer2.prototype.read = function(es) {
      this.forwardTail();
      if (es.length === 0)
        return 0;
      var cur = this.tail;
      var i = 0;
      while (cur !== void 0) {
        es[i++] = cur.e;
        if (i === es.length)
          break;
        cur = cur.n;
      }
      return i;
    };
    TimeBuffer2.prototype.write = function(es) {
      for (var i = 0; i < es.length; i++)
        this.putElement(es[i]);
      return es.length;
    };
    TimeBuffer2.prototype.forEach = function(fn) {
      this.forwardTail();
      var cur = this.tail;
      var i = 0;
      while (cur !== void 0) {
        fn(cur.e);
        i++;
        cur = cur.n;
      }
      return i;
    };
    TimeBuffer2.prototype.putElement = function(e) {
      var newElement = {e, t: Date.now(), n: void 0};
      if (this.tail === void 0)
        this.tail = newElement;
      if (this.head === void 0)
        this.head = newElement;
      else {
        this.head.n = newElement;
        this.head = newElement;
      }
    };
    TimeBuffer2.prototype.forwardTail = function() {
      if (this.tail === void 0)
        return;
      var d = Date.now();
      while (d - this.tail.t > this.maxAge) {
        if (this.tail === this.head) {
          this.tail = void 0;
          this.head = void 0;
        } else
          this.tail = this.tail.n;
        if (this.tail === void 0)
          break;
      }
    };
    TimeBuffer2.prototype.clear = function() {
    };
    return TimeBuffer2;
  }();
  exports.TimeBuffer = TimeBuffer;
});

// node_modules/websocket-ts/lib/websocket.js
var require_websocket = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.Websocket = exports.WebsocketEvents = void 0;
  var WebsocketEvents;
  (function(WebsocketEvents2) {
    WebsocketEvents2["open"] = "open";
    WebsocketEvents2["close"] = "close";
    WebsocketEvents2["error"] = "error";
    WebsocketEvents2["message"] = "message";
    WebsocketEvents2["retry"] = "retry";
  })(WebsocketEvents = exports.WebsocketEvents || (exports.WebsocketEvents = {}));
  var Websocket = function() {
    function Websocket2(url, protocols, buffer, backoff) {
      var _this = this;
      this.eventListeners = {open: [], close: [], error: [], message: [], retry: []};
      this.closedByUser = false;
      this.retries = 0;
      this.handleOpenEvent = function(ev) {
        return _this.handleEvent(WebsocketEvents.open, ev);
      };
      this.handleCloseEvent = function(ev) {
        return _this.handleEvent(WebsocketEvents.close, ev);
      };
      this.handleErrorEvent = function(ev) {
        return _this.handleEvent(WebsocketEvents.error, ev);
      };
      this.handleMessageEvent = function(ev) {
        return _this.handleEvent(WebsocketEvents.message, ev);
      };
      this.url = url;
      this.protocols = protocols;
      this.buffer = buffer;
      this.backoff = backoff;
      this.tryConnect();
    }
    Object.defineProperty(Websocket2.prototype, "underlyingWebsocket", {
      get: function() {
        return this.websocket;
      },
      enumerable: false,
      configurable: true
    });
    Websocket2.prototype.send = function(data) {
      var _a;
      if (this.closedByUser)
        return;
      if (this.websocket === void 0 || this.websocket.readyState !== this.websocket.OPEN)
        (_a = this.buffer) === null || _a === void 0 ? void 0 : _a.write([data]);
      else
        this.websocket.send(data);
    };
    Websocket2.prototype.close = function(code, reason) {
      var _a;
      this.closedByUser = true;
      (_a = this.websocket) === null || _a === void 0 ? void 0 : _a.close(code, reason);
    };
    Websocket2.prototype.addEventListener = function(type, listener, options) {
      var eventListener = {listener, options};
      var eventListeners = this.eventListeners[type];
      eventListeners.push(eventListener);
    };
    Websocket2.prototype.removeEventListener = function(type, listener, options) {
      this.eventListeners[type] = this.eventListeners[type].filter(function(l) {
        return l.listener !== listener && (l.options === void 0 || l.options !== options);
      });
    };
    Websocket2.prototype.dispatchEvent = function(type, ev) {
      var _this = this;
      var listeners = this.eventListeners[type];
      var onceListeners = [];
      listeners.forEach(function(l) {
        l.listener(_this, ev);
        if (l.options !== void 0 && l.options.once)
          onceListeners.push(l);
      });
      onceListeners.forEach(function(l) {
        return _this.removeEventListener(type, l.listener, l.options);
      });
    };
    Websocket2.prototype.tryConnect = function() {
      if (this.websocket !== void 0) {
        this.websocket.removeEventListener(WebsocketEvents.open, this.handleOpenEvent);
        this.websocket.removeEventListener(WebsocketEvents.close, this.handleCloseEvent);
        this.websocket.removeEventListener(WebsocketEvents.error, this.handleErrorEvent);
        this.websocket.removeEventListener(WebsocketEvents.message, this.handleMessageEvent);
        this.websocket.close();
      }
      this.websocket = new WebSocket(this.url, this.protocols);
      this.websocket.addEventListener(WebsocketEvents.open, this.handleOpenEvent);
      this.websocket.addEventListener(WebsocketEvents.close, this.handleCloseEvent);
      this.websocket.addEventListener(WebsocketEvents.error, this.handleErrorEvent);
      this.websocket.addEventListener(WebsocketEvents.message, this.handleMessageEvent);
    };
    Websocket2.prototype.handleEvent = function(type, ev) {
      var _a, _b, _c;
      switch (type) {
        case WebsocketEvents.close:
          if (!this.closedByUser)
            this.reconnect();
          break;
        case WebsocketEvents.open:
          this.retries = 0;
          (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.reset();
          (_b = this.buffer) === null || _b === void 0 ? void 0 : _b.forEach(this.send.bind(this));
          (_c = this.buffer) === null || _c === void 0 ? void 0 : _c.clear();
          break;
      }
      this.dispatchEvent(type, ev);
    };
    Websocket2.prototype.reconnect = function() {
      var _this = this;
      if (this.backoff === void 0)
        return;
      var backoff = this.backoff.next();
      setTimeout(function() {
        _this.dispatchEvent(WebsocketEvents.retry, new CustomEvent(WebsocketEvents.retry, {
          detail: {
            retries: ++_this.retries,
            backoff
          }
        }));
        _this.tryConnect();
      }, backoff);
    };
    return Websocket2;
  }();
  exports.Websocket = Websocket;
});

// node_modules/websocket-ts/lib/websocketBuilder.js
var require_websocketBuilder = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.WebsocketBuilder = void 0;
  var websocket_1 = require_websocket();
  var WebsocketBuilder2 = function() {
    function WebsocketBuilder3(url) {
      this.ws = null;
      this.onOpenListeners = [];
      this.onCloseListeners = [];
      this.onErrorListeners = [];
      this.onMessageListeners = [];
      this.onRetryListeners = [];
      this.url = url;
    }
    WebsocketBuilder3.prototype.withProtocols = function(p) {
      this.protocols = p;
      return this;
    };
    WebsocketBuilder3.prototype.withBackoff = function(backoff) {
      this.backoff = backoff;
      return this;
    };
    WebsocketBuilder3.prototype.withBuffer = function(buffer) {
      this.buffer = buffer;
      return this;
    };
    WebsocketBuilder3.prototype.onOpen = function(listener, options) {
      this.onOpenListeners.push({listener, options});
      return this;
    };
    WebsocketBuilder3.prototype.onClose = function(listener, options) {
      this.onCloseListeners.push({listener, options});
      return this;
    };
    WebsocketBuilder3.prototype.onError = function(listener, options) {
      this.onErrorListeners.push({listener, options});
      return this;
    };
    WebsocketBuilder3.prototype.onMessage = function(listener, options) {
      this.onMessageListeners.push({listener, options});
      return this;
    };
    WebsocketBuilder3.prototype.onRetry = function(listener, options) {
      this.onRetryListeners.push({listener, options});
      return this;
    };
    WebsocketBuilder3.prototype.build = function() {
      var _this = this;
      if (this.ws !== null)
        return this.ws;
      this.ws = new websocket_1.Websocket(this.url, this.protocols, this.buffer, this.backoff);
      this.onOpenListeners.forEach(function(h) {
        var _a;
        return (_a = _this.ws) === null || _a === void 0 ? void 0 : _a.addEventListener(websocket_1.WebsocketEvents.open, h.listener, h.options);
      });
      this.onCloseListeners.forEach(function(h) {
        var _a;
        return (_a = _this.ws) === null || _a === void 0 ? void 0 : _a.addEventListener(websocket_1.WebsocketEvents.close, h.listener, h.options);
      });
      this.onErrorListeners.forEach(function(h) {
        var _a;
        return (_a = _this.ws) === null || _a === void 0 ? void 0 : _a.addEventListener(websocket_1.WebsocketEvents.error, h.listener, h.options);
      });
      this.onMessageListeners.forEach(function(h) {
        var _a;
        return (_a = _this.ws) === null || _a === void 0 ? void 0 : _a.addEventListener(websocket_1.WebsocketEvents.message, h.listener, h.options);
      });
      this.onRetryListeners.forEach(function(h) {
        var _a;
        return (_a = _this.ws) === null || _a === void 0 ? void 0 : _a.addEventListener(websocket_1.WebsocketEvents.retry, h.listener, h.options);
      });
      return this.ws;
    };
    return WebsocketBuilder3;
  }();
  exports.WebsocketBuilder = WebsocketBuilder2;
});

// node_modules/websocket-ts/lib/index.js
var require_lib = __commonJS((exports) => {
  "use strict";
  var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    Object.defineProperty(o, k2, {enumerable: true, get: function() {
      return m[k];
    }});
  } : function(o, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    o[k2] = m[k];
  });
  var __exportStar2 = exports && exports.__exportStar || function(m, exports2) {
    for (var p in m)
      if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
        __createBinding(exports2, m, p);
  };
  Object.defineProperty(exports, "__esModule", {value: true});
  __exportStar2(require_backoff(), exports);
  __exportStar2(require_constantbackoff(), exports);
  __exportStar2(require_exponentialbackoff(), exports);
  __exportStar2(require_linearbackoff(), exports);
  __exportStar2(require_buffer(), exports);
  __exportStar2(require_lrubuffer(), exports);
  __exportStar2(require_timebuffer(), exports);
  __exportStar2(require_websocket(), exports);
  __exportStar2(require_websocketBuilder(), exports);
});

// node_modules/nano-jsx/lib/types.js
var require_types = __commonJS(() => {
  "use strict";
});

// node_modules/nano-jsx/lib/core.js
var require_core = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.h = exports.renderComponent = exports._render = exports.render = exports.hydrate = exports.appendChildren = exports.strToHash = exports.removeAllChildNodes = exports.tick = void 0;
  exports.tick = typeof Promise == "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout;
  var removeAllChildNodes = (parent) => {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  };
  exports.removeAllChildNodes = removeAllChildNodes;
  var strToHash = (s) => {
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      const chr = s.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0;
    }
    return Math.abs(hash).toString(32);
  };
  exports.strToHash = strToHash;
  var appendChildren = (element, children) => {
    if (!Array.isArray(children)) {
      exports.appendChildren(element, [children]);
      return;
    }
    if (typeof children === "object")
      children = Array.prototype.slice.call(children);
    children.forEach((child) => {
      if (Array.isArray(child))
        exports.appendChildren(element, child);
      else {
        let c = exports._render(child);
        if (typeof c !== "undefined") {
          if (Array.isArray(c))
            exports.appendChildren(element, c);
          else
            element.appendChild(c.nodeType == null ? document.createTextNode(c.toString()) : c);
        }
      }
    });
  };
  exports.appendChildren = appendChildren;
  var SVG = (props) => {
    const child = props.children[0];
    const attrs = child.attributes;
    const svg = hNS("svg");
    for (let i = attrs.length - 1; i >= 0; i--) {
      svg.setAttribute(attrs[i].name, attrs[i].value);
    }
    svg.innerHTML = child.innerHTML;
    return svg;
  };
  var hydrate = (component, parent = null, removeChildNodes = true) => {
    return exports.render(component, parent, removeChildNodes);
  };
  exports.hydrate = hydrate;
  var render = (component, parent = null, removeChildNodes = true) => {
    let el = exports._render(component);
    if (Array.isArray(el)) {
      el = el.map((e) => exports._render(e));
      if (el.length === 1)
        el = el[0];
    }
    if (!!parent) {
      if (removeChildNodes)
        exports.removeAllChildNodes(parent);
      if (el && parent.id && parent.id === el.id && parent.parentElement) {
        parent.parentElement.replaceChild(el, parent);
      } else {
        if (Array.isArray(el))
          el.forEach((e) => {
            exports.appendChildren(parent, exports._render(e));
          });
        else
          exports.appendChildren(parent, exports._render(el));
      }
      if (parent.ssr)
        return parent.ssr;
      return parent;
    } else {
      if (typeof isSSR === "boolean" && isSSR === true && !Array.isArray(el))
        return [el];
      return el;
    }
  };
  exports.render = render;
  var _render = (comp) => {
    if (typeof comp === "undefined")
      return [];
    if (comp == null)
      return [];
    if (typeof comp === "string")
      return comp;
    if (typeof comp === "number")
      return comp.toString();
    if (comp.tagName && comp.tagName.toLowerCase() === "svg")
      return SVG({children: [comp]});
    if (comp.tagName)
      return comp;
    if (comp.component && comp.component.prototype && comp.component.prototype.constructor)
      return renderClassComponent(comp);
    if (comp.component && typeof comp.component === "function")
      return renderFunctionalComponent(comp);
    if (Array.isArray(comp))
      return comp.map((c) => exports._render(c)).flat();
    if (typeof comp === "function")
      return exports._render(comp());
    if (comp.component && comp.component.tagName && typeof comp.component.tagName === "string")
      return exports._render(comp.component);
    if (Array.isArray(comp.component))
      return exports._render(comp.component);
    if (comp.component)
      return exports._render(comp.component);
    if (typeof comp === "object")
      return [];
    console.warn("Something unexpected happened with:", comp);
  };
  exports._render = _render;
  var renderFunctionalComponent = (fncComp) => {
    const {component, props} = fncComp;
    let el = component(props);
    return exports._render(el);
  };
  var renderClassComponent = (classComp) => {
    const {component, props} = classComp;
    const hash = exports.strToHash(component.toString());
    component.prototype._getHash = () => hash;
    const Component2 = new component(props);
    Component2.willMount();
    let el = Component2.render();
    el = exports._render(el);
    Component2.elements = el;
    if (props && props.ref)
      props.ref(Component2);
    if (typeof isSSR === "undefined")
      exports.tick(() => {
        Component2._didMount();
      });
    return el;
  };
  var renderComponent = (_component) => {
    console.warn("DEPRECATED: renderComponent() is deprecated, use _render() instead!");
  };
  exports.renderComponent = renderComponent;
  var hNS = (tag) => document.createElementNS("http://www.w3.org/2000/svg", tag);
  var h = (tagNameOrComponent, props, ...children) => {
    if (typeof tagNameOrComponent !== "string")
      return {component: tagNameOrComponent, props: Object.assign(Object.assign({}, props), {children})};
    let ref;
    const element = tagNameOrComponent === "svg" ? hNS("svg") : document.createElement(tagNameOrComponent);
    const isEvent = (el, p) => {
      if (p.indexOf("on") !== 0)
        return false;
      if (el.ssr)
        return true;
      return typeof el[p] === "object" || typeof el[p] === "function";
    };
    for (const p in props) {
      if (p === "style" && typeof props[p] === "object") {
        const styles = Object.keys(props[p]).map((k) => `${k}:${props[p][k]}`).join(";").replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
        props[p] = styles + ";";
      }
      if (p === "ref")
        ref = props[p];
      else if (isEvent(element, p.toLowerCase()))
        element.addEventListener(p.toLowerCase().substring(2), (e) => props[p](e));
      else if (/className/i.test(p))
        console.warn('You can use "class" instead of "className".');
      else
        element.setAttribute(p, props[p]);
    }
    exports.appendChildren(element, children);
    if (ref)
      ref(element);
    if (element.ssr)
      return element.ssr;
    return element;
  };
  exports.h = h;
});

// node_modules/nano-jsx/lib/version.js
var require_version = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.VERSION = void 0;
  exports.VERSION = "0.0.15";
});

// node_modules/nano-jsx/lib/helpers.js
var require_helpers = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.printVersion = exports.onNodeRemove = exports.nodeToString = exports.task = void 0;
  var version_1 = require_version();
  var task = (task2) => setTimeout(task2, 0);
  exports.task = task;
  var nodeToString = (node) => {
    const tmpNode = document.createElement("div");
    tmpNode.appendChild(node.cloneNode(true));
    return tmpNode.innerHTML;
  };
  exports.nodeToString = nodeToString;
  var isDescendant = (desc, root) => {
    return !!desc && (desc === root || isDescendant(desc.parentNode, root));
  };
  var onNodeRemove = (element, callback) => {
    let observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        mutation.removedNodes.forEach((removed) => {
          if (isDescendant(element, removed)) {
            callback();
            if (observer) {
              observer.disconnect();
              observer = void 0;
            }
          }
        });
      });
    });
    observer.observe(document, {
      childList: true,
      subtree: true
    });
    return observer;
  };
  exports.onNodeRemove = onNodeRemove;
  var printVersion = () => {
    const info = `Powered by nano JSX v${version_1.VERSION}`;
    console.log(`%c %c %c %c %c ${info} %c http://nanojsx.io`, "background: #ff0000", "background: #ffff00", "background: #00ff00", "background: #00ffff", "color: #fff; background: #000000;", "background: none");
  };
  exports.printVersion = printVersion;
});

// node_modules/nano-jsx/lib/state.js
var require_state = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports._clearState = exports._state = void 0;
  exports._state = new Map();
  var _clearState = () => {
    exports._state.clear();
  };
  exports._clearState = _clearState;
});

// node_modules/nano-jsx/lib/component.js
var require_component = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.Component = void 0;
  var helpers_1 = require_helpers();
  var core_1 = require_core();
  var state_1 = require_state();
  var Component2 = class {
    constructor(props) {
      this.props = props;
      this._elements = [];
      this._skipUnmount = false;
      this._hasUnmounted = false;
      this.id = this._getHash();
    }
    setState(state, shouldUpdate = false) {
      const isObject = typeof state === "object" && state !== null;
      if (isObject && this.state !== void 0)
        this.state = Object.assign(Object.assign({}, this.state), state);
      else
        this.state = state;
      if (shouldUpdate)
        this.update();
    }
    set state(state) {
      state_1._state.set(this.id, state);
    }
    get state() {
      return state_1._state.get(this.id);
    }
    set initState(state) {
      if (this.state === void 0)
        this.state = state;
    }
    get elements() {
      return this._elements;
    }
    set elements(elements) {
      if (!Array.isArray(elements))
        elements = [elements];
      elements.forEach((element) => {
        this._elements.push(element);
      });
    }
    _addNodeRemoveListener() {
      if (/^[^{]+{\s+}$/gm.test(this.didUnmount.toString()))
        return;
      helpers_1.onNodeRemove(this.elements[0], () => {
        if (!this._skipUnmount)
          this._didUnmount();
      });
    }
    _didMount() {
      this._addNodeRemoveListener();
      this.didMount();
    }
    _didUnmount() {
      if (this._hasUnmounted)
        return;
      this.didUnmount();
      this._hasUnmounted = true;
    }
    willMount() {
    }
    didMount() {
    }
    didUnmount() {
    }
    render(_update) {
    }
    update(update) {
      this._skipUnmount = true;
      const oldElements = [...this.elements];
      this._elements = [];
      let el = this.render(update);
      el = core_1._render(el);
      this.elements = el;
      const parent = oldElements[0].parentElement;
      if (!parent)
        console.warn("Component needs a parent element to get updated!");
      this.elements.forEach((child) => {
        parent.insertBefore(child, oldElements[0]);
      });
      oldElements.forEach((child) => {
        child.remove();
        child = null;
      });
      this._addNodeRemoveListener();
      core_1.tick(() => {
        this._skipUnmount = false;
        if (!this.elements[0].isConnected)
          this._didUnmount();
      });
    }
    _getHash() {
    }
  };
  exports.Component = Component2;
});

// node_modules/nano-jsx/lib/components/helmet.js
var require_helmet = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.Helmet = void 0;
  var component_1 = require_component();
  var core_1 = require_core();
  var Helmet = class extends component_1.Component {
    static SSR(body) {
      const reg = /(<helmet\b[^>]*>)((.|\n)*?)(<\/helmet>)/gm;
      let head = [];
      let footer = [];
      if (typeof document !== "undefined" && document.head) {
        let children = [];
        children = document.head.children;
        for (let i = 0; i < children.length; i++) {
          if (head.indexOf(children[i]) === -1) {
            head.push(children[i]);
          }
        }
      }
      let result;
      while ((result = reg.exec(body)) !== null) {
        const first = result[1];
        const second = result[2];
        const toHead = first.includes('data-placement="head"');
        if (toHead && !head.includes(second))
          head.push(second);
        else if (!footer.includes(second))
          footer.push(second);
      }
      const cleanBody = body.replace(reg, "");
      return {body: cleanBody, head, footer};
    }
    didMount() {
      this.props.children.forEach((element) => {
        var _a, _b, _c, _d;
        let parent = this.props.footer ? document.body : document.head;
        let tag = element.tagName;
        let attrs = [];
        attrs.push(element.innerText);
        for (let attr = 0; attr < element.attributes.length; attr++) {
          attrs.push((_a = element.attributes.item(attr)) === null || _a === void 0 ? void 0 : _a.name.toLowerCase());
          attrs.push((_b = element.attributes.item(attr)) === null || _b === void 0 ? void 0 : _b.value.toLowerCase());
        }
        if (tag === "HTML" || tag === "BODY") {
          const htmlTag = document.getElementsByTagName(tag)[0];
          for (let attr = 1; attr < attrs.length; attr += 2) {
            htmlTag.setAttribute(attrs[attr], attrs[attr + 1]);
          }
          return;
        } else if (tag === "TITLE") {
          const titleTags = document.getElementsByTagName("TITLE");
          if (titleTags.length > 0) {
            let e = element;
            titleTags[0].text = e.text;
          } else {
            let titleTag = core_1.h("title", null, element.innerHTML);
            parent.appendChild(titleTag);
          }
          return;
        }
        let exists = false;
        attrs = attrs.sort();
        const el = document.getElementsByTagName(tag);
        for (let i = 0; i < el.length; i++) {
          let attrs2 = [];
          attrs2.push(el[i].innerText);
          for (let attr = 0; attr < el[i].attributes.length; attr++) {
            attrs2.push((_c = el[i].attributes.item(attr)) === null || _c === void 0 ? void 0 : _c.name.toLowerCase());
            attrs2.push((_d = el[i].attributes.item(attr)) === null || _d === void 0 ? void 0 : _d.value.toLowerCase());
          }
          attrs2 = attrs2.sort();
          if (attrs.length > 0 && attrs2.length > 0 && JSON.stringify(attrs) === JSON.stringify(attrs2))
            exists = true;
        }
        if (!exists)
          core_1.appendChildren(parent, element);
      });
    }
    render() {
      const placement = this.props.footer ? "footer" : "head";
      const ssr = globalThis && globalThis.isSSR ? true : false;
      if (ssr)
        return core_1.h("helmet", {"data-ssr": true, "data-placement": placement}, this.props.children);
      else
        return [];
    }
  };
  exports.Helmet = Helmet;
});

// node_modules/nano-jsx/lib/components/img.js
var require_img = __commonJS((exports) => {
  "use strict";
  var __rest = exports && exports.__rest || function(s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  };
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.Img = void 0;
  var component_1 = require_component();
  var core_1 = require_core();
  var Img = class extends component_1.Component {
    constructor(props) {
      super(props);
      const {src, key} = props;
      this.id = core_1.strToHash(src) + "-" + core_1.strToHash(JSON.stringify(props));
      if (key)
        this.id += "key-" + key;
      if (!this.state)
        this.setState({isLoaded: false, image: void 0});
    }
    didMount() {
      const _a = this.props, {lazy = true, placeholder, children, key, ref} = _a, rest = __rest(_a, ["lazy", "placeholder", "children", "key", "ref"]);
      if (typeof lazy === "boolean" && lazy === false)
        return;
      const observer = new IntersectionObserver((entries, observer2) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer2.disconnect();
            this.state.image = core_1.h("img", Object.assign({}, rest));
            if (this.state.image.complete) {
              this.state.isLoaded = true;
              this.update();
            } else {
              this.state.image.onload = () => {
                this.state.isLoaded = true;
                this.update();
              };
            }
          }
        });
      }, {threshold: [0, 1]});
      observer.observe(this.elements[0]);
    }
    render() {
      const _a = this.props, {src, placeholder, children, lazy = true, key, ref} = _a, rest = __rest(_a, ["src", "placeholder", "children", "lazy", "key", "ref"]);
      if (typeof lazy === "boolean" && lazy === false) {
        this.state.image = core_1.h("img", Object.assign({src}, rest));
        return this.state.image;
      }
      if (this.state.isLoaded) {
        return this.state.image;
      } else if (placeholder && typeof placeholder === "string") {
        return core_1.h("img", Object.assign({src: placeholder}, rest));
      } else if (placeholder && typeof placeholder === "function") {
        return placeholder();
      } else {
        const style = {};
        if (rest.width)
          style.width = rest.width + "px";
        if (rest.height)
          style.height = rest.height + "px";
        const {width, height} = rest, others = __rest(rest, ["width", "height"]);
        return core_1.h("div", Object.assign({style}, others));
      }
    }
  };
  exports.Img = Img;
});

// node_modules/nano-jsx/lib/fragment.js
var require_fragment = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.Fragment = void 0;
  var Fragment = (props) => {
    return props.children;
  };
  exports.Fragment = Fragment;
});

// node_modules/nano-jsx/lib/components/link.js
var require_link = __commonJS((exports) => {
  "use strict";
  var __rest = exports && exports.__rest || function(s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  };
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.Link = void 0;
  var component_1 = require_component();
  var helmet_1 = require_helmet();
  var core_1 = require_core();
  var fragment_1 = require_fragment();
  var Link = class extends component_1.Component {
    prefetchOnHover() {
      this.elements[0].addEventListener("mouseover", () => this.addPrefetch(), {once: true});
    }
    prefetchOnVisible() {
      const observer = new IntersectionObserver((entries, observer2) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer2.disconnect();
            this.addPrefetch();
          }
        });
      }, {threshold: [0, 1]});
      observer.observe(this.elements[0]);
    }
    addPrefetch() {
      let doesAlreadyExist = false;
      const links = document.getElementsByTagName("link");
      for (let i = 0; i < links.length; i++) {
        if (links[i].getAttribute("rel") === "prefetch" && links[i].getAttribute("href") === this.props.href) {
          doesAlreadyExist = true;
        }
      }
      if (!doesAlreadyExist) {
        const prefetch = core_1.h("link", {rel: "prefetch", href: this.props.href, as: "document"});
        document.head.appendChild(prefetch);
      }
    }
    didMount() {
      const {href, prefetch, delay = 0, back = false} = this.props;
      if (back)
        this.elements[0].addEventListener("click", (e) => {
          e.preventDefault();
          const target = e.target;
          if (target.href === document.referrer)
            window.history.back();
          else
            window.location.href = target.href;
        });
      if (delay > 0)
        this.elements[0].addEventListener("click", (e) => {
          e.preventDefault();
          setTimeout(() => window.location.href = href, delay);
        });
      if (prefetch) {
        if (prefetch === "hover")
          this.prefetchOnHover();
        else if (prefetch === "visible")
          this.prefetchOnVisible();
        else
          this.addPrefetch();
      }
    }
    render() {
      const _a = this.props, {children, prefetch, back, ref} = _a, rest = __rest(_a, ["children", "prefetch", "back", "ref"]);
      if (!this.props.href)
        console.warn('Please add "href" to <Link>');
      if (children.length !== 1)
        console.warn("Please add ONE child to <Link> (<Link>child</Link>)");
      const a = core_1.h("a", Object.assign({}, rest), ...children);
      if (prefetch === true && !(typeof window !== "undefined" && window.document)) {
        const link = core_1.h("link", {rel: "prefetch", href: this.props.href, as: "document"});
        const helmet = core_1.h(helmet_1.Helmet, null, link);
        return core_1.h(fragment_1.Fragment, null, [helmet, a]);
      } else {
        return a;
      }
    }
  };
  exports.Link = Link;
});

// node_modules/nano-jsx/lib/components/router.js
var require_router = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.Link = exports.to = exports.Route = exports.Switch = void 0;
  var component_1 = require_component();
  var core_1 = require_core();
  var instances = [];
  var register = (comp) => instances.push(comp);
  var unregister = (comp) => instances.splice(instances.indexOf(comp), 1);
  var historyPush = (path) => {
    window.history.pushState({}, "", path);
    instances.forEach((instance) => instance.handlePop());
  };
  var historyReplace = (path) => {
    window.history.replaceState({}, "", path);
    instances.forEach((instance) => instance.handlePop());
  };
  var matchPath = (pathname, options) => {
    const {exact = false, path} = options;
    if (!path) {
      return {
        path: null,
        url: pathname,
        isExact: true
      };
    }
    const match = path === "*" ? [pathname] : new RegExp(`^${path}`).exec(pathname);
    if (!match)
      return null;
    const url = match[0];
    const isExact = pathname === url;
    if (exact && !isExact)
      return null;
    return {
      path,
      url,
      isExact
    };
  };
  var Switch = class extends component_1.Component {
    constructor() {
      super(...arguments);
      this.path = "";
    }
    didMount() {
      register(this);
    }
    didUnmount() {
      unregister(this);
    }
    handlePop() {
      if (this.shouldUpdate())
        this.update();
    }
    shouldUpdate() {
      for (let i = 0; i < this.props.children.length; i++) {
        const child = this.props.children[i];
        const {path, exact} = child.props;
        const match = matchPath(window.location.pathname, {path, exact});
        if (match) {
          const found = this.path !== path;
          if (found)
            return true;
        }
      }
      return false;
    }
    render() {
      let component;
      this.props.children.forEach((child) => {
        const {path, exact} = child.props;
        const match = matchPath(isSSR ? _nano.location.pathname : window.location.pathname, {path, exact});
        if (match) {
          if (component && path === "*")
            return;
          component = child;
          this.path = path;
        }
      });
      if (component) {
        let el = core_1._render(component);
        return core_1._render(el);
      } else
        return core_1.h("div", {class: "route"}, "not found");
    }
  };
  exports.Switch = Switch;
  var Route = ({path, children}) => {
    children.forEach((child) => {
      if (child.props)
        child.props = Object.assign(Object.assign({}, child.props), {route: {path}});
    });
    return children;
  };
  exports.Route = Route;
  var to = (to2, replace = false) => {
    replace ? historyReplace(to2) : historyPush(to2);
  };
  exports.to = to;
  var Link = ({to: to2, replace, children}) => {
    const handleClick = (event) => {
      event.preventDefault();
      replace ? historyReplace(to2) : historyPush(to2);
    };
    return core_1.h("a", {href: to2, onClick: (e) => handleClick(e)}, children);
  };
  exports.Link = Link;
});

// node_modules/nano-jsx/lib/components/suspense.js
var require_suspense = __commonJS((exports) => {
  "use strict";
  var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __rest = exports && exports.__rest || function(s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  };
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.Suspense = void 0;
  var component_1 = require_component();
  var core_1 = require_core();
  var Suspense = class extends component_1.Component {
    constructor(props) {
      super(props);
      this.ready = false;
      const _a = this.props, {children, fallback, cache = false} = _a, rest = __rest(_a, ["children", "fallback", "cache"]);
      const str = JSON.stringify(rest, function(_key, val) {
        if (typeof val === "function")
          return val + "";
        return val;
      });
      this.id = core_1.strToHash(JSON.stringify(str));
    }
    didMount() {
      return __awaiter(this, void 0, void 0, function* () {
        const _a = this.props, {children, fallback, cache = false} = _a, rest = __rest(_a, ["children", "fallback", "cache"]);
        if (cache)
          this.initState = {};
        if (this.loadFromCache(cache))
          return;
        const promises = Object.values(rest).map((p) => p());
        const resolved = yield Promise.all(promises);
        const data = this.prepareData(rest, resolved, cache);
        this.addDataToChildren(data);
        this.ready = true;
        this.update();
      });
    }
    ssr() {
      const _a = this.props, {children, fallback, cache = false} = _a, rest = __rest(_a, ["children", "fallback", "cache"]);
      const functions = Object.values(rest).map((p) => p());
      const data = this.prepareData(rest, functions, false);
      this.addDataToChildren(data);
    }
    loadFromCache(cache) {
      const hasCachedProps = this.state && cache && Object.keys(this.state).length > 0;
      if (hasCachedProps) {
        this.addDataToChildren(this.state);
        this.ready = true;
      }
      return hasCachedProps;
    }
    prepareData(rest, fnc, cache) {
      const data = Object.keys(rest).reduce((obj, item, index) => {
        if (cache)
          this.state = Object.assign(Object.assign({}, this.state), {[item]: fnc[index]});
        return Object.assign(Object.assign({}, obj), {[item]: fnc[index]});
      }, {});
      return data;
    }
    addDataToChildren(data) {
      this.props.children.forEach((child) => {
        if (child.props)
          child.props = Object.assign(Object.assign({}, child.props), data);
      });
    }
    render() {
      if (typeof isSSR === "undefined") {
        const {cache = false} = this.props;
        this.loadFromCache(cache);
        return !this.ready ? this.props.fallback : this.props.children;
      } else {
        this.ssr();
        return this.props.children;
      }
    }
  };
  exports.Suspense = Suspense;
});

// node_modules/nano-jsx/lib/components/visible.js
var require_visible = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.Visible = void 0;
  var core_1 = require_core();
  var component_1 = require_component();
  var Visible = class extends component_1.Component {
    constructor() {
      super(...arguments);
      this.isVisible = false;
    }
    didMount() {
      const observer = new IntersectionObserver((entries, observer2) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer2.disconnect();
            this.isVisible = true;
            this.update();
          }
        });
      }, {threshold: [0, 1]});
      observer.observe(this.elements[0]);
    }
    render() {
      if (!this.isVisible) {
        return core_1.h("div", {"data-visible": false, visibility: "hidden"});
      } else {
        if (this.props.onVisible)
          this.props.onVisible();
        return core_1.render(this.props.component || this.props.children[0]);
      }
    }
  };
  exports.Visible = Visible;
});

// node_modules/nano-jsx/lib/components/index.js
var require_components = __commonJS((exports) => {
  "use strict";
  var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    Object.defineProperty(o, k2, {enumerable: true, get: function() {
      return m[k];
    }});
  } : function(o, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    o[k2] = m[k];
  });
  var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {enumerable: true, value: v});
  } : function(o, v) {
    o["default"] = v;
  });
  var __importStar = exports && exports.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.Visible = exports.Suspense = exports.Router = exports.Link = exports.Img = exports.Helmet = void 0;
  var helmet_1 = require_helmet();
  Object.defineProperty(exports, "Helmet", {enumerable: true, get: function() {
    return helmet_1.Helmet;
  }});
  var img_1 = require_img();
  Object.defineProperty(exports, "Img", {enumerable: true, get: function() {
    return img_1.Img;
  }});
  var link_1 = require_link();
  Object.defineProperty(exports, "Link", {enumerable: true, get: function() {
    return link_1.Link;
  }});
  exports.Router = __importStar(require_router());
  var suspense_1 = require_suspense();
  Object.defineProperty(exports, "Suspense", {enumerable: true, get: function() {
    return suspense_1.Suspense;
  }});
  var visible_1 = require_visible();
  Object.defineProperty(exports, "Visible", {enumerable: true, get: function() {
    return visible_1.Visible;
  }});
});

// node_modules/nano-jsx/lib/ssr.js
var require_ssr = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.DocumentSSR = exports.HTMLElementSSR = exports.renderSSR = exports.clearState = exports.initSSR = void 0;
  var core_1 = require_core();
  var state_1 = require_state();
  var detectSSR = () => {
    const isDeno = typeof Deno !== "undefined";
    const hasWindow = typeof window !== "undefined" ? true : false;
    return typeof isSSR !== "undefined" && isSSR || isDeno || !hasWindow;
  };
  globalThis.isSSR = detectSSR() === true ? true : void 0;
  globalThis._nano = {isSSR, location: {pathname: "/"}};
  var initSSR = (pathname = "/") => {
    _nano.location = {pathname};
    globalThis.document = isSSR ? new DocumentSSR() : window.document;
  };
  exports.initSSR = initSSR;
  var clearState = () => {
    state_1._state.clear();
  };
  exports.clearState = clearState;
  var renderSSR = (component, options = {}) => {
    const {pathname, clearState: clearState2 = true} = options;
    exports.initSSR(pathname);
    if (clearState2)
      state_1._state.clear();
    return core_1.render(component, null, true).join("");
  };
  exports.renderSSR = renderSSR;
  var HTMLElementSSR = class {
    constructor(tag) {
      this.isSelfClosing = false;
      this.tagName = tag;
      const selfClosing = [
        "area",
        "base",
        "br",
        "col",
        "embed",
        "hr",
        "img",
        "input",
        "link",
        "meta",
        "param",
        "source",
        "track",
        "wbr"
      ];
      if (selfClosing.indexOf(tag) >= 0) {
        this.ssr = `<${tag} />`;
        this.isSelfClosing = true;
      } else {
        this.ssr = `<${tag}></${tag}>`;
      }
    }
    get outerHTML() {
      return this.innerText;
    }
    get innerHTML() {
      var _a, _b;
      const reg = /(^<[a-z]+>)([\s\S]*)(<\/[a-z]+>$)/gm;
      return (_b = (_a = reg.exec(this.ssr)) === null || _a === void 0 ? void 0 : _a[2]) !== null && _b !== void 0 ? _b : "";
    }
    get innerText() {
      var _a, _b;
      const reg = /(^<[^>]+>)(.+)?(<\/[a-z]+>$|\/>$)/gm;
      return (_b = (_a = reg.exec(this.ssr)) === null || _a === void 0 ? void 0 : _a[2]) !== null && _b !== void 0 ? _b : "";
    }
    set innerText(text) {
      const reg = /(^<[^>]+>)(.+)?(<\/[a-z]+>$|\/>$)/gm;
      this.ssr = this.ssr.replace(reg, `$1${text}$3`);
    }
    get attributes() {
      return {length: 1};
    }
    setAttributeNS(name, value) {
      this.setAttribute(name, value);
    }
    setAttribute(name, value) {
      if (this.isSelfClosing)
        this.ssr = this.ssr.replace(/(^<[a-z]+ )(.+)/gm, `$1${name}="${value}" $2`);
      else
        this.ssr = this.ssr.replace(/(^<[^>]+)(.+)/gm, `$1 ${name}="${value}"$2`);
    }
    appendChild(child) {
      const append = child.ssr ? child.ssr : child;
      const index = this.ssr.lastIndexOf("</");
      this.ssr = this.ssr.substring(0, index) + append + this.ssr.substring(index);
    }
    replaceChild(newChild, _oldChild) {
      this.innerText = newChild.ssr;
    }
    get children() {
      const reg = /<([a-z]+)((?!<\/\1).)*<\/\1>/gms;
      const array = [];
      let match;
      while ((match = reg.exec(this.innerHTML)) !== null) {
        array.push(match[0].replace(/[\s]+/gm, " "));
      }
      return array;
    }
    addEventListener(_type, _listener, _options) {
    }
  };
  exports.HTMLElementSSR = HTMLElementSSR;
  var DocumentSSR = class {
    constructor() {
      this.body = this.createElement("body");
      this.head = this.createElement("head");
    }
    createElement(tag) {
      return new HTMLElementSSR(tag);
    }
    createElementNS(_URI, tag) {
      return new HTMLElementSSR(tag);
    }
    createTextNode(text) {
      return text;
    }
    querySelector(_query) {
      return void 0;
    }
  };
  exports.DocumentSSR = DocumentSSR;
});

// node_modules/nano-jsx/lib/htm/constants.js
var require_constants = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.MINI = void 0;
  exports.MINI = false;
});

// node_modules/nano-jsx/lib/htm/build.js
var require_build = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.build = exports.evaluate = exports.treeify = void 0;
  var constants_1 = require_constants();
  var MODE_SLASH = 0;
  var MODE_TEXT = 1;
  var MODE_WHITESPACE = 2;
  var MODE_TAGNAME = 3;
  var MODE_COMMENT = 4;
  var MODE_PROP_SET = 5;
  var MODE_PROP_APPEND = 6;
  var CHILD_APPEND = 0;
  var CHILD_RECURSE = 2;
  var TAG_SET = 3;
  var PROPS_ASSIGN = 4;
  var PROP_SET = MODE_PROP_SET;
  var PROP_APPEND = MODE_PROP_APPEND;
  var treeify = (built, fields) => {
    const _treeify = (built2) => {
      let tag = "";
      let currentProps = null;
      const props = [];
      const children2 = [];
      for (let i = 1; i < built2.length; i++) {
        const type = built2[i++];
        const value = built2[i] ? fields[built2[i++] - 1] : built2[++i];
        if (type === TAG_SET) {
          tag = value;
        } else if (type === PROPS_ASSIGN) {
          props.push(value);
          currentProps = null;
        } else if (type === PROP_SET) {
          if (!currentProps) {
            currentProps = Object.create(null);
            props.push(currentProps);
          }
          currentProps[built2[++i]] = [value];
        } else if (type === PROP_APPEND) {
          currentProps[built2[++i]].push(value);
        } else if (type === CHILD_RECURSE) {
          children2.push(_treeify(value));
        } else if (type === CHILD_APPEND) {
          children2.push(value);
        }
      }
      return {tag, props, children: children2};
    };
    const {children} = _treeify(built);
    return children.length > 1 ? children : children[0];
  };
  exports.treeify = treeify;
  var evaluate = (h, built, fields, args) => {
    let tmp;
    built[0] = 0;
    for (let i = 1; i < built.length; i++) {
      const type = built[i++];
      const value = built[i] ? (built[0] |= type ? 1 : 2, fields[built[i++]]) : built[++i];
      if (type === TAG_SET) {
        args[0] = value;
      } else if (type === PROPS_ASSIGN) {
        args[1] = Object.assign(args[1] || {}, value);
      } else if (type === PROP_SET) {
        ;
        (args[1] = args[1] || {})[built[++i]] = value;
      } else if (type === PROP_APPEND) {
        args[1][built[++i]] += value + "";
      } else if (type) {
        tmp = h.apply(value, exports.evaluate(h, value, fields, ["", null]));
        args.push(tmp);
        if (value[0]) {
          built[0] |= 2;
        } else {
          built[i - 2] = CHILD_APPEND;
          built[i] = tmp;
        }
      } else {
        args.push(value);
      }
    }
    return args;
  };
  exports.evaluate = evaluate;
  var build = function(statics) {
    const fields = arguments;
    const h = this;
    let mode = MODE_TEXT;
    let buffer = "";
    let quote = "";
    let current = [0];
    let char;
    let propName;
    const commit = (field) => {
      if (mode === MODE_TEXT && (field || (buffer = buffer.replace(/^\s*\n\s*|\s*\n\s*$/g, "")))) {
        if (constants_1.MINI) {
          current.push(field ? fields[field] : buffer);
        } else {
          current.push(CHILD_APPEND, field, buffer);
        }
      } else if (mode === MODE_TAGNAME && (field || buffer)) {
        if (constants_1.MINI) {
          current[1] = field ? fields[field] : buffer;
        } else {
          current.push(TAG_SET, field, buffer);
        }
        mode = MODE_WHITESPACE;
      } else if (mode === MODE_WHITESPACE && buffer === "..." && field) {
        if (constants_1.MINI) {
          current[2] = Object.assign(current[2] || {}, fields[field]);
        } else {
          current.push(PROPS_ASSIGN, field, 0);
        }
      } else if (mode === MODE_WHITESPACE && buffer && !field) {
        if (constants_1.MINI) {
          ;
          (current[2] = current[2] || {})[buffer] = true;
        } else {
          current.push(PROP_SET, 0, true, buffer);
        }
      } else if (mode >= MODE_PROP_SET) {
        if (constants_1.MINI) {
          if (mode === MODE_PROP_SET) {
            ;
            (current[2] = current[2] || {})[propName] = field ? buffer ? buffer + fields[field] : fields[field] : buffer;
            mode = MODE_PROP_APPEND;
          } else if (field || buffer) {
            current[2][propName] += field ? buffer + fields[field] : buffer;
          }
        } else {
          if (buffer || !field && mode === MODE_PROP_SET) {
            current.push(mode, 0, buffer, propName);
            mode = MODE_PROP_APPEND;
          }
          if (field) {
            current.push(mode, field, 0, propName);
            mode = MODE_PROP_APPEND;
          }
        }
      }
      buffer = "";
    };
    for (let i = 0; i < statics.length; i++) {
      if (i) {
        if (mode === MODE_TEXT) {
          commit();
        }
        commit(i);
      }
      for (let j = 0; j < statics[i].length; j++) {
        char = statics[i][j];
        if (mode === MODE_TEXT) {
          if (char === "<") {
            commit();
            if (constants_1.MINI) {
              current = [current, "", null];
            } else {
              current = [current];
            }
            mode = MODE_TAGNAME;
          } else {
            buffer += char;
          }
        } else if (mode === MODE_COMMENT) {
          if (buffer === "--" && char === ">") {
            mode = MODE_TEXT;
            buffer = "";
          } else {
            buffer = char + buffer[0];
          }
        } else if (quote) {
          if (char === quote) {
            quote = "";
          } else {
            buffer += char;
          }
        } else if (char === '"' || char === "'") {
          quote = char;
        } else if (char === ">") {
          commit();
          mode = MODE_TEXT;
        } else if (!mode) {
        } else if (char === "=") {
          mode = MODE_PROP_SET;
          propName = buffer;
          buffer = "";
        } else if (char === "/" && (mode < MODE_PROP_SET || statics[i][j + 1] === ">")) {
          commit();
          if (mode === MODE_TAGNAME) {
            current = current[0];
          }
          mode = current;
          if (constants_1.MINI) {
            ;
            (current = current[0]).push(h.apply(null, mode.slice(1)));
          } else {
            ;
            (current = current[0]).push(CHILD_RECURSE, 0, mode);
          }
          mode = MODE_SLASH;
        } else if (char === " " || char === "	" || char === "\n" || char === "\r") {
          commit();
          mode = MODE_WHITESPACE;
        } else {
          buffer += char;
        }
        if (mode === MODE_TAGNAME && buffer === "!--") {
          mode = MODE_COMMENT;
          current = current[0];
        }
      }
    }
    commit();
    if (constants_1.MINI) {
      return current.length > 2 ? current.slice(1) : current[1];
    }
    return current;
  };
  exports.build = build;
});

// node_modules/nano-jsx/lib/htm/index.js
var require_htm = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  var constants_1 = require_constants();
  var build_1 = require_build();
  var CACHES = new Map();
  var regular = function(statics) {
    let tmp = CACHES.get(this);
    if (!tmp) {
      tmp = new Map();
      CACHES.set(this, tmp);
    }
    tmp = build_1.evaluate(this, tmp.get(statics) || (tmp.set(statics, tmp = build_1.build(statics)), tmp), arguments, []);
    return tmp.length > 1 ? tmp : tmp[0];
  };
  exports.default = constants_1.MINI ? build_1.build : regular;
});

// node_modules/nano-jsx/lib/htm.js
var require_htm2 = __commonJS((exports) => {
  "use strict";
  var __importDefault = exports && exports.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {default: mod};
  };
  Object.defineProperty(exports, "__esModule", {value: true});
  var index_1 = __importDefault(require_htm());
  exports.default = index_1.default;
});

// node_modules/nano-jsx/lib/jsx.js
var require_jsx = __commonJS((exports) => {
  "use strict";
  var __importDefault = exports && exports.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {default: mod};
  };
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.jsx = void 0;
  var core_1 = require_core();
  var htm_1 = __importDefault(require_htm2());
  var jsx = htm_1.default.bind(core_1.h);
  exports.jsx = jsx;
});

// node_modules/nano-jsx/lib/lazy.js
var require_lazy = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.hydrateLazy = void 0;
  var core_1 = require_core();
  var visible_1 = require_visible();
  var hydrateLazy = (component, parent = null, removeChildNodes = true) => {
    const c = core_1.h(visible_1.Visible, null, component);
    return core_1.hydrate(c, parent, removeChildNodes);
  };
  exports.hydrateLazy = hydrateLazy;
});

// node_modules/nano-jsx/lib/store.js
var require_store = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.Store = void 0;
  var Store2 = class {
    constructor(defaultState, name = "", storage = "memory") {
      this._listeners = new Map();
      if (typeof isSSR !== "undefined")
        storage = "memory";
      this._id = name;
      this._storage = storage;
      this._state = this._prevState = defaultState;
      if (storage === "memory" || !storage)
        return;
      const Storage = storage === "local" ? localStorage : sessionStorage;
      const item = Storage.getItem(this._id);
      if (item) {
        this._state = this._prevState = JSON.parse(item);
      } else
        Storage.setItem(this._id, JSON.stringify(defaultState));
    }
    persist(newState) {
      if (this._storage === "memory")
        return;
      const Storage = this._storage === "local" ? localStorage : sessionStorage;
      Storage.setItem(this._id, JSON.stringify(newState));
    }
    clear() {
      this._state = this._prevState = void 0;
      if (this._storage === "local")
        localStorage.removeItem(this._id);
      else if (this._storage === "session")
        sessionStorage.removeItem(this._id);
    }
    setState(newState) {
      this.state = newState;
    }
    set state(newState) {
      this._prevState = this._state;
      this._state = newState;
      this.persist(newState);
      this._listeners.forEach((fnc) => {
        fnc(this._state, this._prevState);
      });
    }
    get state() {
      return this._state;
    }
    use() {
      const id = Math.random().toString(36).substr(2, 9);
      const _this = this;
      return {
        get state() {
          return _this.state;
        },
        setState: (newState) => {
          this.state = newState;
        },
        subscribe: (fnc) => {
          this._listeners.set(id, fnc);
        },
        cancel: () => {
          this._listeners.delete(id);
        }
      };
    }
  };
  exports.Store = Store2;
});

// node_modules/nano-jsx/lib/context.js
var require_context = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.createContext = void 0;
  var createContext = (ctx) => {
    let _ctx = ctx;
    return {
      Provider: (props) => {
        if (props.value)
          _ctx = props.value;
        return props.children;
      },
      Consumer: (props) => {
        return {component: props.children[0](_ctx), props: Object.assign(Object.assign({}, props), {context: _ctx})};
      },
      get: () => _ctx,
      set: (ctx2) => _ctx = ctx2
    };
  };
  exports.createContext = createContext;
});

// node_modules/nano-jsx/lib/withStyles.js
var require_withStyles = __commonJS((exports) => {
  "use strict";
  var __rest = exports && exports.__rest || function(s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  };
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.withStyles = void 0;
  var core_1 = require_core();
  var component_1 = require_component();
  var fragment_1 = require_fragment();
  var helmet_1 = require_helmet();
  var withStyles = (styles) => (WrappedComponent) => {
    return class extends component_1.Component {
      render() {
        const _a = this.props, {children} = _a, rest = __rest(_a, ["children"]);
        const helmet = core_1.h(helmet_1.Helmet, null, core_1.h("style", null, styles.toString()));
        const component = children && children.length > 0 ? core_1.h(WrappedComponent, Object.assign({}, rest), children) : core_1.h(WrappedComponent, Object.assign({}, this.props));
        return core_1.h(fragment_1.Fragment, null, helmet, component);
      }
    };
  };
  exports.withStyles = withStyles;
});

// node_modules/nano-jsx/lib/index.js
var require_lib2 = __commonJS((exports) => {
  "use strict";
  var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    Object.defineProperty(o, k2, {enumerable: true, get: function() {
      return m[k];
    }});
  } : function(o, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    o[k2] = m[k];
  });
  var __exportStar2 = exports && exports.__exportStar || function(m, exports2) {
    for (var p in m)
      if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
        __createBinding(exports2, m, p);
  };
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.VERSION = exports.printVersion = exports.withStyles = exports.createContext = exports.Store = exports.Fragment = exports.renderSSR = exports.task = exports.nodeToString = exports.hydrateLazy = exports.jsx = exports.Component = exports.tick = exports.hydrate = exports.render = exports.h = void 0;
  require_types();
  var core_1 = require_core();
  Object.defineProperty(exports, "h", {enumerable: true, get: function() {
    return core_1.h;
  }});
  Object.defineProperty(exports, "render", {enumerable: true, get: function() {
    return core_1.render;
  }});
  Object.defineProperty(exports, "hydrate", {enumerable: true, get: function() {
    return core_1.hydrate;
  }});
  Object.defineProperty(exports, "tick", {enumerable: true, get: function() {
    return core_1.tick;
  }});
  var component_1 = require_component();
  Object.defineProperty(exports, "Component", {enumerable: true, get: function() {
    return component_1.Component;
  }});
  __exportStar2(require_components(), exports);
  var core_2 = require_core();
  var ssr_1 = require_ssr();
  exports.default = {h: core_2.h, render: core_2.render, hydrate: core_2.hydrate, renderSSR: ssr_1.renderSSR};
  var jsx_1 = require_jsx();
  Object.defineProperty(exports, "jsx", {enumerable: true, get: function() {
    return jsx_1.jsx;
  }});
  var lazy_1 = require_lazy();
  Object.defineProperty(exports, "hydrateLazy", {enumerable: true, get: function() {
    return lazy_1.hydrateLazy;
  }});
  var helpers_1 = require_helpers();
  Object.defineProperty(exports, "nodeToString", {enumerable: true, get: function() {
    return helpers_1.nodeToString;
  }});
  Object.defineProperty(exports, "task", {enumerable: true, get: function() {
    return helpers_1.task;
  }});
  var ssr_2 = require_ssr();
  Object.defineProperty(exports, "renderSSR", {enumerable: true, get: function() {
    return ssr_2.renderSSR;
  }});
  var fragment_1 = require_fragment();
  Object.defineProperty(exports, "Fragment", {enumerable: true, get: function() {
    return fragment_1.Fragment;
  }});
  var store_1 = require_store();
  Object.defineProperty(exports, "Store", {enumerable: true, get: function() {
    return store_1.Store;
  }});
  var context_1 = require_context();
  Object.defineProperty(exports, "createContext", {enumerable: true, get: function() {
    return context_1.createContext;
  }});
  var withStyles_1 = require_withStyles();
  Object.defineProperty(exports, "withStyles", {enumerable: true, get: function() {
    return withStyles_1.withStyles;
  }});
  var helpers_2 = require_helpers();
  Object.defineProperty(exports, "printVersion", {enumerable: true, get: function() {
    return helpers_2.printVersion;
  }});
  var version_1 = require_version();
  Object.defineProperty(exports, "VERSION", {enumerable: true, get: function() {
    return version_1.VERSION;
  }});
});

// node_modules/panic-overlay/build/panic-overlay.browser.js
(function() {
  function r(e, n, t) {
    function o(i2, f) {
      if (!n[i2]) {
        if (!e[i2]) {
          var c = false;
          if (!f && c)
            return c(i2, true);
          if (u)
            return u(i2, true);
          var a = new Error("Cannot find module '" + i2 + "'");
          throw a.code = "MODULE_NOT_FOUND", a;
        }
        var p = n[i2] = {exports: {}};
        e[i2][0].call(p.exports, function(r2) {
          var n2 = e[i2][1][r2];
          return o(n2 || r2);
        }, p, p.exports, r, e, n, t);
      }
      return n[i2].exports;
    }
    for (var u = false, i = 0; i < t.length; i++)
      o(t[i]);
    return o;
  }
  return r;
})()({1: [function(require2, module, exports) {
  "use strict";
  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++)
        arr2[i] = arr[i];
      return arr2;
    } else {
      return Array.from(arr);
    }
  }
  const O = Object;
  var _require = require2("printable-characters");
  const first = _require.first, strlen = _require.strlen, limit = (s, n) => first(s, n - 1) + "\u2026";
  const asColumns = (rows, cfg_) => {
    const zip = (arrs, f) => arrs.reduce((a, b) => b.map((b2, i) => [].concat(_toConsumableArray(a[i] || []), [b2])), []).map((args) => f.apply(void 0, _toConsumableArray(args))), cells = rows.map((r) => r.map((c) => c === void 0 ? "" : cfg_.print(c).replace(/\n/g, "\\n"))), cellWidths = cells.map((r) => r.map(strlen)), maxWidths = zip(cellWidths, Math.max), cfg = O.assign({
      delimiter: "  ",
      minColumnWidths: maxWidths.map((x) => 0),
      maxTotalWidth: 0
    }, cfg_), delimiterLength = strlen(cfg.delimiter), totalWidth = maxWidths.reduce((a, b) => a + b, 0), relativeWidths = maxWidths.map((w) => w / totalWidth), maxTotalWidth = cfg.maxTotalWidth - delimiterLength * (maxWidths.length - 1), excessWidth = Math.max(0, totalWidth - maxTotalWidth), computedWidths = zip([cfg.minColumnWidths, maxWidths, relativeWidths], (min, max, relative) => Math.max(min, Math.floor(max - excessWidth * relative))), restCellWidths = cellWidths.map((widths) => zip([computedWidths, widths], (a, b) => a - b));
    return zip([cells, restCellWidths], (a, b) => zip([a, b], (str, w) => w >= 0 ? cfg.right ? " ".repeat(w) + str : str + " ".repeat(w) : limit(str, strlen(str) + w)).join(cfg.delimiter));
  };
  const asTable = (cfg) => O.assign((arr) => {
    var _ref;
    if (arr[0] && Array.isArray(arr[0]))
      return asColumns(arr, cfg).join("\n");
    const colNames = [].concat(_toConsumableArray(new Set((_ref = []).concat.apply(_ref, _toConsumableArray(arr.map(O.keys)))))), columns = [colNames.map(cfg.title)].concat(_toConsumableArray(arr.map((o) => colNames.map((key) => o[key])))), lines = asColumns(columns, cfg);
    return [lines[0], cfg.dash.repeat(strlen(lines[0]))].concat(_toConsumableArray(lines.slice(1))).join("\n");
  }, cfg, {
    configure: (newConfig) => asTable(O.assign({}, cfg, newConfig))
  });
  module.exports = asTable({
    maxTotalWidth: Number.MAX_SAFE_INTEGER,
    print: String,
    title: String,
    dash: "-",
    right: false
  });
}, {"printable-characters": 8}], 2: [function(require2, module, exports) {
  "use strict";
  exports.byteLength = byteLength;
  exports.toByteArray = toByteArray;
  exports.fromByteArray = fromByteArray;
  var lookup = [];
  var revLookup = [];
  var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
  var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  }
  revLookup["-".charCodeAt(0)] = 62;
  revLookup["_".charCodeAt(0)] = 63;
  function getLens(b64) {
    var len2 = b64.length;
    if (len2 % 4 > 0) {
      throw new Error("Invalid string. Length must be a multiple of 4");
    }
    var validLen = b64.indexOf("=");
    if (validLen === -1)
      validLen = len2;
    var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
    return [validLen, placeHoldersLen];
  }
  function byteLength(b64) {
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
  }
  function _byteLength(b64, validLen, placeHoldersLen) {
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
  }
  function toByteArray(b64) {
    var tmp;
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
    var curByte = 0;
    var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
    for (var i2 = 0; i2 < len2; i2 += 4) {
      tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
      arr[curByte++] = tmp >> 16 & 255;
      arr[curByte++] = tmp >> 8 & 255;
      arr[curByte++] = tmp & 255;
    }
    if (placeHoldersLen === 2) {
      tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
      arr[curByte++] = tmp & 255;
    }
    if (placeHoldersLen === 1) {
      tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
      arr[curByte++] = tmp >> 8 & 255;
      arr[curByte++] = tmp & 255;
    }
    return arr;
  }
  function tripletToBase64(num) {
    return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
  }
  function encodeChunk(uint8, start, end) {
    var tmp;
    var output = [];
    for (var i2 = start; i2 < end; i2 += 3) {
      tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
      output.push(tripletToBase64(tmp));
    }
    return output.join("");
  }
  function fromByteArray(uint8) {
    var tmp;
    var len2 = uint8.length;
    var extraBytes = len2 % 3;
    var parts = [];
    var maxChunkLength = 16383;
    for (var i2 = 0, len22 = len2 - extraBytes; i2 < len22; i2 += maxChunkLength) {
      parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
    }
    if (extraBytes === 1) {
      tmp = uint8[len2 - 1];
      parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "==");
    } else if (extraBytes === 2) {
      tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
      parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "=");
    }
    return parts.join("");
  }
}, {}], 3: [function(require2, module, exports) {
  (function(Buffer2) {
    /*!
     * The buffer module from node.js, for the browser.
     *
     * @author   Feross Aboukhadijeh <https://feross.org>
     * @license  MIT
     */
    "use strict";
    var base64 = require2("base64-js");
    var ieee754 = require2("ieee754");
    exports.Buffer = Buffer2;
    exports.SlowBuffer = SlowBuffer;
    exports.INSPECT_MAX_BYTES = 50;
    var K_MAX_LENGTH = 2147483647;
    exports.kMaxLength = K_MAX_LENGTH;
    Buffer2.TYPED_ARRAY_SUPPORT = typedArraySupport();
    if (!Buffer2.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
      console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
    }
    function typedArraySupport() {
      try {
        var arr = new Uint8Array(1);
        arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function() {
          return 42;
        }};
        return arr.foo() === 42;
      } catch (e) {
        return false;
      }
    }
    Object.defineProperty(Buffer2.prototype, "parent", {
      enumerable: true,
      get: function() {
        if (!Buffer2.isBuffer(this))
          return void 0;
        return this.buffer;
      }
    });
    Object.defineProperty(Buffer2.prototype, "offset", {
      enumerable: true,
      get: function() {
        if (!Buffer2.isBuffer(this))
          return void 0;
        return this.byteOffset;
      }
    });
    function createBuffer(length) {
      if (length > K_MAX_LENGTH) {
        throw new RangeError('The value "' + length + '" is invalid for option "size"');
      }
      var buf = new Uint8Array(length);
      buf.__proto__ = Buffer2.prototype;
      return buf;
    }
    function Buffer2(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        if (typeof encodingOrOffset === "string") {
          throw new TypeError('The "string" argument must be of type string. Received type number');
        }
        return allocUnsafe(arg);
      }
      return from(arg, encodingOrOffset, length);
    }
    if (typeof Symbol !== "undefined" && Symbol.species != null && Buffer2[Symbol.species] === Buffer2) {
      Object.defineProperty(Buffer2, Symbol.species, {
        value: null,
        configurable: true,
        enumerable: false,
        writable: false
      });
    }
    Buffer2.poolSize = 8192;
    function from(value, encodingOrOffset, length) {
      if (typeof value === "string") {
        return fromString(value, encodingOrOffset);
      }
      if (ArrayBuffer.isView(value)) {
        return fromArrayLike(value);
      }
      if (value == null) {
        throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value);
      }
      if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
        return fromArrayBuffer(value, encodingOrOffset, length);
      }
      if (typeof value === "number") {
        throw new TypeError('The "value" argument must not be of type number. Received type number');
      }
      var valueOf = value.valueOf && value.valueOf();
      if (valueOf != null && valueOf !== value) {
        return Buffer2.from(valueOf, encodingOrOffset, length);
      }
      var b = fromObject(value);
      if (b)
        return b;
      if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
        return Buffer2.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
      }
      throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value);
    }
    Buffer2.from = function(value, encodingOrOffset, length) {
      return from(value, encodingOrOffset, length);
    };
    Buffer2.prototype.__proto__ = Uint8Array.prototype;
    Buffer2.__proto__ = Uint8Array;
    function assertSize(size) {
      if (typeof size !== "number") {
        throw new TypeError('"size" argument must be of type number');
      } else if (size < 0) {
        throw new RangeError('The value "' + size + '" is invalid for option "size"');
      }
    }
    function alloc(size, fill, encoding) {
      assertSize(size);
      if (size <= 0) {
        return createBuffer(size);
      }
      if (fill !== void 0) {
        return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
      }
      return createBuffer(size);
    }
    Buffer2.alloc = function(size, fill, encoding) {
      return alloc(size, fill, encoding);
    };
    function allocUnsafe(size) {
      assertSize(size);
      return createBuffer(size < 0 ? 0 : checked(size) | 0);
    }
    Buffer2.allocUnsafe = function(size) {
      return allocUnsafe(size);
    };
    Buffer2.allocUnsafeSlow = function(size) {
      return allocUnsafe(size);
    };
    function fromString(string, encoding) {
      if (typeof encoding !== "string" || encoding === "") {
        encoding = "utf8";
      }
      if (!Buffer2.isEncoding(encoding)) {
        throw new TypeError("Unknown encoding: " + encoding);
      }
      var length = byteLength(string, encoding) | 0;
      var buf = createBuffer(length);
      var actual = buf.write(string, encoding);
      if (actual !== length) {
        buf = buf.slice(0, actual);
      }
      return buf;
    }
    function fromArrayLike(array) {
      var length = array.length < 0 ? 0 : checked(array.length) | 0;
      var buf = createBuffer(length);
      for (var i = 0; i < length; i += 1) {
        buf[i] = array[i] & 255;
      }
      return buf;
    }
    function fromArrayBuffer(array, byteOffset, length) {
      if (byteOffset < 0 || array.byteLength < byteOffset) {
        throw new RangeError('"offset" is outside of buffer bounds');
      }
      if (array.byteLength < byteOffset + (length || 0)) {
        throw new RangeError('"length" is outside of buffer bounds');
      }
      var buf;
      if (byteOffset === void 0 && length === void 0) {
        buf = new Uint8Array(array);
      } else if (length === void 0) {
        buf = new Uint8Array(array, byteOffset);
      } else {
        buf = new Uint8Array(array, byteOffset, length);
      }
      buf.__proto__ = Buffer2.prototype;
      return buf;
    }
    function fromObject(obj) {
      if (Buffer2.isBuffer(obj)) {
        var len = checked(obj.length) | 0;
        var buf = createBuffer(len);
        if (buf.length === 0) {
          return buf;
        }
        obj.copy(buf, 0, 0, len);
        return buf;
      }
      if (obj.length !== void 0) {
        if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
          return createBuffer(0);
        }
        return fromArrayLike(obj);
      }
      if (obj.type === "Buffer" && Array.isArray(obj.data)) {
        return fromArrayLike(obj.data);
      }
    }
    function checked(length) {
      if (length >= K_MAX_LENGTH) {
        throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
      }
      return length | 0;
    }
    function SlowBuffer(length) {
      if (+length != length) {
        length = 0;
      }
      return Buffer2.alloc(+length);
    }
    Buffer2.isBuffer = function isBuffer(b) {
      return b != null && b._isBuffer === true && b !== Buffer2.prototype;
    };
    Buffer2.compare = function compare(a, b) {
      if (isInstance(a, Uint8Array))
        a = Buffer2.from(a, a.offset, a.byteLength);
      if (isInstance(b, Uint8Array))
        b = Buffer2.from(b, b.offset, b.byteLength);
      if (!Buffer2.isBuffer(a) || !Buffer2.isBuffer(b)) {
        throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
      }
      if (a === b)
        return 0;
      var x = a.length;
      var y = b.length;
      for (var i = 0, len = Math.min(x, y); i < len; ++i) {
        if (a[i] !== b[i]) {
          x = a[i];
          y = b[i];
          break;
        }
      }
      if (x < y)
        return -1;
      if (y < x)
        return 1;
      return 0;
    };
    Buffer2.isEncoding = function isEncoding(encoding) {
      switch (String(encoding).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return true;
        default:
          return false;
      }
    };
    Buffer2.concat = function concat(list, length) {
      if (!Array.isArray(list)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
      }
      if (list.length === 0) {
        return Buffer2.alloc(0);
      }
      var i;
      if (length === void 0) {
        length = 0;
        for (i = 0; i < list.length; ++i) {
          length += list[i].length;
        }
      }
      var buffer = Buffer2.allocUnsafe(length);
      var pos = 0;
      for (i = 0; i < list.length; ++i) {
        var buf = list[i];
        if (isInstance(buf, Uint8Array)) {
          buf = Buffer2.from(buf);
        }
        if (!Buffer2.isBuffer(buf)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        }
        buf.copy(buffer, pos);
        pos += buf.length;
      }
      return buffer;
    };
    function byteLength(string, encoding) {
      if (Buffer2.isBuffer(string)) {
        return string.length;
      }
      if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
        return string.byteLength;
      }
      if (typeof string !== "string") {
        throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string);
      }
      var len = string.length;
      var mustMatch = arguments.length > 2 && arguments[2] === true;
      if (!mustMatch && len === 0)
        return 0;
      var loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "ascii":
          case "latin1":
          case "binary":
            return len;
          case "utf8":
          case "utf-8":
            return utf8ToBytes(string).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return len * 2;
          case "hex":
            return len >>> 1;
          case "base64":
            return base64ToBytes(string).length;
          default:
            if (loweredCase) {
              return mustMatch ? -1 : utf8ToBytes(string).length;
            }
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    }
    Buffer2.byteLength = byteLength;
    function slowToString(encoding, start, end) {
      var loweredCase = false;
      if (start === void 0 || start < 0) {
        start = 0;
      }
      if (start > this.length) {
        return "";
      }
      if (end === void 0 || end > this.length) {
        end = this.length;
      }
      if (end <= 0) {
        return "";
      }
      end >>>= 0;
      start >>>= 0;
      if (end <= start) {
        return "";
      }
      if (!encoding)
        encoding = "utf8";
      while (true) {
        switch (encoding) {
          case "hex":
            return hexSlice(this, start, end);
          case "utf8":
          case "utf-8":
            return utf8Slice(this, start, end);
          case "ascii":
            return asciiSlice(this, start, end);
          case "latin1":
          case "binary":
            return latin1Slice(this, start, end);
          case "base64":
            return base64Slice(this, start, end);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return utf16leSlice(this, start, end);
          default:
            if (loweredCase)
              throw new TypeError("Unknown encoding: " + encoding);
            encoding = (encoding + "").toLowerCase();
            loweredCase = true;
        }
      }
    }
    Buffer2.prototype._isBuffer = true;
    function swap(b, n, m) {
      var i = b[n];
      b[n] = b[m];
      b[m] = i;
    }
    Buffer2.prototype.swap16 = function swap16() {
      var len = this.length;
      if (len % 2 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      }
      for (var i = 0; i < len; i += 2) {
        swap(this, i, i + 1);
      }
      return this;
    };
    Buffer2.prototype.swap32 = function swap32() {
      var len = this.length;
      if (len % 4 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      }
      for (var i = 0; i < len; i += 4) {
        swap(this, i, i + 3);
        swap(this, i + 1, i + 2);
      }
      return this;
    };
    Buffer2.prototype.swap64 = function swap64() {
      var len = this.length;
      if (len % 8 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      }
      for (var i = 0; i < len; i += 8) {
        swap(this, i, i + 7);
        swap(this, i + 1, i + 6);
        swap(this, i + 2, i + 5);
        swap(this, i + 3, i + 4);
      }
      return this;
    };
    Buffer2.prototype.toString = function toString() {
      var length = this.length;
      if (length === 0)
        return "";
      if (arguments.length === 0)
        return utf8Slice(this, 0, length);
      return slowToString.apply(this, arguments);
    };
    Buffer2.prototype.toLocaleString = Buffer2.prototype.toString;
    Buffer2.prototype.equals = function equals(b) {
      if (!Buffer2.isBuffer(b))
        throw new TypeError("Argument must be a Buffer");
      if (this === b)
        return true;
      return Buffer2.compare(this, b) === 0;
    };
    Buffer2.prototype.inspect = function inspect() {
      var str = "";
      var max = exports.INSPECT_MAX_BYTES;
      str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
      if (this.length > max)
        str += " ... ";
      return "<Buffer " + str + ">";
    };
    Buffer2.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
      if (isInstance(target, Uint8Array)) {
        target = Buffer2.from(target, target.offset, target.byteLength);
      }
      if (!Buffer2.isBuffer(target)) {
        throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target);
      }
      if (start === void 0) {
        start = 0;
      }
      if (end === void 0) {
        end = target ? target.length : 0;
      }
      if (thisStart === void 0) {
        thisStart = 0;
      }
      if (thisEnd === void 0) {
        thisEnd = this.length;
      }
      if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
        throw new RangeError("out of range index");
      }
      if (thisStart >= thisEnd && start >= end) {
        return 0;
      }
      if (thisStart >= thisEnd) {
        return -1;
      }
      if (start >= end) {
        return 1;
      }
      start >>>= 0;
      end >>>= 0;
      thisStart >>>= 0;
      thisEnd >>>= 0;
      if (this === target)
        return 0;
      var x = thisEnd - thisStart;
      var y = end - start;
      var len = Math.min(x, y);
      var thisCopy = this.slice(thisStart, thisEnd);
      var targetCopy = target.slice(start, end);
      for (var i = 0; i < len; ++i) {
        if (thisCopy[i] !== targetCopy[i]) {
          x = thisCopy[i];
          y = targetCopy[i];
          break;
        }
      }
      if (x < y)
        return -1;
      if (y < x)
        return 1;
      return 0;
    };
    function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
      if (buffer.length === 0)
        return -1;
      if (typeof byteOffset === "string") {
        encoding = byteOffset;
        byteOffset = 0;
      } else if (byteOffset > 2147483647) {
        byteOffset = 2147483647;
      } else if (byteOffset < -2147483648) {
        byteOffset = -2147483648;
      }
      byteOffset = +byteOffset;
      if (numberIsNaN(byteOffset)) {
        byteOffset = dir ? 0 : buffer.length - 1;
      }
      if (byteOffset < 0)
        byteOffset = buffer.length + byteOffset;
      if (byteOffset >= buffer.length) {
        if (dir)
          return -1;
        else
          byteOffset = buffer.length - 1;
      } else if (byteOffset < 0) {
        if (dir)
          byteOffset = 0;
        else
          return -1;
      }
      if (typeof val === "string") {
        val = Buffer2.from(val, encoding);
      }
      if (Buffer2.isBuffer(val)) {
        if (val.length === 0) {
          return -1;
        }
        return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
      } else if (typeof val === "number") {
        val = val & 255;
        if (typeof Uint8Array.prototype.indexOf === "function") {
          if (dir) {
            return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
          } else {
            return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
          }
        }
        return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
      }
      throw new TypeError("val must be string, number or Buffer");
    }
    function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
      var indexSize = 1;
      var arrLength = arr.length;
      var valLength = val.length;
      if (encoding !== void 0) {
        encoding = String(encoding).toLowerCase();
        if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
          if (arr.length < 2 || val.length < 2) {
            return -1;
          }
          indexSize = 2;
          arrLength /= 2;
          valLength /= 2;
          byteOffset /= 2;
        }
      }
      function read(buf, i2) {
        if (indexSize === 1) {
          return buf[i2];
        } else {
          return buf.readUInt16BE(i2 * indexSize);
        }
      }
      var i;
      if (dir) {
        var foundIndex = -1;
        for (i = byteOffset; i < arrLength; i++) {
          if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
            if (foundIndex === -1)
              foundIndex = i;
            if (i - foundIndex + 1 === valLength)
              return foundIndex * indexSize;
          } else {
            if (foundIndex !== -1)
              i -= i - foundIndex;
            foundIndex = -1;
          }
        }
      } else {
        if (byteOffset + valLength > arrLength)
          byteOffset = arrLength - valLength;
        for (i = byteOffset; i >= 0; i--) {
          var found = true;
          for (var j = 0; j < valLength; j++) {
            if (read(arr, i + j) !== read(val, j)) {
              found = false;
              break;
            }
          }
          if (found)
            return i;
        }
      }
      return -1;
    }
    Buffer2.prototype.includes = function includes(val, byteOffset, encoding) {
      return this.indexOf(val, byteOffset, encoding) !== -1;
    };
    Buffer2.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
    };
    Buffer2.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
    };
    function hexWrite(buf, string, offset, length) {
      offset = Number(offset) || 0;
      var remaining = buf.length - offset;
      if (!length) {
        length = remaining;
      } else {
        length = Number(length);
        if (length > remaining) {
          length = remaining;
        }
      }
      var strLen = string.length;
      if (length > strLen / 2) {
        length = strLen / 2;
      }
      for (var i = 0; i < length; ++i) {
        var parsed = parseInt(string.substr(i * 2, 2), 16);
        if (numberIsNaN(parsed))
          return i;
        buf[offset + i] = parsed;
      }
      return i;
    }
    function utf8Write(buf, string, offset, length) {
      return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
    }
    function asciiWrite(buf, string, offset, length) {
      return blitBuffer(asciiToBytes(string), buf, offset, length);
    }
    function latin1Write(buf, string, offset, length) {
      return asciiWrite(buf, string, offset, length);
    }
    function base64Write(buf, string, offset, length) {
      return blitBuffer(base64ToBytes(string), buf, offset, length);
    }
    function ucs2Write(buf, string, offset, length) {
      return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
    }
    Buffer2.prototype.write = function write(string, offset, length, encoding) {
      if (offset === void 0) {
        encoding = "utf8";
        length = this.length;
        offset = 0;
      } else if (length === void 0 && typeof offset === "string") {
        encoding = offset;
        length = this.length;
        offset = 0;
      } else if (isFinite(offset)) {
        offset = offset >>> 0;
        if (isFinite(length)) {
          length = length >>> 0;
          if (encoding === void 0)
            encoding = "utf8";
        } else {
          encoding = length;
          length = void 0;
        }
      } else {
        throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
      }
      var remaining = this.length - offset;
      if (length === void 0 || length > remaining)
        length = remaining;
      if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
        throw new RangeError("Attempt to write outside buffer bounds");
      }
      if (!encoding)
        encoding = "utf8";
      var loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "hex":
            return hexWrite(this, string, offset, length);
          case "utf8":
          case "utf-8":
            return utf8Write(this, string, offset, length);
          case "ascii":
            return asciiWrite(this, string, offset, length);
          case "latin1":
          case "binary":
            return latin1Write(this, string, offset, length);
          case "base64":
            return base64Write(this, string, offset, length);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return ucs2Write(this, string, offset, length);
          default:
            if (loweredCase)
              throw new TypeError("Unknown encoding: " + encoding);
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    };
    Buffer2.prototype.toJSON = function toJSON() {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };
    function base64Slice(buf, start, end) {
      if (start === 0 && end === buf.length) {
        return base64.fromByteArray(buf);
      } else {
        return base64.fromByteArray(buf.slice(start, end));
      }
    }
    function utf8Slice(buf, start, end) {
      end = Math.min(buf.length, end);
      var res = [];
      var i = start;
      while (i < end) {
        var firstByte = buf[i];
        var codePoint = null;
        var bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
        if (i + bytesPerSequence <= end) {
          var secondByte, thirdByte, fourthByte, tempCodePoint;
          switch (bytesPerSequence) {
            case 1:
              if (firstByte < 128) {
                codePoint = firstByte;
              }
              break;
            case 2:
              secondByte = buf[i + 1];
              if ((secondByte & 192) === 128) {
                tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                if (tempCodePoint > 127) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 3:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 4:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              fourthByte = buf[i + 3];
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                  codePoint = tempCodePoint;
                }
              }
          }
        }
        if (codePoint === null) {
          codePoint = 65533;
          bytesPerSequence = 1;
        } else if (codePoint > 65535) {
          codePoint -= 65536;
          res.push(codePoint >>> 10 & 1023 | 55296);
          codePoint = 56320 | codePoint & 1023;
        }
        res.push(codePoint);
        i += bytesPerSequence;
      }
      return decodeCodePointsArray(res);
    }
    var MAX_ARGUMENTS_LENGTH = 4096;
    function decodeCodePointsArray(codePoints) {
      var len = codePoints.length;
      if (len <= MAX_ARGUMENTS_LENGTH) {
        return String.fromCharCode.apply(String, codePoints);
      }
      var res = "";
      var i = 0;
      while (i < len) {
        res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
      }
      return res;
    }
    function asciiSlice(buf, start, end) {
      var ret = "";
      end = Math.min(buf.length, end);
      for (var i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i] & 127);
      }
      return ret;
    }
    function latin1Slice(buf, start, end) {
      var ret = "";
      end = Math.min(buf.length, end);
      for (var i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i]);
      }
      return ret;
    }
    function hexSlice(buf, start, end) {
      var len = buf.length;
      if (!start || start < 0)
        start = 0;
      if (!end || end < 0 || end > len)
        end = len;
      var out = "";
      for (var i = start; i < end; ++i) {
        out += toHex(buf[i]);
      }
      return out;
    }
    function utf16leSlice(buf, start, end) {
      var bytes = buf.slice(start, end);
      var res = "";
      for (var i = 0; i < bytes.length; i += 2) {
        res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
      }
      return res;
    }
    Buffer2.prototype.slice = function slice(start, end) {
      var len = this.length;
      start = ~~start;
      end = end === void 0 ? len : ~~end;
      if (start < 0) {
        start += len;
        if (start < 0)
          start = 0;
      } else if (start > len) {
        start = len;
      }
      if (end < 0) {
        end += len;
        if (end < 0)
          end = 0;
      } else if (end > len) {
        end = len;
      }
      if (end < start)
        end = start;
      var newBuf = this.subarray(start, end);
      newBuf.__proto__ = Buffer2.prototype;
      return newBuf;
    };
    function checkOffset(offset, ext, length) {
      if (offset % 1 !== 0 || offset < 0)
        throw new RangeError("offset is not uint");
      if (offset + ext > length)
        throw new RangeError("Trying to access beyond buffer length");
    }
    Buffer2.prototype.readUIntLE = function readUIntLE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert)
        checkOffset(offset, byteLength2, this.length);
      var val = this[offset];
      var mul = 1;
      var i = 0;
      while (++i < byteLength2 && (mul *= 256)) {
        val += this[offset + i] * mul;
      }
      return val;
    };
    Buffer2.prototype.readUIntBE = function readUIntBE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        checkOffset(offset, byteLength2, this.length);
      }
      var val = this[offset + --byteLength2];
      var mul = 1;
      while (byteLength2 > 0 && (mul *= 256)) {
        val += this[offset + --byteLength2] * mul;
      }
      return val;
    };
    Buffer2.prototype.readUInt8 = function readUInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 1, this.length);
      return this[offset];
    };
    Buffer2.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 2, this.length);
      return this[offset] | this[offset + 1] << 8;
    };
    Buffer2.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 2, this.length);
      return this[offset] << 8 | this[offset + 1];
    };
    Buffer2.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
    };
    Buffer2.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
    };
    Buffer2.prototype.readIntLE = function readIntLE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert)
        checkOffset(offset, byteLength2, this.length);
      var val = this[offset];
      var mul = 1;
      var i = 0;
      while (++i < byteLength2 && (mul *= 256)) {
        val += this[offset + i] * mul;
      }
      mul *= 128;
      if (val >= mul)
        val -= Math.pow(2, 8 * byteLength2);
      return val;
    };
    Buffer2.prototype.readIntBE = function readIntBE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert)
        checkOffset(offset, byteLength2, this.length);
      var i = byteLength2;
      var mul = 1;
      var val = this[offset + --i];
      while (i > 0 && (mul *= 256)) {
        val += this[offset + --i] * mul;
      }
      mul *= 128;
      if (val >= mul)
        val -= Math.pow(2, 8 * byteLength2);
      return val;
    };
    Buffer2.prototype.readInt8 = function readInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 1, this.length);
      if (!(this[offset] & 128))
        return this[offset];
      return (255 - this[offset] + 1) * -1;
    };
    Buffer2.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 2, this.length);
      var val = this[offset] | this[offset + 1] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer2.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 2, this.length);
      var val = this[offset + 1] | this[offset] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer2.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
    };
    Buffer2.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
    };
    Buffer2.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return ieee754.read(this, offset, true, 23, 4);
    };
    Buffer2.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return ieee754.read(this, offset, false, 23, 4);
    };
    Buffer2.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 8, this.length);
      return ieee754.read(this, offset, true, 52, 8);
    };
    Buffer2.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 8, this.length);
      return ieee754.read(this, offset, false, 52, 8);
    };
    function checkInt(buf, value, offset, ext, max, min) {
      if (!Buffer2.isBuffer(buf))
        throw new TypeError('"buffer" argument must be a Buffer instance');
      if (value > max || value < min)
        throw new RangeError('"value" argument is out of bounds');
      if (offset + ext > buf.length)
        throw new RangeError("Index out of range");
    }
    Buffer2.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        var maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      var mul = 1;
      var i = 0;
      this[offset] = value & 255;
      while (++i < byteLength2 && (mul *= 256)) {
        this[offset + i] = value / mul & 255;
      }
      return offset + byteLength2;
    };
    Buffer2.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        var maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      var i = byteLength2 - 1;
      var mul = 1;
      this[offset + i] = value & 255;
      while (--i >= 0 && (mul *= 256)) {
        this[offset + i] = value / mul & 255;
      }
      return offset + byteLength2;
    };
    Buffer2.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 1, 255, 0);
      this[offset] = value & 255;
      return offset + 1;
    };
    Buffer2.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 2, 65535, 0);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      return offset + 2;
    };
    Buffer2.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 2, 65535, 0);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 255;
      return offset + 2;
    };
    Buffer2.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 4, 4294967295, 0);
      this[offset + 3] = value >>> 24;
      this[offset + 2] = value >>> 16;
      this[offset + 1] = value >>> 8;
      this[offset] = value & 255;
      return offset + 4;
    };
    Buffer2.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 4, 4294967295, 0);
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 255;
      return offset + 4;
    };
    Buffer2.prototype.writeIntLE = function writeIntLE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        var limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      var i = 0;
      var mul = 1;
      var sub = 0;
      this[offset] = value & 255;
      while (++i < byteLength2 && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 255;
      }
      return offset + byteLength2;
    };
    Buffer2.prototype.writeIntBE = function writeIntBE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        var limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      var i = byteLength2 - 1;
      var mul = 1;
      var sub = 0;
      this[offset + i] = value & 255;
      while (--i >= 0 && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 255;
      }
      return offset + byteLength2;
    };
    Buffer2.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 1, 127, -128);
      if (value < 0)
        value = 255 + value + 1;
      this[offset] = value & 255;
      return offset + 1;
    };
    Buffer2.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 2, 32767, -32768);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      return offset + 2;
    };
    Buffer2.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 2, 32767, -32768);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 255;
      return offset + 2;
    };
    Buffer2.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 4, 2147483647, -2147483648);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      this[offset + 2] = value >>> 16;
      this[offset + 3] = value >>> 24;
      return offset + 4;
    };
    Buffer2.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 4, 2147483647, -2147483648);
      if (value < 0)
        value = 4294967295 + value + 1;
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 255;
      return offset + 4;
    };
    function checkIEEE754(buf, value, offset, ext, max, min) {
      if (offset + ext > buf.length)
        throw new RangeError("Index out of range");
      if (offset < 0)
        throw new RangeError("Index out of range");
    }
    function writeFloat(buf, value, offset, littleEndian, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 4, 34028234663852886e22, -34028234663852886e22);
      }
      ieee754.write(buf, value, offset, littleEndian, 23, 4);
      return offset + 4;
    }
    Buffer2.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
      return writeFloat(this, value, offset, true, noAssert);
    };
    Buffer2.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
      return writeFloat(this, value, offset, false, noAssert);
    };
    function writeDouble(buf, value, offset, littleEndian, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 8, 17976931348623157e292, -17976931348623157e292);
      }
      ieee754.write(buf, value, offset, littleEndian, 52, 8);
      return offset + 8;
    }
    Buffer2.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
      return writeDouble(this, value, offset, true, noAssert);
    };
    Buffer2.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
      return writeDouble(this, value, offset, false, noAssert);
    };
    Buffer2.prototype.copy = function copy(target, targetStart, start, end) {
      if (!Buffer2.isBuffer(target))
        throw new TypeError("argument should be a Buffer");
      if (!start)
        start = 0;
      if (!end && end !== 0)
        end = this.length;
      if (targetStart >= target.length)
        targetStart = target.length;
      if (!targetStart)
        targetStart = 0;
      if (end > 0 && end < start)
        end = start;
      if (end === start)
        return 0;
      if (target.length === 0 || this.length === 0)
        return 0;
      if (targetStart < 0) {
        throw new RangeError("targetStart out of bounds");
      }
      if (start < 0 || start >= this.length)
        throw new RangeError("Index out of range");
      if (end < 0)
        throw new RangeError("sourceEnd out of bounds");
      if (end > this.length)
        end = this.length;
      if (target.length - targetStart < end - start) {
        end = target.length - targetStart + start;
      }
      var len = end - start;
      if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
        this.copyWithin(targetStart, start, end);
      } else if (this === target && start < targetStart && targetStart < end) {
        for (var i = len - 1; i >= 0; --i) {
          target[i + targetStart] = this[i + start];
        }
      } else {
        Uint8Array.prototype.set.call(target, this.subarray(start, end), targetStart);
      }
      return len;
    };
    Buffer2.prototype.fill = function fill(val, start, end, encoding) {
      if (typeof val === "string") {
        if (typeof start === "string") {
          encoding = start;
          start = 0;
          end = this.length;
        } else if (typeof end === "string") {
          encoding = end;
          end = this.length;
        }
        if (encoding !== void 0 && typeof encoding !== "string") {
          throw new TypeError("encoding must be a string");
        }
        if (typeof encoding === "string" && !Buffer2.isEncoding(encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
        if (val.length === 1) {
          var code = val.charCodeAt(0);
          if (encoding === "utf8" && code < 128 || encoding === "latin1") {
            val = code;
          }
        }
      } else if (typeof val === "number") {
        val = val & 255;
      }
      if (start < 0 || this.length < start || this.length < end) {
        throw new RangeError("Out of range index");
      }
      if (end <= start) {
        return this;
      }
      start = start >>> 0;
      end = end === void 0 ? this.length : end >>> 0;
      if (!val)
        val = 0;
      var i;
      if (typeof val === "number") {
        for (i = start; i < end; ++i) {
          this[i] = val;
        }
      } else {
        var bytes = Buffer2.isBuffer(val) ? val : Buffer2.from(val, encoding);
        var len = bytes.length;
        if (len === 0) {
          throw new TypeError('The value "' + val + '" is invalid for argument "value"');
        }
        for (i = 0; i < end - start; ++i) {
          this[i + start] = bytes[i % len];
        }
      }
      return this;
    };
    var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
    function base64clean(str) {
      str = str.split("=")[0];
      str = str.trim().replace(INVALID_BASE64_RE, "");
      if (str.length < 2)
        return "";
      while (str.length % 4 !== 0) {
        str = str + "=";
      }
      return str;
    }
    function toHex(n) {
      if (n < 16)
        return "0" + n.toString(16);
      return n.toString(16);
    }
    function utf8ToBytes(string, units) {
      units = units || Infinity;
      var codePoint;
      var length = string.length;
      var leadSurrogate = null;
      var bytes = [];
      for (var i = 0; i < length; ++i) {
        codePoint = string.charCodeAt(i);
        if (codePoint > 55295 && codePoint < 57344) {
          if (!leadSurrogate) {
            if (codePoint > 56319) {
              if ((units -= 3) > -1)
                bytes.push(239, 191, 189);
              continue;
            } else if (i + 1 === length) {
              if ((units -= 3) > -1)
                bytes.push(239, 191, 189);
              continue;
            }
            leadSurrogate = codePoint;
            continue;
          }
          if (codePoint < 56320) {
            if ((units -= 3) > -1)
              bytes.push(239, 191, 189);
            leadSurrogate = codePoint;
            continue;
          }
          codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
        } else if (leadSurrogate) {
          if ((units -= 3) > -1)
            bytes.push(239, 191, 189);
        }
        leadSurrogate = null;
        if (codePoint < 128) {
          if ((units -= 1) < 0)
            break;
          bytes.push(codePoint);
        } else if (codePoint < 2048) {
          if ((units -= 2) < 0)
            break;
          bytes.push(codePoint >> 6 | 192, codePoint & 63 | 128);
        } else if (codePoint < 65536) {
          if ((units -= 3) < 0)
            break;
          bytes.push(codePoint >> 12 | 224, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
        } else if (codePoint < 1114112) {
          if ((units -= 4) < 0)
            break;
          bytes.push(codePoint >> 18 | 240, codePoint >> 12 & 63 | 128, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
        } else {
          throw new Error("Invalid code point");
        }
      }
      return bytes;
    }
    function asciiToBytes(str) {
      var byteArray = [];
      for (var i = 0; i < str.length; ++i) {
        byteArray.push(str.charCodeAt(i) & 255);
      }
      return byteArray;
    }
    function utf16leToBytes(str, units) {
      var c, hi, lo;
      var byteArray = [];
      for (var i = 0; i < str.length; ++i) {
        if ((units -= 2) < 0)
          break;
        c = str.charCodeAt(i);
        hi = c >> 8;
        lo = c % 256;
        byteArray.push(lo);
        byteArray.push(hi);
      }
      return byteArray;
    }
    function base64ToBytes(str) {
      return base64.toByteArray(base64clean(str));
    }
    function blitBuffer(src, dst, offset, length) {
      for (var i = 0; i < length; ++i) {
        if (i + offset >= dst.length || i >= src.length)
          break;
        dst[i + offset] = src[i];
      }
      return i;
    }
    function isInstance(obj, type) {
      return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
    }
    function numberIsNaN(obj) {
      return obj !== obj;
    }
  }).call(this, require2("buffer").Buffer);
}, {"base64-js": 2, buffer: 3, ieee754: 7}], 4: [function(require2, module, exports) {
  (function(Buffer2) {
    "use strict";
    module.exports = dataUriToBuffer;
    function dataUriToBuffer(uri) {
      if (!/^data\:/i.test(uri)) {
        throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
      }
      uri = uri.replace(/\r?\n/g, "");
      var firstComma = uri.indexOf(",");
      if (firstComma === -1 || firstComma <= 4) {
        throw new TypeError("malformed data: URI");
      }
      var meta = uri.substring(5, firstComma).split(";");
      var type = meta[0] || "text/plain";
      var typeFull = type;
      var base64 = false;
      var charset = "";
      for (var i = 1; i < meta.length; i++) {
        if (meta[i] == "base64") {
          base64 = true;
        } else {
          typeFull += ";" + meta[i];
          if (meta[i].indexOf("charset=") == 0) {
            charset = meta[i].substring(8);
          }
        }
      }
      if (!meta[0] && !charset.length) {
        typeFull += ";charset=US-ASCII";
        charset = "US-ASCII";
      }
      var data = unescape(uri.substring(firstComma + 1));
      var encoding = base64 ? "base64" : "ascii";
      var buffer = new Buffer2(data, encoding);
      buffer.type = type;
      buffer.typeFull = typeFull;
      buffer.charset = charset;
      return buffer;
    }
  }).call(this, require2("buffer").Buffer);
}, {buffer: 3}], 5: [function(require2, module, exports) {
  "use strict";
  const O = Object, isBrowser = typeof window !== "undefined" && window.window === window && window.navigator, SourceMapConsumer = require2("source-map").SourceMapConsumer, path = require2("./impl/path"), dataURIToBuffer = require2("data-uri-to-buffer"), lastOf = (x) => x[x.length - 1];
  const memoize = (f) => {
    const m = (x) => x in m.cache ? m.cache[x] : m.cache[x] = f(x);
    m.forgetEverything = () => {
      m.cache = Object.create(null);
    };
    m.cache = Object.create(null);
    return m;
  };
  const newSourceFileMemoized = memoize((file) => new SourceFile(file));
  const getSource = module.exports = (file) => {
    return newSourceFileMemoized(path.resolve(file));
  };
  getSource.resetCache = () => newSourceFileMemoized.forgetEverything();
  getSource.getCache = () => newSourceFileMemoized.cache;
  class SourceMap {
    constructor(originalFilePath, sourceMapPath) {
      this.file = sourceMapPath.startsWith("data:") ? new SourceFile(originalFilePath, dataURIToBuffer(sourceMapPath).toString()) : getSource(path.relativeToFile(originalFilePath, sourceMapPath));
      this.parsed = this.file.text && SourceMapConsumer(JSON.parse(this.file.text)) || null;
      this.sourceFor = memoize(this.sourceFor.bind(this));
    }
    sourceFor(file) {
      const content = this.parsed.sourceContentFor(file, true);
      const fullPath = path.relativeToFile(this.file.path, file);
      return content ? new SourceFile(fullPath, content) : getSource(fullPath);
    }
    resolve(loc) {
      const originalLoc = this.parsed.originalPositionFor(loc);
      return originalLoc.source ? this.sourceFor(originalLoc.source).resolve(O.assign({}, loc, {
        line: originalLoc.line,
        column: originalLoc.column + 1,
        name: originalLoc.name
      })) : loc;
    }
  }
  class SourceFile {
    constructor(path2, text) {
      this.path = path2;
      if (text) {
        this.text = text;
      } else {
        try {
          if (isBrowser) {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", path2, false);
            xhr.send(null);
            this.text = xhr.responseText;
          } else {
            this.text = module.require("fs").readFileSync(path2, {encoding: "utf8"});
          }
        } catch (e) {
          this.error = e;
          this.text = "";
        }
      }
    }
    get lines() {
      return this.lines_ = this.lines_ || this.text.split("\n");
    }
    get sourceMap() {
      try {
        if (this.sourceMap_ === void 0) {
          const re = /\u0023 sourceMappingURL=(.+)\n?/g;
          let lastMatch = void 0;
          while (true) {
            const match = re.exec(this.text);
            if (match)
              lastMatch = match;
            else
              break;
          }
          const url = lastMatch && lastMatch[1];
          if (url) {
            const sourceMap = new SourceMap(this.path, url);
            if (sourceMap.parsed) {
              this.sourceMap_ = sourceMap;
            }
          } else {
            this.sourceMap_ = null;
          }
        }
      } catch (e) {
        this.sourceMap_ = null;
        this.sourceMapError = e;
      }
      return this.sourceMap_;
    }
    resolve(loc) {
      if (this.sourceMap) {
        const newLoc = this.sourceMap.resolve(loc);
        if (newLoc.sourceFile)
          return newLoc;
      }
      return O.assign({}, loc, {
        sourceFile: this,
        sourceLine: this.lines[loc.line - 1] || "",
        error: this.error
      });
    }
  }
}, {"./impl/path": 6, "data-uri-to-buffer": 4, "source-map": 20}], 6: [function(require2, module, exports) {
  (function(process) {
    "use strict";
    const isBrowser = typeof window !== "undefined" && window.window === window && window.navigator;
    const cwd = isBrowser ? window.location.href : process.cwd();
    const path = module.exports = {
      concat(a, b) {
        const a_endsWithSlash = a[a.length - 1] === "/", b_startsWithSlash = b[0] === "/";
        return a + (a_endsWithSlash || b_startsWithSlash ? "" : "/") + (a_endsWithSlash && b_startsWithSlash ? b.substring(1) : b);
      },
      resolve(x) {
        if (path.isAbsolute(x)) {
          return path.normalize(x);
        }
        return path.normalize(path.concat(cwd, x));
      },
      normalize(x) {
        let output = [], skip = 0;
        x.split("/").reverse().filter((x2) => x2 !== ".").forEach((x2) => {
          if (x2 === "..") {
            skip++;
          } else if (skip === 0) {
            output.push(x2);
          } else {
            skip--;
          }
        });
        const result = output.reverse().join("/");
        return (isBrowser && result[0] === "/" ? window.location.origin : "") + result;
      },
      isData: (x) => x.indexOf("data:") === 0,
      isAbsolute: (x) => x[0] === "/" || /^[^\/]*:/.test(x),
      relativeToFile(a, b) {
        return path.isData(a) || path.isAbsolute(b) ? path.normalize(b) : path.normalize(path.concat(a.split("/").slice(0, -1).join("/"), b));
      }
    };
  }).call(this, require2("_process"));
}, {_process: 9}], 7: [function(require2, module, exports) {
  exports.read = function(buffer, offset, isLE, mLen, nBytes) {
    var e, m;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var nBits = -7;
    var i = isLE ? nBytes - 1 : 0;
    var d = isLE ? -1 : 1;
    var s = buffer[offset + i];
    i += d;
    e = s & (1 << -nBits) - 1;
    s >>= -nBits;
    nBits += eLen;
    for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
    }
    m = e & (1 << -nBits) - 1;
    e >>= -nBits;
    nBits += mLen;
    for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
    }
    if (e === 0) {
      e = 1 - eBias;
    } else if (e === eMax) {
      return m ? NaN : (s ? -1 : 1) * Infinity;
    } else {
      m = m + Math.pow(2, mLen);
      e = e - eBias;
    }
    return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
  };
  exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
    var e, m, c;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
    var i = isLE ? 0 : nBytes - 1;
    var d = isLE ? 1 : -1;
    var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
    value = Math.abs(value);
    if (isNaN(value) || value === Infinity) {
      m = isNaN(value) ? 1 : 0;
      e = eMax;
    } else {
      e = Math.floor(Math.log(value) / Math.LN2);
      if (value * (c = Math.pow(2, -e)) < 1) {
        e--;
        c *= 2;
      }
      if (e + eBias >= 1) {
        value += rt / c;
      } else {
        value += rt * Math.pow(2, 1 - eBias);
      }
      if (value * c >= 2) {
        e++;
        c /= 2;
      }
      if (e + eBias >= eMax) {
        m = 0;
        e = eMax;
      } else if (e + eBias >= 1) {
        m = (value * c - 1) * Math.pow(2, mLen);
        e = e + eBias;
      } else {
        m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
        e = 0;
      }
    }
    for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
    }
    e = e << mLen | m;
    eLen += mLen;
    for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
    }
    buffer[offset + i - d] |= s * 128;
  };
}, {}], 8: [function(require2, module, exports) {
  "use strict";
  var _slicedToArray = function() {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = void 0;
      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);
          if (i && _arr.length === i)
            break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"])
            _i["return"]();
        } finally {
          if (_d)
            throw _e;
        }
      }
      return _arr;
    }
    return function(arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();
  const ansiEscapeCode = "[\x9B][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]", zeroWidthCharacterExceptNewline = "\0-\b\v-\x9B\xAD\u200B\u2028\u2029\uFEFF\uFE00-\uFE0F", zeroWidthCharacter = "\n" + zeroWidthCharacterExceptNewline, zeroWidthCharactersExceptNewline = new RegExp("(?:" + ansiEscapeCode + ")|[" + zeroWidthCharacterExceptNewline + "]", "g"), zeroWidthCharacters = new RegExp("(?:" + ansiEscapeCode + ")|[" + zeroWidthCharacter + "]", "g"), partition = new RegExp("((?:" + ansiEscapeCode + ")|[	" + zeroWidthCharacter + "])?([^	" + zeroWidthCharacter + "]*)", "g");
  module.exports = {
    zeroWidthCharacters,
    ansiEscapeCodes: new RegExp(ansiEscapeCode, "g"),
    strlen: (s) => Array.from(s.replace(zeroWidthCharacters, "")).length,
    isBlank: (s) => s.replace(zeroWidthCharacters, "").replace(/\s/g, "").length === 0,
    blank: (s) => Array.from(s.replace(zeroWidthCharactersExceptNewline, "")).map((x) => x === "	" || x === "\n" ? x : " ").join(""),
    partition(s) {
      for (var m, spans = []; partition.lastIndex !== s.length && (m = partition.exec(s)); ) {
        spans.push([m[1] || "", m[2]]);
      }
      partition.lastIndex = 0;
      return spans;
    },
    first(s, n) {
      let result = "", length = 0;
      for (const _ref of module.exports.partition(s)) {
        var _ref2 = _slicedToArray(_ref, 2);
        const nonPrintable = _ref2[0];
        const printable = _ref2[1];
        const text = Array.from(printable).slice(0, n - length);
        result += nonPrintable + text.join("");
        length += text.length;
      }
      return result;
    }
  };
}, {}], 9: [function(require2, module, exports) {
  var process = module.exports = {};
  var cachedSetTimeout;
  var cachedClearTimeout;
  function defaultSetTimout() {
    throw new Error("setTimeout has not been defined");
  }
  function defaultClearTimeout() {
    throw new Error("clearTimeout has not been defined");
  }
  (function() {
    try {
      if (typeof setTimeout === "function") {
        cachedSetTimeout = setTimeout;
      } else {
        cachedSetTimeout = defaultSetTimout;
      }
    } catch (e) {
      cachedSetTimeout = defaultSetTimout;
    }
    try {
      if (typeof clearTimeout === "function") {
        cachedClearTimeout = clearTimeout;
      } else {
        cachedClearTimeout = defaultClearTimeout;
      }
    } catch (e) {
      cachedClearTimeout = defaultClearTimeout;
    }
  })();
  function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
      return setTimeout(fun, 0);
    }
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
      cachedSetTimeout = setTimeout;
      return setTimeout(fun, 0);
    }
    try {
      return cachedSetTimeout(fun, 0);
    } catch (e) {
      try {
        return cachedSetTimeout.call(null, fun, 0);
      } catch (e2) {
        return cachedSetTimeout.call(this, fun, 0);
      }
    }
  }
  function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
      return clearTimeout(marker);
    }
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
      cachedClearTimeout = clearTimeout;
      return clearTimeout(marker);
    }
    try {
      return cachedClearTimeout(marker);
    } catch (e) {
      try {
        return cachedClearTimeout.call(null, marker);
      } catch (e2) {
        return cachedClearTimeout.call(this, marker);
      }
    }
  }
  var queue = [];
  var draining = false;
  var currentQueue;
  var queueIndex = -1;
  function cleanUpNextTick() {
    if (!draining || !currentQueue) {
      return;
    }
    draining = false;
    if (currentQueue.length) {
      queue = currentQueue.concat(queue);
    } else {
      queueIndex = -1;
    }
    if (queue.length) {
      drainQueue();
    }
  }
  function drainQueue() {
    if (draining) {
      return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;
    var len = queue.length;
    while (len) {
      currentQueue = queue;
      queue = [];
      while (++queueIndex < len) {
        if (currentQueue) {
          currentQueue[queueIndex].run();
        }
      }
      queueIndex = -1;
      len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
  }
  process.nextTick = function(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
      for (var i = 1; i < arguments.length; i++) {
        args[i - 1] = arguments[i];
      }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
      runTimeout(drainQueue);
    }
  };
  function Item(fun, array) {
    this.fun = fun;
    this.array = array;
  }
  Item.prototype.run = function() {
    this.fun.apply(null, this.array);
  };
  process.title = "browser";
  process.browser = true;
  process.env = {};
  process.argv = [];
  process.version = "";
  process.versions = {};
  function noop() {
  }
  process.on = noop;
  process.addListener = noop;
  process.once = noop;
  process.off = noop;
  process.removeListener = noop;
  process.removeAllListeners = noop;
  process.emit = noop;
  process.prependListener = noop;
  process.prependOnceListener = noop;
  process.listeners = function(name) {
    return [];
  };
  process.binding = function(name) {
    throw new Error("process.binding is not supported");
  };
  process.cwd = function() {
    return "/";
  };
  process.chdir = function(dir) {
    throw new Error("process.chdir is not supported");
  };
  process.umask = function() {
    return 0;
  };
}, {}], 10: [function(require2, module, exports) {
  var util = require2("./util");
  var has = Object.prototype.hasOwnProperty;
  var hasNativeMap = typeof Map !== "undefined";
  function ArraySet() {
    this._array = [];
    this._set = hasNativeMap ? new Map() : Object.create(null);
  }
  ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
    var set = new ArraySet();
    for (var i = 0, len = aArray.length; i < len; i++) {
      set.add(aArray[i], aAllowDuplicates);
    }
    return set;
  };
  ArraySet.prototype.size = function ArraySet_size() {
    return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
  };
  ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
    var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
    var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
    var idx = this._array.length;
    if (!isDuplicate || aAllowDuplicates) {
      this._array.push(aStr);
    }
    if (!isDuplicate) {
      if (hasNativeMap) {
        this._set.set(aStr, idx);
      } else {
        this._set[sStr] = idx;
      }
    }
  };
  ArraySet.prototype.has = function ArraySet_has(aStr) {
    if (hasNativeMap) {
      return this._set.has(aStr);
    } else {
      var sStr = util.toSetString(aStr);
      return has.call(this._set, sStr);
    }
  };
  ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
    if (hasNativeMap) {
      var idx = this._set.get(aStr);
      if (idx >= 0) {
        return idx;
      }
    } else {
      var sStr = util.toSetString(aStr);
      if (has.call(this._set, sStr)) {
        return this._set[sStr];
      }
    }
    throw new Error('"' + aStr + '" is not in the set.');
  };
  ArraySet.prototype.at = function ArraySet_at(aIdx) {
    if (aIdx >= 0 && aIdx < this._array.length) {
      return this._array[aIdx];
    }
    throw new Error("No element indexed by " + aIdx);
  };
  ArraySet.prototype.toArray = function ArraySet_toArray() {
    return this._array.slice();
  };
  exports.ArraySet = ArraySet;
}, {"./util": 19}], 11: [function(require2, module, exports) {
  var base64 = require2("./base64");
  var VLQ_BASE_SHIFT = 5;
  var VLQ_BASE = 1 << VLQ_BASE_SHIFT;
  var VLQ_BASE_MASK = VLQ_BASE - 1;
  var VLQ_CONTINUATION_BIT = VLQ_BASE;
  function toVLQSigned(aValue) {
    return aValue < 0 ? (-aValue << 1) + 1 : (aValue << 1) + 0;
  }
  function fromVLQSigned(aValue) {
    var isNegative = (aValue & 1) === 1;
    var shifted = aValue >> 1;
    return isNegative ? -shifted : shifted;
  }
  exports.encode = function base64VLQ_encode(aValue) {
    var encoded = "";
    var digit;
    var vlq = toVLQSigned(aValue);
    do {
      digit = vlq & VLQ_BASE_MASK;
      vlq >>>= VLQ_BASE_SHIFT;
      if (vlq > 0) {
        digit |= VLQ_CONTINUATION_BIT;
      }
      encoded += base64.encode(digit);
    } while (vlq > 0);
    return encoded;
  };
  exports.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
    var strLen = aStr.length;
    var result = 0;
    var shift = 0;
    var continuation, digit;
    do {
      if (aIndex >= strLen) {
        throw new Error("Expected more digits in base 64 VLQ value.");
      }
      digit = base64.decode(aStr.charCodeAt(aIndex++));
      if (digit === -1) {
        throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
      }
      continuation = !!(digit & VLQ_CONTINUATION_BIT);
      digit &= VLQ_BASE_MASK;
      result = result + (digit << shift);
      shift += VLQ_BASE_SHIFT;
    } while (continuation);
    aOutParam.value = fromVLQSigned(result);
    aOutParam.rest = aIndex;
  };
}, {"./base64": 12}], 12: [function(require2, module, exports) {
  var intToCharMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
  exports.encode = function(number) {
    if (0 <= number && number < intToCharMap.length) {
      return intToCharMap[number];
    }
    throw new TypeError("Must be between 0 and 63: " + number);
  };
  exports.decode = function(charCode) {
    var bigA = 65;
    var bigZ = 90;
    var littleA = 97;
    var littleZ = 122;
    var zero = 48;
    var nine = 57;
    var plus = 43;
    var slash = 47;
    var littleOffset = 26;
    var numberOffset = 52;
    if (bigA <= charCode && charCode <= bigZ) {
      return charCode - bigA;
    }
    if (littleA <= charCode && charCode <= littleZ) {
      return charCode - littleA + littleOffset;
    }
    if (zero <= charCode && charCode <= nine) {
      return charCode - zero + numberOffset;
    }
    if (charCode == plus) {
      return 62;
    }
    if (charCode == slash) {
      return 63;
    }
    return -1;
  };
}, {}], 13: [function(require2, module, exports) {
  exports.GREATEST_LOWER_BOUND = 1;
  exports.LEAST_UPPER_BOUND = 2;
  function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
    var mid = Math.floor((aHigh - aLow) / 2) + aLow;
    var cmp = aCompare(aNeedle, aHaystack[mid], true);
    if (cmp === 0) {
      return mid;
    } else if (cmp > 0) {
      if (aHigh - mid > 1) {
        return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
      }
      if (aBias == exports.LEAST_UPPER_BOUND) {
        return aHigh < aHaystack.length ? aHigh : -1;
      } else {
        return mid;
      }
    } else {
      if (mid - aLow > 1) {
        return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
      }
      if (aBias == exports.LEAST_UPPER_BOUND) {
        return mid;
      } else {
        return aLow < 0 ? -1 : aLow;
      }
    }
  }
  exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
    if (aHaystack.length === 0) {
      return -1;
    }
    var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack, aCompare, aBias || exports.GREATEST_LOWER_BOUND);
    if (index < 0) {
      return -1;
    }
    while (index - 1 >= 0) {
      if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
        break;
      }
      --index;
    }
    return index;
  };
}, {}], 14: [function(require2, module, exports) {
  var util = require2("./util");
  function generatedPositionAfter(mappingA, mappingB) {
    var lineA = mappingA.generatedLine;
    var lineB = mappingB.generatedLine;
    var columnA = mappingA.generatedColumn;
    var columnB = mappingB.generatedColumn;
    return lineB > lineA || lineB == lineA && columnB >= columnA || util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
  }
  function MappingList() {
    this._array = [];
    this._sorted = true;
    this._last = {generatedLine: -1, generatedColumn: 0};
  }
  MappingList.prototype.unsortedForEach = function MappingList_forEach(aCallback, aThisArg) {
    this._array.forEach(aCallback, aThisArg);
  };
  MappingList.prototype.add = function MappingList_add(aMapping) {
    if (generatedPositionAfter(this._last, aMapping)) {
      this._last = aMapping;
      this._array.push(aMapping);
    } else {
      this._sorted = false;
      this._array.push(aMapping);
    }
  };
  MappingList.prototype.toArray = function MappingList_toArray() {
    if (!this._sorted) {
      this._array.sort(util.compareByGeneratedPositionsInflated);
      this._sorted = true;
    }
    return this._array;
  };
  exports.MappingList = MappingList;
}, {"./util": 19}], 15: [function(require2, module, exports) {
  function swap(ary, x, y) {
    var temp = ary[x];
    ary[x] = ary[y];
    ary[y] = temp;
  }
  function randomIntInRange(low, high) {
    return Math.round(low + Math.random() * (high - low));
  }
  function doQuickSort(ary, comparator, p, r) {
    if (p < r) {
      var pivotIndex = randomIntInRange(p, r);
      var i = p - 1;
      swap(ary, pivotIndex, r);
      var pivot = ary[r];
      for (var j = p; j < r; j++) {
        if (comparator(ary[j], pivot) <= 0) {
          i += 1;
          swap(ary, i, j);
        }
      }
      swap(ary, i + 1, j);
      var q = i + 1;
      doQuickSort(ary, comparator, p, q - 1);
      doQuickSort(ary, comparator, q + 1, r);
    }
  }
  exports.quickSort = function(ary, comparator) {
    doQuickSort(ary, comparator, 0, ary.length - 1);
  };
}, {}], 16: [function(require2, module, exports) {
  var util = require2("./util");
  var binarySearch = require2("./binary-search");
  var ArraySet = require2("./array-set").ArraySet;
  var base64VLQ = require2("./base64-vlq");
  var quickSort = require2("./quick-sort").quickSort;
  function SourceMapConsumer(aSourceMap, aSourceMapURL) {
    var sourceMap = aSourceMap;
    if (typeof aSourceMap === "string") {
      sourceMap = util.parseSourceMapInput(aSourceMap);
    }
    return sourceMap.sections != null ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL) : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
  }
  SourceMapConsumer.fromSourceMap = function(aSourceMap, aSourceMapURL) {
    return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
  };
  SourceMapConsumer.prototype._version = 3;
  SourceMapConsumer.prototype.__generatedMappings = null;
  Object.defineProperty(SourceMapConsumer.prototype, "_generatedMappings", {
    configurable: true,
    enumerable: true,
    get: function() {
      if (!this.__generatedMappings) {
        this._parseMappings(this._mappings, this.sourceRoot);
      }
      return this.__generatedMappings;
    }
  });
  SourceMapConsumer.prototype.__originalMappings = null;
  Object.defineProperty(SourceMapConsumer.prototype, "_originalMappings", {
    configurable: true,
    enumerable: true,
    get: function() {
      if (!this.__originalMappings) {
        this._parseMappings(this._mappings, this.sourceRoot);
      }
      return this.__originalMappings;
    }
  });
  SourceMapConsumer.prototype._charIsMappingSeparator = function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
    var c = aStr.charAt(index);
    return c === ";" || c === ",";
  };
  SourceMapConsumer.prototype._parseMappings = function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    throw new Error("Subclasses must implement _parseMappings");
  };
  SourceMapConsumer.GENERATED_ORDER = 1;
  SourceMapConsumer.ORIGINAL_ORDER = 2;
  SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
  SourceMapConsumer.LEAST_UPPER_BOUND = 2;
  SourceMapConsumer.prototype.eachMapping = function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
    var context = aContext || null;
    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;
    var mappings;
    switch (order) {
      case SourceMapConsumer.GENERATED_ORDER:
        mappings = this._generatedMappings;
        break;
      case SourceMapConsumer.ORIGINAL_ORDER:
        mappings = this._originalMappings;
        break;
      default:
        throw new Error("Unknown order of iteration.");
    }
    var sourceRoot = this.sourceRoot;
    mappings.map(function(mapping) {
      var source = mapping.source === null ? null : this._sources.at(mapping.source);
      source = util.computeSourceURL(sourceRoot, source, this._sourceMapURL);
      return {
        source,
        generatedLine: mapping.generatedLine,
        generatedColumn: mapping.generatedColumn,
        originalLine: mapping.originalLine,
        originalColumn: mapping.originalColumn,
        name: mapping.name === null ? null : this._names.at(mapping.name)
      };
    }, this).forEach(aCallback, context);
  };
  SourceMapConsumer.prototype.allGeneratedPositionsFor = function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
    var line = util.getArg(aArgs, "line");
    var needle = {
      source: util.getArg(aArgs, "source"),
      originalLine: line,
      originalColumn: util.getArg(aArgs, "column", 0)
    };
    needle.source = this._findSourceIndex(needle.source);
    if (needle.source < 0) {
      return [];
    }
    var mappings = [];
    var index = this._findMapping(needle, this._originalMappings, "originalLine", "originalColumn", util.compareByOriginalPositions, binarySearch.LEAST_UPPER_BOUND);
    if (index >= 0) {
      var mapping = this._originalMappings[index];
      if (aArgs.column === void 0) {
        var originalLine = mapping.originalLine;
        while (mapping && mapping.originalLine === originalLine) {
          mappings.push({
            line: util.getArg(mapping, "generatedLine", null),
            column: util.getArg(mapping, "generatedColumn", null),
            lastColumn: util.getArg(mapping, "lastGeneratedColumn", null)
          });
          mapping = this._originalMappings[++index];
        }
      } else {
        var originalColumn = mapping.originalColumn;
        while (mapping && mapping.originalLine === line && mapping.originalColumn == originalColumn) {
          mappings.push({
            line: util.getArg(mapping, "generatedLine", null),
            column: util.getArg(mapping, "generatedColumn", null),
            lastColumn: util.getArg(mapping, "lastGeneratedColumn", null)
          });
          mapping = this._originalMappings[++index];
        }
      }
    }
    return mappings;
  };
  exports.SourceMapConsumer = SourceMapConsumer;
  function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
    var sourceMap = aSourceMap;
    if (typeof aSourceMap === "string") {
      sourceMap = util.parseSourceMapInput(aSourceMap);
    }
    var version = util.getArg(sourceMap, "version");
    var sources = util.getArg(sourceMap, "sources");
    var names = util.getArg(sourceMap, "names", []);
    var sourceRoot = util.getArg(sourceMap, "sourceRoot", null);
    var sourcesContent = util.getArg(sourceMap, "sourcesContent", null);
    var mappings = util.getArg(sourceMap, "mappings");
    var file = util.getArg(sourceMap, "file", null);
    if (version != this._version) {
      throw new Error("Unsupported version: " + version);
    }
    if (sourceRoot) {
      sourceRoot = util.normalize(sourceRoot);
    }
    sources = sources.map(String).map(util.normalize).map(function(source) {
      return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source) ? util.relative(sourceRoot, source) : source;
    });
    this._names = ArraySet.fromArray(names.map(String), true);
    this._sources = ArraySet.fromArray(sources, true);
    this._absoluteSources = this._sources.toArray().map(function(s) {
      return util.computeSourceURL(sourceRoot, s, aSourceMapURL);
    });
    this.sourceRoot = sourceRoot;
    this.sourcesContent = sourcesContent;
    this._mappings = mappings;
    this._sourceMapURL = aSourceMapURL;
    this.file = file;
  }
  BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
  BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;
  BasicSourceMapConsumer.prototype._findSourceIndex = function(aSource) {
    var relativeSource = aSource;
    if (this.sourceRoot != null) {
      relativeSource = util.relative(this.sourceRoot, relativeSource);
    }
    if (this._sources.has(relativeSource)) {
      return this._sources.indexOf(relativeSource);
    }
    var i;
    for (i = 0; i < this._absoluteSources.length; ++i) {
      if (this._absoluteSources[i] == aSource) {
        return i;
      }
    }
    return -1;
  };
  BasicSourceMapConsumer.fromSourceMap = function SourceMapConsumer_fromSourceMap(aSourceMap, aSourceMapURL) {
    var smc = Object.create(BasicSourceMapConsumer.prototype);
    var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
    var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
    smc.sourceRoot = aSourceMap._sourceRoot;
    smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(), smc.sourceRoot);
    smc.file = aSourceMap._file;
    smc._sourceMapURL = aSourceMapURL;
    smc._absoluteSources = smc._sources.toArray().map(function(s) {
      return util.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
    });
    var generatedMappings = aSourceMap._mappings.toArray().slice();
    var destGeneratedMappings = smc.__generatedMappings = [];
    var destOriginalMappings = smc.__originalMappings = [];
    for (var i = 0, length = generatedMappings.length; i < length; i++) {
      var srcMapping = generatedMappings[i];
      var destMapping = new Mapping();
      destMapping.generatedLine = srcMapping.generatedLine;
      destMapping.generatedColumn = srcMapping.generatedColumn;
      if (srcMapping.source) {
        destMapping.source = sources.indexOf(srcMapping.source);
        destMapping.originalLine = srcMapping.originalLine;
        destMapping.originalColumn = srcMapping.originalColumn;
        if (srcMapping.name) {
          destMapping.name = names.indexOf(srcMapping.name);
        }
        destOriginalMappings.push(destMapping);
      }
      destGeneratedMappings.push(destMapping);
    }
    quickSort(smc.__originalMappings, util.compareByOriginalPositions);
    return smc;
  };
  BasicSourceMapConsumer.prototype._version = 3;
  Object.defineProperty(BasicSourceMapConsumer.prototype, "sources", {
    get: function() {
      return this._absoluteSources.slice();
    }
  });
  function Mapping() {
    this.generatedLine = 0;
    this.generatedColumn = 0;
    this.source = null;
    this.originalLine = null;
    this.originalColumn = null;
    this.name = null;
  }
  BasicSourceMapConsumer.prototype._parseMappings = function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    var generatedLine = 1;
    var previousGeneratedColumn = 0;
    var previousOriginalLine = 0;
    var previousOriginalColumn = 0;
    var previousSource = 0;
    var previousName = 0;
    var length = aStr.length;
    var index = 0;
    var cachedSegments = {};
    var temp = {};
    var originalMappings = [];
    var generatedMappings = [];
    var mapping, str, segment, end, value;
    while (index < length) {
      if (aStr.charAt(index) === ";") {
        generatedLine++;
        index++;
        previousGeneratedColumn = 0;
      } else if (aStr.charAt(index) === ",") {
        index++;
      } else {
        mapping = new Mapping();
        mapping.generatedLine = generatedLine;
        for (end = index; end < length; end++) {
          if (this._charIsMappingSeparator(aStr, end)) {
            break;
          }
        }
        str = aStr.slice(index, end);
        segment = cachedSegments[str];
        if (segment) {
          index += str.length;
        } else {
          segment = [];
          while (index < end) {
            base64VLQ.decode(aStr, index, temp);
            value = temp.value;
            index = temp.rest;
            segment.push(value);
          }
          if (segment.length === 2) {
            throw new Error("Found a source, but no line and column");
          }
          if (segment.length === 3) {
            throw new Error("Found a source and line, but no column");
          }
          cachedSegments[str] = segment;
        }
        mapping.generatedColumn = previousGeneratedColumn + segment[0];
        previousGeneratedColumn = mapping.generatedColumn;
        if (segment.length > 1) {
          mapping.source = previousSource + segment[1];
          previousSource += segment[1];
          mapping.originalLine = previousOriginalLine + segment[2];
          previousOriginalLine = mapping.originalLine;
          mapping.originalLine += 1;
          mapping.originalColumn = previousOriginalColumn + segment[3];
          previousOriginalColumn = mapping.originalColumn;
          if (segment.length > 4) {
            mapping.name = previousName + segment[4];
            previousName += segment[4];
          }
        }
        generatedMappings.push(mapping);
        if (typeof mapping.originalLine === "number") {
          originalMappings.push(mapping);
        }
      }
    }
    quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
    this.__generatedMappings = generatedMappings;
    quickSort(originalMappings, util.compareByOriginalPositions);
    this.__originalMappings = originalMappings;
  };
  BasicSourceMapConsumer.prototype._findMapping = function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName, aColumnName, aComparator, aBias) {
    if (aNeedle[aLineName] <= 0) {
      throw new TypeError("Line must be greater than or equal to 1, got " + aNeedle[aLineName]);
    }
    if (aNeedle[aColumnName] < 0) {
      throw new TypeError("Column must be greater than or equal to 0, got " + aNeedle[aColumnName]);
    }
    return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
  };
  BasicSourceMapConsumer.prototype.computeColumnSpans = function SourceMapConsumer_computeColumnSpans() {
    for (var index = 0; index < this._generatedMappings.length; ++index) {
      var mapping = this._generatedMappings[index];
      if (index + 1 < this._generatedMappings.length) {
        var nextMapping = this._generatedMappings[index + 1];
        if (mapping.generatedLine === nextMapping.generatedLine) {
          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
          continue;
        }
      }
      mapping.lastGeneratedColumn = Infinity;
    }
  };
  BasicSourceMapConsumer.prototype.originalPositionFor = function SourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, "line"),
      generatedColumn: util.getArg(aArgs, "column")
    };
    var index = this._findMapping(needle, this._generatedMappings, "generatedLine", "generatedColumn", util.compareByGeneratedPositionsDeflated, util.getArg(aArgs, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND));
    if (index >= 0) {
      var mapping = this._generatedMappings[index];
      if (mapping.generatedLine === needle.generatedLine) {
        var source = util.getArg(mapping, "source", null);
        if (source !== null) {
          source = this._sources.at(source);
          source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
        }
        var name = util.getArg(mapping, "name", null);
        if (name !== null) {
          name = this._names.at(name);
        }
        return {
          source,
          line: util.getArg(mapping, "originalLine", null),
          column: util.getArg(mapping, "originalColumn", null),
          name
        };
      }
    }
    return {
      source: null,
      line: null,
      column: null,
      name: null
    };
  };
  BasicSourceMapConsumer.prototype.hasContentsOfAllSources = function BasicSourceMapConsumer_hasContentsOfAllSources() {
    if (!this.sourcesContent) {
      return false;
    }
    return this.sourcesContent.length >= this._sources.size() && !this.sourcesContent.some(function(sc) {
      return sc == null;
    });
  };
  BasicSourceMapConsumer.prototype.sourceContentFor = function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    if (!this.sourcesContent) {
      return null;
    }
    var index = this._findSourceIndex(aSource);
    if (index >= 0) {
      return this.sourcesContent[index];
    }
    var relativeSource = aSource;
    if (this.sourceRoot != null) {
      relativeSource = util.relative(this.sourceRoot, relativeSource);
    }
    var url;
    if (this.sourceRoot != null && (url = util.urlParse(this.sourceRoot))) {
      var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
      if (url.scheme == "file" && this._sources.has(fileUriAbsPath)) {
        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)];
      }
      if ((!url.path || url.path == "/") && this._sources.has("/" + relativeSource)) {
        return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
      }
    }
    if (nullOnMissing) {
      return null;
    } else {
      throw new Error('"' + relativeSource + '" is not in the SourceMap.');
    }
  };
  BasicSourceMapConsumer.prototype.generatedPositionFor = function SourceMapConsumer_generatedPositionFor(aArgs) {
    var source = util.getArg(aArgs, "source");
    source = this._findSourceIndex(source);
    if (source < 0) {
      return {
        line: null,
        column: null,
        lastColumn: null
      };
    }
    var needle = {
      source,
      originalLine: util.getArg(aArgs, "line"),
      originalColumn: util.getArg(aArgs, "column")
    };
    var index = this._findMapping(needle, this._originalMappings, "originalLine", "originalColumn", util.compareByOriginalPositions, util.getArg(aArgs, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND));
    if (index >= 0) {
      var mapping = this._originalMappings[index];
      if (mapping.source === needle.source) {
        return {
          line: util.getArg(mapping, "generatedLine", null),
          column: util.getArg(mapping, "generatedColumn", null),
          lastColumn: util.getArg(mapping, "lastGeneratedColumn", null)
        };
      }
    }
    return {
      line: null,
      column: null,
      lastColumn: null
    };
  };
  exports.BasicSourceMapConsumer = BasicSourceMapConsumer;
  function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
    var sourceMap = aSourceMap;
    if (typeof aSourceMap === "string") {
      sourceMap = util.parseSourceMapInput(aSourceMap);
    }
    var version = util.getArg(sourceMap, "version");
    var sections = util.getArg(sourceMap, "sections");
    if (version != this._version) {
      throw new Error("Unsupported version: " + version);
    }
    this._sources = new ArraySet();
    this._names = new ArraySet();
    var lastOffset = {
      line: -1,
      column: 0
    };
    this._sections = sections.map(function(s) {
      if (s.url) {
        throw new Error("Support for url field in sections not implemented.");
      }
      var offset = util.getArg(s, "offset");
      var offsetLine = util.getArg(offset, "line");
      var offsetColumn = util.getArg(offset, "column");
      if (offsetLine < lastOffset.line || offsetLine === lastOffset.line && offsetColumn < lastOffset.column) {
        throw new Error("Section offsets must be ordered and non-overlapping.");
      }
      lastOffset = offset;
      return {
        generatedOffset: {
          generatedLine: offsetLine + 1,
          generatedColumn: offsetColumn + 1
        },
        consumer: new SourceMapConsumer(util.getArg(s, "map"), aSourceMapURL)
      };
    });
  }
  IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
  IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;
  IndexedSourceMapConsumer.prototype._version = 3;
  Object.defineProperty(IndexedSourceMapConsumer.prototype, "sources", {
    get: function() {
      var sources = [];
      for (var i = 0; i < this._sections.length; i++) {
        for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
          sources.push(this._sections[i].consumer.sources[j]);
        }
      }
      return sources;
    }
  });
  IndexedSourceMapConsumer.prototype.originalPositionFor = function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, "line"),
      generatedColumn: util.getArg(aArgs, "column")
    };
    var sectionIndex = binarySearch.search(needle, this._sections, function(needle2, section2) {
      var cmp = needle2.generatedLine - section2.generatedOffset.generatedLine;
      if (cmp) {
        return cmp;
      }
      return needle2.generatedColumn - section2.generatedOffset.generatedColumn;
    });
    var section = this._sections[sectionIndex];
    if (!section) {
      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    }
    return section.consumer.originalPositionFor({
      line: needle.generatedLine - (section.generatedOffset.generatedLine - 1),
      column: needle.generatedColumn - (section.generatedOffset.generatedLine === needle.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
      bias: aArgs.bias
    });
  };
  IndexedSourceMapConsumer.prototype.hasContentsOfAllSources = function IndexedSourceMapConsumer_hasContentsOfAllSources() {
    return this._sections.every(function(s) {
      return s.consumer.hasContentsOfAllSources();
    });
  };
  IndexedSourceMapConsumer.prototype.sourceContentFor = function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];
      var content = section.consumer.sourceContentFor(aSource, true);
      if (content) {
        return content;
      }
    }
    if (nullOnMissing) {
      return null;
    } else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };
  IndexedSourceMapConsumer.prototype.generatedPositionFor = function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];
      if (section.consumer._findSourceIndex(util.getArg(aArgs, "source")) === -1) {
        continue;
      }
      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
      if (generatedPosition) {
        var ret = {
          line: generatedPosition.line + (section.generatedOffset.generatedLine - 1),
          column: generatedPosition.column + (section.generatedOffset.generatedLine === generatedPosition.line ? section.generatedOffset.generatedColumn - 1 : 0)
        };
        return ret;
      }
    }
    return {
      line: null,
      column: null
    };
  };
  IndexedSourceMapConsumer.prototype._parseMappings = function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    this.__generatedMappings = [];
    this.__originalMappings = [];
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];
      var sectionMappings = section.consumer._generatedMappings;
      for (var j = 0; j < sectionMappings.length; j++) {
        var mapping = sectionMappings[j];
        var source = section.consumer._sources.at(mapping.source);
        source = util.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);
        this._sources.add(source);
        source = this._sources.indexOf(source);
        var name = null;
        if (mapping.name) {
          name = section.consumer._names.at(mapping.name);
          this._names.add(name);
          name = this._names.indexOf(name);
        }
        var adjustedMapping = {
          source,
          generatedLine: mapping.generatedLine + (section.generatedOffset.generatedLine - 1),
          generatedColumn: mapping.generatedColumn + (section.generatedOffset.generatedLine === mapping.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name
        };
        this.__generatedMappings.push(adjustedMapping);
        if (typeof adjustedMapping.originalLine === "number") {
          this.__originalMappings.push(adjustedMapping);
        }
      }
    }
    quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
    quickSort(this.__originalMappings, util.compareByOriginalPositions);
  };
  exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;
}, {"./array-set": 10, "./base64-vlq": 11, "./binary-search": 13, "./quick-sort": 15, "./util": 19}], 17: [function(require2, module, exports) {
  var base64VLQ = require2("./base64-vlq");
  var util = require2("./util");
  var ArraySet = require2("./array-set").ArraySet;
  var MappingList = require2("./mapping-list").MappingList;
  function SourceMapGenerator(aArgs) {
    if (!aArgs) {
      aArgs = {};
    }
    this._file = util.getArg(aArgs, "file", null);
    this._sourceRoot = util.getArg(aArgs, "sourceRoot", null);
    this._skipValidation = util.getArg(aArgs, "skipValidation", false);
    this._sources = new ArraySet();
    this._names = new ArraySet();
    this._mappings = new MappingList();
    this._sourcesContents = null;
  }
  SourceMapGenerator.prototype._version = 3;
  SourceMapGenerator.fromSourceMap = function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
    var sourceRoot = aSourceMapConsumer.sourceRoot;
    var generator = new SourceMapGenerator({
      file: aSourceMapConsumer.file,
      sourceRoot
    });
    aSourceMapConsumer.eachMapping(function(mapping) {
      var newMapping = {
        generated: {
          line: mapping.generatedLine,
          column: mapping.generatedColumn
        }
      };
      if (mapping.source != null) {
        newMapping.source = mapping.source;
        if (sourceRoot != null) {
          newMapping.source = util.relative(sourceRoot, newMapping.source);
        }
        newMapping.original = {
          line: mapping.originalLine,
          column: mapping.originalColumn
        };
        if (mapping.name != null) {
          newMapping.name = mapping.name;
        }
      }
      generator.addMapping(newMapping);
    });
    aSourceMapConsumer.sources.forEach(function(sourceFile) {
      var sourceRelative = sourceFile;
      if (sourceRoot !== null) {
        sourceRelative = util.relative(sourceRoot, sourceFile);
      }
      if (!generator._sources.has(sourceRelative)) {
        generator._sources.add(sourceRelative);
      }
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        generator.setSourceContent(sourceFile, content);
      }
    });
    return generator;
  };
  SourceMapGenerator.prototype.addMapping = function SourceMapGenerator_addMapping(aArgs) {
    var generated = util.getArg(aArgs, "generated");
    var original = util.getArg(aArgs, "original", null);
    var source = util.getArg(aArgs, "source", null);
    var name = util.getArg(aArgs, "name", null);
    if (!this._skipValidation) {
      this._validateMapping(generated, original, source, name);
    }
    if (source != null) {
      source = String(source);
      if (!this._sources.has(source)) {
        this._sources.add(source);
      }
    }
    if (name != null) {
      name = String(name);
      if (!this._names.has(name)) {
        this._names.add(name);
      }
    }
    this._mappings.add({
      generatedLine: generated.line,
      generatedColumn: generated.column,
      originalLine: original != null && original.line,
      originalColumn: original != null && original.column,
      source,
      name
    });
  };
  SourceMapGenerator.prototype.setSourceContent = function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
    var source = aSourceFile;
    if (this._sourceRoot != null) {
      source = util.relative(this._sourceRoot, source);
    }
    if (aSourceContent != null) {
      if (!this._sourcesContents) {
        this._sourcesContents = Object.create(null);
      }
      this._sourcesContents[util.toSetString(source)] = aSourceContent;
    } else if (this._sourcesContents) {
      delete this._sourcesContents[util.toSetString(source)];
      if (Object.keys(this._sourcesContents).length === 0) {
        this._sourcesContents = null;
      }
    }
  };
  SourceMapGenerator.prototype.applySourceMap = function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
    var sourceFile = aSourceFile;
    if (aSourceFile == null) {
      if (aSourceMapConsumer.file == null) {
        throw new Error(`SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map's "file" property. Both were omitted.`);
      }
      sourceFile = aSourceMapConsumer.file;
    }
    var sourceRoot = this._sourceRoot;
    if (sourceRoot != null) {
      sourceFile = util.relative(sourceRoot, sourceFile);
    }
    var newSources = new ArraySet();
    var newNames = new ArraySet();
    this._mappings.unsortedForEach(function(mapping) {
      if (mapping.source === sourceFile && mapping.originalLine != null) {
        var original = aSourceMapConsumer.originalPositionFor({
          line: mapping.originalLine,
          column: mapping.originalColumn
        });
        if (original.source != null) {
          mapping.source = original.source;
          if (aSourceMapPath != null) {
            mapping.source = util.join(aSourceMapPath, mapping.source);
          }
          if (sourceRoot != null) {
            mapping.source = util.relative(sourceRoot, mapping.source);
          }
          mapping.originalLine = original.line;
          mapping.originalColumn = original.column;
          if (original.name != null) {
            mapping.name = original.name;
          }
        }
      }
      var source = mapping.source;
      if (source != null && !newSources.has(source)) {
        newSources.add(source);
      }
      var name = mapping.name;
      if (name != null && !newNames.has(name)) {
        newNames.add(name);
      }
    }, this);
    this._sources = newSources;
    this._names = newNames;
    aSourceMapConsumer.sources.forEach(function(sourceFile2) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile2);
      if (content != null) {
        if (aSourceMapPath != null) {
          sourceFile2 = util.join(aSourceMapPath, sourceFile2);
        }
        if (sourceRoot != null) {
          sourceFile2 = util.relative(sourceRoot, sourceFile2);
        }
        this.setSourceContent(sourceFile2, content);
      }
    }, this);
  };
  SourceMapGenerator.prototype._validateMapping = function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource, aName) {
    if (aOriginal && typeof aOriginal.line !== "number" && typeof aOriginal.column !== "number") {
      throw new Error("original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.");
    }
    if (aGenerated && "line" in aGenerated && "column" in aGenerated && aGenerated.line > 0 && aGenerated.column >= 0 && !aOriginal && !aSource && !aName) {
      return;
    } else if (aGenerated && "line" in aGenerated && "column" in aGenerated && aOriginal && "line" in aOriginal && "column" in aOriginal && aGenerated.line > 0 && aGenerated.column >= 0 && aOriginal.line > 0 && aOriginal.column >= 0 && aSource) {
      return;
    } else {
      throw new Error("Invalid mapping: " + JSON.stringify({
        generated: aGenerated,
        source: aSource,
        original: aOriginal,
        name: aName
      }));
    }
  };
  SourceMapGenerator.prototype._serializeMappings = function SourceMapGenerator_serializeMappings() {
    var previousGeneratedColumn = 0;
    var previousGeneratedLine = 1;
    var previousOriginalColumn = 0;
    var previousOriginalLine = 0;
    var previousName = 0;
    var previousSource = 0;
    var result = "";
    var next;
    var mapping;
    var nameIdx;
    var sourceIdx;
    var mappings = this._mappings.toArray();
    for (var i = 0, len = mappings.length; i < len; i++) {
      mapping = mappings[i];
      next = "";
      if (mapping.generatedLine !== previousGeneratedLine) {
        previousGeneratedColumn = 0;
        while (mapping.generatedLine !== previousGeneratedLine) {
          next += ";";
          previousGeneratedLine++;
        }
      } else {
        if (i > 0) {
          if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
            continue;
          }
          next += ",";
        }
      }
      next += base64VLQ.encode(mapping.generatedColumn - previousGeneratedColumn);
      previousGeneratedColumn = mapping.generatedColumn;
      if (mapping.source != null) {
        sourceIdx = this._sources.indexOf(mapping.source);
        next += base64VLQ.encode(sourceIdx - previousSource);
        previousSource = sourceIdx;
        next += base64VLQ.encode(mapping.originalLine - 1 - previousOriginalLine);
        previousOriginalLine = mapping.originalLine - 1;
        next += base64VLQ.encode(mapping.originalColumn - previousOriginalColumn);
        previousOriginalColumn = mapping.originalColumn;
        if (mapping.name != null) {
          nameIdx = this._names.indexOf(mapping.name);
          next += base64VLQ.encode(nameIdx - previousName);
          previousName = nameIdx;
        }
      }
      result += next;
    }
    return result;
  };
  SourceMapGenerator.prototype._generateSourcesContent = function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
    return aSources.map(function(source) {
      if (!this._sourcesContents) {
        return null;
      }
      if (aSourceRoot != null) {
        source = util.relative(aSourceRoot, source);
      }
      var key = util.toSetString(source);
      return Object.prototype.hasOwnProperty.call(this._sourcesContents, key) ? this._sourcesContents[key] : null;
    }, this);
  };
  SourceMapGenerator.prototype.toJSON = function SourceMapGenerator_toJSON() {
    var map = {
      version: this._version,
      sources: this._sources.toArray(),
      names: this._names.toArray(),
      mappings: this._serializeMappings()
    };
    if (this._file != null) {
      map.file = this._file;
    }
    if (this._sourceRoot != null) {
      map.sourceRoot = this._sourceRoot;
    }
    if (this._sourcesContents) {
      map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
    }
    return map;
  };
  SourceMapGenerator.prototype.toString = function SourceMapGenerator_toString() {
    return JSON.stringify(this.toJSON());
  };
  exports.SourceMapGenerator = SourceMapGenerator;
}, {"./array-set": 10, "./base64-vlq": 11, "./mapping-list": 14, "./util": 19}], 18: [function(require2, module, exports) {
  var SourceMapGenerator = require2("./source-map-generator").SourceMapGenerator;
  var util = require2("./util");
  var REGEX_NEWLINE = /(\r?\n)/;
  var NEWLINE_CODE = 10;
  var isSourceNode = "$$$isSourceNode$$$";
  function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
    this.children = [];
    this.sourceContents = {};
    this.line = aLine == null ? null : aLine;
    this.column = aColumn == null ? null : aColumn;
    this.source = aSource == null ? null : aSource;
    this.name = aName == null ? null : aName;
    this[isSourceNode] = true;
    if (aChunks != null)
      this.add(aChunks);
  }
  SourceNode.fromStringWithSourceMap = function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
    var node = new SourceNode();
    var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
    var remainingLinesIndex = 0;
    var shiftNextLine = function() {
      var lineContents = getNextLine();
      var newLine = getNextLine() || "";
      return lineContents + newLine;
      function getNextLine() {
        return remainingLinesIndex < remainingLines.length ? remainingLines[remainingLinesIndex++] : void 0;
      }
    };
    var lastGeneratedLine = 1, lastGeneratedColumn = 0;
    var lastMapping = null;
    aSourceMapConsumer.eachMapping(function(mapping) {
      if (lastMapping !== null) {
        if (lastGeneratedLine < mapping.generatedLine) {
          addMappingWithCode(lastMapping, shiftNextLine());
          lastGeneratedLine++;
          lastGeneratedColumn = 0;
        } else {
          var nextLine = remainingLines[remainingLinesIndex] || "";
          var code = nextLine.substr(0, mapping.generatedColumn - lastGeneratedColumn);
          remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn - lastGeneratedColumn);
          lastGeneratedColumn = mapping.generatedColumn;
          addMappingWithCode(lastMapping, code);
          lastMapping = mapping;
          return;
        }
      }
      while (lastGeneratedLine < mapping.generatedLine) {
        node.add(shiftNextLine());
        lastGeneratedLine++;
      }
      if (lastGeneratedColumn < mapping.generatedColumn) {
        var nextLine = remainingLines[remainingLinesIndex] || "";
        node.add(nextLine.substr(0, mapping.generatedColumn));
        remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn);
        lastGeneratedColumn = mapping.generatedColumn;
      }
      lastMapping = mapping;
    }, this);
    if (remainingLinesIndex < remainingLines.length) {
      if (lastMapping) {
        addMappingWithCode(lastMapping, shiftNextLine());
      }
      node.add(remainingLines.splice(remainingLinesIndex).join(""));
    }
    aSourceMapConsumer.sources.forEach(function(sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aRelativePath != null) {
          sourceFile = util.join(aRelativePath, sourceFile);
        }
        node.setSourceContent(sourceFile, content);
      }
    });
    return node;
    function addMappingWithCode(mapping, code) {
      if (mapping === null || mapping.source === void 0) {
        node.add(code);
      } else {
        var source = aRelativePath ? util.join(aRelativePath, mapping.source) : mapping.source;
        node.add(new SourceNode(mapping.originalLine, mapping.originalColumn, source, code, mapping.name));
      }
    }
  };
  SourceNode.prototype.add = function SourceNode_add(aChunk) {
    if (Array.isArray(aChunk)) {
      aChunk.forEach(function(chunk) {
        this.add(chunk);
      }, this);
    } else if (aChunk[isSourceNode] || typeof aChunk === "string") {
      if (aChunk) {
        this.children.push(aChunk);
      }
    } else {
      throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk);
    }
    return this;
  };
  SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
    if (Array.isArray(aChunk)) {
      for (var i = aChunk.length - 1; i >= 0; i--) {
        this.prepend(aChunk[i]);
      }
    } else if (aChunk[isSourceNode] || typeof aChunk === "string") {
      this.children.unshift(aChunk);
    } else {
      throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk);
    }
    return this;
  };
  SourceNode.prototype.walk = function SourceNode_walk(aFn) {
    var chunk;
    for (var i = 0, len = this.children.length; i < len; i++) {
      chunk = this.children[i];
      if (chunk[isSourceNode]) {
        chunk.walk(aFn);
      } else {
        if (chunk !== "") {
          aFn(chunk, {
            source: this.source,
            line: this.line,
            column: this.column,
            name: this.name
          });
        }
      }
    }
  };
  SourceNode.prototype.join = function SourceNode_join(aSep) {
    var newChildren;
    var i;
    var len = this.children.length;
    if (len > 0) {
      newChildren = [];
      for (i = 0; i < len - 1; i++) {
        newChildren.push(this.children[i]);
        newChildren.push(aSep);
      }
      newChildren.push(this.children[i]);
      this.children = newChildren;
    }
    return this;
  };
  SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
    var lastChild = this.children[this.children.length - 1];
    if (lastChild[isSourceNode]) {
      lastChild.replaceRight(aPattern, aReplacement);
    } else if (typeof lastChild === "string") {
      this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
    } else {
      this.children.push("".replace(aPattern, aReplacement));
    }
    return this;
  };
  SourceNode.prototype.setSourceContent = function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
    this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
  };
  SourceNode.prototype.walkSourceContents = function SourceNode_walkSourceContents(aFn) {
    for (var i = 0, len = this.children.length; i < len; i++) {
      if (this.children[i][isSourceNode]) {
        this.children[i].walkSourceContents(aFn);
      }
    }
    var sources = Object.keys(this.sourceContents);
    for (var i = 0, len = sources.length; i < len; i++) {
      aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
    }
  };
  SourceNode.prototype.toString = function SourceNode_toString() {
    var str = "";
    this.walk(function(chunk) {
      str += chunk;
    });
    return str;
  };
  SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
    var generated = {
      code: "",
      line: 1,
      column: 0
    };
    var map = new SourceMapGenerator(aArgs);
    var sourceMappingActive = false;
    var lastOriginalSource = null;
    var lastOriginalLine = null;
    var lastOriginalColumn = null;
    var lastOriginalName = null;
    this.walk(function(chunk, original) {
      generated.code += chunk;
      if (original.source !== null && original.line !== null && original.column !== null) {
        if (lastOriginalSource !== original.source || lastOriginalLine !== original.line || lastOriginalColumn !== original.column || lastOriginalName !== original.name) {
          map.addMapping({
            source: original.source,
            original: {
              line: original.line,
              column: original.column
            },
            generated: {
              line: generated.line,
              column: generated.column
            },
            name: original.name
          });
        }
        lastOriginalSource = original.source;
        lastOriginalLine = original.line;
        lastOriginalColumn = original.column;
        lastOriginalName = original.name;
        sourceMappingActive = true;
      } else if (sourceMappingActive) {
        map.addMapping({
          generated: {
            line: generated.line,
            column: generated.column
          }
        });
        lastOriginalSource = null;
        sourceMappingActive = false;
      }
      for (var idx = 0, length = chunk.length; idx < length; idx++) {
        if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
          generated.line++;
          generated.column = 0;
          if (idx + 1 === length) {
            lastOriginalSource = null;
            sourceMappingActive = false;
          } else if (sourceMappingActive) {
            map.addMapping({
              source: original.source,
              original: {
                line: original.line,
                column: original.column
              },
              generated: {
                line: generated.line,
                column: generated.column
              },
              name: original.name
            });
          }
        } else {
          generated.column++;
        }
      }
    });
    this.walkSourceContents(function(sourceFile, sourceContent) {
      map.setSourceContent(sourceFile, sourceContent);
    });
    return {code: generated.code, map};
  };
  exports.SourceNode = SourceNode;
}, {"./source-map-generator": 17, "./util": 19}], 19: [function(require2, module, exports) {
  function getArg(aArgs, aName, aDefaultValue) {
    if (aName in aArgs) {
      return aArgs[aName];
    } else if (arguments.length === 3) {
      return aDefaultValue;
    } else {
      throw new Error('"' + aName + '" is a required argument.');
    }
  }
  exports.getArg = getArg;
  var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
  var dataUrlRegexp = /^data:.+\,.+$/;
  function urlParse(aUrl) {
    var match = aUrl.match(urlRegexp);
    if (!match) {
      return null;
    }
    return {
      scheme: match[1],
      auth: match[2],
      host: match[3],
      port: match[4],
      path: match[5]
    };
  }
  exports.urlParse = urlParse;
  function urlGenerate(aParsedUrl) {
    var url = "";
    if (aParsedUrl.scheme) {
      url += aParsedUrl.scheme + ":";
    }
    url += "//";
    if (aParsedUrl.auth) {
      url += aParsedUrl.auth + "@";
    }
    if (aParsedUrl.host) {
      url += aParsedUrl.host;
    }
    if (aParsedUrl.port) {
      url += ":" + aParsedUrl.port;
    }
    if (aParsedUrl.path) {
      url += aParsedUrl.path;
    }
    return url;
  }
  exports.urlGenerate = urlGenerate;
  function normalize(aPath) {
    var path = aPath;
    var url = urlParse(aPath);
    if (url) {
      if (!url.path) {
        return aPath;
      }
      path = url.path;
    }
    var isAbsolute = exports.isAbsolute(path);
    var parts = path.split(/\/+/);
    for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
      part = parts[i];
      if (part === ".") {
        parts.splice(i, 1);
      } else if (part === "..") {
        up++;
      } else if (up > 0) {
        if (part === "") {
          parts.splice(i + 1, up);
          up = 0;
        } else {
          parts.splice(i, 2);
          up--;
        }
      }
    }
    path = parts.join("/");
    if (path === "") {
      path = isAbsolute ? "/" : ".";
    }
    if (url) {
      url.path = path;
      return urlGenerate(url);
    }
    return path;
  }
  exports.normalize = normalize;
  function join(aRoot, aPath) {
    if (aRoot === "") {
      aRoot = ".";
    }
    if (aPath === "") {
      aPath = ".";
    }
    var aPathUrl = urlParse(aPath);
    var aRootUrl = urlParse(aRoot);
    if (aRootUrl) {
      aRoot = aRootUrl.path || "/";
    }
    if (aPathUrl && !aPathUrl.scheme) {
      if (aRootUrl) {
        aPathUrl.scheme = aRootUrl.scheme;
      }
      return urlGenerate(aPathUrl);
    }
    if (aPathUrl || aPath.match(dataUrlRegexp)) {
      return aPath;
    }
    if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
      aRootUrl.host = aPath;
      return urlGenerate(aRootUrl);
    }
    var joined = aPath.charAt(0) === "/" ? aPath : normalize(aRoot.replace(/\/+$/, "") + "/" + aPath);
    if (aRootUrl) {
      aRootUrl.path = joined;
      return urlGenerate(aRootUrl);
    }
    return joined;
  }
  exports.join = join;
  exports.isAbsolute = function(aPath) {
    return aPath.charAt(0) === "/" || urlRegexp.test(aPath);
  };
  function relative(aRoot, aPath) {
    if (aRoot === "") {
      aRoot = ".";
    }
    aRoot = aRoot.replace(/\/$/, "");
    var level = 0;
    while (aPath.indexOf(aRoot + "/") !== 0) {
      var index = aRoot.lastIndexOf("/");
      if (index < 0) {
        return aPath;
      }
      aRoot = aRoot.slice(0, index);
      if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
        return aPath;
      }
      ++level;
    }
    return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
  }
  exports.relative = relative;
  var supportsNullProto = function() {
    var obj = Object.create(null);
    return !("__proto__" in obj);
  }();
  function identity(s) {
    return s;
  }
  function toSetString(aStr) {
    if (isProtoString(aStr)) {
      return "$" + aStr;
    }
    return aStr;
  }
  exports.toSetString = supportsNullProto ? identity : toSetString;
  function fromSetString(aStr) {
    if (isProtoString(aStr)) {
      return aStr.slice(1);
    }
    return aStr;
  }
  exports.fromSetString = supportsNullProto ? identity : fromSetString;
  function isProtoString(s) {
    if (!s) {
      return false;
    }
    var length = s.length;
    if (length < 9) {
      return false;
    }
    if (s.charCodeAt(length - 1) !== 95 || s.charCodeAt(length - 2) !== 95 || s.charCodeAt(length - 3) !== 111 || s.charCodeAt(length - 4) !== 116 || s.charCodeAt(length - 5) !== 111 || s.charCodeAt(length - 6) !== 114 || s.charCodeAt(length - 7) !== 112 || s.charCodeAt(length - 8) !== 95 || s.charCodeAt(length - 9) !== 95) {
      return false;
    }
    for (var i = length - 10; i >= 0; i--) {
      if (s.charCodeAt(i) !== 36) {
        return false;
      }
    }
    return true;
  }
  function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
    var cmp = strcmp(mappingA.source, mappingB.source);
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.originalLine - mappingB.originalLine;
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.originalColumn - mappingB.originalColumn;
    if (cmp !== 0 || onlyCompareOriginal) {
      return cmp;
    }
    cmp = mappingA.generatedColumn - mappingB.generatedColumn;
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.generatedLine - mappingB.generatedLine;
    if (cmp !== 0) {
      return cmp;
    }
    return strcmp(mappingA.name, mappingB.name);
  }
  exports.compareByOriginalPositions = compareByOriginalPositions;
  function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
    var cmp = mappingA.generatedLine - mappingB.generatedLine;
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.generatedColumn - mappingB.generatedColumn;
    if (cmp !== 0 || onlyCompareGenerated) {
      return cmp;
    }
    cmp = strcmp(mappingA.source, mappingB.source);
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.originalLine - mappingB.originalLine;
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.originalColumn - mappingB.originalColumn;
    if (cmp !== 0) {
      return cmp;
    }
    return strcmp(mappingA.name, mappingB.name);
  }
  exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;
  function strcmp(aStr1, aStr2) {
    if (aStr1 === aStr2) {
      return 0;
    }
    if (aStr1 === null) {
      return 1;
    }
    if (aStr2 === null) {
      return -1;
    }
    if (aStr1 > aStr2) {
      return 1;
    }
    return -1;
  }
  function compareByGeneratedPositionsInflated(mappingA, mappingB) {
    var cmp = mappingA.generatedLine - mappingB.generatedLine;
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.generatedColumn - mappingB.generatedColumn;
    if (cmp !== 0) {
      return cmp;
    }
    cmp = strcmp(mappingA.source, mappingB.source);
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.originalLine - mappingB.originalLine;
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.originalColumn - mappingB.originalColumn;
    if (cmp !== 0) {
      return cmp;
    }
    return strcmp(mappingA.name, mappingB.name);
  }
  exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;
  function parseSourceMapInput(str) {
    return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ""));
  }
  exports.parseSourceMapInput = parseSourceMapInput;
  function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
    sourceURL = sourceURL || "";
    if (sourceRoot) {
      if (sourceRoot[sourceRoot.length - 1] !== "/" && sourceURL[0] !== "/") {
        sourceRoot += "/";
      }
      sourceURL = sourceRoot + sourceURL;
    }
    if (sourceMapURL) {
      var parsed = urlParse(sourceMapURL);
      if (!parsed) {
        throw new Error("sourceMapURL could not be parsed");
      }
      if (parsed.path) {
        var index = parsed.path.lastIndexOf("/");
        if (index >= 0) {
          parsed.path = parsed.path.substring(0, index + 1);
        }
      }
      sourceURL = join(urlGenerate(parsed), sourceURL);
    }
    return normalize(sourceURL);
  }
  exports.computeSourceURL = computeSourceURL;
}, {}], 20: [function(require2, module, exports) {
  exports.SourceMapGenerator = require2("./lib/source-map-generator").SourceMapGenerator;
  exports.SourceMapConsumer = require2("./lib/source-map-consumer").SourceMapConsumer;
  exports.SourceNode = require2("./lib/source-node").SourceNode;
}, {"./lib/source-map-consumer": 16, "./lib/source-map-generator": 17, "./lib/source-node": 18}], 21: [function(require2, module, exports) {
  "use strict";
  module.exports = (arr_, pred) => {
    const arr = arr_ || [], spans = [];
    let span = {
      label: void 0,
      items: [arr.first]
    };
    arr.forEach((x) => {
      const label = pred(x);
      if (span.label !== label && span.items.length) {
        spans.push(span = {label, items: [x]});
      } else {
        span.items.push(x);
      }
    });
    return spans;
  };
}, {}], 22: [function(require2, module, exports) {
  (function(process) {
    "use strict";
    const O = Object, isBrowser = typeof window !== "undefined" && window.window === window && window.navigator, lastOf = (x) => x[x.length - 1], getSource = require2("get-source"), partition = require2("./impl/partition"), asTable = require2("as-table"), nixSlashes = (x) => x.replace(/\\/g, "/"), pathRoot = isBrowser ? window.location.href : nixSlashes(process.cwd()) + "/";
    class StackTracey extends Array {
      constructor(input, offset) {
        const originalInput = input, isParseableSyntaxError = input && (input instanceof SyntaxError && !isBrowser);
        super();
        this.constructor = StackTracey;
        this.__proto__ = StackTracey.prototype;
        if (!input) {
          input = new Error();
          offset = offset === void 0 ? 1 : offset;
        }
        if (input instanceof Error) {
          input = input[StackTracey.stack] || input.stack || "";
        }
        if (typeof input === "string") {
          input = StackTracey.rawParse(input).slice(offset).map(StackTracey.extractEntryMetadata);
        }
        if (Array.isArray(input)) {
          if (isParseableSyntaxError) {
            const rawLines = module.require("util").inspect(originalInput).split("\n"), fileLine = rawLines[0].split(":"), line = fileLine.pop(), file = fileLine.join(":");
            if (file) {
              input.unshift({
                file: nixSlashes(file),
                line,
                column: (rawLines[2] || "").indexOf("^") + 1,
                sourceLine: rawLines[1],
                callee: "(syntax error)",
                syntaxError: true
              });
            }
          }
          this.length = input.length;
          input.forEach((x, i) => this[i] = x);
        }
      }
      static extractEntryMetadata(e) {
        const fileRelative = StackTracey.relativePath(e.file || "");
        return O.assign(e, {
          calleeShort: e.calleeShort || lastOf((e.callee || "").split(".")),
          fileRelative,
          fileShort: StackTracey.shortenPath(fileRelative),
          fileName: lastOf((e.file || "").split("/")),
          thirdParty: StackTracey.isThirdParty(fileRelative) && !e.index
        });
      }
      static shortenPath(relativePath) {
        return relativePath.replace(/^node_modules\//, "").replace(/^webpack\/bootstrap\//, "");
      }
      static relativePath(fullPath) {
        return fullPath.replace(pathRoot, "").replace(/^.*\:\/\/?\/?/, "");
      }
      static isThirdParty(relativePath) {
        return relativePath[0] === "~" || relativePath[0] === "/" || relativePath.indexOf("node_modules") === 0 || relativePath.indexOf("webpack/bootstrap") === 0;
      }
      static rawParse(str) {
        const lines = (str || "").split("\n");
        const entries = lines.map((line) => {
          line = line.trim();
          var callee, fileLineColumn = [], native, planA, planB;
          if ((planA = line.match(/at (.+) \((.+)\)/)) || (planA = line.match(/(.*)@(.*)/))) {
            callee = planA[1];
            native = planA[2] === "native";
            fileLineColumn = (planA[2].match(/(.*):(.+):(.+)/) || []).slice(1);
          } else if (planB = line.match(/^(at\s+)*(.+):([0-9]+):([0-9]+)/)) {
            fileLineColumn = planB.slice(2);
          } else {
            return void 0;
          }
          if (callee && !fileLineColumn[0]) {
            const type = callee.split(".")[0];
            if (type === "Array") {
              native = true;
            }
          }
          return {
            beforeParse: line,
            callee: callee || "",
            index: isBrowser && fileLineColumn[0] === window.location.href,
            native: native || false,
            file: nixSlashes(fileLineColumn[0] || ""),
            line: parseInt(fileLineColumn[1] || "", 10) || void 0,
            column: parseInt(fileLineColumn[2] || "", 10) || void 0
          };
        });
        return entries.filter((x) => x !== void 0);
      }
      withSource(i) {
        return this[i] && StackTracey.withSource(this[i]);
      }
      static withSource(loc) {
        if (loc.sourceFile || loc.file && loc.file.indexOf("<") >= 0) {
          return loc;
        } else {
          let resolved = getSource(loc.file || "").resolve(loc);
          if (!resolved.sourceFile) {
            return loc;
          }
          if (!resolved.sourceFile.error) {
            resolved.file = nixSlashes(resolved.sourceFile.path);
            resolved = StackTracey.extractEntryMetadata(resolved);
          }
          if (!resolved.sourceLine.error) {
            if (resolved.sourceLine.includes("// @hide")) {
              resolved.sourceLine = resolved.sourceLine.replace("// @hide", "");
              resolved.hide = true;
            }
            if (resolved.sourceLine.includes("__webpack_require__") || resolved.sourceLine.includes("/******/ ({")) {
              resolved.thirdParty = true;
            }
          }
          return O.assign({sourceLine: ""}, loc, resolved);
        }
      }
      get withSources() {
        return new StackTracey(this.map(StackTracey.withSource));
      }
      get mergeRepeatedLines() {
        return new StackTracey(partition(this, (e) => e.file + e.line).map((group) => {
          return group.items.slice(1).reduce((memo, entry) => {
            memo.callee = (memo.callee || "<anonymous>") + " \u2192 " + (entry.callee || "<anonymous>");
            memo.calleeShort = (memo.calleeShort || "<anonymous>") + " \u2192 " + (entry.calleeShort || "<anonymous>");
            return memo;
          }, O.assign({}, group.items[0]));
        }));
      }
      get clean() {
        return this.withSources.mergeRepeatedLines.filter((e, i) => i === 0 || !(e.thirdParty || e.hide || e.native));
      }
      at(i) {
        return O.assign({
          beforeParse: "",
          callee: "<???>",
          index: false,
          native: false,
          file: "<???>",
          line: 0,
          column: 0
        }, this[i]);
      }
      static locationsEqual(a, b) {
        return a.file === b.file && a.line === b.line && a.column === b.column;
      }
      get pretty() {
        const trimEnd = (s, n) => s && (s.length > n ? s.slice(0, n - 1) + "\u2026" : s);
        const trimStart = (s, n) => s && (s.length > n ? "\u2026" + s.slice(-(n - 1)) : s);
        return asTable(this.withSources.map((e) => [
          "at " + trimEnd(e.calleeShort, StackTracey.maxColumnWidths.callee),
          trimStart(e.fileShort && e.fileShort + ":" + e.line || "", StackTracey.maxColumnWidths.file),
          trimEnd((e.sourceLine || "").trim() || "", StackTracey.maxColumnWidths.sourceLine)
        ]));
      }
      static resetCache() {
        getSource.resetCache();
      }
    }
    StackTracey.maxColumnWidths = {
      callee: 30,
      file: 40,
      sourceLine: 80
    };
    (() => {
      const methods = {
        include(pred) {
          const f = StackTracey.isThirdParty;
          O.assign(StackTracey.isThirdParty = (path) => f(path) || pred(path), methods);
        },
        except(pred) {
          const f = StackTracey.isThirdParty;
          O.assign(StackTracey.isThirdParty = (path) => f(path) && !pred(path), methods);
        }
      };
      O.assign(StackTracey.isThirdParty, methods);
    })();
    ["map", "filter", "slice", "concat", "reverse"].forEach((name) => {
      StackTracey.prototype[name] = function() {
        const arr = Array.from(this);
        return new StackTracey(arr[name].apply(arr, arguments));
      };
    });
    StackTracey.stack = typeof Symbol !== "undefined" ? Symbol.for("StackTracey") : "__StackTracey";
    module.exports = StackTracey;
  }).call(this, require2("_process"));
}, {"./impl/partition": 21, _process: 9, "as-table": 1, "get-source": 5}], 23: [function(require2, module, exports) {
  "use strict";
  var _panicOverlay = _interopRequireDefault(require2("./panic-overlay"));
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  window.panic = _panicOverlay["default"];
}, {"./panic-overlay": 24}], 24: [function(require2, module, exports) {
  "use strict";
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = void 0;
  var _stacktracey = _interopRequireDefault(require2("stacktracey"));
  var _path = _interopRequireDefault(require2("get-source/impl/path"));
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }
  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }
      return arr2;
    }
  }
  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof2(obj2) {
        return typeof obj2;
      };
    } else {
      _typeof = function _typeof2(obj2) {
        return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
      };
    }
    return _typeof(obj);
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }
  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = void 0;
    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i)
          break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null)
          _i["return"]();
      } finally {
        if (_d)
          throw _e;
      }
    }
    return _arr;
  }
  function _toArray(arr) {
    return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest();
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }
  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]")
      return Array.from(iter);
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr))
      return arr;
  }
  var assign = Object.assign;
  var min = Math.min, max = Math.max;
  var nanoscript = function nanoscript2() {
    var classPrefix = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
    return function createElement(tagIdClasses) {
      var props = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      var children = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
      if (props instanceof Node || typeof props === "string" || Array.isArray(props)) {
        children = props;
        props = {};
      }
      if (children && !Array.isArray(children))
        children = [children];
      var _tagIdClasses$split = tagIdClasses.split("."), _tagIdClasses$split2 = _toArray(_tagIdClasses$split), tagId = _tagIdClasses$split2[0], classes = _tagIdClasses$split2.slice(1);
      var _tagId$split = tagId.split("#"), _tagId$split2 = _slicedToArray(_tagId$split, 2), tag = _tagId$split2[0], id = _tagId$split2[1];
      var el = document.createElement(tag || "div");
      if (id)
        el.id = id;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = void 0;
      try {
        for (var _iterator = classes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var c = _step.value;
          el.classList.add(classPrefix + c);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = void 0;
      try {
        for (var _iterator2 = children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _c = _step2.value;
          if (_c)
            el.appendChild(typeof _c === "string" ? document.createTextNode(_c) : _c);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
      return assign(el, props);
    };
  };
  var h = nanoscript("panic-overlay__");
  var style = h("style", `

.panic-overlay__modal {
    
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background:white;
    z-index: 10000;
    box-sizing: border-box;
    overflow-y: scroll;
    overflow-x: hidden;
    font-size:18px;
    --left-pad: 60px;
}

.panic-overlay__modal,
.panic-overlay__modal * {
    display: block;
    padding: 0;
    margin: 0;
    font-family: Menlo, Monaco, "Courier New", Courier, monospace;
}

.panic-overlay__modal span,
.panic-overlay__modal em,
.panic-overlay__modal strong {
    display: inline;
}

.panic-overlay strong {
    font-weight: bold;
}

.panic-overlay__hidden {
    display: none;
}

.panic-overlay__modal h1 {

    color: black;
    margin: 0;
    padding: 0;
    font-size: 1.77em;
    font-weight: 600;
    opacity: 0.75;
    margin-top:50px;
    margin-bottom:45px;
    position: relative;
    padding-left: var(--left-pad);
}

.panic-overlay__close {
    color: black;
    font-weight: normal;
    text-decoration: none;
    position: absolute;
    top:-0.32em;
    right: 1em;
    font-size: 1.77em;
    opacity: 0.15;
    transition: all 0.25s ease-in-out;
}

.panic-overlay__close:hover {
    transform:scale(1.5);
    opacity: 0.25;
}

.panic-overlay__error {
    margin: 1em 0 3em 0;
    left:0;
}

.panic-overlay__error-title {
    display: flex;
    align-items: stretch;
    padding-right: 50px;
}

.panic-overlay__error-type {
    min-height: 2.8em;
    display: flex !important;
    align-items: center;
    padding:0 1em;
    background: rgb(255, 0, 64);
    color: white;
    margin-right: 2em;
    padding-left: var(--left-pad);
    white-space: nowrap;
}

.panic-overlay__error-counter {
    color: white;
    opacity: 0.3;
    position: absolute;
    left: 0.8em;
}

.panic-overlay__error-message {
    display: flex !important;
    align-items: center;
    font-weight:400;
    line-height: 1em;
}

.panic-overlay__error-stack {
    margin-top: 2em;
    white-space: pre;
    padding-left: var(--left-pad);
}

.panic-overlay__stack-entry {
    cursor: pointer;
    margin-bottom: 2.5em;
}

.panic-overlay__collapsed .panic-overlay__stack-entry-hidden {
    display: none;
}

.panic-overlay__file {
    font-weight: bold;
    margin-top: 2.5em;
    margin-bottom: 1.5em;
    color: rgb(202, 17, 63);
}

.panic-overlay__file strong {
    text-decoration: underline;
}

.panic-overlay__file:before,
.panic-overlay__more:before {
    content: '@ ';
    opacity: 0.5;
    margin-left: -1.25em;
}

.panic-overlay__more:before {
    content: '\u25B7 ';
    opacity: 0.5;
}

.panic-overlay__more {
    opacity: 0.25;
    color: black;
    font-size: 0.835em;
    cursor: pointer;
    text-align: center;
    display: none;
}

.panic-overlay__more em {
    font-style: normal;
    font-weight: normal;
    border-bottom: 1px dashed black;
}

.panic-overlay__collapsed .panic-overlay__more {
    display: block;
}

.panic-overlay__lines {
    color:rgb(187, 165, 165);
    font-size: 0.835em;
}

.panic-overlay__lines:not(.panic-overlay__no-fade) {
    -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 75%, rgba(0,0,0,0));
    mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 75%, rgba(0,0,0,0));
}

.panic-overlay__line-number { 
    padding-right: 1.5em;
    opacity: 0.5;
}

.panic-overlay__line-hili {
    background: #ffff78;
    color: #5f4545;
}

.panic-overlay__stack-entry:first-child .panic-overlay__line-hili strong {
    text-decoration: underline wavy #ff0040;
}

.panic-overlay__line-hili em {
    font-style: italic;
    color: rgb(255, 0, 64);
    font-size: 0.75em;
    margin-left: 2em;
    opacity: 0.25;
    position: relative;
    top: -0.115em;
    white-space: nowrap;
}

.panic-overlay__line-hili em:before {
    content: '\u2190 ';
}

.panic-overlay__no-source {
    font-style: italic;
}

@media only screen and (max-width: 640px) {

    .panic-overlay__modal {
        font-size: 15px;
        --left-pad: 50px;
    }
    
    .panic-overlay__modal h1 {
        margin:40px 0;
    }
}

@media only screen and (max-width: 500px) {
    
    .panic-overlay__modal {
        font-size: 14px;
        --left-pad: 45px;
    }
    
    .panic-overlay__modal h1 {
        margin:30px 0;
    }
}

`);
  var defaultConfig = {
    handleErrors: true,
    projectRoot: void 0,
    stackEntryClicked: function stackEntryClicked(entry) {
      if (this.projectRoot) {
        window.location = "vscode://file/".concat(_path["default"].concat(this.projectRoot, entry.fileRelative), ":").concat(entry.line, ":").concat(entry.column);
      }
    }
  };
  var config = defaultConfig;
  var errors = h(".errors");
  var modal = h(".modal.hidden.collapsed", [h("h1", ["Oops :(", h("a.close", {
    href: "#",
    onclick: function onclick() {
      toggle(false);
    }
  }, "\xD7")]), errors]);
  var shouldHideEntry = function shouldHideEntry2(entry, i) {
    return (entry.thirdParty || entry["native"] || entry.hide) && i !== 0;
  };
  function renderStackEntry(entry, i, message) {
    var _entry$sourceFile = entry.sourceFile, sourceFile = _entry$sourceFile === void 0 ? {
      lines: []
    } : _entry$sourceFile, line = entry.line, column = entry.column, fileShort = entry.fileShort, calleeShort = entry.calleeShort, fileRelative = entry.fileRelative;
    var lineIndex = line - 1;
    var maxLines = sourceFile.lines.length;
    var window2 = 4;
    var start = lineIndex - window2, end = lineIndex + window2 + 2;
    if (start < 0) {
      end = min(end - start, maxLines);
      start = 0;
    }
    if (end > maxLines) {
      start = max(0, start - (end - maxLines));
      end = maxLines;
    }
    var lines = sourceFile.lines.slice(start, end);
    var lineNumberWidth = String(start + lines.length).length;
    var hiliIndex = line - start - 1;
    var hiliMsg = i === 0 ? message : "";
    var onLastLine = hiliIndex === lines.length - 1;
    var className = ".stack-entry" + (shouldHideEntry(entry, i) ? ".stack-entry-hidden" : "");
    return h(className, {
      onclick: function onclick() {
        config.stackEntryClicked(entry);
      }
    }, [h(".file", h("strong", fileShort)), h(".lines" + (onLastLine ? ".no-fade" : ""), lines.length ? lines.map(function(text, i2) {
      return h(".line" + (i2 === hiliIndex ? ".line-hili" : ""), [h("span.line-number", String(start + i2 + 1).padStart(lineNumberWidth, " ")), h("span.line-text", i2 === hiliIndex ? renderHighlightedLine(text, column, hiliMsg) : text)]);
    }) : [h(".line", [h("span.line-number", String(line)), h("span.line-text.no-source", "\u2026 somewhere at ".concat(calleeShort ? calleeShort + "()" : "???", " \u2026"))])])]);
  }
  function renderHighlightedLine(text, column, msg) {
    var _ref = [text.slice(0, column - 1), text.slice(column - 1)], before = _ref[0], after = _ref[1];
    return [
      before,
      h("strong", after)
    ];
  }
  function panic(err) {
    var stack = new _stacktracey["default"](err).withSources;
    var indexText = stack.clean.pretty;
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = void 0;
    try {
      for (var _iterator3 = errors.childNodes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var _el = _step3.value;
        if (_el._indexText === indexText) {
          assign(_el.querySelector(".panic-overlay__error-counter"), {
            innerText: _el._counter = (_el._counter || 1) + 1,
            style: ""
          });
          return;
        }
      }
    } catch (err2) {
      _didIteratorError3 = true;
      _iteratorError3 = err2;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
          _iterator3["return"]();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }
    var showMore = function showMore2() {
      return modal.classList.remove("panic-overlay__collapsed");
    };
    var type = String(err && (err.type || err.constructor && err.constructor.name) || _typeof(err));
    var msg = String(err && err.message);
    var el = h(".error", {
      _indexText: indexText
    }, [h(".error-title", [h("span.error-type", [type, h("span.error-counter", {
      style: "display: none;"
    })]), h("span.error-message", msg)]), h(".error-stack", [].concat(_toConsumableArray(stack.map(function(e, i) {
      return renderStackEntry(e, i, msg);
    })), [h(".more", h("em", {
      onclick: showMore
    }, "show more"))]))]);
    if (!stack.find(shouldHideEntry))
      showMore();
    errors.insertBefore(el, errors.firstChild);
    if (errors.childElementCount > 10)
      errors.lastChild.remove();
    toggle(true);
    return panic;
  }
  var visible = false;
  function toggle(yes) {
    if (document.body) {
      if (yes) {
        document.head.appendChild(style);
        document.body.appendChild(modal);
      }
      document.body.classList.toggle("panic-overlay__visible", yes);
    }
    modal.classList.toggle("panic-overlay__hidden", !yes);
    if (visible && !yes) {
      errors.innerText = "";
      modal.classList.add("panic-overlay__collapsed");
    }
    visible = yes;
    return panic;
  }
  function onUncaughtError(e) {
    if (config.handleErrors)
      panic(e);
  }
  window.addEventListener("error", function(e) {
    return onUncaughtError(e.error);
  });
  window.addEventListener("unhandledrejection", function(e) {
    return onUncaughtError(e.reason);
  });
  (function onReady(fn) {
    if (document.body)
      fn();
    else
      document.addEventListener("DOMContentLoaded", fn);
  })(function() {
    toggle(visible);
  });
  panic.toggle = toggle;
  panic.configure = function configure(cfg) {
    assign(config, defaultConfig, cfg);
    return panic;
  };
  var _default = panic;
  exports["default"] = _default;
}, {"get-source/impl/path": 6, stacktracey: 22}]}, {}, [23]);

// dev/dev.tsx
var import_websocket_ts = __toModule(require_lib());
var import_nano_jsx2 = __toModule(require_lib2());

// dev/infoBar.tsx
var import_nano_jsx = __toModule(require_lib2());
var import_store = __toModule(require_store());

// node_modules/spin.js/spin.js
var __assign = function() {
  __assign = Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
var defaults = {
  lines: 12,
  length: 7,
  width: 5,
  radius: 10,
  scale: 1,
  corners: 1,
  color: "#000",
  fadeColor: "transparent",
  animation: "spinner-line-fade-default",
  rotate: 0,
  direction: 1,
  speed: 1,
  zIndex: 2e9,
  className: "spinner",
  top: "50%",
  left: "50%",
  shadow: "0 0 1px transparent",
  position: "absolute"
};
var Spinner = function() {
  function Spinner2(opts) {
    if (opts === void 0) {
      opts = {};
    }
    this.opts = __assign(__assign({}, defaults), opts);
  }
  Spinner2.prototype.spin = function(target) {
    this.stop();
    this.el = document.createElement("div");
    this.el.className = this.opts.className;
    this.el.setAttribute("role", "progressbar");
    css(this.el, {
      position: this.opts.position,
      width: 0,
      zIndex: this.opts.zIndex,
      left: this.opts.left,
      top: this.opts.top,
      transform: "scale(" + this.opts.scale + ")"
    });
    if (target) {
      target.insertBefore(this.el, target.firstChild || null);
    }
    drawLines(this.el, this.opts);
    return this;
  };
  Spinner2.prototype.stop = function() {
    if (this.el) {
      if (typeof requestAnimationFrame !== "undefined") {
        cancelAnimationFrame(this.animateId);
      } else {
        clearTimeout(this.animateId);
      }
      if (this.el.parentNode) {
        this.el.parentNode.removeChild(this.el);
      }
      this.el = void 0;
    }
    return this;
  };
  return Spinner2;
}();
function css(el, props) {
  for (var prop in props) {
    el.style[prop] = props[prop];
  }
  return el;
}
function getColor(color, idx) {
  return typeof color == "string" ? color : color[idx % color.length];
}
function drawLines(el, opts) {
  var borderRadius = Math.round(opts.corners * opts.width * 500) / 1e3 + "px";
  var shadow = "none";
  if (opts.shadow === true) {
    shadow = "0 2px 4px #000";
  } else if (typeof opts.shadow === "string") {
    shadow = opts.shadow;
  }
  var shadows = parseBoxShadow(shadow);
  for (var i = 0; i < opts.lines; i++) {
    var degrees = ~~(360 / opts.lines * i + opts.rotate);
    var backgroundLine = css(document.createElement("div"), {
      position: "absolute",
      top: -opts.width / 2 + "px",
      width: opts.length + opts.width + "px",
      height: opts.width + "px",
      background: getColor(opts.fadeColor, i),
      borderRadius,
      transformOrigin: "left",
      transform: "rotate(" + degrees + "deg) translateX(" + opts.radius + "px)"
    });
    var delay = i * opts.direction / opts.lines / opts.speed;
    delay -= 1 / opts.speed;
    var line = css(document.createElement("div"), {
      width: "100%",
      height: "100%",
      background: getColor(opts.color, i),
      borderRadius,
      boxShadow: normalizeShadow(shadows, degrees),
      animation: 1 / opts.speed + "s linear " + delay + "s infinite " + opts.animation
    });
    backgroundLine.appendChild(line);
    el.appendChild(backgroundLine);
  }
}
function parseBoxShadow(boxShadow) {
  var regex = /^\s*([a-zA-Z]+\s+)?(-?\d+(\.\d+)?)([a-zA-Z]*)\s+(-?\d+(\.\d+)?)([a-zA-Z]*)(.*)$/;
  var shadows = [];
  for (var _i = 0, _a = boxShadow.split(","); _i < _a.length; _i++) {
    var shadow = _a[_i];
    var matches = shadow.match(regex);
    if (matches === null) {
      continue;
    }
    var x = +matches[2];
    var y = +matches[5];
    var xUnits = matches[4];
    var yUnits = matches[7];
    if (x === 0 && !xUnits) {
      xUnits = yUnits;
    }
    if (y === 0 && !yUnits) {
      yUnits = xUnits;
    }
    if (xUnits !== yUnits) {
      continue;
    }
    shadows.push({
      prefix: matches[1] || "",
      x,
      y,
      xUnits,
      yUnits,
      end: matches[8]
    });
  }
  return shadows;
}
function normalizeShadow(shadows, degrees) {
  var normalized = [];
  for (var _i = 0, shadows_1 = shadows; _i < shadows_1.length; _i++) {
    var shadow = shadows_1[_i];
    var xy = convertOffset(shadow.x, shadow.y, degrees);
    normalized.push(shadow.prefix + xy[0] + shadow.xUnits + " " + xy[1] + shadow.yUnits + shadow.end);
  }
  return normalized.join(", ");
}
function convertOffset(x, y, degrees) {
  var radians = degrees * Math.PI / 180;
  var sin = Math.sin(radians);
  var cos = Math.cos(radians);
  return [
    Math.round((x * cos + y * sin) * 1e3) / 1e3,
    Math.round((-x * sin + y * cos) * 1e3) / 1e3
  ];
}

// dev/infoBar.tsx
var spinnerOptions = {
  lines: 12,
  length: 0,
  width: 17,
  radius: 40,
  scale: 0.1,
  corners: 1,
  speed: 0.9,
  rotate: 0,
  animation: "spinner-line-fade-more",
  direction: 1,
  color: "#ffffff",
  fadeColor: "transparent",
  top: "50%",
  left: "50%",
  shadow: "0 0 1px transparent",
  zIndex: 2e9,
  className: "spinner",
  position: "absolute"
};
var infoBarStore = new import_store.Store({show: false}, "info-bar-store", "memory");
var spinner = new Spinner(spinnerOptions);
var InfoBar = class extends import_nano_jsx.Component {
  constructor() {
    super(...arguments);
    this.store = infoBarStore.use();
  }
  getSpinnerRef() {
    return document.getElementById("__dev-scripts-info-bar-spinner");
  }
  didMount() {
    this.store.subscribe((newState, prevState) => {
      if (newState.show !== prevState.show) {
        this.update();
      }
      if (newState.show) {
        spinner.spin(this.getSpinnerRef());
      } else {
        spinner.stop();
      }
    });
  }
  didUnmount() {
    this.store.cancel();
  }
  render() {
    return /* @__PURE__ */ import_nano_jsx.default.h("div", {
      class: `container ${this.store.state.show ? "shown" : ""}`
    }, /* @__PURE__ */ import_nano_jsx.default.h("style", null, `
/* node_modules/spin.js/spin.css */
@keyframes spinner-line-fade-more {
  0%, 100% {
    opacity: 0;
  }
  1% {
    opacity: 1;
  }
}
@keyframes spinner-line-fade-quick {
  0%, 39%, 100% {
    opacity: 0.25;
  }
  40% {
    opacity: 1;
  }
}
@keyframes spinner-line-fade-default {
  0%, 100% {
    opacity: 0.22;
  }
  1% {
    opacity: 1;
  }
}
@keyframes spinner-line-shrink {
  0%, 25%, 100% {
    transform: scale(0.5);
    opacity: 0.25;
  }
  26% {
    transform: scale(1);
    opacity: 1;
  }
}
				
#__dev-scripts-info-bar .container {
	width: 24px;
	height: 24px;
	position: absolute;
	bottom: 10px;
	right: 30px;
	border-radius: 3px;
	background: #000;
	color: #fff;
	font: initial;
	cursor: initial;
	letter-spacing: initial;
	text-shadow: initial;
	text-transform: initial;
	visibility: initial;
	padding: 7px 10px 8px 10px;
	align-items: center;
	box-shadow: 0 11px 40px 0 rgb(0 0 0 / 25%), 0 2px 10px 0 rgb(0 0 0 / 12%);
	display: none;
	opacity: 0;
	transition: opacity 0.1s ease, bottom 0.1s ease;
	animation: fade-in 0.1s ease-in-out;
}
#__dev-scripts-info-bar .container.shown {
	display: block;
	opacity: 1;
}`), /* @__PURE__ */ import_nano_jsx.default.h("div", {
      id: "__dev-scripts-info-bar-spinner"
    }));
  }
};
var infoBar_default = InfoBar;

// dev/dev.tsx
var wsPort = window.WEBSOCKET_PORT;
var infoBar = document.createElement("div");
infoBar.setAttribute("id", "__dev-scripts-info-bar");
document.body.appendChild(infoBar);
var ws = new import_websocket_ts.WebsocketBuilder(`ws://localhost:${wsPort}`).withBackoff(new import_websocket_ts.ConstantBackoff(500)).onOpen((i, ev) => {
  console.info("DevServer connecting...");
}).onClose((i, ev) => {
  console.info("DevServer connection lost");
}).onError((i, ev) => {
  console.info("DevServer connection error");
}).onMessage((i, ev) => {
  const msg = JSON.parse(ev.data);
  handleMessage(msg);
}).onRetry((i, ev) => {
  console.info("Retrying DevServer connection");
}).build();
var rerender = () => {
  import_nano_jsx2.default.render(/* @__PURE__ */ import_nano_jsx2.default.h(infoBar_default, null), infoBar);
};
rerender();
var setState = (state) => {
  infoBarStore.setState(state);
};
function handleMessage({event, data}) {
  switch (event) {
    case "dev-server-connected": {
      console.info("[DevServer] connected");
      return;
    }
    case "bundle-build-start": {
      console.info("[DevServer] Bundle build started...");
      setState({
        show: true
      });
      break;
    }
    case "bundle-build-end": {
      console.info("[DevServer] Bundle build finished. Reloading...");
      setState({
        show: false
      });
      window.location.reload();
    }
  }
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vbm9kZV9tb2R1bGVzL3dlYnNvY2tldC10cy9saWIvYmFja29mZi9iYWNrb2ZmLmpzIiwgIi4uL25vZGVfbW9kdWxlcy93ZWJzb2NrZXQtdHMvc3JjL2JhY2tvZmYvY29uc3RhbnRiYWNrb2ZmLnRzIiwgIi4uL25vZGVfbW9kdWxlcy93ZWJzb2NrZXQtdHMvc3JjL2JhY2tvZmYvZXhwb25lbnRpYWxiYWNrb2ZmLnRzIiwgIi4uL25vZGVfbW9kdWxlcy93ZWJzb2NrZXQtdHMvc3JjL2JhY2tvZmYvbGluZWFyYmFja29mZi50cyIsICIuLi9ub2RlX21vZHVsZXMvd2Vic29ja2V0LXRzL2xpYi9idWZmZXIvYnVmZmVyLmpzIiwgIi4uL25vZGVfbW9kdWxlcy93ZWJzb2NrZXQtdHMvc3JjL2J1ZmZlci9scnVidWZmZXIudHMiLCAiLi4vbm9kZV9tb2R1bGVzL3dlYnNvY2tldC10cy9zcmMvYnVmZmVyL3RpbWVidWZmZXIudHMiLCAiLi4vbm9kZV9tb2R1bGVzL3dlYnNvY2tldC10cy9zcmMvd2Vic29ja2V0LnRzIiwgIi4uL25vZGVfbW9kdWxlcy93ZWJzb2NrZXQtdHMvc3JjL3dlYnNvY2tldEJ1aWxkZXIudHMiLCAiLi4vbm9kZV9tb2R1bGVzL3dlYnNvY2tldC10cy9zcmMvaW5kZXgudHMiLCAiLi4vbm9kZV9tb2R1bGVzL25hbm8tanN4L2xpYi90eXBlcy5qcyIsICIuLi9ub2RlX21vZHVsZXMvbmFuby1qc3gvc3JjL2NvcmUudHMiLCAiLi4vbm9kZV9tb2R1bGVzL25hbm8tanN4L3NyYy92ZXJzaW9uLnRzIiwgIi4uL25vZGVfbW9kdWxlcy9uYW5vLWpzeC9zcmMvaGVscGVycy50cyIsICIuLi9ub2RlX21vZHVsZXMvbmFuby1qc3gvc3JjL3N0YXRlLnRzIiwgIi4uL25vZGVfbW9kdWxlcy9uYW5vLWpzeC9zcmMvY29tcG9uZW50LnRzIiwgIi4uL25vZGVfbW9kdWxlcy9uYW5vLWpzeC9zcmMvY29tcG9uZW50cy9oZWxtZXQudHMiLCAiLi4vbm9kZV9tb2R1bGVzL25hbm8tanN4L3NyYy9jb21wb25lbnRzL2ltZy50cyIsICIuLi9ub2RlX21vZHVsZXMvbmFuby1qc3gvc3JjL2ZyYWdtZW50LnRzIiwgIi4uL25vZGVfbW9kdWxlcy9uYW5vLWpzeC9zcmMvY29tcG9uZW50cy9saW5rLnRzIiwgIi4uL25vZGVfbW9kdWxlcy9uYW5vLWpzeC9zcmMvY29tcG9uZW50cy9yb3V0ZXIudHMiLCAiLi4vbm9kZV9tb2R1bGVzL25hbm8tanN4L3NyYy9jb21wb25lbnRzL3N1c3BlbnNlLnRzIiwgIi4uL25vZGVfbW9kdWxlcy9uYW5vLWpzeC9zcmMvY29tcG9uZW50cy92aXNpYmxlLnRzIiwgIi4uL25vZGVfbW9kdWxlcy9uYW5vLWpzeC9zcmMvY29tcG9uZW50cy9pbmRleC50cyIsICIuLi9ub2RlX21vZHVsZXMvbmFuby1qc3gvc3JjL3Nzci50cyIsICIuLi9ub2RlX21vZHVsZXMvbmFuby1qc3gvc3JjL2h0bS9jb25zdGFudHMudHMiLCAiLi4vbm9kZV9tb2R1bGVzL25hbm8tanN4L3NyYy9odG0vYnVpbGQudHMiLCAiLi4vbm9kZV9tb2R1bGVzL25hbm8tanN4L3NyYy9odG0vaW5kZXgudHMiLCAiLi4vbm9kZV9tb2R1bGVzL25hbm8tanN4L3NyYy9odG0udHMiLCAiLi4vbm9kZV9tb2R1bGVzL25hbm8tanN4L3NyYy9qc3gudHMiLCAiLi4vbm9kZV9tb2R1bGVzL25hbm8tanN4L3NyYy9sYXp5LnRzIiwgIi4uL25vZGVfbW9kdWxlcy9uYW5vLWpzeC9zcmMvc3RvcmUudHMiLCAiLi4vbm9kZV9tb2R1bGVzL25hbm8tanN4L3NyYy9jb250ZXh0LnRzIiwgIi4uL25vZGVfbW9kdWxlcy9uYW5vLWpzeC9zcmMvd2l0aFN0eWxlcy50cyIsICIuLi9ub2RlX21vZHVsZXMvbmFuby1qc3gvc3JjL2luZGV4LnRzIiwgIi4uL25vZGVfbW9kdWxlcy9wYW5pYy1vdmVybGF5L2J1aWxkL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3BhbmljLW92ZXJsYXkvYnVpbGQvbm9kZV9tb2R1bGVzL2FzLXRhYmxlL2FzLXRhYmxlLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9wYW5pYy1vdmVybGF5L2J1aWxkL25vZGVfbW9kdWxlcy9iYXNlNjQtanMvaW5kZXguanMiLCAiLi4vbm9kZV9tb2R1bGVzL3BhbmljLW92ZXJsYXkvYnVpbGQvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9pbmRleC5qcyIsICIuLi9ub2RlX21vZHVsZXMvcGFuaWMtb3ZlcmxheS9idWlsZC9ub2RlX21vZHVsZXMvZGF0YS11cmktdG8tYnVmZmVyL2luZGV4LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9wYW5pYy1vdmVybGF5L2J1aWxkL25vZGVfbW9kdWxlcy9nZXQtc291cmNlL2dldC1zb3VyY2UuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3BhbmljLW92ZXJsYXkvYnVpbGQvbm9kZV9tb2R1bGVzL2dldC1zb3VyY2UvaW1wbC9wYXRoLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9wYW5pYy1vdmVybGF5L2J1aWxkL25vZGVfbW9kdWxlcy9pZWVlNzU0L2luZGV4LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9wYW5pYy1vdmVybGF5L2J1aWxkL25vZGVfbW9kdWxlcy9wcmludGFibGUtY2hhcmFjdGVycy9wcmludGFibGUtY2hhcmFjdGVycy5qcyIsICIuLi9ub2RlX21vZHVsZXMvcGFuaWMtb3ZlcmxheS9idWlsZC9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9wYW5pYy1vdmVybGF5L2J1aWxkL25vZGVfbW9kdWxlcy9zb3VyY2UtbWFwL2xpYi9hcnJheS1zZXQuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3BhbmljLW92ZXJsYXkvYnVpbGQvbm9kZV9tb2R1bGVzL3NvdXJjZS1tYXAvbGliL2Jhc2U2NC12bHEuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3BhbmljLW92ZXJsYXkvYnVpbGQvbm9kZV9tb2R1bGVzL3NvdXJjZS1tYXAvbGliL2Jhc2U2NC5qcyIsICIuLi9ub2RlX21vZHVsZXMvcGFuaWMtb3ZlcmxheS9idWlsZC9ub2RlX21vZHVsZXMvc291cmNlLW1hcC9saWIvYmluYXJ5LXNlYXJjaC5qcyIsICIuLi9ub2RlX21vZHVsZXMvcGFuaWMtb3ZlcmxheS9idWlsZC9ub2RlX21vZHVsZXMvc291cmNlLW1hcC9saWIvbWFwcGluZy1saXN0LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9wYW5pYy1vdmVybGF5L2J1aWxkL25vZGVfbW9kdWxlcy9zb3VyY2UtbWFwL2xpYi9xdWljay1zb3J0LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9wYW5pYy1vdmVybGF5L2J1aWxkL25vZGVfbW9kdWxlcy9zb3VyY2UtbWFwL2xpYi9zb3VyY2UtbWFwLWNvbnN1bWVyLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9wYW5pYy1vdmVybGF5L2J1aWxkL25vZGVfbW9kdWxlcy9zb3VyY2UtbWFwL2xpYi9zb3VyY2UtbWFwLWdlbmVyYXRvci5qcyIsICIuLi9ub2RlX21vZHVsZXMvcGFuaWMtb3ZlcmxheS9idWlsZC9ub2RlX21vZHVsZXMvc291cmNlLW1hcC9saWIvc291cmNlLW5vZGUuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3BhbmljLW92ZXJsYXkvYnVpbGQvbm9kZV9tb2R1bGVzL3NvdXJjZS1tYXAvbGliL3V0aWwuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3BhbmljLW92ZXJsYXkvYnVpbGQvbm9kZV9tb2R1bGVzL3NvdXJjZS1tYXAvc291cmNlLW1hcC5qcyIsICIuLi9ub2RlX21vZHVsZXMvcGFuaWMtb3ZlcmxheS9idWlsZC9ub2RlX21vZHVsZXMvc3RhY2t0cmFjZXkvaW1wbC9wYXJ0aXRpb24uanMiLCAiLi4vbm9kZV9tb2R1bGVzL3BhbmljLW92ZXJsYXkvYnVpbGQvbm9kZV9tb2R1bGVzL3N0YWNrdHJhY2V5L3N0YWNrdHJhY2V5LmpzIiwgIi4uL25vZGVfbW9kdWxlcy9wYW5pYy1vdmVybGF5L2J1aWxkL3BhbmljLW92ZXJsYXkuYnJvd3Nlci5qcyIsICIuLi9ub2RlX21vZHVsZXMvcGFuaWMtb3ZlcmxheS9idWlsZC9wYW5pYy1vdmVybGF5LmpzIiwgImRldi50c3giLCAiaW5mb0Jhci50c3giLCAiLi4vbm9kZV9tb2R1bGVzL3NwaW4uanMvc3Bpbi5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YmFja29mZi5qcy5tYXAiLCBudWxsLCBudWxsLCBudWxsLCAiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YnVmZmVyLmpzLm1hcCIsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsICJcInVzZSBzdHJpY3RcIjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dHlwZXMuanMubWFwIiwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCAiXCJ1c2Ugc3RyaWN0XCI7XG5cbmNvbnN0IE8gPSBPYmplY3RcbiAgICAsIHsgZmlyc3QsIHN0cmxlbiB9ID0gcmVxdWlyZSAoJ3ByaW50YWJsZS1jaGFyYWN0ZXJzJykgLy8gaGFuZGxlcyBBTlNJIGNvZGVzIGFuZCBpbnZpc2libGUgY2hhcmFjdGVyc1xuICAgICwgbGltaXQgPSAocywgbikgPT4gKGZpcnN0IChzLCBuIC0gMSkgKyAnXHUyMDI2JylcblxuY29uc3QgYXNDb2x1bW5zID0gKHJvd3MsIGNmZ18pID0+IHtcbiAgICBcbiAgICBjb25zdFxuXG4gICAgICAgIHppcCA9IChhcnJzLCBmKSA9PiBhcnJzLnJlZHVjZSAoKGEsIGIpID0+IGIubWFwICgoYiwgaSkgPT4gWy4uLmFbaV0gfHwgW10sIGJdKSwgW10pLm1hcCAoYXJncyA9PiBmICguLi5hcmdzKSksXG5cbiAgICAvKiAgQ29udmVydCBjZWxsIGRhdGEgdG8gc3RyaW5nIChjb252ZXJ0aW5nIG11bHRpbGluZSB0ZXh0IHRvIHNpbmdsZWxpbmUpICovXG5cbiAgICAgICAgY2VsbHMgICAgICAgICAgID0gcm93cy5tYXAgKHIgPT4gci5tYXAgKGMgPT4gKGMgPT09IHVuZGVmaW5lZCkgPyAnJyA6IGNmZ18ucHJpbnQgKGMpLnJlcGxhY2UgKC9cXG4vZywgJ1xcXFxuJykpKSxcblxuICAgIC8qICBDb21wdXRlIGNvbHVtbiB3aWR0aHMgKHBlciByb3cpIGFuZCBtYXggd2lkdGhzIChwZXIgY29sdW1uKSAgICAgKi9cblxuICAgICAgICBjZWxsV2lkdGhzICAgICAgPSBjZWxscy5tYXAgKHIgPT4gci5tYXAgKHN0cmxlbikpLFxuICAgICAgICBtYXhXaWR0aHMgICAgICAgPSB6aXAgKGNlbGxXaWR0aHMsIE1hdGgubWF4KSxcblxuICAgIC8qICBEZWZhdWx0IGNvbmZpZyAgICAgKi9cblxuICAgICAgICBjZmcgICAgICAgICAgICAgPSBPLmFzc2lnbiAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGltaXRlcjogJyAgJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5Db2x1bW5XaWR0aHM6IG1heFdpZHRocy5tYXAgKHggPT4gMCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4VG90YWxXaWR0aDogMCB9LCBjZmdfKSxcblxuICAgICAgICBkZWxpbWl0ZXJMZW5ndGggPSBzdHJsZW4gKGNmZy5kZWxpbWl0ZXIpLFxuXG4gICAgLyogIFByb2plY3QgZGVzaXJlZCBjb2x1bW4gd2lkdGhzLCB0YWtpbmcgbWF4VG90YWxXaWR0aCBhbmQgbWluQ29sdW1uV2lkdGhzIGluIGFjY291bnQuICAgICAqL1xuXG4gICAgICAgIHRvdGFsV2lkdGggICAgICA9IG1heFdpZHRocy5yZWR1Y2UgKChhLCBiKSA9PiBhICsgYiwgMCksXG4gICAgICAgIHJlbGF0aXZlV2lkdGhzICA9IG1heFdpZHRocy5tYXAgKHcgPT4gdyAvIHRvdGFsV2lkdGgpLFxuICAgICAgICBtYXhUb3RhbFdpZHRoICAgPSBjZmcubWF4VG90YWxXaWR0aCAtIChkZWxpbWl0ZXJMZW5ndGggKiAobWF4V2lkdGhzLmxlbmd0aCAtIDEpKSxcbiAgICAgICAgZXhjZXNzV2lkdGggICAgID0gTWF0aC5tYXggKDAsIHRvdGFsV2lkdGggLSBtYXhUb3RhbFdpZHRoKSxcbiAgICAgICAgY29tcHV0ZWRXaWR0aHMgID0gemlwIChbY2ZnLm1pbkNvbHVtbldpZHRocywgbWF4V2lkdGhzLCByZWxhdGl2ZVdpZHRoc10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKG1pbiwgbWF4LCByZWxhdGl2ZSkgPT4gTWF0aC5tYXggKG1pbiwgTWF0aC5mbG9vciAobWF4IC0gZXhjZXNzV2lkdGggKiByZWxhdGl2ZSkpKSxcblxuICAgIC8qICBUaGlzIGlzIGhvdyBtYW55IHN5bWJvbHMgd2Ugc2hvdWxkIHBhZCBvciBjdXQgKHBlciBjb2x1bW4pLiAgKi9cblxuICAgICAgICByZXN0Q2VsbFdpZHRocyAgPSBjZWxsV2lkdGhzLm1hcCAod2lkdGhzID0+IHppcCAoW2NvbXB1dGVkV2lkdGhzLCB3aWR0aHNdLCAoYSwgYikgPT4gYSAtIGIpKVxuXG4gICAgLyogIFBlcmZvcm0gZmluYWwgY29tcG9zaXRpb24uICAgKi9cblxuICAgICAgICByZXR1cm4gemlwIChbY2VsbHMsIHJlc3RDZWxsV2lkdGhzXSwgKGEsIGIpID0+XG4gICAgICAgICAgICAgICAgemlwIChbYSwgYl0sIChzdHIsIHcpID0+ICh3ID49IDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gKGNmZy5yaWdodCA/ICgnICcucmVwZWF0ICh3KSArIHN0cikgOiAoc3RyICsgJyAnLnJlcGVhdCAodykpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IChsaW1pdCAoc3RyLCBzdHJsZW4gKHN0cikgKyB3KSkpLmpvaW4gKGNmZy5kZWxpbWl0ZXIpKVxufVxuXG5jb25zdCBhc1RhYmxlID0gY2ZnID0+IE8uYXNzaWduIChhcnIgPT4ge1xuXG4vKiAgUHJpbnQgYXJyYXlzICAqL1xuXG4gICAgaWYgKGFyclswXSAmJiBBcnJheS5pc0FycmF5IChhcnJbMF0pKVxuICAgICAgICByZXR1cm4gYXNDb2x1bW5zIChhcnIsIGNmZykuam9pbiAoJ1xcbicpXG5cbi8qICBQcmludCBvYmplY3RzICAgKi9cblxuICAgIGNvbnN0IGNvbE5hbWVzICAgICAgICA9IFsuLi5uZXcgU2V0IChbXS5jb25jYXQgKC4uLmFyci5tYXAgKE8ua2V5cykpKV0sXG4gICAgICAgICAgY29sdW1ucyAgICAgICAgID0gW2NvbE5hbWVzLm1hcCAoY2ZnLnRpdGxlKSwgLi4uYXJyLm1hcCAobyA9PiBjb2xOYW1lcy5tYXAgKGtleSA9PiBvW2tleV0pKV0sXG4gICAgICAgICAgbGluZXMgICAgICAgICAgID0gYXNDb2x1bW5zIChjb2x1bW5zLCBjZmcpXG5cbiAgICByZXR1cm4gW2xpbmVzWzBdLCBjZmcuZGFzaC5yZXBlYXQgKHN0cmxlbiAobGluZXNbMF0pKSwgLi4ubGluZXMuc2xpY2UgKDEpXS5qb2luICgnXFxuJylcblxufSwgY2ZnLCB7XG5cbiAgICBjb25maWd1cmU6IG5ld0NvbmZpZyA9PiBhc1RhYmxlIChPLmFzc2lnbiAoe30sIGNmZywgbmV3Q29uZmlnKSksXG59KVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzVGFibGUgKHtcblxuICAgIG1heFRvdGFsV2lkdGg6IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSLFxuICAgIHByaW50OiBTdHJpbmcsXG4gICAgdGl0bGU6IFN0cmluZyxcbiAgICBkYXNoOiAnLScsXG4gICAgcmlnaHQ6IGZhbHNlXG59KSIsICIndXNlIHN0cmljdCdcblxuZXhwb3J0cy5ieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aFxuZXhwb3J0cy50b0J5dGVBcnJheSA9IHRvQnl0ZUFycmF5XG5leHBvcnRzLmZyb21CeXRlQXJyYXkgPSBmcm9tQnl0ZUFycmF5XG5cbnZhciBsb29rdXAgPSBbXVxudmFyIHJldkxvb2t1cCA9IFtdXG52YXIgQXJyID0gdHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnID8gVWludDhBcnJheSA6IEFycmF5XG5cbnZhciBjb2RlID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nXG5mb3IgKHZhciBpID0gMCwgbGVuID0gY29kZS5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICBsb29rdXBbaV0gPSBjb2RlW2ldXG4gIHJldkxvb2t1cFtjb2RlLmNoYXJDb2RlQXQoaSldID0gaVxufVxuXG4vLyBTdXBwb3J0IGRlY29kaW5nIFVSTC1zYWZlIGJhc2U2NCBzdHJpbmdzLCBhcyBOb2RlLmpzIGRvZXMuXG4vLyBTZWU6IGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Jhc2U2NCNVUkxfYXBwbGljYXRpb25zXG5yZXZMb29rdXBbJy0nLmNoYXJDb2RlQXQoMCldID0gNjJcbnJldkxvb2t1cFsnXycuY2hhckNvZGVBdCgwKV0gPSA2M1xuXG5mdW5jdGlvbiBnZXRMZW5zIChiNjQpIHtcbiAgdmFyIGxlbiA9IGI2NC5sZW5ndGhcblxuICBpZiAobGVuICUgNCA+IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnKVxuICB9XG5cbiAgLy8gVHJpbSBvZmYgZXh0cmEgYnl0ZXMgYWZ0ZXIgcGxhY2Vob2xkZXIgYnl0ZXMgYXJlIGZvdW5kXG4gIC8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2JlYXRnYW1taXQvYmFzZTY0LWpzL2lzc3Vlcy80MlxuICB2YXIgdmFsaWRMZW4gPSBiNjQuaW5kZXhPZignPScpXG4gIGlmICh2YWxpZExlbiA9PT0gLTEpIHZhbGlkTGVuID0gbGVuXG5cbiAgdmFyIHBsYWNlSG9sZGVyc0xlbiA9IHZhbGlkTGVuID09PSBsZW5cbiAgICA/IDBcbiAgICA6IDQgLSAodmFsaWRMZW4gJSA0KVxuXG4gIHJldHVybiBbdmFsaWRMZW4sIHBsYWNlSG9sZGVyc0xlbl1cbn1cblxuLy8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG5mdW5jdGlvbiBieXRlTGVuZ3RoIChiNjQpIHtcbiAgdmFyIGxlbnMgPSBnZXRMZW5zKGI2NClcbiAgdmFyIHZhbGlkTGVuID0gbGVuc1swXVxuICB2YXIgcGxhY2VIb2xkZXJzTGVuID0gbGVuc1sxXVxuICByZXR1cm4gKCh2YWxpZExlbiArIHBsYWNlSG9sZGVyc0xlbikgKiAzIC8gNCkgLSBwbGFjZUhvbGRlcnNMZW5cbn1cblxuZnVuY3Rpb24gX2J5dGVMZW5ndGggKGI2NCwgdmFsaWRMZW4sIHBsYWNlSG9sZGVyc0xlbikge1xuICByZXR1cm4gKCh2YWxpZExlbiArIHBsYWNlSG9sZGVyc0xlbikgKiAzIC8gNCkgLSBwbGFjZUhvbGRlcnNMZW5cbn1cblxuZnVuY3Rpb24gdG9CeXRlQXJyYXkgKGI2NCkge1xuICB2YXIgdG1wXG4gIHZhciBsZW5zID0gZ2V0TGVucyhiNjQpXG4gIHZhciB2YWxpZExlbiA9IGxlbnNbMF1cbiAgdmFyIHBsYWNlSG9sZGVyc0xlbiA9IGxlbnNbMV1cblxuICB2YXIgYXJyID0gbmV3IEFycihfYnl0ZUxlbmd0aChiNjQsIHZhbGlkTGVuLCBwbGFjZUhvbGRlcnNMZW4pKVxuXG4gIHZhciBjdXJCeXRlID0gMFxuXG4gIC8vIGlmIHRoZXJlIGFyZSBwbGFjZWhvbGRlcnMsIG9ubHkgZ2V0IHVwIHRvIHRoZSBsYXN0IGNvbXBsZXRlIDQgY2hhcnNcbiAgdmFyIGxlbiA9IHBsYWNlSG9sZGVyc0xlbiA+IDBcbiAgICA/IHZhbGlkTGVuIC0gNFxuICAgIDogdmFsaWRMZW5cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSA0KSB7XG4gICAgdG1wID1cbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDE4KSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPDwgMTIpIHxcbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDIpXSA8PCA2KSB8XG4gICAgICByZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDMpXVxuICAgIGFycltjdXJCeXRlKytdID0gKHRtcCA+PiAxNikgJiAweEZGXG4gICAgYXJyW2N1ckJ5dGUrK10gPSAodG1wID4+IDgpICYgMHhGRlxuICAgIGFycltjdXJCeXRlKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgaWYgKHBsYWNlSG9sZGVyc0xlbiA9PT0gMikge1xuICAgIHRtcCA9XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAyKSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPj4gNClcbiAgICBhcnJbY3VyQnl0ZSsrXSA9IHRtcCAmIDB4RkZcbiAgfVxuXG4gIGlmIChwbGFjZUhvbGRlcnNMZW4gPT09IDEpIHtcbiAgICB0bXAgPVxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMTApIHxcbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA8PCA0KSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPj4gMilcbiAgICBhcnJbY3VyQnl0ZSsrXSA9ICh0bXAgPj4gOCkgJiAweEZGXG4gICAgYXJyW2N1ckJ5dGUrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICByZXR1cm4gYXJyXG59XG5cbmZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG4gIHJldHVybiBsb29rdXBbbnVtID4+IDE4ICYgMHgzRl0gK1xuICAgIGxvb2t1cFtudW0gPj4gMTIgJiAweDNGXSArXG4gICAgbG9va3VwW251bSA+PiA2ICYgMHgzRl0gK1xuICAgIGxvb2t1cFtudW0gJiAweDNGXVxufVxuXG5mdW5jdGlvbiBlbmNvZGVDaHVuayAodWludDgsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHRtcFxuICB2YXIgb3V0cHV0ID0gW11cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpICs9IDMpIHtcbiAgICB0bXAgPVxuICAgICAgKCh1aW50OFtpXSA8PCAxNikgJiAweEZGMDAwMCkgK1xuICAgICAgKCh1aW50OFtpICsgMV0gPDwgOCkgJiAweEZGMDApICtcbiAgICAgICh1aW50OFtpICsgMl0gJiAweEZGKVxuICAgIG91dHB1dC5wdXNoKHRyaXBsZXRUb0Jhc2U2NCh0bXApKVxuICB9XG4gIHJldHVybiBvdXRwdXQuam9pbignJylcbn1cblxuZnVuY3Rpb24gZnJvbUJ5dGVBcnJheSAodWludDgpIHtcbiAgdmFyIHRtcFxuICB2YXIgbGVuID0gdWludDgubGVuZ3RoXG4gIHZhciBleHRyYUJ5dGVzID0gbGVuICUgMyAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuICB2YXIgcGFydHMgPSBbXVxuICB2YXIgbWF4Q2h1bmtMZW5ndGggPSAxNjM4MyAvLyBtdXN0IGJlIG11bHRpcGxlIG9mIDNcblxuICAvLyBnbyB0aHJvdWdoIHRoZSBhcnJheSBldmVyeSB0aHJlZSBieXRlcywgd2UnbGwgZGVhbCB3aXRoIHRyYWlsaW5nIHN0dWZmIGxhdGVyXG4gIGZvciAodmFyIGkgPSAwLCBsZW4yID0gbGVuIC0gZXh0cmFCeXRlczsgaSA8IGxlbjI7IGkgKz0gbWF4Q2h1bmtMZW5ndGgpIHtcbiAgICBwYXJ0cy5wdXNoKGVuY29kZUNodW5rKFxuICAgICAgdWludDgsIGksIChpICsgbWF4Q2h1bmtMZW5ndGgpID4gbGVuMiA/IGxlbjIgOiAoaSArIG1heENodW5rTGVuZ3RoKVxuICAgICkpXG4gIH1cblxuICAvLyBwYWQgdGhlIGVuZCB3aXRoIHplcm9zLCBidXQgbWFrZSBzdXJlIHRvIG5vdCBmb3JnZXQgdGhlIGV4dHJhIGJ5dGVzXG4gIGlmIChleHRyYUJ5dGVzID09PSAxKSB7XG4gICAgdG1wID0gdWludDhbbGVuIC0gMV1cbiAgICBwYXJ0cy5wdXNoKFxuICAgICAgbG9va3VwW3RtcCA+PiAyXSArXG4gICAgICBsb29rdXBbKHRtcCA8PCA0KSAmIDB4M0ZdICtcbiAgICAgICc9PSdcbiAgICApXG4gIH0gZWxzZSBpZiAoZXh0cmFCeXRlcyA9PT0gMikge1xuICAgIHRtcCA9ICh1aW50OFtsZW4gLSAyXSA8PCA4KSArIHVpbnQ4W2xlbiAtIDFdXG4gICAgcGFydHMucHVzaChcbiAgICAgIGxvb2t1cFt0bXAgPj4gMTBdICtcbiAgICAgIGxvb2t1cFsodG1wID4+IDQpICYgMHgzRl0gK1xuICAgICAgbG9va3VwWyh0bXAgPDwgMikgJiAweDNGXSArXG4gICAgICAnPSdcbiAgICApXG4gIH1cblxuICByZXR1cm4gcGFydHMuam9pbignJylcbn1cbiIsICIvKiFcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxodHRwczovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG5cbid1c2Ugc3RyaWN0J1xuXG52YXIgYmFzZTY0ID0gcmVxdWlyZSgnYmFzZTY0LWpzJylcbnZhciBpZWVlNzU0ID0gcmVxdWlyZSgnaWVlZTc1NCcpXG5cbmV4cG9ydHMuQnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLlNsb3dCdWZmZXIgPSBTbG93QnVmZmVyXG5leHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTID0gNTBcblxudmFyIEtfTUFYX0xFTkdUSCA9IDB4N2ZmZmZmZmZcbmV4cG9ydHMua01heExlbmd0aCA9IEtfTUFYX0xFTkdUSFxuXG4vKipcbiAqIElmIGBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVGA6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBQcmludCB3YXJuaW5nIGFuZCByZWNvbW1lbmQgdXNpbmcgYGJ1ZmZlcmAgdjQueCB3aGljaCBoYXMgYW4gT2JqZWN0XG4gKiAgICAgICAgICAgICAgIGltcGxlbWVudGF0aW9uIChtb3N0IGNvbXBhdGlibGUsIGV2ZW4gSUU2KVxuICpcbiAqIEJyb3dzZXJzIHRoYXQgc3VwcG9ydCB0eXBlZCBhcnJheXMgYXJlIElFIDEwKywgRmlyZWZveCA0KywgQ2hyb21lIDcrLCBTYWZhcmkgNS4xKyxcbiAqIE9wZXJhIDExLjYrLCBpT1MgNC4yKy5cbiAqXG4gKiBXZSByZXBvcnQgdGhhdCB0aGUgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IHR5cGVkIGFycmF5cyBpZiB0aGUgYXJlIG5vdCBzdWJjbGFzc2FibGVcbiAqIHVzaW5nIF9fcHJvdG9fXy4gRmlyZWZveCA0LTI5IGxhY2tzIHN1cHBvcnQgZm9yIGFkZGluZyBuZXcgcHJvcGVydGllcyB0byBgVWludDhBcnJheWBcbiAqIChTZWU6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NTQzOCkuIElFIDEwIGxhY2tzIHN1cHBvcnRcbiAqIGZvciBfX3Byb3RvX18gYW5kIGhhcyBhIGJ1Z2d5IHR5cGVkIGFycmF5IGltcGxlbWVudGF0aW9uLlxuICovXG5CdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCA9IHR5cGVkQXJyYXlTdXBwb3J0KClcblxuaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCAmJiB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICB0eXBlb2YgY29uc29sZS5lcnJvciA9PT0gJ2Z1bmN0aW9uJykge1xuICBjb25zb2xlLmVycm9yKFxuICAgICdUaGlzIGJyb3dzZXIgbGFja3MgdHlwZWQgYXJyYXkgKFVpbnQ4QXJyYXkpIHN1cHBvcnQgd2hpY2ggaXMgcmVxdWlyZWQgYnkgJyArXG4gICAgJ2BidWZmZXJgIHY1LnguIFVzZSBgYnVmZmVyYCB2NC54IGlmIHlvdSByZXF1aXJlIG9sZCBicm93c2VyIHN1cHBvcnQuJ1xuICApXG59XG5cbmZ1bmN0aW9uIHR5cGVkQXJyYXlTdXBwb3J0ICgpIHtcbiAgLy8gQ2FuIHR5cGVkIGFycmF5IGluc3RhbmNlcyBjYW4gYmUgYXVnbWVudGVkP1xuICB0cnkge1xuICAgIHZhciBhcnIgPSBuZXcgVWludDhBcnJheSgxKVxuICAgIGFyci5fX3Byb3RvX18gPSB7IF9fcHJvdG9fXzogVWludDhBcnJheS5wcm90b3R5cGUsIGZvbzogZnVuY3Rpb24gKCkgeyByZXR1cm4gNDIgfSB9XG4gICAgcmV0dXJuIGFyci5mb28oKSA9PT0gNDJcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShCdWZmZXIucHJvdG90eXBlLCAncGFyZW50Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcih0aGlzKSkgcmV0dXJuIHVuZGVmaW5lZFxuICAgIHJldHVybiB0aGlzLmJ1ZmZlclxuICB9XG59KVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoQnVmZmVyLnByb3RvdHlwZSwgJ29mZnNldCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFCdWZmZXIuaXNCdWZmZXIodGhpcykpIHJldHVybiB1bmRlZmluZWRcbiAgICByZXR1cm4gdGhpcy5ieXRlT2Zmc2V0XG4gIH1cbn0pXG5cbmZ1bmN0aW9uIGNyZWF0ZUJ1ZmZlciAobGVuZ3RoKSB7XG4gIGlmIChsZW5ndGggPiBLX01BWF9MRU5HVEgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVGhlIHZhbHVlIFwiJyArIGxlbmd0aCArICdcIiBpcyBpbnZhbGlkIGZvciBvcHRpb24gXCJzaXplXCInKVxuICB9XG4gIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlXG4gIHZhciBidWYgPSBuZXcgVWludDhBcnJheShsZW5ndGgpXG4gIGJ1Zi5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIHJldHVybiBidWZcbn1cblxuLyoqXG4gKiBUaGUgQnVmZmVyIGNvbnN0cnVjdG9yIHJldHVybnMgaW5zdGFuY2VzIG9mIGBVaW50OEFycmF5YCB0aGF0IGhhdmUgdGhlaXJcbiAqIHByb3RvdHlwZSBjaGFuZ2VkIHRvIGBCdWZmZXIucHJvdG90eXBlYC4gRnVydGhlcm1vcmUsIGBCdWZmZXJgIGlzIGEgc3ViY2xhc3Mgb2ZcbiAqIGBVaW50OEFycmF5YCwgc28gdGhlIHJldHVybmVkIGluc3RhbmNlcyB3aWxsIGhhdmUgYWxsIHRoZSBub2RlIGBCdWZmZXJgIG1ldGhvZHNcbiAqIGFuZCB0aGUgYFVpbnQ4QXJyYXlgIG1ldGhvZHMuIFNxdWFyZSBicmFja2V0IG5vdGF0aW9uIHdvcmtzIGFzIGV4cGVjdGVkIC0tIGl0XG4gKiByZXR1cm5zIGEgc2luZ2xlIG9jdGV0LlxuICpcbiAqIFRoZSBgVWludDhBcnJheWAgcHJvdG90eXBlIHJlbWFpbnMgdW5tb2RpZmllZC5cbiAqL1xuXG5mdW5jdGlvbiBCdWZmZXIgKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIC8vIENvbW1vbiBjYXNlLlxuICBpZiAodHlwZW9mIGFyZyA9PT0gJ251bWJlcicpIHtcbiAgICBpZiAodHlwZW9mIGVuY29kaW5nT3JPZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAnVGhlIFwic3RyaW5nXCIgYXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIHN0cmluZy4gUmVjZWl2ZWQgdHlwZSBudW1iZXInXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiBhbGxvY1Vuc2FmZShhcmcpXG4gIH1cbiAgcmV0dXJuIGZyb20oYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG59XG5cbi8vIEZpeCBzdWJhcnJheSgpIGluIEVTMjAxNi4gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9wdWxsLzk3XG5pZiAodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnNwZWNpZXMgIT0gbnVsbCAmJlxuICAgIEJ1ZmZlcltTeW1ib2wuc3BlY2llc10gPT09IEJ1ZmZlcikge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQnVmZmVyLCBTeW1ib2wuc3BlY2llcywge1xuICAgIHZhbHVlOiBudWxsLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICB3cml0YWJsZTogZmFsc2VcbiAgfSlcbn1cblxuQnVmZmVyLnBvb2xTaXplID0gODE5MiAvLyBub3QgdXNlZCBieSB0aGlzIGltcGxlbWVudGF0aW9uXG5cbmZ1bmN0aW9uIGZyb20gKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZnJvbVN0cmluZyh2YWx1ZSwgZW5jb2RpbmdPck9mZnNldClcbiAgfVxuXG4gIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZyb21BcnJheUxpa2UodmFsdWUpXG4gIH1cblxuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHRocm93IFR5cGVFcnJvcihcbiAgICAgICdUaGUgZmlyc3QgYXJndW1lbnQgbXVzdCBiZSBvbmUgb2YgdHlwZSBzdHJpbmcsIEJ1ZmZlciwgQXJyYXlCdWZmZXIsIEFycmF5LCAnICtcbiAgICAgICdvciBBcnJheS1saWtlIE9iamVjdC4gUmVjZWl2ZWQgdHlwZSAnICsgKHR5cGVvZiB2YWx1ZSlcbiAgICApXG4gIH1cblxuICBpZiAoaXNJbnN0YW5jZSh2YWx1ZSwgQXJyYXlCdWZmZXIpIHx8XG4gICAgICAodmFsdWUgJiYgaXNJbnN0YW5jZSh2YWx1ZS5idWZmZXIsIEFycmF5QnVmZmVyKSkpIHtcbiAgICByZXR1cm4gZnJvbUFycmF5QnVmZmVyKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAnVGhlIFwidmFsdWVcIiBhcmd1bWVudCBtdXN0IG5vdCBiZSBvZiB0eXBlIG51bWJlci4gUmVjZWl2ZWQgdHlwZSBudW1iZXInXG4gICAgKVxuICB9XG5cbiAgdmFyIHZhbHVlT2YgPSB2YWx1ZS52YWx1ZU9mICYmIHZhbHVlLnZhbHVlT2YoKVxuICBpZiAodmFsdWVPZiAhPSBudWxsICYmIHZhbHVlT2YgIT09IHZhbHVlKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKHZhbHVlT2YsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIHZhciBiID0gZnJvbU9iamVjdCh2YWx1ZSlcbiAgaWYgKGIpIHJldHVybiBiXG5cbiAgaWYgKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1ByaW1pdGl2ZSAhPSBudWxsICYmXG4gICAgICB0eXBlb2YgdmFsdWVbU3ltYm9sLnRvUHJpbWl0aXZlXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBCdWZmZXIuZnJvbShcbiAgICAgIHZhbHVlW1N5bWJvbC50b1ByaW1pdGl2ZV0oJ3N0cmluZycpLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGhcbiAgICApXG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICdUaGUgZmlyc3QgYXJndW1lbnQgbXVzdCBiZSBvbmUgb2YgdHlwZSBzdHJpbmcsIEJ1ZmZlciwgQXJyYXlCdWZmZXIsIEFycmF5LCAnICtcbiAgICAnb3IgQXJyYXktbGlrZSBPYmplY3QuIFJlY2VpdmVkIHR5cGUgJyArICh0eXBlb2YgdmFsdWUpXG4gIClcbn1cblxuLyoqXG4gKiBGdW5jdGlvbmFsbHkgZXF1aXZhbGVudCB0byBCdWZmZXIoYXJnLCBlbmNvZGluZykgYnV0IHRocm93cyBhIFR5cGVFcnJvclxuICogaWYgdmFsdWUgaXMgYSBudW1iZXIuXG4gKiBCdWZmZXIuZnJvbShzdHJbLCBlbmNvZGluZ10pXG4gKiBCdWZmZXIuZnJvbShhcnJheSlcbiAqIEJ1ZmZlci5mcm9tKGJ1ZmZlcilcbiAqIEJ1ZmZlci5mcm9tKGFycmF5QnVmZmVyWywgYnl0ZU9mZnNldFssIGxlbmd0aF1dKVxuICoqL1xuQnVmZmVyLmZyb20gPSBmdW5jdGlvbiAodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gZnJvbSh2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxufVxuXG4vLyBOb3RlOiBDaGFuZ2UgcHJvdG90eXBlICphZnRlciogQnVmZmVyLmZyb20gaXMgZGVmaW5lZCB0byB3b3JrYXJvdW5kIENocm9tZSBidWc6XG4vLyBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9wdWxsLzE0OFxuQnVmZmVyLnByb3RvdHlwZS5fX3Byb3RvX18gPSBVaW50OEFycmF5LnByb3RvdHlwZVxuQnVmZmVyLl9fcHJvdG9fXyA9IFVpbnQ4QXJyYXlcblxuZnVuY3Rpb24gYXNzZXJ0U2l6ZSAoc2l6ZSkge1xuICBpZiAodHlwZW9mIHNpemUgIT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJzaXplXCIgYXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIG51bWJlcicpXG4gIH0gZWxzZSBpZiAoc2l6ZSA8IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVGhlIHZhbHVlIFwiJyArIHNpemUgKyAnXCIgaXMgaW52YWxpZCBmb3Igb3B0aW9uIFwic2l6ZVwiJylcbiAgfVxufVxuXG5mdW5jdGlvbiBhbGxvYyAoc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcbiAgYXNzZXJ0U2l6ZShzaXplKVxuICBpZiAoc2l6ZSA8PSAwKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcihzaXplKVxuICB9XG4gIGlmIChmaWxsICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBPbmx5IHBheSBhdHRlbnRpb24gdG8gZW5jb2RpbmcgaWYgaXQncyBhIHN0cmluZy4gVGhpc1xuICAgIC8vIHByZXZlbnRzIGFjY2lkZW50YWxseSBzZW5kaW5nIGluIGEgbnVtYmVyIHRoYXQgd291bGRcbiAgICAvLyBiZSBpbnRlcnByZXR0ZWQgYXMgYSBzdGFydCBvZmZzZXQuXG4gICAgcmV0dXJuIHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZydcbiAgICAgID8gY3JlYXRlQnVmZmVyKHNpemUpLmZpbGwoZmlsbCwgZW5jb2RpbmcpXG4gICAgICA6IGNyZWF0ZUJ1ZmZlcihzaXplKS5maWxsKGZpbGwpXG4gIH1cbiAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcihzaXplKVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqIGFsbG9jKHNpemVbLCBmaWxsWywgZW5jb2RpbmddXSlcbiAqKi9cbkJ1ZmZlci5hbGxvYyA9IGZ1bmN0aW9uIChzaXplLCBmaWxsLCBlbmNvZGluZykge1xuICByZXR1cm4gYWxsb2Moc2l6ZSwgZmlsbCwgZW5jb2RpbmcpXG59XG5cbmZ1bmN0aW9uIGFsbG9jVW5zYWZlIChzaXplKSB7XG4gIGFzc2VydFNpemUoc2l6ZSlcbiAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcihzaXplIDwgMCA/IDAgOiBjaGVja2VkKHNpemUpIHwgMClcbn1cblxuLyoqXG4gKiBFcXVpdmFsZW50IHRvIEJ1ZmZlcihudW0pLCBieSBkZWZhdWx0IGNyZWF0ZXMgYSBub24temVyby1maWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICogKi9cbkJ1ZmZlci5hbGxvY1Vuc2FmZSA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIHJldHVybiBhbGxvY1Vuc2FmZShzaXplKVxufVxuLyoqXG4gKiBFcXVpdmFsZW50IHRvIFNsb3dCdWZmZXIobnVtKSwgYnkgZGVmYXVsdCBjcmVhdGVzIGEgbm9uLXplcm8tZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqL1xuQnVmZmVyLmFsbG9jVW5zYWZlU2xvdyA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIHJldHVybiBhbGxvY1Vuc2FmZShzaXplKVxufVxuXG5mdW5jdGlvbiBmcm9tU3RyaW5nIChzdHJpbmcsIGVuY29kaW5nKSB7XG4gIGlmICh0eXBlb2YgZW5jb2RpbmcgIT09ICdzdHJpbmcnIHx8IGVuY29kaW5nID09PSAnJykge1xuICAgIGVuY29kaW5nID0gJ3V0ZjgnXG4gIH1cblxuICBpZiAoIUJ1ZmZlci5pc0VuY29kaW5nKGVuY29kaW5nKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgfVxuXG4gIHZhciBsZW5ndGggPSBieXRlTGVuZ3RoKHN0cmluZywgZW5jb2RpbmcpIHwgMFxuICB2YXIgYnVmID0gY3JlYXRlQnVmZmVyKGxlbmd0aClcblxuICB2YXIgYWN0dWFsID0gYnVmLndyaXRlKHN0cmluZywgZW5jb2RpbmcpXG5cbiAgaWYgKGFjdHVhbCAhPT0gbGVuZ3RoKSB7XG4gICAgLy8gV3JpdGluZyBhIGhleCBzdHJpbmcsIGZvciBleGFtcGxlLCB0aGF0IGNvbnRhaW5zIGludmFsaWQgY2hhcmFjdGVycyB3aWxsXG4gICAgLy8gY2F1c2UgZXZlcnl0aGluZyBhZnRlciB0aGUgZmlyc3QgaW52YWxpZCBjaGFyYWN0ZXIgdG8gYmUgaWdub3JlZC4gKGUuZy5cbiAgICAvLyAnYWJ4eGNkJyB3aWxsIGJlIHRyZWF0ZWQgYXMgJ2FiJylcbiAgICBidWYgPSBidWYuc2xpY2UoMCwgYWN0dWFsKVxuICB9XG5cbiAgcmV0dXJuIGJ1ZlxufVxuXG5mdW5jdGlvbiBmcm9tQXJyYXlMaWtlIChhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoIDwgMCA/IDAgOiBjaGVja2VkKGFycmF5Lmxlbmd0aCkgfCAwXG4gIHZhciBidWYgPSBjcmVhdGVCdWZmZXIobGVuZ3RoKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgYnVmW2ldID0gYXJyYXlbaV0gJiAyNTVcbiAgfVxuICByZXR1cm4gYnVmXG59XG5cbmZ1bmN0aW9uIGZyb21BcnJheUJ1ZmZlciAoYXJyYXksIGJ5dGVPZmZzZXQsIGxlbmd0aCkge1xuICBpZiAoYnl0ZU9mZnNldCA8IDAgfHwgYXJyYXkuYnl0ZUxlbmd0aCA8IGJ5dGVPZmZzZXQpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXCJvZmZzZXRcIiBpcyBvdXRzaWRlIG9mIGJ1ZmZlciBib3VuZHMnKVxuICB9XG5cbiAgaWYgKGFycmF5LmJ5dGVMZW5ndGggPCBieXRlT2Zmc2V0ICsgKGxlbmd0aCB8fCAwKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcImxlbmd0aFwiIGlzIG91dHNpZGUgb2YgYnVmZmVyIGJvdW5kcycpXG4gIH1cblxuICB2YXIgYnVmXG4gIGlmIChieXRlT2Zmc2V0ID09PSB1bmRlZmluZWQgJiYgbGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBidWYgPSBuZXcgVWludDhBcnJheShhcnJheSlcbiAgfSBlbHNlIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGJ1ZiA9IG5ldyBVaW50OEFycmF5KGFycmF5LCBieXRlT2Zmc2V0KVxuICB9IGVsc2Uge1xuICAgIGJ1ZiA9IG5ldyBVaW50OEFycmF5KGFycmF5LCBieXRlT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZVxuICBidWYuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICByZXR1cm4gYnVmXG59XG5cbmZ1bmN0aW9uIGZyb21PYmplY3QgKG9iaikge1xuICBpZiAoQnVmZmVyLmlzQnVmZmVyKG9iaikpIHtcbiAgICB2YXIgbGVuID0gY2hlY2tlZChvYmoubGVuZ3RoKSB8IDBcbiAgICB2YXIgYnVmID0gY3JlYXRlQnVmZmVyKGxlbilcblxuICAgIGlmIChidWYubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gYnVmXG4gICAgfVxuXG4gICAgb2JqLmNvcHkoYnVmLCAwLCAwLCBsZW4pXG4gICAgcmV0dXJuIGJ1ZlxuICB9XG5cbiAgaWYgKG9iai5sZW5ndGggIT09IHVuZGVmaW5lZCkge1xuICAgIGlmICh0eXBlb2Ygb2JqLmxlbmd0aCAhPT0gJ251bWJlcicgfHwgbnVtYmVySXNOYU4ob2JqLmxlbmd0aCkpIHtcbiAgICAgIHJldHVybiBjcmVhdGVCdWZmZXIoMClcbiAgICB9XG4gICAgcmV0dXJuIGZyb21BcnJheUxpa2Uob2JqKVxuICB9XG5cbiAgaWYgKG9iai50eXBlID09PSAnQnVmZmVyJyAmJiBBcnJheS5pc0FycmF5KG9iai5kYXRhKSkge1xuICAgIHJldHVybiBmcm9tQXJyYXlMaWtlKG9iai5kYXRhKVxuICB9XG59XG5cbmZ1bmN0aW9uIGNoZWNrZWQgKGxlbmd0aCkge1xuICAvLyBOb3RlOiBjYW5ub3QgdXNlIGBsZW5ndGggPCBLX01BWF9MRU5HVEhgIGhlcmUgYmVjYXVzZSB0aGF0IGZhaWxzIHdoZW5cbiAgLy8gbGVuZ3RoIGlzIE5hTiAod2hpY2ggaXMgb3RoZXJ3aXNlIGNvZXJjZWQgdG8gemVyby4pXG4gIGlmIChsZW5ndGggPj0gS19NQVhfTEVOR1RIKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0F0dGVtcHQgdG8gYWxsb2NhdGUgQnVmZmVyIGxhcmdlciB0aGFuIG1heGltdW0gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgJ3NpemU6IDB4JyArIEtfTUFYX0xFTkdUSC50b1N0cmluZygxNikgKyAnIGJ5dGVzJylcbiAgfVxuICByZXR1cm4gbGVuZ3RoIHwgMFxufVxuXG5mdW5jdGlvbiBTbG93QnVmZmVyIChsZW5ndGgpIHtcbiAgaWYgKCtsZW5ndGggIT0gbGVuZ3RoKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgZXFlcWVxXG4gICAgbGVuZ3RoID0gMFxuICB9XG4gIHJldHVybiBCdWZmZXIuYWxsb2MoK2xlbmd0aClcbn1cblxuQnVmZmVyLmlzQnVmZmVyID0gZnVuY3Rpb24gaXNCdWZmZXIgKGIpIHtcbiAgcmV0dXJuIGIgIT0gbnVsbCAmJiBiLl9pc0J1ZmZlciA9PT0gdHJ1ZSAmJlxuICAgIGIgIT09IEJ1ZmZlci5wcm90b3R5cGUgLy8gc28gQnVmZmVyLmlzQnVmZmVyKEJ1ZmZlci5wcm90b3R5cGUpIHdpbGwgYmUgZmFsc2Vcbn1cblxuQnVmZmVyLmNvbXBhcmUgPSBmdW5jdGlvbiBjb21wYXJlIChhLCBiKSB7XG4gIGlmIChpc0luc3RhbmNlKGEsIFVpbnQ4QXJyYXkpKSBhID0gQnVmZmVyLmZyb20oYSwgYS5vZmZzZXQsIGEuYnl0ZUxlbmd0aClcbiAgaWYgKGlzSW5zdGFuY2UoYiwgVWludDhBcnJheSkpIGIgPSBCdWZmZXIuZnJvbShiLCBiLm9mZnNldCwgYi5ieXRlTGVuZ3RoKVxuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihhKSB8fCAhQnVmZmVyLmlzQnVmZmVyKGIpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICdUaGUgXCJidWYxXCIsIFwiYnVmMlwiIGFyZ3VtZW50cyBtdXN0IGJlIG9uZSBvZiB0eXBlIEJ1ZmZlciBvciBVaW50OEFycmF5J1xuICAgIClcbiAgfVxuXG4gIGlmIChhID09PSBiKSByZXR1cm4gMFxuXG4gIHZhciB4ID0gYS5sZW5ndGhcbiAgdmFyIHkgPSBiLmxlbmd0aFxuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBNYXRoLm1pbih4LCB5KTsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKGFbaV0gIT09IGJbaV0pIHtcbiAgICAgIHggPSBhW2ldXG4gICAgICB5ID0gYltpXVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHJldHVybiAtMVxuICBpZiAoeSA8IHgpIHJldHVybiAxXG4gIHJldHVybiAwXG59XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gaXNFbmNvZGluZyAoZW5jb2RpbmcpIHtcbiAgc3dpdGNoIChTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnbGF0aW4xJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbkJ1ZmZlci5jb25jYXQgPSBmdW5jdGlvbiBjb25jYXQgKGxpc3QsIGxlbmd0aCkge1xuICBpZiAoIUFycmF5LmlzQXJyYXkobGlzdCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICB9XG5cbiAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5hbGxvYygwKVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbGVuZ3RoID0gMFxuICAgIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgICBsZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmZmVyID0gQnVmZmVyLmFsbG9jVW5zYWZlKGxlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgYnVmID0gbGlzdFtpXVxuICAgIGlmIChpc0luc3RhbmNlKGJ1ZiwgVWludDhBcnJheSkpIHtcbiAgICAgIGJ1ZiA9IEJ1ZmZlci5mcm9tKGJ1ZilcbiAgICB9XG4gICAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJsaXN0XCIgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBCdWZmZXJzJylcbiAgICB9XG4gICAgYnVmLmNvcHkoYnVmZmVyLCBwb3MpXG4gICAgcG9zICs9IGJ1Zi5sZW5ndGhcbiAgfVxuICByZXR1cm4gYnVmZmVyXG59XG5cbmZ1bmN0aW9uIGJ5dGVMZW5ndGggKHN0cmluZywgZW5jb2RpbmcpIHtcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihzdHJpbmcpKSB7XG4gICAgcmV0dXJuIHN0cmluZy5sZW5ndGhcbiAgfVxuICBpZiAoQXJyYXlCdWZmZXIuaXNWaWV3KHN0cmluZykgfHwgaXNJbnN0YW5jZShzdHJpbmcsIEFycmF5QnVmZmVyKSkge1xuICAgIHJldHVybiBzdHJpbmcuYnl0ZUxlbmd0aFxuICB9XG4gIGlmICh0eXBlb2Ygc3RyaW5nICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAnVGhlIFwic3RyaW5nXCIgYXJndW1lbnQgbXVzdCBiZSBvbmUgb2YgdHlwZSBzdHJpbmcsIEJ1ZmZlciwgb3IgQXJyYXlCdWZmZXIuICcgK1xuICAgICAgJ1JlY2VpdmVkIHR5cGUgJyArIHR5cGVvZiBzdHJpbmdcbiAgICApXG4gIH1cblxuICB2YXIgbGVuID0gc3RyaW5nLmxlbmd0aFxuICB2YXIgbXVzdE1hdGNoID0gKGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSA9PT0gdHJ1ZSlcbiAgaWYgKCFtdXN0TWF0Y2ggJiYgbGVuID09PSAwKSByZXR1cm4gMFxuXG4gIC8vIFVzZSBhIGZvciBsb29wIHRvIGF2b2lkIHJlY3Vyc2lvblxuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuICBmb3IgKDs7KSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsZW5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGhcbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiBsZW4gKiAyXG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gbGVuID4+PiAxXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0VG9CeXRlcyhzdHJpbmcpLmxlbmd0aFxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSB7XG4gICAgICAgICAgcmV0dXJuIG11c3RNYXRjaCA/IC0xIDogdXRmOFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGggLy8gYXNzdW1lIHV0ZjhcbiAgICAgICAgfVxuICAgICAgICBlbmNvZGluZyA9ICgnJyArIGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuQnVmZmVyLmJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoXG5cbmZ1bmN0aW9uIHNsb3dUb1N0cmluZyAoZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcblxuICAvLyBObyBuZWVkIHRvIHZlcmlmeSB0aGF0IFwidGhpcy5sZW5ndGggPD0gTUFYX1VJTlQzMlwiIHNpbmNlIGl0J3MgYSByZWFkLW9ubHlcbiAgLy8gcHJvcGVydHkgb2YgYSB0eXBlZCBhcnJheS5cblxuICAvLyBUaGlzIGJlaGF2ZXMgbmVpdGhlciBsaWtlIFN0cmluZyBub3IgVWludDhBcnJheSBpbiB0aGF0IHdlIHNldCBzdGFydC9lbmRcbiAgLy8gdG8gdGhlaXIgdXBwZXIvbG93ZXIgYm91bmRzIGlmIHRoZSB2YWx1ZSBwYXNzZWQgaXMgb3V0IG9mIHJhbmdlLlxuICAvLyB1bmRlZmluZWQgaXMgaGFuZGxlZCBzcGVjaWFsbHkgYXMgcGVyIEVDTUEtMjYyIDZ0aCBFZGl0aW9uLFxuICAvLyBTZWN0aW9uIDEzLjMuMy43IFJ1bnRpbWUgU2VtYW50aWNzOiBLZXllZEJpbmRpbmdJbml0aWFsaXphdGlvbi5cbiAgaWYgKHN0YXJ0ID09PSB1bmRlZmluZWQgfHwgc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgPSAwXG4gIH1cbiAgLy8gUmV0dXJuIGVhcmx5IGlmIHN0YXJ0ID4gdGhpcy5sZW5ndGguIERvbmUgaGVyZSB0byBwcmV2ZW50IHBvdGVudGlhbCB1aW50MzJcbiAgLy8gY29lcmNpb24gZmFpbCBiZWxvdy5cbiAgaWYgKHN0YXJ0ID4gdGhpcy5sZW5ndGgpIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIGlmIChlbmQgPT09IHVuZGVmaW5lZCB8fCBlbmQgPiB0aGlzLmxlbmd0aCkge1xuICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gIH1cblxuICBpZiAoZW5kIDw9IDApIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIC8vIEZvcmNlIGNvZXJzaW9uIHRvIHVpbnQzMi4gVGhpcyB3aWxsIGFsc28gY29lcmNlIGZhbHNleS9OYU4gdmFsdWVzIHRvIDAuXG4gIGVuZCA+Pj49IDBcbiAgc3RhcnQgPj4+PSAwXG5cbiAgaWYgKGVuZCA8PSBzdGFydCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSAndXRmOCdcblxuICB3aGlsZSAodHJ1ZSkge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBoZXhTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICAgIHJldHVybiBhc2NpaVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gbGF0aW4xU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgcmV0dXJuIGJhc2U2NFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiB1dGYxNmxlU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgICAgIGVuY29kaW5nID0gKGVuY29kaW5nICsgJycpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5cbi8vIFRoaXMgcHJvcGVydHkgaXMgdXNlZCBieSBgQnVmZmVyLmlzQnVmZmVyYCAoYW5kIHRoZSBgaXMtYnVmZmVyYCBucG0gcGFja2FnZSlcbi8vIHRvIGRldGVjdCBhIEJ1ZmZlciBpbnN0YW5jZS4gSXQncyBub3QgcG9zc2libGUgdG8gdXNlIGBpbnN0YW5jZW9mIEJ1ZmZlcmBcbi8vIHJlbGlhYmx5IGluIGEgYnJvd3NlcmlmeSBjb250ZXh0IGJlY2F1c2UgdGhlcmUgY291bGQgYmUgbXVsdGlwbGUgZGlmZmVyZW50XG4vLyBjb3BpZXMgb2YgdGhlICdidWZmZXInIHBhY2thZ2UgaW4gdXNlLiBUaGlzIG1ldGhvZCB3b3JrcyBldmVuIGZvciBCdWZmZXJcbi8vIGluc3RhbmNlcyB0aGF0IHdlcmUgY3JlYXRlZCBmcm9tIGFub3RoZXIgY29weSBvZiB0aGUgYGJ1ZmZlcmAgcGFja2FnZS5cbi8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXIvaXNzdWVzLzE1NFxuQnVmZmVyLnByb3RvdHlwZS5faXNCdWZmZXIgPSB0cnVlXG5cbmZ1bmN0aW9uIHN3YXAgKGIsIG4sIG0pIHtcbiAgdmFyIGkgPSBiW25dXG4gIGJbbl0gPSBiW21dXG4gIGJbbV0gPSBpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDE2ID0gZnVuY3Rpb24gc3dhcDE2ICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSAyICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiAxNi1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSAyKSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgMSlcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXAzMiA9IGZ1bmN0aW9uIHN3YXAzMiAoKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgNCAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgMzItYml0cycpXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gNCkge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDMpXG4gICAgc3dhcCh0aGlzLCBpICsgMSwgaSArIDIpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwNjQgPSBmdW5jdGlvbiBzd2FwNjQgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDggIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDY0LWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDgpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyA3KVxuICAgIHN3YXAodGhpcywgaSArIDEsIGkgKyA2KVxuICAgIHN3YXAodGhpcywgaSArIDIsIGkgKyA1KVxuICAgIHN3YXAodGhpcywgaSArIDMsIGkgKyA0KVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyAoKSB7XG4gIHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuZ3RoID09PSAwKSByZXR1cm4gJydcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHJldHVybiB1dGY4U2xpY2UodGhpcywgMCwgbGVuZ3RoKVxuICByZXR1cm4gc2xvd1RvU3RyaW5nLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0xvY2FsZVN0cmluZyA9IEJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmdcblxuQnVmZmVyLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiBlcXVhbHMgKGIpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXInKVxuICBpZiAodGhpcyA9PT0gYikgcmV0dXJuIHRydWVcbiAgcmV0dXJuIEJ1ZmZlci5jb21wYXJlKHRoaXMsIGIpID09PSAwXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uIGluc3BlY3QgKCkge1xuICB2YXIgc3RyID0gJydcbiAgdmFyIG1heCA9IGV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVNcbiAgc3RyID0gdGhpcy50b1N0cmluZygnaGV4JywgMCwgbWF4KS5yZXBsYWNlKC8oLnsyfSkvZywgJyQxICcpLnRyaW0oKVxuICBpZiAodGhpcy5sZW5ndGggPiBtYXgpIHN0ciArPSAnIC4uLiAnXG4gIHJldHVybiAnPEJ1ZmZlciAnICsgc3RyICsgJz4nXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuY29tcGFyZSA9IGZ1bmN0aW9uIGNvbXBhcmUgKHRhcmdldCwgc3RhcnQsIGVuZCwgdGhpc1N0YXJ0LCB0aGlzRW5kKSB7XG4gIGlmIChpc0luc3RhbmNlKHRhcmdldCwgVWludDhBcnJheSkpIHtcbiAgICB0YXJnZXQgPSBCdWZmZXIuZnJvbSh0YXJnZXQsIHRhcmdldC5vZmZzZXQsIHRhcmdldC5ieXRlTGVuZ3RoKVxuICB9XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKHRhcmdldCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgJ1RoZSBcInRhcmdldFwiIGFyZ3VtZW50IG11c3QgYmUgb25lIG9mIHR5cGUgQnVmZmVyIG9yIFVpbnQ4QXJyYXkuICcgK1xuICAgICAgJ1JlY2VpdmVkIHR5cGUgJyArICh0eXBlb2YgdGFyZ2V0KVxuICAgIClcbiAgfVxuXG4gIGlmIChzdGFydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgc3RhcnQgPSAwXG4gIH1cbiAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZW5kID0gdGFyZ2V0ID8gdGFyZ2V0Lmxlbmd0aCA6IDBcbiAgfVxuICBpZiAodGhpc1N0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzU3RhcnQgPSAwXG4gIH1cbiAgaWYgKHRoaXNFbmQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXNFbmQgPSB0aGlzLmxlbmd0aFxuICB9XG5cbiAgaWYgKHN0YXJ0IDwgMCB8fCBlbmQgPiB0YXJnZXQubGVuZ3RoIHx8IHRoaXNTdGFydCA8IDAgfHwgdGhpc0VuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ291dCBvZiByYW5nZSBpbmRleCcpXG4gIH1cblxuICBpZiAodGhpc1N0YXJ0ID49IHRoaXNFbmQgJiYgc3RhcnQgPj0gZW5kKSB7XG4gICAgcmV0dXJuIDBcbiAgfVxuICBpZiAodGhpc1N0YXJ0ID49IHRoaXNFbmQpIHtcbiAgICByZXR1cm4gLTFcbiAgfVxuICBpZiAoc3RhcnQgPj0gZW5kKSB7XG4gICAgcmV0dXJuIDFcbiAgfVxuXG4gIHN0YXJ0ID4+Pj0gMFxuICBlbmQgPj4+PSAwXG4gIHRoaXNTdGFydCA+Pj49IDBcbiAgdGhpc0VuZCA+Pj49IDBcblxuICBpZiAodGhpcyA9PT0gdGFyZ2V0KSByZXR1cm4gMFxuXG4gIHZhciB4ID0gdGhpc0VuZCAtIHRoaXNTdGFydFxuICB2YXIgeSA9IGVuZCAtIHN0YXJ0XG4gIHZhciBsZW4gPSBNYXRoLm1pbih4LCB5KVxuXG4gIHZhciB0aGlzQ29weSA9IHRoaXMuc2xpY2UodGhpc1N0YXJ0LCB0aGlzRW5kKVxuICB2YXIgdGFyZ2V0Q29weSA9IHRhcmdldC5zbGljZShzdGFydCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAodGhpc0NvcHlbaV0gIT09IHRhcmdldENvcHlbaV0pIHtcbiAgICAgIHggPSB0aGlzQ29weVtpXVxuICAgICAgeSA9IHRhcmdldENvcHlbaV1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgaWYgKHggPCB5KSByZXR1cm4gLTFcbiAgaWYgKHkgPCB4KSByZXR1cm4gMVxuICByZXR1cm4gMFxufVxuXG4vLyBGaW5kcyBlaXRoZXIgdGhlIGZpcnN0IGluZGV4IG9mIGB2YWxgIGluIGBidWZmZXJgIGF0IG9mZnNldCA+PSBgYnl0ZU9mZnNldGAsXG4vLyBPUiB0aGUgbGFzdCBpbmRleCBvZiBgdmFsYCBpbiBgYnVmZmVyYCBhdCBvZmZzZXQgPD0gYGJ5dGVPZmZzZXRgLlxuLy9cbi8vIEFyZ3VtZW50czpcbi8vIC0gYnVmZmVyIC0gYSBCdWZmZXIgdG8gc2VhcmNoXG4vLyAtIHZhbCAtIGEgc3RyaW5nLCBCdWZmZXIsIG9yIG51bWJlclxuLy8gLSBieXRlT2Zmc2V0IC0gYW4gaW5kZXggaW50byBgYnVmZmVyYDsgd2lsbCBiZSBjbGFtcGVkIHRvIGFuIGludDMyXG4vLyAtIGVuY29kaW5nIC0gYW4gb3B0aW9uYWwgZW5jb2RpbmcsIHJlbGV2YW50IGlzIHZhbCBpcyBhIHN0cmluZ1xuLy8gLSBkaXIgLSB0cnVlIGZvciBpbmRleE9mLCBmYWxzZSBmb3IgbGFzdEluZGV4T2ZcbmZ1bmN0aW9uIGJpZGlyZWN0aW9uYWxJbmRleE9mIChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcikge1xuICAvLyBFbXB0eSBidWZmZXIgbWVhbnMgbm8gbWF0Y2hcbiAgaWYgKGJ1ZmZlci5sZW5ndGggPT09IDApIHJldHVybiAtMVxuXG4gIC8vIE5vcm1hbGl6ZSBieXRlT2Zmc2V0XG4gIGlmICh0eXBlb2YgYnl0ZU9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICBlbmNvZGluZyA9IGJ5dGVPZmZzZXRcbiAgICBieXRlT2Zmc2V0ID0gMFxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPiAweDdmZmZmZmZmKSB7XG4gICAgYnl0ZU9mZnNldCA9IDB4N2ZmZmZmZmZcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0IDwgLTB4ODAwMDAwMDApIHtcbiAgICBieXRlT2Zmc2V0ID0gLTB4ODAwMDAwMDBcbiAgfVxuICBieXRlT2Zmc2V0ID0gK2J5dGVPZmZzZXQgLy8gQ29lcmNlIHRvIE51bWJlci5cbiAgaWYgKG51bWJlcklzTmFOKGJ5dGVPZmZzZXQpKSB7XG4gICAgLy8gYnl0ZU9mZnNldDogaXQgaXQncyB1bmRlZmluZWQsIG51bGwsIE5hTiwgXCJmb29cIiwgZXRjLCBzZWFyY2ggd2hvbGUgYnVmZmVyXG4gICAgYnl0ZU9mZnNldCA9IGRpciA/IDAgOiAoYnVmZmVyLmxlbmd0aCAtIDEpXG4gIH1cblxuICAvLyBOb3JtYWxpemUgYnl0ZU9mZnNldDogbmVnYXRpdmUgb2Zmc2V0cyBzdGFydCBmcm9tIHRoZSBlbmQgb2YgdGhlIGJ1ZmZlclxuICBpZiAoYnl0ZU9mZnNldCA8IDApIGJ5dGVPZmZzZXQgPSBidWZmZXIubGVuZ3RoICsgYnl0ZU9mZnNldFxuICBpZiAoYnl0ZU9mZnNldCA+PSBidWZmZXIubGVuZ3RoKSB7XG4gICAgaWYgKGRpcikgcmV0dXJuIC0xXG4gICAgZWxzZSBieXRlT2Zmc2V0ID0gYnVmZmVyLmxlbmd0aCAtIDFcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0IDwgMCkge1xuICAgIGlmIChkaXIpIGJ5dGVPZmZzZXQgPSAwXG4gICAgZWxzZSByZXR1cm4gLTFcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSB2YWxcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFsID0gQnVmZmVyLmZyb20odmFsLCBlbmNvZGluZylcbiAgfVxuXG4gIC8vIEZpbmFsbHksIHNlYXJjaCBlaXRoZXIgaW5kZXhPZiAoaWYgZGlyIGlzIHRydWUpIG9yIGxhc3RJbmRleE9mXG4gIGlmIChCdWZmZXIuaXNCdWZmZXIodmFsKSkge1xuICAgIC8vIFNwZWNpYWwgY2FzZTogbG9va2luZyBmb3IgZW1wdHkgc3RyaW5nL2J1ZmZlciBhbHdheXMgZmFpbHNcbiAgICBpZiAodmFsLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIC0xXG4gICAgfVxuICAgIHJldHVybiBhcnJheUluZGV4T2YoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpXG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICB2YWwgPSB2YWwgJiAweEZGIC8vIFNlYXJjaCBmb3IgYSBieXRlIHZhbHVlIFswLTI1NV1cbiAgICBpZiAodHlwZW9mIFVpbnQ4QXJyYXkucHJvdG90eXBlLmluZGV4T2YgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGlmIChkaXIpIHtcbiAgICAgICAgcmV0dXJuIFVpbnQ4QXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBVaW50OEFycmF5LnByb3RvdHlwZS5sYXN0SW5kZXhPZi5jYWxsKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0KVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJyYXlJbmRleE9mKGJ1ZmZlciwgWyB2YWwgXSwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcilcbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ3ZhbCBtdXN0IGJlIHN0cmluZywgbnVtYmVyIG9yIEJ1ZmZlcicpXG59XG5cbmZ1bmN0aW9uIGFycmF5SW5kZXhPZiAoYXJyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpIHtcbiAgdmFyIGluZGV4U2l6ZSA9IDFcbiAgdmFyIGFyckxlbmd0aCA9IGFyci5sZW5ndGhcbiAgdmFyIHZhbExlbmd0aCA9IHZhbC5sZW5ndGhcblxuICBpZiAoZW5jb2RpbmcgIT09IHVuZGVmaW5lZCkge1xuICAgIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgaWYgKGVuY29kaW5nID09PSAndWNzMicgfHwgZW5jb2RpbmcgPT09ICd1Y3MtMicgfHxcbiAgICAgICAgZW5jb2RpbmcgPT09ICd1dGYxNmxlJyB8fCBlbmNvZGluZyA9PT0gJ3V0Zi0xNmxlJykge1xuICAgICAgaWYgKGFyci5sZW5ndGggPCAyIHx8IHZhbC5sZW5ndGggPCAyKSB7XG4gICAgICAgIHJldHVybiAtMVxuICAgICAgfVxuICAgICAgaW5kZXhTaXplID0gMlxuICAgICAgYXJyTGVuZ3RoIC89IDJcbiAgICAgIHZhbExlbmd0aCAvPSAyXG4gICAgICBieXRlT2Zmc2V0IC89IDJcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZWFkIChidWYsIGkpIHtcbiAgICBpZiAoaW5kZXhTaXplID09PSAxKSB7XG4gICAgICByZXR1cm4gYnVmW2ldXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBidWYucmVhZFVJbnQxNkJFKGkgKiBpbmRleFNpemUpXG4gICAgfVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKGRpcikge1xuICAgIHZhciBmb3VuZEluZGV4ID0gLTFcbiAgICBmb3IgKGkgPSBieXRlT2Zmc2V0OyBpIDwgYXJyTGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChyZWFkKGFyciwgaSkgPT09IHJlYWQodmFsLCBmb3VuZEluZGV4ID09PSAtMSA/IDAgOiBpIC0gZm91bmRJbmRleCkpIHtcbiAgICAgICAgaWYgKGZvdW5kSW5kZXggPT09IC0xKSBmb3VuZEluZGV4ID0gaVxuICAgICAgICBpZiAoaSAtIGZvdW5kSW5kZXggKyAxID09PSB2YWxMZW5ndGgpIHJldHVybiBmb3VuZEluZGV4ICogaW5kZXhTaXplXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZm91bmRJbmRleCAhPT0gLTEpIGkgLT0gaSAtIGZvdW5kSW5kZXhcbiAgICAgICAgZm91bmRJbmRleCA9IC0xXG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChieXRlT2Zmc2V0ICsgdmFsTGVuZ3RoID4gYXJyTGVuZ3RoKSBieXRlT2Zmc2V0ID0gYXJyTGVuZ3RoIC0gdmFsTGVuZ3RoXG4gICAgZm9yIChpID0gYnl0ZU9mZnNldDsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHZhciBmb3VuZCA9IHRydWVcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdmFsTGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaWYgKHJlYWQoYXJyLCBpICsgaikgIT09IHJlYWQodmFsLCBqKSkge1xuICAgICAgICAgIGZvdW5kID0gZmFsc2VcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZm91bmQpIHJldHVybiBpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIC0xXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5jbHVkZXMgPSBmdW5jdGlvbiBpbmNsdWRlcyAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gdGhpcy5pbmRleE9mKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpICE9PSAtMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluZGV4T2YgPSBmdW5jdGlvbiBpbmRleE9mICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiBiaWRpcmVjdGlvbmFsSW5kZXhPZih0aGlzLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCB0cnVlKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmxhc3RJbmRleE9mID0gZnVuY3Rpb24gbGFzdEluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGJpZGlyZWN0aW9uYWxJbmRleE9mKHRoaXMsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGZhbHNlKVxufVxuXG5mdW5jdGlvbiBoZXhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuXG4gIHZhciBzdHJMZW4gPSBzdHJpbmcubGVuZ3RoXG5cbiAgaWYgKGxlbmd0aCA+IHN0ckxlbiAvIDIpIHtcbiAgICBsZW5ndGggPSBzdHJMZW4gLyAyXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIHZhciBwYXJzZWQgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpXG4gICAgaWYgKG51bWJlcklzTmFOKHBhcnNlZCkpIHJldHVybiBpXG4gICAgYnVmW29mZnNldCArIGldID0gcGFyc2VkXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gdXRmOFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIodXRmOFRvQnl0ZXMoc3RyaW5nLCBidWYubGVuZ3RoIC0gb2Zmc2V0KSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYXNjaWlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBsYXRpbjFXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBhc2NpaVdyaXRlKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYmFzZTY0V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIHVjczJXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZywgYnVmLmxlbmd0aCAtIG9mZnNldCksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiB3cml0ZSAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZylcbiAgaWYgKG9mZnNldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgICBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgIG9mZnNldCA9IDBcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZywgZW5jb2RpbmcpXG4gIH0gZWxzZSBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICBlbmNvZGluZyA9IG9mZnNldFxuICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgb2Zmc2V0ID0gMFxuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nLCBvZmZzZXRbLCBsZW5ndGhdWywgZW5jb2RpbmddKVxuICB9IGVsc2UgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgICBpZiAoaXNGaW5pdGUobGVuZ3RoKSkge1xuICAgICAgbGVuZ3RoID0gbGVuZ3RoID4+PiAwXG4gICAgICBpZiAoZW5jb2RpbmcgPT09IHVuZGVmaW5lZCkgZW5jb2RpbmcgPSAndXRmOCdcbiAgICB9IGVsc2Uge1xuICAgICAgZW5jb2RpbmcgPSBsZW5ndGhcbiAgICAgIGxlbmd0aCA9IHVuZGVmaW5lZFxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnQnVmZmVyLndyaXRlKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldFssIGxlbmd0aF0pIGlzIG5vIGxvbmdlciBzdXBwb3J0ZWQnXG4gICAgKVxuICB9XG5cbiAgdmFyIHJlbWFpbmluZyA9IHRoaXMubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCB8fCBsZW5ndGggPiByZW1haW5pbmcpIGxlbmd0aCA9IHJlbWFpbmluZ1xuXG4gIGlmICgoc3RyaW5nLmxlbmd0aCA+IDAgJiYgKGxlbmd0aCA8IDAgfHwgb2Zmc2V0IDwgMCkpIHx8IG9mZnNldCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0F0dGVtcHQgdG8gd3JpdGUgb3V0c2lkZSBidWZmZXIgYm91bmRzJylcbiAgfVxuXG4gIGlmICghZW5jb2RpbmcpIGVuY29kaW5nID0gJ3V0ZjgnXG5cbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcbiAgZm9yICg7Oykge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBoZXhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICAgIHJldHVybiBhc2NpaVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gbGF0aW4xV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgLy8gV2FybmluZzogbWF4TGVuZ3RoIG5vdCB0YWtlbiBpbnRvIGFjY291bnQgaW4gYmFzZTY0V3JpdGVcbiAgICAgICAgcmV0dXJuIGJhc2U2NFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiB1Y3MyV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgICAgIGVuY29kaW5nID0gKCcnICsgZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gdG9KU09OICgpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnQnVmZmVyJyxcbiAgICBkYXRhOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLl9hcnIgfHwgdGhpcywgMClcbiAgfVxufVxuXG5mdW5jdGlvbiBiYXNlNjRTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGlmIChzdGFydCA9PT0gMCAmJiBlbmQgPT09IGJ1Zi5sZW5ndGgpIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYuc2xpY2Uoc3RhcnQsIGVuZCkpXG4gIH1cbn1cblxuZnVuY3Rpb24gdXRmOFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuICB2YXIgcmVzID0gW11cblxuICB2YXIgaSA9IHN0YXJ0XG4gIHdoaWxlIChpIDwgZW5kKSB7XG4gICAgdmFyIGZpcnN0Qnl0ZSA9IGJ1ZltpXVxuICAgIHZhciBjb2RlUG9pbnQgPSBudWxsXG4gICAgdmFyIGJ5dGVzUGVyU2VxdWVuY2UgPSAoZmlyc3RCeXRlID4gMHhFRikgPyA0XG4gICAgICA6IChmaXJzdEJ5dGUgPiAweERGKSA/IDNcbiAgICAgICAgOiAoZmlyc3RCeXRlID4gMHhCRikgPyAyXG4gICAgICAgICAgOiAxXG5cbiAgICBpZiAoaSArIGJ5dGVzUGVyU2VxdWVuY2UgPD0gZW5kKSB7XG4gICAgICB2YXIgc2Vjb25kQnl0ZSwgdGhpcmRCeXRlLCBmb3VydGhCeXRlLCB0ZW1wQ29kZVBvaW50XG5cbiAgICAgIHN3aXRjaCAoYnl0ZXNQZXJTZXF1ZW5jZSkge1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgaWYgKGZpcnN0Qnl0ZSA8IDB4ODApIHtcbiAgICAgICAgICAgIGNvZGVQb2ludCA9IGZpcnN0Qnl0ZVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweDFGKSA8PCAweDYgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4N0YpIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICB0aGlyZEJ5dGUgPSBidWZbaSArIDJdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKHRoaXJkQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4RikgPDwgMHhDIHwgKHNlY29uZEJ5dGUgJiAweDNGKSA8PCAweDYgfCAodGhpcmRCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHg3RkYgJiYgKHRlbXBDb2RlUG9pbnQgPCAweEQ4MDAgfHwgdGVtcENvZGVQb2ludCA+IDB4REZGRikpIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICB0aGlyZEJ5dGUgPSBidWZbaSArIDJdXG4gICAgICAgICAgZm91cnRoQnl0ZSA9IGJ1ZltpICsgM11cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAodGhpcmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKGZvdXJ0aEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweEYpIDw8IDB4MTIgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpIDw8IDB4QyB8ICh0aGlyZEJ5dGUgJiAweDNGKSA8PCAweDYgfCAoZm91cnRoQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4RkZGRiAmJiB0ZW1wQ29kZVBvaW50IDwgMHgxMTAwMDApIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY29kZVBvaW50ID09PSBudWxsKSB7XG4gICAgICAvLyB3ZSBkaWQgbm90IGdlbmVyYXRlIGEgdmFsaWQgY29kZVBvaW50IHNvIGluc2VydCBhXG4gICAgICAvLyByZXBsYWNlbWVudCBjaGFyIChVK0ZGRkQpIGFuZCBhZHZhbmNlIG9ubHkgMSBieXRlXG4gICAgICBjb2RlUG9pbnQgPSAweEZGRkRcbiAgICAgIGJ5dGVzUGVyU2VxdWVuY2UgPSAxXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPiAweEZGRkYpIHtcbiAgICAgIC8vIGVuY29kZSB0byB1dGYxNiAoc3Vycm9nYXRlIHBhaXIgZGFuY2UpXG4gICAgICBjb2RlUG9pbnQgLT0gMHgxMDAwMFxuICAgICAgcmVzLnB1c2goY29kZVBvaW50ID4+PiAxMCAmIDB4M0ZGIHwgMHhEODAwKVxuICAgICAgY29kZVBvaW50ID0gMHhEQzAwIHwgY29kZVBvaW50ICYgMHgzRkZcbiAgICB9XG5cbiAgICByZXMucHVzaChjb2RlUG9pbnQpXG4gICAgaSArPSBieXRlc1BlclNlcXVlbmNlXG4gIH1cblxuICByZXR1cm4gZGVjb2RlQ29kZVBvaW50c0FycmF5KHJlcylcbn1cblxuLy8gQmFzZWQgb24gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjI3NDcyNzIvNjgwNzQyLCB0aGUgYnJvd3NlciB3aXRoXG4vLyB0aGUgbG93ZXN0IGxpbWl0IGlzIENocm9tZSwgd2l0aCAweDEwMDAwIGFyZ3MuXG4vLyBXZSBnbyAxIG1hZ25pdHVkZSBsZXNzLCBmb3Igc2FmZXR5XG52YXIgTUFYX0FSR1VNRU5UU19MRU5HVEggPSAweDEwMDBcblxuZnVuY3Rpb24gZGVjb2RlQ29kZVBvaW50c0FycmF5IChjb2RlUG9pbnRzKSB7XG4gIHZhciBsZW4gPSBjb2RlUG9pbnRzLmxlbmd0aFxuICBpZiAobGVuIDw9IE1BWF9BUkdVTUVOVFNfTEVOR1RIKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoU3RyaW5nLCBjb2RlUG9pbnRzKSAvLyBhdm9pZCBleHRyYSBzbGljZSgpXG4gIH1cblxuICAvLyBEZWNvZGUgaW4gY2h1bmtzIHRvIGF2b2lkIFwiY2FsbCBzdGFjayBzaXplIGV4Y2VlZGVkXCIuXG4gIHZhciByZXMgPSAnJ1xuICB2YXIgaSA9IDBcbiAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShcbiAgICAgIFN0cmluZyxcbiAgICAgIGNvZGVQb2ludHMuc2xpY2UoaSwgaSArPSBNQVhfQVJHVU1FTlRTX0xFTkdUSClcbiAgICApXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5mdW5jdGlvbiBhc2NpaVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSAmIDB4N0YpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBsYXRpbjFTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBoZXhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG5cbiAgaWYgKCFzdGFydCB8fCBzdGFydCA8IDApIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCB8fCBlbmQgPCAwIHx8IGVuZCA+IGxlbikgZW5kID0gbGVuXG5cbiAgdmFyIG91dCA9ICcnXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgb3V0ICs9IHRvSGV4KGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gb3V0XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBieXRlcyA9IGJ1Zi5zbGljZShzdGFydCwgZW5kKVxuICB2YXIgcmVzID0gJydcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldICsgKGJ5dGVzW2kgKyAxXSAqIDI1NikpXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gc2xpY2UgKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIHN0YXJ0ID0gfn5zdGFydFxuICBlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IGxlbiA6IH5+ZW5kXG5cbiAgaWYgKHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ICs9IGxlblxuICAgIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gMFxuICB9IGVsc2UgaWYgKHN0YXJ0ID4gbGVuKSB7XG4gICAgc3RhcnQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCAwKSB7XG4gICAgZW5kICs9IGxlblxuICAgIGlmIChlbmQgPCAwKSBlbmQgPSAwXG4gIH0gZWxzZSBpZiAoZW5kID4gbGVuKSB7XG4gICAgZW5kID0gbGVuXG4gIH1cblxuICBpZiAoZW5kIDwgc3RhcnQpIGVuZCA9IHN0YXJ0XG5cbiAgdmFyIG5ld0J1ZiA9IHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZClcbiAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2VcbiAgbmV3QnVmLl9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgcmV0dXJuIG5ld0J1ZlxufVxuXG4vKlxuICogTmVlZCB0byBtYWtlIHN1cmUgdGhhdCBidWZmZXIgaXNuJ3QgdHJ5aW5nIHRvIHdyaXRlIG91dCBvZiBib3VuZHMuXG4gKi9cbmZ1bmN0aW9uIGNoZWNrT2Zmc2V0IChvZmZzZXQsIGV4dCwgbGVuZ3RoKSB7XG4gIGlmICgob2Zmc2V0ICUgMSkgIT09IDAgfHwgb2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ29mZnNldCBpcyBub3QgdWludCcpXG4gIGlmIChvZmZzZXQgKyBleHQgPiBsZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdUcnlpbmcgdG8gYWNjZXNzIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludExFID0gZnVuY3Rpb24gcmVhZFVJbnRMRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIGldICogbXVsXG4gIH1cblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRCRSA9IGZ1bmN0aW9uIHJlYWRVSW50QkUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuICB9XG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgLS1ieXRlTGVuZ3RoXVxuICB2YXIgbXVsID0gMVxuICB3aGlsZSAoYnl0ZUxlbmd0aCA+IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyAtLWJ5dGVMZW5ndGhdICogbXVsXG4gIH1cblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4ID0gZnVuY3Rpb24gcmVhZFVJbnQ4IChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDEsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gZnVuY3Rpb24gcmVhZFVJbnQxNkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gdGhpc1tvZmZzZXRdIHwgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2QkUgPSBmdW5jdGlvbiByZWFkVUludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiAodGhpc1tvZmZzZXRdIDw8IDgpIHwgdGhpc1tvZmZzZXQgKyAxXVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJMRSA9IGZ1bmN0aW9uIHJlYWRVSW50MzJMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKCh0aGlzW29mZnNldF0pIHxcbiAgICAgICh0aGlzW29mZnNldCArIDFdIDw8IDgpIHxcbiAgICAgICh0aGlzW29mZnNldCArIDJdIDw8IDE2KSkgK1xuICAgICAgKHRoaXNbb2Zmc2V0ICsgM10gKiAweDEwMDAwMDApXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdICogMHgxMDAwMDAwKSArXG4gICAgKCh0aGlzW29mZnNldCArIDFdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgOCkgfFxuICAgIHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludExFID0gZnVuY3Rpb24gcmVhZEludExFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF1cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgaV0gKiBtdWxcbiAgfVxuICBtdWwgKj0gMHg4MFxuXG4gIGlmICh2YWwgPj0gbXVsKSB2YWwgLT0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpXG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnRCRSA9IGZ1bmN0aW9uIHJlYWRJbnRCRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgaSA9IGJ5dGVMZW5ndGhcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgLS1pXVxuICB3aGlsZSAoaSA+IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyAtLWldICogbXVsXG4gIH1cbiAgbXVsICo9IDB4ODBcblxuICBpZiAodmFsID49IG11bCkgdmFsIC09IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50OCA9IGZ1bmN0aW9uIHJlYWRJbnQ4IChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDEsIHRoaXMubGVuZ3RoKVxuICBpZiAoISh0aGlzW29mZnNldF0gJiAweDgwKSkgcmV0dXJuICh0aGlzW29mZnNldF0pXG4gIHJldHVybiAoKDB4ZmYgLSB0aGlzW29mZnNldF0gKyAxKSAqIC0xKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkxFID0gZnVuY3Rpb24gcmVhZEludDE2TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF0gfCAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KVxuICByZXR1cm4gKHZhbCAmIDB4ODAwMCkgPyB2YWwgfCAweEZGRkYwMDAwIDogdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2QkUgPSBmdW5jdGlvbiByZWFkSW50MTZCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgMV0gfCAodGhpc1tvZmZzZXRdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJMRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdKSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOCkgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10gPDwgMjQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkUgPSBmdW5jdGlvbiByZWFkSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSA8PCAyNCkgfFxuICAgICh0aGlzW29mZnNldCArIDFdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgOCkgfFxuICAgICh0aGlzW29mZnNldCArIDNdKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdExFID0gZnVuY3Rpb24gcmVhZEZsb2F0TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCB0cnVlLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRCRSA9IGZ1bmN0aW9uIHJlYWRGbG9hdEJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgZmFsc2UsIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVMRSA9IGZ1bmN0aW9uIHJlYWREb3VibGVMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA4LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIHRydWUsIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVCRSA9IGZ1bmN0aW9uIHJlYWREb3VibGVCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA4LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIGZhbHNlLCA1MiwgOClcbn1cblxuZnVuY3Rpb24gY2hlY2tJbnQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgZXh0LCBtYXgsIG1pbikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihidWYpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImJ1ZmZlclwiIGFyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXIgaW5zdGFuY2UnKVxuICBpZiAodmFsdWUgPiBtYXggfHwgdmFsdWUgPCBtaW4pIHRocm93IG5ldyBSYW5nZUVycm9yKCdcInZhbHVlXCIgYXJndW1lbnQgaXMgb3V0IG9mIGJvdW5kcycpXG4gIGlmIChvZmZzZXQgKyBleHQgPiBidWYubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5kZXggb3V0IG9mIHJhbmdlJylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnRMRSA9IGZ1bmN0aW9uIHdyaXRlVUludExFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50QkUgPSBmdW5jdGlvbiB3cml0ZVVJbnRCRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbWF4Qnl0ZXMgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCkgLSAxXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbWF4Qnl0ZXMsIDApXG4gIH1cblxuICB2YXIgaSA9IGJ5dGVMZW5ndGggLSAxXG4gIHZhciBtdWwgPSAxXG4gIHRoaXNbb2Zmc2V0ICsgaV0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKC0taSA+PSAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICh2YWx1ZSAvIG11bCkgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDggPSBmdW5jdGlvbiB3cml0ZVVJbnQ4ICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMSwgMHhmZiwgMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFID0gZnVuY3Rpb24gd3JpdGVVSW50MTZMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4ZmZmZiwgMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gZnVuY3Rpb24gd3JpdGVVSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4ZmZmZiwgMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24gd3JpdGVVSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4ZmZmZmZmZmYsIDApXG4gIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiAxNilcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gZnVuY3Rpb24gd3JpdGVVSW50MzJCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4ZmZmZmZmZmYsIDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gMjQpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludExFID0gZnVuY3Rpb24gd3JpdGVJbnRMRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCAoOCAqIGJ5dGVMZW5ndGgpIC0gMSlcblxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIGxpbWl0IC0gMSwgLWxpbWl0KVxuICB9XG5cbiAgdmFyIGkgPSAwXG4gIHZhciBtdWwgPSAxXG4gIHZhciBzdWIgPSAwXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIGlmICh2YWx1ZSA8IDAgJiYgc3ViID09PSAwICYmIHRoaXNbb2Zmc2V0ICsgaSAtIDFdICE9PSAwKSB7XG4gICAgICBzdWIgPSAxXG4gICAgfVxuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAoKHZhbHVlIC8gbXVsKSA+PiAwKSAtIHN1YiAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnRCRSA9IGZ1bmN0aW9uIHdyaXRlSW50QkUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIGxpbWl0ID0gTWF0aC5wb3coMiwgKDggKiBieXRlTGVuZ3RoKSAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHN1YiA9IDBcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICBpZiAodmFsdWUgPCAwICYmIHN1YiA9PT0gMCAmJiB0aGlzW29mZnNldCArIGkgKyAxXSAhPT0gMCkge1xuICAgICAgc3ViID0gMVxuICAgIH1cbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uIHdyaXRlSW50OCAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDEsIDB4N2YsIC0weDgwKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmYgKyB2YWx1ZSArIDFcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZUludDE2TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkJFID0gZnVuY3Rpb24gd3JpdGVJbnQxNkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiAxNilcbiAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSA+Pj4gMjQpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkJFID0gZnVuY3Rpb24gd3JpdGVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmZmZmZiArIHZhbHVlICsgMVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiAxNilcbiAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gOClcbiAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbmZ1bmN0aW9uIGNoZWNrSUVFRTc1NCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBleHQsIG1heCwgbWluKSB7XG4gIGlmIChvZmZzZXQgKyBleHQgPiBidWYubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5kZXggb3V0IG9mIHJhbmdlJylcbiAgaWYgKG9mZnNldCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5mdW5jdGlvbiB3cml0ZUZsb2F0IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja0lFRUU3NTQoYnVmLCB2YWx1ZSwgb2Zmc2V0LCA0LCAzLjQwMjgyMzQ2NjM4NTI4ODZlKzM4LCAtMy40MDI4MjM0NjYzODUyODg2ZSszOClcbiAgfVxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0TEUgPSBmdW5jdGlvbiB3cml0ZUZsb2F0TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRCRSA9IGZ1bmN0aW9uIHdyaXRlRmxvYXRCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiB3cml0ZURvdWJsZSAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgOCwgMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgsIC0xLjc5NzY5MzEzNDg2MjMxNTdFKzMwOClcbiAgfVxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbiAgcmV0dXJuIG9mZnNldCArIDhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFID0gZnVuY3Rpb24gd3JpdGVEb3VibGVMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkUgPSBmdW5jdGlvbiB3cml0ZURvdWJsZUJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG4vLyBjb3B5KHRhcmdldEJ1ZmZlciwgdGFyZ2V0U3RhcnQ9MCwgc291cmNlU3RhcnQ9MCwgc291cmNlRW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiBjb3B5ICh0YXJnZXQsIHRhcmdldFN0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKHRhcmdldCkpIHRocm93IG5ldyBUeXBlRXJyb3IoJ2FyZ3VtZW50IHNob3VsZCBiZSBhIEJ1ZmZlcicpXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCAmJiBlbmQgIT09IDApIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXRTdGFydCA+PSB0YXJnZXQubGVuZ3RoKSB0YXJnZXRTdGFydCA9IHRhcmdldC5sZW5ndGhcbiAgaWYgKCF0YXJnZXRTdGFydCkgdGFyZ2V0U3RhcnQgPSAwXG4gIGlmIChlbmQgPiAwICYmIGVuZCA8IHN0YXJ0KSBlbmQgPSBzdGFydFxuXG4gIC8vIENvcHkgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuIDBcbiAgaWYgKHRhcmdldC5sZW5ndGggPT09IDAgfHwgdGhpcy5sZW5ndGggPT09IDApIHJldHVybiAwXG5cbiAgLy8gRmF0YWwgZXJyb3IgY29uZGl0aW9uc1xuICBpZiAodGFyZ2V0U3RhcnQgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICB9XG4gIGlmIChzdGFydCA8IDAgfHwgc3RhcnQgPj0gdGhpcy5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxuICBpZiAoZW5kIDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3NvdXJjZUVuZCBvdXQgb2YgYm91bmRzJylcblxuICAvLyBBcmUgd2Ugb29iP1xuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0U3RhcnQgPCBlbmQgLSBzdGFydCkge1xuICAgIGVuZCA9IHRhcmdldC5sZW5ndGggLSB0YXJnZXRTdGFydCArIHN0YXJ0XG4gIH1cblxuICB2YXIgbGVuID0gZW5kIC0gc3RhcnRcblxuICBpZiAodGhpcyA9PT0gdGFyZ2V0ICYmIHR5cGVvZiBVaW50OEFycmF5LnByb3RvdHlwZS5jb3B5V2l0aGluID09PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gVXNlIGJ1aWx0LWluIHdoZW4gYXZhaWxhYmxlLCBtaXNzaW5nIGZyb20gSUUxMVxuICAgIHRoaXMuY29weVdpdGhpbih0YXJnZXRTdGFydCwgc3RhcnQsIGVuZClcbiAgfSBlbHNlIGlmICh0aGlzID09PSB0YXJnZXQgJiYgc3RhcnQgPCB0YXJnZXRTdGFydCAmJiB0YXJnZXRTdGFydCA8IGVuZCkge1xuICAgIC8vIGRlc2NlbmRpbmcgY29weSBmcm9tIGVuZFxuICAgIGZvciAodmFyIGkgPSBsZW4gLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRTdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgVWludDhBcnJheS5wcm90b3R5cGUuc2V0LmNhbGwoXG4gICAgICB0YXJnZXQsXG4gICAgICB0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpLFxuICAgICAgdGFyZ2V0U3RhcnRcbiAgICApXG4gIH1cblxuICByZXR1cm4gbGVuXG59XG5cbi8vIFVzYWdlOlxuLy8gICAgYnVmZmVyLmZpbGwobnVtYmVyWywgb2Zmc2V0WywgZW5kXV0pXG4vLyAgICBidWZmZXIuZmlsbChidWZmZXJbLCBvZmZzZXRbLCBlbmRdXSlcbi8vICAgIGJ1ZmZlci5maWxsKHN0cmluZ1ssIG9mZnNldFssIGVuZF1dWywgZW5jb2RpbmddKVxuQnVmZmVyLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24gZmlsbCAodmFsLCBzdGFydCwgZW5kLCBlbmNvZGluZykge1xuICAvLyBIYW5kbGUgc3RyaW5nIGNhc2VzOlxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICBpZiAodHlwZW9mIHN0YXJ0ID09PSAnc3RyaW5nJykge1xuICAgICAgZW5jb2RpbmcgPSBzdGFydFxuICAgICAgc3RhcnQgPSAwXG4gICAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGVuZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVuY29kaW5nID0gZW5kXG4gICAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICAgIH1cbiAgICBpZiAoZW5jb2RpbmcgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgZW5jb2RpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdlbmNvZGluZyBtdXN0IGJlIGEgc3RyaW5nJylcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZycgJiYgIUJ1ZmZlci5pc0VuY29kaW5nKGVuY29kaW5nKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgIH1cbiAgICBpZiAodmFsLmxlbmd0aCA9PT0gMSkge1xuICAgICAgdmFyIGNvZGUgPSB2YWwuY2hhckNvZGVBdCgwKVxuICAgICAgaWYgKChlbmNvZGluZyA9PT0gJ3V0ZjgnICYmIGNvZGUgPCAxMjgpIHx8XG4gICAgICAgICAgZW5jb2RpbmcgPT09ICdsYXRpbjEnKSB7XG4gICAgICAgIC8vIEZhc3QgcGF0aDogSWYgYHZhbGAgZml0cyBpbnRvIGEgc2luZ2xlIGJ5dGUsIHVzZSB0aGF0IG51bWVyaWMgdmFsdWUuXG4gICAgICAgIHZhbCA9IGNvZGVcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICB2YWwgPSB2YWwgJiAyNTVcbiAgfVxuXG4gIC8vIEludmFsaWQgcmFuZ2VzIGFyZSBub3Qgc2V0IHRvIGEgZGVmYXVsdCwgc28gY2FuIHJhbmdlIGNoZWNrIGVhcmx5LlxuICBpZiAoc3RhcnQgPCAwIHx8IHRoaXMubGVuZ3RoIDwgc3RhcnQgfHwgdGhpcy5sZW5ndGggPCBlbmQpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignT3V0IG9mIHJhbmdlIGluZGV4JylcbiAgfVxuXG4gIGlmIChlbmQgPD0gc3RhcnQpIHtcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgc3RhcnQgPSBzdGFydCA+Pj4gMFxuICBlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IHRoaXMubGVuZ3RoIDogZW5kID4+PiAwXG5cbiAgaWYgKCF2YWwpIHZhbCA9IDBcblxuICB2YXIgaVxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICBmb3IgKGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgICB0aGlzW2ldID0gdmFsXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBieXRlcyA9IEJ1ZmZlci5pc0J1ZmZlcih2YWwpXG4gICAgICA/IHZhbFxuICAgICAgOiBCdWZmZXIuZnJvbSh2YWwsIGVuY29kaW5nKVxuICAgIHZhciBsZW4gPSBieXRlcy5sZW5ndGhcbiAgICBpZiAobGVuID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgdmFsdWUgXCInICsgdmFsICtcbiAgICAgICAgJ1wiIGlzIGludmFsaWQgZm9yIGFyZ3VtZW50IFwidmFsdWVcIicpXG4gICAgfVxuICAgIGZvciAoaSA9IDA7IGkgPCBlbmQgLSBzdGFydDsgKytpKSB7XG4gICAgICB0aGlzW2kgKyBzdGFydF0gPSBieXRlc1tpICUgbGVuXVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzXG59XG5cbi8vIEhFTFBFUiBGVU5DVElPTlNcbi8vID09PT09PT09PT09PT09PT1cblxudmFyIElOVkFMSURfQkFTRTY0X1JFID0gL1teKy8wLTlBLVphLXotX10vZ1xuXG5mdW5jdGlvbiBiYXNlNjRjbGVhbiAoc3RyKSB7XG4gIC8vIE5vZGUgdGFrZXMgZXF1YWwgc2lnbnMgYXMgZW5kIG9mIHRoZSBCYXNlNjQgZW5jb2RpbmdcbiAgc3RyID0gc3RyLnNwbGl0KCc9JylbMF1cbiAgLy8gTm9kZSBzdHJpcHMgb3V0IGludmFsaWQgY2hhcmFjdGVycyBsaWtlIFxcbiBhbmQgXFx0IGZyb20gdGhlIHN0cmluZywgYmFzZTY0LWpzIGRvZXMgbm90XG4gIHN0ciA9IHN0ci50cmltKCkucmVwbGFjZShJTlZBTElEX0JBU0U2NF9SRSwgJycpXG4gIC8vIE5vZGUgY29udmVydHMgc3RyaW5ncyB3aXRoIGxlbmd0aCA8IDIgdG8gJydcbiAgaWYgKHN0ci5sZW5ndGggPCAyKSByZXR1cm4gJydcbiAgLy8gTm9kZSBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgYmFzZTY0IHN0cmluZ3MgKG1pc3NpbmcgdHJhaWxpbmcgPT09KSwgYmFzZTY0LWpzIGRvZXMgbm90XG4gIHdoaWxlIChzdHIubGVuZ3RoICUgNCAhPT0gMCkge1xuICAgIHN0ciA9IHN0ciArICc9J1xuICB9XG4gIHJldHVybiBzdHJcbn1cblxuZnVuY3Rpb24gdG9IZXggKG4pIHtcbiAgaWYgKG4gPCAxNikgcmV0dXJuICcwJyArIG4udG9TdHJpbmcoMTYpXG4gIHJldHVybiBuLnRvU3RyaW5nKDE2KVxufVxuXG5mdW5jdGlvbiB1dGY4VG9CeXRlcyAoc3RyaW5nLCB1bml0cykge1xuICB1bml0cyA9IHVuaXRzIHx8IEluZmluaXR5XG4gIHZhciBjb2RlUG9pbnRcbiAgdmFyIGxlbmd0aCA9IHN0cmluZy5sZW5ndGhcbiAgdmFyIGxlYWRTdXJyb2dhdGUgPSBudWxsXG4gIHZhciBieXRlcyA9IFtdXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGNvZGVQb2ludCA9IHN0cmluZy5jaGFyQ29kZUF0KGkpXG5cbiAgICAvLyBpcyBzdXJyb2dhdGUgY29tcG9uZW50XG4gICAgaWYgKGNvZGVQb2ludCA+IDB4RDdGRiAmJiBjb2RlUG9pbnQgPCAweEUwMDApIHtcbiAgICAgIC8vIGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoIWxlYWRTdXJyb2dhdGUpIHtcbiAgICAgICAgLy8gbm8gbGVhZCB5ZXRcbiAgICAgICAgaWYgKGNvZGVQb2ludCA+IDB4REJGRikge1xuICAgICAgICAgIC8vIHVuZXhwZWN0ZWQgdHJhaWxcbiAgICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9IGVsc2UgaWYgKGkgKyAxID09PSBsZW5ndGgpIHtcbiAgICAgICAgICAvLyB1bnBhaXJlZCBsZWFkXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHZhbGlkIGxlYWRcbiAgICAgICAgbGVhZFN1cnJvZ2F0ZSA9IGNvZGVQb2ludFxuXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIDIgbGVhZHMgaW4gYSByb3dcbiAgICAgIGlmIChjb2RlUG9pbnQgPCAweERDMDApIHtcbiAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgLy8gdmFsaWQgc3Vycm9nYXRlIHBhaXJcbiAgICAgIGNvZGVQb2ludCA9IChsZWFkU3Vycm9nYXRlIC0gMHhEODAwIDw8IDEwIHwgY29kZVBvaW50IC0gMHhEQzAwKSArIDB4MTAwMDBcbiAgICB9IGVsc2UgaWYgKGxlYWRTdXJyb2dhdGUpIHtcbiAgICAgIC8vIHZhbGlkIGJtcCBjaGFyLCBidXQgbGFzdCBjaGFyIHdhcyBhIGxlYWRcbiAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgIH1cblxuICAgIGxlYWRTdXJyb2dhdGUgPSBudWxsXG5cbiAgICAvLyBlbmNvZGUgdXRmOFxuICAgIGlmIChjb2RlUG9pbnQgPCAweDgwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDEpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goY29kZVBvaW50KVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHg4MDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMikgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiB8IDB4QzAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDEwMDAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDMpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweEMgfCAweEUwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2ICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSA0KSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHgxMiB8IDB4RjAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweEMgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29kZSBwb2ludCcpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzIChzdHIsIHVuaXRzKSB7XG4gIHZhciBjLCBoaSwgbG9cbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKCh1bml0cyAtPSAyKSA8IDApIGJyZWFrXG5cbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShiYXNlNjRjbGVhbihzdHIpKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGlmICgoaSArIG9mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSkgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuXG4vLyBBcnJheUJ1ZmZlciBvciBVaW50OEFycmF5IG9iamVjdHMgZnJvbSBvdGhlciBjb250ZXh0cyAoaS5lLiBpZnJhbWVzKSBkbyBub3QgcGFzc1xuLy8gdGhlIGBpbnN0YW5jZW9mYCBjaGVjayBidXQgdGhleSBzaG91bGQgYmUgdHJlYXRlZCBhcyBvZiB0aGF0IHR5cGUuXG4vLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL2lzc3Vlcy8xNjZcbmZ1bmN0aW9uIGlzSW5zdGFuY2UgKG9iaiwgdHlwZSkge1xuICByZXR1cm4gb2JqIGluc3RhbmNlb2YgdHlwZSB8fFxuICAgIChvYmogIT0gbnVsbCAmJiBvYmouY29uc3RydWN0b3IgIT0gbnVsbCAmJiBvYmouY29uc3RydWN0b3IubmFtZSAhPSBudWxsICYmXG4gICAgICBvYmouY29uc3RydWN0b3IubmFtZSA9PT0gdHlwZS5uYW1lKVxufVxuZnVuY3Rpb24gbnVtYmVySXNOYU4gKG9iaikge1xuICAvLyBGb3IgSUUxMSBzdXBwb3J0XG4gIHJldHVybiBvYmogIT09IG9iaiAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNlbGYtY29tcGFyZVxufVxuIiwgIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBNb2R1bGUgZXhwb3J0cy5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRhdGFVcmlUb0J1ZmZlcjtcblxuLyoqXG4gKiBSZXR1cm5zIGEgYEJ1ZmZlcmAgaW5zdGFuY2UgZnJvbSB0aGUgZ2l2ZW4gZGF0YSBVUkkgYHVyaWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVyaSBEYXRhIFVSSSB0byB0dXJuIGludG8gYSBCdWZmZXIgaW5zdGFuY2VcbiAqIEByZXR1cm4ge0J1ZmZlcn0gQnVmZmVyIGluc3RhbmNlIGZyb20gRGF0YSBVUklcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZGF0YVVyaVRvQnVmZmVyKHVyaSkge1xuICBpZiAoIS9eZGF0YVxcOi9pLnRlc3QodXJpKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAnYHVyaWAgZG9lcyBub3QgYXBwZWFyIHRvIGJlIGEgRGF0YSBVUkkgKG11c3QgYmVnaW4gd2l0aCBcImRhdGE6XCIpJ1xuICAgICk7XG4gIH1cblxuICAvLyBzdHJpcCBuZXdsaW5lc1xuICB1cmkgPSB1cmkucmVwbGFjZSgvXFxyP1xcbi9nLCAnJyk7XG5cbiAgLy8gc3BsaXQgdGhlIFVSSSB1cCBpbnRvIHRoZSBcIm1ldGFkYXRhXCIgYW5kIHRoZSBcImRhdGFcIiBwb3J0aW9uc1xuICB2YXIgZmlyc3RDb21tYSA9IHVyaS5pbmRleE9mKCcsJyk7XG4gIGlmICgtMSA9PT0gZmlyc3RDb21tYSB8fCBmaXJzdENvbW1hIDw9IDQpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdtYWxmb3JtZWQgZGF0YTogVVJJJyk7XG4gIH1cblxuICAvLyByZW1vdmUgdGhlIFwiZGF0YTpcIiBzY2hlbWUgYW5kIHBhcnNlIHRoZSBtZXRhZGF0YVxuICB2YXIgbWV0YSA9IHVyaS5zdWJzdHJpbmcoNSwgZmlyc3RDb21tYSkuc3BsaXQoJzsnKTtcblxuICB2YXIgdHlwZSA9IG1ldGFbMF0gfHwgJ3RleHQvcGxhaW4nO1xuICB2YXIgdHlwZUZ1bGwgPSB0eXBlO1xuICB2YXIgYmFzZTY0ID0gZmFsc2U7XG4gIHZhciBjaGFyc2V0ID0gJyc7XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgbWV0YS5sZW5ndGg7IGkrKykge1xuICAgIGlmICgnYmFzZTY0JyA9PSBtZXRhW2ldKSB7XG4gICAgICBiYXNlNjQgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0eXBlRnVsbCArPSAnOycgKyBtZXRhW2ldO1xuICAgICAgaWYgKDAgPT0gbWV0YVtpXS5pbmRleE9mKCdjaGFyc2V0PScpKSB7XG4gICAgICAgIGNoYXJzZXQgPSBtZXRhW2ldLnN1YnN0cmluZyg4KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLy8gZGVmYXVsdHMgdG8gVVMtQVNDSUkgb25seSBpZiB0eXBlIGlzIG5vdCBwcm92aWRlZFxuICBpZiAoIW1ldGFbMF0gJiYgIWNoYXJzZXQubGVuZ3RoKSB7XG4gICAgdHlwZUZ1bGwgKz0gJztjaGFyc2V0PVVTLUFTQ0lJJztcbiAgICBjaGFyc2V0ID0gJ1VTLUFTQ0lJJztcbiAgfVxuXG4gIC8vIGdldCB0aGUgZW5jb2RlZCBkYXRhIHBvcnRpb24gYW5kIGRlY29kZSBVUkktZW5jb2RlZCBjaGFyc1xuICB2YXIgZGF0YSA9IHVuZXNjYXBlKHVyaS5zdWJzdHJpbmcoZmlyc3RDb21tYSArIDEpKTtcblxuICB2YXIgZW5jb2RpbmcgPSBiYXNlNjQgPyAnYmFzZTY0JyA6ICdhc2NpaSc7XG4gIHZhciBidWZmZXIgPSBuZXcgQnVmZmVyKGRhdGEsIGVuY29kaW5nKTtcblxuICAvLyBzZXQgYC50eXBlYCBhbmQgYC50eXBlRnVsbGAgcHJvcGVydGllcyB0byBNSU1FIHR5cGVcbiAgYnVmZmVyLnR5cGUgPSB0eXBlO1xuICBidWZmZXIudHlwZUZ1bGwgPSB0eXBlRnVsbDtcblxuICAvLyBzZXQgdGhlIGAuY2hhcnNldGAgcHJvcGVydHlcbiAgYnVmZmVyLmNoYXJzZXQgPSBjaGFyc2V0O1xuXG4gIHJldHVybiBidWZmZXI7XG59XG4iLCAiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuY29uc3QgTyAgICAgICAgICAgICAgICAgPSBPYmplY3QsXG4gICAgICBpc0Jyb3dzZXIgICAgICAgICA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykgJiYgKHdpbmRvdy53aW5kb3cgPT09IHdpbmRvdykgJiYgd2luZG93Lm5hdmlnYXRvcixcbiAgICAgIFNvdXJjZU1hcENvbnN1bWVyID0gcmVxdWlyZSAoJ3NvdXJjZS1tYXAnKS5Tb3VyY2VNYXBDb25zdW1lcixcbiAgICAgIHBhdGggICAgICAgICAgICAgID0gcmVxdWlyZSAoJy4vaW1wbC9wYXRoJyksXG4gICAgICBkYXRhVVJJVG9CdWZmZXIgICA9IHJlcXVpcmUgKCdkYXRhLXVyaS10by1idWZmZXInKSxcbiAgICAgIGxhc3RPZiAgICAgICAgICAgID0geCA9PiB4W3gubGVuZ3RoIC0gMV1cblxuLyogIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5jb25zdCBtZW1vaXplID0gZiA9PiB7XG4gICAgXG4gICAgY29uc3QgbSA9IHggPT4gKHggaW4gbS5jYWNoZSkgPyBtLmNhY2hlW3hdIDogKG0uY2FjaGVbeF0gPSBmKHgpKVxuICAgIG0uZm9yZ2V0RXZlcnl0aGluZyA9ICgpID0+IHsgbS5jYWNoZSA9IE9iamVjdC5jcmVhdGUgKG51bGwpIH1cbiAgICBtLmNhY2hlID0gT2JqZWN0LmNyZWF0ZSAobnVsbClcblxuICAgIHJldHVybiBtXG59XG5cbi8qICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuY29uc3QgbmV3U291cmNlRmlsZU1lbW9pemVkID0gbWVtb2l6ZSAoZmlsZSA9PiBuZXcgU291cmNlRmlsZSAoZmlsZSkpXG5cbmNvbnN0IGdldFNvdXJjZSA9IG1vZHVsZS5leHBvcnRzID0gZmlsZSA9PiB7IHJldHVybiBuZXdTb3VyY2VGaWxlTWVtb2l6ZWQgKHBhdGgucmVzb2x2ZSAoZmlsZSkpIH1cblxuZ2V0U291cmNlLnJlc2V0Q2FjaGUgPSAoKSA9PiBuZXdTb3VyY2VGaWxlTWVtb2l6ZWQuZm9yZ2V0RXZlcnl0aGluZyAoKVxuZ2V0U291cmNlLmdldENhY2hlID0gKCkgPT4gbmV3U291cmNlRmlsZU1lbW9pemVkLmNhY2hlXG5cbi8qICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuY2xhc3MgU291cmNlTWFwIHtcblxuICAgIGNvbnN0cnVjdG9yIChvcmlnaW5hbEZpbGVQYXRoLCBzb3VyY2VNYXBQYXRoKSB7XG5cbiAgICAgICAgdGhpcy5maWxlID0gc291cmNlTWFwUGF0aC5zdGFydHNXaXRoICgnZGF0YTonKVxuICAgICAgICAgICAgICAgICAgICAgICAgPyBuZXcgU291cmNlRmlsZSAob3JpZ2luYWxGaWxlUGF0aCwgZGF0YVVSSVRvQnVmZmVyIChzb3VyY2VNYXBQYXRoKS50b1N0cmluZyAoKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIDogZ2V0U291cmNlIChwYXRoLnJlbGF0aXZlVG9GaWxlIChvcmlnaW5hbEZpbGVQYXRoLCBzb3VyY2VNYXBQYXRoKSlcblxuICAgICAgICB0aGlzLnBhcnNlZCAgICA9ICh0aGlzLmZpbGUudGV4dCAmJiBTb3VyY2VNYXBDb25zdW1lciAoSlNPTi5wYXJzZSAodGhpcy5maWxlLnRleHQpKSkgfHwgbnVsbFxuICAgICAgICB0aGlzLnNvdXJjZUZvciA9IG1lbW9pemUgKHRoaXMuc291cmNlRm9yLmJpbmQgKHRoaXMpKVxuICAgIH1cblxuICAgIHNvdXJjZUZvciAoZmlsZSkge1xuICAgICAgICBjb25zdCBjb250ZW50ID0gdGhpcy5wYXJzZWQuc291cmNlQ29udGVudEZvciAoZmlsZSwgdHJ1ZSAvKiByZXR1cm4gbnVsbCBvbiBtaXNzaW5nICovKVxuICAgICAgICBjb25zdCBmdWxsUGF0aCA9IHBhdGgucmVsYXRpdmVUb0ZpbGUgKHRoaXMuZmlsZS5wYXRoLCBmaWxlKVxuICAgICAgICByZXR1cm4gY29udGVudCA/IG5ldyBTb3VyY2VGaWxlIChmdWxsUGF0aCwgY29udGVudCkgOiBnZXRTb3VyY2UgKGZ1bGxQYXRoKVxuICAgIH1cblxuICAgIHJlc29sdmUgKGxvYykge1xuXG4gICAgICAgIGNvbnN0IG9yaWdpbmFsTG9jID0gdGhpcy5wYXJzZWQub3JpZ2luYWxQb3NpdGlvbkZvciAobG9jKVxuICAgICAgICByZXR1cm4gb3JpZ2luYWxMb2Muc291cmNlID8gdGhpcy5zb3VyY2VGb3IgKG9yaWdpbmFsTG9jLnNvdXJjZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVzb2x2ZSAoTy5hc3NpZ24gKHt9LCBsb2MsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZTogICBvcmlnaW5hbExvYy5saW5lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW46IG9yaWdpbmFsTG9jLmNvbHVtbiArIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICAgb3JpZ2luYWxMb2MubmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbG9jXG4gICAgfVxufVxuXG4vKiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbmNsYXNzIFNvdXJjZUZpbGUge1xuXG4gICAgY29uc3RydWN0b3IgKHBhdGgsIHRleHQgLyogb3B0aW9uYWwgKi8pIHtcbiAgICAgICAgXG4gICAgICAgIHRoaXMucGF0aCA9IHBhdGhcblxuICAgICAgICBpZiAodGV4dCkge1xuICAgICAgICAgICAgdGhpcy50ZXh0ID0gdGV4dCB9XG5cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmIChpc0Jyb3dzZXIpIHtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0ICgpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHhoci5vcGVuICgnR0VUJywgcGF0aCwgZmFsc2UgLyogU1lOQ0hST05PVVMgWEhSIEZUVyA6KSAqLylcbiAgICAgICAgICAgICAgICAgICAgICAgIHhoci5zZW5kIChudWxsKVxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGV4dCA9IHhoci5yZXNwb25zZVRleHQgfVxuXG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGV4dCA9IG1vZHVsZS5yZXF1aXJlICgnZnMnKS5yZWFkRmlsZVN5bmMgKHBhdGgsIHsgZW5jb2Rpbmc6ICd1dGY4JyB9KSB9IH1cblxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yID0gZVxuICAgICAgICAgICAgICAgIHRoaXMudGV4dCA9ICcnIH0gfVxuICAgIH1cblxuICAgIGdldCBsaW5lcyAoKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5saW5lc18gPSB0aGlzLmxpbmVzXyB8fCB0aGlzLnRleHQuc3BsaXQgKCdcXG4nKSlcbiAgICB9XG5cbiAgICBnZXQgc291cmNlTWFwICgpIHtcblxuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBpZiAodGhpcy5zb3VyY2VNYXBfID09PSB1bmRlZmluZWQpIHtcblxuICAgICAgICAgICAgICAgIC8qICBFeHRyYWN0IHRoZSBsYXN0IHNvdXJjZU1hcCBvY2N1cmVuY2UgKFRPRE86IHN1cHBvcnQgbXVsdGlwbGUgc291cmNlbWFwcykgICAqL1xuXG4gICAgICAgICAgICAgICAgY29uc3QgcmUgPSAvXFx1MDAyMyBzb3VyY2VNYXBwaW5nVVJMPSguKylcXG4/L2dcbiAgICAgICAgICAgICAgICBsZXQgbGFzdE1hdGNoID0gdW5kZWZpbmVkXG5cbiAgICAgICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtYXRjaCA9IHJlLmV4ZWMgKHRoaXMudGV4dClcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoKSBsYXN0TWF0Y2ggPSBtYXRjaFxuICAgICAgICAgICAgICAgICAgICBlbHNlIGJyZWFrXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgdXJsID0gbGFzdE1hdGNoICYmIGxhc3RNYXRjaFsxXVxuXG4gICAgICAgICAgICAgICAgaWYgKHVybCkge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc291cmNlTWFwID0gbmV3IFNvdXJjZU1hcCAodGhpcy5wYXRoLCB1cmwpXG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNvdXJjZU1hcC5wYXJzZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc291cmNlTWFwXyA9IHNvdXJjZU1hcFxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc291cmNlTWFwXyA9IG51bGxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhpcy5zb3VyY2VNYXBfID0gbnVsbFxuICAgICAgICAgICAgdGhpcy5zb3VyY2VNYXBFcnJvciA9IGVcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnNvdXJjZU1hcF9cbiAgICB9XG5cbiAgICByZXNvbHZlIChsb2MgLyogeyBsaW5lWywgY29sdW1uXSB9ICovKSAvKiBcdTIxOTIgeyBsaW5lLCBjb2x1bW4sIHNvdXJjZUZpbGUsIHNvdXJjZUxpbmUgfSAqLyB7XG5cbiAgICAgICAgaWYgKHRoaXMuc291cmNlTWFwKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdMb2MgPSB0aGlzLnNvdXJjZU1hcC5yZXNvbHZlIChsb2MpXG4gICAgICAgICAgICBpZiAobmV3TG9jLnNvdXJjZUZpbGUpIHJldHVybiBuZXdMb2NcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBPLmFzc2lnbiAoe30sIGxvYywge1xuXG4gICAgICAgICAgICBzb3VyY2VGaWxlOiAgdGhpcyxcbiAgICAgICAgICAgIHNvdXJjZUxpbmU6ICh0aGlzLmxpbmVzW2xvYy5saW5lIC0gMV0gfHwgJycpLFxuICAgICAgICAgICAgZXJyb3I6ICAgICAgIHRoaXMuZXJyb3JcbiAgICAgICAgfSlcbiAgICB9XG59XG5cbi8qICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiIsICJcInVzZSBzdHJpY3RcIjtcblxuLyogIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5jb25zdCBpc0Jyb3dzZXIgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpICYmICh3aW5kb3cud2luZG93ID09PSB3aW5kb3cpICYmIHdpbmRvdy5uYXZpZ2F0b3JcbmNvbnN0IGN3ZCA9IGlzQnJvd3NlciA/IHdpbmRvdy5sb2NhdGlvbi5ocmVmIDogcHJvY2Vzcy5jd2QgKClcblxuLyogIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5jb25zdCBwYXRoID0gbW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICBjb25jYXQgKGEsIGIpIHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGFfZW5kc1dpdGhTbGFzaCA9IChhW2EubGVuZ3RoIC0gMV0gPT09ICcvJyksXG4gICAgICAgICAgICAgICAgICAgICAgYl9zdGFydHNXaXRoU2xhc2ggPSAoYlswXSA9PT0gJy8nKVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGEgKyAoKGFfZW5kc1dpdGhTbGFzaCB8fCBiX3N0YXJ0c1dpdGhTbGFzaCkgPyAnJyA6ICcvJykgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgKChhX2VuZHNXaXRoU2xhc2ggJiYgYl9zdGFydHNXaXRoU2xhc2gpID8gYi5zdWJzdHJpbmcgKDEpIDogYikgfSxcblxuICAgIHJlc29sdmUgKHgpIHtcblxuICAgICAgICBpZiAocGF0aC5pc0Fic29sdXRlICh4KSkge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGgubm9ybWFsaXplICh4KSB9XG5cbiAgICAgICAgcmV0dXJuIHBhdGgubm9ybWFsaXplIChwYXRoLmNvbmNhdCAoY3dkLCB4KSlcbiAgICB9LFxuXG4gICAgbm9ybWFsaXplICh4KSB7XG5cbiAgICAgICAgbGV0IG91dHB1dCA9IFtdLFxuICAgICAgICAgICAgc2tpcCA9IDBcblxuICAgICAgICB4LnNwbGl0ICgnLycpLnJldmVyc2UgKCkuZmlsdGVyICh4ID0+IHggIT09ICcuJykuZm9yRWFjaCAoeCA9PiB7XG5cbiAgICAgICAgICAgICAgICAgaWYgKHggPT09ICcuLicpIHsgc2tpcCsrIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHNraXAgPT09IDApIHsgb3V0cHV0LnB1c2ggKHgpIH1cbiAgICAgICAgICAgIGVsc2UgICAgICAgICAgICAgICAgIHsgc2tpcC0tIH1cbiAgICAgICAgfSlcblxuICAgICAgICBjb25zdCByZXN1bHQgPSBvdXRwdXQucmV2ZXJzZSAoKS5qb2luICgnLycpXG5cbiAgICAgICAgcmV0dXJuICgoaXNCcm93c2VyICYmIChyZXN1bHRbMF0gPT09ICcvJykpID8gd2luZG93LmxvY2F0aW9uLm9yaWdpbiA6ICcnKSArIHJlc3VsdFxuICAgIH0sXG5cbiAgICBpc0RhdGE6IHggPT4geC5pbmRleE9mICgnZGF0YTonKSA9PT0gMCxcblxuICAgIGlzQWJzb2x1dGU6IHggPT4gKHhbMF0gPT09ICcvJykgfHwgL15bXlxcL10qOi8udGVzdCAoeCksXG5cbiAgICByZWxhdGl2ZVRvRmlsZSAoYSwgYikge1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIChwYXRoLmlzRGF0YSAoYSkgfHwgcGF0aC5pc0Fic29sdXRlIChiKSkgP1xuICAgICAgICAgICAgICAgICAgICBwYXRoLm5vcm1hbGl6ZSAoYikgOlxuICAgICAgICAgICAgICAgICAgICBwYXRoLm5vcm1hbGl6ZSAocGF0aC5jb25jYXQgKGEuc3BsaXQgKCcvJykuc2xpY2UgKDAsIC0xKS5qb2luICgnLycpLCBiKSlcbiAgICB9XG59XG5cbi8qICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiIsICJleHBvcnRzLnJlYWQgPSBmdW5jdGlvbiAoYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbVxuICB2YXIgZUxlbiA9IChuQnl0ZXMgKiA4KSAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgbkJpdHMgPSAtN1xuICB2YXIgaSA9IGlzTEUgPyAobkJ5dGVzIC0gMSkgOiAwXG4gIHZhciBkID0gaXNMRSA/IC0xIDogMVxuICB2YXIgcyA9IGJ1ZmZlcltvZmZzZXQgKyBpXVxuXG4gIGkgKz0gZFxuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIHMgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IGVMZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IChlICogMjU2KSArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIG0gPSBlICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIGUgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IG1MZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgbSA9IChtICogMjU2KSArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhc1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pXG4gICAgZSA9IGUgLSBlQmlhc1xuICB9XG4gIHJldHVybiAocyA/IC0xIDogMSkgKiBtICogTWF0aC5wb3coMiwgZSAtIG1MZW4pXG59XG5cbmV4cG9ydHMud3JpdGUgPSBmdW5jdGlvbiAoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGNcbiAgdmFyIGVMZW4gPSAobkJ5dGVzICogOCkgLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIHJ0ID0gKG1MZW4gPT09IDIzID8gTWF0aC5wb3coMiwgLTI0KSAtIE1hdGgucG93KDIsIC03NykgOiAwKVxuICB2YXIgaSA9IGlzTEUgPyAwIDogKG5CeXRlcyAtIDEpXG4gIHZhciBkID0gaXNMRSA/IDEgOiAtMVxuICB2YXIgcyA9IHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgPyAxIDogMFxuXG4gIHZhbHVlID0gTWF0aC5hYnModmFsdWUpXG5cbiAgaWYgKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA9PT0gSW5maW5pdHkpIHtcbiAgICBtID0gaXNOYU4odmFsdWUpID8gMSA6IDBcbiAgICBlID0gZU1heFxuICB9IGVsc2Uge1xuICAgIGUgPSBNYXRoLmZsb29yKE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4yKVxuICAgIGlmICh2YWx1ZSAqIChjID0gTWF0aC5wb3coMiwgLWUpKSA8IDEpIHtcbiAgICAgIGUtLVxuICAgICAgYyAqPSAyXG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgdmFsdWUgKz0gcnQgLyBjXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlICs9IHJ0ICogTWF0aC5wb3coMiwgMSAtIGVCaWFzKVxuICAgIH1cbiAgICBpZiAodmFsdWUgKiBjID49IDIpIHtcbiAgICAgIGUrK1xuICAgICAgYyAvPSAyXG4gICAgfVxuXG4gICAgaWYgKGUgKyBlQmlhcyA+PSBlTWF4KSB7XG4gICAgICBtID0gMFxuICAgICAgZSA9IGVNYXhcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICBtID0gKCh2YWx1ZSAqIGMpIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IGUgKyBlQmlhc1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gdmFsdWUgKiBNYXRoLnBvdygyLCBlQmlhcyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSAwXG4gICAgfVxuICB9XG5cbiAgZm9yICg7IG1MZW4gPj0gODsgYnVmZmVyW29mZnNldCArIGldID0gbSAmIDB4ZmYsIGkgKz0gZCwgbSAvPSAyNTYsIG1MZW4gLT0gOCkge31cblxuICBlID0gKGUgPDwgbUxlbikgfCBtXG4gIGVMZW4gKz0gbUxlblxuICBmb3IgKDsgZUxlbiA+IDA7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IGUgJiAweGZmLCBpICs9IGQsIGUgLz0gMjU2LCBlTGVuIC09IDgpIHt9XG5cbiAgYnVmZmVyW29mZnNldCArIGkgLSBkXSB8PSBzICogMTI4XG59XG4iLCAiXCJ1c2Ugc3RyaWN0XCI7XG5cbmNvbnN0IGFuc2lFc2NhcGVDb2RlICAgICAgICAgICAgICAgICAgID0gJ1tcXHUwMDFiXFx1MDA5Yl1bWygpIzs/XSooPzpbMC05XXsxLDR9KD86O1swLTldezAsNH0pKik/WzAtOUEtUFJaY2YtbnFyeT0+PF0nXG4gICAgLCB6ZXJvV2lkdGhDaGFyYWN0ZXJFeGNlcHROZXdsaW5lICA9ICdcXHUwMDAwLVxcdTAwMDhcXHUwMDBCLVxcdTAwMTlcXHUwMDFiXFx1MDA5YlxcdTAwYWRcXHUyMDBiXFx1MjAyOFxcdTIwMjlcXHVmZWZmXFx1ZmUwMC1cXHVmZTBmJ1xuICAgICwgemVyb1dpZHRoQ2hhcmFjdGVyICAgICAgICAgICAgICAgPSAnXFxuJyArIHplcm9XaWR0aENoYXJhY3RlckV4Y2VwdE5ld2xpbmVcbiAgICAsIHplcm9XaWR0aENoYXJhY3RlcnNFeGNlcHROZXdsaW5lID0gbmV3IFJlZ0V4cCAoJyg/OicgKyBhbnNpRXNjYXBlQ29kZSArICcpfFsnICsgemVyb1dpZHRoQ2hhcmFjdGVyRXhjZXB0TmV3bGluZSArICddJywgJ2cnKVxuICAgICwgemVyb1dpZHRoQ2hhcmFjdGVycyAgICAgICAgICAgICAgPSBuZXcgUmVnRXhwICgnKD86JyArIGFuc2lFc2NhcGVDb2RlICsgJyl8WycgKyB6ZXJvV2lkdGhDaGFyYWN0ZXIgKyAnXScsICdnJylcbiAgICAsIHBhcnRpdGlvbiAgICAgICAgICAgICAgICAgICAgICAgID0gbmV3IFJlZ0V4cCAoJygoPzonICsgYW5zaUVzY2FwZUNvZGUgKyAnKXxbXFx0JyArIHplcm9XaWR0aENoYXJhY3RlciArICddKT8oW15cXHQnICsgemVyb1dpZHRoQ2hhcmFjdGVyICsgJ10qKScsICdnJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICB6ZXJvV2lkdGhDaGFyYWN0ZXJzLFxuXG4gICAgYW5zaUVzY2FwZUNvZGVzOiBuZXcgUmVnRXhwIChhbnNpRXNjYXBlQ29kZSwgJ2cnKSxcblxuICAgIHN0cmxlbjogcyA9PiBBcnJheS5mcm9tIChzLnJlcGxhY2UgKHplcm9XaWR0aENoYXJhY3RlcnMsICcnKSkubGVuZ3RoLCAvLyBBcnJheS5mcm9tIHNvbHZlcyB0aGUgZW1vamkgcHJvYmxlbSBhcyBkZXNjcmliZWQgaGVyZTogaHR0cDovL2Jsb2cuam9ubmV3LmNvbS9wb3N0cy9wb28tZG90LWxlbmd0aC1lcXVhbHMtdHdvXG5cbiAgICBpc0JsYW5rOiBzID0+IHMucmVwbGFjZSAoemVyb1dpZHRoQ2hhcmFjdGVycywgJycpXG4gICAgICAgICAgICAgICAgICAgLnJlcGxhY2UgKC9cXHMvZywgJycpXG4gICAgICAgICAgICAgICAgICAgLmxlbmd0aCA9PT0gMCxcblxuICAgIGJsYW5rOiBzID0+IEFycmF5LmZyb20gKHMucmVwbGFjZSAoemVyb1dpZHRoQ2hhcmFjdGVyc0V4Y2VwdE5ld2xpbmUsICcnKSkgLy8gQXJyYXkuZnJvbSBzb2x2ZXMgdGhlIGVtb2ppIHByb2JsZW0gYXMgZGVzY3JpYmVkIGhlcmU6IGh0dHA6Ly9ibG9nLmpvbm5ldy5jb20vcG9zdHMvcG9vLWRvdC1sZW5ndGgtZXF1YWxzLXR3b1xuICAgICAgICAgICAgICAgICAgICAgLm1hcCAoeCA9PiAoKHggPT09ICdcXHQnKSB8fCAoeCA9PT0gJ1xcbicpKSA/IHggOiAnICcpXG4gICAgICAgICAgICAgICAgICAgICAuam9pbiAoJycpLFxuXG4gICAgcGFydGl0aW9uIChzKSB7XG4gICAgICAgIGZvciAodmFyIG0sIHNwYW5zID0gW107IChwYXJ0aXRpb24ubGFzdEluZGV4ICE9PSBzLmxlbmd0aCkgJiYgKG0gPSBwYXJ0aXRpb24uZXhlYyAocykpOykgeyBzcGFucy5wdXNoIChbbVsxXSB8fCAnJywgbVsyXV0pIH1cbiAgICAgICAgcGFydGl0aW9uLmxhc3RJbmRleCA9IDAgLy8gcmVzZXRcbiAgICAgICAgcmV0dXJuIHNwYW5zXG4gICAgfSxcblxuICAgIGZpcnN0IChzLCBuKSB7XG5cbiAgICAgICAgbGV0IHJlc3VsdCA9ICcnLCBsZW5ndGggPSAwXG5cbiAgICAgICAgZm9yIChjb25zdCBbbm9uUHJpbnRhYmxlLCBwcmludGFibGVdIG9mIG1vZHVsZS5leHBvcnRzLnBhcnRpdGlvbiAocykpIHtcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSBBcnJheS5mcm9tIChwcmludGFibGUpLnNsaWNlICgwLCBuIC0gbGVuZ3RoKSAvLyBBcnJheS5mcm9tIHNvbHZlcyB0aGUgZW1vamkgcHJvYmxlbSBhcyBkZXNjcmliZWQgaGVyZTogaHR0cDovL2Jsb2cuam9ubmV3LmNvbS9wb3N0cy9wb28tZG90LWxlbmd0aC1lcXVhbHMtdHdvXG4gICAgICAgICAgICByZXN1bHQgKz0gbm9uUHJpbnRhYmxlICsgdGV4dC5qb2luICgnJylcbiAgICAgICAgICAgIGxlbmd0aCArPSB0ZXh0Lmxlbmd0aFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH1cbn0iLCAiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsICIvKiAtKi0gTW9kZToganM7IGpzLWluZGVudC1sZXZlbDogMjsgLSotICovXG4vKlxuICogQ29weXJpZ2h0IDIwMTEgTW96aWxsYSBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnNcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICovXG5cbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBoYXNOYXRpdmVNYXAgPSB0eXBlb2YgTWFwICE9PSBcInVuZGVmaW5lZFwiO1xuXG4vKipcbiAqIEEgZGF0YSBzdHJ1Y3R1cmUgd2hpY2ggaXMgYSBjb21iaW5hdGlvbiBvZiBhbiBhcnJheSBhbmQgYSBzZXQuIEFkZGluZyBhIG5ld1xuICogbWVtYmVyIGlzIE8oMSksIHRlc3RpbmcgZm9yIG1lbWJlcnNoaXAgaXMgTygxKSwgYW5kIGZpbmRpbmcgdGhlIGluZGV4IG9mIGFuXG4gKiBlbGVtZW50IGlzIE8oMSkuIFJlbW92aW5nIGVsZW1lbnRzIGZyb20gdGhlIHNldCBpcyBub3Qgc3VwcG9ydGVkLiBPbmx5XG4gKiBzdHJpbmdzIGFyZSBzdXBwb3J0ZWQgZm9yIG1lbWJlcnNoaXAuXG4gKi9cbmZ1bmN0aW9uIEFycmF5U2V0KCkge1xuICB0aGlzLl9hcnJheSA9IFtdO1xuICB0aGlzLl9zZXQgPSBoYXNOYXRpdmVNYXAgPyBuZXcgTWFwKCkgOiBPYmplY3QuY3JlYXRlKG51bGwpO1xufVxuXG4vKipcbiAqIFN0YXRpYyBtZXRob2QgZm9yIGNyZWF0aW5nIEFycmF5U2V0IGluc3RhbmNlcyBmcm9tIGFuIGV4aXN0aW5nIGFycmF5LlxuICovXG5BcnJheVNldC5mcm9tQXJyYXkgPSBmdW5jdGlvbiBBcnJheVNldF9mcm9tQXJyYXkoYUFycmF5LCBhQWxsb3dEdXBsaWNhdGVzKSB7XG4gIHZhciBzZXQgPSBuZXcgQXJyYXlTZXQoKTtcbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGFBcnJheS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIHNldC5hZGQoYUFycmF5W2ldLCBhQWxsb3dEdXBsaWNhdGVzKTtcbiAgfVxuICByZXR1cm4gc2V0O1xufTtcblxuLyoqXG4gKiBSZXR1cm4gaG93IG1hbnkgdW5pcXVlIGl0ZW1zIGFyZSBpbiB0aGlzIEFycmF5U2V0LiBJZiBkdXBsaWNhdGVzIGhhdmUgYmVlblxuICogYWRkZWQsIHRoYW4gdGhvc2UgZG8gbm90IGNvdW50IHRvd2FyZHMgdGhlIHNpemUuXG4gKlxuICogQHJldHVybnMgTnVtYmVyXG4gKi9cbkFycmF5U2V0LnByb3RvdHlwZS5zaXplID0gZnVuY3Rpb24gQXJyYXlTZXRfc2l6ZSgpIHtcbiAgcmV0dXJuIGhhc05hdGl2ZU1hcCA/IHRoaXMuX3NldC5zaXplIDogT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGhpcy5fc2V0KS5sZW5ndGg7XG59O1xuXG4vKipcbiAqIEFkZCB0aGUgZ2l2ZW4gc3RyaW5nIHRvIHRoaXMgc2V0LlxuICpcbiAqIEBwYXJhbSBTdHJpbmcgYVN0clxuICovXG5BcnJheVNldC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gQXJyYXlTZXRfYWRkKGFTdHIsIGFBbGxvd0R1cGxpY2F0ZXMpIHtcbiAgdmFyIHNTdHIgPSBoYXNOYXRpdmVNYXAgPyBhU3RyIDogdXRpbC50b1NldFN0cmluZyhhU3RyKTtcbiAgdmFyIGlzRHVwbGljYXRlID0gaGFzTmF0aXZlTWFwID8gdGhpcy5oYXMoYVN0cikgOiBoYXMuY2FsbCh0aGlzLl9zZXQsIHNTdHIpO1xuICB2YXIgaWR4ID0gdGhpcy5fYXJyYXkubGVuZ3RoO1xuICBpZiAoIWlzRHVwbGljYXRlIHx8IGFBbGxvd0R1cGxpY2F0ZXMpIHtcbiAgICB0aGlzLl9hcnJheS5wdXNoKGFTdHIpO1xuICB9XG4gIGlmICghaXNEdXBsaWNhdGUpIHtcbiAgICBpZiAoaGFzTmF0aXZlTWFwKSB7XG4gICAgICB0aGlzLl9zZXQuc2V0KGFTdHIsIGlkeCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3NldFtzU3RyXSA9IGlkeDtcbiAgICB9XG4gIH1cbn07XG5cbi8qKlxuICogSXMgdGhlIGdpdmVuIHN0cmluZyBhIG1lbWJlciBvZiB0aGlzIHNldD9cbiAqXG4gKiBAcGFyYW0gU3RyaW5nIGFTdHJcbiAqL1xuQXJyYXlTZXQucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uIEFycmF5U2V0X2hhcyhhU3RyKSB7XG4gIGlmIChoYXNOYXRpdmVNYXApIHtcbiAgICByZXR1cm4gdGhpcy5fc2V0LmhhcyhhU3RyKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgc1N0ciA9IHV0aWwudG9TZXRTdHJpbmcoYVN0cik7XG4gICAgcmV0dXJuIGhhcy5jYWxsKHRoaXMuX3NldCwgc1N0cik7XG4gIH1cbn07XG5cbi8qKlxuICogV2hhdCBpcyB0aGUgaW5kZXggb2YgdGhlIGdpdmVuIHN0cmluZyBpbiB0aGUgYXJyYXk/XG4gKlxuICogQHBhcmFtIFN0cmluZyBhU3RyXG4gKi9cbkFycmF5U2V0LnByb3RvdHlwZS5pbmRleE9mID0gZnVuY3Rpb24gQXJyYXlTZXRfaW5kZXhPZihhU3RyKSB7XG4gIGlmIChoYXNOYXRpdmVNYXApIHtcbiAgICB2YXIgaWR4ID0gdGhpcy5fc2V0LmdldChhU3RyKTtcbiAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgICAgcmV0dXJuIGlkeDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIHNTdHIgPSB1dGlsLnRvU2V0U3RyaW5nKGFTdHIpO1xuICAgIGlmIChoYXMuY2FsbCh0aGlzLl9zZXQsIHNTdHIpKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2V0W3NTdHJdO1xuICAgIH1cbiAgfVxuXG4gIHRocm93IG5ldyBFcnJvcignXCInICsgYVN0ciArICdcIiBpcyBub3QgaW4gdGhlIHNldC4nKTtcbn07XG5cbi8qKlxuICogV2hhdCBpcyB0aGUgZWxlbWVudCBhdCB0aGUgZ2l2ZW4gaW5kZXg/XG4gKlxuICogQHBhcmFtIE51bWJlciBhSWR4XG4gKi9cbkFycmF5U2V0LnByb3RvdHlwZS5hdCA9IGZ1bmN0aW9uIEFycmF5U2V0X2F0KGFJZHgpIHtcbiAgaWYgKGFJZHggPj0gMCAmJiBhSWR4IDwgdGhpcy5fYXJyYXkubGVuZ3RoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2FycmF5W2FJZHhdO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcignTm8gZWxlbWVudCBpbmRleGVkIGJ5ICcgKyBhSWR4KTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgYXJyYXkgcmVwcmVzZW50YXRpb24gb2YgdGhpcyBzZXQgKHdoaWNoIGhhcyB0aGUgcHJvcGVyIGluZGljZXNcbiAqIGluZGljYXRlZCBieSBpbmRleE9mKS4gTm90ZSB0aGF0IHRoaXMgaXMgYSBjb3B5IG9mIHRoZSBpbnRlcm5hbCBhcnJheSB1c2VkXG4gKiBmb3Igc3RvcmluZyB0aGUgbWVtYmVycyBzbyB0aGF0IG5vIG9uZSBjYW4gbWVzcyB3aXRoIGludGVybmFsIHN0YXRlLlxuICovXG5BcnJheVNldC5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uIEFycmF5U2V0X3RvQXJyYXkoKSB7XG4gIHJldHVybiB0aGlzLl9hcnJheS5zbGljZSgpO1xufTtcblxuZXhwb3J0cy5BcnJheVNldCA9IEFycmF5U2V0O1xuIiwgIi8qIC0qLSBNb2RlOiBqczsganMtaW5kZW50LWxldmVsOiAyOyAtKi0gKi9cbi8qXG4gKiBDb3B5cmlnaHQgMjAxMSBNb3ppbGxhIEZvdW5kYXRpb24gYW5kIGNvbnRyaWJ1dG9yc1xuICogTGljZW5zZWQgdW5kZXIgdGhlIE5ldyBCU0QgbGljZW5zZS4gU2VlIExJQ0VOU0Ugb3I6XG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvQlNELTMtQ2xhdXNlXG4gKlxuICogQmFzZWQgb24gdGhlIEJhc2UgNjQgVkxRIGltcGxlbWVudGF0aW9uIGluIENsb3N1cmUgQ29tcGlsZXI6XG4gKiBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL2Nsb3N1cmUtY29tcGlsZXIvc291cmNlL2Jyb3dzZS90cnVuay9zcmMvY29tL2dvb2dsZS9kZWJ1Z2dpbmcvc291cmNlbWFwL0Jhc2U2NFZMUS5qYXZhXG4gKlxuICogQ29weXJpZ2h0IDIwMTEgVGhlIENsb3N1cmUgQ29tcGlsZXIgQXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dFxuICogbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZVxuICogbWV0OlxuICpcbiAqICAqIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0XG4gKiAgICBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXG4gKiAgKiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlXG4gKiAgICBjb3B5cmlnaHQgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZ1xuICogICAgZGlzY2xhaW1lciBpbiB0aGUgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkXG4gKiAgICB3aXRoIHRoZSBkaXN0cmlidXRpb24uXG4gKiAgKiBOZWl0aGVyIHRoZSBuYW1lIG9mIEdvb2dsZSBJbmMuIG5vciB0aGUgbmFtZXMgb2YgaXRzXG4gKiAgICBjb250cmlidXRvcnMgbWF5IGJlIHVzZWQgdG8gZW5kb3JzZSBvciBwcm9tb3RlIHByb2R1Y3RzIGRlcml2ZWRcbiAqICAgIGZyb20gdGhpcyBzb2Z0d2FyZSB3aXRob3V0IHNwZWNpZmljIHByaW9yIHdyaXR0ZW4gcGVybWlzc2lvbi5cbiAqXG4gKiBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTXG4gKiBcIkFTIElTXCIgQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UXG4gKiBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1JcbiAqIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFSRSBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQ09QWVJJR0hUXG4gKiBPV05FUiBPUiBDT05UUklCVVRPUlMgQkUgTElBQkxFIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCxcbiAqIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1RcbiAqIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLFxuICogREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkQgT04gQU5ZXG4gKiBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUXG4gKiAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0VcbiAqIE9GIFRISVMgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXG4gKi9cblxudmFyIGJhc2U2NCA9IHJlcXVpcmUoJy4vYmFzZTY0Jyk7XG5cbi8vIEEgc2luZ2xlIGJhc2UgNjQgZGlnaXQgY2FuIGNvbnRhaW4gNiBiaXRzIG9mIGRhdGEuIEZvciB0aGUgYmFzZSA2NCB2YXJpYWJsZVxuLy8gbGVuZ3RoIHF1YW50aXRpZXMgd2UgdXNlIGluIHRoZSBzb3VyY2UgbWFwIHNwZWMsIHRoZSBmaXJzdCBiaXQgaXMgdGhlIHNpZ24sXG4vLyB0aGUgbmV4dCBmb3VyIGJpdHMgYXJlIHRoZSBhY3R1YWwgdmFsdWUsIGFuZCB0aGUgNnRoIGJpdCBpcyB0aGVcbi8vIGNvbnRpbnVhdGlvbiBiaXQuIFRoZSBjb250aW51YXRpb24gYml0IHRlbGxzIHVzIHdoZXRoZXIgdGhlcmUgYXJlIG1vcmVcbi8vIGRpZ2l0cyBpbiB0aGlzIHZhbHVlIGZvbGxvd2luZyB0aGlzIGRpZ2l0LlxuLy9cbi8vICAgQ29udGludWF0aW9uXG4vLyAgIHwgICAgU2lnblxuLy8gICB8ICAgIHxcbi8vICAgViAgICBWXG4vLyAgIDEwMTAxMVxuXG52YXIgVkxRX0JBU0VfU0hJRlQgPSA1O1xuXG4vLyBiaW5hcnk6IDEwMDAwMFxudmFyIFZMUV9CQVNFID0gMSA8PCBWTFFfQkFTRV9TSElGVDtcblxuLy8gYmluYXJ5OiAwMTExMTFcbnZhciBWTFFfQkFTRV9NQVNLID0gVkxRX0JBU0UgLSAxO1xuXG4vLyBiaW5hcnk6IDEwMDAwMFxudmFyIFZMUV9DT05USU5VQVRJT05fQklUID0gVkxRX0JBU0U7XG5cbi8qKlxuICogQ29udmVydHMgZnJvbSBhIHR3by1jb21wbGVtZW50IHZhbHVlIHRvIGEgdmFsdWUgd2hlcmUgdGhlIHNpZ24gYml0IGlzXG4gKiBwbGFjZWQgaW4gdGhlIGxlYXN0IHNpZ25pZmljYW50IGJpdC4gIEZvciBleGFtcGxlLCBhcyBkZWNpbWFsczpcbiAqICAgMSBiZWNvbWVzIDIgKDEwIGJpbmFyeSksIC0xIGJlY29tZXMgMyAoMTEgYmluYXJ5KVxuICogICAyIGJlY29tZXMgNCAoMTAwIGJpbmFyeSksIC0yIGJlY29tZXMgNSAoMTAxIGJpbmFyeSlcbiAqL1xuZnVuY3Rpb24gdG9WTFFTaWduZWQoYVZhbHVlKSB7XG4gIHJldHVybiBhVmFsdWUgPCAwXG4gICAgPyAoKC1hVmFsdWUpIDw8IDEpICsgMVxuICAgIDogKGFWYWx1ZSA8PCAxKSArIDA7XG59XG5cbi8qKlxuICogQ29udmVydHMgdG8gYSB0d28tY29tcGxlbWVudCB2YWx1ZSBmcm9tIGEgdmFsdWUgd2hlcmUgdGhlIHNpZ24gYml0IGlzXG4gKiBwbGFjZWQgaW4gdGhlIGxlYXN0IHNpZ25pZmljYW50IGJpdC4gIEZvciBleGFtcGxlLCBhcyBkZWNpbWFsczpcbiAqICAgMiAoMTAgYmluYXJ5KSBiZWNvbWVzIDEsIDMgKDExIGJpbmFyeSkgYmVjb21lcyAtMVxuICogICA0ICgxMDAgYmluYXJ5KSBiZWNvbWVzIDIsIDUgKDEwMSBiaW5hcnkpIGJlY29tZXMgLTJcbiAqL1xuZnVuY3Rpb24gZnJvbVZMUVNpZ25lZChhVmFsdWUpIHtcbiAgdmFyIGlzTmVnYXRpdmUgPSAoYVZhbHVlICYgMSkgPT09IDE7XG4gIHZhciBzaGlmdGVkID0gYVZhbHVlID4+IDE7XG4gIHJldHVybiBpc05lZ2F0aXZlXG4gICAgPyAtc2hpZnRlZFxuICAgIDogc2hpZnRlZDtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBiYXNlIDY0IFZMUSBlbmNvZGVkIHZhbHVlLlxuICovXG5leHBvcnRzLmVuY29kZSA9IGZ1bmN0aW9uIGJhc2U2NFZMUV9lbmNvZGUoYVZhbHVlKSB7XG4gIHZhciBlbmNvZGVkID0gXCJcIjtcbiAgdmFyIGRpZ2l0O1xuXG4gIHZhciB2bHEgPSB0b1ZMUVNpZ25lZChhVmFsdWUpO1xuXG4gIGRvIHtcbiAgICBkaWdpdCA9IHZscSAmIFZMUV9CQVNFX01BU0s7XG4gICAgdmxxID4+Pj0gVkxRX0JBU0VfU0hJRlQ7XG4gICAgaWYgKHZscSA+IDApIHtcbiAgICAgIC8vIFRoZXJlIGFyZSBzdGlsbCBtb3JlIGRpZ2l0cyBpbiB0aGlzIHZhbHVlLCBzbyB3ZSBtdXN0IG1ha2Ugc3VyZSB0aGVcbiAgICAgIC8vIGNvbnRpbnVhdGlvbiBiaXQgaXMgbWFya2VkLlxuICAgICAgZGlnaXQgfD0gVkxRX0NPTlRJTlVBVElPTl9CSVQ7XG4gICAgfVxuICAgIGVuY29kZWQgKz0gYmFzZTY0LmVuY29kZShkaWdpdCk7XG4gIH0gd2hpbGUgKHZscSA+IDApO1xuXG4gIHJldHVybiBlbmNvZGVkO1xufTtcblxuLyoqXG4gKiBEZWNvZGVzIHRoZSBuZXh0IGJhc2UgNjQgVkxRIHZhbHVlIGZyb20gdGhlIGdpdmVuIHN0cmluZyBhbmQgcmV0dXJucyB0aGVcbiAqIHZhbHVlIGFuZCB0aGUgcmVzdCBvZiB0aGUgc3RyaW5nIHZpYSB0aGUgb3V0IHBhcmFtZXRlci5cbiAqL1xuZXhwb3J0cy5kZWNvZGUgPSBmdW5jdGlvbiBiYXNlNjRWTFFfZGVjb2RlKGFTdHIsIGFJbmRleCwgYU91dFBhcmFtKSB7XG4gIHZhciBzdHJMZW4gPSBhU3RyLmxlbmd0aDtcbiAgdmFyIHJlc3VsdCA9IDA7XG4gIHZhciBzaGlmdCA9IDA7XG4gIHZhciBjb250aW51YXRpb24sIGRpZ2l0O1xuXG4gIGRvIHtcbiAgICBpZiAoYUluZGV4ID49IHN0ckxlbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXhwZWN0ZWQgbW9yZSBkaWdpdHMgaW4gYmFzZSA2NCBWTFEgdmFsdWUuXCIpO1xuICAgIH1cblxuICAgIGRpZ2l0ID0gYmFzZTY0LmRlY29kZShhU3RyLmNoYXJDb2RlQXQoYUluZGV4KyspKTtcbiAgICBpZiAoZGlnaXQgPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGJhc2U2NCBkaWdpdDogXCIgKyBhU3RyLmNoYXJBdChhSW5kZXggLSAxKSk7XG4gICAgfVxuXG4gICAgY29udGludWF0aW9uID0gISEoZGlnaXQgJiBWTFFfQ09OVElOVUFUSU9OX0JJVCk7XG4gICAgZGlnaXQgJj0gVkxRX0JBU0VfTUFTSztcbiAgICByZXN1bHQgPSByZXN1bHQgKyAoZGlnaXQgPDwgc2hpZnQpO1xuICAgIHNoaWZ0ICs9IFZMUV9CQVNFX1NISUZUO1xuICB9IHdoaWxlIChjb250aW51YXRpb24pO1xuXG4gIGFPdXRQYXJhbS52YWx1ZSA9IGZyb21WTFFTaWduZWQocmVzdWx0KTtcbiAgYU91dFBhcmFtLnJlc3QgPSBhSW5kZXg7XG59O1xuIiwgIi8qIC0qLSBNb2RlOiBqczsganMtaW5kZW50LWxldmVsOiAyOyAtKi0gKi9cbi8qXG4gKiBDb3B5cmlnaHQgMjAxMSBNb3ppbGxhIEZvdW5kYXRpb24gYW5kIGNvbnRyaWJ1dG9yc1xuICogTGljZW5zZWQgdW5kZXIgdGhlIE5ldyBCU0QgbGljZW5zZS4gU2VlIExJQ0VOU0Ugb3I6XG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvQlNELTMtQ2xhdXNlXG4gKi9cblxudmFyIGludFRvQ2hhck1hcCA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJy5zcGxpdCgnJyk7XG5cbi8qKlxuICogRW5jb2RlIGFuIGludGVnZXIgaW4gdGhlIHJhbmdlIG9mIDAgdG8gNjMgdG8gYSBzaW5nbGUgYmFzZSA2NCBkaWdpdC5cbiAqL1xuZXhwb3J0cy5lbmNvZGUgPSBmdW5jdGlvbiAobnVtYmVyKSB7XG4gIGlmICgwIDw9IG51bWJlciAmJiBudW1iZXIgPCBpbnRUb0NoYXJNYXAubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGludFRvQ2hhck1hcFtudW1iZXJdO1xuICB9XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoXCJNdXN0IGJlIGJldHdlZW4gMCBhbmQgNjM6IFwiICsgbnVtYmVyKTtcbn07XG5cbi8qKlxuICogRGVjb2RlIGEgc2luZ2xlIGJhc2UgNjQgY2hhcmFjdGVyIGNvZGUgZGlnaXQgdG8gYW4gaW50ZWdlci4gUmV0dXJucyAtMSBvblxuICogZmFpbHVyZS5cbiAqL1xuZXhwb3J0cy5kZWNvZGUgPSBmdW5jdGlvbiAoY2hhckNvZGUpIHtcbiAgdmFyIGJpZ0EgPSA2NTsgICAgIC8vICdBJ1xuICB2YXIgYmlnWiA9IDkwOyAgICAgLy8gJ1onXG5cbiAgdmFyIGxpdHRsZUEgPSA5NzsgIC8vICdhJ1xuICB2YXIgbGl0dGxlWiA9IDEyMjsgLy8gJ3onXG5cbiAgdmFyIHplcm8gPSA0ODsgICAgIC8vICcwJ1xuICB2YXIgbmluZSA9IDU3OyAgICAgLy8gJzknXG5cbiAgdmFyIHBsdXMgPSA0MzsgICAgIC8vICcrJ1xuICB2YXIgc2xhc2ggPSA0NzsgICAgLy8gJy8nXG5cbiAgdmFyIGxpdHRsZU9mZnNldCA9IDI2O1xuICB2YXIgbnVtYmVyT2Zmc2V0ID0gNTI7XG5cbiAgLy8gMCAtIDI1OiBBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWlxuICBpZiAoYmlnQSA8PSBjaGFyQ29kZSAmJiBjaGFyQ29kZSA8PSBiaWdaKSB7XG4gICAgcmV0dXJuIChjaGFyQ29kZSAtIGJpZ0EpO1xuICB9XG5cbiAgLy8gMjYgLSA1MTogYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpcbiAgaWYgKGxpdHRsZUEgPD0gY2hhckNvZGUgJiYgY2hhckNvZGUgPD0gbGl0dGxlWikge1xuICAgIHJldHVybiAoY2hhckNvZGUgLSBsaXR0bGVBICsgbGl0dGxlT2Zmc2V0KTtcbiAgfVxuXG4gIC8vIDUyIC0gNjE6IDAxMjM0NTY3ODlcbiAgaWYgKHplcm8gPD0gY2hhckNvZGUgJiYgY2hhckNvZGUgPD0gbmluZSkge1xuICAgIHJldHVybiAoY2hhckNvZGUgLSB6ZXJvICsgbnVtYmVyT2Zmc2V0KTtcbiAgfVxuXG4gIC8vIDYyOiArXG4gIGlmIChjaGFyQ29kZSA9PSBwbHVzKSB7XG4gICAgcmV0dXJuIDYyO1xuICB9XG5cbiAgLy8gNjM6IC9cbiAgaWYgKGNoYXJDb2RlID09IHNsYXNoKSB7XG4gICAgcmV0dXJuIDYzO1xuICB9XG5cbiAgLy8gSW52YWxpZCBiYXNlNjQgZGlnaXQuXG4gIHJldHVybiAtMTtcbn07XG4iLCAiLyogLSotIE1vZGU6IGpzOyBqcy1pbmRlbnQtbGV2ZWw6IDI7IC0qLSAqL1xuLypcbiAqIENvcHlyaWdodCAyMDExIE1vemlsbGEgRm91bmRhdGlvbiBhbmQgY29udHJpYnV0b3JzXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTmV3IEJTRCBsaWNlbnNlLiBTZWUgTElDRU5TRSBvcjpcbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9CU0QtMy1DbGF1c2VcbiAqL1xuXG5leHBvcnRzLkdSRUFURVNUX0xPV0VSX0JPVU5EID0gMTtcbmV4cG9ydHMuTEVBU1RfVVBQRVJfQk9VTkQgPSAyO1xuXG4vKipcbiAqIFJlY3Vyc2l2ZSBpbXBsZW1lbnRhdGlvbiBvZiBiaW5hcnkgc2VhcmNoLlxuICpcbiAqIEBwYXJhbSBhTG93IEluZGljZXMgaGVyZSBhbmQgbG93ZXIgZG8gbm90IGNvbnRhaW4gdGhlIG5lZWRsZS5cbiAqIEBwYXJhbSBhSGlnaCBJbmRpY2VzIGhlcmUgYW5kIGhpZ2hlciBkbyBub3QgY29udGFpbiB0aGUgbmVlZGxlLlxuICogQHBhcmFtIGFOZWVkbGUgVGhlIGVsZW1lbnQgYmVpbmcgc2VhcmNoZWQgZm9yLlxuICogQHBhcmFtIGFIYXlzdGFjayBUaGUgbm9uLWVtcHR5IGFycmF5IGJlaW5nIHNlYXJjaGVkLlxuICogQHBhcmFtIGFDb21wYXJlIEZ1bmN0aW9uIHdoaWNoIHRha2VzIHR3byBlbGVtZW50cyBhbmQgcmV0dXJucyAtMSwgMCwgb3IgMS5cbiAqIEBwYXJhbSBhQmlhcyBFaXRoZXIgJ2JpbmFyeVNlYXJjaC5HUkVBVEVTVF9MT1dFUl9CT1VORCcgb3JcbiAqICAgICAnYmluYXJ5U2VhcmNoLkxFQVNUX1VQUEVSX0JPVU5EJy4gU3BlY2lmaWVzIHdoZXRoZXIgdG8gcmV0dXJuIHRoZVxuICogICAgIGNsb3Nlc3QgZWxlbWVudCB0aGF0IGlzIHNtYWxsZXIgdGhhbiBvciBncmVhdGVyIHRoYW4gdGhlIG9uZSB3ZSBhcmVcbiAqICAgICBzZWFyY2hpbmcgZm9yLCByZXNwZWN0aXZlbHksIGlmIHRoZSBleGFjdCBlbGVtZW50IGNhbm5vdCBiZSBmb3VuZC5cbiAqL1xuZnVuY3Rpb24gcmVjdXJzaXZlU2VhcmNoKGFMb3csIGFIaWdoLCBhTmVlZGxlLCBhSGF5c3RhY2ssIGFDb21wYXJlLCBhQmlhcykge1xuICAvLyBUaGlzIGZ1bmN0aW9uIHRlcm1pbmF0ZXMgd2hlbiBvbmUgb2YgdGhlIGZvbGxvd2luZyBpcyB0cnVlOlxuICAvL1xuICAvLyAgIDEuIFdlIGZpbmQgdGhlIGV4YWN0IGVsZW1lbnQgd2UgYXJlIGxvb2tpbmcgZm9yLlxuICAvL1xuICAvLyAgIDIuIFdlIGRpZCBub3QgZmluZCB0aGUgZXhhY3QgZWxlbWVudCwgYnV0IHdlIGNhbiByZXR1cm4gdGhlIGluZGV4IG9mXG4gIC8vICAgICAgdGhlIG5leHQtY2xvc2VzdCBlbGVtZW50LlxuICAvL1xuICAvLyAgIDMuIFdlIGRpZCBub3QgZmluZCB0aGUgZXhhY3QgZWxlbWVudCwgYW5kIHRoZXJlIGlzIG5vIG5leHQtY2xvc2VzdFxuICAvLyAgICAgIGVsZW1lbnQgdGhhbiB0aGUgb25lIHdlIGFyZSBzZWFyY2hpbmcgZm9yLCBzbyB3ZSByZXR1cm4gLTEuXG4gIHZhciBtaWQgPSBNYXRoLmZsb29yKChhSGlnaCAtIGFMb3cpIC8gMikgKyBhTG93O1xuICB2YXIgY21wID0gYUNvbXBhcmUoYU5lZWRsZSwgYUhheXN0YWNrW21pZF0sIHRydWUpO1xuICBpZiAoY21wID09PSAwKSB7XG4gICAgLy8gRm91bmQgdGhlIGVsZW1lbnQgd2UgYXJlIGxvb2tpbmcgZm9yLlxuICAgIHJldHVybiBtaWQ7XG4gIH1cbiAgZWxzZSBpZiAoY21wID4gMCkge1xuICAgIC8vIE91ciBuZWVkbGUgaXMgZ3JlYXRlciB0aGFuIGFIYXlzdGFja1ttaWRdLlxuICAgIGlmIChhSGlnaCAtIG1pZCA+IDEpIHtcbiAgICAgIC8vIFRoZSBlbGVtZW50IGlzIGluIHRoZSB1cHBlciBoYWxmLlxuICAgICAgcmV0dXJuIHJlY3Vyc2l2ZVNlYXJjaChtaWQsIGFIaWdoLCBhTmVlZGxlLCBhSGF5c3RhY2ssIGFDb21wYXJlLCBhQmlhcyk7XG4gICAgfVxuXG4gICAgLy8gVGhlIGV4YWN0IG5lZWRsZSBlbGVtZW50IHdhcyBub3QgZm91bmQgaW4gdGhpcyBoYXlzdGFjay4gRGV0ZXJtaW5lIGlmXG4gICAgLy8gd2UgYXJlIGluIHRlcm1pbmF0aW9uIGNhc2UgKDMpIG9yICgyKSBhbmQgcmV0dXJuIHRoZSBhcHByb3ByaWF0ZSB0aGluZy5cbiAgICBpZiAoYUJpYXMgPT0gZXhwb3J0cy5MRUFTVF9VUFBFUl9CT1VORCkge1xuICAgICAgcmV0dXJuIGFIaWdoIDwgYUhheXN0YWNrLmxlbmd0aCA/IGFIaWdoIDogLTE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBtaWQ7XG4gICAgfVxuICB9XG4gIGVsc2Uge1xuICAgIC8vIE91ciBuZWVkbGUgaXMgbGVzcyB0aGFuIGFIYXlzdGFja1ttaWRdLlxuICAgIGlmIChtaWQgLSBhTG93ID4gMSkge1xuICAgICAgLy8gVGhlIGVsZW1lbnQgaXMgaW4gdGhlIGxvd2VyIGhhbGYuXG4gICAgICByZXR1cm4gcmVjdXJzaXZlU2VhcmNoKGFMb3csIG1pZCwgYU5lZWRsZSwgYUhheXN0YWNrLCBhQ29tcGFyZSwgYUJpYXMpO1xuICAgIH1cblxuICAgIC8vIHdlIGFyZSBpbiB0ZXJtaW5hdGlvbiBjYXNlICgzKSBvciAoMikgYW5kIHJldHVybiB0aGUgYXBwcm9wcmlhdGUgdGhpbmcuXG4gICAgaWYgKGFCaWFzID09IGV4cG9ydHMuTEVBU1RfVVBQRVJfQk9VTkQpIHtcbiAgICAgIHJldHVybiBtaWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBhTG93IDwgMCA/IC0xIDogYUxvdztcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBUaGlzIGlzIGFuIGltcGxlbWVudGF0aW9uIG9mIGJpbmFyeSBzZWFyY2ggd2hpY2ggd2lsbCBhbHdheXMgdHJ5IGFuZCByZXR1cm5cbiAqIHRoZSBpbmRleCBvZiB0aGUgY2xvc2VzdCBlbGVtZW50IGlmIHRoZXJlIGlzIG5vIGV4YWN0IGhpdC4gVGhpcyBpcyBiZWNhdXNlXG4gKiBtYXBwaW5ncyBiZXR3ZWVuIG9yaWdpbmFsIGFuZCBnZW5lcmF0ZWQgbGluZS9jb2wgcGFpcnMgYXJlIHNpbmdsZSBwb2ludHMsXG4gKiBhbmQgdGhlcmUgaXMgYW4gaW1wbGljaXQgcmVnaW9uIGJldHdlZW4gZWFjaCBvZiB0aGVtLCBzbyBhIG1pc3MganVzdCBtZWFuc1xuICogdGhhdCB5b3UgYXJlbid0IG9uIHRoZSB2ZXJ5IHN0YXJ0IG9mIGEgcmVnaW9uLlxuICpcbiAqIEBwYXJhbSBhTmVlZGxlIFRoZSBlbGVtZW50IHlvdSBhcmUgbG9va2luZyBmb3IuXG4gKiBAcGFyYW0gYUhheXN0YWNrIFRoZSBhcnJheSB0aGF0IGlzIGJlaW5nIHNlYXJjaGVkLlxuICogQHBhcmFtIGFDb21wYXJlIEEgZnVuY3Rpb24gd2hpY2ggdGFrZXMgdGhlIG5lZWRsZSBhbmQgYW4gZWxlbWVudCBpbiB0aGVcbiAqICAgICBhcnJheSBhbmQgcmV0dXJucyAtMSwgMCwgb3IgMSBkZXBlbmRpbmcgb24gd2hldGhlciB0aGUgbmVlZGxlIGlzIGxlc3NcbiAqICAgICB0aGFuLCBlcXVhbCB0bywgb3IgZ3JlYXRlciB0aGFuIHRoZSBlbGVtZW50LCByZXNwZWN0aXZlbHkuXG4gKiBAcGFyYW0gYUJpYXMgRWl0aGVyICdiaW5hcnlTZWFyY2guR1JFQVRFU1RfTE9XRVJfQk9VTkQnIG9yXG4gKiAgICAgJ2JpbmFyeVNlYXJjaC5MRUFTVF9VUFBFUl9CT1VORCcuIFNwZWNpZmllcyB3aGV0aGVyIHRvIHJldHVybiB0aGVcbiAqICAgICBjbG9zZXN0IGVsZW1lbnQgdGhhdCBpcyBzbWFsbGVyIHRoYW4gb3IgZ3JlYXRlciB0aGFuIHRoZSBvbmUgd2UgYXJlXG4gKiAgICAgc2VhcmNoaW5nIGZvciwgcmVzcGVjdGl2ZWx5LCBpZiB0aGUgZXhhY3QgZWxlbWVudCBjYW5ub3QgYmUgZm91bmQuXG4gKiAgICAgRGVmYXVsdHMgdG8gJ2JpbmFyeVNlYXJjaC5HUkVBVEVTVF9MT1dFUl9CT1VORCcuXG4gKi9cbmV4cG9ydHMuc2VhcmNoID0gZnVuY3Rpb24gc2VhcmNoKGFOZWVkbGUsIGFIYXlzdGFjaywgYUNvbXBhcmUsIGFCaWFzKSB7XG4gIGlmIChhSGF5c3RhY2subGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgdmFyIGluZGV4ID0gcmVjdXJzaXZlU2VhcmNoKC0xLCBhSGF5c3RhY2subGVuZ3RoLCBhTmVlZGxlLCBhSGF5c3RhY2ssXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhQ29tcGFyZSwgYUJpYXMgfHwgZXhwb3J0cy5HUkVBVEVTVF9MT1dFUl9CT1VORCk7XG4gIGlmIChpbmRleCA8IDApIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICAvLyBXZSBoYXZlIGZvdW5kIGVpdGhlciB0aGUgZXhhY3QgZWxlbWVudCwgb3IgdGhlIG5leHQtY2xvc2VzdCBlbGVtZW50IHRoYW5cbiAgLy8gdGhlIG9uZSB3ZSBhcmUgc2VhcmNoaW5nIGZvci4gSG93ZXZlciwgdGhlcmUgbWF5IGJlIG1vcmUgdGhhbiBvbmUgc3VjaFxuICAvLyBlbGVtZW50LiBNYWtlIHN1cmUgd2UgYWx3YXlzIHJldHVybiB0aGUgc21hbGxlc3Qgb2YgdGhlc2UuXG4gIHdoaWxlIChpbmRleCAtIDEgPj0gMCkge1xuICAgIGlmIChhQ29tcGFyZShhSGF5c3RhY2tbaW5kZXhdLCBhSGF5c3RhY2tbaW5kZXggLSAxXSwgdHJ1ZSkgIT09IDApIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICAtLWluZGV4O1xuICB9XG5cbiAgcmV0dXJuIGluZGV4O1xufTtcbiIsICIvKiAtKi0gTW9kZToganM7IGpzLWluZGVudC1sZXZlbDogMjsgLSotICovXG4vKlxuICogQ29weXJpZ2h0IDIwMTQgTW96aWxsYSBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnNcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICovXG5cbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgbWFwcGluZ0IgaXMgYWZ0ZXIgbWFwcGluZ0Egd2l0aCByZXNwZWN0IHRvIGdlbmVyYXRlZFxuICogcG9zaXRpb24uXG4gKi9cbmZ1bmN0aW9uIGdlbmVyYXRlZFBvc2l0aW9uQWZ0ZXIobWFwcGluZ0EsIG1hcHBpbmdCKSB7XG4gIC8vIE9wdGltaXplZCBmb3IgbW9zdCBjb21tb24gY2FzZVxuICB2YXIgbGluZUEgPSBtYXBwaW5nQS5nZW5lcmF0ZWRMaW5lO1xuICB2YXIgbGluZUIgPSBtYXBwaW5nQi5nZW5lcmF0ZWRMaW5lO1xuICB2YXIgY29sdW1uQSA9IG1hcHBpbmdBLmdlbmVyYXRlZENvbHVtbjtcbiAgdmFyIGNvbHVtbkIgPSBtYXBwaW5nQi5nZW5lcmF0ZWRDb2x1bW47XG4gIHJldHVybiBsaW5lQiA+IGxpbmVBIHx8IGxpbmVCID09IGxpbmVBICYmIGNvbHVtbkIgPj0gY29sdW1uQSB8fFxuICAgICAgICAgdXRpbC5jb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNJbmZsYXRlZChtYXBwaW5nQSwgbWFwcGluZ0IpIDw9IDA7XG59XG5cbi8qKlxuICogQSBkYXRhIHN0cnVjdHVyZSB0byBwcm92aWRlIGEgc29ydGVkIHZpZXcgb2YgYWNjdW11bGF0ZWQgbWFwcGluZ3MgaW4gYVxuICogcGVyZm9ybWFuY2UgY29uc2Npb3VzIG1hbm5lci4gSXQgdHJhZGVzIGEgbmVnbGliYWJsZSBvdmVyaGVhZCBpbiBnZW5lcmFsXG4gKiBjYXNlIGZvciBhIGxhcmdlIHNwZWVkdXAgaW4gY2FzZSBvZiBtYXBwaW5ncyBiZWluZyBhZGRlZCBpbiBvcmRlci5cbiAqL1xuZnVuY3Rpb24gTWFwcGluZ0xpc3QoKSB7XG4gIHRoaXMuX2FycmF5ID0gW107XG4gIHRoaXMuX3NvcnRlZCA9IHRydWU7XG4gIC8vIFNlcnZlcyBhcyBpbmZpbXVtXG4gIHRoaXMuX2xhc3QgPSB7Z2VuZXJhdGVkTGluZTogLTEsIGdlbmVyYXRlZENvbHVtbjogMH07XG59XG5cbi8qKlxuICogSXRlcmF0ZSB0aHJvdWdoIGludGVybmFsIGl0ZW1zLiBUaGlzIG1ldGhvZCB0YWtlcyB0aGUgc2FtZSBhcmd1bWVudHMgdGhhdFxuICogYEFycmF5LnByb3RvdHlwZS5mb3JFYWNoYCB0YWtlcy5cbiAqXG4gKiBOT1RFOiBUaGUgb3JkZXIgb2YgdGhlIG1hcHBpbmdzIGlzIE5PVCBndWFyYW50ZWVkLlxuICovXG5NYXBwaW5nTGlzdC5wcm90b3R5cGUudW5zb3J0ZWRGb3JFYWNoID1cbiAgZnVuY3Rpb24gTWFwcGluZ0xpc3RfZm9yRWFjaChhQ2FsbGJhY2ssIGFUaGlzQXJnKSB7XG4gICAgdGhpcy5fYXJyYXkuZm9yRWFjaChhQ2FsbGJhY2ssIGFUaGlzQXJnKTtcbiAgfTtcblxuLyoqXG4gKiBBZGQgdGhlIGdpdmVuIHNvdXJjZSBtYXBwaW5nLlxuICpcbiAqIEBwYXJhbSBPYmplY3QgYU1hcHBpbmdcbiAqL1xuTWFwcGluZ0xpc3QucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIE1hcHBpbmdMaXN0X2FkZChhTWFwcGluZykge1xuICBpZiAoZ2VuZXJhdGVkUG9zaXRpb25BZnRlcih0aGlzLl9sYXN0LCBhTWFwcGluZykpIHtcbiAgICB0aGlzLl9sYXN0ID0gYU1hcHBpbmc7XG4gICAgdGhpcy5fYXJyYXkucHVzaChhTWFwcGluZyk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fc29ydGVkID0gZmFsc2U7XG4gICAgdGhpcy5fYXJyYXkucHVzaChhTWFwcGluZyk7XG4gIH1cbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZmxhdCwgc29ydGVkIGFycmF5IG9mIG1hcHBpbmdzLiBUaGUgbWFwcGluZ3MgYXJlIHNvcnRlZCBieVxuICogZ2VuZXJhdGVkIHBvc2l0aW9uLlxuICpcbiAqIFdBUk5JTkc6IFRoaXMgbWV0aG9kIHJldHVybnMgaW50ZXJuYWwgZGF0YSB3aXRob3V0IGNvcHlpbmcsIGZvclxuICogcGVyZm9ybWFuY2UuIFRoZSByZXR1cm4gdmFsdWUgbXVzdCBOT1QgYmUgbXV0YXRlZCwgYW5kIHNob3VsZCBiZSB0cmVhdGVkIGFzXG4gKiBhbiBpbW11dGFibGUgYm9ycm93LiBJZiB5b3Ugd2FudCB0byB0YWtlIG93bmVyc2hpcCwgeW91IG11c3QgbWFrZSB5b3VyIG93blxuICogY29weS5cbiAqL1xuTWFwcGluZ0xpc3QucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbiBNYXBwaW5nTGlzdF90b0FycmF5KCkge1xuICBpZiAoIXRoaXMuX3NvcnRlZCkge1xuICAgIHRoaXMuX2FycmF5LnNvcnQodXRpbC5jb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNJbmZsYXRlZCk7XG4gICAgdGhpcy5fc29ydGVkID0gdHJ1ZTtcbiAgfVxuICByZXR1cm4gdGhpcy5fYXJyYXk7XG59O1xuXG5leHBvcnRzLk1hcHBpbmdMaXN0ID0gTWFwcGluZ0xpc3Q7XG4iLCAiLyogLSotIE1vZGU6IGpzOyBqcy1pbmRlbnQtbGV2ZWw6IDI7IC0qLSAqL1xuLypcbiAqIENvcHlyaWdodCAyMDExIE1vemlsbGEgRm91bmRhdGlvbiBhbmQgY29udHJpYnV0b3JzXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTmV3IEJTRCBsaWNlbnNlLiBTZWUgTElDRU5TRSBvcjpcbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9CU0QtMy1DbGF1c2VcbiAqL1xuXG4vLyBJdCB0dXJucyBvdXQgdGhhdCBzb21lIChtb3N0PykgSmF2YVNjcmlwdCBlbmdpbmVzIGRvbid0IHNlbGYtaG9zdFxuLy8gYEFycmF5LnByb3RvdHlwZS5zb3J0YC4gVGhpcyBtYWtlcyBzZW5zZSBiZWNhdXNlIEMrKyB3aWxsIGxpa2VseSByZW1haW5cbi8vIGZhc3RlciB0aGFuIEpTIHdoZW4gZG9pbmcgcmF3IENQVS1pbnRlbnNpdmUgc29ydGluZy4gSG93ZXZlciwgd2hlbiB1c2luZyBhXG4vLyBjdXN0b20gY29tcGFyYXRvciBmdW5jdGlvbiwgY2FsbGluZyBiYWNrIGFuZCBmb3J0aCBiZXR3ZWVuIHRoZSBWTSdzIEMrKyBhbmRcbi8vIEpJVCdkIEpTIGlzIHJhdGhlciBzbG93ICphbmQqIGxvc2VzIEpJVCB0eXBlIGluZm9ybWF0aW9uLCByZXN1bHRpbmcgaW5cbi8vIHdvcnNlIGdlbmVyYXRlZCBjb2RlIGZvciB0aGUgY29tcGFyYXRvciBmdW5jdGlvbiB0aGFuIHdvdWxkIGJlIG9wdGltYWwuIEluXG4vLyBmYWN0LCB3aGVuIHNvcnRpbmcgd2l0aCBhIGNvbXBhcmF0b3IsIHRoZXNlIGNvc3RzIG91dHdlaWdoIHRoZSBiZW5lZml0cyBvZlxuLy8gc29ydGluZyBpbiBDKysuIEJ5IHVzaW5nIG91ciBvd24gSlMtaW1wbGVtZW50ZWQgUXVpY2sgU29ydCAoYmVsb3cpLCB3ZSBnZXRcbi8vIGEgfjM1MDBtcyBtZWFuIHNwZWVkLXVwIGluIGBiZW5jaC9iZW5jaC5odG1sYC5cblxuLyoqXG4gKiBTd2FwIHRoZSBlbGVtZW50cyBpbmRleGVkIGJ5IGB4YCBhbmQgYHlgIGluIHRoZSBhcnJheSBgYXJ5YC5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcnlcbiAqICAgICAgICBUaGUgYXJyYXkuXG4gKiBAcGFyYW0ge051bWJlcn0geFxuICogICAgICAgIFRoZSBpbmRleCBvZiB0aGUgZmlyc3QgaXRlbS5cbiAqIEBwYXJhbSB7TnVtYmVyfSB5XG4gKiAgICAgICAgVGhlIGluZGV4IG9mIHRoZSBzZWNvbmQgaXRlbS5cbiAqL1xuZnVuY3Rpb24gc3dhcChhcnksIHgsIHkpIHtcbiAgdmFyIHRlbXAgPSBhcnlbeF07XG4gIGFyeVt4XSA9IGFyeVt5XTtcbiAgYXJ5W3ldID0gdGVtcDtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgcmFuZG9tIGludGVnZXIgd2l0aGluIHRoZSByYW5nZSBgbG93IC4uIGhpZ2hgIGluY2x1c2l2ZS5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbG93XG4gKiAgICAgICAgVGhlIGxvd2VyIGJvdW5kIG9uIHRoZSByYW5nZS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBoaWdoXG4gKiAgICAgICAgVGhlIHVwcGVyIGJvdW5kIG9uIHRoZSByYW5nZS5cbiAqL1xuZnVuY3Rpb24gcmFuZG9tSW50SW5SYW5nZShsb3csIGhpZ2gpIHtcbiAgcmV0dXJuIE1hdGgucm91bmQobG93ICsgKE1hdGgucmFuZG9tKCkgKiAoaGlnaCAtIGxvdykpKTtcbn1cblxuLyoqXG4gKiBUaGUgUXVpY2sgU29ydCBhbGdvcml0aG0uXG4gKlxuICogQHBhcmFtIHtBcnJheX0gYXJ5XG4gKiAgICAgICAgQW4gYXJyYXkgdG8gc29ydC5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNvbXBhcmF0b3JcbiAqICAgICAgICBGdW5jdGlvbiB0byB1c2UgdG8gY29tcGFyZSB0d28gaXRlbXMuXG4gKiBAcGFyYW0ge051bWJlcn0gcFxuICogICAgICAgIFN0YXJ0IGluZGV4IG9mIHRoZSBhcnJheVxuICogQHBhcmFtIHtOdW1iZXJ9IHJcbiAqICAgICAgICBFbmQgaW5kZXggb2YgdGhlIGFycmF5XG4gKi9cbmZ1bmN0aW9uIGRvUXVpY2tTb3J0KGFyeSwgY29tcGFyYXRvciwgcCwgcikge1xuICAvLyBJZiBvdXIgbG93ZXIgYm91bmQgaXMgbGVzcyB0aGFuIG91ciB1cHBlciBib3VuZCwgd2UgKDEpIHBhcnRpdGlvbiB0aGVcbiAgLy8gYXJyYXkgaW50byB0d28gcGllY2VzIGFuZCAoMikgcmVjdXJzZSBvbiBlYWNoIGhhbGYuIElmIGl0IGlzIG5vdCwgdGhpcyBpc1xuICAvLyB0aGUgZW1wdHkgYXJyYXkgYW5kIG91ciBiYXNlIGNhc2UuXG5cbiAgaWYgKHAgPCByKSB7XG4gICAgLy8gKDEpIFBhcnRpdGlvbmluZy5cbiAgICAvL1xuICAgIC8vIFRoZSBwYXJ0aXRpb25pbmcgY2hvb3NlcyBhIHBpdm90IGJldHdlZW4gYHBgIGFuZCBgcmAgYW5kIG1vdmVzIGFsbFxuICAgIC8vIGVsZW1lbnRzIHRoYXQgYXJlIGxlc3MgdGhhbiBvciBlcXVhbCB0byB0aGUgcGl2b3QgdG8gdGhlIGJlZm9yZSBpdCwgYW5kXG4gICAgLy8gYWxsIHRoZSBlbGVtZW50cyB0aGF0IGFyZSBncmVhdGVyIHRoYW4gaXQgYWZ0ZXIgaXQuIFRoZSBlZmZlY3QgaXMgdGhhdFxuICAgIC8vIG9uY2UgcGFydGl0aW9uIGlzIGRvbmUsIHRoZSBwaXZvdCBpcyBpbiB0aGUgZXhhY3QgcGxhY2UgaXQgd2lsbCBiZSB3aGVuXG4gICAgLy8gdGhlIGFycmF5IGlzIHB1dCBpbiBzb3J0ZWQgb3JkZXIsIGFuZCBpdCB3aWxsIG5vdCBuZWVkIHRvIGJlIG1vdmVkXG4gICAgLy8gYWdhaW4uIFRoaXMgcnVucyBpbiBPKG4pIHRpbWUuXG5cbiAgICAvLyBBbHdheXMgY2hvb3NlIGEgcmFuZG9tIHBpdm90IHNvIHRoYXQgYW4gaW5wdXQgYXJyYXkgd2hpY2ggaXMgcmV2ZXJzZVxuICAgIC8vIHNvcnRlZCBkb2VzIG5vdCBjYXVzZSBPKG5eMikgcnVubmluZyB0aW1lLlxuICAgIHZhciBwaXZvdEluZGV4ID0gcmFuZG9tSW50SW5SYW5nZShwLCByKTtcbiAgICB2YXIgaSA9IHAgLSAxO1xuXG4gICAgc3dhcChhcnksIHBpdm90SW5kZXgsIHIpO1xuICAgIHZhciBwaXZvdCA9IGFyeVtyXTtcblxuICAgIC8vIEltbWVkaWF0ZWx5IGFmdGVyIGBqYCBpcyBpbmNyZW1lbnRlZCBpbiB0aGlzIGxvb3AsIHRoZSBmb2xsb3dpbmcgaG9sZFxuICAgIC8vIHRydWU6XG4gICAgLy9cbiAgICAvLyAgICogRXZlcnkgZWxlbWVudCBpbiBgYXJ5W3AgLi4gaV1gIGlzIGxlc3MgdGhhbiBvciBlcXVhbCB0byB0aGUgcGl2b3QuXG4gICAgLy9cbiAgICAvLyAgICogRXZlcnkgZWxlbWVudCBpbiBgYXJ5W2krMSAuLiBqLTFdYCBpcyBncmVhdGVyIHRoYW4gdGhlIHBpdm90LlxuICAgIGZvciAodmFyIGogPSBwOyBqIDwgcjsgaisrKSB7XG4gICAgICBpZiAoY29tcGFyYXRvcihhcnlbal0sIHBpdm90KSA8PSAwKSB7XG4gICAgICAgIGkgKz0gMTtcbiAgICAgICAgc3dhcChhcnksIGksIGopO1xuICAgICAgfVxuICAgIH1cblxuICAgIHN3YXAoYXJ5LCBpICsgMSwgaik7XG4gICAgdmFyIHEgPSBpICsgMTtcblxuICAgIC8vICgyKSBSZWN1cnNlIG9uIGVhY2ggaGFsZi5cblxuICAgIGRvUXVpY2tTb3J0KGFyeSwgY29tcGFyYXRvciwgcCwgcSAtIDEpO1xuICAgIGRvUXVpY2tTb3J0KGFyeSwgY29tcGFyYXRvciwgcSArIDEsIHIpO1xuICB9XG59XG5cbi8qKlxuICogU29ydCB0aGUgZ2l2ZW4gYXJyYXkgaW4tcGxhY2Ugd2l0aCB0aGUgZ2l2ZW4gY29tcGFyYXRvciBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcnlcbiAqICAgICAgICBBbiBhcnJheSB0byBzb3J0LlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY29tcGFyYXRvclxuICogICAgICAgIEZ1bmN0aW9uIHRvIHVzZSB0byBjb21wYXJlIHR3byBpdGVtcy5cbiAqL1xuZXhwb3J0cy5xdWlja1NvcnQgPSBmdW5jdGlvbiAoYXJ5LCBjb21wYXJhdG9yKSB7XG4gIGRvUXVpY2tTb3J0KGFyeSwgY29tcGFyYXRvciwgMCwgYXJ5Lmxlbmd0aCAtIDEpO1xufTtcbiIsICIvKiAtKi0gTW9kZToganM7IGpzLWluZGVudC1sZXZlbDogMjsgLSotICovXG4vKlxuICogQ29weXJpZ2h0IDIwMTEgTW96aWxsYSBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnNcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICovXG5cbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgYmluYXJ5U2VhcmNoID0gcmVxdWlyZSgnLi9iaW5hcnktc2VhcmNoJyk7XG52YXIgQXJyYXlTZXQgPSByZXF1aXJlKCcuL2FycmF5LXNldCcpLkFycmF5U2V0O1xudmFyIGJhc2U2NFZMUSA9IHJlcXVpcmUoJy4vYmFzZTY0LXZscScpO1xudmFyIHF1aWNrU29ydCA9IHJlcXVpcmUoJy4vcXVpY2stc29ydCcpLnF1aWNrU29ydDtcblxuZnVuY3Rpb24gU291cmNlTWFwQ29uc3VtZXIoYVNvdXJjZU1hcCwgYVNvdXJjZU1hcFVSTCkge1xuICB2YXIgc291cmNlTWFwID0gYVNvdXJjZU1hcDtcbiAgaWYgKHR5cGVvZiBhU291cmNlTWFwID09PSAnc3RyaW5nJykge1xuICAgIHNvdXJjZU1hcCA9IHV0aWwucGFyc2VTb3VyY2VNYXBJbnB1dChhU291cmNlTWFwKTtcbiAgfVxuXG4gIHJldHVybiBzb3VyY2VNYXAuc2VjdGlvbnMgIT0gbnVsbFxuICAgID8gbmV3IEluZGV4ZWRTb3VyY2VNYXBDb25zdW1lcihzb3VyY2VNYXAsIGFTb3VyY2VNYXBVUkwpXG4gICAgOiBuZXcgQmFzaWNTb3VyY2VNYXBDb25zdW1lcihzb3VyY2VNYXAsIGFTb3VyY2VNYXBVUkwpO1xufVxuXG5Tb3VyY2VNYXBDb25zdW1lci5mcm9tU291cmNlTWFwID0gZnVuY3Rpb24oYVNvdXJjZU1hcCwgYVNvdXJjZU1hcFVSTCkge1xuICByZXR1cm4gQmFzaWNTb3VyY2VNYXBDb25zdW1lci5mcm9tU291cmNlTWFwKGFTb3VyY2VNYXAsIGFTb3VyY2VNYXBVUkwpO1xufVxuXG4vKipcbiAqIFRoZSB2ZXJzaW9uIG9mIHRoZSBzb3VyY2UgbWFwcGluZyBzcGVjIHRoYXQgd2UgYXJlIGNvbnN1bWluZy5cbiAqL1xuU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLl92ZXJzaW9uID0gMztcblxuLy8gYF9fZ2VuZXJhdGVkTWFwcGluZ3NgIGFuZCBgX19vcmlnaW5hbE1hcHBpbmdzYCBhcmUgYXJyYXlzIHRoYXQgaG9sZCB0aGVcbi8vIHBhcnNlZCBtYXBwaW5nIGNvb3JkaW5hdGVzIGZyb20gdGhlIHNvdXJjZSBtYXAncyBcIm1hcHBpbmdzXCIgYXR0cmlidXRlLiBUaGV5XG4vLyBhcmUgbGF6aWx5IGluc3RhbnRpYXRlZCwgYWNjZXNzZWQgdmlhIHRoZSBgX2dlbmVyYXRlZE1hcHBpbmdzYCBhbmRcbi8vIGBfb3JpZ2luYWxNYXBwaW5nc2AgZ2V0dGVycyByZXNwZWN0aXZlbHksIGFuZCB3ZSBvbmx5IHBhcnNlIHRoZSBtYXBwaW5nc1xuLy8gYW5kIGNyZWF0ZSB0aGVzZSBhcnJheXMgb25jZSBxdWVyaWVkIGZvciBhIHNvdXJjZSBsb2NhdGlvbi4gV2UganVtcCB0aHJvdWdoXG4vLyB0aGVzZSBob29wcyBiZWNhdXNlIHRoZXJlIGNhbiBiZSBtYW55IHRob3VzYW5kcyBvZiBtYXBwaW5ncywgYW5kIHBhcnNpbmdcbi8vIHRoZW0gaXMgZXhwZW5zaXZlLCBzbyB3ZSBvbmx5IHdhbnQgdG8gZG8gaXQgaWYgd2UgbXVzdC5cbi8vXG4vLyBFYWNoIG9iamVjdCBpbiB0aGUgYXJyYXlzIGlzIG9mIHRoZSBmb3JtOlxuLy9cbi8vICAgICB7XG4vLyAgICAgICBnZW5lcmF0ZWRMaW5lOiBUaGUgbGluZSBudW1iZXIgaW4gdGhlIGdlbmVyYXRlZCBjb2RlLFxuLy8gICAgICAgZ2VuZXJhdGVkQ29sdW1uOiBUaGUgY29sdW1uIG51bWJlciBpbiB0aGUgZ2VuZXJhdGVkIGNvZGUsXG4vLyAgICAgICBzb3VyY2U6IFRoZSBwYXRoIHRvIHRoZSBvcmlnaW5hbCBzb3VyY2UgZmlsZSB0aGF0IGdlbmVyYXRlZCB0aGlzXG4vLyAgICAgICAgICAgICAgIGNodW5rIG9mIGNvZGUsXG4vLyAgICAgICBvcmlnaW5hbExpbmU6IFRoZSBsaW5lIG51bWJlciBpbiB0aGUgb3JpZ2luYWwgc291cmNlIHRoYXRcbi8vICAgICAgICAgICAgICAgICAgICAgY29ycmVzcG9uZHMgdG8gdGhpcyBjaHVuayBvZiBnZW5lcmF0ZWQgY29kZSxcbi8vICAgICAgIG9yaWdpbmFsQ29sdW1uOiBUaGUgY29sdW1uIG51bWJlciBpbiB0aGUgb3JpZ2luYWwgc291cmNlIHRoYXRcbi8vICAgICAgICAgICAgICAgICAgICAgICBjb3JyZXNwb25kcyB0byB0aGlzIGNodW5rIG9mIGdlbmVyYXRlZCBjb2RlLFxuLy8gICAgICAgbmFtZTogVGhlIG5hbWUgb2YgdGhlIG9yaWdpbmFsIHN5bWJvbCB3aGljaCBnZW5lcmF0ZWQgdGhpcyBjaHVuayBvZlxuLy8gICAgICAgICAgICAgY29kZS5cbi8vICAgICB9XG4vL1xuLy8gQWxsIHByb3BlcnRpZXMgZXhjZXB0IGZvciBgZ2VuZXJhdGVkTGluZWAgYW5kIGBnZW5lcmF0ZWRDb2x1bW5gIGNhbiBiZVxuLy8gYG51bGxgLlxuLy9cbi8vIGBfZ2VuZXJhdGVkTWFwcGluZ3NgIGlzIG9yZGVyZWQgYnkgdGhlIGdlbmVyYXRlZCBwb3NpdGlvbnMuXG4vL1xuLy8gYF9vcmlnaW5hbE1hcHBpbmdzYCBpcyBvcmRlcmVkIGJ5IHRoZSBvcmlnaW5hbCBwb3NpdGlvbnMuXG5cblNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5fX2dlbmVyYXRlZE1hcHBpbmdzID0gbnVsbDtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUsICdfZ2VuZXJhdGVkTWFwcGluZ3MnLCB7XG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLl9fZ2VuZXJhdGVkTWFwcGluZ3MpIHtcbiAgICAgIHRoaXMuX3BhcnNlTWFwcGluZ3ModGhpcy5fbWFwcGluZ3MsIHRoaXMuc291cmNlUm9vdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX19nZW5lcmF0ZWRNYXBwaW5ncztcbiAgfVxufSk7XG5cblNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5fX29yaWdpbmFsTWFwcGluZ3MgPSBudWxsO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KFNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZSwgJ19vcmlnaW5hbE1hcHBpbmdzJywge1xuICBjb25maWd1cmFibGU6IHRydWUsXG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5fX29yaWdpbmFsTWFwcGluZ3MpIHtcbiAgICAgIHRoaXMuX3BhcnNlTWFwcGluZ3ModGhpcy5fbWFwcGluZ3MsIHRoaXMuc291cmNlUm9vdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX19vcmlnaW5hbE1hcHBpbmdzO1xuICB9XG59KTtcblxuU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLl9jaGFySXNNYXBwaW5nU2VwYXJhdG9yID1cbiAgZnVuY3Rpb24gU291cmNlTWFwQ29uc3VtZXJfY2hhcklzTWFwcGluZ1NlcGFyYXRvcihhU3RyLCBpbmRleCkge1xuICAgIHZhciBjID0gYVN0ci5jaGFyQXQoaW5kZXgpO1xuICAgIHJldHVybiBjID09PSBcIjtcIiB8fCBjID09PSBcIixcIjtcbiAgfTtcblxuLyoqXG4gKiBQYXJzZSB0aGUgbWFwcGluZ3MgaW4gYSBzdHJpbmcgaW4gdG8gYSBkYXRhIHN0cnVjdHVyZSB3aGljaCB3ZSBjYW4gZWFzaWx5XG4gKiBxdWVyeSAodGhlIG9yZGVyZWQgYXJyYXlzIGluIHRoZSBgdGhpcy5fX2dlbmVyYXRlZE1hcHBpbmdzYCBhbmRcbiAqIGB0aGlzLl9fb3JpZ2luYWxNYXBwaW5nc2AgcHJvcGVydGllcykuXG4gKi9cblNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5fcGFyc2VNYXBwaW5ncyA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcENvbnN1bWVyX3BhcnNlTWFwcGluZ3MoYVN0ciwgYVNvdXJjZVJvb3QpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJTdWJjbGFzc2VzIG11c3QgaW1wbGVtZW50IF9wYXJzZU1hcHBpbmdzXCIpO1xuICB9O1xuXG5Tb3VyY2VNYXBDb25zdW1lci5HRU5FUkFURURfT1JERVIgPSAxO1xuU291cmNlTWFwQ29uc3VtZXIuT1JJR0lOQUxfT1JERVIgPSAyO1xuXG5Tb3VyY2VNYXBDb25zdW1lci5HUkVBVEVTVF9MT1dFUl9CT1VORCA9IDE7XG5Tb3VyY2VNYXBDb25zdW1lci5MRUFTVF9VUFBFUl9CT1VORCA9IDI7XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGVhY2ggbWFwcGluZyBiZXR3ZWVuIGFuIG9yaWdpbmFsIHNvdXJjZS9saW5lL2NvbHVtbiBhbmQgYVxuICogZ2VuZXJhdGVkIGxpbmUvY29sdW1uIGluIHRoaXMgc291cmNlIG1hcC5cbiAqXG4gKiBAcGFyYW0gRnVuY3Rpb24gYUNhbGxiYWNrXG4gKiAgICAgICAgVGhlIGZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIHdpdGggZWFjaCBtYXBwaW5nLlxuICogQHBhcmFtIE9iamVjdCBhQ29udGV4dFxuICogICAgICAgIE9wdGlvbmFsLiBJZiBzcGVjaWZpZWQsIHRoaXMgb2JqZWN0IHdpbGwgYmUgdGhlIHZhbHVlIG9mIGB0aGlzYCBldmVyeVxuICogICAgICAgIHRpbWUgdGhhdCBgYUNhbGxiYWNrYCBpcyBjYWxsZWQuXG4gKiBAcGFyYW0gYU9yZGVyXG4gKiAgICAgICAgRWl0aGVyIGBTb3VyY2VNYXBDb25zdW1lci5HRU5FUkFURURfT1JERVJgIG9yXG4gKiAgICAgICAgYFNvdXJjZU1hcENvbnN1bWVyLk9SSUdJTkFMX09SREVSYC4gU3BlY2lmaWVzIHdoZXRoZXIgeW91IHdhbnQgdG9cbiAqICAgICAgICBpdGVyYXRlIG92ZXIgdGhlIG1hcHBpbmdzIHNvcnRlZCBieSB0aGUgZ2VuZXJhdGVkIGZpbGUncyBsaW5lL2NvbHVtblxuICogICAgICAgIG9yZGVyIG9yIHRoZSBvcmlnaW5hbCdzIHNvdXJjZS9saW5lL2NvbHVtbiBvcmRlciwgcmVzcGVjdGl2ZWx5LiBEZWZhdWx0cyB0b1xuICogICAgICAgIGBTb3VyY2VNYXBDb25zdW1lci5HRU5FUkFURURfT1JERVJgLlxuICovXG5Tb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuZWFjaE1hcHBpbmcgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBDb25zdW1lcl9lYWNoTWFwcGluZyhhQ2FsbGJhY2ssIGFDb250ZXh0LCBhT3JkZXIpIHtcbiAgICB2YXIgY29udGV4dCA9IGFDb250ZXh0IHx8IG51bGw7XG4gICAgdmFyIG9yZGVyID0gYU9yZGVyIHx8IFNvdXJjZU1hcENvbnN1bWVyLkdFTkVSQVRFRF9PUkRFUjtcblxuICAgIHZhciBtYXBwaW5ncztcbiAgICBzd2l0Y2ggKG9yZGVyKSB7XG4gICAgY2FzZSBTb3VyY2VNYXBDb25zdW1lci5HRU5FUkFURURfT1JERVI6XG4gICAgICBtYXBwaW5ncyA9IHRoaXMuX2dlbmVyYXRlZE1hcHBpbmdzO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBTb3VyY2VNYXBDb25zdW1lci5PUklHSU5BTF9PUkRFUjpcbiAgICAgIG1hcHBpbmdzID0gdGhpcy5fb3JpZ2luYWxNYXBwaW5ncztcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIG9yZGVyIG9mIGl0ZXJhdGlvbi5cIik7XG4gICAgfVxuXG4gICAgdmFyIHNvdXJjZVJvb3QgPSB0aGlzLnNvdXJjZVJvb3Q7XG4gICAgbWFwcGluZ3MubWFwKGZ1bmN0aW9uIChtYXBwaW5nKSB7XG4gICAgICB2YXIgc291cmNlID0gbWFwcGluZy5zb3VyY2UgPT09IG51bGwgPyBudWxsIDogdGhpcy5fc291cmNlcy5hdChtYXBwaW5nLnNvdXJjZSk7XG4gICAgICBzb3VyY2UgPSB1dGlsLmNvbXB1dGVTb3VyY2VVUkwoc291cmNlUm9vdCwgc291cmNlLCB0aGlzLl9zb3VyY2VNYXBVUkwpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc291cmNlOiBzb3VyY2UsXG4gICAgICAgIGdlbmVyYXRlZExpbmU6IG1hcHBpbmcuZ2VuZXJhdGVkTGluZSxcbiAgICAgICAgZ2VuZXJhdGVkQ29sdW1uOiBtYXBwaW5nLmdlbmVyYXRlZENvbHVtbixcbiAgICAgICAgb3JpZ2luYWxMaW5lOiBtYXBwaW5nLm9yaWdpbmFsTGluZSxcbiAgICAgICAgb3JpZ2luYWxDb2x1bW46IG1hcHBpbmcub3JpZ2luYWxDb2x1bW4sXG4gICAgICAgIG5hbWU6IG1hcHBpbmcubmFtZSA9PT0gbnVsbCA/IG51bGwgOiB0aGlzLl9uYW1lcy5hdChtYXBwaW5nLm5hbWUpXG4gICAgICB9O1xuICAgIH0sIHRoaXMpLmZvckVhY2goYUNhbGxiYWNrLCBjb250ZXh0KTtcbiAgfTtcblxuLyoqXG4gKiBSZXR1cm5zIGFsbCBnZW5lcmF0ZWQgbGluZSBhbmQgY29sdW1uIGluZm9ybWF0aW9uIGZvciB0aGUgb3JpZ2luYWwgc291cmNlLFxuICogbGluZSwgYW5kIGNvbHVtbiBwcm92aWRlZC4gSWYgbm8gY29sdW1uIGlzIHByb3ZpZGVkLCByZXR1cm5zIGFsbCBtYXBwaW5nc1xuICogY29ycmVzcG9uZGluZyB0byBhIGVpdGhlciB0aGUgbGluZSB3ZSBhcmUgc2VhcmNoaW5nIGZvciBvciB0aGUgbmV4dFxuICogY2xvc2VzdCBsaW5lIHRoYXQgaGFzIGFueSBtYXBwaW5ncy4gT3RoZXJ3aXNlLCByZXR1cm5zIGFsbCBtYXBwaW5nc1xuICogY29ycmVzcG9uZGluZyB0byB0aGUgZ2l2ZW4gbGluZSBhbmQgZWl0aGVyIHRoZSBjb2x1bW4gd2UgYXJlIHNlYXJjaGluZyBmb3JcbiAqIG9yIHRoZSBuZXh0IGNsb3Nlc3QgY29sdW1uIHRoYXQgaGFzIGFueSBvZmZzZXRzLlxuICpcbiAqIFRoZSBvbmx5IGFyZ3VtZW50IGlzIGFuIG9iamVjdCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gc291cmNlOiBUaGUgZmlsZW5hbWUgb2YgdGhlIG9yaWdpbmFsIHNvdXJjZS5cbiAqICAgLSBsaW5lOiBUaGUgbGluZSBudW1iZXIgaW4gdGhlIG9yaWdpbmFsIHNvdXJjZS4gIFRoZSBsaW5lIG51bWJlciBpcyAxLWJhc2VkLlxuICogICAtIGNvbHVtbjogT3B0aW9uYWwuIHRoZSBjb2x1bW4gbnVtYmVyIGluIHRoZSBvcmlnaW5hbCBzb3VyY2UuXG4gKiAgICBUaGUgY29sdW1uIG51bWJlciBpcyAwLWJhc2VkLlxuICpcbiAqIGFuZCBhbiBhcnJheSBvZiBvYmplY3RzIGlzIHJldHVybmVkLCBlYWNoIHdpdGggdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICpcbiAqICAgLSBsaW5lOiBUaGUgbGluZSBudW1iZXIgaW4gdGhlIGdlbmVyYXRlZCBzb3VyY2UsIG9yIG51bGwuICBUaGVcbiAqICAgIGxpbmUgbnVtYmVyIGlzIDEtYmFzZWQuXG4gKiAgIC0gY29sdW1uOiBUaGUgY29sdW1uIG51bWJlciBpbiB0aGUgZ2VuZXJhdGVkIHNvdXJjZSwgb3IgbnVsbC5cbiAqICAgIFRoZSBjb2x1bW4gbnVtYmVyIGlzIDAtYmFzZWQuXG4gKi9cblNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5hbGxHZW5lcmF0ZWRQb3NpdGlvbnNGb3IgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBDb25zdW1lcl9hbGxHZW5lcmF0ZWRQb3NpdGlvbnNGb3IoYUFyZ3MpIHtcbiAgICB2YXIgbGluZSA9IHV0aWwuZ2V0QXJnKGFBcmdzLCAnbGluZScpO1xuXG4gICAgLy8gV2hlbiB0aGVyZSBpcyBubyBleGFjdCBtYXRjaCwgQmFzaWNTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuX2ZpbmRNYXBwaW5nXG4gICAgLy8gcmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGNsb3Nlc3QgbWFwcGluZyBsZXNzIHRoYW4gdGhlIG5lZWRsZS4gQnlcbiAgICAvLyBzZXR0aW5nIG5lZWRsZS5vcmlnaW5hbENvbHVtbiB0byAwLCB3ZSB0aHVzIGZpbmQgdGhlIGxhc3QgbWFwcGluZyBmb3JcbiAgICAvLyB0aGUgZ2l2ZW4gbGluZSwgcHJvdmlkZWQgc3VjaCBhIG1hcHBpbmcgZXhpc3RzLlxuICAgIHZhciBuZWVkbGUgPSB7XG4gICAgICBzb3VyY2U6IHV0aWwuZ2V0QXJnKGFBcmdzLCAnc291cmNlJyksXG4gICAgICBvcmlnaW5hbExpbmU6IGxpbmUsXG4gICAgICBvcmlnaW5hbENvbHVtbjogdXRpbC5nZXRBcmcoYUFyZ3MsICdjb2x1bW4nLCAwKVxuICAgIH07XG5cbiAgICBuZWVkbGUuc291cmNlID0gdGhpcy5fZmluZFNvdXJjZUluZGV4KG5lZWRsZS5zb3VyY2UpO1xuICAgIGlmIChuZWVkbGUuc291cmNlIDwgMCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIHZhciBtYXBwaW5ncyA9IFtdO1xuXG4gICAgdmFyIGluZGV4ID0gdGhpcy5fZmluZE1hcHBpbmcobmVlZGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX29yaWdpbmFsTWFwcGluZ3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJvcmlnaW5hbExpbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm9yaWdpbmFsQ29sdW1uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXRpbC5jb21wYXJlQnlPcmlnaW5hbFBvc2l0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5hcnlTZWFyY2guTEVBU1RfVVBQRVJfQk9VTkQpO1xuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICB2YXIgbWFwcGluZyA9IHRoaXMuX29yaWdpbmFsTWFwcGluZ3NbaW5kZXhdO1xuXG4gICAgICBpZiAoYUFyZ3MuY29sdW1uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdmFyIG9yaWdpbmFsTGluZSA9IG1hcHBpbmcub3JpZ2luYWxMaW5lO1xuXG4gICAgICAgIC8vIEl0ZXJhdGUgdW50aWwgZWl0aGVyIHdlIHJ1biBvdXQgb2YgbWFwcGluZ3MsIG9yIHdlIHJ1biBpbnRvXG4gICAgICAgIC8vIGEgbWFwcGluZyBmb3IgYSBkaWZmZXJlbnQgbGluZSB0aGFuIHRoZSBvbmUgd2UgZm91bmQuIFNpbmNlXG4gICAgICAgIC8vIG1hcHBpbmdzIGFyZSBzb3J0ZWQsIHRoaXMgaXMgZ3VhcmFudGVlZCB0byBmaW5kIGFsbCBtYXBwaW5ncyBmb3JcbiAgICAgICAgLy8gdGhlIGxpbmUgd2UgZm91bmQuXG4gICAgICAgIHdoaWxlIChtYXBwaW5nICYmIG1hcHBpbmcub3JpZ2luYWxMaW5lID09PSBvcmlnaW5hbExpbmUpIHtcbiAgICAgICAgICBtYXBwaW5ncy5wdXNoKHtcbiAgICAgICAgICAgIGxpbmU6IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICdnZW5lcmF0ZWRMaW5lJywgbnVsbCksXG4gICAgICAgICAgICBjb2x1bW46IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICdnZW5lcmF0ZWRDb2x1bW4nLCBudWxsKSxcbiAgICAgICAgICAgIGxhc3RDb2x1bW46IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICdsYXN0R2VuZXJhdGVkQ29sdW1uJywgbnVsbClcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIG1hcHBpbmcgPSB0aGlzLl9vcmlnaW5hbE1hcHBpbmdzWysraW5kZXhdO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgb3JpZ2luYWxDb2x1bW4gPSBtYXBwaW5nLm9yaWdpbmFsQ29sdW1uO1xuXG4gICAgICAgIC8vIEl0ZXJhdGUgdW50aWwgZWl0aGVyIHdlIHJ1biBvdXQgb2YgbWFwcGluZ3MsIG9yIHdlIHJ1biBpbnRvXG4gICAgICAgIC8vIGEgbWFwcGluZyBmb3IgYSBkaWZmZXJlbnQgbGluZSB0aGFuIHRoZSBvbmUgd2Ugd2VyZSBzZWFyY2hpbmcgZm9yLlxuICAgICAgICAvLyBTaW5jZSBtYXBwaW5ncyBhcmUgc29ydGVkLCB0aGlzIGlzIGd1YXJhbnRlZWQgdG8gZmluZCBhbGwgbWFwcGluZ3MgZm9yXG4gICAgICAgIC8vIHRoZSBsaW5lIHdlIGFyZSBzZWFyY2hpbmcgZm9yLlxuICAgICAgICB3aGlsZSAobWFwcGluZyAmJlxuICAgICAgICAgICAgICAgbWFwcGluZy5vcmlnaW5hbExpbmUgPT09IGxpbmUgJiZcbiAgICAgICAgICAgICAgIG1hcHBpbmcub3JpZ2luYWxDb2x1bW4gPT0gb3JpZ2luYWxDb2x1bW4pIHtcbiAgICAgICAgICBtYXBwaW5ncy5wdXNoKHtcbiAgICAgICAgICAgIGxpbmU6IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICdnZW5lcmF0ZWRMaW5lJywgbnVsbCksXG4gICAgICAgICAgICBjb2x1bW46IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICdnZW5lcmF0ZWRDb2x1bW4nLCBudWxsKSxcbiAgICAgICAgICAgIGxhc3RDb2x1bW46IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICdsYXN0R2VuZXJhdGVkQ29sdW1uJywgbnVsbClcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIG1hcHBpbmcgPSB0aGlzLl9vcmlnaW5hbE1hcHBpbmdzWysraW5kZXhdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG1hcHBpbmdzO1xuICB9O1xuXG5leHBvcnRzLlNvdXJjZU1hcENvbnN1bWVyID0gU291cmNlTWFwQ29uc3VtZXI7XG5cbi8qKlxuICogQSBCYXNpY1NvdXJjZU1hcENvbnN1bWVyIGluc3RhbmNlIHJlcHJlc2VudHMgYSBwYXJzZWQgc291cmNlIG1hcCB3aGljaCB3ZSBjYW5cbiAqIHF1ZXJ5IGZvciBpbmZvcm1hdGlvbiBhYm91dCB0aGUgb3JpZ2luYWwgZmlsZSBwb3NpdGlvbnMgYnkgZ2l2aW5nIGl0IGEgZmlsZVxuICogcG9zaXRpb24gaW4gdGhlIGdlbmVyYXRlZCBzb3VyY2UuXG4gKlxuICogVGhlIGZpcnN0IHBhcmFtZXRlciBpcyB0aGUgcmF3IHNvdXJjZSBtYXAgKGVpdGhlciBhcyBhIEpTT04gc3RyaW5nLCBvclxuICogYWxyZWFkeSBwYXJzZWQgdG8gYW4gb2JqZWN0KS4gQWNjb3JkaW5nIHRvIHRoZSBzcGVjLCBzb3VyY2UgbWFwcyBoYXZlIHRoZVxuICogZm9sbG93aW5nIGF0dHJpYnV0ZXM6XG4gKlxuICogICAtIHZlcnNpb246IFdoaWNoIHZlcnNpb24gb2YgdGhlIHNvdXJjZSBtYXAgc3BlYyB0aGlzIG1hcCBpcyBmb2xsb3dpbmcuXG4gKiAgIC0gc291cmNlczogQW4gYXJyYXkgb2YgVVJMcyB0byB0aGUgb3JpZ2luYWwgc291cmNlIGZpbGVzLlxuICogICAtIG5hbWVzOiBBbiBhcnJheSBvZiBpZGVudGlmaWVycyB3aGljaCBjYW4gYmUgcmVmZXJyZW5jZWQgYnkgaW5kaXZpZHVhbCBtYXBwaW5ncy5cbiAqICAgLSBzb3VyY2VSb290OiBPcHRpb25hbC4gVGhlIFVSTCByb290IGZyb20gd2hpY2ggYWxsIHNvdXJjZXMgYXJlIHJlbGF0aXZlLlxuICogICAtIHNvdXJjZXNDb250ZW50OiBPcHRpb25hbC4gQW4gYXJyYXkgb2YgY29udGVudHMgb2YgdGhlIG9yaWdpbmFsIHNvdXJjZSBmaWxlcy5cbiAqICAgLSBtYXBwaW5nczogQSBzdHJpbmcgb2YgYmFzZTY0IFZMUXMgd2hpY2ggY29udGFpbiB0aGUgYWN0dWFsIG1hcHBpbmdzLlxuICogICAtIGZpbGU6IE9wdGlvbmFsLiBUaGUgZ2VuZXJhdGVkIGZpbGUgdGhpcyBzb3VyY2UgbWFwIGlzIGFzc29jaWF0ZWQgd2l0aC5cbiAqXG4gKiBIZXJlIGlzIGFuIGV4YW1wbGUgc291cmNlIG1hcCwgdGFrZW4gZnJvbSB0aGUgc291cmNlIG1hcCBzcGVjWzBdOlxuICpcbiAqICAgICB7XG4gKiAgICAgICB2ZXJzaW9uIDogMyxcbiAqICAgICAgIGZpbGU6IFwib3V0LmpzXCIsXG4gKiAgICAgICBzb3VyY2VSb290IDogXCJcIixcbiAqICAgICAgIHNvdXJjZXM6IFtcImZvby5qc1wiLCBcImJhci5qc1wiXSxcbiAqICAgICAgIG5hbWVzOiBbXCJzcmNcIiwgXCJtYXBzXCIsIFwiYXJlXCIsIFwiZnVuXCJdLFxuICogICAgICAgbWFwcGluZ3M6IFwiQUEsQUI7O0FCQ0RFO1wiXG4gKiAgICAgfVxuICpcbiAqIFRoZSBzZWNvbmQgcGFyYW1ldGVyLCBpZiBnaXZlbiwgaXMgYSBzdHJpbmcgd2hvc2UgdmFsdWUgaXMgdGhlIFVSTFxuICogYXQgd2hpY2ggdGhlIHNvdXJjZSBtYXAgd2FzIGZvdW5kLiAgVGhpcyBVUkwgaXMgdXNlZCB0byBjb21wdXRlIHRoZVxuICogc291cmNlcyBhcnJheS5cbiAqXG4gKiBbMF06IGh0dHBzOi8vZG9jcy5nb29nbGUuY29tL2RvY3VtZW50L2QvMVUxUkdBZWhRd1J5cFVUb3ZGMUtSbHBpT0Z6ZTBiLV8yZ2M2ZkFIMEtZMGsvZWRpdD9wbGk9MSNcbiAqL1xuZnVuY3Rpb24gQmFzaWNTb3VyY2VNYXBDb25zdW1lcihhU291cmNlTWFwLCBhU291cmNlTWFwVVJMKSB7XG4gIHZhciBzb3VyY2VNYXAgPSBhU291cmNlTWFwO1xuICBpZiAodHlwZW9mIGFTb3VyY2VNYXAgPT09ICdzdHJpbmcnKSB7XG4gICAgc291cmNlTWFwID0gdXRpbC5wYXJzZVNvdXJjZU1hcElucHV0KGFTb3VyY2VNYXApO1xuICB9XG5cbiAgdmFyIHZlcnNpb24gPSB1dGlsLmdldEFyZyhzb3VyY2VNYXAsICd2ZXJzaW9uJyk7XG4gIHZhciBzb3VyY2VzID0gdXRpbC5nZXRBcmcoc291cmNlTWFwLCAnc291cmNlcycpO1xuICAvLyBTYXNzIDMuMyBsZWF2ZXMgb3V0IHRoZSAnbmFtZXMnIGFycmF5LCBzbyB3ZSBkZXZpYXRlIGZyb20gdGhlIHNwZWMgKHdoaWNoXG4gIC8vIHJlcXVpcmVzIHRoZSBhcnJheSkgdG8gcGxheSBuaWNlIGhlcmUuXG4gIHZhciBuYW1lcyA9IHV0aWwuZ2V0QXJnKHNvdXJjZU1hcCwgJ25hbWVzJywgW10pO1xuICB2YXIgc291cmNlUm9vdCA9IHV0aWwuZ2V0QXJnKHNvdXJjZU1hcCwgJ3NvdXJjZVJvb3QnLCBudWxsKTtcbiAgdmFyIHNvdXJjZXNDb250ZW50ID0gdXRpbC5nZXRBcmcoc291cmNlTWFwLCAnc291cmNlc0NvbnRlbnQnLCBudWxsKTtcbiAgdmFyIG1hcHBpbmdzID0gdXRpbC5nZXRBcmcoc291cmNlTWFwLCAnbWFwcGluZ3MnKTtcbiAgdmFyIGZpbGUgPSB1dGlsLmdldEFyZyhzb3VyY2VNYXAsICdmaWxlJywgbnVsbCk7XG5cbiAgLy8gT25jZSBhZ2FpbiwgU2FzcyBkZXZpYXRlcyBmcm9tIHRoZSBzcGVjIGFuZCBzdXBwbGllcyB0aGUgdmVyc2lvbiBhcyBhXG4gIC8vIHN0cmluZyByYXRoZXIgdGhhbiBhIG51bWJlciwgc28gd2UgdXNlIGxvb3NlIGVxdWFsaXR5IGNoZWNraW5nIGhlcmUuXG4gIGlmICh2ZXJzaW9uICE9IHRoaXMuX3ZlcnNpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIHZlcnNpb246ICcgKyB2ZXJzaW9uKTtcbiAgfVxuXG4gIGlmIChzb3VyY2VSb290KSB7XG4gICAgc291cmNlUm9vdCA9IHV0aWwubm9ybWFsaXplKHNvdXJjZVJvb3QpO1xuICB9XG5cbiAgc291cmNlcyA9IHNvdXJjZXNcbiAgICAubWFwKFN0cmluZylcbiAgICAvLyBTb21lIHNvdXJjZSBtYXBzIHByb2R1Y2UgcmVsYXRpdmUgc291cmNlIHBhdGhzIGxpa2UgXCIuL2Zvby5qc1wiIGluc3RlYWQgb2ZcbiAgICAvLyBcImZvby5qc1wiLiAgTm9ybWFsaXplIHRoZXNlIGZpcnN0IHNvIHRoYXQgZnV0dXJlIGNvbXBhcmlzb25zIHdpbGwgc3VjY2VlZC5cbiAgICAvLyBTZWUgYnVnemlsLmxhLzEwOTA3NjguXG4gICAgLm1hcCh1dGlsLm5vcm1hbGl6ZSlcbiAgICAvLyBBbHdheXMgZW5zdXJlIHRoYXQgYWJzb2x1dGUgc291cmNlcyBhcmUgaW50ZXJuYWxseSBzdG9yZWQgcmVsYXRpdmUgdG9cbiAgICAvLyB0aGUgc291cmNlIHJvb3QsIGlmIHRoZSBzb3VyY2Ugcm9vdCBpcyBhYnNvbHV0ZS4gTm90IGRvaW5nIHRoaXMgd291bGRcbiAgICAvLyBiZSBwYXJ0aWN1bGFybHkgcHJvYmxlbWF0aWMgd2hlbiB0aGUgc291cmNlIHJvb3QgaXMgYSBwcmVmaXggb2YgdGhlXG4gICAgLy8gc291cmNlICh2YWxpZCwgYnV0IHdoeT8/KS4gU2VlIGdpdGh1YiBpc3N1ZSAjMTk5IGFuZCBidWd6aWwubGEvMTE4ODk4Mi5cbiAgICAubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICAgIHJldHVybiBzb3VyY2VSb290ICYmIHV0aWwuaXNBYnNvbHV0ZShzb3VyY2VSb290KSAmJiB1dGlsLmlzQWJzb2x1dGUoc291cmNlKVxuICAgICAgICA/IHV0aWwucmVsYXRpdmUoc291cmNlUm9vdCwgc291cmNlKVxuICAgICAgICA6IHNvdXJjZTtcbiAgICB9KTtcblxuICAvLyBQYXNzIGB0cnVlYCBiZWxvdyB0byBhbGxvdyBkdXBsaWNhdGUgbmFtZXMgYW5kIHNvdXJjZXMuIFdoaWxlIHNvdXJjZSBtYXBzXG4gIC8vIGFyZSBpbnRlbmRlZCB0byBiZSBjb21wcmVzc2VkIGFuZCBkZWR1cGxpY2F0ZWQsIHRoZSBUeXBlU2NyaXB0IGNvbXBpbGVyXG4gIC8vIHNvbWV0aW1lcyBnZW5lcmF0ZXMgc291cmNlIG1hcHMgd2l0aCBkdXBsaWNhdGVzIGluIHRoZW0uIFNlZSBHaXRodWIgaXNzdWVcbiAgLy8gIzcyIGFuZCBidWd6aWwubGEvODg5NDkyLlxuICB0aGlzLl9uYW1lcyA9IEFycmF5U2V0LmZyb21BcnJheShuYW1lcy5tYXAoU3RyaW5nKSwgdHJ1ZSk7XG4gIHRoaXMuX3NvdXJjZXMgPSBBcnJheVNldC5mcm9tQXJyYXkoc291cmNlcywgdHJ1ZSk7XG5cbiAgdGhpcy5fYWJzb2x1dGVTb3VyY2VzID0gdGhpcy5fc291cmNlcy50b0FycmF5KCkubWFwKGZ1bmN0aW9uIChzKSB7XG4gICAgcmV0dXJuIHV0aWwuY29tcHV0ZVNvdXJjZVVSTChzb3VyY2VSb290LCBzLCBhU291cmNlTWFwVVJMKTtcbiAgfSk7XG5cbiAgdGhpcy5zb3VyY2VSb290ID0gc291cmNlUm9vdDtcbiAgdGhpcy5zb3VyY2VzQ29udGVudCA9IHNvdXJjZXNDb250ZW50O1xuICB0aGlzLl9tYXBwaW5ncyA9IG1hcHBpbmdzO1xuICB0aGlzLl9zb3VyY2VNYXBVUkwgPSBhU291cmNlTWFwVVJMO1xuICB0aGlzLmZpbGUgPSBmaWxlO1xufVxuXG5CYXNpY1NvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlKTtcbkJhc2ljU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLmNvbnN1bWVyID0gU291cmNlTWFwQ29uc3VtZXI7XG5cbi8qKlxuICogVXRpbGl0eSBmdW5jdGlvbiB0byBmaW5kIHRoZSBpbmRleCBvZiBhIHNvdXJjZS4gIFJldHVybnMgLTEgaWYgbm90XG4gKiBmb3VuZC5cbiAqL1xuQmFzaWNTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuX2ZpbmRTb3VyY2VJbmRleCA9IGZ1bmN0aW9uKGFTb3VyY2UpIHtcbiAgdmFyIHJlbGF0aXZlU291cmNlID0gYVNvdXJjZTtcbiAgaWYgKHRoaXMuc291cmNlUm9vdCAhPSBudWxsKSB7XG4gICAgcmVsYXRpdmVTb3VyY2UgPSB1dGlsLnJlbGF0aXZlKHRoaXMuc291cmNlUm9vdCwgcmVsYXRpdmVTb3VyY2UpO1xuICB9XG5cbiAgaWYgKHRoaXMuX3NvdXJjZXMuaGFzKHJlbGF0aXZlU291cmNlKSkge1xuICAgIHJldHVybiB0aGlzLl9zb3VyY2VzLmluZGV4T2YocmVsYXRpdmVTb3VyY2UpO1xuICB9XG5cbiAgLy8gTWF5YmUgYVNvdXJjZSBpcyBhbiBhYnNvbHV0ZSBVUkwgYXMgcmV0dXJuZWQgYnkgfHNvdXJjZXN8LiAgSW5cbiAgLy8gdGhpcyBjYXNlIHdlIGNhbid0IHNpbXBseSB1bmRvIHRoZSB0cmFuc2Zvcm0uXG4gIHZhciBpO1xuICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5fYWJzb2x1dGVTb3VyY2VzLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKHRoaXMuX2Fic29sdXRlU291cmNlc1tpXSA9PSBhU291cmNlKSB7XG4gICAgICByZXR1cm4gaTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gLTE7XG59O1xuXG4vKipcbiAqIENyZWF0ZSBhIEJhc2ljU291cmNlTWFwQ29uc3VtZXIgZnJvbSBhIFNvdXJjZU1hcEdlbmVyYXRvci5cbiAqXG4gKiBAcGFyYW0gU291cmNlTWFwR2VuZXJhdG9yIGFTb3VyY2VNYXBcbiAqICAgICAgICBUaGUgc291cmNlIG1hcCB0aGF0IHdpbGwgYmUgY29uc3VtZWQuXG4gKiBAcGFyYW0gU3RyaW5nIGFTb3VyY2VNYXBVUkxcbiAqICAgICAgICBUaGUgVVJMIGF0IHdoaWNoIHRoZSBzb3VyY2UgbWFwIGNhbiBiZSBmb3VuZCAob3B0aW9uYWwpXG4gKiBAcmV0dXJucyBCYXNpY1NvdXJjZU1hcENvbnN1bWVyXG4gKi9cbkJhc2ljU291cmNlTWFwQ29uc3VtZXIuZnJvbVNvdXJjZU1hcCA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcENvbnN1bWVyX2Zyb21Tb3VyY2VNYXAoYVNvdXJjZU1hcCwgYVNvdXJjZU1hcFVSTCkge1xuICAgIHZhciBzbWMgPSBPYmplY3QuY3JlYXRlKEJhc2ljU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlKTtcblxuICAgIHZhciBuYW1lcyA9IHNtYy5fbmFtZXMgPSBBcnJheVNldC5mcm9tQXJyYXkoYVNvdXJjZU1hcC5fbmFtZXMudG9BcnJheSgpLCB0cnVlKTtcbiAgICB2YXIgc291cmNlcyA9IHNtYy5fc291cmNlcyA9IEFycmF5U2V0LmZyb21BcnJheShhU291cmNlTWFwLl9zb3VyY2VzLnRvQXJyYXkoKSwgdHJ1ZSk7XG4gICAgc21jLnNvdXJjZVJvb3QgPSBhU291cmNlTWFwLl9zb3VyY2VSb290O1xuICAgIHNtYy5zb3VyY2VzQ29udGVudCA9IGFTb3VyY2VNYXAuX2dlbmVyYXRlU291cmNlc0NvbnRlbnQoc21jLl9zb3VyY2VzLnRvQXJyYXkoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNtYy5zb3VyY2VSb290KTtcbiAgICBzbWMuZmlsZSA9IGFTb3VyY2VNYXAuX2ZpbGU7XG4gICAgc21jLl9zb3VyY2VNYXBVUkwgPSBhU291cmNlTWFwVVJMO1xuICAgIHNtYy5fYWJzb2x1dGVTb3VyY2VzID0gc21jLl9zb3VyY2VzLnRvQXJyYXkoKS5tYXAoZnVuY3Rpb24gKHMpIHtcbiAgICAgIHJldHVybiB1dGlsLmNvbXB1dGVTb3VyY2VVUkwoc21jLnNvdXJjZVJvb3QsIHMsIGFTb3VyY2VNYXBVUkwpO1xuICAgIH0pO1xuXG4gICAgLy8gQmVjYXVzZSB3ZSBhcmUgbW9kaWZ5aW5nIHRoZSBlbnRyaWVzIChieSBjb252ZXJ0aW5nIHN0cmluZyBzb3VyY2VzIGFuZFxuICAgIC8vIG5hbWVzIHRvIGluZGljZXMgaW50byB0aGUgc291cmNlcyBhbmQgbmFtZXMgQXJyYXlTZXRzKSwgd2UgaGF2ZSB0byBtYWtlXG4gICAgLy8gYSBjb3B5IG9mIHRoZSBlbnRyeSBvciBlbHNlIGJhZCB0aGluZ3MgaGFwcGVuLiBTaGFyZWQgbXV0YWJsZSBzdGF0ZVxuICAgIC8vIHN0cmlrZXMgYWdhaW4hIFNlZSBnaXRodWIgaXNzdWUgIzE5MS5cblxuICAgIHZhciBnZW5lcmF0ZWRNYXBwaW5ncyA9IGFTb3VyY2VNYXAuX21hcHBpbmdzLnRvQXJyYXkoKS5zbGljZSgpO1xuICAgIHZhciBkZXN0R2VuZXJhdGVkTWFwcGluZ3MgPSBzbWMuX19nZW5lcmF0ZWRNYXBwaW5ncyA9IFtdO1xuICAgIHZhciBkZXN0T3JpZ2luYWxNYXBwaW5ncyA9IHNtYy5fX29yaWdpbmFsTWFwcGluZ3MgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBnZW5lcmF0ZWRNYXBwaW5ncy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNyY01hcHBpbmcgPSBnZW5lcmF0ZWRNYXBwaW5nc1tpXTtcbiAgICAgIHZhciBkZXN0TWFwcGluZyA9IG5ldyBNYXBwaW5nO1xuICAgICAgZGVzdE1hcHBpbmcuZ2VuZXJhdGVkTGluZSA9IHNyY01hcHBpbmcuZ2VuZXJhdGVkTGluZTtcbiAgICAgIGRlc3RNYXBwaW5nLmdlbmVyYXRlZENvbHVtbiA9IHNyY01hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uO1xuXG4gICAgICBpZiAoc3JjTWFwcGluZy5zb3VyY2UpIHtcbiAgICAgICAgZGVzdE1hcHBpbmcuc291cmNlID0gc291cmNlcy5pbmRleE9mKHNyY01hcHBpbmcuc291cmNlKTtcbiAgICAgICAgZGVzdE1hcHBpbmcub3JpZ2luYWxMaW5lID0gc3JjTWFwcGluZy5vcmlnaW5hbExpbmU7XG4gICAgICAgIGRlc3RNYXBwaW5nLm9yaWdpbmFsQ29sdW1uID0gc3JjTWFwcGluZy5vcmlnaW5hbENvbHVtbjtcblxuICAgICAgICBpZiAoc3JjTWFwcGluZy5uYW1lKSB7XG4gICAgICAgICAgZGVzdE1hcHBpbmcubmFtZSA9IG5hbWVzLmluZGV4T2Yoc3JjTWFwcGluZy5uYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlc3RPcmlnaW5hbE1hcHBpbmdzLnB1c2goZGVzdE1hcHBpbmcpO1xuICAgICAgfVxuXG4gICAgICBkZXN0R2VuZXJhdGVkTWFwcGluZ3MucHVzaChkZXN0TWFwcGluZyk7XG4gICAgfVxuXG4gICAgcXVpY2tTb3J0KHNtYy5fX29yaWdpbmFsTWFwcGluZ3MsIHV0aWwuY29tcGFyZUJ5T3JpZ2luYWxQb3NpdGlvbnMpO1xuXG4gICAgcmV0dXJuIHNtYztcbiAgfTtcblxuLyoqXG4gKiBUaGUgdmVyc2lvbiBvZiB0aGUgc291cmNlIG1hcHBpbmcgc3BlYyB0aGF0IHdlIGFyZSBjb25zdW1pbmcuXG4gKi9cbkJhc2ljU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLl92ZXJzaW9uID0gMztcblxuLyoqXG4gKiBUaGUgbGlzdCBvZiBvcmlnaW5hbCBzb3VyY2VzLlxuICovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoQmFzaWNTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUsICdzb3VyY2VzJywge1xuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fYWJzb2x1dGVTb3VyY2VzLnNsaWNlKCk7XG4gIH1cbn0pO1xuXG4vKipcbiAqIFByb3ZpZGUgdGhlIEpJVCB3aXRoIGEgbmljZSBzaGFwZSAvIGhpZGRlbiBjbGFzcy5cbiAqL1xuZnVuY3Rpb24gTWFwcGluZygpIHtcbiAgdGhpcy5nZW5lcmF0ZWRMaW5lID0gMDtcbiAgdGhpcy5nZW5lcmF0ZWRDb2x1bW4gPSAwO1xuICB0aGlzLnNvdXJjZSA9IG51bGw7XG4gIHRoaXMub3JpZ2luYWxMaW5lID0gbnVsbDtcbiAgdGhpcy5vcmlnaW5hbENvbHVtbiA9IG51bGw7XG4gIHRoaXMubmFtZSA9IG51bGw7XG59XG5cbi8qKlxuICogUGFyc2UgdGhlIG1hcHBpbmdzIGluIGEgc3RyaW5nIGluIHRvIGEgZGF0YSBzdHJ1Y3R1cmUgd2hpY2ggd2UgY2FuIGVhc2lseVxuICogcXVlcnkgKHRoZSBvcmRlcmVkIGFycmF5cyBpbiB0aGUgYHRoaXMuX19nZW5lcmF0ZWRNYXBwaW5nc2AgYW5kXG4gKiBgdGhpcy5fX29yaWdpbmFsTWFwcGluZ3NgIHByb3BlcnRpZXMpLlxuICovXG5CYXNpY1NvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5fcGFyc2VNYXBwaW5ncyA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcENvbnN1bWVyX3BhcnNlTWFwcGluZ3MoYVN0ciwgYVNvdXJjZVJvb3QpIHtcbiAgICB2YXIgZ2VuZXJhdGVkTGluZSA9IDE7XG4gICAgdmFyIHByZXZpb3VzR2VuZXJhdGVkQ29sdW1uID0gMDtcbiAgICB2YXIgcHJldmlvdXNPcmlnaW5hbExpbmUgPSAwO1xuICAgIHZhciBwcmV2aW91c09yaWdpbmFsQ29sdW1uID0gMDtcbiAgICB2YXIgcHJldmlvdXNTb3VyY2UgPSAwO1xuICAgIHZhciBwcmV2aW91c05hbWUgPSAwO1xuICAgIHZhciBsZW5ndGggPSBhU3RyLmxlbmd0aDtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBjYWNoZWRTZWdtZW50cyA9IHt9O1xuICAgIHZhciB0ZW1wID0ge307XG4gICAgdmFyIG9yaWdpbmFsTWFwcGluZ3MgPSBbXTtcbiAgICB2YXIgZ2VuZXJhdGVkTWFwcGluZ3MgPSBbXTtcbiAgICB2YXIgbWFwcGluZywgc3RyLCBzZWdtZW50LCBlbmQsIHZhbHVlO1xuXG4gICAgd2hpbGUgKGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgICBpZiAoYVN0ci5jaGFyQXQoaW5kZXgpID09PSAnOycpIHtcbiAgICAgICAgZ2VuZXJhdGVkTGluZSsrO1xuICAgICAgICBpbmRleCsrO1xuICAgICAgICBwcmV2aW91c0dlbmVyYXRlZENvbHVtbiA9IDA7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChhU3RyLmNoYXJBdChpbmRleCkgPT09ICcsJykge1xuICAgICAgICBpbmRleCsrO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIG1hcHBpbmcgPSBuZXcgTWFwcGluZygpO1xuICAgICAgICBtYXBwaW5nLmdlbmVyYXRlZExpbmUgPSBnZW5lcmF0ZWRMaW5lO1xuXG4gICAgICAgIC8vIEJlY2F1c2UgZWFjaCBvZmZzZXQgaXMgZW5jb2RlZCByZWxhdGl2ZSB0byB0aGUgcHJldmlvdXMgb25lLFxuICAgICAgICAvLyBtYW55IHNlZ21lbnRzIG9mdGVuIGhhdmUgdGhlIHNhbWUgZW5jb2RpbmcuIFdlIGNhbiBleHBsb2l0IHRoaXNcbiAgICAgICAgLy8gZmFjdCBieSBjYWNoaW5nIHRoZSBwYXJzZWQgdmFyaWFibGUgbGVuZ3RoIGZpZWxkcyBvZiBlYWNoIHNlZ21lbnQsXG4gICAgICAgIC8vIGFsbG93aW5nIHVzIHRvIGF2b2lkIGEgc2Vjb25kIHBhcnNlIGlmIHdlIGVuY291bnRlciB0aGUgc2FtZVxuICAgICAgICAvLyBzZWdtZW50IGFnYWluLlxuICAgICAgICBmb3IgKGVuZCA9IGluZGV4OyBlbmQgPCBsZW5ndGg7IGVuZCsrKSB7XG4gICAgICAgICAgaWYgKHRoaXMuX2NoYXJJc01hcHBpbmdTZXBhcmF0b3IoYVN0ciwgZW5kKSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHN0ciA9IGFTdHIuc2xpY2UoaW5kZXgsIGVuZCk7XG5cbiAgICAgICAgc2VnbWVudCA9IGNhY2hlZFNlZ21lbnRzW3N0cl07XG4gICAgICAgIGlmIChzZWdtZW50KSB7XG4gICAgICAgICAgaW5kZXggKz0gc3RyLmxlbmd0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWdtZW50ID0gW107XG4gICAgICAgICAgd2hpbGUgKGluZGV4IDwgZW5kKSB7XG4gICAgICAgICAgICBiYXNlNjRWTFEuZGVjb2RlKGFTdHIsIGluZGV4LCB0ZW1wKTtcbiAgICAgICAgICAgIHZhbHVlID0gdGVtcC52YWx1ZTtcbiAgICAgICAgICAgIGluZGV4ID0gdGVtcC5yZXN0O1xuICAgICAgICAgICAgc2VnbWVudC5wdXNoKHZhbHVlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc2VnbWVudC5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRm91bmQgYSBzb3VyY2UsIGJ1dCBubyBsaW5lIGFuZCBjb2x1bW4nKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc2VnbWVudC5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRm91bmQgYSBzb3VyY2UgYW5kIGxpbmUsIGJ1dCBubyBjb2x1bW4nKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjYWNoZWRTZWdtZW50c1tzdHJdID0gc2VnbWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEdlbmVyYXRlZCBjb2x1bW4uXG4gICAgICAgIG1hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uID0gcHJldmlvdXNHZW5lcmF0ZWRDb2x1bW4gKyBzZWdtZW50WzBdO1xuICAgICAgICBwcmV2aW91c0dlbmVyYXRlZENvbHVtbiA9IG1hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uO1xuXG4gICAgICAgIGlmIChzZWdtZW50Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAvLyBPcmlnaW5hbCBzb3VyY2UuXG4gICAgICAgICAgbWFwcGluZy5zb3VyY2UgPSBwcmV2aW91c1NvdXJjZSArIHNlZ21lbnRbMV07XG4gICAgICAgICAgcHJldmlvdXNTb3VyY2UgKz0gc2VnbWVudFsxXTtcblxuICAgICAgICAgIC8vIE9yaWdpbmFsIGxpbmUuXG4gICAgICAgICAgbWFwcGluZy5vcmlnaW5hbExpbmUgPSBwcmV2aW91c09yaWdpbmFsTGluZSArIHNlZ21lbnRbMl07XG4gICAgICAgICAgcHJldmlvdXNPcmlnaW5hbExpbmUgPSBtYXBwaW5nLm9yaWdpbmFsTGluZTtcbiAgICAgICAgICAvLyBMaW5lcyBhcmUgc3RvcmVkIDAtYmFzZWRcbiAgICAgICAgICBtYXBwaW5nLm9yaWdpbmFsTGluZSArPSAxO1xuXG4gICAgICAgICAgLy8gT3JpZ2luYWwgY29sdW1uLlxuICAgICAgICAgIG1hcHBpbmcub3JpZ2luYWxDb2x1bW4gPSBwcmV2aW91c09yaWdpbmFsQ29sdW1uICsgc2VnbWVudFszXTtcbiAgICAgICAgICBwcmV2aW91c09yaWdpbmFsQ29sdW1uID0gbWFwcGluZy5vcmlnaW5hbENvbHVtbjtcblxuICAgICAgICAgIGlmIChzZWdtZW50Lmxlbmd0aCA+IDQpIHtcbiAgICAgICAgICAgIC8vIE9yaWdpbmFsIG5hbWUuXG4gICAgICAgICAgICBtYXBwaW5nLm5hbWUgPSBwcmV2aW91c05hbWUgKyBzZWdtZW50WzRdO1xuICAgICAgICAgICAgcHJldmlvdXNOYW1lICs9IHNlZ21lbnRbNF07XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZ2VuZXJhdGVkTWFwcGluZ3MucHVzaChtYXBwaW5nKTtcbiAgICAgICAgaWYgKHR5cGVvZiBtYXBwaW5nLm9yaWdpbmFsTGluZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICBvcmlnaW5hbE1hcHBpbmdzLnB1c2gobWFwcGluZyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBxdWlja1NvcnQoZ2VuZXJhdGVkTWFwcGluZ3MsIHV0aWwuY29tcGFyZUJ5R2VuZXJhdGVkUG9zaXRpb25zRGVmbGF0ZWQpO1xuICAgIHRoaXMuX19nZW5lcmF0ZWRNYXBwaW5ncyA9IGdlbmVyYXRlZE1hcHBpbmdzO1xuXG4gICAgcXVpY2tTb3J0KG9yaWdpbmFsTWFwcGluZ3MsIHV0aWwuY29tcGFyZUJ5T3JpZ2luYWxQb3NpdGlvbnMpO1xuICAgIHRoaXMuX19vcmlnaW5hbE1hcHBpbmdzID0gb3JpZ2luYWxNYXBwaW5ncztcbiAgfTtcblxuLyoqXG4gKiBGaW5kIHRoZSBtYXBwaW5nIHRoYXQgYmVzdCBtYXRjaGVzIHRoZSBoeXBvdGhldGljYWwgXCJuZWVkbGVcIiBtYXBwaW5nIHRoYXRcbiAqIHdlIGFyZSBzZWFyY2hpbmcgZm9yIGluIHRoZSBnaXZlbiBcImhheXN0YWNrXCIgb2YgbWFwcGluZ3MuXG4gKi9cbkJhc2ljU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLl9maW5kTWFwcGluZyA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcENvbnN1bWVyX2ZpbmRNYXBwaW5nKGFOZWVkbGUsIGFNYXBwaW5ncywgYUxpbmVOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhQ29sdW1uTmFtZSwgYUNvbXBhcmF0b3IsIGFCaWFzKSB7XG4gICAgLy8gVG8gcmV0dXJuIHRoZSBwb3NpdGlvbiB3ZSBhcmUgc2VhcmNoaW5nIGZvciwgd2UgbXVzdCBmaXJzdCBmaW5kIHRoZVxuICAgIC8vIG1hcHBpbmcgZm9yIHRoZSBnaXZlbiBwb3NpdGlvbiBhbmQgdGhlbiByZXR1cm4gdGhlIG9wcG9zaXRlIHBvc2l0aW9uIGl0XG4gICAgLy8gcG9pbnRzIHRvLiBCZWNhdXNlIHRoZSBtYXBwaW5ncyBhcmUgc29ydGVkLCB3ZSBjYW4gdXNlIGJpbmFyeSBzZWFyY2ggdG9cbiAgICAvLyBmaW5kIHRoZSBiZXN0IG1hcHBpbmcuXG5cbiAgICBpZiAoYU5lZWRsZVthTGluZU5hbWVdIDw9IDApIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0xpbmUgbXVzdCBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gMSwgZ290ICdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKyBhTmVlZGxlW2FMaW5lTmFtZV0pO1xuICAgIH1cbiAgICBpZiAoYU5lZWRsZVthQ29sdW1uTmFtZV0gPCAwKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDb2x1bW4gbXVzdCBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gMCwgZ290ICdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKyBhTmVlZGxlW2FDb2x1bW5OYW1lXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJpbmFyeVNlYXJjaC5zZWFyY2goYU5lZWRsZSwgYU1hcHBpbmdzLCBhQ29tcGFyYXRvciwgYUJpYXMpO1xuICB9O1xuXG4vKipcbiAqIENvbXB1dGUgdGhlIGxhc3QgY29sdW1uIGZvciBlYWNoIGdlbmVyYXRlZCBtYXBwaW5nLiBUaGUgbGFzdCBjb2x1bW4gaXNcbiAqIGluY2x1c2l2ZS5cbiAqL1xuQmFzaWNTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuY29tcHV0ZUNvbHVtblNwYW5zID1cbiAgZnVuY3Rpb24gU291cmNlTWFwQ29uc3VtZXJfY29tcHV0ZUNvbHVtblNwYW5zKCkge1xuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLl9nZW5lcmF0ZWRNYXBwaW5ncy5sZW5ndGg7ICsraW5kZXgpIHtcbiAgICAgIHZhciBtYXBwaW5nID0gdGhpcy5fZ2VuZXJhdGVkTWFwcGluZ3NbaW5kZXhdO1xuXG4gICAgICAvLyBNYXBwaW5ncyBkbyBub3QgY29udGFpbiBhIGZpZWxkIGZvciB0aGUgbGFzdCBnZW5lcmF0ZWQgY29sdW1udC4gV2VcbiAgICAgIC8vIGNhbiBjb21lIHVwIHdpdGggYW4gb3B0aW1pc3RpYyBlc3RpbWF0ZSwgaG93ZXZlciwgYnkgYXNzdW1pbmcgdGhhdFxuICAgICAgLy8gbWFwcGluZ3MgYXJlIGNvbnRpZ3VvdXMgKGkuZS4gZ2l2ZW4gdHdvIGNvbnNlY3V0aXZlIG1hcHBpbmdzLCB0aGVcbiAgICAgIC8vIGZpcnN0IG1hcHBpbmcgZW5kcyB3aGVyZSB0aGUgc2Vjb25kIG9uZSBzdGFydHMpLlxuICAgICAgaWYgKGluZGV4ICsgMSA8IHRoaXMuX2dlbmVyYXRlZE1hcHBpbmdzLmxlbmd0aCkge1xuICAgICAgICB2YXIgbmV4dE1hcHBpbmcgPSB0aGlzLl9nZW5lcmF0ZWRNYXBwaW5nc1tpbmRleCArIDFdO1xuXG4gICAgICAgIGlmIChtYXBwaW5nLmdlbmVyYXRlZExpbmUgPT09IG5leHRNYXBwaW5nLmdlbmVyYXRlZExpbmUpIHtcbiAgICAgICAgICBtYXBwaW5nLmxhc3RHZW5lcmF0ZWRDb2x1bW4gPSBuZXh0TWFwcGluZy5nZW5lcmF0ZWRDb2x1bW4gLSAxO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBsYXN0IG1hcHBpbmcgZm9yIGVhY2ggbGluZSBzcGFucyB0aGUgZW50aXJlIGxpbmUuXG4gICAgICBtYXBwaW5nLmxhc3RHZW5lcmF0ZWRDb2x1bW4gPSBJbmZpbml0eTtcbiAgICB9XG4gIH07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgb3JpZ2luYWwgc291cmNlLCBsaW5lLCBhbmQgY29sdW1uIGluZm9ybWF0aW9uIGZvciB0aGUgZ2VuZXJhdGVkXG4gKiBzb3VyY2UncyBsaW5lIGFuZCBjb2x1bW4gcG9zaXRpb25zIHByb3ZpZGVkLiBUaGUgb25seSBhcmd1bWVudCBpcyBhbiBvYmplY3RcbiAqIHdpdGggdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICpcbiAqICAgLSBsaW5lOiBUaGUgbGluZSBudW1iZXIgaW4gdGhlIGdlbmVyYXRlZCBzb3VyY2UuICBUaGUgbGluZSBudW1iZXJcbiAqICAgICBpcyAxLWJhc2VkLlxuICogICAtIGNvbHVtbjogVGhlIGNvbHVtbiBudW1iZXIgaW4gdGhlIGdlbmVyYXRlZCBzb3VyY2UuICBUaGUgY29sdW1uXG4gKiAgICAgbnVtYmVyIGlzIDAtYmFzZWQuXG4gKiAgIC0gYmlhczogRWl0aGVyICdTb3VyY2VNYXBDb25zdW1lci5HUkVBVEVTVF9MT1dFUl9CT1VORCcgb3JcbiAqICAgICAnU291cmNlTWFwQ29uc3VtZXIuTEVBU1RfVVBQRVJfQk9VTkQnLiBTcGVjaWZpZXMgd2hldGhlciB0byByZXR1cm4gdGhlXG4gKiAgICAgY2xvc2VzdCBlbGVtZW50IHRoYXQgaXMgc21hbGxlciB0aGFuIG9yIGdyZWF0ZXIgdGhhbiB0aGUgb25lIHdlIGFyZVxuICogICAgIHNlYXJjaGluZyBmb3IsIHJlc3BlY3RpdmVseSwgaWYgdGhlIGV4YWN0IGVsZW1lbnQgY2Fubm90IGJlIGZvdW5kLlxuICogICAgIERlZmF1bHRzIHRvICdTb3VyY2VNYXBDb25zdW1lci5HUkVBVEVTVF9MT1dFUl9CT1VORCcuXG4gKlxuICogYW5kIGFuIG9iamVjdCBpcyByZXR1cm5lZCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gc291cmNlOiBUaGUgb3JpZ2luYWwgc291cmNlIGZpbGUsIG9yIG51bGwuXG4gKiAgIC0gbGluZTogVGhlIGxpbmUgbnVtYmVyIGluIHRoZSBvcmlnaW5hbCBzb3VyY2UsIG9yIG51bGwuICBUaGVcbiAqICAgICBsaW5lIG51bWJlciBpcyAxLWJhc2VkLlxuICogICAtIGNvbHVtbjogVGhlIGNvbHVtbiBudW1iZXIgaW4gdGhlIG9yaWdpbmFsIHNvdXJjZSwgb3IgbnVsbC4gIFRoZVxuICogICAgIGNvbHVtbiBudW1iZXIgaXMgMC1iYXNlZC5cbiAqICAgLSBuYW1lOiBUaGUgb3JpZ2luYWwgaWRlbnRpZmllciwgb3IgbnVsbC5cbiAqL1xuQmFzaWNTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUub3JpZ2luYWxQb3NpdGlvbkZvciA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcENvbnN1bWVyX29yaWdpbmFsUG9zaXRpb25Gb3IoYUFyZ3MpIHtcbiAgICB2YXIgbmVlZGxlID0ge1xuICAgICAgZ2VuZXJhdGVkTGluZTogdXRpbC5nZXRBcmcoYUFyZ3MsICdsaW5lJyksXG4gICAgICBnZW5lcmF0ZWRDb2x1bW46IHV0aWwuZ2V0QXJnKGFBcmdzLCAnY29sdW1uJylcbiAgICB9O1xuXG4gICAgdmFyIGluZGV4ID0gdGhpcy5fZmluZE1hcHBpbmcoXG4gICAgICBuZWVkbGUsXG4gICAgICB0aGlzLl9nZW5lcmF0ZWRNYXBwaW5ncyxcbiAgICAgIFwiZ2VuZXJhdGVkTGluZVwiLFxuICAgICAgXCJnZW5lcmF0ZWRDb2x1bW5cIixcbiAgICAgIHV0aWwuY29tcGFyZUJ5R2VuZXJhdGVkUG9zaXRpb25zRGVmbGF0ZWQsXG4gICAgICB1dGlsLmdldEFyZyhhQXJncywgJ2JpYXMnLCBTb3VyY2VNYXBDb25zdW1lci5HUkVBVEVTVF9MT1dFUl9CT1VORClcbiAgICApO1xuXG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIHZhciBtYXBwaW5nID0gdGhpcy5fZ2VuZXJhdGVkTWFwcGluZ3NbaW5kZXhdO1xuXG4gICAgICBpZiAobWFwcGluZy5nZW5lcmF0ZWRMaW5lID09PSBuZWVkbGUuZ2VuZXJhdGVkTGluZSkge1xuICAgICAgICB2YXIgc291cmNlID0gdXRpbC5nZXRBcmcobWFwcGluZywgJ3NvdXJjZScsIG51bGwpO1xuICAgICAgICBpZiAoc291cmNlICE9PSBudWxsKSB7XG4gICAgICAgICAgc291cmNlID0gdGhpcy5fc291cmNlcy5hdChzb3VyY2UpO1xuICAgICAgICAgIHNvdXJjZSA9IHV0aWwuY29tcHV0ZVNvdXJjZVVSTCh0aGlzLnNvdXJjZVJvb3QsIHNvdXJjZSwgdGhpcy5fc291cmNlTWFwVVJMKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbmFtZSA9IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICduYW1lJywgbnVsbCk7XG4gICAgICAgIGlmIChuYW1lICE9PSBudWxsKSB7XG4gICAgICAgICAgbmFtZSA9IHRoaXMuX25hbWVzLmF0KG5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc291cmNlOiBzb3VyY2UsXG4gICAgICAgICAgbGluZTogdXRpbC5nZXRBcmcobWFwcGluZywgJ29yaWdpbmFsTGluZScsIG51bGwpLFxuICAgICAgICAgIGNvbHVtbjogdXRpbC5nZXRBcmcobWFwcGluZywgJ29yaWdpbmFsQ29sdW1uJywgbnVsbCksXG4gICAgICAgICAgbmFtZTogbmFtZVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBzb3VyY2U6IG51bGwsXG4gICAgICBsaW5lOiBudWxsLFxuICAgICAgY29sdW1uOiBudWxsLFxuICAgICAgbmFtZTogbnVsbFxuICAgIH07XG4gIH07XG5cbi8qKlxuICogUmV0dXJuIHRydWUgaWYgd2UgaGF2ZSB0aGUgc291cmNlIGNvbnRlbnQgZm9yIGV2ZXJ5IHNvdXJjZSBpbiB0aGUgc291cmNlXG4gKiBtYXAsIGZhbHNlIG90aGVyd2lzZS5cbiAqL1xuQmFzaWNTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuaGFzQ29udGVudHNPZkFsbFNvdXJjZXMgPVxuICBmdW5jdGlvbiBCYXNpY1NvdXJjZU1hcENvbnN1bWVyX2hhc0NvbnRlbnRzT2ZBbGxTb3VyY2VzKCkge1xuICAgIGlmICghdGhpcy5zb3VyY2VzQ29udGVudCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zb3VyY2VzQ29udGVudC5sZW5ndGggPj0gdGhpcy5fc291cmNlcy5zaXplKCkgJiZcbiAgICAgICF0aGlzLnNvdXJjZXNDb250ZW50LnNvbWUoZnVuY3Rpb24gKHNjKSB7IHJldHVybiBzYyA9PSBudWxsOyB9KTtcbiAgfTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBvcmlnaW5hbCBzb3VyY2UgY29udGVudC4gVGhlIG9ubHkgYXJndW1lbnQgaXMgdGhlIHVybCBvZiB0aGVcbiAqIG9yaWdpbmFsIHNvdXJjZSBmaWxlLiBSZXR1cm5zIG51bGwgaWYgbm8gb3JpZ2luYWwgc291cmNlIGNvbnRlbnQgaXNcbiAqIGF2YWlsYWJsZS5cbiAqL1xuQmFzaWNTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuc291cmNlQ29udGVudEZvciA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcENvbnN1bWVyX3NvdXJjZUNvbnRlbnRGb3IoYVNvdXJjZSwgbnVsbE9uTWlzc2luZykge1xuICAgIGlmICghdGhpcy5zb3VyY2VzQ29udGVudCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdmFyIGluZGV4ID0gdGhpcy5fZmluZFNvdXJjZUluZGV4KGFTb3VyY2UpO1xuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5zb3VyY2VzQ29udGVudFtpbmRleF07XG4gICAgfVxuXG4gICAgdmFyIHJlbGF0aXZlU291cmNlID0gYVNvdXJjZTtcbiAgICBpZiAodGhpcy5zb3VyY2VSb290ICE9IG51bGwpIHtcbiAgICAgIHJlbGF0aXZlU291cmNlID0gdXRpbC5yZWxhdGl2ZSh0aGlzLnNvdXJjZVJvb3QsIHJlbGF0aXZlU291cmNlKTtcbiAgICB9XG5cbiAgICB2YXIgdXJsO1xuICAgIGlmICh0aGlzLnNvdXJjZVJvb3QgIT0gbnVsbFxuICAgICAgICAmJiAodXJsID0gdXRpbC51cmxQYXJzZSh0aGlzLnNvdXJjZVJvb3QpKSkge1xuICAgICAgLy8gWFhYOiBmaWxlOi8vIFVSSXMgYW5kIGFic29sdXRlIHBhdGhzIGxlYWQgdG8gdW5leHBlY3RlZCBiZWhhdmlvciBmb3JcbiAgICAgIC8vIG1hbnkgdXNlcnMuIFdlIGNhbiBoZWxwIHRoZW0gb3V0IHdoZW4gdGhleSBleHBlY3QgZmlsZTovLyBVUklzIHRvXG4gICAgICAvLyBiZWhhdmUgbGlrZSBpdCB3b3VsZCBpZiB0aGV5IHdlcmUgcnVubmluZyBhIGxvY2FsIEhUVFAgc2VydmVyLiBTZWVcbiAgICAgIC8vIGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTg4NTU5Ny5cbiAgICAgIHZhciBmaWxlVXJpQWJzUGF0aCA9IHJlbGF0aXZlU291cmNlLnJlcGxhY2UoL15maWxlOlxcL1xcLy8sIFwiXCIpO1xuICAgICAgaWYgKHVybC5zY2hlbWUgPT0gXCJmaWxlXCJcbiAgICAgICAgICAmJiB0aGlzLl9zb3VyY2VzLmhhcyhmaWxlVXJpQWJzUGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlc0NvbnRlbnRbdGhpcy5fc291cmNlcy5pbmRleE9mKGZpbGVVcmlBYnNQYXRoKV1cbiAgICAgIH1cblxuICAgICAgaWYgKCghdXJsLnBhdGggfHwgdXJsLnBhdGggPT0gXCIvXCIpXG4gICAgICAgICAgJiYgdGhpcy5fc291cmNlcy5oYXMoXCIvXCIgKyByZWxhdGl2ZVNvdXJjZSkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlc0NvbnRlbnRbdGhpcy5fc291cmNlcy5pbmRleE9mKFwiL1wiICsgcmVsYXRpdmVTb3VyY2UpXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgcmVjdXJzaXZlbHkgZnJvbVxuICAgIC8vIEluZGV4ZWRTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuc291cmNlQ29udGVudEZvci4gSW4gdGhhdCBjYXNlLCB3ZVxuICAgIC8vIGRvbid0IHdhbnQgdG8gdGhyb3cgaWYgd2UgY2FuJ3QgZmluZCB0aGUgc291cmNlIC0gd2UganVzdCB3YW50IHRvXG4gICAgLy8gcmV0dXJuIG51bGwsIHNvIHdlIHByb3ZpZGUgYSBmbGFnIHRvIGV4aXQgZ3JhY2VmdWxseS5cbiAgICBpZiAobnVsbE9uTWlzc2luZykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdcIicgKyByZWxhdGl2ZVNvdXJjZSArICdcIiBpcyBub3QgaW4gdGhlIFNvdXJjZU1hcC4nKTtcbiAgICB9XG4gIH07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZ2VuZXJhdGVkIGxpbmUgYW5kIGNvbHVtbiBpbmZvcm1hdGlvbiBmb3IgdGhlIG9yaWdpbmFsIHNvdXJjZSxcbiAqIGxpbmUsIGFuZCBjb2x1bW4gcG9zaXRpb25zIHByb3ZpZGVkLiBUaGUgb25seSBhcmd1bWVudCBpcyBhbiBvYmplY3Qgd2l0aFxuICogdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICpcbiAqICAgLSBzb3VyY2U6IFRoZSBmaWxlbmFtZSBvZiB0aGUgb3JpZ2luYWwgc291cmNlLlxuICogICAtIGxpbmU6IFRoZSBsaW5lIG51bWJlciBpbiB0aGUgb3JpZ2luYWwgc291cmNlLiAgVGhlIGxpbmUgbnVtYmVyXG4gKiAgICAgaXMgMS1iYXNlZC5cbiAqICAgLSBjb2x1bW46IFRoZSBjb2x1bW4gbnVtYmVyIGluIHRoZSBvcmlnaW5hbCBzb3VyY2UuICBUaGUgY29sdW1uXG4gKiAgICAgbnVtYmVyIGlzIDAtYmFzZWQuXG4gKiAgIC0gYmlhczogRWl0aGVyICdTb3VyY2VNYXBDb25zdW1lci5HUkVBVEVTVF9MT1dFUl9CT1VORCcgb3JcbiAqICAgICAnU291cmNlTWFwQ29uc3VtZXIuTEVBU1RfVVBQRVJfQk9VTkQnLiBTcGVjaWZpZXMgd2hldGhlciB0byByZXR1cm4gdGhlXG4gKiAgICAgY2xvc2VzdCBlbGVtZW50IHRoYXQgaXMgc21hbGxlciB0aGFuIG9yIGdyZWF0ZXIgdGhhbiB0aGUgb25lIHdlIGFyZVxuICogICAgIHNlYXJjaGluZyBmb3IsIHJlc3BlY3RpdmVseSwgaWYgdGhlIGV4YWN0IGVsZW1lbnQgY2Fubm90IGJlIGZvdW5kLlxuICogICAgIERlZmF1bHRzIHRvICdTb3VyY2VNYXBDb25zdW1lci5HUkVBVEVTVF9MT1dFUl9CT1VORCcuXG4gKlxuICogYW5kIGFuIG9iamVjdCBpcyByZXR1cm5lZCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gbGluZTogVGhlIGxpbmUgbnVtYmVyIGluIHRoZSBnZW5lcmF0ZWQgc291cmNlLCBvciBudWxsLiAgVGhlXG4gKiAgICAgbGluZSBudW1iZXIgaXMgMS1iYXNlZC5cbiAqICAgLSBjb2x1bW46IFRoZSBjb2x1bW4gbnVtYmVyIGluIHRoZSBnZW5lcmF0ZWQgc291cmNlLCBvciBudWxsLlxuICogICAgIFRoZSBjb2x1bW4gbnVtYmVyIGlzIDAtYmFzZWQuXG4gKi9cbkJhc2ljU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLmdlbmVyYXRlZFBvc2l0aW9uRm9yID1cbiAgZnVuY3Rpb24gU291cmNlTWFwQ29uc3VtZXJfZ2VuZXJhdGVkUG9zaXRpb25Gb3IoYUFyZ3MpIHtcbiAgICB2YXIgc291cmNlID0gdXRpbC5nZXRBcmcoYUFyZ3MsICdzb3VyY2UnKTtcbiAgICBzb3VyY2UgPSB0aGlzLl9maW5kU291cmNlSW5kZXgoc291cmNlKTtcbiAgICBpZiAoc291cmNlIDwgMCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbGluZTogbnVsbCxcbiAgICAgICAgY29sdW1uOiBudWxsLFxuICAgICAgICBsYXN0Q29sdW1uOiBudWxsXG4gICAgICB9O1xuICAgIH1cblxuICAgIHZhciBuZWVkbGUgPSB7XG4gICAgICBzb3VyY2U6IHNvdXJjZSxcbiAgICAgIG9yaWdpbmFsTGluZTogdXRpbC5nZXRBcmcoYUFyZ3MsICdsaW5lJyksXG4gICAgICBvcmlnaW5hbENvbHVtbjogdXRpbC5nZXRBcmcoYUFyZ3MsICdjb2x1bW4nKVxuICAgIH07XG5cbiAgICB2YXIgaW5kZXggPSB0aGlzLl9maW5kTWFwcGluZyhcbiAgICAgIG5lZWRsZSxcbiAgICAgIHRoaXMuX29yaWdpbmFsTWFwcGluZ3MsXG4gICAgICBcIm9yaWdpbmFsTGluZVwiLFxuICAgICAgXCJvcmlnaW5hbENvbHVtblwiLFxuICAgICAgdXRpbC5jb21wYXJlQnlPcmlnaW5hbFBvc2l0aW9ucyxcbiAgICAgIHV0aWwuZ2V0QXJnKGFBcmdzLCAnYmlhcycsIFNvdXJjZU1hcENvbnN1bWVyLkdSRUFURVNUX0xPV0VSX0JPVU5EKVxuICAgICk7XG5cbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgdmFyIG1hcHBpbmcgPSB0aGlzLl9vcmlnaW5hbE1hcHBpbmdzW2luZGV4XTtcblxuICAgICAgaWYgKG1hcHBpbmcuc291cmNlID09PSBuZWVkbGUuc291cmNlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbGluZTogdXRpbC5nZXRBcmcobWFwcGluZywgJ2dlbmVyYXRlZExpbmUnLCBudWxsKSxcbiAgICAgICAgICBjb2x1bW46IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICdnZW5lcmF0ZWRDb2x1bW4nLCBudWxsKSxcbiAgICAgICAgICBsYXN0Q29sdW1uOiB1dGlsLmdldEFyZyhtYXBwaW5nLCAnbGFzdEdlbmVyYXRlZENvbHVtbicsIG51bGwpXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGxpbmU6IG51bGwsXG4gICAgICBjb2x1bW46IG51bGwsXG4gICAgICBsYXN0Q29sdW1uOiBudWxsXG4gICAgfTtcbiAgfTtcblxuZXhwb3J0cy5CYXNpY1NvdXJjZU1hcENvbnN1bWVyID0gQmFzaWNTb3VyY2VNYXBDb25zdW1lcjtcblxuLyoqXG4gKiBBbiBJbmRleGVkU291cmNlTWFwQ29uc3VtZXIgaW5zdGFuY2UgcmVwcmVzZW50cyBhIHBhcnNlZCBzb3VyY2UgbWFwIHdoaWNoXG4gKiB3ZSBjYW4gcXVlcnkgZm9yIGluZm9ybWF0aW9uLiBJdCBkaWZmZXJzIGZyb20gQmFzaWNTb3VyY2VNYXBDb25zdW1lciBpblxuICogdGhhdCBpdCB0YWtlcyBcImluZGV4ZWRcIiBzb3VyY2UgbWFwcyAoaS5lLiBvbmVzIHdpdGggYSBcInNlY3Rpb25zXCIgZmllbGQpIGFzXG4gKiBpbnB1dC5cbiAqXG4gKiBUaGUgZmlyc3QgcGFyYW1ldGVyIGlzIGEgcmF3IHNvdXJjZSBtYXAgKGVpdGhlciBhcyBhIEpTT04gc3RyaW5nLCBvciBhbHJlYWR5XG4gKiBwYXJzZWQgdG8gYW4gb2JqZWN0KS4gQWNjb3JkaW5nIHRvIHRoZSBzcGVjIGZvciBpbmRleGVkIHNvdXJjZSBtYXBzLCB0aGV5XG4gKiBoYXZlIHRoZSBmb2xsb3dpbmcgYXR0cmlidXRlczpcbiAqXG4gKiAgIC0gdmVyc2lvbjogV2hpY2ggdmVyc2lvbiBvZiB0aGUgc291cmNlIG1hcCBzcGVjIHRoaXMgbWFwIGlzIGZvbGxvd2luZy5cbiAqICAgLSBmaWxlOiBPcHRpb25hbC4gVGhlIGdlbmVyYXRlZCBmaWxlIHRoaXMgc291cmNlIG1hcCBpcyBhc3NvY2lhdGVkIHdpdGguXG4gKiAgIC0gc2VjdGlvbnM6IEEgbGlzdCBvZiBzZWN0aW9uIGRlZmluaXRpb25zLlxuICpcbiAqIEVhY2ggdmFsdWUgdW5kZXIgdGhlIFwic2VjdGlvbnNcIiBmaWVsZCBoYXMgdHdvIGZpZWxkczpcbiAqICAgLSBvZmZzZXQ6IFRoZSBvZmZzZXQgaW50byB0aGUgb3JpZ2luYWwgc3BlY2lmaWVkIGF0IHdoaWNoIHRoaXMgc2VjdGlvblxuICogICAgICAgYmVnaW5zIHRvIGFwcGx5LCBkZWZpbmVkIGFzIGFuIG9iamVjdCB3aXRoIGEgXCJsaW5lXCIgYW5kIFwiY29sdW1uXCJcbiAqICAgICAgIGZpZWxkLlxuICogICAtIG1hcDogQSBzb3VyY2UgbWFwIGRlZmluaXRpb24uIFRoaXMgc291cmNlIG1hcCBjb3VsZCBhbHNvIGJlIGluZGV4ZWQsXG4gKiAgICAgICBidXQgZG9lc24ndCBoYXZlIHRvIGJlLlxuICpcbiAqIEluc3RlYWQgb2YgdGhlIFwibWFwXCIgZmllbGQsIGl0J3MgYWxzbyBwb3NzaWJsZSB0byBoYXZlIGEgXCJ1cmxcIiBmaWVsZFxuICogc3BlY2lmeWluZyBhIFVSTCB0byByZXRyaWV2ZSBhIHNvdXJjZSBtYXAgZnJvbSwgYnV0IHRoYXQncyBjdXJyZW50bHlcbiAqIHVuc3VwcG9ydGVkLlxuICpcbiAqIEhlcmUncyBhbiBleGFtcGxlIHNvdXJjZSBtYXAsIHRha2VuIGZyb20gdGhlIHNvdXJjZSBtYXAgc3BlY1swXSwgYnV0XG4gKiBtb2RpZmllZCB0byBvbWl0IGEgc2VjdGlvbiB3aGljaCB1c2VzIHRoZSBcInVybFwiIGZpZWxkLlxuICpcbiAqICB7XG4gKiAgICB2ZXJzaW9uIDogMyxcbiAqICAgIGZpbGU6IFwiYXBwLmpzXCIsXG4gKiAgICBzZWN0aW9uczogW3tcbiAqICAgICAgb2Zmc2V0OiB7bGluZToxMDAsIGNvbHVtbjoxMH0sXG4gKiAgICAgIG1hcDoge1xuICogICAgICAgIHZlcnNpb24gOiAzLFxuICogICAgICAgIGZpbGU6IFwic2VjdGlvbi5qc1wiLFxuICogICAgICAgIHNvdXJjZXM6IFtcImZvby5qc1wiLCBcImJhci5qc1wiXSxcbiAqICAgICAgICBuYW1lczogW1wic3JjXCIsIFwibWFwc1wiLCBcImFyZVwiLCBcImZ1blwiXSxcbiAqICAgICAgICBtYXBwaW5nczogXCJBQUFBLEU7O0FCQ0RFO1wiXG4gKiAgICAgIH1cbiAqICAgIH1dLFxuICogIH1cbiAqXG4gKiBUaGUgc2Vjb25kIHBhcmFtZXRlciwgaWYgZ2l2ZW4sIGlzIGEgc3RyaW5nIHdob3NlIHZhbHVlIGlzIHRoZSBVUkxcbiAqIGF0IHdoaWNoIHRoZSBzb3VyY2UgbWFwIHdhcyBmb3VuZC4gIFRoaXMgVVJMIGlzIHVzZWQgdG8gY29tcHV0ZSB0aGVcbiAqIHNvdXJjZXMgYXJyYXkuXG4gKlxuICogWzBdOiBodHRwczovL2RvY3MuZ29vZ2xlLmNvbS9kb2N1bWVudC9kLzFVMVJHQWVoUXdSeXBVVG92RjFLUmxwaU9GemUwYi1fMmdjNmZBSDBLWTBrL2VkaXQjaGVhZGluZz1oLjUzNWVzM3hlcHJndFxuICovXG5mdW5jdGlvbiBJbmRleGVkU291cmNlTWFwQ29uc3VtZXIoYVNvdXJjZU1hcCwgYVNvdXJjZU1hcFVSTCkge1xuICB2YXIgc291cmNlTWFwID0gYVNvdXJjZU1hcDtcbiAgaWYgKHR5cGVvZiBhU291cmNlTWFwID09PSAnc3RyaW5nJykge1xuICAgIHNvdXJjZU1hcCA9IHV0aWwucGFyc2VTb3VyY2VNYXBJbnB1dChhU291cmNlTWFwKTtcbiAgfVxuXG4gIHZhciB2ZXJzaW9uID0gdXRpbC5nZXRBcmcoc291cmNlTWFwLCAndmVyc2lvbicpO1xuICB2YXIgc2VjdGlvbnMgPSB1dGlsLmdldEFyZyhzb3VyY2VNYXAsICdzZWN0aW9ucycpO1xuXG4gIGlmICh2ZXJzaW9uICE9IHRoaXMuX3ZlcnNpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIHZlcnNpb246ICcgKyB2ZXJzaW9uKTtcbiAgfVxuXG4gIHRoaXMuX3NvdXJjZXMgPSBuZXcgQXJyYXlTZXQoKTtcbiAgdGhpcy5fbmFtZXMgPSBuZXcgQXJyYXlTZXQoKTtcblxuICB2YXIgbGFzdE9mZnNldCA9IHtcbiAgICBsaW5lOiAtMSxcbiAgICBjb2x1bW46IDBcbiAgfTtcbiAgdGhpcy5fc2VjdGlvbnMgPSBzZWN0aW9ucy5tYXAoZnVuY3Rpb24gKHMpIHtcbiAgICBpZiAocy51cmwpIHtcbiAgICAgIC8vIFRoZSB1cmwgZmllbGQgd2lsbCByZXF1aXJlIHN1cHBvcnQgZm9yIGFzeW5jaHJvbmljaXR5LlxuICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tb3ppbGxhL3NvdXJjZS1tYXAvaXNzdWVzLzE2XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N1cHBvcnQgZm9yIHVybCBmaWVsZCBpbiBzZWN0aW9ucyBub3QgaW1wbGVtZW50ZWQuJyk7XG4gICAgfVxuICAgIHZhciBvZmZzZXQgPSB1dGlsLmdldEFyZyhzLCAnb2Zmc2V0Jyk7XG4gICAgdmFyIG9mZnNldExpbmUgPSB1dGlsLmdldEFyZyhvZmZzZXQsICdsaW5lJyk7XG4gICAgdmFyIG9mZnNldENvbHVtbiA9IHV0aWwuZ2V0QXJnKG9mZnNldCwgJ2NvbHVtbicpO1xuXG4gICAgaWYgKG9mZnNldExpbmUgPCBsYXN0T2Zmc2V0LmxpbmUgfHxcbiAgICAgICAgKG9mZnNldExpbmUgPT09IGxhc3RPZmZzZXQubGluZSAmJiBvZmZzZXRDb2x1bW4gPCBsYXN0T2Zmc2V0LmNvbHVtbikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignU2VjdGlvbiBvZmZzZXRzIG11c3QgYmUgb3JkZXJlZCBhbmQgbm9uLW92ZXJsYXBwaW5nLicpO1xuICAgIH1cbiAgICBsYXN0T2Zmc2V0ID0gb2Zmc2V0O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGdlbmVyYXRlZE9mZnNldDoge1xuICAgICAgICAvLyBUaGUgb2Zmc2V0IGZpZWxkcyBhcmUgMC1iYXNlZCwgYnV0IHdlIHVzZSAxLWJhc2VkIGluZGljZXMgd2hlblxuICAgICAgICAvLyBlbmNvZGluZy9kZWNvZGluZyBmcm9tIFZMUS5cbiAgICAgICAgZ2VuZXJhdGVkTGluZTogb2Zmc2V0TGluZSArIDEsXG4gICAgICAgIGdlbmVyYXRlZENvbHVtbjogb2Zmc2V0Q29sdW1uICsgMVxuICAgICAgfSxcbiAgICAgIGNvbnN1bWVyOiBuZXcgU291cmNlTWFwQ29uc3VtZXIodXRpbC5nZXRBcmcocywgJ21hcCcpLCBhU291cmNlTWFwVVJMKVxuICAgIH1cbiAgfSk7XG59XG5cbkluZGV4ZWRTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZSk7XG5JbmRleGVkU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU291cmNlTWFwQ29uc3VtZXI7XG5cbi8qKlxuICogVGhlIHZlcnNpb24gb2YgdGhlIHNvdXJjZSBtYXBwaW5nIHNwZWMgdGhhdCB3ZSBhcmUgY29uc3VtaW5nLlxuICovXG5JbmRleGVkU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLl92ZXJzaW9uID0gMztcblxuLyoqXG4gKiBUaGUgbGlzdCBvZiBvcmlnaW5hbCBzb3VyY2VzLlxuICovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZSwgJ3NvdXJjZXMnLCB7XG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzb3VyY2VzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9zZWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLl9zZWN0aW9uc1tpXS5jb25zdW1lci5zb3VyY2VzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIHNvdXJjZXMucHVzaCh0aGlzLl9zZWN0aW9uc1tpXS5jb25zdW1lci5zb3VyY2VzW2pdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNvdXJjZXM7XG4gIH1cbn0pO1xuXG4vKipcbiAqIFJldHVybnMgdGhlIG9yaWdpbmFsIHNvdXJjZSwgbGluZSwgYW5kIGNvbHVtbiBpbmZvcm1hdGlvbiBmb3IgdGhlIGdlbmVyYXRlZFxuICogc291cmNlJ3MgbGluZSBhbmQgY29sdW1uIHBvc2l0aW9ucyBwcm92aWRlZC4gVGhlIG9ubHkgYXJndW1lbnQgaXMgYW4gb2JqZWN0XG4gKiB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gbGluZTogVGhlIGxpbmUgbnVtYmVyIGluIHRoZSBnZW5lcmF0ZWQgc291cmNlLiAgVGhlIGxpbmUgbnVtYmVyXG4gKiAgICAgaXMgMS1iYXNlZC5cbiAqICAgLSBjb2x1bW46IFRoZSBjb2x1bW4gbnVtYmVyIGluIHRoZSBnZW5lcmF0ZWQgc291cmNlLiAgVGhlIGNvbHVtblxuICogICAgIG51bWJlciBpcyAwLWJhc2VkLlxuICpcbiAqIGFuZCBhbiBvYmplY3QgaXMgcmV0dXJuZWQgd2l0aCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKlxuICogICAtIHNvdXJjZTogVGhlIG9yaWdpbmFsIHNvdXJjZSBmaWxlLCBvciBudWxsLlxuICogICAtIGxpbmU6IFRoZSBsaW5lIG51bWJlciBpbiB0aGUgb3JpZ2luYWwgc291cmNlLCBvciBudWxsLiAgVGhlXG4gKiAgICAgbGluZSBudW1iZXIgaXMgMS1iYXNlZC5cbiAqICAgLSBjb2x1bW46IFRoZSBjb2x1bW4gbnVtYmVyIGluIHRoZSBvcmlnaW5hbCBzb3VyY2UsIG9yIG51bGwuICBUaGVcbiAqICAgICBjb2x1bW4gbnVtYmVyIGlzIDAtYmFzZWQuXG4gKiAgIC0gbmFtZTogVGhlIG9yaWdpbmFsIGlkZW50aWZpZXIsIG9yIG51bGwuXG4gKi9cbkluZGV4ZWRTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUub3JpZ2luYWxQb3NpdGlvbkZvciA9XG4gIGZ1bmN0aW9uIEluZGV4ZWRTb3VyY2VNYXBDb25zdW1lcl9vcmlnaW5hbFBvc2l0aW9uRm9yKGFBcmdzKSB7XG4gICAgdmFyIG5lZWRsZSA9IHtcbiAgICAgIGdlbmVyYXRlZExpbmU6IHV0aWwuZ2V0QXJnKGFBcmdzLCAnbGluZScpLFxuICAgICAgZ2VuZXJhdGVkQ29sdW1uOiB1dGlsLmdldEFyZyhhQXJncywgJ2NvbHVtbicpXG4gICAgfTtcblxuICAgIC8vIEZpbmQgdGhlIHNlY3Rpb24gY29udGFpbmluZyB0aGUgZ2VuZXJhdGVkIHBvc2l0aW9uIHdlJ3JlIHRyeWluZyB0byBtYXBcbiAgICAvLyB0byBhbiBvcmlnaW5hbCBwb3NpdGlvbi5cbiAgICB2YXIgc2VjdGlvbkluZGV4ID0gYmluYXJ5U2VhcmNoLnNlYXJjaChuZWVkbGUsIHRoaXMuX3NlY3Rpb25zLFxuICAgICAgZnVuY3Rpb24obmVlZGxlLCBzZWN0aW9uKSB7XG4gICAgICAgIHZhciBjbXAgPSBuZWVkbGUuZ2VuZXJhdGVkTGluZSAtIHNlY3Rpb24uZ2VuZXJhdGVkT2Zmc2V0LmdlbmVyYXRlZExpbmU7XG4gICAgICAgIGlmIChjbXApIHtcbiAgICAgICAgICByZXR1cm4gY21wO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIChuZWVkbGUuZ2VuZXJhdGVkQ29sdW1uIC1cbiAgICAgICAgICAgICAgICBzZWN0aW9uLmdlbmVyYXRlZE9mZnNldC5nZW5lcmF0ZWRDb2x1bW4pO1xuICAgICAgfSk7XG4gICAgdmFyIHNlY3Rpb24gPSB0aGlzLl9zZWN0aW9uc1tzZWN0aW9uSW5kZXhdO1xuXG4gICAgaWYgKCFzZWN0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzb3VyY2U6IG51bGwsXG4gICAgICAgIGxpbmU6IG51bGwsXG4gICAgICAgIGNvbHVtbjogbnVsbCxcbiAgICAgICAgbmFtZTogbnVsbFxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2VjdGlvbi5jb25zdW1lci5vcmlnaW5hbFBvc2l0aW9uRm9yKHtcbiAgICAgIGxpbmU6IG5lZWRsZS5nZW5lcmF0ZWRMaW5lIC1cbiAgICAgICAgKHNlY3Rpb24uZ2VuZXJhdGVkT2Zmc2V0LmdlbmVyYXRlZExpbmUgLSAxKSxcbiAgICAgIGNvbHVtbjogbmVlZGxlLmdlbmVyYXRlZENvbHVtbiAtXG4gICAgICAgIChzZWN0aW9uLmdlbmVyYXRlZE9mZnNldC5nZW5lcmF0ZWRMaW5lID09PSBuZWVkbGUuZ2VuZXJhdGVkTGluZVxuICAgICAgICAgPyBzZWN0aW9uLmdlbmVyYXRlZE9mZnNldC5nZW5lcmF0ZWRDb2x1bW4gLSAxXG4gICAgICAgICA6IDApLFxuICAgICAgYmlhczogYUFyZ3MuYmlhc1xuICAgIH0pO1xuICB9O1xuXG4vKipcbiAqIFJldHVybiB0cnVlIGlmIHdlIGhhdmUgdGhlIHNvdXJjZSBjb250ZW50IGZvciBldmVyeSBzb3VyY2UgaW4gdGhlIHNvdXJjZVxuICogbWFwLCBmYWxzZSBvdGhlcndpc2UuXG4gKi9cbkluZGV4ZWRTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuaGFzQ29udGVudHNPZkFsbFNvdXJjZXMgPVxuICBmdW5jdGlvbiBJbmRleGVkU291cmNlTWFwQ29uc3VtZXJfaGFzQ29udGVudHNPZkFsbFNvdXJjZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NlY3Rpb25zLmV2ZXJ5KGZ1bmN0aW9uIChzKSB7XG4gICAgICByZXR1cm4gcy5jb25zdW1lci5oYXNDb250ZW50c09mQWxsU291cmNlcygpO1xuICAgIH0pO1xuICB9O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIG9yaWdpbmFsIHNvdXJjZSBjb250ZW50LiBUaGUgb25seSBhcmd1bWVudCBpcyB0aGUgdXJsIG9mIHRoZVxuICogb3JpZ2luYWwgc291cmNlIGZpbGUuIFJldHVybnMgbnVsbCBpZiBubyBvcmlnaW5hbCBzb3VyY2UgY29udGVudCBpc1xuICogYXZhaWxhYmxlLlxuICovXG5JbmRleGVkU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLnNvdXJjZUNvbnRlbnRGb3IgPVxuICBmdW5jdGlvbiBJbmRleGVkU291cmNlTWFwQ29uc3VtZXJfc291cmNlQ29udGVudEZvcihhU291cmNlLCBudWxsT25NaXNzaW5nKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9zZWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNlY3Rpb24gPSB0aGlzLl9zZWN0aW9uc1tpXTtcblxuICAgICAgdmFyIGNvbnRlbnQgPSBzZWN0aW9uLmNvbnN1bWVyLnNvdXJjZUNvbnRlbnRGb3IoYVNvdXJjZSwgdHJ1ZSk7XG4gICAgICBpZiAoY29udGVudCkge1xuICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG51bGxPbk1pc3NpbmcpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignXCInICsgYVNvdXJjZSArICdcIiBpcyBub3QgaW4gdGhlIFNvdXJjZU1hcC4nKTtcbiAgICB9XG4gIH07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZ2VuZXJhdGVkIGxpbmUgYW5kIGNvbHVtbiBpbmZvcm1hdGlvbiBmb3IgdGhlIG9yaWdpbmFsIHNvdXJjZSxcbiAqIGxpbmUsIGFuZCBjb2x1bW4gcG9zaXRpb25zIHByb3ZpZGVkLiBUaGUgb25seSBhcmd1bWVudCBpcyBhbiBvYmplY3Qgd2l0aFxuICogdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICpcbiAqICAgLSBzb3VyY2U6IFRoZSBmaWxlbmFtZSBvZiB0aGUgb3JpZ2luYWwgc291cmNlLlxuICogICAtIGxpbmU6IFRoZSBsaW5lIG51bWJlciBpbiB0aGUgb3JpZ2luYWwgc291cmNlLiAgVGhlIGxpbmUgbnVtYmVyXG4gKiAgICAgaXMgMS1iYXNlZC5cbiAqICAgLSBjb2x1bW46IFRoZSBjb2x1bW4gbnVtYmVyIGluIHRoZSBvcmlnaW5hbCBzb3VyY2UuICBUaGUgY29sdW1uXG4gKiAgICAgbnVtYmVyIGlzIDAtYmFzZWQuXG4gKlxuICogYW5kIGFuIG9iamVjdCBpcyByZXR1cm5lZCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gbGluZTogVGhlIGxpbmUgbnVtYmVyIGluIHRoZSBnZW5lcmF0ZWQgc291cmNlLCBvciBudWxsLiAgVGhlXG4gKiAgICAgbGluZSBudW1iZXIgaXMgMS1iYXNlZC4gXG4gKiAgIC0gY29sdW1uOiBUaGUgY29sdW1uIG51bWJlciBpbiB0aGUgZ2VuZXJhdGVkIHNvdXJjZSwgb3IgbnVsbC5cbiAqICAgICBUaGUgY29sdW1uIG51bWJlciBpcyAwLWJhc2VkLlxuICovXG5JbmRleGVkU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLmdlbmVyYXRlZFBvc2l0aW9uRm9yID1cbiAgZnVuY3Rpb24gSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyX2dlbmVyYXRlZFBvc2l0aW9uRm9yKGFBcmdzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9zZWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNlY3Rpb24gPSB0aGlzLl9zZWN0aW9uc1tpXTtcblxuICAgICAgLy8gT25seSBjb25zaWRlciB0aGlzIHNlY3Rpb24gaWYgdGhlIHJlcXVlc3RlZCBzb3VyY2UgaXMgaW4gdGhlIGxpc3Qgb2ZcbiAgICAgIC8vIHNvdXJjZXMgb2YgdGhlIGNvbnN1bWVyLlxuICAgICAgaWYgKHNlY3Rpb24uY29uc3VtZXIuX2ZpbmRTb3VyY2VJbmRleCh1dGlsLmdldEFyZyhhQXJncywgJ3NvdXJjZScpKSA9PT0gLTEpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICB2YXIgZ2VuZXJhdGVkUG9zaXRpb24gPSBzZWN0aW9uLmNvbnN1bWVyLmdlbmVyYXRlZFBvc2l0aW9uRm9yKGFBcmdzKTtcbiAgICAgIGlmIChnZW5lcmF0ZWRQb3NpdGlvbikge1xuICAgICAgICB2YXIgcmV0ID0ge1xuICAgICAgICAgIGxpbmU6IGdlbmVyYXRlZFBvc2l0aW9uLmxpbmUgK1xuICAgICAgICAgICAgKHNlY3Rpb24uZ2VuZXJhdGVkT2Zmc2V0LmdlbmVyYXRlZExpbmUgLSAxKSxcbiAgICAgICAgICBjb2x1bW46IGdlbmVyYXRlZFBvc2l0aW9uLmNvbHVtbiArXG4gICAgICAgICAgICAoc2VjdGlvbi5nZW5lcmF0ZWRPZmZzZXQuZ2VuZXJhdGVkTGluZSA9PT0gZ2VuZXJhdGVkUG9zaXRpb24ubGluZVxuICAgICAgICAgICAgID8gc2VjdGlvbi5nZW5lcmF0ZWRPZmZzZXQuZ2VuZXJhdGVkQ29sdW1uIC0gMVxuICAgICAgICAgICAgIDogMClcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgbGluZTogbnVsbCxcbiAgICAgIGNvbHVtbjogbnVsbFxuICAgIH07XG4gIH07XG5cbi8qKlxuICogUGFyc2UgdGhlIG1hcHBpbmdzIGluIGEgc3RyaW5nIGluIHRvIGEgZGF0YSBzdHJ1Y3R1cmUgd2hpY2ggd2UgY2FuIGVhc2lseVxuICogcXVlcnkgKHRoZSBvcmRlcmVkIGFycmF5cyBpbiB0aGUgYHRoaXMuX19nZW5lcmF0ZWRNYXBwaW5nc2AgYW5kXG4gKiBgdGhpcy5fX29yaWdpbmFsTWFwcGluZ3NgIHByb3BlcnRpZXMpLlxuICovXG5JbmRleGVkU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLl9wYXJzZU1hcHBpbmdzID1cbiAgZnVuY3Rpb24gSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyX3BhcnNlTWFwcGluZ3MoYVN0ciwgYVNvdXJjZVJvb3QpIHtcbiAgICB0aGlzLl9fZ2VuZXJhdGVkTWFwcGluZ3MgPSBbXTtcbiAgICB0aGlzLl9fb3JpZ2luYWxNYXBwaW5ncyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fc2VjdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzZWN0aW9uID0gdGhpcy5fc2VjdGlvbnNbaV07XG4gICAgICB2YXIgc2VjdGlvbk1hcHBpbmdzID0gc2VjdGlvbi5jb25zdW1lci5fZ2VuZXJhdGVkTWFwcGluZ3M7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHNlY3Rpb25NYXBwaW5ncy5sZW5ndGg7IGorKykge1xuICAgICAgICB2YXIgbWFwcGluZyA9IHNlY3Rpb25NYXBwaW5nc1tqXTtcblxuICAgICAgICB2YXIgc291cmNlID0gc2VjdGlvbi5jb25zdW1lci5fc291cmNlcy5hdChtYXBwaW5nLnNvdXJjZSk7XG4gICAgICAgIHNvdXJjZSA9IHV0aWwuY29tcHV0ZVNvdXJjZVVSTChzZWN0aW9uLmNvbnN1bWVyLnNvdXJjZVJvb3QsIHNvdXJjZSwgdGhpcy5fc291cmNlTWFwVVJMKTtcbiAgICAgICAgdGhpcy5fc291cmNlcy5hZGQoc291cmNlKTtcbiAgICAgICAgc291cmNlID0gdGhpcy5fc291cmNlcy5pbmRleE9mKHNvdXJjZSk7XG5cbiAgICAgICAgdmFyIG5hbWUgPSBudWxsO1xuICAgICAgICBpZiAobWFwcGluZy5uYW1lKSB7XG4gICAgICAgICAgbmFtZSA9IHNlY3Rpb24uY29uc3VtZXIuX25hbWVzLmF0KG1hcHBpbmcubmFtZSk7XG4gICAgICAgICAgdGhpcy5fbmFtZXMuYWRkKG5hbWUpO1xuICAgICAgICAgIG5hbWUgPSB0aGlzLl9uYW1lcy5pbmRleE9mKG5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlIG1hcHBpbmdzIGNvbWluZyBmcm9tIHRoZSBjb25zdW1lciBmb3IgdGhlIHNlY3Rpb24gaGF2ZVxuICAgICAgICAvLyBnZW5lcmF0ZWQgcG9zaXRpb25zIHJlbGF0aXZlIHRvIHRoZSBzdGFydCBvZiB0aGUgc2VjdGlvbiwgc28gd2VcbiAgICAgICAgLy8gbmVlZCB0byBvZmZzZXQgdGhlbSB0byBiZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgb2YgdGhlIGNvbmNhdGVuYXRlZFxuICAgICAgICAvLyBnZW5lcmF0ZWQgZmlsZS5cbiAgICAgICAgdmFyIGFkanVzdGVkTWFwcGluZyA9IHtcbiAgICAgICAgICBzb3VyY2U6IHNvdXJjZSxcbiAgICAgICAgICBnZW5lcmF0ZWRMaW5lOiBtYXBwaW5nLmdlbmVyYXRlZExpbmUgK1xuICAgICAgICAgICAgKHNlY3Rpb24uZ2VuZXJhdGVkT2Zmc2V0LmdlbmVyYXRlZExpbmUgLSAxKSxcbiAgICAgICAgICBnZW5lcmF0ZWRDb2x1bW46IG1hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uICtcbiAgICAgICAgICAgIChzZWN0aW9uLmdlbmVyYXRlZE9mZnNldC5nZW5lcmF0ZWRMaW5lID09PSBtYXBwaW5nLmdlbmVyYXRlZExpbmVcbiAgICAgICAgICAgID8gc2VjdGlvbi5nZW5lcmF0ZWRPZmZzZXQuZ2VuZXJhdGVkQ29sdW1uIC0gMVxuICAgICAgICAgICAgOiAwKSxcbiAgICAgICAgICBvcmlnaW5hbExpbmU6IG1hcHBpbmcub3JpZ2luYWxMaW5lLFxuICAgICAgICAgIG9yaWdpbmFsQ29sdW1uOiBtYXBwaW5nLm9yaWdpbmFsQ29sdW1uLFxuICAgICAgICAgIG5hbWU6IG5hbWVcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLl9fZ2VuZXJhdGVkTWFwcGluZ3MucHVzaChhZGp1c3RlZE1hcHBpbmcpO1xuICAgICAgICBpZiAodHlwZW9mIGFkanVzdGVkTWFwcGluZy5vcmlnaW5hbExpbmUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgdGhpcy5fX29yaWdpbmFsTWFwcGluZ3MucHVzaChhZGp1c3RlZE1hcHBpbmcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcXVpY2tTb3J0KHRoaXMuX19nZW5lcmF0ZWRNYXBwaW5ncywgdXRpbC5jb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNEZWZsYXRlZCk7XG4gICAgcXVpY2tTb3J0KHRoaXMuX19vcmlnaW5hbE1hcHBpbmdzLCB1dGlsLmNvbXBhcmVCeU9yaWdpbmFsUG9zaXRpb25zKTtcbiAgfTtcblxuZXhwb3J0cy5JbmRleGVkU291cmNlTWFwQ29uc3VtZXIgPSBJbmRleGVkU291cmNlTWFwQ29uc3VtZXI7XG4iLCAiLyogLSotIE1vZGU6IGpzOyBqcy1pbmRlbnQtbGV2ZWw6IDI7IC0qLSAqL1xuLypcbiAqIENvcHlyaWdodCAyMDExIE1vemlsbGEgRm91bmRhdGlvbiBhbmQgY29udHJpYnV0b3JzXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTmV3IEJTRCBsaWNlbnNlLiBTZWUgTElDRU5TRSBvcjpcbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9CU0QtMy1DbGF1c2VcbiAqL1xuXG52YXIgYmFzZTY0VkxRID0gcmVxdWlyZSgnLi9iYXNlNjQtdmxxJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIEFycmF5U2V0ID0gcmVxdWlyZSgnLi9hcnJheS1zZXQnKS5BcnJheVNldDtcbnZhciBNYXBwaW5nTGlzdCA9IHJlcXVpcmUoJy4vbWFwcGluZy1saXN0JykuTWFwcGluZ0xpc3Q7XG5cbi8qKlxuICogQW4gaW5zdGFuY2Ugb2YgdGhlIFNvdXJjZU1hcEdlbmVyYXRvciByZXByZXNlbnRzIGEgc291cmNlIG1hcCB3aGljaCBpc1xuICogYmVpbmcgYnVpbHQgaW5jcmVtZW50YWxseS4gWW91IG1heSBwYXNzIGFuIG9iamVjdCB3aXRoIHRoZSBmb2xsb3dpbmdcbiAqIHByb3BlcnRpZXM6XG4gKlxuICogICAtIGZpbGU6IFRoZSBmaWxlbmFtZSBvZiB0aGUgZ2VuZXJhdGVkIHNvdXJjZS5cbiAqICAgLSBzb3VyY2VSb290OiBBIHJvb3QgZm9yIGFsbCByZWxhdGl2ZSBVUkxzIGluIHRoaXMgc291cmNlIG1hcC5cbiAqL1xuZnVuY3Rpb24gU291cmNlTWFwR2VuZXJhdG9yKGFBcmdzKSB7XG4gIGlmICghYUFyZ3MpIHtcbiAgICBhQXJncyA9IHt9O1xuICB9XG4gIHRoaXMuX2ZpbGUgPSB1dGlsLmdldEFyZyhhQXJncywgJ2ZpbGUnLCBudWxsKTtcbiAgdGhpcy5fc291cmNlUm9vdCA9IHV0aWwuZ2V0QXJnKGFBcmdzLCAnc291cmNlUm9vdCcsIG51bGwpO1xuICB0aGlzLl9za2lwVmFsaWRhdGlvbiA9IHV0aWwuZ2V0QXJnKGFBcmdzLCAnc2tpcFZhbGlkYXRpb24nLCBmYWxzZSk7XG4gIHRoaXMuX3NvdXJjZXMgPSBuZXcgQXJyYXlTZXQoKTtcbiAgdGhpcy5fbmFtZXMgPSBuZXcgQXJyYXlTZXQoKTtcbiAgdGhpcy5fbWFwcGluZ3MgPSBuZXcgTWFwcGluZ0xpc3QoKTtcbiAgdGhpcy5fc291cmNlc0NvbnRlbnRzID0gbnVsbDtcbn1cblxuU291cmNlTWFwR2VuZXJhdG9yLnByb3RvdHlwZS5fdmVyc2lvbiA9IDM7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBTb3VyY2VNYXBHZW5lcmF0b3IgYmFzZWQgb24gYSBTb3VyY2VNYXBDb25zdW1lclxuICpcbiAqIEBwYXJhbSBhU291cmNlTWFwQ29uc3VtZXIgVGhlIFNvdXJjZU1hcC5cbiAqL1xuU291cmNlTWFwR2VuZXJhdG9yLmZyb21Tb3VyY2VNYXAgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBHZW5lcmF0b3JfZnJvbVNvdXJjZU1hcChhU291cmNlTWFwQ29uc3VtZXIpIHtcbiAgICB2YXIgc291cmNlUm9vdCA9IGFTb3VyY2VNYXBDb25zdW1lci5zb3VyY2VSb290O1xuICAgIHZhciBnZW5lcmF0b3IgPSBuZXcgU291cmNlTWFwR2VuZXJhdG9yKHtcbiAgICAgIGZpbGU6IGFTb3VyY2VNYXBDb25zdW1lci5maWxlLFxuICAgICAgc291cmNlUm9vdDogc291cmNlUm9vdFxuICAgIH0pO1xuICAgIGFTb3VyY2VNYXBDb25zdW1lci5lYWNoTWFwcGluZyhmdW5jdGlvbiAobWFwcGluZykge1xuICAgICAgdmFyIG5ld01hcHBpbmcgPSB7XG4gICAgICAgIGdlbmVyYXRlZDoge1xuICAgICAgICAgIGxpbmU6IG1hcHBpbmcuZ2VuZXJhdGVkTGluZSxcbiAgICAgICAgICBjb2x1bW46IG1hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uXG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGlmIChtYXBwaW5nLnNvdXJjZSAhPSBudWxsKSB7XG4gICAgICAgIG5ld01hcHBpbmcuc291cmNlID0gbWFwcGluZy5zb3VyY2U7XG4gICAgICAgIGlmIChzb3VyY2VSb290ICE9IG51bGwpIHtcbiAgICAgICAgICBuZXdNYXBwaW5nLnNvdXJjZSA9IHV0aWwucmVsYXRpdmUoc291cmNlUm9vdCwgbmV3TWFwcGluZy5zb3VyY2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgbmV3TWFwcGluZy5vcmlnaW5hbCA9IHtcbiAgICAgICAgICBsaW5lOiBtYXBwaW5nLm9yaWdpbmFsTGluZSxcbiAgICAgICAgICBjb2x1bW46IG1hcHBpbmcub3JpZ2luYWxDb2x1bW5cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAobWFwcGluZy5uYW1lICE9IG51bGwpIHtcbiAgICAgICAgICBuZXdNYXBwaW5nLm5hbWUgPSBtYXBwaW5nLm5hbWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZ2VuZXJhdG9yLmFkZE1hcHBpbmcobmV3TWFwcGluZyk7XG4gICAgfSk7XG4gICAgYVNvdXJjZU1hcENvbnN1bWVyLnNvdXJjZXMuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlRmlsZSkge1xuICAgICAgdmFyIHNvdXJjZVJlbGF0aXZlID0gc291cmNlRmlsZTtcbiAgICAgIGlmIChzb3VyY2VSb290ICE9PSBudWxsKSB7XG4gICAgICAgIHNvdXJjZVJlbGF0aXZlID0gdXRpbC5yZWxhdGl2ZShzb3VyY2VSb290LCBzb3VyY2VGaWxlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFnZW5lcmF0b3IuX3NvdXJjZXMuaGFzKHNvdXJjZVJlbGF0aXZlKSkge1xuICAgICAgICBnZW5lcmF0b3IuX3NvdXJjZXMuYWRkKHNvdXJjZVJlbGF0aXZlKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbnRlbnQgPSBhU291cmNlTWFwQ29uc3VtZXIuc291cmNlQ29udGVudEZvcihzb3VyY2VGaWxlKTtcbiAgICAgIGlmIChjb250ZW50ICE9IG51bGwpIHtcbiAgICAgICAgZ2VuZXJhdG9yLnNldFNvdXJjZUNvbnRlbnQoc291cmNlRmlsZSwgY29udGVudCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGdlbmVyYXRvcjtcbiAgfTtcblxuLyoqXG4gKiBBZGQgYSBzaW5nbGUgbWFwcGluZyBmcm9tIG9yaWdpbmFsIHNvdXJjZSBsaW5lIGFuZCBjb2x1bW4gdG8gdGhlIGdlbmVyYXRlZFxuICogc291cmNlJ3MgbGluZSBhbmQgY29sdW1uIGZvciB0aGlzIHNvdXJjZSBtYXAgYmVpbmcgY3JlYXRlZC4gVGhlIG1hcHBpbmdcbiAqIG9iamVjdCBzaG91bGQgaGF2ZSB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKlxuICogICAtIGdlbmVyYXRlZDogQW4gb2JqZWN0IHdpdGggdGhlIGdlbmVyYXRlZCBsaW5lIGFuZCBjb2x1bW4gcG9zaXRpb25zLlxuICogICAtIG9yaWdpbmFsOiBBbiBvYmplY3Qgd2l0aCB0aGUgb3JpZ2luYWwgbGluZSBhbmQgY29sdW1uIHBvc2l0aW9ucy5cbiAqICAgLSBzb3VyY2U6IFRoZSBvcmlnaW5hbCBzb3VyY2UgZmlsZSAocmVsYXRpdmUgdG8gdGhlIHNvdXJjZVJvb3QpLlxuICogICAtIG5hbWU6IEFuIG9wdGlvbmFsIG9yaWdpbmFsIHRva2VuIG5hbWUgZm9yIHRoaXMgbWFwcGluZy5cbiAqL1xuU291cmNlTWFwR2VuZXJhdG9yLnByb3RvdHlwZS5hZGRNYXBwaW5nID1cbiAgZnVuY3Rpb24gU291cmNlTWFwR2VuZXJhdG9yX2FkZE1hcHBpbmcoYUFyZ3MpIHtcbiAgICB2YXIgZ2VuZXJhdGVkID0gdXRpbC5nZXRBcmcoYUFyZ3MsICdnZW5lcmF0ZWQnKTtcbiAgICB2YXIgb3JpZ2luYWwgPSB1dGlsLmdldEFyZyhhQXJncywgJ29yaWdpbmFsJywgbnVsbCk7XG4gICAgdmFyIHNvdXJjZSA9IHV0aWwuZ2V0QXJnKGFBcmdzLCAnc291cmNlJywgbnVsbCk7XG4gICAgdmFyIG5hbWUgPSB1dGlsLmdldEFyZyhhQXJncywgJ25hbWUnLCBudWxsKTtcblxuICAgIGlmICghdGhpcy5fc2tpcFZhbGlkYXRpb24pIHtcbiAgICAgIHRoaXMuX3ZhbGlkYXRlTWFwcGluZyhnZW5lcmF0ZWQsIG9yaWdpbmFsLCBzb3VyY2UsIG5hbWUpO1xuICAgIH1cblxuICAgIGlmIChzb3VyY2UgIT0gbnVsbCkge1xuICAgICAgc291cmNlID0gU3RyaW5nKHNvdXJjZSk7XG4gICAgICBpZiAoIXRoaXMuX3NvdXJjZXMuaGFzKHNvdXJjZSkpIHtcbiAgICAgICAgdGhpcy5fc291cmNlcy5hZGQoc291cmNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobmFtZSAhPSBudWxsKSB7XG4gICAgICBuYW1lID0gU3RyaW5nKG5hbWUpO1xuICAgICAgaWYgKCF0aGlzLl9uYW1lcy5oYXMobmFtZSkpIHtcbiAgICAgICAgdGhpcy5fbmFtZXMuYWRkKG5hbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX21hcHBpbmdzLmFkZCh7XG4gICAgICBnZW5lcmF0ZWRMaW5lOiBnZW5lcmF0ZWQubGluZSxcbiAgICAgIGdlbmVyYXRlZENvbHVtbjogZ2VuZXJhdGVkLmNvbHVtbixcbiAgICAgIG9yaWdpbmFsTGluZTogb3JpZ2luYWwgIT0gbnVsbCAmJiBvcmlnaW5hbC5saW5lLFxuICAgICAgb3JpZ2luYWxDb2x1bW46IG9yaWdpbmFsICE9IG51bGwgJiYgb3JpZ2luYWwuY29sdW1uLFxuICAgICAgc291cmNlOiBzb3VyY2UsXG4gICAgICBuYW1lOiBuYW1lXG4gICAgfSk7XG4gIH07XG5cbi8qKlxuICogU2V0IHRoZSBzb3VyY2UgY29udGVudCBmb3IgYSBzb3VyY2UgZmlsZS5cbiAqL1xuU291cmNlTWFwR2VuZXJhdG9yLnByb3RvdHlwZS5zZXRTb3VyY2VDb250ZW50ID1cbiAgZnVuY3Rpb24gU291cmNlTWFwR2VuZXJhdG9yX3NldFNvdXJjZUNvbnRlbnQoYVNvdXJjZUZpbGUsIGFTb3VyY2VDb250ZW50KSB7XG4gICAgdmFyIHNvdXJjZSA9IGFTb3VyY2VGaWxlO1xuICAgIGlmICh0aGlzLl9zb3VyY2VSb290ICE9IG51bGwpIHtcbiAgICAgIHNvdXJjZSA9IHV0aWwucmVsYXRpdmUodGhpcy5fc291cmNlUm9vdCwgc291cmNlKTtcbiAgICB9XG5cbiAgICBpZiAoYVNvdXJjZUNvbnRlbnQgIT0gbnVsbCkge1xuICAgICAgLy8gQWRkIHRoZSBzb3VyY2UgY29udGVudCB0byB0aGUgX3NvdXJjZXNDb250ZW50cyBtYXAuXG4gICAgICAvLyBDcmVhdGUgYSBuZXcgX3NvdXJjZXNDb250ZW50cyBtYXAgaWYgdGhlIHByb3BlcnR5IGlzIG51bGwuXG4gICAgICBpZiAoIXRoaXMuX3NvdXJjZXNDb250ZW50cykge1xuICAgICAgICB0aGlzLl9zb3VyY2VzQ29udGVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgfVxuICAgICAgdGhpcy5fc291cmNlc0NvbnRlbnRzW3V0aWwudG9TZXRTdHJpbmcoc291cmNlKV0gPSBhU291cmNlQ29udGVudDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX3NvdXJjZXNDb250ZW50cykge1xuICAgICAgLy8gUmVtb3ZlIHRoZSBzb3VyY2UgZmlsZSBmcm9tIHRoZSBfc291cmNlc0NvbnRlbnRzIG1hcC5cbiAgICAgIC8vIElmIHRoZSBfc291cmNlc0NvbnRlbnRzIG1hcCBpcyBlbXB0eSwgc2V0IHRoZSBwcm9wZXJ0eSB0byBudWxsLlxuICAgICAgZGVsZXRlIHRoaXMuX3NvdXJjZXNDb250ZW50c1t1dGlsLnRvU2V0U3RyaW5nKHNvdXJjZSldO1xuICAgICAgaWYgKE9iamVjdC5rZXlzKHRoaXMuX3NvdXJjZXNDb250ZW50cykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMuX3NvdXJjZXNDb250ZW50cyA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4vKipcbiAqIEFwcGxpZXMgdGhlIG1hcHBpbmdzIG9mIGEgc3ViLXNvdXJjZS1tYXAgZm9yIGEgc3BlY2lmaWMgc291cmNlIGZpbGUgdG8gdGhlXG4gKiBzb3VyY2UgbWFwIGJlaW5nIGdlbmVyYXRlZC4gRWFjaCBtYXBwaW5nIHRvIHRoZSBzdXBwbGllZCBzb3VyY2UgZmlsZSBpc1xuICogcmV3cml0dGVuIHVzaW5nIHRoZSBzdXBwbGllZCBzb3VyY2UgbWFwLiBOb3RlOiBUaGUgcmVzb2x1dGlvbiBmb3IgdGhlXG4gKiByZXN1bHRpbmcgbWFwcGluZ3MgaXMgdGhlIG1pbmltaXVtIG9mIHRoaXMgbWFwIGFuZCB0aGUgc3VwcGxpZWQgbWFwLlxuICpcbiAqIEBwYXJhbSBhU291cmNlTWFwQ29uc3VtZXIgVGhlIHNvdXJjZSBtYXAgdG8gYmUgYXBwbGllZC5cbiAqIEBwYXJhbSBhU291cmNlRmlsZSBPcHRpb25hbC4gVGhlIGZpbGVuYW1lIG9mIHRoZSBzb3VyY2UgZmlsZS5cbiAqICAgICAgICBJZiBvbWl0dGVkLCBTb3VyY2VNYXBDb25zdW1lcidzIGZpbGUgcHJvcGVydHkgd2lsbCBiZSB1c2VkLlxuICogQHBhcmFtIGFTb3VyY2VNYXBQYXRoIE9wdGlvbmFsLiBUaGUgZGlybmFtZSBvZiB0aGUgcGF0aCB0byB0aGUgc291cmNlIG1hcFxuICogICAgICAgIHRvIGJlIGFwcGxpZWQuIElmIHJlbGF0aXZlLCBpdCBpcyByZWxhdGl2ZSB0byB0aGUgU291cmNlTWFwQ29uc3VtZXIuXG4gKiAgICAgICAgVGhpcyBwYXJhbWV0ZXIgaXMgbmVlZGVkIHdoZW4gdGhlIHR3byBzb3VyY2UgbWFwcyBhcmVuJ3QgaW4gdGhlIHNhbWVcbiAqICAgICAgICBkaXJlY3RvcnksIGFuZCB0aGUgc291cmNlIG1hcCB0byBiZSBhcHBsaWVkIGNvbnRhaW5zIHJlbGF0aXZlIHNvdXJjZVxuICogICAgICAgIHBhdGhzLiBJZiBzbywgdGhvc2UgcmVsYXRpdmUgc291cmNlIHBhdGhzIG5lZWQgdG8gYmUgcmV3cml0dGVuXG4gKiAgICAgICAgcmVsYXRpdmUgdG8gdGhlIFNvdXJjZU1hcEdlbmVyYXRvci5cbiAqL1xuU291cmNlTWFwR2VuZXJhdG9yLnByb3RvdHlwZS5hcHBseVNvdXJjZU1hcCA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcEdlbmVyYXRvcl9hcHBseVNvdXJjZU1hcChhU291cmNlTWFwQ29uc3VtZXIsIGFTb3VyY2VGaWxlLCBhU291cmNlTWFwUGF0aCkge1xuICAgIHZhciBzb3VyY2VGaWxlID0gYVNvdXJjZUZpbGU7XG4gICAgLy8gSWYgYVNvdXJjZUZpbGUgaXMgb21pdHRlZCwgd2Ugd2lsbCB1c2UgdGhlIGZpbGUgcHJvcGVydHkgb2YgdGhlIFNvdXJjZU1hcFxuICAgIGlmIChhU291cmNlRmlsZSA9PSBudWxsKSB7XG4gICAgICBpZiAoYVNvdXJjZU1hcENvbnN1bWVyLmZpbGUgPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ1NvdXJjZU1hcEdlbmVyYXRvci5wcm90b3R5cGUuYXBwbHlTb3VyY2VNYXAgcmVxdWlyZXMgZWl0aGVyIGFuIGV4cGxpY2l0IHNvdXJjZSBmaWxlLCAnICtcbiAgICAgICAgICAnb3IgdGhlIHNvdXJjZSBtYXBcXCdzIFwiZmlsZVwiIHByb3BlcnR5LiBCb3RoIHdlcmUgb21pdHRlZC4nXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBzb3VyY2VGaWxlID0gYVNvdXJjZU1hcENvbnN1bWVyLmZpbGU7XG4gICAgfVxuICAgIHZhciBzb3VyY2VSb290ID0gdGhpcy5fc291cmNlUm9vdDtcbiAgICAvLyBNYWtlIFwic291cmNlRmlsZVwiIHJlbGF0aXZlIGlmIGFuIGFic29sdXRlIFVybCBpcyBwYXNzZWQuXG4gICAgaWYgKHNvdXJjZVJvb3QgIT0gbnVsbCkge1xuICAgICAgc291cmNlRmlsZSA9IHV0aWwucmVsYXRpdmUoc291cmNlUm9vdCwgc291cmNlRmlsZSk7XG4gICAgfVxuICAgIC8vIEFwcGx5aW5nIHRoZSBTb3VyY2VNYXAgY2FuIGFkZCBhbmQgcmVtb3ZlIGl0ZW1zIGZyb20gdGhlIHNvdXJjZXMgYW5kXG4gICAgLy8gdGhlIG5hbWVzIGFycmF5LlxuICAgIHZhciBuZXdTb3VyY2VzID0gbmV3IEFycmF5U2V0KCk7XG4gICAgdmFyIG5ld05hbWVzID0gbmV3IEFycmF5U2V0KCk7XG5cbiAgICAvLyBGaW5kIG1hcHBpbmdzIGZvciB0aGUgXCJzb3VyY2VGaWxlXCJcbiAgICB0aGlzLl9tYXBwaW5ncy51bnNvcnRlZEZvckVhY2goZnVuY3Rpb24gKG1hcHBpbmcpIHtcbiAgICAgIGlmIChtYXBwaW5nLnNvdXJjZSA9PT0gc291cmNlRmlsZSAmJiBtYXBwaW5nLm9yaWdpbmFsTGluZSAhPSBudWxsKSB7XG4gICAgICAgIC8vIENoZWNrIGlmIGl0IGNhbiBiZSBtYXBwZWQgYnkgdGhlIHNvdXJjZSBtYXAsIHRoZW4gdXBkYXRlIHRoZSBtYXBwaW5nLlxuICAgICAgICB2YXIgb3JpZ2luYWwgPSBhU291cmNlTWFwQ29uc3VtZXIub3JpZ2luYWxQb3NpdGlvbkZvcih7XG4gICAgICAgICAgbGluZTogbWFwcGluZy5vcmlnaW5hbExpbmUsXG4gICAgICAgICAgY29sdW1uOiBtYXBwaW5nLm9yaWdpbmFsQ29sdW1uXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAob3JpZ2luYWwuc291cmNlICE9IG51bGwpIHtcbiAgICAgICAgICAvLyBDb3B5IG1hcHBpbmdcbiAgICAgICAgICBtYXBwaW5nLnNvdXJjZSA9IG9yaWdpbmFsLnNvdXJjZTtcbiAgICAgICAgICBpZiAoYVNvdXJjZU1hcFBhdGggIT0gbnVsbCkge1xuICAgICAgICAgICAgbWFwcGluZy5zb3VyY2UgPSB1dGlsLmpvaW4oYVNvdXJjZU1hcFBhdGgsIG1hcHBpbmcuc291cmNlKVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoc291cmNlUm9vdCAhPSBudWxsKSB7XG4gICAgICAgICAgICBtYXBwaW5nLnNvdXJjZSA9IHV0aWwucmVsYXRpdmUoc291cmNlUm9vdCwgbWFwcGluZy5zb3VyY2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBtYXBwaW5nLm9yaWdpbmFsTGluZSA9IG9yaWdpbmFsLmxpbmU7XG4gICAgICAgICAgbWFwcGluZy5vcmlnaW5hbENvbHVtbiA9IG9yaWdpbmFsLmNvbHVtbjtcbiAgICAgICAgICBpZiAob3JpZ2luYWwubmFtZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBtYXBwaW5nLm5hbWUgPSBvcmlnaW5hbC5uYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgc291cmNlID0gbWFwcGluZy5zb3VyY2U7XG4gICAgICBpZiAoc291cmNlICE9IG51bGwgJiYgIW5ld1NvdXJjZXMuaGFzKHNvdXJjZSkpIHtcbiAgICAgICAgbmV3U291cmNlcy5hZGQoc291cmNlKTtcbiAgICAgIH1cblxuICAgICAgdmFyIG5hbWUgPSBtYXBwaW5nLm5hbWU7XG4gICAgICBpZiAobmFtZSAhPSBudWxsICYmICFuZXdOYW1lcy5oYXMobmFtZSkpIHtcbiAgICAgICAgbmV3TmFtZXMuYWRkKG5hbWUpO1xuICAgICAgfVxuXG4gICAgfSwgdGhpcyk7XG4gICAgdGhpcy5fc291cmNlcyA9IG5ld1NvdXJjZXM7XG4gICAgdGhpcy5fbmFtZXMgPSBuZXdOYW1lcztcblxuICAgIC8vIENvcHkgc291cmNlc0NvbnRlbnRzIG9mIGFwcGxpZWQgbWFwLlxuICAgIGFTb3VyY2VNYXBDb25zdW1lci5zb3VyY2VzLmZvckVhY2goZnVuY3Rpb24gKHNvdXJjZUZpbGUpIHtcbiAgICAgIHZhciBjb250ZW50ID0gYVNvdXJjZU1hcENvbnN1bWVyLnNvdXJjZUNvbnRlbnRGb3Ioc291cmNlRmlsZSk7XG4gICAgICBpZiAoY29udGVudCAhPSBudWxsKSB7XG4gICAgICAgIGlmIChhU291cmNlTWFwUGF0aCAhPSBudWxsKSB7XG4gICAgICAgICAgc291cmNlRmlsZSA9IHV0aWwuam9pbihhU291cmNlTWFwUGF0aCwgc291cmNlRmlsZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNvdXJjZVJvb3QgIT0gbnVsbCkge1xuICAgICAgICAgIHNvdXJjZUZpbGUgPSB1dGlsLnJlbGF0aXZlKHNvdXJjZVJvb3QsIHNvdXJjZUZpbGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0U291cmNlQ29udGVudChzb3VyY2VGaWxlLCBjb250ZW50KTtcbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgfTtcblxuLyoqXG4gKiBBIG1hcHBpbmcgY2FuIGhhdmUgb25lIG9mIHRoZSB0aHJlZSBsZXZlbHMgb2YgZGF0YTpcbiAqXG4gKiAgIDEuIEp1c3QgdGhlIGdlbmVyYXRlZCBwb3NpdGlvbi5cbiAqICAgMi4gVGhlIEdlbmVyYXRlZCBwb3NpdGlvbiwgb3JpZ2luYWwgcG9zaXRpb24sIGFuZCBvcmlnaW5hbCBzb3VyY2UuXG4gKiAgIDMuIEdlbmVyYXRlZCBhbmQgb3JpZ2luYWwgcG9zaXRpb24sIG9yaWdpbmFsIHNvdXJjZSwgYXMgd2VsbCBhcyBhIG5hbWVcbiAqICAgICAgdG9rZW4uXG4gKlxuICogVG8gbWFpbnRhaW4gY29uc2lzdGVuY3ksIHdlIHZhbGlkYXRlIHRoYXQgYW55IG5ldyBtYXBwaW5nIGJlaW5nIGFkZGVkIGZhbGxzXG4gKiBpbiB0byBvbmUgb2YgdGhlc2UgY2F0ZWdvcmllcy5cbiAqL1xuU291cmNlTWFwR2VuZXJhdG9yLnByb3RvdHlwZS5fdmFsaWRhdGVNYXBwaW5nID1cbiAgZnVuY3Rpb24gU291cmNlTWFwR2VuZXJhdG9yX3ZhbGlkYXRlTWFwcGluZyhhR2VuZXJhdGVkLCBhT3JpZ2luYWwsIGFTb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYU5hbWUpIHtcbiAgICAvLyBXaGVuIGFPcmlnaW5hbCBpcyB0cnV0aHkgYnV0IGhhcyBlbXB0eSB2YWx1ZXMgZm9yIC5saW5lIGFuZCAuY29sdW1uLFxuICAgIC8vIGl0IGlzIG1vc3QgbGlrZWx5IGEgcHJvZ3JhbW1lciBlcnJvci4gSW4gdGhpcyBjYXNlIHdlIHRocm93IGEgdmVyeVxuICAgIC8vIHNwZWNpZmljIGVycm9yIG1lc3NhZ2UgdG8gdHJ5IHRvIGd1aWRlIHRoZW0gdGhlIHJpZ2h0IHdheS5cbiAgICAvLyBGb3IgZXhhbXBsZTogaHR0cHM6Ly9naXRodWIuY29tL1BvbHltZXIvcG9seW1lci1idW5kbGVyL3B1bGwvNTE5XG4gICAgaWYgKGFPcmlnaW5hbCAmJiB0eXBlb2YgYU9yaWdpbmFsLmxpbmUgIT09ICdudW1iZXInICYmIHR5cGVvZiBhT3JpZ2luYWwuY29sdW1uICE9PSAnbnVtYmVyJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAnb3JpZ2luYWwubGluZSBhbmQgb3JpZ2luYWwuY29sdW1uIGFyZSBub3QgbnVtYmVycyAtLSB5b3UgcHJvYmFibHkgbWVhbnQgdG8gb21pdCAnICtcbiAgICAgICAgICAgICd0aGUgb3JpZ2luYWwgbWFwcGluZyBlbnRpcmVseSBhbmQgb25seSBtYXAgdGhlIGdlbmVyYXRlZCBwb3NpdGlvbi4gSWYgc28sIHBhc3MgJyArXG4gICAgICAgICAgICAnbnVsbCBmb3IgdGhlIG9yaWdpbmFsIG1hcHBpbmcgaW5zdGVhZCBvZiBhbiBvYmplY3Qgd2l0aCBlbXB0eSBvciBudWxsIHZhbHVlcy4nXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKGFHZW5lcmF0ZWQgJiYgJ2xpbmUnIGluIGFHZW5lcmF0ZWQgJiYgJ2NvbHVtbicgaW4gYUdlbmVyYXRlZFxuICAgICAgICAmJiBhR2VuZXJhdGVkLmxpbmUgPiAwICYmIGFHZW5lcmF0ZWQuY29sdW1uID49IDBcbiAgICAgICAgJiYgIWFPcmlnaW5hbCAmJiAhYVNvdXJjZSAmJiAhYU5hbWUpIHtcbiAgICAgIC8vIENhc2UgMS5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZWxzZSBpZiAoYUdlbmVyYXRlZCAmJiAnbGluZScgaW4gYUdlbmVyYXRlZCAmJiAnY29sdW1uJyBpbiBhR2VuZXJhdGVkXG4gICAgICAgICAgICAgJiYgYU9yaWdpbmFsICYmICdsaW5lJyBpbiBhT3JpZ2luYWwgJiYgJ2NvbHVtbicgaW4gYU9yaWdpbmFsXG4gICAgICAgICAgICAgJiYgYUdlbmVyYXRlZC5saW5lID4gMCAmJiBhR2VuZXJhdGVkLmNvbHVtbiA+PSAwXG4gICAgICAgICAgICAgJiYgYU9yaWdpbmFsLmxpbmUgPiAwICYmIGFPcmlnaW5hbC5jb2x1bW4gPj0gMFxuICAgICAgICAgICAgICYmIGFTb3VyY2UpIHtcbiAgICAgIC8vIENhc2VzIDIgYW5kIDMuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIG1hcHBpbmc6ICcgKyBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIGdlbmVyYXRlZDogYUdlbmVyYXRlZCxcbiAgICAgICAgc291cmNlOiBhU291cmNlLFxuICAgICAgICBvcmlnaW5hbDogYU9yaWdpbmFsLFxuICAgICAgICBuYW1lOiBhTmFtZVxuICAgICAgfSkpO1xuICAgIH1cbiAgfTtcblxuLyoqXG4gKiBTZXJpYWxpemUgdGhlIGFjY3VtdWxhdGVkIG1hcHBpbmdzIGluIHRvIHRoZSBzdHJlYW0gb2YgYmFzZSA2NCBWTFFzXG4gKiBzcGVjaWZpZWQgYnkgdGhlIHNvdXJjZSBtYXAgZm9ybWF0LlxuICovXG5Tb3VyY2VNYXBHZW5lcmF0b3IucHJvdG90eXBlLl9zZXJpYWxpemVNYXBwaW5ncyA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcEdlbmVyYXRvcl9zZXJpYWxpemVNYXBwaW5ncygpIHtcbiAgICB2YXIgcHJldmlvdXNHZW5lcmF0ZWRDb2x1bW4gPSAwO1xuICAgIHZhciBwcmV2aW91c0dlbmVyYXRlZExpbmUgPSAxO1xuICAgIHZhciBwcmV2aW91c09yaWdpbmFsQ29sdW1uID0gMDtcbiAgICB2YXIgcHJldmlvdXNPcmlnaW5hbExpbmUgPSAwO1xuICAgIHZhciBwcmV2aW91c05hbWUgPSAwO1xuICAgIHZhciBwcmV2aW91c1NvdXJjZSA9IDA7XG4gICAgdmFyIHJlc3VsdCA9ICcnO1xuICAgIHZhciBuZXh0O1xuICAgIHZhciBtYXBwaW5nO1xuICAgIHZhciBuYW1lSWR4O1xuICAgIHZhciBzb3VyY2VJZHg7XG5cbiAgICB2YXIgbWFwcGluZ3MgPSB0aGlzLl9tYXBwaW5ncy50b0FycmF5KCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IG1hcHBpbmdzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBtYXBwaW5nID0gbWFwcGluZ3NbaV07XG4gICAgICBuZXh0ID0gJydcblxuICAgICAgaWYgKG1hcHBpbmcuZ2VuZXJhdGVkTGluZSAhPT0gcHJldmlvdXNHZW5lcmF0ZWRMaW5lKSB7XG4gICAgICAgIHByZXZpb3VzR2VuZXJhdGVkQ29sdW1uID0gMDtcbiAgICAgICAgd2hpbGUgKG1hcHBpbmcuZ2VuZXJhdGVkTGluZSAhPT0gcHJldmlvdXNHZW5lcmF0ZWRMaW5lKSB7XG4gICAgICAgICAgbmV4dCArPSAnOyc7XG4gICAgICAgICAgcHJldmlvdXNHZW5lcmF0ZWRMaW5lKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBpZiAoaSA+IDApIHtcbiAgICAgICAgICBpZiAoIXV0aWwuY29tcGFyZUJ5R2VuZXJhdGVkUG9zaXRpb25zSW5mbGF0ZWQobWFwcGluZywgbWFwcGluZ3NbaSAtIDFdKSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIG5leHQgKz0gJywnO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIG5leHQgKz0gYmFzZTY0VkxRLmVuY29kZShtYXBwaW5nLmdlbmVyYXRlZENvbHVtblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBwcmV2aW91c0dlbmVyYXRlZENvbHVtbik7XG4gICAgICBwcmV2aW91c0dlbmVyYXRlZENvbHVtbiA9IG1hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uO1xuXG4gICAgICBpZiAobWFwcGluZy5zb3VyY2UgIT0gbnVsbCkge1xuICAgICAgICBzb3VyY2VJZHggPSB0aGlzLl9zb3VyY2VzLmluZGV4T2YobWFwcGluZy5zb3VyY2UpO1xuICAgICAgICBuZXh0ICs9IGJhc2U2NFZMUS5lbmNvZGUoc291cmNlSWR4IC0gcHJldmlvdXNTb3VyY2UpO1xuICAgICAgICBwcmV2aW91c1NvdXJjZSA9IHNvdXJjZUlkeDtcblxuICAgICAgICAvLyBsaW5lcyBhcmUgc3RvcmVkIDAtYmFzZWQgaW4gU291cmNlTWFwIHNwZWMgdmVyc2lvbiAzXG4gICAgICAgIG5leHQgKz0gYmFzZTY0VkxRLmVuY29kZShtYXBwaW5nLm9yaWdpbmFsTGluZSAtIDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBwcmV2aW91c09yaWdpbmFsTGluZSk7XG4gICAgICAgIHByZXZpb3VzT3JpZ2luYWxMaW5lID0gbWFwcGluZy5vcmlnaW5hbExpbmUgLSAxO1xuXG4gICAgICAgIG5leHQgKz0gYmFzZTY0VkxRLmVuY29kZShtYXBwaW5nLm9yaWdpbmFsQ29sdW1uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gcHJldmlvdXNPcmlnaW5hbENvbHVtbik7XG4gICAgICAgIHByZXZpb3VzT3JpZ2luYWxDb2x1bW4gPSBtYXBwaW5nLm9yaWdpbmFsQ29sdW1uO1xuXG4gICAgICAgIGlmIChtYXBwaW5nLm5hbWUgIT0gbnVsbCkge1xuICAgICAgICAgIG5hbWVJZHggPSB0aGlzLl9uYW1lcy5pbmRleE9mKG1hcHBpbmcubmFtZSk7XG4gICAgICAgICAgbmV4dCArPSBiYXNlNjRWTFEuZW5jb2RlKG5hbWVJZHggLSBwcmV2aW91c05hbWUpO1xuICAgICAgICAgIHByZXZpb3VzTmFtZSA9IG5hbWVJZHg7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmVzdWx0ICs9IG5leHQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuU291cmNlTWFwR2VuZXJhdG9yLnByb3RvdHlwZS5fZ2VuZXJhdGVTb3VyY2VzQ29udGVudCA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcEdlbmVyYXRvcl9nZW5lcmF0ZVNvdXJjZXNDb250ZW50KGFTb3VyY2VzLCBhU291cmNlUm9vdCkge1xuICAgIHJldHVybiBhU291cmNlcy5tYXAoZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgICAgaWYgKCF0aGlzLl9zb3VyY2VzQ29udGVudHMpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICBpZiAoYVNvdXJjZVJvb3QgIT0gbnVsbCkge1xuICAgICAgICBzb3VyY2UgPSB1dGlsLnJlbGF0aXZlKGFTb3VyY2VSb290LCBzb3VyY2UpO1xuICAgICAgfVxuICAgICAgdmFyIGtleSA9IHV0aWwudG9TZXRTdHJpbmcoc291cmNlKTtcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGhpcy5fc291cmNlc0NvbnRlbnRzLCBrZXkpXG4gICAgICAgID8gdGhpcy5fc291cmNlc0NvbnRlbnRzW2tleV1cbiAgICAgICAgOiBudWxsO1xuICAgIH0sIHRoaXMpO1xuICB9O1xuXG4vKipcbiAqIEV4dGVybmFsaXplIHRoZSBzb3VyY2UgbWFwLlxuICovXG5Tb3VyY2VNYXBHZW5lcmF0b3IucHJvdG90eXBlLnRvSlNPTiA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcEdlbmVyYXRvcl90b0pTT04oKSB7XG4gICAgdmFyIG1hcCA9IHtcbiAgICAgIHZlcnNpb246IHRoaXMuX3ZlcnNpb24sXG4gICAgICBzb3VyY2VzOiB0aGlzLl9zb3VyY2VzLnRvQXJyYXkoKSxcbiAgICAgIG5hbWVzOiB0aGlzLl9uYW1lcy50b0FycmF5KCksXG4gICAgICBtYXBwaW5nczogdGhpcy5fc2VyaWFsaXplTWFwcGluZ3MoKVxuICAgIH07XG4gICAgaWYgKHRoaXMuX2ZpbGUgIT0gbnVsbCkge1xuICAgICAgbWFwLmZpbGUgPSB0aGlzLl9maWxlO1xuICAgIH1cbiAgICBpZiAodGhpcy5fc291cmNlUm9vdCAhPSBudWxsKSB7XG4gICAgICBtYXAuc291cmNlUm9vdCA9IHRoaXMuX3NvdXJjZVJvb3Q7XG4gICAgfVxuICAgIGlmICh0aGlzLl9zb3VyY2VzQ29udGVudHMpIHtcbiAgICAgIG1hcC5zb3VyY2VzQ29udGVudCA9IHRoaXMuX2dlbmVyYXRlU291cmNlc0NvbnRlbnQobWFwLnNvdXJjZXMsIG1hcC5zb3VyY2VSb290KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWFwO1xuICB9O1xuXG4vKipcbiAqIFJlbmRlciB0aGUgc291cmNlIG1hcCBiZWluZyBnZW5lcmF0ZWQgdG8gYSBzdHJpbmcuXG4gKi9cblNvdXJjZU1hcEdlbmVyYXRvci5wcm90b3R5cGUudG9TdHJpbmcgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBHZW5lcmF0b3JfdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMudG9KU09OKCkpO1xuICB9O1xuXG5leHBvcnRzLlNvdXJjZU1hcEdlbmVyYXRvciA9IFNvdXJjZU1hcEdlbmVyYXRvcjtcbiIsICIvKiAtKi0gTW9kZToganM7IGpzLWluZGVudC1sZXZlbDogMjsgLSotICovXG4vKlxuICogQ29weXJpZ2h0IDIwMTEgTW96aWxsYSBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnNcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICovXG5cbnZhciBTb3VyY2VNYXBHZW5lcmF0b3IgPSByZXF1aXJlKCcuL3NvdXJjZS1tYXAtZ2VuZXJhdG9yJykuU291cmNlTWFwR2VuZXJhdG9yO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxuLy8gTWF0Y2hlcyBhIFdpbmRvd3Mtc3R5bGUgYFxcclxcbmAgbmV3bGluZSBvciBhIGBcXG5gIG5ld2xpbmUgdXNlZCBieSBhbGwgb3RoZXJcbi8vIG9wZXJhdGluZyBzeXN0ZW1zIHRoZXNlIGRheXMgKGNhcHR1cmluZyB0aGUgcmVzdWx0KS5cbnZhciBSRUdFWF9ORVdMSU5FID0gLyhcXHI/XFxuKS87XG5cbi8vIE5ld2xpbmUgY2hhcmFjdGVyIGNvZGUgZm9yIGNoYXJDb2RlQXQoKSBjb21wYXJpc29uc1xudmFyIE5FV0xJTkVfQ09ERSA9IDEwO1xuXG4vLyBQcml2YXRlIHN5bWJvbCBmb3IgaWRlbnRpZnlpbmcgYFNvdXJjZU5vZGVgcyB3aGVuIG11bHRpcGxlIHZlcnNpb25zIG9mXG4vLyB0aGUgc291cmNlLW1hcCBsaWJyYXJ5IGFyZSBsb2FkZWQuIFRoaXMgTVVTVCBOT1QgQ0hBTkdFIGFjcm9zc1xuLy8gdmVyc2lvbnMhXG52YXIgaXNTb3VyY2VOb2RlID0gXCIkJCRpc1NvdXJjZU5vZGUkJCRcIjtcblxuLyoqXG4gKiBTb3VyY2VOb2RlcyBwcm92aWRlIGEgd2F5IHRvIGFic3RyYWN0IG92ZXIgaW50ZXJwb2xhdGluZy9jb25jYXRlbmF0aW5nXG4gKiBzbmlwcGV0cyBvZiBnZW5lcmF0ZWQgSmF2YVNjcmlwdCBzb3VyY2UgY29kZSB3aGlsZSBtYWludGFpbmluZyB0aGUgbGluZSBhbmRcbiAqIGNvbHVtbiBpbmZvcm1hdGlvbiBhc3NvY2lhdGVkIHdpdGggdGhlIG9yaWdpbmFsIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBwYXJhbSBhTGluZSBUaGUgb3JpZ2luYWwgbGluZSBudW1iZXIuXG4gKiBAcGFyYW0gYUNvbHVtbiBUaGUgb3JpZ2luYWwgY29sdW1uIG51bWJlci5cbiAqIEBwYXJhbSBhU291cmNlIFRoZSBvcmlnaW5hbCBzb3VyY2UncyBmaWxlbmFtZS5cbiAqIEBwYXJhbSBhQ2h1bmtzIE9wdGlvbmFsLiBBbiBhcnJheSBvZiBzdHJpbmdzIHdoaWNoIGFyZSBzbmlwcGV0cyBvZlxuICogICAgICAgIGdlbmVyYXRlZCBKUywgb3Igb3RoZXIgU291cmNlTm9kZXMuXG4gKiBAcGFyYW0gYU5hbWUgVGhlIG9yaWdpbmFsIGlkZW50aWZpZXIuXG4gKi9cbmZ1bmN0aW9uIFNvdXJjZU5vZGUoYUxpbmUsIGFDb2x1bW4sIGFTb3VyY2UsIGFDaHVua3MsIGFOYW1lKSB7XG4gIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgdGhpcy5zb3VyY2VDb250ZW50cyA9IHt9O1xuICB0aGlzLmxpbmUgPSBhTGluZSA9PSBudWxsID8gbnVsbCA6IGFMaW5lO1xuICB0aGlzLmNvbHVtbiA9IGFDb2x1bW4gPT0gbnVsbCA/IG51bGwgOiBhQ29sdW1uO1xuICB0aGlzLnNvdXJjZSA9IGFTb3VyY2UgPT0gbnVsbCA/IG51bGwgOiBhU291cmNlO1xuICB0aGlzLm5hbWUgPSBhTmFtZSA9PSBudWxsID8gbnVsbCA6IGFOYW1lO1xuICB0aGlzW2lzU291cmNlTm9kZV0gPSB0cnVlO1xuICBpZiAoYUNodW5rcyAhPSBudWxsKSB0aGlzLmFkZChhQ2h1bmtzKTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgU291cmNlTm9kZSBmcm9tIGdlbmVyYXRlZCBjb2RlIGFuZCBhIFNvdXJjZU1hcENvbnN1bWVyLlxuICpcbiAqIEBwYXJhbSBhR2VuZXJhdGVkQ29kZSBUaGUgZ2VuZXJhdGVkIGNvZGVcbiAqIEBwYXJhbSBhU291cmNlTWFwQ29uc3VtZXIgVGhlIFNvdXJjZU1hcCBmb3IgdGhlIGdlbmVyYXRlZCBjb2RlXG4gKiBAcGFyYW0gYVJlbGF0aXZlUGF0aCBPcHRpb25hbC4gVGhlIHBhdGggdGhhdCByZWxhdGl2ZSBzb3VyY2VzIGluIHRoZVxuICogICAgICAgIFNvdXJjZU1hcENvbnN1bWVyIHNob3VsZCBiZSByZWxhdGl2ZSB0by5cbiAqL1xuU291cmNlTm9kZS5mcm9tU3RyaW5nV2l0aFNvdXJjZU1hcCA9XG4gIGZ1bmN0aW9uIFNvdXJjZU5vZGVfZnJvbVN0cmluZ1dpdGhTb3VyY2VNYXAoYUdlbmVyYXRlZENvZGUsIGFTb3VyY2VNYXBDb25zdW1lciwgYVJlbGF0aXZlUGF0aCkge1xuICAgIC8vIFRoZSBTb3VyY2VOb2RlIHdlIHdhbnQgdG8gZmlsbCB3aXRoIHRoZSBnZW5lcmF0ZWQgY29kZVxuICAgIC8vIGFuZCB0aGUgU291cmNlTWFwXG4gICAgdmFyIG5vZGUgPSBuZXcgU291cmNlTm9kZSgpO1xuXG4gICAgLy8gQWxsIGV2ZW4gaW5kaWNlcyBvZiB0aGlzIGFycmF5IGFyZSBvbmUgbGluZSBvZiB0aGUgZ2VuZXJhdGVkIGNvZGUsXG4gICAgLy8gd2hpbGUgYWxsIG9kZCBpbmRpY2VzIGFyZSB0aGUgbmV3bGluZXMgYmV0d2VlbiB0d28gYWRqYWNlbnQgbGluZXNcbiAgICAvLyAoc2luY2UgYFJFR0VYX05FV0xJTkVgIGNhcHR1cmVzIGl0cyBtYXRjaCkuXG4gICAgLy8gUHJvY2Vzc2VkIGZyYWdtZW50cyBhcmUgYWNjZXNzZWQgYnkgY2FsbGluZyBgc2hpZnROZXh0TGluZWAuXG4gICAgdmFyIHJlbWFpbmluZ0xpbmVzID0gYUdlbmVyYXRlZENvZGUuc3BsaXQoUkVHRVhfTkVXTElORSk7XG4gICAgdmFyIHJlbWFpbmluZ0xpbmVzSW5kZXggPSAwO1xuICAgIHZhciBzaGlmdE5leHRMaW5lID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbGluZUNvbnRlbnRzID0gZ2V0TmV4dExpbmUoKTtcbiAgICAgIC8vIFRoZSBsYXN0IGxpbmUgb2YgYSBmaWxlIG1pZ2h0IG5vdCBoYXZlIGEgbmV3bGluZS5cbiAgICAgIHZhciBuZXdMaW5lID0gZ2V0TmV4dExpbmUoKSB8fCBcIlwiO1xuICAgICAgcmV0dXJuIGxpbmVDb250ZW50cyArIG5ld0xpbmU7XG5cbiAgICAgIGZ1bmN0aW9uIGdldE5leHRMaW5lKCkge1xuICAgICAgICByZXR1cm4gcmVtYWluaW5nTGluZXNJbmRleCA8IHJlbWFpbmluZ0xpbmVzLmxlbmd0aCA/XG4gICAgICAgICAgICByZW1haW5pbmdMaW5lc1tyZW1haW5pbmdMaW5lc0luZGV4KytdIDogdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBXZSBuZWVkIHRvIHJlbWVtYmVyIHRoZSBwb3NpdGlvbiBvZiBcInJlbWFpbmluZ0xpbmVzXCJcbiAgICB2YXIgbGFzdEdlbmVyYXRlZExpbmUgPSAxLCBsYXN0R2VuZXJhdGVkQ29sdW1uID0gMDtcblxuICAgIC8vIFRoZSBnZW5lcmF0ZSBTb3VyY2VOb2RlcyB3ZSBuZWVkIGEgY29kZSByYW5nZS5cbiAgICAvLyBUbyBleHRyYWN0IGl0IGN1cnJlbnQgYW5kIGxhc3QgbWFwcGluZyBpcyB1c2VkLlxuICAgIC8vIEhlcmUgd2Ugc3RvcmUgdGhlIGxhc3QgbWFwcGluZy5cbiAgICB2YXIgbGFzdE1hcHBpbmcgPSBudWxsO1xuXG4gICAgYVNvdXJjZU1hcENvbnN1bWVyLmVhY2hNYXBwaW5nKGZ1bmN0aW9uIChtYXBwaW5nKSB7XG4gICAgICBpZiAobGFzdE1hcHBpbmcgIT09IG51bGwpIHtcbiAgICAgICAgLy8gV2UgYWRkIHRoZSBjb2RlIGZyb20gXCJsYXN0TWFwcGluZ1wiIHRvIFwibWFwcGluZ1wiOlxuICAgICAgICAvLyBGaXJzdCBjaGVjayBpZiB0aGVyZSBpcyBhIG5ldyBsaW5lIGluIGJldHdlZW4uXG4gICAgICAgIGlmIChsYXN0R2VuZXJhdGVkTGluZSA8IG1hcHBpbmcuZ2VuZXJhdGVkTGluZSkge1xuICAgICAgICAgIC8vIEFzc29jaWF0ZSBmaXJzdCBsaW5lIHdpdGggXCJsYXN0TWFwcGluZ1wiXG4gICAgICAgICAgYWRkTWFwcGluZ1dpdGhDb2RlKGxhc3RNYXBwaW5nLCBzaGlmdE5leHRMaW5lKCkpO1xuICAgICAgICAgIGxhc3RHZW5lcmF0ZWRMaW5lKys7XG4gICAgICAgICAgbGFzdEdlbmVyYXRlZENvbHVtbiA9IDA7XG4gICAgICAgICAgLy8gVGhlIHJlbWFpbmluZyBjb2RlIGlzIGFkZGVkIHdpdGhvdXQgbWFwcGluZ1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFRoZXJlIGlzIG5vIG5ldyBsaW5lIGluIGJldHdlZW4uXG4gICAgICAgICAgLy8gQXNzb2NpYXRlIHRoZSBjb2RlIGJldHdlZW4gXCJsYXN0R2VuZXJhdGVkQ29sdW1uXCIgYW5kXG4gICAgICAgICAgLy8gXCJtYXBwaW5nLmdlbmVyYXRlZENvbHVtblwiIHdpdGggXCJsYXN0TWFwcGluZ1wiXG4gICAgICAgICAgdmFyIG5leHRMaW5lID0gcmVtYWluaW5nTGluZXNbcmVtYWluaW5nTGluZXNJbmRleF0gfHwgJyc7XG4gICAgICAgICAgdmFyIGNvZGUgPSBuZXh0TGluZS5zdWJzdHIoMCwgbWFwcGluZy5nZW5lcmF0ZWRDb2x1bW4gLVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RHZW5lcmF0ZWRDb2x1bW4pO1xuICAgICAgICAgIHJlbWFpbmluZ0xpbmVzW3JlbWFpbmluZ0xpbmVzSW5kZXhdID0gbmV4dExpbmUuc3Vic3RyKG1hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uIC1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0R2VuZXJhdGVkQ29sdW1uKTtcbiAgICAgICAgICBsYXN0R2VuZXJhdGVkQ29sdW1uID0gbWFwcGluZy5nZW5lcmF0ZWRDb2x1bW47XG4gICAgICAgICAgYWRkTWFwcGluZ1dpdGhDb2RlKGxhc3RNYXBwaW5nLCBjb2RlKTtcbiAgICAgICAgICAvLyBObyBtb3JlIHJlbWFpbmluZyBjb2RlLCBjb250aW51ZVxuICAgICAgICAgIGxhc3RNYXBwaW5nID0gbWFwcGluZztcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIFdlIGFkZCB0aGUgZ2VuZXJhdGVkIGNvZGUgdW50aWwgdGhlIGZpcnN0IG1hcHBpbmdcbiAgICAgIC8vIHRvIHRoZSBTb3VyY2VOb2RlIHdpdGhvdXQgYW55IG1hcHBpbmcuXG4gICAgICAvLyBFYWNoIGxpbmUgaXMgYWRkZWQgYXMgc2VwYXJhdGUgc3RyaW5nLlxuICAgICAgd2hpbGUgKGxhc3RHZW5lcmF0ZWRMaW5lIDwgbWFwcGluZy5nZW5lcmF0ZWRMaW5lKSB7XG4gICAgICAgIG5vZGUuYWRkKHNoaWZ0TmV4dExpbmUoKSk7XG4gICAgICAgIGxhc3RHZW5lcmF0ZWRMaW5lKys7XG4gICAgICB9XG4gICAgICBpZiAobGFzdEdlbmVyYXRlZENvbHVtbiA8IG1hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uKSB7XG4gICAgICAgIHZhciBuZXh0TGluZSA9IHJlbWFpbmluZ0xpbmVzW3JlbWFpbmluZ0xpbmVzSW5kZXhdIHx8ICcnO1xuICAgICAgICBub2RlLmFkZChuZXh0TGluZS5zdWJzdHIoMCwgbWFwcGluZy5nZW5lcmF0ZWRDb2x1bW4pKTtcbiAgICAgICAgcmVtYWluaW5nTGluZXNbcmVtYWluaW5nTGluZXNJbmRleF0gPSBuZXh0TGluZS5zdWJzdHIobWFwcGluZy5nZW5lcmF0ZWRDb2x1bW4pO1xuICAgICAgICBsYXN0R2VuZXJhdGVkQ29sdW1uID0gbWFwcGluZy5nZW5lcmF0ZWRDb2x1bW47XG4gICAgICB9XG4gICAgICBsYXN0TWFwcGluZyA9IG1hcHBpbmc7XG4gICAgfSwgdGhpcyk7XG4gICAgLy8gV2UgaGF2ZSBwcm9jZXNzZWQgYWxsIG1hcHBpbmdzLlxuICAgIGlmIChyZW1haW5pbmdMaW5lc0luZGV4IDwgcmVtYWluaW5nTGluZXMubGVuZ3RoKSB7XG4gICAgICBpZiAobGFzdE1hcHBpbmcpIHtcbiAgICAgICAgLy8gQXNzb2NpYXRlIHRoZSByZW1haW5pbmcgY29kZSBpbiB0aGUgY3VycmVudCBsaW5lIHdpdGggXCJsYXN0TWFwcGluZ1wiXG4gICAgICAgIGFkZE1hcHBpbmdXaXRoQ29kZShsYXN0TWFwcGluZywgc2hpZnROZXh0TGluZSgpKTtcbiAgICAgIH1cbiAgICAgIC8vIGFuZCBhZGQgdGhlIHJlbWFpbmluZyBsaW5lcyB3aXRob3V0IGFueSBtYXBwaW5nXG4gICAgICBub2RlLmFkZChyZW1haW5pbmdMaW5lcy5zcGxpY2UocmVtYWluaW5nTGluZXNJbmRleCkuam9pbihcIlwiKSk7XG4gICAgfVxuXG4gICAgLy8gQ29weSBzb3VyY2VzQ29udGVudCBpbnRvIFNvdXJjZU5vZGVcbiAgICBhU291cmNlTWFwQ29uc3VtZXIuc291cmNlcy5mb3JFYWNoKGZ1bmN0aW9uIChzb3VyY2VGaWxlKSB7XG4gICAgICB2YXIgY29udGVudCA9IGFTb3VyY2VNYXBDb25zdW1lci5zb3VyY2VDb250ZW50Rm9yKHNvdXJjZUZpbGUpO1xuICAgICAgaWYgKGNvbnRlbnQgIT0gbnVsbCkge1xuICAgICAgICBpZiAoYVJlbGF0aXZlUGF0aCAhPSBudWxsKSB7XG4gICAgICAgICAgc291cmNlRmlsZSA9IHV0aWwuam9pbihhUmVsYXRpdmVQYXRoLCBzb3VyY2VGaWxlKTtcbiAgICAgICAgfVxuICAgICAgICBub2RlLnNldFNvdXJjZUNvbnRlbnQoc291cmNlRmlsZSwgY29udGVudCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbm9kZTtcblxuICAgIGZ1bmN0aW9uIGFkZE1hcHBpbmdXaXRoQ29kZShtYXBwaW5nLCBjb2RlKSB7XG4gICAgICBpZiAobWFwcGluZyA9PT0gbnVsbCB8fCBtYXBwaW5nLnNvdXJjZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG5vZGUuYWRkKGNvZGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHNvdXJjZSA9IGFSZWxhdGl2ZVBhdGhcbiAgICAgICAgICA/IHV0aWwuam9pbihhUmVsYXRpdmVQYXRoLCBtYXBwaW5nLnNvdXJjZSlcbiAgICAgICAgICA6IG1hcHBpbmcuc291cmNlO1xuICAgICAgICBub2RlLmFkZChuZXcgU291cmNlTm9kZShtYXBwaW5nLm9yaWdpbmFsTGluZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwcGluZy5vcmlnaW5hbENvbHVtbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXBwaW5nLm5hbWUpKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbi8qKlxuICogQWRkIGEgY2h1bmsgb2YgZ2VuZXJhdGVkIEpTIHRvIHRoaXMgc291cmNlIG5vZGUuXG4gKlxuICogQHBhcmFtIGFDaHVuayBBIHN0cmluZyBzbmlwcGV0IG9mIGdlbmVyYXRlZCBKUyBjb2RlLCBhbm90aGVyIGluc3RhbmNlIG9mXG4gKiAgICAgICAgU291cmNlTm9kZSwgb3IgYW4gYXJyYXkgd2hlcmUgZWFjaCBtZW1iZXIgaXMgb25lIG9mIHRob3NlIHRoaW5ncy5cbiAqL1xuU291cmNlTm9kZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gU291cmNlTm9kZV9hZGQoYUNodW5rKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGFDaHVuaykpIHtcbiAgICBhQ2h1bmsuZm9yRWFjaChmdW5jdGlvbiAoY2h1bmspIHtcbiAgICAgIHRoaXMuYWRkKGNodW5rKTtcbiAgICB9LCB0aGlzKTtcbiAgfVxuICBlbHNlIGlmIChhQ2h1bmtbaXNTb3VyY2VOb2RlXSB8fCB0eXBlb2YgYUNodW5rID09PSBcInN0cmluZ1wiKSB7XG4gICAgaWYgKGFDaHVuaykge1xuICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGFDaHVuayk7XG4gICAgfVxuICB9XG4gIGVsc2Uge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICBcIkV4cGVjdGVkIGEgU291cmNlTm9kZSwgc3RyaW5nLCBvciBhbiBhcnJheSBvZiBTb3VyY2VOb2RlcyBhbmQgc3RyaW5ncy4gR290IFwiICsgYUNodW5rXG4gICAgKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQWRkIGEgY2h1bmsgb2YgZ2VuZXJhdGVkIEpTIHRvIHRoZSBiZWdpbm5pbmcgb2YgdGhpcyBzb3VyY2Ugbm9kZS5cbiAqXG4gKiBAcGFyYW0gYUNodW5rIEEgc3RyaW5nIHNuaXBwZXQgb2YgZ2VuZXJhdGVkIEpTIGNvZGUsIGFub3RoZXIgaW5zdGFuY2Ugb2ZcbiAqICAgICAgICBTb3VyY2VOb2RlLCBvciBhbiBhcnJheSB3aGVyZSBlYWNoIG1lbWJlciBpcyBvbmUgb2YgdGhvc2UgdGhpbmdzLlxuICovXG5Tb3VyY2VOb2RlLnByb3RvdHlwZS5wcmVwZW5kID0gZnVuY3Rpb24gU291cmNlTm9kZV9wcmVwZW5kKGFDaHVuaykge1xuICBpZiAoQXJyYXkuaXNBcnJheShhQ2h1bmspKSB7XG4gICAgZm9yICh2YXIgaSA9IGFDaHVuay5sZW5ndGgtMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHRoaXMucHJlcGVuZChhQ2h1bmtbaV0pO1xuICAgIH1cbiAgfVxuICBlbHNlIGlmIChhQ2h1bmtbaXNTb3VyY2VOb2RlXSB8fCB0eXBlb2YgYUNodW5rID09PSBcInN0cmluZ1wiKSB7XG4gICAgdGhpcy5jaGlsZHJlbi51bnNoaWZ0KGFDaHVuayk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgIFwiRXhwZWN0ZWQgYSBTb3VyY2VOb2RlLCBzdHJpbmcsIG9yIGFuIGFycmF5IG9mIFNvdXJjZU5vZGVzIGFuZCBzdHJpbmdzLiBHb3QgXCIgKyBhQ2h1bmtcbiAgICApO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBXYWxrIG92ZXIgdGhlIHRyZWUgb2YgSlMgc25pcHBldHMgaW4gdGhpcyBub2RlIGFuZCBpdHMgY2hpbGRyZW4uIFRoZVxuICogd2Fsa2luZyBmdW5jdGlvbiBpcyBjYWxsZWQgb25jZSBmb3IgZWFjaCBzbmlwcGV0IG9mIEpTIGFuZCBpcyBwYXNzZWQgdGhhdFxuICogc25pcHBldCBhbmQgdGhlIGl0cyBvcmlnaW5hbCBhc3NvY2lhdGVkIHNvdXJjZSdzIGxpbmUvY29sdW1uIGxvY2F0aW9uLlxuICpcbiAqIEBwYXJhbSBhRm4gVGhlIHRyYXZlcnNhbCBmdW5jdGlvbi5cbiAqL1xuU291cmNlTm9kZS5wcm90b3R5cGUud2FsayA9IGZ1bmN0aW9uIFNvdXJjZU5vZGVfd2FsayhhRm4pIHtcbiAgdmFyIGNodW5rO1xuICBmb3IgKHZhciBpID0gMCwgbGVuID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGNodW5rID0gdGhpcy5jaGlsZHJlbltpXTtcbiAgICBpZiAoY2h1bmtbaXNTb3VyY2VOb2RlXSkge1xuICAgICAgY2h1bmsud2FsayhhRm4pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGlmIChjaHVuayAhPT0gJycpIHtcbiAgICAgICAgYUZuKGNodW5rLCB7IHNvdXJjZTogdGhpcy5zb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgICBsaW5lOiB0aGlzLmxpbmUsXG4gICAgICAgICAgICAgICAgICAgICBjb2x1bW46IHRoaXMuY29sdW1uLFxuICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5uYW1lIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBMaWtlIGBTdHJpbmcucHJvdG90eXBlLmpvaW5gIGV4Y2VwdCBmb3IgU291cmNlTm9kZXMuIEluc2VydHMgYGFTdHJgIGJldHdlZW5cbiAqIGVhY2ggb2YgYHRoaXMuY2hpbGRyZW5gLlxuICpcbiAqIEBwYXJhbSBhU2VwIFRoZSBzZXBhcmF0b3IuXG4gKi9cblNvdXJjZU5vZGUucHJvdG90eXBlLmpvaW4gPSBmdW5jdGlvbiBTb3VyY2VOb2RlX2pvaW4oYVNlcCkge1xuICB2YXIgbmV3Q2hpbGRyZW47XG4gIHZhciBpO1xuICB2YXIgbGVuID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7XG4gIGlmIChsZW4gPiAwKSB7XG4gICAgbmV3Q2hpbGRyZW4gPSBbXTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuLTE7IGkrKykge1xuICAgICAgbmV3Q2hpbGRyZW4ucHVzaCh0aGlzLmNoaWxkcmVuW2ldKTtcbiAgICAgIG5ld0NoaWxkcmVuLnB1c2goYVNlcCk7XG4gICAgfVxuICAgIG5ld0NoaWxkcmVuLnB1c2godGhpcy5jaGlsZHJlbltpXSk7XG4gICAgdGhpcy5jaGlsZHJlbiA9IG5ld0NoaWxkcmVuO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBDYWxsIFN0cmluZy5wcm90b3R5cGUucmVwbGFjZSBvbiB0aGUgdmVyeSByaWdodC1tb3N0IHNvdXJjZSBzbmlwcGV0LiBVc2VmdWxcbiAqIGZvciB0cmltbWluZyB3aGl0ZXNwYWNlIGZyb20gdGhlIGVuZCBvZiBhIHNvdXJjZSBub2RlLCBldGMuXG4gKlxuICogQHBhcmFtIGFQYXR0ZXJuIFRoZSBwYXR0ZXJuIHRvIHJlcGxhY2UuXG4gKiBAcGFyYW0gYVJlcGxhY2VtZW50IFRoZSB0aGluZyB0byByZXBsYWNlIHRoZSBwYXR0ZXJuIHdpdGguXG4gKi9cblNvdXJjZU5vZGUucHJvdG90eXBlLnJlcGxhY2VSaWdodCA9IGZ1bmN0aW9uIFNvdXJjZU5vZGVfcmVwbGFjZVJpZ2h0KGFQYXR0ZXJuLCBhUmVwbGFjZW1lbnQpIHtcbiAgdmFyIGxhc3RDaGlsZCA9IHRoaXMuY2hpbGRyZW5bdGhpcy5jaGlsZHJlbi5sZW5ndGggLSAxXTtcbiAgaWYgKGxhc3RDaGlsZFtpc1NvdXJjZU5vZGVdKSB7XG4gICAgbGFzdENoaWxkLnJlcGxhY2VSaWdodChhUGF0dGVybiwgYVJlcGxhY2VtZW50KTtcbiAgfVxuICBlbHNlIGlmICh0eXBlb2YgbGFzdENoaWxkID09PSAnc3RyaW5nJykge1xuICAgIHRoaXMuY2hpbGRyZW5bdGhpcy5jaGlsZHJlbi5sZW5ndGggLSAxXSA9IGxhc3RDaGlsZC5yZXBsYWNlKGFQYXR0ZXJuLCBhUmVwbGFjZW1lbnQpO1xuICB9XG4gIGVsc2Uge1xuICAgIHRoaXMuY2hpbGRyZW4ucHVzaCgnJy5yZXBsYWNlKGFQYXR0ZXJuLCBhUmVwbGFjZW1lbnQpKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IHRoZSBzb3VyY2UgY29udGVudCBmb3IgYSBzb3VyY2UgZmlsZS4gVGhpcyB3aWxsIGJlIGFkZGVkIHRvIHRoZSBTb3VyY2VNYXBHZW5lcmF0b3JcbiAqIGluIHRoZSBzb3VyY2VzQ29udGVudCBmaWVsZC5cbiAqXG4gKiBAcGFyYW0gYVNvdXJjZUZpbGUgVGhlIGZpbGVuYW1lIG9mIHRoZSBzb3VyY2UgZmlsZVxuICogQHBhcmFtIGFTb3VyY2VDb250ZW50IFRoZSBjb250ZW50IG9mIHRoZSBzb3VyY2UgZmlsZVxuICovXG5Tb3VyY2VOb2RlLnByb3RvdHlwZS5zZXRTb3VyY2VDb250ZW50ID1cbiAgZnVuY3Rpb24gU291cmNlTm9kZV9zZXRTb3VyY2VDb250ZW50KGFTb3VyY2VGaWxlLCBhU291cmNlQ29udGVudCkge1xuICAgIHRoaXMuc291cmNlQ29udGVudHNbdXRpbC50b1NldFN0cmluZyhhU291cmNlRmlsZSldID0gYVNvdXJjZUNvbnRlbnQ7XG4gIH07XG5cbi8qKlxuICogV2FsayBvdmVyIHRoZSB0cmVlIG9mIFNvdXJjZU5vZGVzLiBUaGUgd2Fsa2luZyBmdW5jdGlvbiBpcyBjYWxsZWQgZm9yIGVhY2hcbiAqIHNvdXJjZSBmaWxlIGNvbnRlbnQgYW5kIGlzIHBhc3NlZCB0aGUgZmlsZW5hbWUgYW5kIHNvdXJjZSBjb250ZW50LlxuICpcbiAqIEBwYXJhbSBhRm4gVGhlIHRyYXZlcnNhbCBmdW5jdGlvbi5cbiAqL1xuU291cmNlTm9kZS5wcm90b3R5cGUud2Fsa1NvdXJjZUNvbnRlbnRzID1cbiAgZnVuY3Rpb24gU291cmNlTm9kZV93YWxrU291cmNlQ29udGVudHMoYUZuKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLmNoaWxkcmVuW2ldW2lzU291cmNlTm9kZV0pIHtcbiAgICAgICAgdGhpcy5jaGlsZHJlbltpXS53YWxrU291cmNlQ29udGVudHMoYUZuKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgc291cmNlcyA9IE9iamVjdC5rZXlzKHRoaXMuc291cmNlQ29udGVudHMpO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBzb3VyY2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBhRm4odXRpbC5mcm9tU2V0U3RyaW5nKHNvdXJjZXNbaV0pLCB0aGlzLnNvdXJjZUNvbnRlbnRzW3NvdXJjZXNbaV1dKTtcbiAgICB9XG4gIH07XG5cbi8qKlxuICogUmV0dXJuIHRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhpcyBzb3VyY2Ugbm9kZS4gV2Fsa3Mgb3ZlciB0aGUgdHJlZVxuICogYW5kIGNvbmNhdGVuYXRlcyBhbGwgdGhlIHZhcmlvdXMgc25pcHBldHMgdG9nZXRoZXIgdG8gb25lIHN0cmluZy5cbiAqL1xuU291cmNlTm9kZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiBTb3VyY2VOb2RlX3RvU3RyaW5nKCkge1xuICB2YXIgc3RyID0gXCJcIjtcbiAgdGhpcy53YWxrKGZ1bmN0aW9uIChjaHVuaykge1xuICAgIHN0ciArPSBjaHVuaztcbiAgfSk7XG4gIHJldHVybiBzdHI7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGlzIHNvdXJjZSBub2RlIGFsb25nIHdpdGggYSBzb3VyY2VcbiAqIG1hcC5cbiAqL1xuU291cmNlTm9kZS5wcm90b3R5cGUudG9TdHJpbmdXaXRoU291cmNlTWFwID0gZnVuY3Rpb24gU291cmNlTm9kZV90b1N0cmluZ1dpdGhTb3VyY2VNYXAoYUFyZ3MpIHtcbiAgdmFyIGdlbmVyYXRlZCA9IHtcbiAgICBjb2RlOiBcIlwiLFxuICAgIGxpbmU6IDEsXG4gICAgY29sdW1uOiAwXG4gIH07XG4gIHZhciBtYXAgPSBuZXcgU291cmNlTWFwR2VuZXJhdG9yKGFBcmdzKTtcbiAgdmFyIHNvdXJjZU1hcHBpbmdBY3RpdmUgPSBmYWxzZTtcbiAgdmFyIGxhc3RPcmlnaW5hbFNvdXJjZSA9IG51bGw7XG4gIHZhciBsYXN0T3JpZ2luYWxMaW5lID0gbnVsbDtcbiAgdmFyIGxhc3RPcmlnaW5hbENvbHVtbiA9IG51bGw7XG4gIHZhciBsYXN0T3JpZ2luYWxOYW1lID0gbnVsbDtcbiAgdGhpcy53YWxrKGZ1bmN0aW9uIChjaHVuaywgb3JpZ2luYWwpIHtcbiAgICBnZW5lcmF0ZWQuY29kZSArPSBjaHVuaztcbiAgICBpZiAob3JpZ2luYWwuc291cmNlICE9PSBudWxsXG4gICAgICAgICYmIG9yaWdpbmFsLmxpbmUgIT09IG51bGxcbiAgICAgICAgJiYgb3JpZ2luYWwuY29sdW1uICE9PSBudWxsKSB7XG4gICAgICBpZihsYXN0T3JpZ2luYWxTb3VyY2UgIT09IG9yaWdpbmFsLnNvdXJjZVxuICAgICAgICAgfHwgbGFzdE9yaWdpbmFsTGluZSAhPT0gb3JpZ2luYWwubGluZVxuICAgICAgICAgfHwgbGFzdE9yaWdpbmFsQ29sdW1uICE9PSBvcmlnaW5hbC5jb2x1bW5cbiAgICAgICAgIHx8IGxhc3RPcmlnaW5hbE5hbWUgIT09IG9yaWdpbmFsLm5hbWUpIHtcbiAgICAgICAgbWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICAgIHNvdXJjZTogb3JpZ2luYWwuc291cmNlLFxuICAgICAgICAgIG9yaWdpbmFsOiB7XG4gICAgICAgICAgICBsaW5lOiBvcmlnaW5hbC5saW5lLFxuICAgICAgICAgICAgY29sdW1uOiBvcmlnaW5hbC5jb2x1bW5cbiAgICAgICAgICB9LFxuICAgICAgICAgIGdlbmVyYXRlZDoge1xuICAgICAgICAgICAgbGluZTogZ2VuZXJhdGVkLmxpbmUsXG4gICAgICAgICAgICBjb2x1bW46IGdlbmVyYXRlZC5jb2x1bW5cbiAgICAgICAgICB9LFxuICAgICAgICAgIG5hbWU6IG9yaWdpbmFsLm5hbWVcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBsYXN0T3JpZ2luYWxTb3VyY2UgPSBvcmlnaW5hbC5zb3VyY2U7XG4gICAgICBsYXN0T3JpZ2luYWxMaW5lID0gb3JpZ2luYWwubGluZTtcbiAgICAgIGxhc3RPcmlnaW5hbENvbHVtbiA9IG9yaWdpbmFsLmNvbHVtbjtcbiAgICAgIGxhc3RPcmlnaW5hbE5hbWUgPSBvcmlnaW5hbC5uYW1lO1xuICAgICAgc291cmNlTWFwcGluZ0FjdGl2ZSA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChzb3VyY2VNYXBwaW5nQWN0aXZlKSB7XG4gICAgICBtYXAuYWRkTWFwcGluZyh7XG4gICAgICAgIGdlbmVyYXRlZDoge1xuICAgICAgICAgIGxpbmU6IGdlbmVyYXRlZC5saW5lLFxuICAgICAgICAgIGNvbHVtbjogZ2VuZXJhdGVkLmNvbHVtblxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGxhc3RPcmlnaW5hbFNvdXJjZSA9IG51bGw7XG4gICAgICBzb3VyY2VNYXBwaW5nQWN0aXZlID0gZmFsc2U7XG4gICAgfVxuICAgIGZvciAodmFyIGlkeCA9IDAsIGxlbmd0aCA9IGNodW5rLmxlbmd0aDsgaWR4IDwgbGVuZ3RoOyBpZHgrKykge1xuICAgICAgaWYgKGNodW5rLmNoYXJDb2RlQXQoaWR4KSA9PT0gTkVXTElORV9DT0RFKSB7XG4gICAgICAgIGdlbmVyYXRlZC5saW5lKys7XG4gICAgICAgIGdlbmVyYXRlZC5jb2x1bW4gPSAwO1xuICAgICAgICAvLyBNYXBwaW5ncyBlbmQgYXQgZW9sXG4gICAgICAgIGlmIChpZHggKyAxID09PSBsZW5ndGgpIHtcbiAgICAgICAgICBsYXN0T3JpZ2luYWxTb3VyY2UgPSBudWxsO1xuICAgICAgICAgIHNvdXJjZU1hcHBpbmdBY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIGlmIChzb3VyY2VNYXBwaW5nQWN0aXZlKSB7XG4gICAgICAgICAgbWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICAgICAgc291cmNlOiBvcmlnaW5hbC5zb3VyY2UsXG4gICAgICAgICAgICBvcmlnaW5hbDoge1xuICAgICAgICAgICAgICBsaW5lOiBvcmlnaW5hbC5saW5lLFxuICAgICAgICAgICAgICBjb2x1bW46IG9yaWdpbmFsLmNvbHVtblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdlbmVyYXRlZDoge1xuICAgICAgICAgICAgICBsaW5lOiBnZW5lcmF0ZWQubGluZSxcbiAgICAgICAgICAgICAgY29sdW1uOiBnZW5lcmF0ZWQuY29sdW1uXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmFtZTogb3JpZ2luYWwubmFtZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBnZW5lcmF0ZWQuY29sdW1uKys7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgdGhpcy53YWxrU291cmNlQ29udGVudHMoZnVuY3Rpb24gKHNvdXJjZUZpbGUsIHNvdXJjZUNvbnRlbnQpIHtcbiAgICBtYXAuc2V0U291cmNlQ29udGVudChzb3VyY2VGaWxlLCBzb3VyY2VDb250ZW50KTtcbiAgfSk7XG5cbiAgcmV0dXJuIHsgY29kZTogZ2VuZXJhdGVkLmNvZGUsIG1hcDogbWFwIH07XG59O1xuXG5leHBvcnRzLlNvdXJjZU5vZGUgPSBTb3VyY2VOb2RlO1xuIiwgIi8qIC0qLSBNb2RlOiBqczsganMtaW5kZW50LWxldmVsOiAyOyAtKi0gKi9cbi8qXG4gKiBDb3B5cmlnaHQgMjAxMSBNb3ppbGxhIEZvdW5kYXRpb24gYW5kIGNvbnRyaWJ1dG9yc1xuICogTGljZW5zZWQgdW5kZXIgdGhlIE5ldyBCU0QgbGljZW5zZS4gU2VlIExJQ0VOU0Ugb3I6XG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvQlNELTMtQ2xhdXNlXG4gKi9cblxuLyoqXG4gKiBUaGlzIGlzIGEgaGVscGVyIGZ1bmN0aW9uIGZvciBnZXR0aW5nIHZhbHVlcyBmcm9tIHBhcmFtZXRlci9vcHRpb25zXG4gKiBvYmplY3RzLlxuICpcbiAqIEBwYXJhbSBhcmdzIFRoZSBvYmplY3Qgd2UgYXJlIGV4dHJhY3RpbmcgdmFsdWVzIGZyb21cbiAqIEBwYXJhbSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSB3ZSBhcmUgZ2V0dGluZy5cbiAqIEBwYXJhbSBkZWZhdWx0VmFsdWUgQW4gb3B0aW9uYWwgdmFsdWUgdG8gcmV0dXJuIGlmIHRoZSBwcm9wZXJ0eSBpcyBtaXNzaW5nXG4gKiBmcm9tIHRoZSBvYmplY3QuIElmIHRoaXMgaXMgbm90IHNwZWNpZmllZCBhbmQgdGhlIHByb3BlcnR5IGlzIG1pc3NpbmcsIGFuXG4gKiBlcnJvciB3aWxsIGJlIHRocm93bi5cbiAqL1xuZnVuY3Rpb24gZ2V0QXJnKGFBcmdzLCBhTmFtZSwgYURlZmF1bHRWYWx1ZSkge1xuICBpZiAoYU5hbWUgaW4gYUFyZ3MpIHtcbiAgICByZXR1cm4gYUFyZ3NbYU5hbWVdO1xuICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICByZXR1cm4gYURlZmF1bHRWYWx1ZTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1wiJyArIGFOYW1lICsgJ1wiIGlzIGEgcmVxdWlyZWQgYXJndW1lbnQuJyk7XG4gIH1cbn1cbmV4cG9ydHMuZ2V0QXJnID0gZ2V0QXJnO1xuXG52YXIgdXJsUmVnZXhwID0gL14oPzooW1xcdytcXC0uXSspOik/XFwvXFwvKD86KFxcdys6XFx3KylAKT8oW1xcdy4tXSopKD86OihcXGQrKSk/KC4qKSQvO1xudmFyIGRhdGFVcmxSZWdleHAgPSAvXmRhdGE6LitcXCwuKyQvO1xuXG5mdW5jdGlvbiB1cmxQYXJzZShhVXJsKSB7XG4gIHZhciBtYXRjaCA9IGFVcmwubWF0Y2godXJsUmVnZXhwKTtcbiAgaWYgKCFtYXRjaCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiB7XG4gICAgc2NoZW1lOiBtYXRjaFsxXSxcbiAgICBhdXRoOiBtYXRjaFsyXSxcbiAgICBob3N0OiBtYXRjaFszXSxcbiAgICBwb3J0OiBtYXRjaFs0XSxcbiAgICBwYXRoOiBtYXRjaFs1XVxuICB9O1xufVxuZXhwb3J0cy51cmxQYXJzZSA9IHVybFBhcnNlO1xuXG5mdW5jdGlvbiB1cmxHZW5lcmF0ZShhUGFyc2VkVXJsKSB7XG4gIHZhciB1cmwgPSAnJztcbiAgaWYgKGFQYXJzZWRVcmwuc2NoZW1lKSB7XG4gICAgdXJsICs9IGFQYXJzZWRVcmwuc2NoZW1lICsgJzonO1xuICB9XG4gIHVybCArPSAnLy8nO1xuICBpZiAoYVBhcnNlZFVybC5hdXRoKSB7XG4gICAgdXJsICs9IGFQYXJzZWRVcmwuYXV0aCArICdAJztcbiAgfVxuICBpZiAoYVBhcnNlZFVybC5ob3N0KSB7XG4gICAgdXJsICs9IGFQYXJzZWRVcmwuaG9zdDtcbiAgfVxuICBpZiAoYVBhcnNlZFVybC5wb3J0KSB7XG4gICAgdXJsICs9IFwiOlwiICsgYVBhcnNlZFVybC5wb3J0XG4gIH1cbiAgaWYgKGFQYXJzZWRVcmwucGF0aCkge1xuICAgIHVybCArPSBhUGFyc2VkVXJsLnBhdGg7XG4gIH1cbiAgcmV0dXJuIHVybDtcbn1cbmV4cG9ydHMudXJsR2VuZXJhdGUgPSB1cmxHZW5lcmF0ZTtcblxuLyoqXG4gKiBOb3JtYWxpemVzIGEgcGF0aCwgb3IgdGhlIHBhdGggcG9ydGlvbiBvZiBhIFVSTDpcbiAqXG4gKiAtIFJlcGxhY2VzIGNvbnNlY3V0aXZlIHNsYXNoZXMgd2l0aCBvbmUgc2xhc2guXG4gKiAtIFJlbW92ZXMgdW5uZWNlc3NhcnkgJy4nIHBhcnRzLlxuICogLSBSZW1vdmVzIHVubmVjZXNzYXJ5ICc8ZGlyPi8uLicgcGFydHMuXG4gKlxuICogQmFzZWQgb24gY29kZSBpbiB0aGUgTm9kZS5qcyAncGF0aCcgY29yZSBtb2R1bGUuXG4gKlxuICogQHBhcmFtIGFQYXRoIFRoZSBwYXRoIG9yIHVybCB0byBub3JtYWxpemUuXG4gKi9cbmZ1bmN0aW9uIG5vcm1hbGl6ZShhUGF0aCkge1xuICB2YXIgcGF0aCA9IGFQYXRoO1xuICB2YXIgdXJsID0gdXJsUGFyc2UoYVBhdGgpO1xuICBpZiAodXJsKSB7XG4gICAgaWYgKCF1cmwucGF0aCkge1xuICAgICAgcmV0dXJuIGFQYXRoO1xuICAgIH1cbiAgICBwYXRoID0gdXJsLnBhdGg7XG4gIH1cbiAgdmFyIGlzQWJzb2x1dGUgPSBleHBvcnRzLmlzQWJzb2x1dGUocGF0aCk7XG5cbiAgdmFyIHBhcnRzID0gcGF0aC5zcGxpdCgvXFwvKy8pO1xuICBmb3IgKHZhciBwYXJ0LCB1cCA9IDAsIGkgPSBwYXJ0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIHBhcnQgPSBwYXJ0c1tpXTtcbiAgICBpZiAocGFydCA9PT0gJy4nKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgfSBlbHNlIGlmIChwYXJ0ID09PSAnLi4nKSB7XG4gICAgICB1cCsrO1xuICAgIH0gZWxzZSBpZiAodXAgPiAwKSB7XG4gICAgICBpZiAocGFydCA9PT0gJycpIHtcbiAgICAgICAgLy8gVGhlIGZpcnN0IHBhcnQgaXMgYmxhbmsgaWYgdGhlIHBhdGggaXMgYWJzb2x1dGUuIFRyeWluZyB0byBnb1xuICAgICAgICAvLyBhYm92ZSB0aGUgcm9vdCBpcyBhIG5vLW9wLiBUaGVyZWZvcmUgd2UgY2FuIHJlbW92ZSBhbGwgJy4uJyBwYXJ0c1xuICAgICAgICAvLyBkaXJlY3RseSBhZnRlciB0aGUgcm9vdC5cbiAgICAgICAgcGFydHMuc3BsaWNlKGkgKyAxLCB1cCk7XG4gICAgICAgIHVwID0gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcnRzLnNwbGljZShpLCAyKTtcbiAgICAgICAgdXAtLTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcGF0aCA9IHBhcnRzLmpvaW4oJy8nKTtcblxuICBpZiAocGF0aCA9PT0gJycpIHtcbiAgICBwYXRoID0gaXNBYnNvbHV0ZSA/ICcvJyA6ICcuJztcbiAgfVxuXG4gIGlmICh1cmwpIHtcbiAgICB1cmwucGF0aCA9IHBhdGg7XG4gICAgcmV0dXJuIHVybEdlbmVyYXRlKHVybCk7XG4gIH1cbiAgcmV0dXJuIHBhdGg7XG59XG5leHBvcnRzLm5vcm1hbGl6ZSA9IG5vcm1hbGl6ZTtcblxuLyoqXG4gKiBKb2lucyB0d28gcGF0aHMvVVJMcy5cbiAqXG4gKiBAcGFyYW0gYVJvb3QgVGhlIHJvb3QgcGF0aCBvciBVUkwuXG4gKiBAcGFyYW0gYVBhdGggVGhlIHBhdGggb3IgVVJMIHRvIGJlIGpvaW5lZCB3aXRoIHRoZSByb290LlxuICpcbiAqIC0gSWYgYVBhdGggaXMgYSBVUkwgb3IgYSBkYXRhIFVSSSwgYVBhdGggaXMgcmV0dXJuZWQsIHVubGVzcyBhUGF0aCBpcyBhXG4gKiAgIHNjaGVtZS1yZWxhdGl2ZSBVUkw6IFRoZW4gdGhlIHNjaGVtZSBvZiBhUm9vdCwgaWYgYW55LCBpcyBwcmVwZW5kZWRcbiAqICAgZmlyc3QuXG4gKiAtIE90aGVyd2lzZSBhUGF0aCBpcyBhIHBhdGguIElmIGFSb290IGlzIGEgVVJMLCB0aGVuIGl0cyBwYXRoIHBvcnRpb25cbiAqICAgaXMgdXBkYXRlZCB3aXRoIHRoZSByZXN1bHQgYW5kIGFSb290IGlzIHJldHVybmVkLiBPdGhlcndpc2UgdGhlIHJlc3VsdFxuICogICBpcyByZXR1cm5lZC5cbiAqICAgLSBJZiBhUGF0aCBpcyBhYnNvbHV0ZSwgdGhlIHJlc3VsdCBpcyBhUGF0aC5cbiAqICAgLSBPdGhlcndpc2UgdGhlIHR3byBwYXRocyBhcmUgam9pbmVkIHdpdGggYSBzbGFzaC5cbiAqIC0gSm9pbmluZyBmb3IgZXhhbXBsZSAnaHR0cDovLycgYW5kICd3d3cuZXhhbXBsZS5jb20nIGlzIGFsc28gc3VwcG9ydGVkLlxuICovXG5mdW5jdGlvbiBqb2luKGFSb290LCBhUGF0aCkge1xuICBpZiAoYVJvb3QgPT09IFwiXCIpIHtcbiAgICBhUm9vdCA9IFwiLlwiO1xuICB9XG4gIGlmIChhUGF0aCA9PT0gXCJcIikge1xuICAgIGFQYXRoID0gXCIuXCI7XG4gIH1cbiAgdmFyIGFQYXRoVXJsID0gdXJsUGFyc2UoYVBhdGgpO1xuICB2YXIgYVJvb3RVcmwgPSB1cmxQYXJzZShhUm9vdCk7XG4gIGlmIChhUm9vdFVybCkge1xuICAgIGFSb290ID0gYVJvb3RVcmwucGF0aCB8fCAnLyc7XG4gIH1cblxuICAvLyBgam9pbihmb28sICcvL3d3dy5leGFtcGxlLm9yZycpYFxuICBpZiAoYVBhdGhVcmwgJiYgIWFQYXRoVXJsLnNjaGVtZSkge1xuICAgIGlmIChhUm9vdFVybCkge1xuICAgICAgYVBhdGhVcmwuc2NoZW1lID0gYVJvb3RVcmwuc2NoZW1lO1xuICAgIH1cbiAgICByZXR1cm4gdXJsR2VuZXJhdGUoYVBhdGhVcmwpO1xuICB9XG5cbiAgaWYgKGFQYXRoVXJsIHx8IGFQYXRoLm1hdGNoKGRhdGFVcmxSZWdleHApKSB7XG4gICAgcmV0dXJuIGFQYXRoO1xuICB9XG5cbiAgLy8gYGpvaW4oJ2h0dHA6Ly8nLCAnd3d3LmV4YW1wbGUuY29tJylgXG4gIGlmIChhUm9vdFVybCAmJiAhYVJvb3RVcmwuaG9zdCAmJiAhYVJvb3RVcmwucGF0aCkge1xuICAgIGFSb290VXJsLmhvc3QgPSBhUGF0aDtcbiAgICByZXR1cm4gdXJsR2VuZXJhdGUoYVJvb3RVcmwpO1xuICB9XG5cbiAgdmFyIGpvaW5lZCA9IGFQYXRoLmNoYXJBdCgwKSA9PT0gJy8nXG4gICAgPyBhUGF0aFxuICAgIDogbm9ybWFsaXplKGFSb290LnJlcGxhY2UoL1xcLyskLywgJycpICsgJy8nICsgYVBhdGgpO1xuXG4gIGlmIChhUm9vdFVybCkge1xuICAgIGFSb290VXJsLnBhdGggPSBqb2luZWQ7XG4gICAgcmV0dXJuIHVybEdlbmVyYXRlKGFSb290VXJsKTtcbiAgfVxuICByZXR1cm4gam9pbmVkO1xufVxuZXhwb3J0cy5qb2luID0gam9pbjtcblxuZXhwb3J0cy5pc0Fic29sdXRlID0gZnVuY3Rpb24gKGFQYXRoKSB7XG4gIHJldHVybiBhUGF0aC5jaGFyQXQoMCkgPT09ICcvJyB8fCB1cmxSZWdleHAudGVzdChhUGF0aCk7XG59O1xuXG4vKipcbiAqIE1ha2UgYSBwYXRoIHJlbGF0aXZlIHRvIGEgVVJMIG9yIGFub3RoZXIgcGF0aC5cbiAqXG4gKiBAcGFyYW0gYVJvb3QgVGhlIHJvb3QgcGF0aCBvciBVUkwuXG4gKiBAcGFyYW0gYVBhdGggVGhlIHBhdGggb3IgVVJMIHRvIGJlIG1hZGUgcmVsYXRpdmUgdG8gYVJvb3QuXG4gKi9cbmZ1bmN0aW9uIHJlbGF0aXZlKGFSb290LCBhUGF0aCkge1xuICBpZiAoYVJvb3QgPT09IFwiXCIpIHtcbiAgICBhUm9vdCA9IFwiLlwiO1xuICB9XG5cbiAgYVJvb3QgPSBhUm9vdC5yZXBsYWNlKC9cXC8kLywgJycpO1xuXG4gIC8vIEl0IGlzIHBvc3NpYmxlIGZvciB0aGUgcGF0aCB0byBiZSBhYm92ZSB0aGUgcm9vdC4gSW4gdGhpcyBjYXNlLCBzaW1wbHlcbiAgLy8gY2hlY2tpbmcgd2hldGhlciB0aGUgcm9vdCBpcyBhIHByZWZpeCBvZiB0aGUgcGF0aCB3b24ndCB3b3JrLiBJbnN0ZWFkLCB3ZVxuICAvLyBuZWVkIHRvIHJlbW92ZSBjb21wb25lbnRzIGZyb20gdGhlIHJvb3Qgb25lIGJ5IG9uZSwgdW50aWwgZWl0aGVyIHdlIGZpbmRcbiAgLy8gYSBwcmVmaXggdGhhdCBmaXRzLCBvciB3ZSBydW4gb3V0IG9mIGNvbXBvbmVudHMgdG8gcmVtb3ZlLlxuICB2YXIgbGV2ZWwgPSAwO1xuICB3aGlsZSAoYVBhdGguaW5kZXhPZihhUm9vdCArICcvJykgIT09IDApIHtcbiAgICB2YXIgaW5kZXggPSBhUm9vdC5sYXN0SW5kZXhPZihcIi9cIik7XG4gICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgcmV0dXJuIGFQYXRoO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBvbmx5IHBhcnQgb2YgdGhlIHJvb3QgdGhhdCBpcyBsZWZ0IGlzIHRoZSBzY2hlbWUgKGkuZS4gaHR0cDovLyxcbiAgICAvLyBmaWxlOi8vLywgZXRjLiksIG9uZSBvciBtb3JlIHNsYXNoZXMgKC8pLCBvciBzaW1wbHkgbm90aGluZyBhdCBhbGwsIHdlXG4gICAgLy8gaGF2ZSBleGhhdXN0ZWQgYWxsIGNvbXBvbmVudHMsIHNvIHRoZSBwYXRoIGlzIG5vdCByZWxhdGl2ZSB0byB0aGUgcm9vdC5cbiAgICBhUm9vdCA9IGFSb290LnNsaWNlKDAsIGluZGV4KTtcbiAgICBpZiAoYVJvb3QubWF0Y2goL14oW15cXC9dKzpcXC8pP1xcLyokLykpIHtcbiAgICAgIHJldHVybiBhUGF0aDtcbiAgICB9XG5cbiAgICArK2xldmVsO1xuICB9XG5cbiAgLy8gTWFrZSBzdXJlIHdlIGFkZCBhIFwiLi4vXCIgZm9yIGVhY2ggY29tcG9uZW50IHdlIHJlbW92ZWQgZnJvbSB0aGUgcm9vdC5cbiAgcmV0dXJuIEFycmF5KGxldmVsICsgMSkuam9pbihcIi4uL1wiKSArIGFQYXRoLnN1YnN0cihhUm9vdC5sZW5ndGggKyAxKTtcbn1cbmV4cG9ydHMucmVsYXRpdmUgPSByZWxhdGl2ZTtcblxudmFyIHN1cHBvcnRzTnVsbFByb3RvID0gKGZ1bmN0aW9uICgpIHtcbiAgdmFyIG9iaiA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIHJldHVybiAhKCdfX3Byb3RvX18nIGluIG9iaik7XG59KCkpO1xuXG5mdW5jdGlvbiBpZGVudGl0eSAocykge1xuICByZXR1cm4gcztcbn1cblxuLyoqXG4gKiBCZWNhdXNlIGJlaGF2aW9yIGdvZXMgd2Fja3kgd2hlbiB5b3Ugc2V0IGBfX3Byb3RvX19gIG9uIG9iamVjdHMsIHdlXG4gKiBoYXZlIHRvIHByZWZpeCBhbGwgdGhlIHN0cmluZ3MgaW4gb3VyIHNldCB3aXRoIGFuIGFyYml0cmFyeSBjaGFyYWN0ZXIuXG4gKlxuICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tb3ppbGxhL3NvdXJjZS1tYXAvcHVsbC8zMSBhbmRcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9tb3ppbGxhL3NvdXJjZS1tYXAvaXNzdWVzLzMwXG4gKlxuICogQHBhcmFtIFN0cmluZyBhU3RyXG4gKi9cbmZ1bmN0aW9uIHRvU2V0U3RyaW5nKGFTdHIpIHtcbiAgaWYgKGlzUHJvdG9TdHJpbmcoYVN0cikpIHtcbiAgICByZXR1cm4gJyQnICsgYVN0cjtcbiAgfVxuXG4gIHJldHVybiBhU3RyO1xufVxuZXhwb3J0cy50b1NldFN0cmluZyA9IHN1cHBvcnRzTnVsbFByb3RvID8gaWRlbnRpdHkgOiB0b1NldFN0cmluZztcblxuZnVuY3Rpb24gZnJvbVNldFN0cmluZyhhU3RyKSB7XG4gIGlmIChpc1Byb3RvU3RyaW5nKGFTdHIpKSB7XG4gICAgcmV0dXJuIGFTdHIuc2xpY2UoMSk7XG4gIH1cblxuICByZXR1cm4gYVN0cjtcbn1cbmV4cG9ydHMuZnJvbVNldFN0cmluZyA9IHN1cHBvcnRzTnVsbFByb3RvID8gaWRlbnRpdHkgOiBmcm9tU2V0U3RyaW5nO1xuXG5mdW5jdGlvbiBpc1Byb3RvU3RyaW5nKHMpIHtcbiAgaWYgKCFzKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIGxlbmd0aCA9IHMubGVuZ3RoO1xuXG4gIGlmIChsZW5ndGggPCA5IC8qIFwiX19wcm90b19fXCIubGVuZ3RoICovKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHMuY2hhckNvZGVBdChsZW5ndGggLSAxKSAhPT0gOTUgIC8qICdfJyAqLyB8fFxuICAgICAgcy5jaGFyQ29kZUF0KGxlbmd0aCAtIDIpICE9PSA5NSAgLyogJ18nICovIHx8XG4gICAgICBzLmNoYXJDb2RlQXQobGVuZ3RoIC0gMykgIT09IDExMSAvKiAnbycgKi8gfHxcbiAgICAgIHMuY2hhckNvZGVBdChsZW5ndGggLSA0KSAhPT0gMTE2IC8qICd0JyAqLyB8fFxuICAgICAgcy5jaGFyQ29kZUF0KGxlbmd0aCAtIDUpICE9PSAxMTEgLyogJ28nICovIHx8XG4gICAgICBzLmNoYXJDb2RlQXQobGVuZ3RoIC0gNikgIT09IDExNCAvKiAncicgKi8gfHxcbiAgICAgIHMuY2hhckNvZGVBdChsZW5ndGggLSA3KSAhPT0gMTEyIC8qICdwJyAqLyB8fFxuICAgICAgcy5jaGFyQ29kZUF0KGxlbmd0aCAtIDgpICE9PSA5NSAgLyogJ18nICovIHx8XG4gICAgICBzLmNoYXJDb2RlQXQobGVuZ3RoIC0gOSkgIT09IDk1ICAvKiAnXycgKi8pIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmb3IgKHZhciBpID0gbGVuZ3RoIC0gMTA7IGkgPj0gMDsgaS0tKSB7XG4gICAgaWYgKHMuY2hhckNvZGVBdChpKSAhPT0gMzYgLyogJyQnICovKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogQ29tcGFyYXRvciBiZXR3ZWVuIHR3byBtYXBwaW5ncyB3aGVyZSB0aGUgb3JpZ2luYWwgcG9zaXRpb25zIGFyZSBjb21wYXJlZC5cbiAqXG4gKiBPcHRpb25hbGx5IHBhc3MgaW4gYHRydWVgIGFzIGBvbmx5Q29tcGFyZUdlbmVyYXRlZGAgdG8gY29uc2lkZXIgdHdvXG4gKiBtYXBwaW5ncyB3aXRoIHRoZSBzYW1lIG9yaWdpbmFsIHNvdXJjZS9saW5lL2NvbHVtbiwgYnV0IGRpZmZlcmVudCBnZW5lcmF0ZWRcbiAqIGxpbmUgYW5kIGNvbHVtbiB0aGUgc2FtZS4gVXNlZnVsIHdoZW4gc2VhcmNoaW5nIGZvciBhIG1hcHBpbmcgd2l0aCBhXG4gKiBzdHViYmVkIG91dCBtYXBwaW5nLlxuICovXG5mdW5jdGlvbiBjb21wYXJlQnlPcmlnaW5hbFBvc2l0aW9ucyhtYXBwaW5nQSwgbWFwcGluZ0IsIG9ubHlDb21wYXJlT3JpZ2luYWwpIHtcbiAgdmFyIGNtcCA9IHN0cmNtcChtYXBwaW5nQS5zb3VyY2UsIG1hcHBpbmdCLnNvdXJjZSk7XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0Eub3JpZ2luYWxMaW5lIC0gbWFwcGluZ0Iub3JpZ2luYWxMaW5lO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IG1hcHBpbmdBLm9yaWdpbmFsQ29sdW1uIC0gbWFwcGluZ0Iub3JpZ2luYWxDb2x1bW47XG4gIGlmIChjbXAgIT09IDAgfHwgb25seUNvbXBhcmVPcmlnaW5hbCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICBjbXAgPSBtYXBwaW5nQS5nZW5lcmF0ZWRDb2x1bW4gLSBtYXBwaW5nQi5nZW5lcmF0ZWRDb2x1bW47XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0EuZ2VuZXJhdGVkTGluZSAtIG1hcHBpbmdCLmdlbmVyYXRlZExpbmU7XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgcmV0dXJuIHN0cmNtcChtYXBwaW5nQS5uYW1lLCBtYXBwaW5nQi5uYW1lKTtcbn1cbmV4cG9ydHMuY29tcGFyZUJ5T3JpZ2luYWxQb3NpdGlvbnMgPSBjb21wYXJlQnlPcmlnaW5hbFBvc2l0aW9ucztcblxuLyoqXG4gKiBDb21wYXJhdG9yIGJldHdlZW4gdHdvIG1hcHBpbmdzIHdpdGggZGVmbGF0ZWQgc291cmNlIGFuZCBuYW1lIGluZGljZXMgd2hlcmVcbiAqIHRoZSBnZW5lcmF0ZWQgcG9zaXRpb25zIGFyZSBjb21wYXJlZC5cbiAqXG4gKiBPcHRpb25hbGx5IHBhc3MgaW4gYHRydWVgIGFzIGBvbmx5Q29tcGFyZUdlbmVyYXRlZGAgdG8gY29uc2lkZXIgdHdvXG4gKiBtYXBwaW5ncyB3aXRoIHRoZSBzYW1lIGdlbmVyYXRlZCBsaW5lIGFuZCBjb2x1bW4sIGJ1dCBkaWZmZXJlbnRcbiAqIHNvdXJjZS9uYW1lL29yaWdpbmFsIGxpbmUgYW5kIGNvbHVtbiB0aGUgc2FtZS4gVXNlZnVsIHdoZW4gc2VhcmNoaW5nIGZvciBhXG4gKiBtYXBwaW5nIHdpdGggYSBzdHViYmVkIG91dCBtYXBwaW5nLlxuICovXG5mdW5jdGlvbiBjb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNEZWZsYXRlZChtYXBwaW5nQSwgbWFwcGluZ0IsIG9ubHlDb21wYXJlR2VuZXJhdGVkKSB7XG4gIHZhciBjbXAgPSBtYXBwaW5nQS5nZW5lcmF0ZWRMaW5lIC0gbWFwcGluZ0IuZ2VuZXJhdGVkTGluZTtcbiAgaWYgKGNtcCAhPT0gMCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICBjbXAgPSBtYXBwaW5nQS5nZW5lcmF0ZWRDb2x1bW4gLSBtYXBwaW5nQi5nZW5lcmF0ZWRDb2x1bW47XG4gIGlmIChjbXAgIT09IDAgfHwgb25seUNvbXBhcmVHZW5lcmF0ZWQpIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gc3RyY21wKG1hcHBpbmdBLnNvdXJjZSwgbWFwcGluZ0Iuc291cmNlKTtcbiAgaWYgKGNtcCAhPT0gMCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICBjbXAgPSBtYXBwaW5nQS5vcmlnaW5hbExpbmUgLSBtYXBwaW5nQi5vcmlnaW5hbExpbmU7XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0Eub3JpZ2luYWxDb2x1bW4gLSBtYXBwaW5nQi5vcmlnaW5hbENvbHVtbjtcbiAgaWYgKGNtcCAhPT0gMCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICByZXR1cm4gc3RyY21wKG1hcHBpbmdBLm5hbWUsIG1hcHBpbmdCLm5hbWUpO1xufVxuZXhwb3J0cy5jb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNEZWZsYXRlZCA9IGNvbXBhcmVCeUdlbmVyYXRlZFBvc2l0aW9uc0RlZmxhdGVkO1xuXG5mdW5jdGlvbiBzdHJjbXAoYVN0cjEsIGFTdHIyKSB7XG4gIGlmIChhU3RyMSA9PT0gYVN0cjIpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGlmIChhU3RyMSA9PT0gbnVsbCkge1xuICAgIHJldHVybiAxOyAvLyBhU3RyMiAhPT0gbnVsbFxuICB9XG5cbiAgaWYgKGFTdHIyID09PSBudWxsKSB7XG4gICAgcmV0dXJuIC0xOyAvLyBhU3RyMSAhPT0gbnVsbFxuICB9XG5cbiAgaWYgKGFTdHIxID4gYVN0cjIpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIHJldHVybiAtMTtcbn1cblxuLyoqXG4gKiBDb21wYXJhdG9yIGJldHdlZW4gdHdvIG1hcHBpbmdzIHdpdGggaW5mbGF0ZWQgc291cmNlIGFuZCBuYW1lIHN0cmluZ3Mgd2hlcmVcbiAqIHRoZSBnZW5lcmF0ZWQgcG9zaXRpb25zIGFyZSBjb21wYXJlZC5cbiAqL1xuZnVuY3Rpb24gY29tcGFyZUJ5R2VuZXJhdGVkUG9zaXRpb25zSW5mbGF0ZWQobWFwcGluZ0EsIG1hcHBpbmdCKSB7XG4gIHZhciBjbXAgPSBtYXBwaW5nQS5nZW5lcmF0ZWRMaW5lIC0gbWFwcGluZ0IuZ2VuZXJhdGVkTGluZTtcbiAgaWYgKGNtcCAhPT0gMCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICBjbXAgPSBtYXBwaW5nQS5nZW5lcmF0ZWRDb2x1bW4gLSBtYXBwaW5nQi5nZW5lcmF0ZWRDb2x1bW47XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gc3RyY21wKG1hcHBpbmdBLnNvdXJjZSwgbWFwcGluZ0Iuc291cmNlKTtcbiAgaWYgKGNtcCAhPT0gMCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICBjbXAgPSBtYXBwaW5nQS5vcmlnaW5hbExpbmUgLSBtYXBwaW5nQi5vcmlnaW5hbExpbmU7XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0Eub3JpZ2luYWxDb2x1bW4gLSBtYXBwaW5nQi5vcmlnaW5hbENvbHVtbjtcbiAgaWYgKGNtcCAhPT0gMCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICByZXR1cm4gc3RyY21wKG1hcHBpbmdBLm5hbWUsIG1hcHBpbmdCLm5hbWUpO1xufVxuZXhwb3J0cy5jb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNJbmZsYXRlZCA9IGNvbXBhcmVCeUdlbmVyYXRlZFBvc2l0aW9uc0luZmxhdGVkO1xuXG4vKipcbiAqIFN0cmlwIGFueSBKU09OIFhTU0kgYXZvaWRhbmNlIHByZWZpeCBmcm9tIHRoZSBzdHJpbmcgKGFzIGRvY3VtZW50ZWRcbiAqIGluIHRoZSBzb3VyY2UgbWFwcyBzcGVjaWZpY2F0aW9uKSwgYW5kIHRoZW4gcGFyc2UgdGhlIHN0cmluZyBhc1xuICogSlNPTi5cbiAqL1xuZnVuY3Rpb24gcGFyc2VTb3VyY2VNYXBJbnB1dChzdHIpIHtcbiAgcmV0dXJuIEpTT04ucGFyc2Uoc3RyLnJlcGxhY2UoL15cXCldfSdbXlxcbl0qXFxuLywgJycpKTtcbn1cbmV4cG9ydHMucGFyc2VTb3VyY2VNYXBJbnB1dCA9IHBhcnNlU291cmNlTWFwSW5wdXQ7XG5cbi8qKlxuICogQ29tcHV0ZSB0aGUgVVJMIG9mIGEgc291cmNlIGdpdmVuIHRoZSB0aGUgc291cmNlIHJvb3QsIHRoZSBzb3VyY2Unc1xuICogVVJMLCBhbmQgdGhlIHNvdXJjZSBtYXAncyBVUkwuXG4gKi9cbmZ1bmN0aW9uIGNvbXB1dGVTb3VyY2VVUkwoc291cmNlUm9vdCwgc291cmNlVVJMLCBzb3VyY2VNYXBVUkwpIHtcbiAgc291cmNlVVJMID0gc291cmNlVVJMIHx8ICcnO1xuXG4gIGlmIChzb3VyY2VSb290KSB7XG4gICAgLy8gVGhpcyBmb2xsb3dzIHdoYXQgQ2hyb21lIGRvZXMuXG4gICAgaWYgKHNvdXJjZVJvb3Rbc291cmNlUm9vdC5sZW5ndGggLSAxXSAhPT0gJy8nICYmIHNvdXJjZVVSTFswXSAhPT0gJy8nKSB7XG4gICAgICBzb3VyY2VSb290ICs9ICcvJztcbiAgICB9XG4gICAgLy8gVGhlIHNwZWMgc2F5czpcbiAgICAvLyAgIExpbmUgNDogQW4gb3B0aW9uYWwgc291cmNlIHJvb3QsIHVzZWZ1bCBmb3IgcmVsb2NhdGluZyBzb3VyY2VcbiAgICAvLyAgIGZpbGVzIG9uIGEgc2VydmVyIG9yIHJlbW92aW5nIHJlcGVhdGVkIHZhbHVlcyBpbiB0aGVcbiAgICAvLyAgIFx1MjAxQ3NvdXJjZXNcdTIwMUQgZW50cnkuICBUaGlzIHZhbHVlIGlzIHByZXBlbmRlZCB0byB0aGUgaW5kaXZpZHVhbFxuICAgIC8vICAgZW50cmllcyBpbiB0aGUgXHUyMDFDc291cmNlXHUyMDFEIGZpZWxkLlxuICAgIHNvdXJjZVVSTCA9IHNvdXJjZVJvb3QgKyBzb3VyY2VVUkw7XG4gIH1cblxuICAvLyBIaXN0b3JpY2FsbHksIFNvdXJjZU1hcENvbnN1bWVyIGRpZCBub3QgdGFrZSB0aGUgc291cmNlTWFwVVJMIGFzXG4gIC8vIGEgcGFyYW1ldGVyLiAgVGhpcyBtb2RlIGlzIHN0aWxsIHNvbWV3aGF0IHN1cHBvcnRlZCwgd2hpY2ggaXMgd2h5XG4gIC8vIHRoaXMgY29kZSBibG9jayBpcyBjb25kaXRpb25hbC4gIEhvd2V2ZXIsIGl0J3MgcHJlZmVyYWJsZSB0byBwYXNzXG4gIC8vIHRoZSBzb3VyY2UgbWFwIFVSTCB0byBTb3VyY2VNYXBDb25zdW1lciwgc28gdGhhdCB0aGlzIGZ1bmN0aW9uXG4gIC8vIGNhbiBpbXBsZW1lbnQgdGhlIHNvdXJjZSBVUkwgcmVzb2x1dGlvbiBhbGdvcml0aG0gYXMgb3V0bGluZWQgaW5cbiAgLy8gdGhlIHNwZWMuICBUaGlzIGJsb2NrIGlzIGJhc2ljYWxseSB0aGUgZXF1aXZhbGVudCBvZjpcbiAgLy8gICAgbmV3IFVSTChzb3VyY2VVUkwsIHNvdXJjZU1hcFVSTCkudG9TdHJpbmcoKVxuICAvLyAuLi4gZXhjZXB0IGl0IGF2b2lkcyB1c2luZyBVUkwsIHdoaWNoIHdhc24ndCBhdmFpbGFibGUgaW4gdGhlXG4gIC8vIG9sZGVyIHJlbGVhc2VzIG9mIG5vZGUgc3RpbGwgc3VwcG9ydGVkIGJ5IHRoaXMgbGlicmFyeS5cbiAgLy9cbiAgLy8gVGhlIHNwZWMgc2F5czpcbiAgLy8gICBJZiB0aGUgc291cmNlcyBhcmUgbm90IGFic29sdXRlIFVSTHMgYWZ0ZXIgcHJlcGVuZGluZyBvZiB0aGVcbiAgLy8gICBcdTIwMUNzb3VyY2VSb290XHUyMDFELCB0aGUgc291cmNlcyBhcmUgcmVzb2x2ZWQgcmVsYXRpdmUgdG8gdGhlXG4gIC8vICAgU291cmNlTWFwIChsaWtlIHJlc29sdmluZyBzY3JpcHQgc3JjIGluIGEgaHRtbCBkb2N1bWVudCkuXG4gIGlmIChzb3VyY2VNYXBVUkwpIHtcbiAgICB2YXIgcGFyc2VkID0gdXJsUGFyc2Uoc291cmNlTWFwVVJMKTtcbiAgICBpZiAoIXBhcnNlZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwic291cmNlTWFwVVJMIGNvdWxkIG5vdCBiZSBwYXJzZWRcIik7XG4gICAgfVxuICAgIGlmIChwYXJzZWQucGF0aCkge1xuICAgICAgLy8gU3RyaXAgdGhlIGxhc3QgcGF0aCBjb21wb25lbnQsIGJ1dCBrZWVwIHRoZSBcIi9cIi5cbiAgICAgIHZhciBpbmRleCA9IHBhcnNlZC5wYXRoLmxhc3RJbmRleE9mKCcvJyk7XG4gICAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICBwYXJzZWQucGF0aCA9IHBhcnNlZC5wYXRoLnN1YnN0cmluZygwLCBpbmRleCArIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBzb3VyY2VVUkwgPSBqb2luKHVybEdlbmVyYXRlKHBhcnNlZCksIHNvdXJjZVVSTCk7XG4gIH1cblxuICByZXR1cm4gbm9ybWFsaXplKHNvdXJjZVVSTCk7XG59XG5leHBvcnRzLmNvbXB1dGVTb3VyY2VVUkwgPSBjb21wdXRlU291cmNlVVJMO1xuIiwgIi8qXG4gKiBDb3B5cmlnaHQgMjAwOS0yMDExIE1vemlsbGEgRm91bmRhdGlvbiBhbmQgY29udHJpYnV0b3JzXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTmV3IEJTRCBsaWNlbnNlLiBTZWUgTElDRU5TRS50eHQgb3I6XG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvQlNELTMtQ2xhdXNlXG4gKi9cbmV4cG9ydHMuU291cmNlTWFwR2VuZXJhdG9yID0gcmVxdWlyZSgnLi9saWIvc291cmNlLW1hcC1nZW5lcmF0b3InKS5Tb3VyY2VNYXBHZW5lcmF0b3I7XG5leHBvcnRzLlNvdXJjZU1hcENvbnN1bWVyID0gcmVxdWlyZSgnLi9saWIvc291cmNlLW1hcC1jb25zdW1lcicpLlNvdXJjZU1hcENvbnN1bWVyO1xuZXhwb3J0cy5Tb3VyY2VOb2RlID0gcmVxdWlyZSgnLi9saWIvc291cmNlLW5vZGUnKS5Tb3VyY2VOb2RlO1xuIiwgIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChhcnJfLCBwcmVkKSA9PiB7XG5cbiAgICBjb25zdCBhcnIgICA9IGFycl8gfHwgW10sXG4gICAgICAgICAgc3BhbnMgPSBbXVxuICAgIFxuICAgIGxldCBzcGFuID0geyBsYWJlbDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICBpdGVtczogW2Fyci5maXJzdF0gfVxuICAgICAgICAgICAgICAgICBcbiAgICBhcnIuZm9yRWFjaCAoeCA9PiB7XG5cbiAgICAgICAgY29uc3QgbGFiZWwgPSBwcmVkICh4KVxuXG4gICAgICAgIGlmICgoc3Bhbi5sYWJlbCAhPT0gbGFiZWwpICYmIHNwYW4uaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBzcGFucy5wdXNoIChzcGFuID0geyBsYWJlbDogbGFiZWwsIGl0ZW1zOiBbeF0gfSkgfVxuXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc3Bhbi5pdGVtcy5wdXNoICh4KSB9IH0pXG5cbiAgICByZXR1cm4gc3BhbnNcbn0iLCAiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuY29uc3QgTyAgICAgICAgICAgID0gT2JqZWN0LFxuICAgICAgaXNCcm93c2VyICAgID0gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSAmJiAod2luZG93LndpbmRvdyA9PT0gd2luZG93KSAmJiB3aW5kb3cubmF2aWdhdG9yLFxuICAgICAgbGFzdE9mICAgICAgID0geCA9PiB4W3gubGVuZ3RoIC0gMV0sXG4gICAgICBnZXRTb3VyY2UgICAgPSByZXF1aXJlICgnZ2V0LXNvdXJjZScpLFxuICAgICAgcGFydGl0aW9uICAgID0gcmVxdWlyZSAoJy4vaW1wbC9wYXJ0aXRpb24nKSxcbiAgICAgIGFzVGFibGUgICAgICA9IHJlcXVpcmUgKCdhcy10YWJsZScpLFxuICAgICAgbml4U2xhc2hlcyAgID0geCA9PiB4LnJlcGxhY2UgKC9cXFxcL2csICcvJyksXG4gICAgICBwYXRoUm9vdCAgICAgPSBpc0Jyb3dzZXIgPyB3aW5kb3cubG9jYXRpb24uaHJlZiA6IChuaXhTbGFzaGVzIChwcm9jZXNzLmN3ZCAoKSkgKyAnLycpXG5cbi8qICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuY2xhc3MgU3RhY2tUcmFjZXkgZXh0ZW5kcyBBcnJheSB7XG5cbiAgICBjb25zdHJ1Y3RvciAoaW5wdXQsIG9mZnNldCkge1xuICAgICAgICBcbiAgICAgICAgY29uc3Qgb3JpZ2luYWxJbnB1dCAgICAgICAgICA9IGlucHV0XG4gICAgICAgICAgICAsIGlzUGFyc2VhYmxlU3ludGF4RXJyb3IgPSBpbnB1dCAmJiAoaW5wdXQgaW5zdGFuY2VvZiBTeW50YXhFcnJvciAmJiAhaXNCcm93c2VyKVxuICAgICAgICBcbiAgICAgICAgc3VwZXIgKClcblxuICAgIC8qICBGaXhlcyBmb3IgU2FmYXJpICAgICovXG5cbiAgICAgICAgdGhpcy5jb25zdHJ1Y3RvciA9IFN0YWNrVHJhY2V5XG4gICAgICAgIHRoaXMuX19wcm90b19fICAgPSBTdGFja1RyYWNleS5wcm90b3R5cGVcblxuICAgIC8qICBuZXcgU3RhY2tUcmFjZXkgKCkgICAgICAgICAgICAqL1xuXG4gICAgICAgIGlmICghaW5wdXQpIHtcbiAgICAgICAgICAgICBpbnB1dCA9IG5ldyBFcnJvciAoKVxuICAgICAgICAgICAgIG9mZnNldCA9IChvZmZzZXQgPT09IHVuZGVmaW5lZCkgPyAxIDogb2Zmc2V0XG4gICAgICAgIH1cblxuICAgIC8qICBuZXcgU3RhY2tUcmFjZXkgKEVycm9yKSAgICAgICovXG5cbiAgICAgICAgaWYgKGlucHV0IGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgIGlucHV0ID0gaW5wdXRbU3RhY2tUcmFjZXkuc3RhY2tdIHx8IGlucHV0LnN0YWNrIHx8ICcnXG4gICAgICAgIH1cblxuICAgIC8qICBuZXcgU3RhY2tUcmFjZXkgKHN0cmluZykgICAgICovXG5cbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlucHV0ID0gU3RhY2tUcmFjZXkucmF3UGFyc2UgKGlucHV0KS5zbGljZSAob2Zmc2V0KS5tYXAgKFN0YWNrVHJhY2V5LmV4dHJhY3RFbnRyeU1ldGFkYXRhKVxuICAgICAgICB9XG5cbiAgICAvKiAgbmV3IFN0YWNrVHJhY2V5IChhcnJheSkgICAgICAqL1xuXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5IChpbnB1dCkpIHtcblxuICAgICAgICAgICAgaWYgKGlzUGFyc2VhYmxlU3ludGF4RXJyb3IpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zdCByYXdMaW5lcyAgID0gbW9kdWxlLnJlcXVpcmUgKCd1dGlsJykuaW5zcGVjdCAob3JpZ2luYWxJbnB1dCkuc3BsaXQgKCdcXG4nKVxuICAgICAgICAgICAgICAgICAgICAsIGZpbGVMaW5lID0gcmF3TGluZXNbMF0uc3BsaXQgKCc6JylcbiAgICAgICAgICAgICAgICAgICAgLCBsaW5lID0gZmlsZUxpbmUucG9wICgpXG4gICAgICAgICAgICAgICAgICAgICwgZmlsZSA9IGZpbGVMaW5lLmpvaW4gKCc6JylcblxuICAgICAgICAgICAgICAgIGlmIChmaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0LnVuc2hpZnQgKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGU6IG5peFNsYXNoZXMgKGZpbGUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZTogbGluZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbjogKHJhd0xpbmVzWzJdIHx8ICcnKS5pbmRleE9mICgnXicpICsgMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZUxpbmU6IHJhd0xpbmVzWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGVlOiAnKHN5bnRheCBlcnJvciknLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3ludGF4RXJyb3I6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubGVuZ3RoID0gaW5wdXQubGVuZ3RoXG4gICAgICAgICAgICBpbnB1dC5mb3JFYWNoICgoeCwgaSkgPT4gdGhpc1tpXSA9IHgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgZXh0cmFjdEVudHJ5TWV0YWRhdGEgKGUpIHtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGZpbGVSZWxhdGl2ZSA9IFN0YWNrVHJhY2V5LnJlbGF0aXZlUGF0aCAoZS5maWxlIHx8ICcnKVxuXG4gICAgICAgIHJldHVybiBPLmFzc2lnbiAoZSwge1xuXG4gICAgICAgICAgICBjYWxsZWVTaG9ydDogIGUuY2FsbGVlU2hvcnQgfHwgbGFzdE9mICgoZS5jYWxsZWUgfHwgJycpLnNwbGl0ICgnLicpKSxcbiAgICAgICAgICAgIGZpbGVSZWxhdGl2ZTogZmlsZVJlbGF0aXZlLFxuICAgICAgICAgICAgZmlsZVNob3J0OiAgICBTdGFja1RyYWNleS5zaG9ydGVuUGF0aCAoZmlsZVJlbGF0aXZlKSxcbiAgICAgICAgICAgIGZpbGVOYW1lOiAgICAgbGFzdE9mICgoZS5maWxlIHx8ICcnKS5zcGxpdCAoJy8nKSksXG4gICAgICAgICAgICB0aGlyZFBhcnR5OiAgIFN0YWNrVHJhY2V5LmlzVGhpcmRQYXJ0eSAoZmlsZVJlbGF0aXZlKSAmJiAhZS5pbmRleFxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHN0YXRpYyBzaG9ydGVuUGF0aCAocmVsYXRpdmVQYXRoKSB7XG4gICAgICAgIHJldHVybiByZWxhdGl2ZVBhdGgucmVwbGFjZSAoL15ub2RlX21vZHVsZXNcXC8vLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlICgvXndlYnBhY2tcXC9ib290c3RyYXBcXC8vLCAnJylcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVsYXRpdmVQYXRoIChmdWxsUGF0aCkge1xuICAgICAgICByZXR1cm4gZnVsbFBhdGgucmVwbGFjZSAocGF0aFJvb3QsICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSAoL14uKlxcOlxcL1xcLz9cXC8/LywgJycpXG4gICAgfVxuXG4gICAgc3RhdGljIGlzVGhpcmRQYXJ0eSAocmVsYXRpdmVQYXRoKSB7XG4gICAgICAgIHJldHVybiAocmVsYXRpdmVQYXRoWzBdID09PSAnficpICAgICAgICAgICAgICAgICAgICAgICAgICB8fCAvLyB3ZWJwYWNrLXNwZWNpZmljIGhldXJpc3RpY1xuICAgICAgICAgICAgICAgKHJlbGF0aXZlUGF0aFswXSA9PT0gJy8nKSAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgLy8gZXh0ZXJuYWwgc291cmNlXG4gICAgICAgICAgICAgICAocmVsYXRpdmVQYXRoLmluZGV4T2YgKCdub2RlX21vZHVsZXMnKSAgICAgID09PSAwKSB8fFxuICAgICAgICAgICAgICAgKHJlbGF0aXZlUGF0aC5pbmRleE9mICgnd2VicGFjay9ib290c3RyYXAnKSA9PT0gMClcbiAgICB9XG5cbiAgICBzdGF0aWMgcmF3UGFyc2UgKHN0cikge1xuXG4gICAgICAgIGNvbnN0IGxpbmVzID0gKHN0ciB8fCAnJykuc3BsaXQgKCdcXG4nKVxuXG4gICAgICAgIGNvbnN0IGVudHJpZXMgPSBsaW5lcy5tYXAgKGxpbmUgPT4geyBsaW5lID0gbGluZS50cmltICgpXG5cbiAgICAgICAgICAgIHZhciBjYWxsZWUsIGZpbGVMaW5lQ29sdW1uID0gW10sIG5hdGl2ZSwgcGxhbkEsIHBsYW5CXG5cbiAgICAgICAgICAgIGlmICgocGxhbkEgPSBsaW5lLm1hdGNoICgvYXQgKC4rKSBcXCgoLispXFwpLykpIHx8XG4gICAgICAgICAgICAgICAgKHBsYW5BID0gbGluZS5tYXRjaCAoLyguKilAKC4qKS8pKSkge1xuXG4gICAgICAgICAgICAgICAgY2FsbGVlICAgICAgICAgPSAgcGxhbkFbMV1cbiAgICAgICAgICAgICAgICBuYXRpdmUgICAgICAgICA9IChwbGFuQVsyXSA9PT0gJ25hdGl2ZScpXG4gICAgICAgICAgICAgICAgZmlsZUxpbmVDb2x1bW4gPSAocGxhbkFbMl0ubWF0Y2ggKC8oLiopOiguKyk6KC4rKS8pIHx8IFtdKS5zbGljZSAoMSlcblxuICAgICAgICAgICAgfSBlbHNlIGlmICgocGxhbkIgPSBsaW5lLm1hdGNoICgvXihhdFxccyspKiguKyk6KFswLTldKyk6KFswLTldKykvKSApKSB7XG4gICAgICAgICAgICAgICAgZmlsZUxpbmVDb2x1bW4gPSAocGxhbkIpLnNsaWNlICgyKVxuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgICAgIH1cblxuICAgICAgICAvKiAgRGV0ZWN0IHRoaW5ncyBsaWtlIEFycmF5LnJlZHVjZVxuICAgICAgICAgICAgVE9ETzogZGV0ZWN0IG1vcmUgYnVpbHQtaW4gdHlwZXMgICAgICAgICAgICAqL1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoY2FsbGVlICYmICFmaWxlTGluZUNvbHVtblswXSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBjYWxsZWUuc3BsaXQgKCcuJylbMF1cbiAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gJ0FycmF5Jykge1xuICAgICAgICAgICAgICAgICAgICBuYXRpdmUgPSB0cnVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGJlZm9yZVBhcnNlOiBsaW5lLFxuICAgICAgICAgICAgICAgIGNhbGxlZTogICAgICBjYWxsZWUgfHwgJycsXG4gICAgICAgICAgICAgICAgaW5kZXg6ICAgICAgIGlzQnJvd3NlciAmJiAoZmlsZUxpbmVDb2x1bW5bMF0gPT09IHdpbmRvdy5sb2NhdGlvbi5ocmVmKSxcbiAgICAgICAgICAgICAgICBuYXRpdmU6ICAgICAgbmF0aXZlIHx8IGZhbHNlLFxuICAgICAgICAgICAgICAgIGZpbGU6ICAgICAgICBuaXhTbGFzaGVzIChmaWxlTGluZUNvbHVtblswXSB8fCAnJyksXG4gICAgICAgICAgICAgICAgbGluZTogICAgICAgIHBhcnNlSW50IChmaWxlTGluZUNvbHVtblsxXSB8fCAnJywgMTApIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjb2x1bW46ICAgICAgcGFyc2VJbnQgKGZpbGVMaW5lQ29sdW1uWzJdIHx8ICcnLCAxMCkgfHwgdW5kZWZpbmVkXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIGVudHJpZXMuZmlsdGVyICh4ID0+ICh4ICE9PSB1bmRlZmluZWQpKVxuICAgIH1cblxuICAgIHdpdGhTb3VyY2UgKGkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbaV0gJiYgU3RhY2tUcmFjZXkud2l0aFNvdXJjZSAodGhpc1tpXSlcbiAgICB9XG5cbiAgICBzdGF0aWMgd2l0aFNvdXJjZSAobG9jKSB7XG5cbiAgICAgICAgaWYgKGxvYy5zb3VyY2VGaWxlIHx8IChsb2MuZmlsZSAmJiBsb2MuZmlsZS5pbmRleE9mICgnPCcpID49IDApKSB7IC8vIHNraXAgdGhpbmdzIGxpa2UgPGFub255bW91cz4gYW5kIHN0dWZmIHRoYXQgd2FzIGFscmVhZHkgZmV0Y2hlZFxuICAgICAgICAgICAgcmV0dXJuIGxvY1xuICAgICAgICAgICAgXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIGxldCByZXNvbHZlZCA9IGdldFNvdXJjZSAobG9jLmZpbGUgfHwgJycpLnJlc29sdmUgKGxvYylcblxuICAgICAgICAgICAgaWYgKCFyZXNvbHZlZC5zb3VyY2VGaWxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxvY1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXJlc29sdmVkLnNvdXJjZUZpbGUuZXJyb3IpIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlZC5maWxlID0gbml4U2xhc2hlcyAocmVzb2x2ZWQuc291cmNlRmlsZS5wYXRoKVxuICAgICAgICAgICAgICAgIHJlc29sdmVkID0gU3RhY2tUcmFjZXkuZXh0cmFjdEVudHJ5TWV0YWRhdGEgKHJlc29sdmVkKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXJlc29sdmVkLnNvdXJjZUxpbmUuZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzb2x2ZWQuc291cmNlTGluZS5pbmNsdWRlcyAoJy8vIEBoaWRlJykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZWQuc291cmNlTGluZSA9IHJlc29sdmVkLnNvdXJjZUxpbmUucmVwbGFjZSAgKCcvLyBAaGlkZScsICcnKVxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlZC5oaWRlICAgICAgID0gdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzb2x2ZWQuc291cmNlTGluZS5pbmNsdWRlcyAoJ19fd2VicGFja19yZXF1aXJlX18nKSB8fCAvLyB3ZWJwYWNrLXNwZWNpZmljIGhldXJpc3RpY3NcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZWQuc291cmNlTGluZS5pbmNsdWRlcyAoJy8qKioqKiovICh7JykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZWQudGhpcmRQYXJ0eSA9IHRydWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBPLmFzc2lnbiAoeyBzb3VyY2VMaW5lOiAnJyB9LCBsb2MsIHJlc29sdmVkKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IHdpdGhTb3VyY2VzICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTdGFja1RyYWNleSAodGhpcy5tYXAgKFN0YWNrVHJhY2V5LndpdGhTb3VyY2UpKVxuICAgIH1cblxuICAgIGdldCBtZXJnZVJlcGVhdGVkTGluZXMgKCkge1xuICAgICAgICByZXR1cm4gbmV3IFN0YWNrVHJhY2V5IChcbiAgICAgICAgICAgIHBhcnRpdGlvbiAodGhpcywgZSA9PiBlLmZpbGUgKyBlLmxpbmUpLm1hcCAoXG4gICAgICAgICAgICAgICAgZ3JvdXAgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ3JvdXAuaXRlbXMuc2xpY2UgKDEpLnJlZHVjZSAoKG1lbW8sIGVudHJ5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZW1vLmNhbGxlZSAgICAgID0gKG1lbW8uY2FsbGVlICAgICAgfHwgJzxhbm9ueW1vdXM+JykgKyAnIFx1MjE5MiAnICsgKGVudHJ5LmNhbGxlZSAgICAgIHx8ICc8YW5vbnltb3VzPicpXG4gICAgICAgICAgICAgICAgICAgICAgICBtZW1vLmNhbGxlZVNob3J0ID0gKG1lbW8uY2FsbGVlU2hvcnQgfHwgJzxhbm9ueW1vdXM+JykgKyAnIFx1MjE5MiAnICsgKGVudHJ5LmNhbGxlZVNob3J0IHx8ICc8YW5vbnltb3VzPicpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWVtbyB9LCBPLmFzc2lnbiAoe30sIGdyb3VwLml0ZW1zWzBdKSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApXG4gICAgICAgIClcbiAgICB9XG5cbiAgICBnZXQgY2xlYW4gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy53aXRoU291cmNlcy5tZXJnZVJlcGVhdGVkTGluZXMuZmlsdGVyICgoZSwgaSkgPT4gKGkgPT09IDApIHx8ICEoZS50aGlyZFBhcnR5IHx8IGUuaGlkZSB8fCBlLm5hdGl2ZSkpXG4gICAgfVxuXG4gICAgYXQgKGkpIHtcbiAgICAgICAgcmV0dXJuIE8uYXNzaWduICh7XG5cbiAgICAgICAgICAgIGJlZm9yZVBhcnNlOiAnJyxcbiAgICAgICAgICAgIGNhbGxlZTogICAgICAnPD8/Pz4nLFxuICAgICAgICAgICAgaW5kZXg6ICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgbmF0aXZlOiAgICAgIGZhbHNlLFxuICAgICAgICAgICAgZmlsZTogICAgICAgICc8Pz8/PicsXG4gICAgICAgICAgICBsaW5lOiAgICAgICAgMCxcbiAgICAgICAgICAgIGNvbHVtbjogICAgICAwXG5cbiAgICAgICAgfSwgdGhpc1tpXSlcbiAgICB9XG5cbiAgICBzdGF0aWMgbG9jYXRpb25zRXF1YWwgKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIChhLmZpbGUgICA9PT0gYi5maWxlKSAmJlxuICAgICAgICAgICAgICAgKGEubGluZSAgID09PSBiLmxpbmUpICYmXG4gICAgICAgICAgICAgICAoYS5jb2x1bW4gPT09IGIuY29sdW1uKVxuICAgIH1cblxuICAgIGdldCBwcmV0dHkgKCkge1xuXG4gICAgICAgIGNvbnN0IHRyaW1FbmQgICA9IChzLCBuKSA9PiBzICYmICgocy5sZW5ndGggPiBuKSA/IChzLnNsaWNlICgwLCBuLTEpICsgJ1x1MjAyNicpIDogcykgICBcbiAgICAgICAgY29uc3QgdHJpbVN0YXJ0ID0gKHMsIG4pID0+IHMgJiYgKChzLmxlbmd0aCA+IG4pID8gKCdcdTIwMjYnICsgcy5zbGljZSAoLShuLTEpKSkgOiBzKVxuXG4gICAgICAgIHJldHVybiBhc1RhYmxlICh0aGlzLndpdGhTb3VyY2VzLm1hcCAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZSA9PiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgnYXQgJyArIHRyaW1FbmQgKGUuY2FsbGVlU2hvcnQsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdGFja1RyYWNleS5tYXhDb2x1bW5XaWR0aHMuY2FsbGVlKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyaW1TdGFydCAoKGUuZmlsZVNob3J0ICYmIChlLmZpbGVTaG9ydCArICc6JyArIGUubGluZSkpIHx8ICcnLCBTdGFja1RyYWNleS5tYXhDb2x1bW5XaWR0aHMuZmlsZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyaW1FbmQgKCgoZS5zb3VyY2VMaW5lIHx8ICcnKS50cmltICgpIHx8ICcnKSwgICAgICAgICAgICAgICAgICBTdGFja1RyYWNleS5tYXhDb2x1bW5XaWR0aHMuc291cmNlTGluZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKSlcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVzZXRDYWNoZSAoKSB7XG5cbiAgICAgICAgZ2V0U291cmNlLnJlc2V0Q2FjaGUgKClcbiAgICB9XG59XG5cbi8qICBTb21lIGRlZmF1bHQgY29uZmlndXJhdGlvbiBvcHRpb25zXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cblN0YWNrVHJhY2V5Lm1heENvbHVtbldpZHRocyA9IHtcblxuICAgIGNhbGxlZTogICAgIDMwLFxuICAgIGZpbGU6ICAgICAgIDQwLFxuICAgIHNvdXJjZUxpbmU6IDgwXG59XG5cbi8qICBDaGFpbmluZyBoZWxwZXIgZm9yIC5pc1RoaXJkUGFydHlcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuOygoKSA9PiB7XG5cbiAgICBjb25zdCBtZXRob2RzID0ge1xuXG4gICAgICAgIGluY2x1ZGUgKHByZWQpIHtcblxuICAgICAgICAgICAgY29uc3QgZiA9IFN0YWNrVHJhY2V5LmlzVGhpcmRQYXJ0eVxuICAgICAgICAgICAgTy5hc3NpZ24gKFN0YWNrVHJhY2V5LmlzVGhpcmRQYXJ0eSA9IChwYXRoID0+IGYgKHBhdGgpIHx8ICBwcmVkIChwYXRoKSksIG1ldGhvZHMpXG4gICAgICAgIH0sXG5cbiAgICAgICAgZXhjZXB0IChwcmVkKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGYgPSBTdGFja1RyYWNleS5pc1RoaXJkUGFydHlcbiAgICAgICAgICAgIE8uYXNzaWduIChTdGFja1RyYWNleS5pc1RoaXJkUGFydHkgPSAocGF0aCA9PiBmIChwYXRoKSAmJiAhcHJlZCAocGF0aCkpLCBtZXRob2RzKVxuICAgICAgICB9LFxuICAgIH1cblxuICAgIE8uYXNzaWduIChTdGFja1RyYWNleS5pc1RoaXJkUGFydHksIG1ldGhvZHMpXG5cbn0pICgpXG5cbi8qICBBcnJheSBtZXRob2RzXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbjtbJ21hcCcsICdmaWx0ZXInLCAnc2xpY2UnLCAnY29uY2F0JywgJ3JldmVyc2UnXS5mb3JFYWNoIChuYW1lID0+IHtcblxuICAgIFN0YWNrVHJhY2V5LnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uICgvKi4uLmFyZ3MgKi8pIHsgLy8gbm8gc3VwcG9ydCBmb3IgLi4uYXJncyBpbiBOb2RlIHY0IDooXG4gICAgICAgIFxuICAgICAgICBjb25zdCBhcnIgPSBBcnJheS5mcm9tICh0aGlzKVxuICAgICAgICByZXR1cm4gbmV3IFN0YWNrVHJhY2V5IChhcnJbbmFtZV0uYXBwbHkgKGFyciwgYXJndW1lbnRzKSlcbiAgICB9XG59KVxuXG4vKiAgQSBwcml2YXRlIGZpZWxkIHRoYXQgYW4gRXJyb3IgaW5zdGFuY2UgY2FuIGV4cG9zZVxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5TdGFja1RyYWNleS5zdGFjayA9IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovICh0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJykgPyBTeW1ib2wuZm9yICgnU3RhY2tUcmFjZXknKSA6ICdfX1N0YWNrVHJhY2V5J1xuXG4vKiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbm1vZHVsZS5leHBvcnRzID0gU3RhY2tUcmFjZXlcblxuLyogIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4iLCAiLyogIEVudHJ5IHBvaW50IGZvciBCcm93c2VyaWZ5IGJ1bmRsZSAoZ2VuZXJhdGVkIGF0IGBidWlsZC9wYW5pYy1vdmVybGF5LmJyb3dzZXIuanNgKSAgKi9cblxuaW1wb3J0IHBhbmljIGZyb20gJy4vcGFuaWMtb3ZlcmxheSdcblxud2luZG93LnBhbmljID0gcGFuaWMiLCAiaW1wb3J0IFN0YWNrVHJhY2V5IGZyb20gJ3N0YWNrdHJhY2V5J1xuaW1wb3J0IHBhdGggZnJvbSAnZ2V0LXNvdXJjZS9pbXBsL3BhdGgnXG5cbmNvbnN0IHsgYXNzaWduIH0gPSBPYmplY3RcbmNvbnN0IHsgbWluLCBtYXggfSA9IE1hdGhcblxuLyogIERPTSBIRUxQRVJTIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICAgICovXG5cbmNvbnN0IG5hbm9zY3JpcHQgPSAoY2xhc3NQcmVmaXggPSAnJykgPT4gZnVuY3Rpb24gY3JlYXRlRWxlbWVudCAodGFnSWRDbGFzc2VzLCBwcm9wcyA9IHt9LCBjaGlsZHJlbiA9IFtdKSB7XG5cbiAgICBpZiAoKHByb3BzIGluc3RhbmNlb2YgTm9kZSkgfHwgKHR5cGVvZiBwcm9wcyA9PT0gJ3N0cmluZycpIHx8IEFycmF5LmlzQXJyYXkgKHByb3BzKSkgeyBjaGlsZHJlbiA9IHByb3BzOyBwcm9wcyA9IHt9IH1cbiAgICBpZiAoY2hpbGRyZW4gJiYgIUFycmF5LmlzQXJyYXkgKGNoaWxkcmVuKSkgY2hpbGRyZW4gPSBbY2hpbGRyZW5dXG5cbiAgICBjb25zdCBbdGFnSWQsIC4uLmNsYXNzZXNdID0gdGFnSWRDbGFzc2VzLnNwbGl0ICgnLicpXG4gICAgY29uc3QgW3RhZywgaWRdICAgICAgICAgICA9IHRhZ0lkLnNwbGl0ICgnIycpXG5cbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgKHRhZyB8fCAnZGl2JylcblxuICAgIGlmIChpZCkgZWwuaWQgPSBpZFxuXG4gICAgZm9yIChjb25zdCBjIG9mIGNsYXNzZXMpICBlbC5jbGFzc0xpc3QuYWRkIChjbGFzc1ByZWZpeCArIGMpXG4gICAgZm9yIChjb25zdCBjIG9mIGNoaWxkcmVuKSBpZiAoYykgZWwuYXBwZW5kQ2hpbGQgKHR5cGVvZiBjID09PSAnc3RyaW5nJyA/IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlIChjKSA6IGMpXG5cbiAgICByZXR1cm4gYXNzaWduIChlbCwgcHJvcHMpXG59XG5cbmNvbnN0IGggPSBuYW5vc2NyaXB0ICgncGFuaWMtb3ZlcmxheV9fJylcblxuLyogIENTUyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAgICAqL1xuXG5jb25zdCBzdHlsZSA9IGggKCdzdHlsZScsIGBcblxuLnBhbmljLW92ZXJsYXlfX21vZGFsIHtcbiAgICBcbiAgICBwb3NpdGlvbjogZml4ZWQ7XG4gICAgdG9wOiAwO1xuICAgIHJpZ2h0OiAwO1xuICAgIGJvdHRvbTogMDtcbiAgICBsZWZ0OiAwO1xuICAgIGJhY2tncm91bmQ6d2hpdGU7XG4gICAgei1pbmRleDogMTAwMDA7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICBvdmVyZmxvdy15OiBzY3JvbGw7XG4gICAgb3ZlcmZsb3cteDogaGlkZGVuO1xuICAgIGZvbnQtc2l6ZToxOHB4O1xuICAgIC0tbGVmdC1wYWQ6IDYwcHg7XG59XG5cbi5wYW5pYy1vdmVybGF5X19tb2RhbCxcbi5wYW5pYy1vdmVybGF5X19tb2RhbCAqIHtcbiAgICBkaXNwbGF5OiBibG9jaztcbiAgICBwYWRkaW5nOiAwO1xuICAgIG1hcmdpbjogMDtcbiAgICBmb250LWZhbWlseTogTWVubG8sIE1vbmFjbywgXCJDb3VyaWVyIE5ld1wiLCBDb3VyaWVyLCBtb25vc3BhY2U7XG59XG5cbi5wYW5pYy1vdmVybGF5X19tb2RhbCBzcGFuLFxuLnBhbmljLW92ZXJsYXlfX21vZGFsIGVtLFxuLnBhbmljLW92ZXJsYXlfX21vZGFsIHN0cm9uZyB7XG4gICAgZGlzcGxheTogaW5saW5lO1xufVxuXG4ucGFuaWMtb3ZlcmxheSBzdHJvbmcge1xuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xufVxuXG4ucGFuaWMtb3ZlcmxheV9faGlkZGVuIHtcbiAgICBkaXNwbGF5OiBub25lO1xufVxuXG4ucGFuaWMtb3ZlcmxheV9fbW9kYWwgaDEge1xuXG4gICAgY29sb3I6IGJsYWNrO1xuICAgIG1hcmdpbjogMDtcbiAgICBwYWRkaW5nOiAwO1xuICAgIGZvbnQtc2l6ZTogMS43N2VtO1xuICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgb3BhY2l0eTogMC43NTtcbiAgICBtYXJnaW4tdG9wOjUwcHg7XG4gICAgbWFyZ2luLWJvdHRvbTo0NXB4O1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICBwYWRkaW5nLWxlZnQ6IHZhcigtLWxlZnQtcGFkKTtcbn1cblxuLnBhbmljLW92ZXJsYXlfX2Nsb3NlIHtcbiAgICBjb2xvcjogYmxhY2s7XG4gICAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHRvcDotMC4zMmVtO1xuICAgIHJpZ2h0OiAxZW07XG4gICAgZm9udC1zaXplOiAxLjc3ZW07XG4gICAgb3BhY2l0eTogMC4xNTtcbiAgICB0cmFuc2l0aW9uOiBhbGwgMC4yNXMgZWFzZS1pbi1vdXQ7XG59XG5cbi5wYW5pYy1vdmVybGF5X19jbG9zZTpob3ZlciB7XG4gICAgdHJhbnNmb3JtOnNjYWxlKDEuNSk7XG4gICAgb3BhY2l0eTogMC4yNTtcbn1cblxuLnBhbmljLW92ZXJsYXlfX2Vycm9yIHtcbiAgICBtYXJnaW46IDFlbSAwIDNlbSAwO1xuICAgIGxlZnQ6MDtcbn1cblxuLnBhbmljLW92ZXJsYXlfX2Vycm9yLXRpdGxlIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBzdHJldGNoO1xuICAgIHBhZGRpbmctcmlnaHQ6IDUwcHg7XG59XG5cbi5wYW5pYy1vdmVybGF5X19lcnJvci10eXBlIHtcbiAgICBtaW4taGVpZ2h0OiAyLjhlbTtcbiAgICBkaXNwbGF5OiBmbGV4ICFpbXBvcnRhbnQ7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBwYWRkaW5nOjAgMWVtO1xuICAgIGJhY2tncm91bmQ6IHJnYigyNTUsIDAsIDY0KTtcbiAgICBjb2xvcjogd2hpdGU7XG4gICAgbWFyZ2luLXJpZ2h0OiAyZW07XG4gICAgcGFkZGluZy1sZWZ0OiB2YXIoLS1sZWZ0LXBhZCk7XG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbn1cblxuLnBhbmljLW92ZXJsYXlfX2Vycm9yLWNvdW50ZXIge1xuICAgIGNvbG9yOiB3aGl0ZTtcbiAgICBvcGFjaXR5OiAwLjM7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIGxlZnQ6IDAuOGVtO1xufVxuXG4ucGFuaWMtb3ZlcmxheV9fZXJyb3ItbWVzc2FnZSB7XG4gICAgZGlzcGxheTogZmxleCAhaW1wb3J0YW50O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZm9udC13ZWlnaHQ6NDAwO1xuICAgIGxpbmUtaGVpZ2h0OiAxZW07XG59XG5cbi5wYW5pYy1vdmVybGF5X19lcnJvci1zdGFjayB7XG4gICAgbWFyZ2luLXRvcDogMmVtO1xuICAgIHdoaXRlLXNwYWNlOiBwcmU7XG4gICAgcGFkZGluZy1sZWZ0OiB2YXIoLS1sZWZ0LXBhZCk7XG59XG5cbi5wYW5pYy1vdmVybGF5X19zdGFjay1lbnRyeSB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIG1hcmdpbi1ib3R0b206IDIuNWVtO1xufVxuXG4ucGFuaWMtb3ZlcmxheV9fY29sbGFwc2VkIC5wYW5pYy1vdmVybGF5X19zdGFjay1lbnRyeS1oaWRkZW4ge1xuICAgIGRpc3BsYXk6IG5vbmU7XG59XG5cbi5wYW5pYy1vdmVybGF5X19maWxlIHtcbiAgICBmb250LXdlaWdodDogYm9sZDtcbiAgICBtYXJnaW4tdG9wOiAyLjVlbTtcbiAgICBtYXJnaW4tYm90dG9tOiAxLjVlbTtcbiAgICBjb2xvcjogcmdiKDIwMiwgMTcsIDYzKTtcbn1cblxuLnBhbmljLW92ZXJsYXlfX2ZpbGUgc3Ryb25nIHtcbiAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcbn1cblxuLnBhbmljLW92ZXJsYXlfX2ZpbGU6YmVmb3JlLFxuLnBhbmljLW92ZXJsYXlfX21vcmU6YmVmb3JlIHtcbiAgICBjb250ZW50OiAnQCAnO1xuICAgIG9wYWNpdHk6IDAuNTtcbiAgICBtYXJnaW4tbGVmdDogLTEuMjVlbTtcbn1cblxuLnBhbmljLW92ZXJsYXlfX21vcmU6YmVmb3JlIHtcbiAgICBjb250ZW50OiAnXHUyNUI3ICc7XG4gICAgb3BhY2l0eTogMC41O1xufVxuXG4ucGFuaWMtb3ZlcmxheV9fbW9yZSB7XG4gICAgb3BhY2l0eTogMC4yNTtcbiAgICBjb2xvcjogYmxhY2s7XG4gICAgZm9udC1zaXplOiAwLjgzNWVtO1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgZGlzcGxheTogbm9uZTtcbn1cblxuLnBhbmljLW92ZXJsYXlfX21vcmUgZW0ge1xuICAgIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgICBmb250LXdlaWdodDogbm9ybWFsO1xuICAgIGJvcmRlci1ib3R0b206IDFweCBkYXNoZWQgYmxhY2s7XG59XG5cbi5wYW5pYy1vdmVybGF5X19jb2xsYXBzZWQgLnBhbmljLW92ZXJsYXlfX21vcmUge1xuICAgIGRpc3BsYXk6IGJsb2NrO1xufVxuXG4ucGFuaWMtb3ZlcmxheV9fbGluZXMge1xuICAgIGNvbG9yOnJnYigxODcsIDE2NSwgMTY1KTtcbiAgICBmb250LXNpemU6IDAuODM1ZW07XG59XG5cbi5wYW5pYy1vdmVybGF5X19saW5lczpub3QoLnBhbmljLW92ZXJsYXlfX25vLWZhZGUpIHtcbiAgICAtd2Via2l0LW1hc2staW1hZ2U6IGxpbmVhci1ncmFkaWVudCh0byBib3R0b20sIHJnYmEoMCwwLDAsMSkgNzUlLCByZ2JhKDAsMCwwLDApKTtcbiAgICBtYXNrLWltYWdlOiBsaW5lYXItZ3JhZGllbnQodG8gYm90dG9tLCByZ2JhKDAsMCwwLDEpIDc1JSwgcmdiYSgwLDAsMCwwKSk7XG59XG5cbi5wYW5pYy1vdmVybGF5X19saW5lLW51bWJlciB7IFxuICAgIHBhZGRpbmctcmlnaHQ6IDEuNWVtO1xuICAgIG9wYWNpdHk6IDAuNTtcbn1cblxuLnBhbmljLW92ZXJsYXlfX2xpbmUtaGlsaSB7XG4gICAgYmFja2dyb3VuZDogI2ZmZmY3ODtcbiAgICBjb2xvcjogIzVmNDU0NTtcbn1cblxuLnBhbmljLW92ZXJsYXlfX3N0YWNrLWVudHJ5OmZpcnN0LWNoaWxkIC5wYW5pYy1vdmVybGF5X19saW5lLWhpbGkgc3Ryb25nIHtcbiAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZSB3YXZ5ICNmZjAwNDA7XG59XG5cbi5wYW5pYy1vdmVybGF5X19saW5lLWhpbGkgZW0ge1xuICAgIGZvbnQtc3R5bGU6IGl0YWxpYztcbiAgICBjb2xvcjogcmdiKDI1NSwgMCwgNjQpO1xuICAgIGZvbnQtc2l6ZTogMC43NWVtO1xuICAgIG1hcmdpbi1sZWZ0OiAyZW07XG4gICAgb3BhY2l0eTogMC4yNTtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgdG9wOiAtMC4xMTVlbTtcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xufVxuXG4ucGFuaWMtb3ZlcmxheV9fbGluZS1oaWxpIGVtOmJlZm9yZSB7XG4gICAgY29udGVudDogJ1x1MjE5MCAnO1xufVxuXG4ucGFuaWMtb3ZlcmxheV9fbm8tc291cmNlIHtcbiAgICBmb250LXN0eWxlOiBpdGFsaWM7XG59XG5cbkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNjQwcHgpIHtcblxuICAgIC5wYW5pYy1vdmVybGF5X19tb2RhbCB7XG4gICAgICAgIGZvbnQtc2l6ZTogMTVweDtcbiAgICAgICAgLS1sZWZ0LXBhZDogNTBweDtcbiAgICB9XG4gICAgXG4gICAgLnBhbmljLW92ZXJsYXlfX21vZGFsIGgxIHtcbiAgICAgICAgbWFyZ2luOjQwcHggMDtcbiAgICB9XG59XG5cbkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNTAwcHgpIHtcbiAgICBcbiAgICAucGFuaWMtb3ZlcmxheV9fbW9kYWwge1xuICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgIC0tbGVmdC1wYWQ6IDQ1cHg7XG4gICAgfVxuICAgIFxuICAgIC5wYW5pYy1vdmVybGF5X19tb2RhbCBoMSB7XG4gICAgICAgIG1hcmdpbjozMHB4IDA7XG4gICAgfVxufVxuXG5gKVxuXG4vKiAgQ09ORklHVVJBVElPTiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAgICAqL1xuXG5jb25zdCBkZWZhdWx0Q29uZmlnID0ge1xuXG4gICAgaGFuZGxlRXJyb3JzOiB0cnVlLFxuICAgIHByb2plY3RSb290OiAgdW5kZWZpbmVkLFxuXG4gICAgc3RhY2tFbnRyeUNsaWNrZWQgKGVudHJ5KSB7XG4gICAgICAgIGlmICh0aGlzLnByb2plY3RSb290KSB7XG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSBgdnNjb2RlOi8vZmlsZS8ke3BhdGguY29uY2F0ICh0aGlzLnByb2plY3RSb290LCBlbnRyeS5maWxlUmVsYXRpdmUpfToke2VudHJ5LmxpbmV9OiR7ZW50cnkuY29sdW1ufWBcbiAgICAgICAgfVxuICAgIH1cbn1cblxuY29uc3QgY29uZmlnID0gZGVmYXVsdENvbmZpZ1xuXG4vKiAgUkVOREVSSU5HIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICAgICovXG5cbmNvbnN0IGVycm9ycyA9IGggKCcuZXJyb3JzJylcblxuY29uc3QgbW9kYWwgPSBoICgnLm1vZGFsLmhpZGRlbi5jb2xsYXBzZWQnLCBbXG4gICAgaCAoJ2gxJywgWydPb3BzIDooJywgaCAoJ2EuY2xvc2UnLCB7IGhyZWY6ICcjJywgb25jbGljayAoKSB7IHRvZ2dsZSAoZmFsc2UpIH19LCAnXHUwMEQ3JyldKSxcbiAgICBlcnJvcnNcbl0pXG5cbmNvbnN0IHNob3VsZEhpZGVFbnRyeSA9IChlbnRyeSwgaSkgPT4gKGVudHJ5LnRoaXJkUGFydHkgfHwgZW50cnlbJ25hdGl2ZSddIHx8IGVudHJ5LmhpZGUpICYmIChpICE9PSAwKVxuXG5mdW5jdGlvbiByZW5kZXJTdGFja0VudHJ5IChlbnRyeSwgaSwgbWVzc2FnZSkge1xuXG4gICAgY29uc3QgeyBzb3VyY2VGaWxlID0geyBsaW5lczogW10gfSwgbGluZSwgY29sdW1uLCBmaWxlU2hvcnQsIGNhbGxlZVNob3J0LCBmaWxlUmVsYXRpdmUgfSA9IGVudHJ5XG5cbiAgICBjb25zdCBsaW5lSW5kZXggPSBsaW5lIC0gMVxuICAgIGNvbnN0IG1heExpbmVzICA9IHNvdXJjZUZpbGUubGluZXMubGVuZ3RoXG4gICAgY29uc3Qgd2luZG93ICAgID0gNFxuXG4gICAgbGV0IHN0YXJ0ID0gbGluZUluZGV4IC0gd2luZG93LFxuICAgICAgICBlbmQgICA9IGxpbmVJbmRleCArIHdpbmRvdyArIDJcblxuICAgIGlmIChzdGFydCA8IDApICAgICAgICB7IGVuZCAgID0gbWluIChlbmQgLSBzdGFydCwgbWF4TGluZXMpOyAgICAgICBzdGFydCA9IDAgICAgICAgICB9XG4gICAgaWYgKGVuZCAgID4gbWF4TGluZXMpIHsgc3RhcnQgPSBtYXggKDAsIHN0YXJ0IC0gKGVuZCAtIG1heExpbmVzKSk7IGVuZCAgID0gbWF4TGluZXMgIH1cblxuICAgIGNvbnN0IGxpbmVzID0gc291cmNlRmlsZS5saW5lcy5zbGljZSAoc3RhcnQsIGVuZClcbiAgICBjb25zdCBsaW5lTnVtYmVyV2lkdGggPSBTdHJpbmcgKHN0YXJ0ICsgbGluZXMubGVuZ3RoKS5sZW5ndGhcbiAgICBjb25zdCBoaWxpSW5kZXggPSAobGluZSAtIHN0YXJ0IC0gMSlcbiAgICBjb25zdCBoaWxpTXNnID0gKGkgPT09IDApID8gbWVzc2FnZSA6ICcnXG4gICAgY29uc3Qgb25MYXN0TGluZSA9IGhpbGlJbmRleCA9PT0gKGxpbmVzLmxlbmd0aCAtIDEpXG5cbiAgICBjb25zdCBjbGFzc05hbWUgPSAnLnN0YWNrLWVudHJ5JyArIChzaG91bGRIaWRlRW50cnkgKGVudHJ5LCBpKSA/ICcuc3RhY2stZW50cnktaGlkZGVuJyA6ICcnKVxuICAgIFxuICAgIHJldHVybiBoIChjbGFzc05hbWUsIHsgb25jbGljayAoKSB7IGNvbmZpZy5zdGFja0VudHJ5Q2xpY2tlZCAoZW50cnkpIH0gfSwgW1xuICAgICAgICAgICAgICAgIGggKCcuZmlsZScsIGggKCdzdHJvbmcnLCBmaWxlU2hvcnQpKSxcbiAgICAgICAgICAgICAgICBoICgnLmxpbmVzJyArIChvbkxhc3RMaW5lID8gJy5uby1mYWRlJyA6ICcnKSwgbGluZXMubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgID8gbGluZXMubWFwICgodGV4dCwgaSkgPT4gaCAoJy5saW5lJyArICgoaSA9PT0gaGlsaUluZGV4KSA/ICcubGluZS1oaWxpJyA6ICcnKSwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgaCAoJ3NwYW4ubGluZS1udW1iZXInLCBTdHJpbmcgKHN0YXJ0ICsgaSArIDEpLnBhZFN0YXJ0IChsaW5lTnVtYmVyV2lkdGgsICcgJykpLFxuICAgICAgICAgICAgICAgICAgICAgICAgaCAoJ3NwYW4ubGluZS10ZXh0JywgKGkgPT09IGhpbGlJbmRleCkgPyByZW5kZXJIaWdobGlnaHRlZExpbmUgKHRleHQsIGNvbHVtbiwgaGlsaU1zZykgOiB0ZXh0KVxuICAgICAgICAgICAgICAgICAgICBdKSlcbiAgICAgICAgICAgICAgICAgICAgOiBbaCAoJy5saW5lJywgW1xuICAgICAgICAgICAgICAgICAgICAgICAgaCAoJ3NwYW4ubGluZS1udW1iZXInLCBTdHJpbmcgKGxpbmUpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGggKCdzcGFuLmxpbmUtdGV4dC5uby1zb3VyY2UnLCBgXHUyMDI2IHNvbWV3aGVyZSBhdCAke2NhbGxlZVNob3J0ID8gKGNhbGxlZVNob3J0ICsgJygpJykgOiAnPz8/J30gXHUyMDI2YCksXG4gICAgICAgICAgICAgICAgICAgIF0pXVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIF0pXG59XG5cbmZ1bmN0aW9uIHJlbmRlckhpZ2hsaWdodGVkTGluZSAodGV4dCwgY29sdW1uLCBtc2cpIHtcblxuICAgIGNvbnN0IFtiZWZvcmUsIGFmdGVyXSA9IFt0ZXh0LnNsaWNlICgwLCBjb2x1bW4gLSAxKSwgdGV4dC5zbGljZSAoY29sdW1uIC0gMSldXG4gICAgcmV0dXJuIFtiZWZvcmUsIGggKCdzdHJvbmcnLCBhZnRlcikvKiwgbXNnICYmIGggKCdlbScsIG1zZykqL11cbn1cblxuZnVuY3Rpb24gcGFuaWMgKGVycikge1xuXG4gICAgY29uc3Qgc3RhY2sgPSAobmV3IFN0YWNrVHJhY2V5IChlcnIpKS53aXRoU291cmNlc1xuICAgIGNvbnN0IGluZGV4VGV4dCA9IHN0YWNrLmNsZWFuLnByZXR0eVxuXG4gICAgLy8gRGVkdXBsaWNhdGlvblxuICAgIGZvciAoY29uc3QgZWwgb2YgZXJyb3JzLmNoaWxkTm9kZXMpIHtcbiAgICAgICAgaWYgKGVsLl9pbmRleFRleHQgPT09IGluZGV4VGV4dCkge1xuICAgICAgICAgICAgYXNzaWduIChlbC5xdWVyeVNlbGVjdG9yICgnLnBhbmljLW92ZXJsYXlfX2Vycm9yLWNvdW50ZXInKSwge1xuICAgICAgICAgICAgICAgIGlubmVyVGV4dDogZWwuX2NvdW50ZXIgPSAoZWwuX2NvdW50ZXIgfHwgMSkgKyAxLFxuICAgICAgICAgICAgICAgIHN0eWxlOiAnJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgc2hvd01vcmUgPSAoKSA9PiBtb2RhbC5jbGFzc0xpc3QucmVtb3ZlICgncGFuaWMtb3ZlcmxheV9fY29sbGFwc2VkJylcbiAgICBcbiAgICBjb25zdCB0eXBlID0gU3RyaW5nICgoZXJyICYmIChlcnIudHlwZSB8fCAoZXJyLmNvbnN0cnVjdG9yICYmIGVyci5jb25zdHJ1Y3Rvci5uYW1lKSkpIHx8IHR5cGVvZiBlcnIpXG4gICAgY29uc3QgbXNnICA9IFN0cmluZyAoZXJyICYmIGVyci5tZXNzYWdlKVxuXG4gICAgY29uc3QgZWwgPSBoICgnLmVycm9yJywgeyBfaW5kZXhUZXh0OiBpbmRleFRleHQgfSwgW1xuICAgICAgICAgICAgICAgICAgICBoICgnLmVycm9yLXRpdGxlJywgW1xuICAgICAgICAgICAgICAgICAgICAgICAgaCAoJ3NwYW4uZXJyb3ItdHlwZScsIFt0eXBlLCBoICgnc3Bhbi5lcnJvci1jb3VudGVyJywgeyBzdHlsZTogJ2Rpc3BsYXk6IG5vbmU7JyB9KV0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgaCAoJ3NwYW4uZXJyb3ItbWVzc2FnZScsIG1zZyksXG4gICAgICAgICAgICAgICAgICAgIF0pLFxuICAgICAgICAgICAgICAgICAgICBoICgnLmVycm9yLXN0YWNrJywgW1xuICAgICAgICAgICAgICAgICAgICAgICAgLi4uc3RhY2subWFwICgoZSwgaSkgPT4gcmVuZGVyU3RhY2tFbnRyeSAoZSwgaSwgbXNnKSksXG4gICAgICAgICAgICAgICAgICAgICAgICBoICgnLm1vcmUnLCBoICgnZW0nLCB7IG9uY2xpY2s6IHNob3dNb3JlIH0sICdzaG93IG1vcmUnKSlcbiAgICAgICAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgICAgICBdKVxuXG4gICAgaWYgKCFzdGFjay5maW5kIChzaG91bGRIaWRlRW50cnkpKSBzaG93TW9yZSAoKSAvLyBoaWRlcyBcInNob3cgbW9yZVwiIGlmIG5vdGhpbmcgdG8gc2hvd1xuXG4gICAgZXJyb3JzLmluc2VydEJlZm9yZSAoZWwsIGVycm9ycy5maXJzdENoaWxkKVxuICAgIGlmIChlcnJvcnMuY2hpbGRFbGVtZW50Q291bnQgPiAxMCkgZXJyb3JzLmxhc3RDaGlsZC5yZW1vdmUgKCkgLy8gcHJldmVudHMgaGFuZyBpbiBjYXNlIG9mIHZhc3QgbnVtYmVyIG9mIGVycm9yc1xuXG4gICAgdG9nZ2xlICh0cnVlKVxuXG4gICAgcmV0dXJuIHBhbmljXG59XG5cbi8qICBWSVNJQklMSVRZIE9OL09GRiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAgICAqL1xuXG5sZXQgdmlzaWJsZSA9IGZhbHNlXG5cbmZ1bmN0aW9uIHRvZ2dsZSAoeWVzKSB7XG5cbiAgICBpZiAoZG9jdW1lbnQuYm9keSkge1xuICAgICAgICBpZiAoeWVzKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkIChzdHlsZSlcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQgKG1vZGFsKVxuICAgICAgICB9XG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZSAoJ3BhbmljLW92ZXJsYXlfX3Zpc2libGUnLCB5ZXMpXG4gICAgfVxuXG4gICAgbW9kYWwuY2xhc3NMaXN0LnRvZ2dsZSAoJ3BhbmljLW92ZXJsYXlfX2hpZGRlbicsICF5ZXMpXG4gICAgXG4gICAgaWYgKHZpc2libGUgJiYgIXllcykgeyAvLyBjbGVhciBvbiBoaWRlXG4gICAgICAgIGVycm9ycy5pbm5lclRleHQgPSAnJyBcbiAgICAgICAgbW9kYWwuY2xhc3NMaXN0LmFkZCAoJ3BhbmljLW92ZXJsYXlfX2NvbGxhcHNlZCcpXG4gICAgfVxuXG4gICAgdmlzaWJsZSA9IHllc1xuICAgIHJldHVybiBwYW5pY1xufVxuXG4vKiAgRVZFTlRTIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICAgICovXG5cbmZ1bmN0aW9uIG9uVW5jYXVnaHRFcnJvciAoZSkgeyBpZiAoY29uZmlnLmhhbmRsZUVycm9ycykgcGFuaWMgKGUpIH1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIgKCdlcnJvcicsICAgICAgICAgICAgICBlID0+IG9uVW5jYXVnaHRFcnJvciAoZS5lcnJvcikpXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciAoJ3VuaGFuZGxlZHJlamVjdGlvbicsIGUgPT4gb25VbmNhdWdodEVycm9yIChlLnJlYXNvbikpXG5cbjsoZnVuY3Rpb24gb25SZWFkeSAoZm4pIHtcblxuICAgIGlmIChkb2N1bWVudC5ib2R5KSBmbiAoKVxuICAgIGVsc2UgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciAoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmbilcblxufSkgKCgpID0+IHsgdG9nZ2xlICh2aXNpYmxlKSB9KVxuXG4vKiAgRVhQT1JUIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICAgICovXG5cbnBhbmljLnRvZ2dsZSAgICA9IHRvZ2dsZVxucGFuaWMuY29uZmlndXJlID0gZnVuY3Rpb24gY29uZmlndXJlIChjZmcpIHsgYXNzaWduIChjb25maWcsIGRlZmF1bHRDb25maWcsIGNmZyk7IHJldHVybiBwYW5pYyB9XG5cbmV4cG9ydCBkZWZhdWx0IHBhbmljXG4iLCAiLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50ICovXG5pbXBvcnQgXCJwYW5pYy1vdmVybGF5L2J1aWxkL3BhbmljLW92ZXJsYXkuYnJvd3NlclwiO1xuaW1wb3J0IHsgQ29uc3RhbnRCYWNrb2ZmLCBXZWJzb2NrZXRCdWlsZGVyIH0gZnJvbSBcIndlYnNvY2tldC10c1wiO1xuaW1wb3J0IE5hbm8gZnJvbSBcIm5hbm8tanN4XCI7XG5pbXBvcnQgeyBNZXNzYWdlIH0gZnJvbSBcIi4uL2xpYi90eXBlc1wiO1xuaW1wb3J0IEluZm9CYXIsIHsgaW5mb0JhclN0b3JlIH0gZnJvbSBcIi4vaW5mb0JhclwiO1xuXG5pbnRlcmZhY2UgTXlXaW5kb3cge1xuXHRXRUJTT0NLRVRfUE9SVDogbnVtYmVyO1xufVxuXG5jb25zdCB3c1BvcnQgPSAoKHdpbmRvdyBhcyB1bmtub3duKSBhcyBNeVdpbmRvdykuV0VCU09DS0VUX1BPUlQ7XG5cbmNvbnN0IGluZm9CYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuaW5mb0Jhci5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcIl9fZGV2LXNjcmlwdHMtaW5mby1iYXJcIik7XG5cbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW5mb0Jhcik7XG5cbmNvbnN0IHdzID0gbmV3IFdlYnNvY2tldEJ1aWxkZXIoYHdzOi8vbG9jYWxob3N0OiR7d3NQb3J0fWApXG5cdC53aXRoQmFja29mZihuZXcgQ29uc3RhbnRCYWNrb2ZmKDUwMCkpXG5cdC5vbk9wZW4oKGksIGV2KSA9PiB7XG5cdFx0Y29uc29sZS5pbmZvKFwiRGV2U2VydmVyIGNvbm5lY3RpbmcuLi5cIik7XG5cdH0pXG5cdC5vbkNsb3NlKChpLCBldikgPT4ge1xuXHRcdGNvbnNvbGUuaW5mbyhcIkRldlNlcnZlciBjb25uZWN0aW9uIGxvc3RcIik7XG5cdH0pXG5cdC5vbkVycm9yKChpLCBldikgPT4ge1xuXHRcdGNvbnNvbGUuaW5mbyhcIkRldlNlcnZlciBjb25uZWN0aW9uIGVycm9yXCIpO1xuXHR9KVxuXHQub25NZXNzYWdlKChpLCBldjogTWVzc2FnZUV2ZW50PHN0cmluZz4pID0+IHtcblx0XHRjb25zdCBtc2cgPSBKU09OLnBhcnNlKGV2LmRhdGEpO1xuXHRcdGhhbmRsZU1lc3NhZ2UobXNnKTtcblx0fSlcblx0Lm9uUmV0cnkoKGksIGV2KSA9PiB7XG5cdFx0Y29uc29sZS5pbmZvKFwiUmV0cnlpbmcgRGV2U2VydmVyIGNvbm5lY3Rpb25cIik7XG5cdH0pXG5cdC5idWlsZCgpO1xuXG5jb25zdCByZXJlbmRlciA9ICgpID0+IHtcblx0Ly9AdHMtaWdub3JlXG5cdE5hbm8ucmVuZGVyKDxJbmZvQmFyIC8+LCBpbmZvQmFyKTtcbn07XG5cbnJlcmVuZGVyKCk7XG5cbmNvbnN0IHNldFN0YXRlID0gKHN0YXRlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSA9PiB7XG5cdGluZm9CYXJTdG9yZS5zZXRTdGF0ZShzdGF0ZSk7XG59O1xuXG5mdW5jdGlvbiBoYW5kbGVNZXNzYWdlKHsgZXZlbnQsIGRhdGEgfTogTWVzc2FnZSkge1xuXHRzd2l0Y2ggKGV2ZW50KSB7XG5cdFx0Y2FzZSBcImRldi1zZXJ2ZXItY29ubmVjdGVkXCI6IHtcblx0XHRcdGNvbnNvbGUuaW5mbyhcIltEZXZTZXJ2ZXJdIGNvbm5lY3RlZFwiKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjYXNlIFwiYnVuZGxlLWJ1aWxkLXN0YXJ0XCI6IHtcblx0XHRcdGNvbnNvbGUuaW5mbyhcIltEZXZTZXJ2ZXJdIEJ1bmRsZSBidWlsZCBzdGFydGVkLi4uXCIpO1xuXHRcdFx0c2V0U3RhdGUoe1xuXHRcdFx0XHRzaG93OiB0cnVlLFxuXHRcdFx0fSk7XG5cdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHRjYXNlIFwiYnVuZGxlLWJ1aWxkLWVuZFwiOiB7XG5cdFx0XHRjb25zb2xlLmluZm8oXCJbRGV2U2VydmVyXSBCdW5kbGUgYnVpbGQgZmluaXNoZWQuIFJlbG9hZGluZy4uLlwiKTtcblxuXHRcdFx0c2V0U3RhdGUoe1xuXHRcdFx0XHRzaG93OiBmYWxzZSxcblx0XHRcdH0pO1xuXG5cdFx0XHR3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0fVxuXHR9XG59XG4iLCAiLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50ICovXG5pbXBvcnQgTmFubywgeyBDb21wb25lbnQgfSBmcm9tIFwibmFuby1qc3hcIjtcbmltcG9ydCB7IFN0b3JlIH0gZnJvbSBcIm5hbm8tanN4L2xpYi9zdG9yZVwiO1xuXG5pbXBvcnQgeyBTcGlubmVyIH0gZnJvbSBcInNwaW4uanNcIjtcblxuY29uc3Qgc3Bpbm5lck9wdGlvbnMgPSB7XG5cdGxpbmVzOiAxMiwgLy8gVGhlIG51bWJlciBvZiBsaW5lcyB0byBkcmF3XG5cdGxlbmd0aDogMCwgLy8gVGhlIGxlbmd0aCBvZiBlYWNoIGxpbmVcblx0d2lkdGg6IDE3LCAvLyBUaGUgbGluZSB0aGlja25lc3Ncblx0cmFkaXVzOiA0MCwgLy8gVGhlIHJhZGl1cyBvZiB0aGUgaW5uZXIgY2lyY2xlXG5cdHNjYWxlOiAwLjEsIC8vIFNjYWxlcyBvdmVyYWxsIHNpemUgb2YgdGhlIHNwaW5uZXJcblx0Y29ybmVyczogMSwgLy8gQ29ybmVyIHJvdW5kbmVzcyAoMC4uMSlcblx0c3BlZWQ6IDAuOSwgLy8gUm91bmRzIHBlciBzZWNvbmRcblx0cm90YXRlOiAwLCAvLyBUaGUgcm90YXRpb24gb2Zmc2V0XG5cdGFuaW1hdGlvbjogXCJzcGlubmVyLWxpbmUtZmFkZS1tb3JlXCIsIC8vIFRoZSBDU1MgYW5pbWF0aW9uIG5hbWUgZm9yIHRoZSBsaW5lc1xuXHRkaXJlY3Rpb246IDEsIC8vIDE6IGNsb2Nrd2lzZSwgLTE6IGNvdW50ZXJjbG9ja3dpc2Vcblx0Y29sb3I6IFwiI2ZmZmZmZlwiLCAvLyBDU1MgY29sb3Igb3IgYXJyYXkgb2YgY29sb3JzXG5cdGZhZGVDb2xvcjogXCJ0cmFuc3BhcmVudFwiLCAvLyBDU1MgY29sb3Igb3IgYXJyYXkgb2YgY29sb3JzXG5cdHRvcDogXCI1MCVcIiwgLy8gVG9wIHBvc2l0aW9uIHJlbGF0aXZlIHRvIHBhcmVudFxuXHRsZWZ0OiBcIjUwJVwiLCAvLyBMZWZ0IHBvc2l0aW9uIHJlbGF0aXZlIHRvIHBhcmVudFxuXHRzaGFkb3c6IFwiMCAwIDFweCB0cmFuc3BhcmVudFwiLCAvLyBCb3gtc2hhZG93IGZvciB0aGUgbGluZXNcblx0ekluZGV4OiAyMDAwMDAwMDAwLCAvLyBUaGUgei1pbmRleCAoZGVmYXVsdHMgdG8gMmU5KVxuXHRjbGFzc05hbWU6IFwic3Bpbm5lclwiLCAvLyBUaGUgQ1NTIGNsYXNzIHRvIGFzc2lnbiB0byB0aGUgc3Bpbm5lclxuXHRwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLCAvLyBFbGVtZW50IHBvc2l0aW9uaW5nXG59O1xuXG5leHBvcnQgY29uc3QgaW5mb0JhclN0b3JlID0gbmV3IFN0b3JlKHsgc2hvdzogZmFsc2UgfSwgXCJpbmZvLWJhci1zdG9yZVwiLCBcIm1lbW9yeVwiKTtcbmNvbnN0IHNwaW5uZXIgPSBuZXcgU3Bpbm5lcihzcGlubmVyT3B0aW9ucyk7XG5cbmludGVyZmFjZSBTdGF0ZSB7XG5cdHNob3c6IGJvb2xlYW47XG59XG5cbmNsYXNzIEluZm9CYXIgZXh0ZW5kcyBDb21wb25lbnQge1xuXHRzdG9yZSA9IGluZm9CYXJTdG9yZS51c2UoKTtcblxuXHRnZXRTcGlubmVyUmVmKCkge1xuXHRcdHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIl9fZGV2LXNjcmlwdHMtaW5mby1iYXItc3Bpbm5lclwiKTtcblx0fVxuXG5cdGRpZE1vdW50KCkge1xuXHRcdHRoaXMuc3RvcmUuc3Vic2NyaWJlKChuZXdTdGF0ZTogU3RhdGUsIHByZXZTdGF0ZTogU3RhdGUpID0+IHtcblx0XHRcdC8vIGNoZWNrIGlmIHlvdSBuZWVkIHRvIHVwZGF0ZSB5b3VyIGNvbXBvbmVudCBvciBub3Rcblx0XHRcdGlmIChuZXdTdGF0ZS5zaG93ICE9PSBwcmV2U3RhdGUuc2hvdykge1xuXHRcdFx0XHR0aGlzLnVwZGF0ZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAobmV3U3RhdGUuc2hvdykge1xuXHRcdFx0XHRzcGlubmVyLnNwaW4odGhpcy5nZXRTcGlubmVyUmVmKCkpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c3Bpbm5lci5zdG9wKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRkaWRVbm1vdW50KCkge1xuXHRcdC8vIGNhbmNlbCB0aGUgc3RvcmUgc3Vic2NyaXB0aW9uXG5cdFx0dGhpcy5zdG9yZS5jYW5jZWwoKTtcblx0fVxuXG5cdC8vQHRzLWlnbm9yZVxuXHRyZW5kZXIoKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdC8vQHRzLWlnbm9yZVxuXHRcdFx0PGRpdiBjbGFzcz17YGNvbnRhaW5lciAke3RoaXMuc3RvcmUuc3RhdGUuc2hvdyA/IFwic2hvd25cIiA6IFwiXCJ9YH0+XG5cdFx0XHRcdDxzdHlsZT5cblx0XHRcdFx0XHR7YFxuLyogbm9kZV9tb2R1bGVzL3NwaW4uanMvc3Bpbi5jc3MgKi9cbkBrZXlmcmFtZXMgc3Bpbm5lci1saW5lLWZhZGUtbW9yZSB7XG4gIDAlLCAxMDAlIHtcbiAgICBvcGFjaXR5OiAwO1xuICB9XG4gIDElIHtcbiAgICBvcGFjaXR5OiAxO1xuICB9XG59XG5Aa2V5ZnJhbWVzIHNwaW5uZXItbGluZS1mYWRlLXF1aWNrIHtcbiAgMCUsIDM5JSwgMTAwJSB7XG4gICAgb3BhY2l0eTogMC4yNTtcbiAgfVxuICA0MCUge1xuICAgIG9wYWNpdHk6IDE7XG4gIH1cbn1cbkBrZXlmcmFtZXMgc3Bpbm5lci1saW5lLWZhZGUtZGVmYXVsdCB7XG4gIDAlLCAxMDAlIHtcbiAgICBvcGFjaXR5OiAwLjIyO1xuICB9XG4gIDElIHtcbiAgICBvcGFjaXR5OiAxO1xuICB9XG59XG5Aa2V5ZnJhbWVzIHNwaW5uZXItbGluZS1zaHJpbmsge1xuICAwJSwgMjUlLCAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNSk7XG4gICAgb3BhY2l0eTogMC4yNTtcbiAgfVxuICAyNiUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gICAgb3BhY2l0eTogMTtcbiAgfVxufVxuXHRcdFx0XHRcbiNfX2Rldi1zY3JpcHRzLWluZm8tYmFyIC5jb250YWluZXIge1xuXHR3aWR0aDogMjRweDtcblx0aGVpZ2h0OiAyNHB4O1xuXHRwb3NpdGlvbjogYWJzb2x1dGU7XG5cdGJvdHRvbTogMTBweDtcblx0cmlnaHQ6IDMwcHg7XG5cdGJvcmRlci1yYWRpdXM6IDNweDtcblx0YmFja2dyb3VuZDogIzAwMDtcblx0Y29sb3I6ICNmZmY7XG5cdGZvbnQ6IGluaXRpYWw7XG5cdGN1cnNvcjogaW5pdGlhbDtcblx0bGV0dGVyLXNwYWNpbmc6IGluaXRpYWw7XG5cdHRleHQtc2hhZG93OiBpbml0aWFsO1xuXHR0ZXh0LXRyYW5zZm9ybTogaW5pdGlhbDtcblx0dmlzaWJpbGl0eTogaW5pdGlhbDtcblx0cGFkZGluZzogN3B4IDEwcHggOHB4IDEwcHg7XG5cdGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cdGJveC1zaGFkb3c6IDAgMTFweCA0MHB4IDAgcmdiKDAgMCAwIC8gMjUlKSwgMCAycHggMTBweCAwIHJnYigwIDAgMCAvIDEyJSk7XG5cdGRpc3BsYXk6IG5vbmU7XG5cdG9wYWNpdHk6IDA7XG5cdHRyYW5zaXRpb246IG9wYWNpdHkgMC4xcyBlYXNlLCBib3R0b20gMC4xcyBlYXNlO1xuXHRhbmltYXRpb246IGZhZGUtaW4gMC4xcyBlYXNlLWluLW91dDtcbn1cbiNfX2Rldi1zY3JpcHRzLWluZm8tYmFyIC5jb250YWluZXIuc2hvd24ge1xuXHRkaXNwbGF5OiBibG9jaztcblx0b3BhY2l0eTogMTtcbn1gfVxuXHRcdFx0XHQ8L3N0eWxlPlxuXHRcdFx0XHQ8ZGl2IGlkPVwiX19kZXYtc2NyaXB0cy1pbmZvLWJhci1zcGlubmVyXCIgLz5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSW5mb0JhcjtcbiIsICJ2YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXHJcbiAgICAgICAgICAgICAgICB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn07XHJcbnZhciBkZWZhdWx0cyA9IHtcclxuICAgIGxpbmVzOiAxMixcclxuICAgIGxlbmd0aDogNyxcclxuICAgIHdpZHRoOiA1LFxyXG4gICAgcmFkaXVzOiAxMCxcclxuICAgIHNjYWxlOiAxLjAsXHJcbiAgICBjb3JuZXJzOiAxLFxyXG4gICAgY29sb3I6ICcjMDAwJyxcclxuICAgIGZhZGVDb2xvcjogJ3RyYW5zcGFyZW50JyxcclxuICAgIGFuaW1hdGlvbjogJ3NwaW5uZXItbGluZS1mYWRlLWRlZmF1bHQnLFxyXG4gICAgcm90YXRlOiAwLFxyXG4gICAgZGlyZWN0aW9uOiAxLFxyXG4gICAgc3BlZWQ6IDEsXHJcbiAgICB6SW5kZXg6IDJlOSxcclxuICAgIGNsYXNzTmFtZTogJ3NwaW5uZXInLFxyXG4gICAgdG9wOiAnNTAlJyxcclxuICAgIGxlZnQ6ICc1MCUnLFxyXG4gICAgc2hhZG93OiAnMCAwIDFweCB0cmFuc3BhcmVudCcsXHJcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcclxufTtcclxudmFyIFNwaW5uZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBTcGlubmVyKG9wdHMpIHtcclxuICAgICAgICBpZiAob3B0cyA9PT0gdm9pZCAwKSB7IG9wdHMgPSB7fTsgfVxyXG4gICAgICAgIHRoaXMub3B0cyA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCBkZWZhdWx0cyksIG9wdHMpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIHRoZSBzcGlubmVyIHRvIHRoZSBnaXZlbiB0YXJnZXQgZWxlbWVudC4gSWYgdGhpcyBpbnN0YW5jZSBpcyBhbHJlYWR5XHJcbiAgICAgKiBzcGlubmluZywgaXQgaXMgYXV0b21hdGljYWxseSByZW1vdmVkIGZyb20gaXRzIHByZXZpb3VzIHRhcmdldCBieSBjYWxsaW5nXHJcbiAgICAgKiBzdG9wKCkgaW50ZXJuYWxseS5cclxuICAgICAqL1xyXG4gICAgU3Bpbm5lci5wcm90b3R5cGUuc3BpbiA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcclxuICAgICAgICB0aGlzLnN0b3AoKTtcclxuICAgICAgICB0aGlzLmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdGhpcy5lbC5jbGFzc05hbWUgPSB0aGlzLm9wdHMuY2xhc3NOYW1lO1xyXG4gICAgICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3Byb2dyZXNzYmFyJyk7XHJcbiAgICAgICAgY3NzKHRoaXMuZWwsIHtcclxuICAgICAgICAgICAgcG9zaXRpb246IHRoaXMub3B0cy5wb3NpdGlvbixcclxuICAgICAgICAgICAgd2lkdGg6IDAsXHJcbiAgICAgICAgICAgIHpJbmRleDogdGhpcy5vcHRzLnpJbmRleCxcclxuICAgICAgICAgICAgbGVmdDogdGhpcy5vcHRzLmxlZnQsXHJcbiAgICAgICAgICAgIHRvcDogdGhpcy5vcHRzLnRvcCxcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiBcInNjYWxlKFwiICsgdGhpcy5vcHRzLnNjYWxlICsgXCIpXCIsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKHRhcmdldCkge1xyXG4gICAgICAgICAgICB0YXJnZXQuaW5zZXJ0QmVmb3JlKHRoaXMuZWwsIHRhcmdldC5maXJzdENoaWxkIHx8IG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkcmF3TGluZXModGhpcy5lbCwgdGhpcy5vcHRzKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFN0b3BzIGFuZCByZW1vdmVzIHRoZSBTcGlubmVyLlxyXG4gICAgICogU3RvcHBlZCBzcGlubmVycyBtYXkgYmUgcmV1c2VkIGJ5IGNhbGxpbmcgc3BpbigpIGFnYWluLlxyXG4gICAgICovXHJcbiAgICBTcGlubmVyLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmVsKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5hbmltYXRlSWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuYW5pbWF0ZUlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5lbC5wYXJlbnROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5lbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5lbCA9IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFNwaW5uZXI7XHJcbn0oKSk7XHJcbmV4cG9ydCB7IFNwaW5uZXIgfTtcclxuLyoqXHJcbiAqIFNldHMgbXVsdGlwbGUgc3R5bGUgcHJvcGVydGllcyBhdCBvbmNlLlxyXG4gKi9cclxuZnVuY3Rpb24gY3NzKGVsLCBwcm9wcykge1xyXG4gICAgZm9yICh2YXIgcHJvcCBpbiBwcm9wcykge1xyXG4gICAgICAgIGVsLnN0eWxlW3Byb3BdID0gcHJvcHNbcHJvcF07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZWw7XHJcbn1cclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIGxpbmUgY29sb3IgZnJvbSB0aGUgZ2l2ZW4gc3RyaW5nIG9yIGFycmF5LlxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0Q29sb3IoY29sb3IsIGlkeCkge1xyXG4gICAgcmV0dXJuIHR5cGVvZiBjb2xvciA9PSAnc3RyaW5nJyA/IGNvbG9yIDogY29sb3JbaWR4ICUgY29sb3IubGVuZ3RoXTtcclxufVxyXG4vKipcclxuICogSW50ZXJuYWwgbWV0aG9kIHRoYXQgZHJhd3MgdGhlIGluZGl2aWR1YWwgbGluZXMuXHJcbiAqL1xyXG5mdW5jdGlvbiBkcmF3TGluZXMoZWwsIG9wdHMpIHtcclxuICAgIHZhciBib3JkZXJSYWRpdXMgPSAoTWF0aC5yb3VuZChvcHRzLmNvcm5lcnMgKiBvcHRzLndpZHRoICogNTAwKSAvIDEwMDApICsgJ3B4JztcclxuICAgIHZhciBzaGFkb3cgPSAnbm9uZSc7XHJcbiAgICBpZiAob3B0cy5zaGFkb3cgPT09IHRydWUpIHtcclxuICAgICAgICBzaGFkb3cgPSAnMCAycHggNHB4ICMwMDAnOyAvLyBkZWZhdWx0IHNoYWRvd1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodHlwZW9mIG9wdHMuc2hhZG93ID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIHNoYWRvdyA9IG9wdHMuc2hhZG93O1xyXG4gICAgfVxyXG4gICAgdmFyIHNoYWRvd3MgPSBwYXJzZUJveFNoYWRvdyhzaGFkb3cpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvcHRzLmxpbmVzOyBpKyspIHtcclxuICAgICAgICB2YXIgZGVncmVlcyA9IH5+KDM2MCAvIG9wdHMubGluZXMgKiBpICsgb3B0cy5yb3RhdGUpO1xyXG4gICAgICAgIHZhciBiYWNrZ3JvdW5kTGluZSA9IGNzcyhkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSwge1xyXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcclxuICAgICAgICAgICAgdG9wOiAtb3B0cy53aWR0aCAvIDIgKyBcInB4XCIsXHJcbiAgICAgICAgICAgIHdpZHRoOiAob3B0cy5sZW5ndGggKyBvcHRzLndpZHRoKSArICdweCcsXHJcbiAgICAgICAgICAgIGhlaWdodDogb3B0cy53aWR0aCArICdweCcsXHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGdldENvbG9yKG9wdHMuZmFkZUNvbG9yLCBpKSxcclxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiBib3JkZXJSYWRpdXMsXHJcbiAgICAgICAgICAgIHRyYW5zZm9ybU9yaWdpbjogJ2xlZnQnLFxyXG4gICAgICAgICAgICB0cmFuc2Zvcm06IFwicm90YXRlKFwiICsgZGVncmVlcyArIFwiZGVnKSB0cmFuc2xhdGVYKFwiICsgb3B0cy5yYWRpdXMgKyBcInB4KVwiLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZhciBkZWxheSA9IGkgKiBvcHRzLmRpcmVjdGlvbiAvIG9wdHMubGluZXMgLyBvcHRzLnNwZWVkO1xyXG4gICAgICAgIGRlbGF5IC09IDEgLyBvcHRzLnNwZWVkOyAvLyBzbyBpbml0aWFsIGFuaW1hdGlvbiBzdGF0ZSB3aWxsIGluY2x1ZGUgdHJhaWxcclxuICAgICAgICB2YXIgbGluZSA9IGNzcyhkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSwge1xyXG4gICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxyXG4gICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogZ2V0Q29sb3Iob3B0cy5jb2xvciwgaSksXHJcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogYm9yZGVyUmFkaXVzLFxyXG4gICAgICAgICAgICBib3hTaGFkb3c6IG5vcm1hbGl6ZVNoYWRvdyhzaGFkb3dzLCBkZWdyZWVzKSxcclxuICAgICAgICAgICAgYW5pbWF0aW9uOiAxIC8gb3B0cy5zcGVlZCArIFwicyBsaW5lYXIgXCIgKyBkZWxheSArIFwicyBpbmZpbml0ZSBcIiArIG9wdHMuYW5pbWF0aW9uLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJhY2tncm91bmRMaW5lLmFwcGVuZENoaWxkKGxpbmUpO1xyXG4gICAgICAgIGVsLmFwcGVuZENoaWxkKGJhY2tncm91bmRMaW5lKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBwYXJzZUJveFNoYWRvdyhib3hTaGFkb3cpIHtcclxuICAgIHZhciByZWdleCA9IC9eXFxzKihbYS16QS1aXStcXHMrKT8oLT9cXGQrKFxcLlxcZCspPykoW2EtekEtWl0qKVxccysoLT9cXGQrKFxcLlxcZCspPykoW2EtekEtWl0qKSguKikkLztcclxuICAgIHZhciBzaGFkb3dzID0gW107XHJcbiAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gYm94U2hhZG93LnNwbGl0KCcsJyk7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgdmFyIHNoYWRvdyA9IF9hW19pXTtcclxuICAgICAgICB2YXIgbWF0Y2hlcyA9IHNoYWRvdy5tYXRjaChyZWdleCk7XHJcbiAgICAgICAgaWYgKG1hdGNoZXMgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgY29udGludWU7IC8vIGludmFsaWQgc3ludGF4XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciB4ID0gK21hdGNoZXNbMl07XHJcbiAgICAgICAgdmFyIHkgPSArbWF0Y2hlc1s1XTtcclxuICAgICAgICB2YXIgeFVuaXRzID0gbWF0Y2hlc1s0XTtcclxuICAgICAgICB2YXIgeVVuaXRzID0gbWF0Y2hlc1s3XTtcclxuICAgICAgICBpZiAoeCA9PT0gMCAmJiAheFVuaXRzKSB7XHJcbiAgICAgICAgICAgIHhVbml0cyA9IHlVbml0cztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHkgPT09IDAgJiYgIXlVbml0cykge1xyXG4gICAgICAgICAgICB5VW5pdHMgPSB4VW5pdHM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh4VW5pdHMgIT09IHlVbml0cykge1xyXG4gICAgICAgICAgICBjb250aW51ZTsgLy8gdW5pdHMgbXVzdCBtYXRjaCB0byB1c2UgYXMgY29vcmRpbmF0ZXNcclxuICAgICAgICB9XHJcbiAgICAgICAgc2hhZG93cy5wdXNoKHtcclxuICAgICAgICAgICAgcHJlZml4OiBtYXRjaGVzWzFdIHx8ICcnLFxyXG4gICAgICAgICAgICB4OiB4LFxyXG4gICAgICAgICAgICB5OiB5LFxyXG4gICAgICAgICAgICB4VW5pdHM6IHhVbml0cyxcclxuICAgICAgICAgICAgeVVuaXRzOiB5VW5pdHMsXHJcbiAgICAgICAgICAgIGVuZDogbWF0Y2hlc1s4XSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiBzaGFkb3dzO1xyXG59XHJcbi8qKlxyXG4gKiBNb2RpZnkgYm94LXNoYWRvdyB4L3kgb2Zmc2V0cyB0byBjb3VudGVyYWN0IHJvdGF0aW9uXHJcbiAqL1xyXG5mdW5jdGlvbiBub3JtYWxpemVTaGFkb3coc2hhZG93cywgZGVncmVlcykge1xyXG4gICAgdmFyIG5vcm1hbGl6ZWQgPSBbXTtcclxuICAgIGZvciAodmFyIF9pID0gMCwgc2hhZG93c18xID0gc2hhZG93czsgX2kgPCBzaGFkb3dzXzEubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgdmFyIHNoYWRvdyA9IHNoYWRvd3NfMVtfaV07XHJcbiAgICAgICAgdmFyIHh5ID0gY29udmVydE9mZnNldChzaGFkb3cueCwgc2hhZG93LnksIGRlZ3JlZXMpO1xyXG4gICAgICAgIG5vcm1hbGl6ZWQucHVzaChzaGFkb3cucHJlZml4ICsgeHlbMF0gKyBzaGFkb3cueFVuaXRzICsgJyAnICsgeHlbMV0gKyBzaGFkb3cueVVuaXRzICsgc2hhZG93LmVuZCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbm9ybWFsaXplZC5qb2luKCcsICcpO1xyXG59XHJcbmZ1bmN0aW9uIGNvbnZlcnRPZmZzZXQoeCwgeSwgZGVncmVlcykge1xyXG4gICAgdmFyIHJhZGlhbnMgPSBkZWdyZWVzICogTWF0aC5QSSAvIDE4MDtcclxuICAgIHZhciBzaW4gPSBNYXRoLnNpbihyYWRpYW5zKTtcclxuICAgIHZhciBjb3MgPSBNYXRoLmNvcyhyYWRpYW5zKTtcclxuICAgIHJldHVybiBbXHJcbiAgICAgICAgTWF0aC5yb3VuZCgoeCAqIGNvcyArIHkgKiBzaW4pICogMTAwMCkgLyAxMDAwLFxyXG4gICAgICAgIE1hdGgucm91bmQoKC14ICogc2luICsgeSAqIGNvcykgKiAxMDAwKSAvIDEwMDAsXHJcbiAgICBdO1xyXG59XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFDQSxTQUFPLGVBQWUsU0FBUyxjQUFjLENBQUUsT0FBTztBQUFBOzs7Ozs7O0FDSXRELE1BQUEsbUJBQUE7QUFHSSw4QkFBWTtBQVFaLFdBQUEsUUFBUTs7QUFQSixXQUFLLFVBQVU7O0FBR25CLHFCQUFBLFVBQUEsT0FBQTtBQUNJLGFBQU8sS0FBSzs7QUFNcEIsV0FBQTs7QUFkYSxVQUFBLGtCQUFBOzs7Ozs7OztBQ1FiLE1BQUEscUJBQUE7QUFNSSxpQ0FBWSxTQUFpQjtBQUN6QixXQUFLLFVBQVU7QUFDZixXQUFLLFNBQVM7QUFDZCxXQUFLLGFBQWE7QUFDbEIsV0FBSyxVQUFVLEtBQUs7O0FBR3hCLHdCQUFBLFVBQUEsT0FBQTtBQUNJLFVBQU0sVUFBVSxLQUFLO0FBQ3JCLFVBQUksS0FBSyxTQUFTLEtBQUs7QUFDbkIsYUFBSyxVQUFVLEtBQUssVUFBVTtBQUNsQyxhQUFPOztBQUdYLHdCQUFBLFVBQUEsUUFBQTtBQUNJLFdBQUssYUFBYTtBQUNsQixXQUFLLFVBQVUsS0FBSzs7QUFFNUIsV0FBQTs7QUF4QmEsVUFBQSxxQkFBQTs7Ozs7Ozs7QUNIYixNQUFBLGdCQUFBO0FBTUksNEJBQVksU0FBaUIsV0FBbUI7QUFDNUMsV0FBSyxVQUFVO0FBQ2YsV0FBSyxZQUFZO0FBQ2pCLFdBQUssVUFBVTtBQUNmLFdBQUssVUFBVSxLQUFLOztBQUd4QixtQkFBQSxVQUFBLE9BQUE7QUFDSSxVQUFNLFVBQVUsS0FBSztBQUNyQixVQUFNLE9BQU8sS0FBSyxVQUFVLEtB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O0FBQVMsU0FBQSxlQUFBLFNBQUEsT0FBQSxDQUFBLFlBQUEsTUFBQSxLQUFBO0FBQUEsV0FBQSxNQUFBOztBQUNULE1BQUEsU0FBQTtBQUFTLFNBQUEsZUFBQSxTQUFBLGVBQUEsQ0FBQSxZQUFBLE1BQUEsS0FBQTtBQUFBLFdBQUEsT0FBQTs7QUFDVCxNQUFBLFlBQUE7QUFBUyxTQUFBLGVBQUEsU0FBQSxnQkFBQSxDQUFBLFlBQUEsTUFBQSxLQUFBO0FBQUEsV0FBQSxVQUFBOztBQUFjLFNBQUEsZUFBQSxTQUFBLFFBQUEsQ0FBQSxZQUFBLE1BQUEsS0FBQTtBQUFBLFdBQUEsVUFBQTs7QUFDdkIsTUFBQSxRQUFBO0FBQVMsU0FBQSxlQUFBLFNBQUEsYUFBQSxDQUFBLFlBQUEsTUFBQSxLQUFBO0FBQUEsV0FBQSxNQUFBOztBQUNULE1BQUEsYUFBQTtBQUFTLFNBQUEsZUFBQSxTQUFBLFlBQUEsQ0FBQSxZQUFBLE1BQUEsS0FBQTtBQUFBLFdBQUEsV0FBQTs7QUFDVCxNQUFBLFVBQUE7QUFBUyxTQUFBLGVBQUEsU0FBQSxTQUFBLENBQUEsWUFBQSxNQUFBLEtBQUE7QUFBQSxXQUFBLFFBQUE7O0FBQ1QsTUFBQSxZQUFBO0FBQVMsU0FBQSxlQUFBLFNBQUEsaUJBQUEsQ0FBQSxZQUFBLE1BQUEsS0FBQTtBQUFBLFdBQUEsVUFBQTs7QUFDVCxNQUFBLGVBQUE7QUFBUyxTQUFBLGVBQUEsU0FBQSxjQUFBLENBQUEsWUFBQSxNQUFBLEtBQUE7QUFBQSxXQUFBLGFBQUE7O0FBR1QsTUFBQSxZQUFBO0FBQVMsU0FBQSxlQUFBLFNBQUEsZ0JBQUEsQ0FBQSxZQUFBLE1BQUEsS0FBQTtBQUFBLFdBQUEsVUFBQTs7QUFDVCxNQUFBLFlBQUE7QUFBUyxTQUFBLGVBQUEsU0FBQSxXQUFBLENBQUEsWUFBQSxNQUFBLEtBQUE7QUFBQSxXQUFBLFVBQUE7Ozs7O0FDN0JULEFBQUE7QUFBQSxhQUFBLEdBQUEsR0FBQTtBQUFBLGVBQUEsSUFBQTtBQUFBLFVBQUEsQ0FBQSxFQUFBO0FBQUEsWUFBQSxDQUFBLEVBQUE7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LFdBQUEsS0FBQTtBQUNBLFFBQUEsa0JBQUEsS0FBQTtBQUVBLFFBQUEsTUFBQSxJQUFBLElBQUEsWUFBQSxLQUFBLFVBQUE7QUFFQSxRQUFBLFVBQUE7QUFHQSxRQUFBLE9BQUEsa0JBQUEsSUFDQSxXQUFBLElBQ0E7QUFFQSxhQUFBLEtBQUEsR0FBQSxLQUFBLE1BQUEsTUFBQTtBQUNBLFlBQ0EsVUFBQSxJQUFBLFdBQUEsUUFBQSxLQUNBLFVBQUEsSUFBQSxXQUFBLEtBQUEsT0FBQSxLQUNBLFVBQUEsSUFBQSxXQUFBLEtBQUEsT0FBQSxJQUNBLFVBQUEsSUFBQSxXQUFBLEtBQUE7QUFDQSxVQUFBLGFBQUEsT0FBQSxLQUFBO0FBQ0EsVUFBQSxhQUFBLE9BQUEsSUFBQTtBQUNBLFVBQUEsYUFBQSxNQUFBOztBQUdBLFFBQUEsb0JBQUE7QUFDQSxZQUNBLFVBQUEsSUFBQSxXQUFBLFFBQUEsSUFDQSxVQUFBLElBQUEsV0FBQSxLQUFBLE9BQUE7QUFDQSxVQUFBLGFBQUEsTUFBQTs7QUFHQSxRQUFBLG9CQUFBO0FBQ0EsWUFDQSxVQUFBLElBQUEsV0FBQSxRQUFBLEtBQ0EsVUFBQSxJQUFBLFdBQUEsS0FBQSxPQUFBLElBQ0EsVUFBQSxJQUFBLFdBQUEsS0FBQSxPQUFBO0FBQ0EsVUFBQSxhQUFBLE9BQUEsSUFBQTtBQUNBLFVBQUEsYUFBQSxNQUFBOztBQUdBLFdBQUE7O0FBR0EsMkJBQUE7QUFDQSxXQUFBLE9BQUEsT0FBQSxLQUFBLE1BQ0EsT0FBQSxPQUFBLEtBQUEsTUFDQSxPQUFBLE9BQUEsSUFBQSxNQUNBLE9BQUEsTUFBQTs7QUFHQSx1QkFBQSxPQUFBLE9BQUE7QUFDQSxRQUFBO0FBQ0EsUUFBQSxTQUFBO0FBQ0EsYUFBQSxLQUFBLE9BQUEsS0FBQSxLQUFBLE1BQUE7QUFDQSxZQUNBLE9BQUEsT0FBQSxLQUFBLFlBQ0EsT0FBQSxLQUFBLE1BQUEsSUFBQSxTQUNBLE9BQUEsS0FBQSxLQUFBO0FBQ0EsYUFBQSxLQUFBLGdCQUFBOztBQUVBLFdBQUEsT0FBQSxLQUFBOztBQUdBLHlCQUFBO0FBQ0EsUUFBQTtBQUNBLFFBQUEsT0FBQSxNQUFBO0FBQ0EsUUFBQSxhQUFBLE9BQUE7QUFDQSxRQUFBLFFBQUE7QUFDQSxRQUFBLGlCQUFBO0FBR0EsYUFBQSxLQUFBLEdBQUEsUUFBQSxPQUFBLFlBQUEsS0FBQSxPQUFBLE1BQUE7QUFDQSxZQUFBLEtBQUEsWUFDQSxPQUFBLElBQUEsS0FBQSxpQkFBQSxRQUFBLFFBQUEsS0FBQTs7QUFLQSxRQUFBLGVBQUE7QUFDQSxZQUFBLE1BQUEsT0FBQTtBQUNBLFlBQUEsS0FDQSxPQUFBLE9BQUEsS0FDQSxPQUFBLE9BQUEsSUFBQSxNQUNBO2VBRUEsZUFBQTtBQUNBLFlBQUEsT0FBQSxPQUFBLE1BQUEsS0FBQSxNQUFBLE9BQUE7QUFDQSxZQUFBLEtBQ0EsT0FBQSxPQUFBLE1BQ0EsT0FBQSxPQUFBLElBQUEsTUFDQSxPQUFBLE9BQUEsSUFBQSxNQUNBOztBQUlBLFdBQUEsTUFBQSxLQUFBOzs7O0FDckpBOzs7Ozs7QUFRQTtBQUVBLFFBQUEsU0FBQSxTQUFBO0FBQ0EsUUFBQSxVQUFBLFNBQUE7QUFFQSxZQUFBLFNBQUE7QUFDQSxZQUFBLGFBQUE7QUFDQSxZQUFBLG9CQUFBO0FBRUEsUUFBQSxlQUFBO0FBQ0EsWUFBQSxhQUFBO0FBZ0JBLFlBQUEsc0JBQUE7QUFFQSxRQUFBLENBQUEsUUFBQSx1QkFBQSxPQUFBLFlBQUEsZUFDQSxPQUFBLFFBQUEsVUFBQTtBQUNBLGNBQUEsTUFDQTs7QUFLQTtBQUVBO0FBQ0EsWUFBQSxNQUFBLElBQUEsV0FBQTtBQUNBLFlBQUEsWUFBQSxDQUFBLFdBQUEsV0FBQSxXQUFBLEtBQUE7QUFBQSxpQkFBQTs7QUFDQSxlQUFBLElBQUEsVUFBQTtlQUNBO0FBQ0EsZUFBQTs7O0FBSUEsV0FBQSxlQUFBLFFBQUEsV0FBQSxVQUFBO01BQ0EsWUFBQTtNQUNBLEtBQUE7QUFDQSxZQUFBLENBQUEsUUFBQSxTQUFBO0FBQUEsaUJBQUE7QUFDQSxlQUFBLEtBQUE7OztBQUlBLFdBQUEsZUFBQSxRQUFBLFdBQUEsVUFBQTtNQUNBLFlBQUE7TUFDQSxLQUFBO0FBQ0EsWUFBQSxDQUFBLFFBQUEsU0FBQTtBQUFBLGlCQUFBO0FBQ0EsZUFBQSxLQUFBOzs7QUFJQSwwQkFBQTtBQUNBLFVBQUEsU0FBQTtBQUNBLGNBQUEsSUFBQSxXQUFBLGdCQUFBLFNBQUE7O0FBR0EsVUFBQSxNQUFBLElBQUEsV0FBQTtBQUNBLFVBQUEsWUFBQSxRQUFBO0FBQ0EsYUFBQTs7QUFhQSxxQkFBQSxLQUFBLGtCQUFBO0FBRUEsVUFBQSxPQUFBLFFBQUE7QUFDQSxZQUFBLE9BQUEscUJBQUE7QUFDQSxnQkFBQSxJQUFBLFVBQ0E7O0FBR0EsZUFBQSxZQUFBOztBQUVBLGFBQUEsS0FBQSxLQUFBLGtCQUFBOztBQUlBLFFBQUEsT0FBQSxXQUFBLGVBQUEsT0FBQSxXQUFBLFFBQ0EsUUFBQSxPQUFBLGFBQUE7QUFDQSxhQUFBLGVBQUEsU0FBQSxPQUFBLFNBQUE7UUFDQSxPQUFBO1FBQ0EsY0FBQTtRQUNBLFlBQUE7UUFDQSxVQUFBOzs7QUFJQSxZQUFBLFdBQUE7QUFFQSxrQkFBQSxPQUFBLGtCQUFBO0FBQ0EsVUFBQSxPQUFBLFVBQUE7QUFDQSxlQUFBLFdBQUEsT0FBQTs7QUFHQSxVQUFBLFlBQUEsT0FBQTtBQUNBLGVBQUEsY0FBQTs7QUFHQSxVQUFBLFNBQUE7QUFDQSxjQUFBLFVBQ0Esb0hBQ0EsT0FBQTs7QUFJQSxVQUFBLFdBQUEsT0FBQSxnQkFDQSxTQUFBLFdBQUEsTUFBQSxRQUFBO0FBQ0EsZUFBQSxnQkFBQSxPQUFBLGtCQUFBOztBQUdBLFVBQUEsT0FBQSxVQUFBO0FBQ0EsY0FBQSxJQUFBLFVBQ0E7O0FBSUEsVUFBQSxVQUFBLE1BQUEsV0FBQSxNQUFBO0FBQ0EsVUFBQSxXQUFBLFFBQUEsWUFBQTtBQUNBLGVBQUEsUUFBQSxLQUFBLFNBQUEsa0JBQUE7O0FBR0EsVUFBQSxJQUFBLFdBQUE7QUFDQSxVQUFBO0FBQUEsZUFBQTtBQUVBLFVBQUEsT0FBQSxXQUFBLGVBQUEsT0FBQSxlQUFBLFFBQ0EsT0FBQSxNQUFBLE9BQUEsaUJBQUE7QUFDQSxlQUFBLFFBQUEsS0FDQSxNQUFBLE9BQUEsYUFBQSxXQUFBLGtCQUFBOztBQUlBLFlBQUEsSUFBQSxVQUNBLG9IQUNBLE9BQUE7O0FBWUEsWUFBQSxPQUFBLFNBQUEsT0FBQSxrQkFBQTtBQUNBLGFBQUEsS0FBQSxPQUFBLGtCQUFBOztBQUtBLFlBQUEsVUFBQSxZQUFBLFdBQUE7QUFDQSxZQUFBLFlBQUE7QUFFQSx3QkFBQTtBQUNBLFVBQUEsT0FBQSxTQUFBO0FBQ0EsY0FBQSxJQUFBLFVBQUE7aUJBQ0EsT0FBQTtBQUNBLGNBQUEsSUFBQSxXQUFBLGdCQUFBLE9BQUE7OztBQUlBLG1CQUFBLE1BQUEsTUFBQTtBQUNBLGlCQUFBO0FBQ0EsVUFBQSxRQUFBO0FBQ0EsZUFBQSxhQUFBOztBQUVBLFVBQUEsU0FBQTtBQUlBLGVBQUEsT0FBQSxhQUFBLFdBQ0EsYUFBQSxNQUFBLEtBQUEsTUFBQSxZQUNBLGFBQUEsTUFBQSxLQUFBOztBQUVBLGFBQUEsYUFBQTs7QUFPQSxZQUFBLFFBQUEsU0FBQSxNQUFBLE1BQUE7QUFDQSxhQUFBLE1BQUEsTUFBQSxNQUFBOztBQUdBLHlCQUFBO0FBQ0EsaUJBQUE7QUFDQSxhQUFBLGFBQUEsT0FBQSxJQUFBLElBQUEsUUFBQSxRQUFBOztBQU1BLFlBQUEsY0FBQSxTQUFBO0FBQ0EsYUFBQSxZQUFBOztBQUtBLFlBQUEsa0JBQUEsU0FBQTtBQUNBLGFBQUEsWUFBQTs7QUFHQSx3QkFBQSxRQUFBO0FBQ0EsVUFBQSxPQUFBLGFBQUEsWUFBQSxhQUFBO0FBQ0EsbUJBQUE7O0FBR0EsVUFBQSxDQUFBLFFBQUEsV0FBQTtBQUNBLGNBQUEsSUFBQSxVQUFBLHVCQUFBOztBQUdBLFVBQUEsU0FBQSxXQUFBLFFBQUEsWUFBQTtBQUNBLFVBQUEsTUFBQSxhQUFBO0FBRUEsVUFBQSxTQUFBLElBQUEsTUFBQSxRQUFBO0FBRUEsVUFBQSxXQUFBO0FBSUEsY0FBQSxJQUFBLE1BQUEsR0FBQTs7QUFHQSxhQUFBOztBQUdBLDJCQUFBO0FBQ0EsVUFBQSxTQUFBLE1BQUEsU0FBQSxJQUFBLElBQUEsUUFBQSxNQUFBLFVBQUE7QUFDQSxVQUFBLE1BQUEsYUFBQTtBQUNBLGVBQUEsSUFBQSxHQUFBLElBQUEsUUFBQSxLQUFBO0FBQ0EsWUFBQSxLQUFBLE1BQUEsS0FBQTs7QUFFQSxhQUFBOztBQUdBLDZCQUFBLE9BQUEsWUFBQTtBQUNBLFVBQUEsYUFBQSxLQUFBLE1BQUEsYUFBQTtBQUNBLGNBQUEsSUFBQSxXQUFBOztBQUdBLFVBQUEsTUFBQSxhQUFBLGFBQUEsV0FBQTtBQUNBLGNBQUEsSUFBQSxXQUFBOztBQUdBLFVBQUE7QUFDQSxVQUFBLGVBQUEsVUFBQSxXQUFBO0FBQ0EsY0FBQSxJQUFBLFdBQUE7aUJBQ0EsV0FBQTtBQUNBLGNBQUEsSUFBQSxXQUFBLE9BQUE7O0FBRUEsY0FBQSxJQUFBLFdBQUEsT0FBQSxZQUFBOztBQUlBLFVBQUEsWUFBQSxRQUFBO0FBQ0EsYUFBQTs7QUFHQSx3QkFBQTtBQUNBLFVBQUEsUUFBQSxTQUFBO0FBQ0EsWUFBQSxNQUFBLFFBQUEsSUFBQSxVQUFBO0FBQ0EsWUFBQSxNQUFBLGFBQUE7QUFFQSxZQUFBLElBQUEsV0FBQTtBQUNBLGlCQUFBOztBQUdBLFlBQUEsS0FBQSxLQUFBLEdBQUEsR0FBQTtBQUNBLGVBQUE7O0FBR0EsVUFBQSxJQUFBLFdBQUE7QUFDQSxZQUFBLE9BQUEsSUFBQSxXQUFBLFlBQUEsWUFBQSxJQUFBO0FBQ0EsaUJBQUEsYUFBQTs7QUFFQSxlQUFBLGNBQUE7O0FBR0EsVUFBQSxJQUFBLFNBQUEsWUFBQSxNQUFBLFFBQUEsSUFBQTtBQUNBLGVBQUEsY0FBQSxJQUFBOzs7QUFJQSxxQkFBQTtBQUdBLFVBQUEsVUFBQTtBQUNBLGNBQUEsSUFBQSxXQUFBLDREQUNBLGFBQUEsU0FBQSxNQUFBOztBQUVBLGFBQUEsU0FBQTs7QUFHQSx3QkFBQTtBQUNBLFVBQUEsQ0FBQSxVQUFBO0FBQ0EsaUJBQUE7O0FBRUEsYUFBQSxRQUFBLE1BQUEsQ0FBQTs7QUFHQSxZQUFBLFdBQUEsa0JBQUE7QUFDQSxhQUFBLEtBQUEsUUFBQSxFQUFBLGNBQUEsUUFDQSxNQUFBLFFBQUE7O0FBR0EsWUFBQSxVQUFBLGlCQUFBLEdBQUE7QUFDQSxVQUFBLFdBQUEsR0FBQTtBQUFBLFlBQUEsUUFBQSxLQUFBLEdBQUEsRUFBQSxRQUFBLEVBQUE7QUFDQSxVQUFBLFdBQUEsR0FBQTtBQUFBLFlBQUEsUUFBQSxLQUFBLEdBQUEsRUFBQSxRQUFBLEVBQUE7QUFDQSxVQUFBLENBQUEsUUFBQSxTQUFBLE1BQUEsQ0FBQSxRQUFBLFNBQUE7QUFDQSxjQUFBLElBQUEsVUFDQTs7QUFJQSxVQUFBLE1BQUE7QUFBQSxlQUFBO0FBRUEsVUFBQSxJQUFBLEVBQUE7QUFDQSxVQUFBLElBQUEsRUFBQTtBQUVBLGVBQUEsSUFBQSxHQUFBLE1BQUEsS0FBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLEtBQUEsRUFBQTtBQUNBLFlBQUEsRUFBQSxPQUFBLEVBQUE7QUFDQSxjQUFBLEVBQUE7QUFDQSxjQUFBLEVBQUE7QUFDQTs7O0FBSUEsVUFBQSxJQUFBO0FBQUEsZUFBQTtBQUNBLFVBQUEsSUFBQTtBQUFBLGVBQUE7QUFDQSxhQUFBOztBQUdBLFlBQUEsYUFBQSxvQkFBQTtBQUNBLGNBQUEsT0FBQSxVQUFBO2FBQ0E7YUFDQTthQUNBO2FBQ0E7YUFDQTthQUNBO2FBQ0E7YUFDQTthQUNBO2FBQ0E7YUFDQTtBQUNBLGlCQUFBOztBQUVBLGlCQUFBOzs7QUFJQSxZQUFBLFNBQUEsZ0JBQUEsTUFBQTtBQUNBLFVBQUEsQ0FBQSxNQUFBLFFBQUE7QUFDQSxjQUFBLElBQUEsVUFBQTs7QUFHQSxVQUFBLEtBQUEsV0FBQTtBQUNBLGVBQUEsUUFBQSxNQUFBOztBQUdBLFVBQUE7QUFDQSxVQUFBLFdBQUE7QUFDQSxpQkFBQTtBQUNBLGFBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxRQUFBLEVBQUE7QUFDQSxvQkFBQSxLQUFBLEdBQUE7OztBQUlBLFVBQUEsU0FBQSxRQUFBLFlBQUE7QUFDQSxVQUFBLE1BQUE7QUFDQSxXQUFBLElBQUEsR0FBQSxJQUFBLEtBQUEsUUFBQSxFQUFBO0FBQ0EsWUFBQSxNQUFBLEtBQUE7QUFDQSxZQUFBLFdBQUEsS0FBQTtBQUNBLGdCQUFBLFFBQUEsS0FBQTs7QUFFQSxZQUFBLENBQUEsUUFBQSxTQUFBO0FBQ0EsZ0JBQUEsSUFBQSxVQUFBOztBQUVBLFlBQUEsS0FBQSxRQUFBO0FBQ0EsZUFBQSxJQUFBOztBQUVBLGFBQUE7O0FBR0Esd0JBQUEsUUFBQTtBQUNBLFVBQUEsUUFBQSxTQUFBO0FBQ0EsZUFBQSxPQUFBOztBQUVBLFVBQUEsWUFBQSxPQUFBLFdBQUEsV0FBQSxRQUFBO0FBQ0EsZUFBQSxPQUFBOztBQUVBLFVBQUEsT0FBQSxXQUFBO0FBQ0EsY0FBQSxJQUFBLFVBQ0EsNkZBQ0EsT0FBQTs7QUFJQSxVQUFBLE1BQUEsT0FBQTtBQUNBLFVBQUEsWUFBQSxVQUFBLFNBQUEsS0FBQSxVQUFBLE9BQUE7QUFDQSxVQUFBLENBQUEsYUFBQSxRQUFBO0FBQUEsZUFBQTtBQUdBLFVBQUEsY0FBQTtBQUNBO0FBQ0EsZ0JBQUE7ZUFDQTtlQUNBO2VBQ0E7QUFDQSxtQkFBQTtlQUNBO2VBQ0E7QUFDQSxtQkFBQSxZQUFBLFFBQUE7ZUFDQTtlQUNBO2VBQ0E7ZUFDQTtBQUNBLG1CQUFBLE1BQUE7ZUFDQTtBQUNBLG1CQUFBLFFBQUE7ZUFDQTtBQUNBLG1CQUFBLGNBQUEsUUFBQTs7QUFFQSxnQkFBQTtBQUNBLHFCQUFBLFlBQUEsS0FBQSxZQUFBLFFBQUE7O0FBRUEsdUJBQUEsTUFBQSxVQUFBO0FBQ0EsMEJBQUE7Ozs7QUFJQSxZQUFBLGFBQUE7QUFFQSwwQkFBQSxVQUFBLE9BQUE7QUFDQSxVQUFBLGNBQUE7QUFTQSxVQUFBLFVBQUEsVUFBQSxRQUFBO0FBQ0EsZ0JBQUE7O0FBSUEsVUFBQSxRQUFBLEtBQUE7QUFDQSxlQUFBOztBQUdBLFVBQUEsUUFBQSxVQUFBLE1BQUEsS0FBQTtBQUNBLGNBQUEsS0FBQTs7QUFHQSxVQUFBLE9BQUE7QUFDQSxlQUFBOztBQUlBLGVBQUE7QUFDQSxpQkFBQTtBQUVBLFVBQUEsT0FBQTtBQUNBLGVBQUE7O0FBR0EsVUFBQSxDQUFBO0FBQUEsbUJBQUE7QUFFQSxhQUFBO0FBQ0EsZ0JBQUE7ZUFDQTtBQUNBLG1CQUFBLFNBQUEsTUFBQSxPQUFBO2VBRUE7ZUFDQTtBQUNBLG1CQUFBLFVBQUEsTUFBQSxPQUFBO2VBRUE7QUFDQSxtQkFBQSxXQUFBLE1BQUEsT0FBQTtlQUVBO2VBQ0E7QUFDQSxtQkFBQSxZQUFBLE1BQUEsT0FBQTtlQUVBO0FBQ0EsbUJBQUEsWUFBQSxNQUFBLE9BQUE7ZUFFQTtlQUNBO2VBQ0E7ZUFDQTtBQUNBLG1CQUFBLGFBQUEsTUFBQSxPQUFBOztBQUdBLGdCQUFBO0FBQUEsb0JBQUEsSUFBQSxVQUFBLHVCQUFBO0FBQ0EsdUJBQUEsWUFBQSxJQUFBO0FBQ0EsMEJBQUE7Ozs7QUFXQSxZQUFBLFVBQUEsWUFBQTtBQUVBLGtCQUFBLEdBQUEsR0FBQTtBQUNBLFVBQUEsSUFBQSxFQUFBO0FBQ0EsUUFBQSxLQUFBLEVBQUE7QUFDQSxRQUFBLEtBQUE7O0FBR0EsWUFBQSxVQUFBLFNBQUE7QUFDQSxVQUFBLE1BQUEsS0FBQTtBQUNBLFVBQUEsTUFBQSxNQUFBO0FBQ0EsY0FBQSxJQUFBLFdBQUE7O0FBRUEsZUFBQSxJQUFBLEdBQUEsSUFBQSxLQUFBLEtBQUE7QUFDQSxhQUFBLE1BQUEsR0FBQSxJQUFBOztBQUVBLGFBQUE7O0FBR0EsWUFBQSxVQUFBLFNBQUE7QUFDQSxVQUFBLE1BQUEsS0FBQTtBQUNBLFVBQUEsTUFBQSxNQUFBO0FBQ0EsY0FBQSxJQUFBLFdBQUE7O0FBRUEsZUFBQSxJQUFBLEdBQUEsSUFBQSxLQUFBLEtBQUE7QUFDQSxhQUFBLE1BQUEsR0FBQSxJQUFBO0FBQ0EsYUFBQSxNQUFBLElBQUEsR0FBQSxJQUFBOztBQUVBLGFBQUE7O0FBR0EsWUFBQSxVQUFBLFNBQUE7QUFDQSxVQUFBLE1BQUEsS0FBQTtBQUNBLFVBQUEsTUFBQSxNQUFBO0FBQ0EsY0FBQSxJQUFBLFdBQUE7O0FBRUEsZUFBQSxJQUFBLEdBQUEsSUFBQSxLQUFBLEtBQUE7QUFDQSxhQUFBLE1BQUEsR0FBQSxJQUFBO0FBQ0EsYUFBQSxNQUFBLElBQUEsR0FBQSxJQUFBO0FBQ0EsYUFBQSxNQUFBLElBQUEsR0FBQSxJQUFBO0FBQ0EsYUFBQSxNQUFBLElBQUEsR0FBQSxJQUFBOztBQUVBLGFBQUE7O0FBR0EsWUFBQSxVQUFBLFdBQUE7QUFDQSxVQUFBLFNBQUEsS0FBQTtBQUNBLFVBQUEsV0FBQTtBQUFBLGVBQUE7QUFDQSxVQUFBLFVBQUEsV0FBQTtBQUFBLGVBQUEsVUFBQSxNQUFBLEdBQUE7QUFDQSxhQUFBLGFBQUEsTUFBQSxNQUFBOztBQUdBLFlBQUEsVUFBQSxpQkFBQSxRQUFBLFVBQUE7QUFFQSxZQUFBLFVBQUEsU0FBQSxnQkFBQTtBQUNBLFVBQUEsQ0FBQSxRQUFBLFNBQUE7QUFBQSxjQUFBLElBQUEsVUFBQTtBQUNBLFVBQUEsU0FBQTtBQUFBLGVBQUE7QUFDQSxhQUFBLFFBQUEsUUFBQSxNQUFBLE9BQUE7O0FBR0EsWUFBQSxVQUFBLFVBQUE7QUFDQSxVQUFBLE1BQUE7QUFDQSxVQUFBLE1BQUEsUUFBQTtBQUNBLFlBQUEsS0FBQSxTQUFBLE9BQUEsR0FBQSxLQUFBLFFBQUEsV0FBQSxPQUFBO0FBQ0EsVUFBQSxLQUFBLFNBQUE7QUFBQSxlQUFBO0FBQ0EsYUFBQSxhQUFBLE1BQUE7O0FBR0EsWUFBQSxVQUFBLFVBQUEsaUJBQUEsUUFBQSxPQUFBLEtBQUEsV0FBQTtBQUNBLFVBQUEsV0FBQSxRQUFBO0FBQ0EsaUJBQUEsUUFBQSxLQUFBLFFBQUEsT0FBQSxRQUFBLE9BQUE7O0FBRUEsVUFBQSxDQUFBLFFBQUEsU0FBQTtBQUNBLGNBQUEsSUFBQSxVQUNBLG1GQUNBLE9BQUE7O0FBSUEsVUFBQSxVQUFBO0FBQ0EsZ0JBQUE7O0FBRUEsVUFBQSxRQUFBO0FBQ0EsY0FBQSxTQUFBLE9BQUEsU0FBQTs7QUFFQSxVQUFBLGNBQUE7QUFDQSxvQkFBQTs7QUFFQSxVQUFBLFlBQUE7QUFDQSxrQkFBQSxLQUFBOztBQUdBLFVBQUEsUUFBQSxLQUFBLE1BQUEsT0FBQSxVQUFBLFlBQUEsS0FBQSxVQUFBLEtBQUE7QUFDQSxj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QUE7QUFDQSxjQUFBLFFBQUE7QUFDQSxtQkFBQSxJQUFBLEdBQUEsSUFBQSxXQUFBO0FBQ0EsZ0JBQUEsS0FBQSxLQUFBLElBQUEsT0FBQSxLQUFBLEtBQUE7QUFDQSxzQkFBQTtBQUNBOzs7QUFHQSxjQUFBO0FBQUEsbUJBQUE7OztBQUlBLGFBQUE7O0FBR0EsWUFBQSxVQUFBLFdBQUEsa0JBQUEsS0FBQSxZQUFBO0FBQ0EsYUFBQSxLQUFBLFFBQUEsS0FBQSxZQUFBLGNBQUE7O0FBR0EsWUFBQSxVQUFBLFVBQUEsaUJBQUEsS0FBQSxZQUFBO0FBQ0EsYUFBQSxxQkFBQSxNQUFBLEtBQUEsWUFBQSxVQUFBOztBQUdBLFlBQUEsVUFBQSxjQUFBLHFCQUFBLEtBQUEsWUFBQTtBQUNBLGFBQUEscUJBQUEsTUFBQSxLQUFBLFlBQUEsVUFBQTs7QUFHQSxzQkFBQSxLQUFBLFFBQUEsUUFBQTtBQUNBLGVBQUEsT0FBQSxXQUFBO0FBQ0EsVUFBQSxZQUFBLElBQUEsU0FBQTtBQUNBLFVBQUEsQ0FBQTtBQUNBLGlCQUFBOztBQUVBLGlCQUFBLE9BQUE7QUFDQSxZQUFBLFNBQUE7QUFDQSxtQkFBQTs7O0FBSUEsVUFBQSxTQUFBLE9BQUE7QUFFQSxVQUFBLFNBQUEsU0FBQTtBQUNBLGlCQUFBLFNBQUE7O0FBRUEsZUFBQSxJQUFBLEdBQUEsSUFBQSxRQUFBLEVBQUE7QUFDQSxZQUFBLFNBQUEsU0FBQSxPQUFBLE9BQUEsSUFBQSxHQUFBLElBQUE7QUFDQSxZQUFBLFlBQUE7QUFBQSxpQkFBQTtBQUNBLFlBQUEsU0FBQSxLQUFBOztBQUVBLGFBQUE7O0FBR0EsdUJBQUEsS0FBQSxRQUFBLFFBQUE7QUFDQSxhQUFBLFdBQUEsWUFBQSxRQUFBLElBQUEsU0FBQSxTQUFBLEtBQUEsUUFBQTs7QUFHQSx3QkFBQSxLQUFBLFFBQUEsUUFBQTtBQUNBLGFBQUEsV0FBQSxhQUFBLFNBQUEsS0FBQSxRQUFBOztBQUdBLHlCQUFBLEtBQUEsUUFBQSxRQUFBO0FBQ0EsYUFBQSxXQUFBLEtBQUEsUUFBQSxRQUFBOztBQUdBLHlCQUFBLEtBQUEsUUFBQSxRQUFBO0FBQ0EsYUFBQSxXQUFBLGNBQUEsU0FBQSxLQUFBLFFBQUE7O0FBR0EsdUJBQUEsS0FBQSxRQUFBLFFBQUE7QUFDQSxhQUFBLFdBQUEsZUFBQSxRQUFBLElBQUEsU0FBQSxTQUFBLEtBQUEsUUFBQTs7QUFHQSxZQUFBLFVBQUEsUUFBQSxlQUFBLFFBQUEsUUFBQSxRQUFBO0FBRUEsVUFBQSxXQUFBO0FBQ0EsbUJBQUE7QUFDQSxpQkFBQSxLQUFBO0FBQ0EsaUJBQUE7aUJBRUEsV0FBQSxVQUFBLE9BQUEsV0FBQTtBQUNBLG1CQUFBO0FBQ0EsaUJBQUEsS0FBQTtBQUNBLGlCQUFBO2lCQUVBLFNBQUE7QUFDQSxpQkFBQSxXQUFBO0FBQ0EsWUFBQSxTQUFBO0FBQ0EsbUJBQUEsV0FBQTtBQUNBLGNBQUEsYUFBQTtBQUFBLHVCQUFBOztBQUVBLHFCQUFBO0FBQ0EsbUJBQUE7OztBQUdBLGNBQUEsSUFBQSxNQUNBOztBQUlBLFVBQUEsWUFBQSxLQUFBLFNBQUE7QUFDQSxVQUFBLFdBQUEsVUFBQSxTQUFBO0FBQUEsaUJBQUE7QUFFQSxVQUFBLE9BQUEsU0FBQSxLQUFBLFVBQUEsS0FBQSxTQUFBLE1BQUEsU0FBQSxLQUFBO0FBQ0EsY0FBQSxJQUFBLFdBQUE7O0FBR0EsVUFBQSxDQUFBO0FBQUEsbUJBQUE7QUFFQSxVQUFBLGNBQUE7QUFDQTtBQUNBLGdCQUFBO2VBQ0E7QUFDQSxtQkFBQSxTQUFBLE1BQUEsUUFBQSxRQUFBO2VBRUE7ZUFDQTtBQUNBLG1CQUFBLFVBQUEsTUFBQSxRQUFBLFFBQUE7ZUFFQTtBQUNBLG1CQUFBLFdBQUEsTUFBQSxRQUFBLFFBQUE7ZUFFQTtlQUNBO0FBQ0EsbUJBQUEsWUFBQSxNQUFBLFFBQUEsUUFBQTtlQUVBO0FBRUEsbUJBQUEsWUFBQSxNQUFBLFFBQUEsUUFBQTtlQUVBO2VBQ0E7ZUFDQTtlQUNBO0FBQ0EsbUJBQUEsVUFBQSxNQUFBLFFBQUEsUUFBQTs7QUFHQSxnQkFBQTtBQUFBLG9CQUFBLElBQUEsVUFBQSx1QkFBQTtBQUNBLHVCQUFBLE1BQUEsVUFBQTtBQUNBLDBCQUFBOzs7O0FBS0EsWUFBQSxVQUFBLFNBQUE7QUFDQSxhQUFBO1FBQ0EsTUFBQTtRQUNBLE1BQUEsTUFBQSxVQUFBLE1BQUEsS0FBQSxLQUFBLFFBQUEsTUFBQTs7O0FBSUEseUJBQUEsS0FBQSxPQUFBO0FBQ0EsVUFBQSxVQUFBLEtBQUEsUUFBQSxJQUFBO0FBQ0EsZUFBQSxPQUFBLGNBQUE7O0FBRUEsZUFBQSxPQUFBLGNBQUEsSUFBQSxNQUFBLE9BQUE7OztBQUlBLHVCQUFBLEtBQUEsT0FBQTtBQUNBLFlBQUEsS0FBQSxJQUFBLElBQUEsUUFBQTtBQUNBLFVBQUEsTUFBQTtBQUVBLFVBQUEsSUFBQTtBQUNBLGFBQUEsSUFBQTtBQUNBLFlBQUEsWUFBQSxJQUFBO0FBQ0EsWUFBQSxZQUFBO0FBQ0EsWUFBQSxtQkFBQSxZQUFBLE1BQUEsSUFDQSxZQUFBLE1BQUEsSUFDQSxZQUFBLE1BQUEsSUFDQTtBQUVBLFlBQUEsSUFBQSxvQkFBQTtBQUNBLGNBQUEsWUFBQSxXQUFBLFlBQUE7QUFFQSxrQkFBQTtpQkFDQTtBQUNBLGtCQUFBLFlBQUE7QUFDQSw0QkFBQTs7QUFFQTtpQkFDQTtBQUNBLDJCQUFBLElBQUEsSUFBQTtBQUNBLGtCQUFBLGNBQUEsU0FBQTtBQUNBLGdDQUFBLGFBQUEsT0FBQSxJQUFBLGFBQUE7QUFDQSxvQkFBQSxnQkFBQTtBQUNBLDhCQUFBOzs7QUFHQTtpQkFDQTtBQUNBLDJCQUFBLElBQUEsSUFBQTtBQUNBLDBCQUFBLElBQUEsSUFBQTtBQUNBLGtCQUFBLGNBQUEsU0FBQSxPQUFBLGFBQUEsU0FBQTtBQUNBLGdDQUFBLGFBQUEsT0FBQSxLQUFBLGNBQUEsT0FBQSxJQUFBLFlBQUE7QUFDQSxvQkFBQSxnQkFBQSxRQUFBLGlCQUFBLFNBQUEsZ0JBQUE7QUFDQSw4QkFBQTs7O0FBR0E7aUJBQ0E7QUFDQSwyQkFBQSxJQUFBLElBQUE7QUFDQSwwQkFBQSxJQUFBLElBQUE7QUFDQSwyQkFBQSxJQUFBLElBQUE7QUFDQSxrQkFBQSxjQUFBLFNBQUEsT0FBQSxhQUFBLFNBQUEsT0FBQSxjQUFBLFNBQUE7QUFDQSxnQ0FBQSxhQUFBLE9BQUEsS0FBQSxjQUFBLE9BQUEsS0FBQSxhQUFBLE9BQUEsSUFBQSxhQUFBO0FBQ0Esb0JBQUEsZ0JBQUEsU0FBQSxnQkFBQTtBQUNBLDhCQUFBOzs7OztBQU1BLFlBQUEsY0FBQTtBQUdBLHNCQUFBO0FBQ0EsNkJBQUE7bUJBQ0EsWUFBQTtBQUVBLHVCQUFBO0FBQ0EsY0FBQSxLQUFBLGNBQUEsS0FBQSxPQUFBO0FBQ0Esc0JBQUEsUUFBQSxZQUFBOztBQUdBLFlBQUEsS0FBQTtBQUNBLGFBQUE7O0FBR0EsYUFBQSxzQkFBQTs7QUFNQSxRQUFBLHVCQUFBO0FBRUEsbUNBQUE7QUFDQSxVQUFBLE1BQUEsV0FBQTtBQUNBLFVBQUEsT0FBQTtBQUNBLGVBQUEsT0FBQSxhQUFBLE1BQUEsUUFBQTs7QUFJQSxVQUFBLE1BQUE7QUFDQSxVQUFBLElBQUE7QUFDQSxhQUFBLElBQUE7QUFDQSxlQUFBLE9BQUEsYUFBQSxNQUNBLFFBQ0EsV0FBQSxNQUFBLEdBQUEsS0FBQTs7QUFHQSxhQUFBOztBQUdBLHdCQUFBLEtBQUEsT0FBQTtBQUNBLFVBQUEsTUFBQTtBQUNBLFlBQUEsS0FBQSxJQUFBLElBQUEsUUFBQTtBQUVBLGVBQUEsSUFBQSxPQUFBLElBQUEsS0FBQSxFQUFBO0FBQ0EsZUFBQSxPQUFBLGFBQUEsSUFBQSxLQUFBOztBQUVBLGFBQUE7O0FBR0EseUJBQUEsS0FBQSxPQUFBO0FBQ0EsVUFBQSxNQUFBO0FBQ0EsWUFBQSxLQUFBLElBQUEsSUFBQSxRQUFBO0FBRUEsZUFBQSxJQUFBLE9BQUEsSUFBQSxLQUFBLEVBQUE7QUFDQSxlQUFBLE9BQUEsYUFBQSxJQUFBOztBQUVBLGFBQUE7O0FBR0Esc0JBQUEsS0FBQSxPQUFBO0FBQ0EsVUFBQSxNQUFBLElBQUE7QUFFQSxVQUFBLENBQUEsU0FBQSxRQUFBO0FBQUEsZ0JBQUE7QUFDQSxVQUFBLENBQUEsT0FBQSxNQUFBLEtBQUEsTUFBQTtBQUFBLGNBQUE7QUFFQSxVQUFBLE1BQUE7QUFDQSxlQUFBLElBQUEsT0FBQSxJQUFBLEtBQUEsRUFBQTtBQUNBLGVBQUEsTUFBQSxJQUFBOztBQUVBLGFBQUE7O0FBR0EsMEJBQUEsS0FBQSxPQUFBO0FBQ0EsVUFBQSxRQUFBLElBQUEsTUFBQSxPQUFBO0FBQ0EsVUFBQSxNQUFBO0FBQ0EsZUFBQSxJQUFBLEdBQUEsSUFBQSxNQUFBLFFBQUEsS0FBQTtBQUNBLGVBQUEsT0FBQSxhQUFBLE1BQUEsS0FBQSxNQUFBLElBQUEsS0FBQTs7QUFFQSxhQUFBOztBQUdBLFlBQUEsVUFBQSxRQUFBLGVBQUEsT0FBQTtBQUNBLFVBQUEsTUFBQSxLQUFBO0FBQ0EsY0FBQSxDQUFBLENBQUE7QUFDQSxZQUFBLFFBQUEsU0FBQSxNQUFBLENBQUEsQ0FBQTtBQUVBLFVBQUEsUUFBQTtBQUNBLGlCQUFBO0FBQ0EsWUFBQSxRQUFBO0FBQUEsa0JBQUE7aUJBQ0EsUUFBQTtBQUNBLGdCQUFBOztBQUdBLFVBQUEsTUFBQTtBQUNBLGVBQUE7QUFDQSxZQUFBLE1BQUE7QUFBQSxnQkFBQTtpQkFDQSxNQUFBO0FBQ0EsY0FBQTs7QUFHQSxVQUFBLE1BQUE7QUFBQSxjQUFBO0FBRUEsVUFBQSxTQUFBLEtBQUEsU0FBQSxPQUFBO0FBRUEsYUFBQSxZQUFBLFFBQUE7QUFDQSxhQUFBOztBQU1BLHlCQUFBLFFBQUEsS0FBQTtBQUNBLFVBQUEsU0FBQSxNQUFBLEtBQUEsU0FBQTtBQUFBLGNBQUEsSUFBQSxXQUFBO0FBQ0EsVUFBQSxTQUFBLE1BQUE7QUFBQSxjQUFBLElBQUEsV0FBQTs7QUFHQSxZQUFBLFVBQUEsYUFBQSxvQkFBQSxRQUFBLGFBQUE7QUFDQSxlQUFBLFdBQUE7QUFDQSxvQkFBQSxnQkFBQTtBQUNBLFVBQUEsQ0FBQTtBQUFBLG9CQUFBLFFBQUEsYUFBQSxLQUFBO0FBRUEsVUFBQSxNQUFBLEtBQUE7QUFDQSxVQUFBLE1BQUE7QUFDQSxVQUFBLElBQUE7QUFDQSxhQUFBLEVBQUEsSUFBQSxlQUFBLFFBQUE7QUFDQSxlQUFBLEtBQUEsU0FBQSxLQUFBOztBQUdBLGFBQUE7O0FBR0EsWUFBQSxVQUFBLGFBQUEsb0JBQUEsUUFBQSxhQUFBO0FBQ0EsZUFBQSxXQUFBO0FBQ0Esb0JBQUEsZ0JBQUE7QUFDQSxVQUFBLENBQUE7QUFDQSxvQkFBQSxRQUFBLGFBQUEsS0FBQTs7QUFHQSxVQUFBLE1BQUEsS0FBQSxTQUFBLEVBQUE7QUFDQSxVQUFBLE1BQUE7QUFDQSxhQUFBLGNBQUEsS0FBQSxRQUFBO0FBQ0EsZUFBQSxLQUFBLFNBQUEsRUFBQSxlQUFBOztBQUdBLGFBQUE7O0FBR0EsWUFBQSxVQUFBLFlBQUEsbUJBQUEsUUFBQTtBQUNBLGVBQUEsV0FBQTtBQUNBLFVBQUEsQ0FBQTtBQUFBLG9CQUFBLFFBQUEsR0FBQSxLQUFBO0FBQ0EsYUFBQSxLQUFBOztBQUdBLFlBQUEsVUFBQSxlQUFBLHNCQUFBLFFBQUE7QUFDQSxlQUFBLFdBQUE7QUFDQSxVQUFBLENBQUE7QUFBQSxvQkFBQSxRQUFBLEdBQUEsS0FBQTtBQUNBLGFBQUEsS0FBQSxVQUFBLEtBQUEsU0FBQSxNQUFBOztBQUdBLFlBQUEsVUFBQSxlQUFBLHNCQUFBLFFBQUE7QUFDQSxlQUFBLFdBQUE7QUFDQSxVQUFBLENBQUE7QUFBQSxvQkFBQSxRQUFBLEdBQUEsS0FBQTtBQUNBLGFBQUEsS0FBQSxXQUFBLElBQUEsS0FBQSxTQUFBOztBQUdBLFlBQUEsVUFBQSxlQUFBLHNCQUFBLFFBQUE7QUFDQSxlQUFBLFdBQUE7QUFDQSxVQUFBLENBQUE7QUFBQSxvQkFBQSxRQUFBLEdBQUEsS0FBQTtBQUVBLGFBQUEsTUFBQSxVQUNBLEtBQUEsU0FBQSxNQUFBLElBQ0EsS0FBQSxTQUFBLE1BQUEsTUFDQSxLQUFBLFNBQUEsS0FBQTs7QUFHQSxZQUFBLFVBQUEsZUFBQSxzQkFBQSxRQUFBO0FBQ0EsZUFBQSxXQUFBO0FBQ0EsVUFBQSxDQUFBO0FBQUEsb0JBQUEsUUFBQSxHQUFBLEtBQUE7QUFFQSxhQUFBLEtBQUEsVUFBQSxXQUNBLE1BQUEsU0FBQSxNQUFBLEtBQ0EsS0FBQSxTQUFBLE1BQUEsSUFDQSxLQUFBLFNBQUE7O0FBR0EsWUFBQSxVQUFBLFlBQUEsbUJBQUEsUUFBQSxhQUFBO0FBQ0EsZUFBQSxXQUFBO0FBQ0Esb0JBQUEsZ0JBQUE7QUFDQSxVQUFBLENBQUE7QUFBQSxvQkFBQSxRQUFBLGFBQUEsS0FBQTtBQUVBLFVBQUEsTUFBQSxLQUFBO0FBQ0EsVUFBQSxNQUFBO0FBQ0EsVUFBQSxJQUFBO0FBQ0EsYUFBQSxFQUFBLElBQUEsZUFBQSxRQUFBO0FBQ0EsZUFBQSxLQUFBLFNBQUEsS0FBQTs7QUFFQSxhQUFBO0FBRUEsVUFBQSxPQUFBO0FBQUEsZUFBQSxLQUFBLElBQUEsR0FBQSxJQUFBO0FBRUEsYUFBQTs7QUFHQSxZQUFBLFVBQUEsWUFBQSxtQkFBQSxRQUFBLGFBQUE7QUFDQSxlQUFBLFdBQUE7QUFDQSxvQkFBQSxnQkFBQTtBQUNBLFVBQUEsQ0FBQTtBQUFBLG9CQUFBLFFBQUEsYUFBQSxLQUFBO0FBRUEsVUFBQSxJQUFBO0FBQ0EsVUFBQSxNQUFBO0FBQ0EsVUFBQSxNQUFBLEtBQUEsU0FBQSxFQUFBO0FBQ0EsYUFBQSxJQUFBLEtBQUEsUUFBQTtBQUNBLGVBQUEsS0FBQSxTQUFBLEVBQUEsS0FBQTs7QUFFQSxhQUFBO0FBRUEsVUFBQSxPQUFBO0FBQUEsZUFBQSxLQUFBLElBQUEsR0FBQSxJQUFBO0FBRUEsYUFBQTs7QUFHQSxZQUFBLFVBQUEsV0FBQSxrQkFBQSxRQUFBO0FBQ0EsZUFBQSxXQUFBO0FBQ0EsVUFBQSxDQUFBO0FBQUEsb0JBQUEsUUFBQSxHQUFBLEtBQUE7QUFDQSxVQUFBLENBQUEsTUFBQSxVQUFBO0FBQUEsZUFBQSxLQUFBO0FBQ0EsYUFBQSxPQUFBLEtBQUEsVUFBQSxLQUFBOztBQUdBLFlBQUEsVUFBQSxjQUFBLHFCQUFBLFFBQUE7QUFDQSxlQUFBLFdBQUE7QUFDQSxVQUFBLENBQUE7QUFBQSxvQkFBQSxRQUFBLEdBQUEsS0FBQTtBQUNBLFVBQUEsTUFBQSxLQUFBLFVBQUEsS0FBQSxTQUFBLE1BQUE7QUFDQSxhQUFBLE1BQUEsUUFBQSxNQUFBLGFBQUE7O0FBR0EsWUFBQSxVQUFBLGNBQUEscUJBQUEsUUFBQTtBQUNBLGVBQUEsV0FBQTtBQUNBLFVBQUEsQ0FBQTtBQUFBLG9CQUFBLFFBQUEsR0FBQSxLQUFBO0FBQ0EsVUFBQSxNQUFBLEtBQUEsU0FBQSxLQUFBLEtBQUEsV0FBQTtBQUNBLGFBQUEsTUFBQSxRQUFBLE1BQUEsYUFBQTs7QUFHQSxZQUFBLFVBQUEsY0FBQSxxQkFBQSxRQUFBO0FBQ0EsZUFBQSxXQUFBO0FBQ0EsVUFBQSxDQUFBO0FBQUEsb0JBQUEsUUFBQSxHQUFBLEtBQUE7QUFFQSxhQUFBLEtBQUEsVUFDQSxLQUFBLFNBQUEsTUFBQSxJQUNBLEtBQUEsU0FBQSxNQUFBLEtBQ0EsS0FBQSxTQUFBLE1BQUE7O0FBR0EsWUFBQSxVQUFBLGNBQUEscUJBQUEsUUFBQTtBQUNBLGVBQUEsV0FBQTtBQUNBLFVBQUEsQ0FBQTtBQUFBLG9CQUFBLFFBQUEsR0FBQSxLQUFBO0FBRUEsYUFBQSxLQUFBLFdBQUEsS0FDQSxLQUFBLFNBQUEsTUFBQSxLQUNBLEtBQUEsU0FBQSxNQUFBLElBQ0EsS0FBQSxTQUFBOztBQUdBLFlBQUEsVUFBQSxjQUFBLHFCQUFBLFFBQUE7QUFDQSxlQUFBLFdBQUE7QUFDQSxVQUFBLENBQUE7QUFBQSxvQkFBQSxRQUFBLEdBQUEsS0FBQTtBQUNBLGFBQUEsUUFBQSxLQUFBLE1BQUEsUUFBQSxNQUFBLElBQUE7O0FBR0EsWUFBQSxVQUFBLGNBQUEscUJBQUEsUUFBQTtBQUNBLGVBQUEsV0FBQTtBQUNBLFVBQUEsQ0FBQTtBQUFBLG9CQUFBLFFBQUEsR0FBQSxLQUFBO0FBQ0EsYUFBQSxRQUFBLEtBQUEsTUFBQSxRQUFBLE9BQUEsSUFBQTs7QUFHQSxZQUFBLFVBQUEsZUFBQSxzQkFBQSxRQUFBO0FBQ0EsZUFBQSxXQUFBO0FBQ0EsVUFBQSxDQUFBO0FBQUEsb0JBQUEsUUFBQSxHQUFBLEtBQUE7QUFDQSxhQUFBLFFBQUEsS0FBQSxNQUFBLFFBQUEsTUFBQSxJQUFBOztBQUdBLFlBQUEsVUFBQSxlQUFBLHNCQUFBLFFBQUE7QUFDQSxlQUFBLFdBQUE7QUFDQSxVQUFBLENBQUE7QUFBQSxvQkFBQSxRQUFBLEdBQUEsS0FBQTtBQUNBLGFBQUEsUUFBQSxLQUFBLE1BQUEsUUFBQSxPQUFBLElBQUE7O0FBR0Esc0JBQUEsS0FBQSxPQUFBLFFBQUEsS0FBQSxLQUFBO0FBQ0EsVUFBQSxDQUFBLFFBQUEsU0FBQTtBQUFBLGNBQUEsSUFBQSxVQUFBO0FBQ0EsVUFBQSxRQUFBLE9BQUEsUUFBQTtBQUFBLGNBQUEsSUFBQSxXQUFBO0FBQ0EsVUFBQSxTQUFBLE1BQUEsSUFBQTtBQUFBLGNBQUEsSUFBQSxXQUFBOztBQUdBLFlBQUEsVUFBQSxjQUFBLHFCQUFBLE9BQUEsUUFBQSxhQUFBO0FBQ0EsY0FBQSxDQUFBO0FBQ0EsZUFBQSxXQUFBO0FBQ0Esb0JBQUEsZ0JBQUE7QUFDQSxVQUFBLENBQUE7QUFDQSxZQUFBLFdBQUEsS0FBQSxJQUFBLEdBQUEsSUFBQSxlQUFBO0FBQ0EsaUJBQUEsTUFBQSxPQUFBLFFBQUEsYUFBQSxVQUFBOztBQUdBLFVBQUEsTUFBQTtBQUNBLFVBQUEsSUFBQTtBQUNBLFdBQUEsVUFBQSxRQUFBO0FBQ0EsYUFBQSxFQUFBLElBQUEsZUFBQSxRQUFBO0FBQ0EsYUFBQSxTQUFBLEtBQUEsUUFBQSxNQUFBOztBQUdBLGFBQUEsU0FBQTs7QUFHQSxZQUFBLFVBQUEsY0FBQSxxQkFBQSxPQUFBLFFBQUEsYUFBQTtBQUNBLGNBQUEsQ0FBQTtBQUNBLGVBQUEsV0FBQTtBQUNBLG9CQUFBLGdCQUFBO0FBQ0EsVUFBQSxDQUFBO0FBQ0EsWUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLElBQUEsZUFBQTtBQUNBLGlCQUFBLE1BQUEsT0FBQSxRQUFBLGFBQUEsVUFBQTs7QUFHQSxVQUFBLElBQUEsY0FBQTtBQUNBLFVBQUEsTUFBQTtBQUNBLFdBQUEsU0FBQSxLQUFBLFFBQUE7QUFDQSxhQUFBLEVBQUEsS0FBQSxLQUFBLFFBQUE7QUFDQSxhQUFBLFNBQUEsS0FBQSxRQUFBLE1BQUE7O0FBR0EsYUFBQSxTQUFBOztBQUdBLFlBQUEsVUFBQSxhQUFBLG9CQUFBLE9BQUEsUUFBQTtBQUNBLGNBQUEsQ0FBQTtBQUNBLGVBQUEsV0FBQTtBQUNBLFVBQUEsQ0FBQTtBQUFBLGlCQUFBLE1BQUEsT0FBQSxRQUFBLEdBQUEsS0FBQTtBQUNBLFdBQUEsVUFBQSxRQUFBO0FBQ0EsYUFBQSxTQUFBOztBQUdBLFlBQUEsVUFBQSxnQkFBQSx1QkFBQSxPQUFBLFFBQUE7QUFDQSxjQUFBLENBQUE7QUFDQSxlQUFBLFdBQUE7QUFDQSxVQUFBLENBQUE7QUFBQSxpQkFBQSxNQUFBLE9BQUEsUUFBQSxHQUFBLE9BQUE7QUFDQSxXQUFBLFVBQUEsUUFBQTtBQUNBLFdBQUEsU0FBQSxLQUFBLFVBQUE7QUFDQSxhQUFBLFNBQUE7O0FBR0EsWUFBQSxVQUFBLGdCQUFBLHVCQUFBLE9BQUEsUUFBQTtBQUNBLGNBQUEsQ0FBQTtBQUNBLGVBQUEsV0FBQTtBQUNBLFVBQUEsQ0FBQTtBQUFBLGlCQUFBLE1BQUEsT0FBQSxRQUFBLEdBQUEsT0FBQTtBQUNBLFdBQUEsVUFBQSxVQUFBO0FBQ0EsV0FBQSxTQUFBLEtBQUEsUUFBQTtBQUNBLGFBQUEsU0FBQTs7QUFHQSxZQUFBLFVBQUEsZ0JBQUEsdUJBQUEsT0FBQSxRQUFBO0FBQ0EsY0FBQSxDQUFBO0FBQ0EsZUFBQSxXQUFBO0FBQ0EsVUFBQSxDQUFBO0FBQUEsaUJBQUEsTUFBQSxPQUFBLFFBQUEsR0FBQSxZQUFBO0FBQ0EsV0FBQSxTQUFBLEtBQUEsVUFBQTtBQUNBLFdBQUEsU0FBQSxLQUFBLFVBQUE7QUFDQSxXQUFBLFNBQUEsS0FBQSxVQUFBO0FBQ0EsV0FBQSxVQUFBLFFBQUE7QUFDQSxhQUFBLFNBQUE7O0FBR0EsWUFBQSxVQUFBLGdCQUFBLHVCQUFBLE9BQUEsUUFBQTtBQUNBLGNBQUEsQ0FBQTtBQUNBLGVBQUEsV0FBQTtBQUNBLFVBQUEsQ0FBQTtBQUFBLGlCQUFBLE1BQUEsT0FBQSxRQUFBLEdBQUEsWUFBQTtBQUNBLFdBQUEsVUFBQSxVQUFBO0FBQ0EsV0FBQSxTQUFBLEtBQUEsVUFBQTtBQUNBLFdBQUEsU0FBQSxLQUFBLFVBQUE7QUFDQSxXQUFBLFNBQUEsS0FBQSxRQUFBO0FBQ0EsYUFBQSxTQUFBOztBQUdBLFlBQUEsVUFBQSxhQUFBLG9CQUFBLE9BQUEsUUFBQSxhQUFBO0FBQ0EsY0FBQSxDQUFBO0FBQ0EsZUFBQSxXQUFBO0FBQ0EsVUFBQSxDQUFBO0FBQ0EsWUFBQSxRQUFBLEtBQUEsSUFBQSxHQUFBLElBQUEsY0FBQTtBQUVBLGlCQUFBLE1BQUEsT0FBQSxRQUFBLGFBQUEsUUFBQSxHQUFBLENBQUE7O0FBR0EsVUFBQSxJQUFBO0FBQ0EsVUFBQSxNQUFBO0FBQ0EsVUFBQSxNQUFBO0FBQ0EsV0FBQSxVQUFBLFFBQUE7QUFDQSxhQUFBLEVBQUEsSUFBQSxlQUFBLFFBQUE7QUFDQSxZQUFBLFFBQUEsS0FBQSxRQUFBLEtBQUEsS0FBQSxTQUFBLElBQUEsT0FBQTtBQUNBLGdCQUFBOztBQUVBLGFBQUEsU0FBQSxLQUFBLFNBQUEsT0FBQSxLQUFBLE1BQUE7O0FBR0EsYUFBQSxTQUFBOztBQUdBLFlBQUEsVUFBQSxhQUFBLG9CQUFBLE9BQUEsUUFBQSxhQUFBO0FBQ0EsY0FBQSxDQUFBO0FBQ0EsZUFBQSxXQUFBO0FBQ0EsVUFBQSxDQUFBO0FBQ0EsWUFBQSxRQUFBLEtBQUEsSUFBQSxHQUFBLElBQUEsY0FBQTtBQUVBLGlCQUFBLE1BQUEsT0FBQSxRQUFBLGFBQUEsUUFBQSxHQUFBLENBQUE7O0FBR0EsVUFBQSxJQUFBLGNBQUE7QUFDQSxVQUFBLE1BQUE7QUFDQSxVQUFBLE1BQUE7QUFDQSxXQUFBLFNBQUEsS0FBQSxRQUFBO0FBQ0EsYUFBQSxFQUFBLEtBQUEsS0FBQSxRQUFBO0FBQ0EsWUFBQSxRQUFBLEtBQUEsUUFBQSxLQUFBLEtBQUEsU0FBQSxJQUFBLE9BQUE7QUFDQSxnQkFBQTs7QUFFQSxhQUFBLFNBQUEsS0FBQSxTQUFBLE9BQUEsS0FBQSxNQUFBOztBQUdBLGFBQUEsU0FBQTs7QUFHQSxZQUFBLFVBQUEsWUFBQSxtQkFBQSxPQUFBLFFBQUE7QUFDQSxjQUFBLENBQUE7QUFDQSxlQUFBLFdBQUE7QUFDQSxVQUFBLENBQUE7QUFBQSxpQkFBQSxNQUFBLE9BQUEsUUFBQSxHQUFBLEtBQUE7QUFDQSxVQUFBLFFBQUE7QUFBQSxnQkFBQSxNQUFBLFFBQUE7QUFDQSxXQUFBLFVBQUEsUUFBQTtBQUNBLGFBQUEsU0FBQTs7QUFHQSxZQUFBLFVBQUEsZUFBQSxzQkFBQSxPQUFBLFFBQUE7QUFDQSxjQUFBLENBQUE7QUFDQSxlQUFBLFdBQUE7QUFDQSxVQUFBLENBQUE7QUFBQSxpQkFBQSxNQUFBLE9BQUEsUUFBQSxHQUFBLE9BQUE7QUFDQSxXQUFBLFVBQUEsUUFBQTtBQUNBLFdBQUEsU0FBQSxLQUFBLFVBQUE7QUFDQSxhQUFBLFNBQUE7O0FBR0EsWUFBQSxVQUFBLGVBQUEsc0JBQUEsT0FBQSxRQUFBO0FBQ0EsY0FBQSxDQUFBO0FBQ0EsZUFBQSxXQUFBO0FBQ0EsVUFBQSxDQUFBO0FBQUEsaUJBQUEsTUFBQSxPQUFBLFFBQUEsR0FBQSxPQUFBO0FBQ0EsV0FBQSxVQUFBLFVBQUE7QUFDQSxXQUFBLFNBQUEsS0FBQSxRQUFBO0FBQ0EsYUFBQSxTQUFBOztBQUdBLFlBQUEsVUFBQSxlQUFBLHNCQUFBLE9BQUEsUUFBQTtBQUNBLGNBQUEsQ0FBQTtBQUNBLGVBQUEsV0FBQTtBQUNBLFVBQUEsQ0FBQTtBQUFBLGlCQUFBLE1BQUEsT0FBQSxRQUFBLEdBQUEsWUFBQTtBQUNBLFdBQUEsVUFBQSxRQUFBO0FBQ0EsV0FBQSxTQUFBLEtBQUEsVUFBQTtBQUNBLFdBQUEsU0FBQSxLQUFBLFVBQUE7QUFDQSxXQUFBLFNBQUEsS0FBQSxVQUFBO0FBQ0EsYUFBQSxTQUFBOztBQUdBLFlBQUEsVUFBQSxlQUFBLHNCQUFBLE9BQUEsUUFBQTtBQUNBLGNBQUEsQ0FBQTtBQUNBLGVBQUEsV0FBQTtBQUNBLFVBQUEsQ0FBQTtBQUFBLGlCQUFBLE1BQUEsT0FBQSxRQUFBLEdBQUEsWUFBQTtBQUNBLFVBQUEsUUFBQTtBQUFBLGdCQUFBLGFBQUEsUUFBQTtBQUNBLFdBQUEsVUFBQSxVQUFBO0FBQ0EsV0FBQSxTQUFBLEtBQUEsVUFBQTtBQUNBLFdBQUEsU0FBQSxLQUFBLFVBQUE7QUFDQSxXQUFBLFNBQUEsS0FBQSxRQUFBO0FBQ0EsYUFBQSxTQUFBOztBQUdBLDBCQUFBLEtBQUEsT0FBQSxRQUFBLEtBQUEsS0FBQTtBQUNBLFVBQUEsU0FBQSxNQUFBLElBQUE7QUFBQSxjQUFBLElBQUEsV0FBQTtBQUNBLFVBQUEsU0FBQTtBQUFBLGNBQUEsSUFBQSxXQUFBOztBQUdBLHdCQUFBLEtBQUEsT0FBQSxRQUFBLGNBQUE7QUFDQSxjQUFBLENBQUE7QUFDQSxlQUFBLFdBQUE7QUFDQSxVQUFBLENBQUE7QUFDQSxxQkFBQSxLQUFBLE9BQUEsUUFBQSxHQUFBLHNCQUFBOztBQUVBLGNBQUEsTUFBQSxLQUFBLE9BQUEsUUFBQSxjQUFBLElBQUE7QUFDQSxhQUFBLFNBQUE7O0FBR0EsWUFBQSxVQUFBLGVBQUEsc0JBQUEsT0FBQSxRQUFBO0FBQ0EsYUFBQSxXQUFBLE1BQUEsT0FBQSxRQUFBLE1BQUE7O0FBR0EsWUFBQSxVQUFBLGVBQUEsc0JBQUEsT0FBQSxRQUFBO0FBQ0EsYUFBQSxXQUFBLE1BQUEsT0FBQSxRQUFBLE9BQUE7O0FBR0EseUJBQUEsS0FBQSxPQUFBLFFBQUEsY0FBQTtBQUNBLGNBQUEsQ0FBQTtBQUNBLGVBQUEsV0FBQTtBQUNBLFVBQUEsQ0FBQTtBQUNBLHFCQUFBLEtBQUEsT0FBQSxRQUFBLEdBQUEsdUJBQUE7O0FBRUEsY0FBQSxNQUFBLEtBQUEsT0FBQSxRQUFBLGNBQUEsSUFBQTtBQUNBLGFBQUEsU0FBQTs7QUFHQSxZQUFBLFVBQUEsZ0JBQUEsdUJBQUEsT0FBQSxRQUFBO0FBQ0EsYUFBQSxZQUFBLE1BQUEsT0FBQSxRQUFBLE1BQUE7O0FBR0EsWUFBQSxVQUFBLGdCQUFBLHVCQUFBLE9BQUEsUUFBQTtBQUNBLGFBQUEsWUFBQSxNQUFBLE9BQUEsUUFBQSxPQUFBOztBQUlBLFlBQUEsVUFBQSxPQUFBLGNBQUEsUUFBQSxhQUFBLE9BQUE7QUFDQSxVQUFBLENBQUEsUUFBQSxTQUFBO0FBQUEsY0FBQSxJQUFBLFVBQUE7QUFDQSxVQUFBLENBQUE7QUFBQSxnQkFBQTtBQUNBLFVBQUEsQ0FBQSxPQUFBLFFBQUE7QUFBQSxjQUFBLEtBQUE7QUFDQSxVQUFBLGVBQUEsT0FBQTtBQUFBLHNCQUFBLE9BQUE7QUFDQSxVQUFBLENBQUE7QUFBQSxzQkFBQTtBQUNBLFVBQUEsTUFBQSxLQUFBLE1BQUE7QUFBQSxjQUFBO0FBR0EsVUFBQSxRQUFBO0FBQUEsZUFBQTtBQUNBLFVBQUEsT0FBQSxXQUFBLEtBQUEsS0FBQSxXQUFBO0FBQUEsZUFBQTtBQUdBLFVBQUEsY0FBQTtBQUNBLGNBQUEsSUFBQSxXQUFBOztBQUVBLFVBQUEsUUFBQSxLQUFBLFNBQUEsS0FBQTtBQUFBLGNBQUEsSUFBQSxXQUFBO0FBQ0EsVUFBQSxNQUFBO0FBQUEsY0FBQSxJQUFBLFdBQUE7QUFHQSxVQUFBLE1BQUEsS0FBQTtBQUFBLGNBQUEsS0FBQTtBQUNBLFVBQUEsT0FBQSxTQUFBLGNBQUEsTUFBQTtBQUNBLGNBQUEsT0FBQSxTQUFBLGNBQUE7O0FBR0EsVUFBQSxNQUFBLE1BQUE7QUFFQSxVQUFBLFNBQUEsVUFBQSxPQUFBLFdBQUEsVUFBQSxlQUFBO0FBRUEsYUFBQSxXQUFBLGFBQUEsT0FBQTtpQkFDQSxTQUFBLFVBQUEsUUFBQSxlQUFBLGNBQUE7QUFFQSxpQkFBQSxJQUFBLE1BQUEsR0FBQSxLQUFBLEdBQUEsRUFBQTtBQUNBLGlCQUFBLElBQUEsZUFBQSxLQUFBLElBQUE7OztBQUdBLG1CQUFBLFVBQUEsSUFBQSxLQUNBLFFBQ0EsS0FBQSxTQUFBLE9BQUEsTUFDQTs7QUFJQSxhQUFBOztBQU9BLFlBQUEsVUFBQSxPQUFBLGNBQUEsS0FBQSxPQUFBLEtBQUE7QUFFQSxVQUFBLE9BQUEsUUFBQTtBQUNBLFlBQUEsT0FBQSxVQUFBO0FBQ0EscUJBQUE7QUFDQSxrQkFBQTtBQUNBLGdCQUFBLEtBQUE7bUJBQ0EsT0FBQSxRQUFBO0FBQ0EscUJBQUE7QUFDQSxnQkFBQSxLQUFBOztBQUVBLFlBQUEsYUFBQSxVQUFBLE9BQUEsYUFBQTtBQUNBLGdCQUFBLElBQUEsVUFBQTs7QUFFQSxZQUFBLE9BQUEsYUFBQSxZQUFBLENBQUEsUUFBQSxXQUFBO0FBQ0EsZ0JBQUEsSUFBQSxVQUFBLHVCQUFBOztBQUVBLFlBQUEsSUFBQSxXQUFBO0FBQ0EsY0FBQSxPQUFBLElBQUEsV0FBQTtBQUNBLGNBQUEsYUFBQSxVQUFBLE9BQUEsT0FDQSxhQUFBO0FBRUEsa0JBQUE7OztpQkFHQSxPQUFBLFFBQUE7QUFDQSxjQUFBLE1BQUE7O0FBSUEsVUFBQSxRQUFBLEtBQUEsS0FBQSxTQUFBLFNBQUEsS0FBQSxTQUFBO0FBQ0EsY0FBQSxJQUFBLFdBQUE7O0FBR0EsVUFBQSxPQUFBO0FBQ0EsZUFBQTs7QUFHQSxjQUFBLFVBQUE7QUFDQSxZQUFBLFFBQUEsU0FBQSxLQUFBLFNBQUEsUUFBQTtBQUVBLFVBQUEsQ0FBQTtBQUFBLGNBQUE7QUFFQSxVQUFBO0FBQ0EsVUFBQSxPQUFBLFFBQUE7QUFDQSxhQUFBLElBQUEsT0FBQSxJQUFBLEtBQUEsRUFBQTtBQUNBLGVBQUEsS0FBQTs7O0FBR0EsWUFBQSxRQUFBLFFBQUEsU0FBQSxPQUNBLE1BQ0EsUUFBQSxLQUFBLEtBQUE7QUFDQSxZQUFBLE1BQUEsTUFBQTtBQUNBLFlBQUEsUUFBQTtBQUNBLGdCQUFBLElBQUEsVUFBQSxnQkFBQSxNQUNBOztBQUVBLGFBQUEsSUFBQSxHQUFBLElBQUEsTUFBQSxPQUFBLEVBQUE7QUFDQSxlQUFBLElBQUEsU0FBQSxNQUFBLElBQUE7OztBQUlBLGFBQUE7O0FBTUEsUUFBQSxvQkFBQTtBQUVBLHlCQUFBO0FBRUEsWUFBQSxJQUFBLE1BQUEsS0FBQTtBQUVBLFlBQUEsSUFBQSxPQUFBLFFBQUEsbUJBQUE7QUFFQSxVQUFBLElBQUEsU0FBQTtBQUFBLGVBQUE7QUFFQSxhQUFBLElBQUEsU0FBQSxNQUFBO0FBQ0EsY0FBQSxNQUFBOztBQUVBLGFBQUE7O0FBR0EsbUJBQUE7QUFDQSxVQUFBLElBQUE7QUFBQSxlQUFBLE1BQUEsRUFBQSxTQUFBO0FBQ0EsYUFBQSxFQUFBLFNBQUE7O0FBR0EseUJBQUEsUUFBQTtBQUNBLGNBQUEsU0FBQTtBQUNBLFVBQUE7QUFDQSxVQUFBLFNBQUEsT0FBQTtBQUNBLFVBQUEsZ0JBQUE7QUFDQSxVQUFBLFFBQUE7QUFFQSxlQUFBLElBQUEsR0FBQSxJQUFBLFFBQUEsRUFBQTtBQUNBLG9CQUFBLE9BQUEsV0FBQTtBQUdBLFlBQUEsWUFBQSxTQUFBLFlBQUE7QUFFQSxjQUFBLENBQUE7QUFFQSxnQkFBQSxZQUFBO0FBRUEsa0JBQUEsVUFBQSxLQUFBO0FBQUEsc0JBQUEsS0FBQSxLQUFBLEtBQUE7QUFDQTt1QkFDQSxJQUFBLE1BQUE7QUFFQSxrQkFBQSxVQUFBLEtBQUE7QUFBQSxzQkFBQSxLQUFBLEtBQUEsS0FBQTtBQUNBOztBQUlBLDRCQUFBO0FBRUE7O0FBSUEsY0FBQSxZQUFBO0FBQ0EsZ0JBQUEsVUFBQSxLQUFBO0FBQUEsb0JBQUEsS0FBQSxLQUFBLEtBQUE7QUFDQSw0QkFBQTtBQUNBOztBQUlBLHNCQUFBLGlCQUFBLFNBQUEsS0FBQSxZQUFBLFNBQUE7bUJBQ0E7QUFFQSxjQUFBLFVBQUEsS0FBQTtBQUFBLGtCQUFBLEtBQUEsS0FBQSxLQUFBOztBQUdBLHdCQUFBO0FBR0EsWUFBQSxZQUFBO0FBQ0EsY0FBQSxVQUFBLEtBQUE7QUFBQTtBQUNBLGdCQUFBLEtBQUE7bUJBQ0EsWUFBQTtBQUNBLGNBQUEsVUFBQSxLQUFBO0FBQUE7QUFDQSxnQkFBQSxLQUNBLGFBQUEsSUFBQSxLQUNBLFlBQUEsS0FBQTttQkFFQSxZQUFBO0FBQ0EsY0FBQSxVQUFBLEtBQUE7QUFBQTtBQUNBLGdCQUFBLEtBQ0EsYUFBQSxLQUFBLEtBQ0EsYUFBQSxJQUFBLEtBQUEsS0FDQSxZQUFBLEtBQUE7bUJBRUEsWUFBQTtBQUNBLGNBQUEsVUFBQSxLQUFBO0FBQUE7QUFDQSxnQkFBQSxLQUNBLGFBQUEsS0FBQSxLQUNBLGFBQUEsS0FBQSxLQUFBLEtBQ0EsYUFBQSxJQUFBLEtBQUEsS0FDQSxZQUFBLEtBQUE7O0FBR0EsZ0JBQUEsSUFBQSxNQUFBOzs7QUFJQSxhQUFBOztBQUdBLDBCQUFBO0FBQ0EsVUFBQSxZQUFBO0FBQ0EsZUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLFFBQUEsRUFBQTtBQUVBLGtCQUFBLEtBQUEsSUFBQSxXQUFBLEtBQUE7O0FBRUEsYUFBQTs7QUFHQSw0QkFBQSxLQUFBO0FBQ0EsVUFBQSxHQUFBLElBQUE7QUFDQSxVQUFBLFlBQUE7QUFDQSxlQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsUUFBQSxFQUFBO0FBQ0EsWUFBQSxVQUFBLEtBQUE7QUFBQTtBQUVBLFlBQUEsSUFBQSxXQUFBO0FBQ0EsYUFBQSxLQUFBO0FBQ0EsYUFBQSxJQUFBO0FBQ0Esa0JBQUEsS0FBQTtBQUNBLGtCQUFBLEtBQUE7O0FBR0EsYUFBQTs7QUFHQSwyQkFBQTtBQUNBLGFBQUEsT0FBQSxZQUFBLFlBQUE7O0FBR0Esd0JBQUEsS0FBQSxLQUFBLFFBQUE7QUFDQSxlQUFBLElBQUEsR0FBQSxJQUFBLFFBQUEsRUFBQTtBQUNBLFlBQUEsSUFBQSxVQUFBLElBQUEsVUFBQSxLQUFBLElBQUE7QUFBQTtBQUNBLFlBQUEsSUFBQSxVQUFBLElBQUE7O0FBRUEsYUFBQTs7QUFNQSx3QkFBQSxLQUFBO0FBQ0EsYUFBQSxlQUFBLFFBQ0EsT0FBQSxRQUFBLElBQUEsZUFBQSxRQUFBLElBQUEsWUFBQSxRQUFBLFFBQ0EsSUFBQSxZQUFBLFNBQUEsS0FBQTs7QUFFQSx5QkFBQTtBQUVBLGFBQUEsUUFBQTs7Ozs7QUMvdURBO0FBTUEsV0FBQSxVQUFBO0FBVUEsNkJBQUE7QUFDQSxVQUFBLENBQUEsV0FBQSxLQUFBO0FBQ0EsY0FBQSxJQUFBLFVBQ0E7O0FBS0EsWUFBQSxJQUFBLFFBQUEsVUFBQTtBQUdBLFVBQUEsYUFBQSxJQUFBLFFBQUE7QUFDQSxVQUFBLEFBQUEsZUFBQSxNQUFBLGNBQUE7QUFDQSxjQUFBLElBQUEsVUFBQTs7QUFJQSxVQUFBLE9BQUEsSUFBQSxVQUFBLEdBQUEsWUFBQSxNQUFBO0FBRUEsVUFBQSxPQUFBLEtBQUEsTUFBQTtBQUNBLFVBQUEsV0FBQTtBQUNBLFVBQUEsU0FBQTtBQUNBLFVBQUEsVUFBQTtBQUNBLGVBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxRQUFBO0FBQ0EsWUFBQSxBQUFBLEtBQUEsTUFBQTtBQUNBLG1CQUFBOztBQUVBLHNCQUFBLE1BQUEsS0FBQTtBQUNBLGNBQUEsQUFBQSxLQUFBLEdBQUEsUUFBQSxlQUFBO0FBQ0Esc0JBQUEsS0FBQSxHQUFBLFVBQUE7Ozs7QUFLQSxVQUFBLENBQUEsS0FBQSxNQUFBLENBQUEsUUFBQTtBQUNBLG9CQUFBO0FBQ0Esa0JBQUE7O0FBSUEsVUFBQSxPQUFBLFNBQUEsSUFBQSxVQUFBLGFBQUE7QUFFQSxVQUFBLFdBQUEsU0FBQSxXQUFBO0FBQ0EsVUFBQSxTQUFBLElBQUEsUUFBQSxNQUFBO0FBR0EsYUFBQSxPQUFBO0FBQ0EsYUFBQSxXQUFBO0FBR0EsYUFBQSxVQUFBO0FBRUEsYUFBQTs7OztBQ3BFQTtBQUlBLFFBQUEsSUFBQSxRQUNBLFlBQUEsT0FBQSxXQUFBLGVBQUEsT0FBQSxXQUFBLFVBQUEsT0FBQSxXQUNBLG9CQUFBLFNBQUEsY0FBQSxtQkFDQSxPQUFBLFNBQUEsZ0JBQ0Esa0JBQUEsU0FBQSx1QkFDQSxTQUFBLE9BQUEsRUFBQSxFQUFBLFNBQUE7QUFJQSxRQUFBLFVBQUE7QUFFQSxVQUFBLElBQUEsT0FBQSxLQUFBLEVBQUEsUUFBQSxFQUFBLE1BQUEsS0FBQSxFQUFBLE1BQUEsS0FBQSxFQUFBO0FBQ0EsTUFBQSxtQkFBQTtBQUFBLFFBQUEsUUFBQSxPQUFBLE9BQUE7O0FBQ0EsTUFBQSxRQUFBLE9BQUEsT0FBQTtBQUVBLFdBQUE7O0FBS0EsUUFBQSx3QkFBQSxRQUFBLFVBQUEsSUFBQSxXQUFBO0FBRUEsUUFBQSxZQUFBLE9BQUEsVUFBQTtBQUFBLFdBQUEsc0JBQUEsS0FBQSxRQUFBOztBQUVBLFlBQUEsYUFBQSxNQUFBLHNCQUFBO0FBQ0EsWUFBQSxXQUFBLE1BQUEsc0JBQUE7QUw3QkE7SUttQ0EsWUFBQSxrQkFBQTtBQUVBLFdBQUEsT0FBQSxjQUFBLFdBQUEsV0FD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TUFHQSxRQUFBLE9BQUEsRUFBQSxRQUFBLGFBQUE7TUFFQSxZQUFBLE9BQUEsRUFBQSxPQUFBLE9BQUEsV0FBQSxLQUFBO01BRUEsZUFBQSxHQUFBO0FBRUEsZUFBQSxLQUFBLE9BQUEsTUFBQSxLQUFBLFdBQUEsS0FDQSxLQUFBLFVBQUEsS0FDQSxLQUFBLFVBQUEsS0FBQSxPQUFBLEVBQUEsTUFBQSxLQUFBLE1BQUEsR0FBQSxJQUFBLEtBQUEsTUFBQTs7Ozs7QUNwREEsVUFBQSxPQUFBLFNBQUEsUUFBQSxRQUFBLE1BQUEsTUFBQTtBQUNBLFFBQUEsR0FBQTtBQUNBLFFBQUEsT0FBQSxTQUFBLElBQUEsT0FBQTtBQUNBLFFBQUEsT0FBQSxNQUFBLFFBQUE7QUFDQSxRQUFBLFFBQUEsUUFBQTtBQUNBLFFBQUEsUUFBQTtBQUNBLFFBQUEsSUFBQSxPQUFBLFNBQUEsSUFBQTtBQUNBLFFBQUEsSUFBQSxPQUFBLEtBQUE7QUFDQSxRQUFBLElBQUEsT0FBQSxTQUFBO0FBRUEsU0FBQTtBQUVBLFFBQUEsSUFBQSxNQUFBLENBQUEsU0FBQTtBQUNBLFVBQUEsQ0FBQTtBQUNBLGFBQUE7QUFDQSxXQUFBLFFBQUEsR0FBQSxJQUFBLElBQUEsTUFBQSxPQUFBLFNBQUEsSUFBQSxLQUFBLEdBQUEsU0FBQTs7QUFFQSxRQUFBLElBQUEsTUFBQSxDQUFBLFNBQUE7QUFDQSxVQUFBLENBQUE7QUFDQSxhQUFBO0FBQ0EsV0FBQSxRQUFBLEdBQUEsSUFBQSxJQUFBLE1BQUEsT0FBQSxTQUFBLElBQUEsS0FBQSxHQUFBLFNBQUE7O0FBRUEsUUFBQSxNQUFBO0FBQ0EsVUFBQSxJQUFBO2VBQ0EsTUFBQTtBQUNBLGFBQUEsSUFBQSxNQUFBLEtBQUEsS0FBQSxLQUFBOztBQUVBLFVBQUEsSUFBQSxLQUFBLElBQUEsR0FBQTtBQUNBLFVBQUEsSUFBQTs7QUFFQSxXQUFBLEtBQUEsS0FBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEdBQUEsSUFBQTs7QUFHQSxVQUFBLFFBQUEsU0FBQSxRQUFBLE9BQUEsUUFBQSxNQUFBLE1BQUE7QUFDQSxRQUFBLEdBQUEsR0FBQTtBQUNBLFFBQUEsT0FBQSxTQUFBLElBQUEsT0FBQTtBQUNBLFFBQUEsT0FBQSxNQUFBLFFBQUE7QUFDQSxRQUFBLFFBQUEsUUFBQTtBQUNBLFFBQUEsS0FBQSxTQUFBLEtBQUEsS0FBQSxJQUFBLEdBQUEsT0FBQSxLQUFBLElBQUEsR0FBQSxPQUFBO0FBQ0EsUUFBQSxJQUFBLE9BQUEsSUFBQSxTQUFBO0FBQ0EsUUFBQSxJQUFBLE9BQUEsSUFBQTtBQUNBLFFBQUEsSUFBQSxRQUFBLEtBQUEsVUFBQSxLQUFBLElBQUEsUUFBQSxJQUFBLElBQUE7QUFFQSxZQUFBLEtBQUEsSUFBQTtBQUVBLFFBQUEsTUFBQSxVQUFBLFVBQUE7QUFDQSxVQUFBLE1BQUEsU0FBQSxJQUFBO0FBQ0EsVUFBQTs7QUFFQSxVQUFBLEtBQUEsTUFBQSxLQUFBLElBQUEsU0FBQSxLQUFBO0FBQ0EsVUFBQSxRQUFBLEtBQUEsS0FBQSxJQUFBLEdBQUEsQ0FBQSxNQUFBO0FBQ0E7QUFDQSxhQUFBOztBQUVBLFVBQUEsSUFBQSxTQUFBO0FBQ0EsaUJBQUEsS0FBQTs7QUFFQSxpQkFBQSxLQUFBLEtBQUEsSUFBQSxHQUFBLElBQUE7O0FBRUEsVUFBQSxRQUFBLEtBQUE7QUFDQTtBQUNBLGFBQUE7O0FBR0EsVUFBQSxJQUFBLFNBQUE7QUFDQSxZQUFBO0FBQ0EsWUFBQTtpQkFDQSxJQUFBLFNBQUE7QUFDQSxZQUFBLFNBQUEsSUFBQSxLQUFBLEtBQUEsSUFBQSxHQUFBO0FBQ0EsWUFBQSxJQUFBOztBQUVBLFlBQUEsUUFBQSxLQUFBLElBQUEsR0FBQSxRQUFBLEtBQUEsS0FBQSxJQUFBLEdBQUE7QUFDQSxZQUFBOzs7QUFJQSxXQUFBLFFBQUEsR0FBQSxPQUFBLFNBQUEsS0FBQSxJQUFBLEtBQUEsS0FBQSxHQUFBLEtBQUEsS0FBQSxRQUFBOztBQUVBLFFBQUEsS0FBQSxPQUFBO0FBQ0EsWUFBQTtBQUNBLFdBQUEsT0FBQSxHQUFBLE9BQUEsU0FBQSxLQUFBLElBQUEsS0FBQSxLQUFBLEdBQUEsS0FB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QUEsVUFBQSxXQUFBO0FBQ0EsZUFBQTtBQUVBLFFBQUEsTUFBQSxNQUFBO0FBQ0EsV0FBQTtBQUNBLHFCQUFBO0FBQ0EsY0FBQTtBQUNBLGFBQUEsRUFBQSxhQUFBO0FBQ0EsWUFBQTtBQUNBLHVCQUFBLFlBQUE7OztBQUdBLG1CQUFBO0FBQ0EsWUFBQSxNQUFBOztBQUVBLG1CQUFBO0FBQ0EsZUFBQTtBQUNBLG9CQUFBOztBQUdBLFVBQUEsV0FBQSxTQUFBO0FBQ0EsUUFBQSxPQUFBLElBQUEsTUFBQSxVQUFBLFNBQUE7QUFDQSxRQUFBLFVBQUEsU0FBQTtBQUNBLGVBQUEsSUFBQSxHQUFBLElBQUEsVUFBQSxRQUFBO0FBQ0EsYUFBQSxJQUFBLEtBQUEsVUFBQTs7O0FBR0EsVUFBQSxLQUFBLElBQUEsS0FBQSxLQUFBO0FBQ0EsUUFBQSxNQUFBLFdBQUEsS0FBQSxDQUFBO0FBQ0EsaUJBQUE7OztBQUtBLGdCQUFBLEtBQUE7QUFDQSxTQUFBLE1BQUE7QUFDQSxTQUFBLFFBQUE7O0FBRUEsT0FBQSxVQUFBLE1BQUE7QUFDQSxTQUFBLElBQUEsTUFBQSxNQUFBLEtBQUE7O0FBRUEsVUFBQSxRQUFBO0FBQ0EsVUFBQSxVQUFBO0FBQ0EsVUFBQSxNQUFBO0FBQ0EsVUFBQSxPQUFBO0FBQ0EsVUFBQSxVQUFBO0FBQ0EsVUFBQSxXQUFBO0FBRUE7O0FBRUEsVUFBQSxLQUFBO0FBQ0EsVUFBQSxjQUFBO0FBQ0EsVUFBQSxPQUFBO0FBQ0EsVUFBQSxNQUFBO0FBQ0EsVUFBQSxpQkFBQTtBQUNBLFVBQUEscUJBQUE7QUFDQSxVQUFBLE9BQUE7QUFDQSxVQUFBLGtCQUFBO0FBQ0EsVUFBQSxzQkFBQTtBQUVBLFVBQUEsWUFBQSxTQUFBO0FBQUEsV0FBQTs7QUFFQSxVQUFBLFVBQUEsU0FBQTtBQUNBLFVBQUEsSUFBQSxNQUFBOztBQUdBLFVBQUEsTUFBQTtBQUFBLFdBQUE7O0FBQ0EsVUFBQSxRQUFBLFNBQUE7QUFDQSxVQUFBLElBQUEsTUFBQTs7QUFFQSxVQUFBLFFBQUE7QUFBQSxXQUFBOzs7QUNoTEEsTUFBQSxPQUFBLFNBQUE7QUFDQSxNQUFBLE1BQUEsT0FBQSxVQUFBO0FBQ0EsTUFBQSxlQUFBLE9BQUEsUUFBQTtBQVFBO0FBQ0EsU0FBQSxTQUFBO0FBQ0EsU0FBQSxPQUFBLGVBQUEsSUFBQSxRQUFBLE9BQUEsT0FBQTs7QUFNQSxXQUFBLFlBQUEsNEJBQUEsUUFBQTtBQUNBLFFBQUEsTUFBQSxJQUFBO0FBQ0EsYUFBQSxJQUFBLEdBQUEsTUFBQSxPQUFBLFFBQUEsSUFBQSxLQUFBO0FBQ0EsVUFBQSxJQUFBLE9BQUEsSUFBQTs7QUFFQSxXQUFBOztBQVNBLFdBQUEsVUFBQSxPQUFBO0FBQ0EsV0FBQSxlQUFBLEtBQUEsS0FBQSxPQUFBLE9BQUEsb0JBQUEsS0FBQSxNQUFBOztBQVFBLFdBQUEsVUFBQSxNQUFBLHNCQUFBLE1BQUE7QUFDQSxRQUFBLE9BQUEsZUFBQSxPQUFBLEtBQUEsWUFBQTtBQUNBLFFBQUEsY0FBQSxlQUFBLEtBQUEsSUFBQSxRQUFBLElBQUEsS0FBQSxLQUFBLE1BQUE7QUFDQSxRQUFBLE1BQUEsS0FBQSxPQUFBO0FBQ0EsUUFBQSxDQUFBLGVBQUE7QUFDQSxXQUFBLE9BQUEsS0FBQTs7QUFFQSxRQUFBLENBQUE7QUFDQSxVQUFBO0FBQ0EsYUFBQSxLQUFBLElBQUEsTUFBQTs7QUFFQSxhQUFBLEtBQUEsUUFBQTs7OztBQVVBLFdBQUEsVUFBQSxNQUFBLHNCQUFBO0FBQ0EsUUFBQTtBQUNBLGFBQUEsS0FBQSxLQUFBLElBQUE7O0FBRUEsVUFBQSxPQUFBLEtBQUEsWUFBQTtBQUNBLGFBQUEsSUFBQSxLQUFBLEtBQUEsTUFBQTs7O0FBU0EsV0FBQSxVQUFBLFVBQUEsMEJBQUE7QUFDQSxRQUFBO0FBQ0EsVUFBQSxNQUFBLEtBQUEsS0FBQSxJQUFBO0FBQ0EsVUFBQSxPQUFBO0FBQ0EsZUFBQTs7O0FBR0EsVUFBQSxPQUFBLEtBQUEsWUFBQTtBQUNBLFVBQUEsSUFBQSxLQUFBLEtBQUEsTUFBQTtBQUNBLGVBQUEsS0FBQSxLQUFBOzs7QUFJQSxVQUFBLElBQUEsTUFBQSxNQUFBLE9B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QUFBLElBQUEsS0FBQTs7OztBQXVCQSxVQUFBLFNBQUEsZ0JBQUEsU0FBQSxXQUFBLFVBQUE7QUFDQSxRQUFBLFVBQUEsV0FBQTtBQUNBLGFBQUE7O0FBR0EsUUFBQSxRQUFBLGdCQUFBLElBQUEsVUFBQSxRQUFBLFNBQUEsV0FDQSxVQUFBLFNBQUEsUUFBQTtBQUNBLFFBQUEsUUFBQTtBQUNBLGFBQUE7O0FBTUEsV0FBQSxRQUFBLEtBQUE7QUFDQSxVQUFBLFNBQUEsVUFBQSxRQUFBLFVBQUEsUUFBQSxJQUFBLFVBQUE7QUFDQTs7QUFFQSxRQUFBOztBQUdBLFdBQUE7OztBQ3RHQSxNQUFBLE9BQUEsU0FBQTtBQU1BLGtDQUFBLFVBQUE7QUFFQSxRQUFBLFFBQUEsU0FBQTtBQUNBLFFBQUEsUUFBQSxTQUFBO0FBQ0EsUUFBQSxVQUFBLFNBQUE7QUFDQSxRQUFBLFVBQUEsU0FBQTtBQUNBLFdBQUEsUUFBQSxTQUFBLFNBQUEsU0FBQSxXQUFBLFdBQ0EsS0FBQSxvQ0FBQSxVQUFBLGFBQUE7O0FBUUE7QUFDQSxTQUFBLFNBQUE7QUFDQSxTQUFBLFVBQUE7QUFFQSxTQUFBLFFBQUEsQ0FBQSxlQUFBLElBQUEsaUJBQUE7O0FBU0EsY0FBQSxVQUFBLGtCQUNBLDZCQUFBLFdBQUE7QUFDQSxTQUFBLE9BQUEsUUFBQSxXQUFBOztBQVFBLGNBQUEsVUFBQSxNQUFBLHlCQUFBO0FBQ0EsUUFBQSx1QkFBQSxLQUFBLE9BQUE7QUFDQSxXQUFBLFFBQUE7QUFDQSxXQUFBLE9BQUEsS0FBQTs7QUFFQSxXQUFBLFVBQUE7QUFDQSxXQUFBLE9BQUEsS0FBQTs7O0FBYUEsY0FBQSxVQUFBLFVBQUE7QUFDQSxRQUFBLENBQUEsS0FBQTtBQUNBLFdBQUEsT0FBQSxLQUFBLEtBQUE7QUFDQSxXQUFBLFVBQUE7O0FBRUEsV0FBQSxLQUFBOztBQUdBLFVBQUEsY0FBQTs7QUNuREEsZ0JBQUEsS0FBQSxHQUFBO0FBQ0EsUUFBQSxPQUFBLElBQUE7QUFDQSxRQUFBLEtBQUEsSUFBQTtBQUNBLFFBQUEsS0FBQTs7QUFXQSw0QkFB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QUFBLFdBQUEsSUFBQTtBQUNBLFNBQUEsU0FBQSxJQUFBO0FBQ0EsU0FBQSxZQUFBLElBQUE7QUFDQSxTQUFBLG1CQUFBOztBQUdBLHFCQUFBLFVBQUEsV0FBQTtBQU9BLHFCQUFBLGdCQUNBLDBDQUFBO0FBQ0EsUUFBQSxhQUFBLG1CQUFBO0FBQ0EsUUFBQSxZQUFBLElBQUEsbUJBQUE7TUFDQSxNQUFBLG1CQUFBO01BQ0E7O0FBRUEsdUJBQUEsWUFBQSxTQUFBO0FBQ0EsVUFBQSxhQUFBO1FBQ0EsV0FBQTtVQUNBLE1BQUEsUUFBQTtVQUNBLFFBQUEsUUFBQTs7O0FBSUEsVUFBQSxRQUFBLFVBQUE7QUFDQSxtQkFBQSxTQUFBLFFBQUE7QUFDQSxZQUFBLGNBQUE7QUFDQSxxQkFBQSxTQUFBLEtBQUEsU0FBQSxZQUFBLFdBQUE7O0FBR0EsbUJBQUEsV0FBQTtVQUNBLE1BQUEsUUFBQTtVQUNBLFFBQUEsUUFBQTs7QUFHQSxZQUFBLFFBQUEsUUFBQTtBQUNBLHFCQUFBLE9BQUEsUUFBQTs7O0FBSUEsZ0JBQUEsV0FBQTs7QUFFQSx1QkFBQSxRQUFBLFFBQUEsU0FBQTtBQUNBLFVBQUEsaUJBQUE7QUFDQSxVQUFBLGVBQUE7QUFDQSx5QkFBQSxLQUFBLFNBQUEsWUFBQTs7QUFHQSxVQUFBLENBQUEsVUFBQSxTQUFBLElBQUE7QUFDQSxrQkFBQSxTQUFBLElBQUE7O0FBR0EsVUFBQSxVQUFBLG1CQUFBLGlCQUFBO0FBQ0EsVUFBQSxXQUFBO0FBQ0Esa0JBQUEsaUJBQUEsWUFBQTs7O0FBR0EsV0FBQTs7QUFhQSxxQkFBQSxVQUFBLGFBQ0EsdUNBQUE7QUFDQSxRQUFBLFlBQUEsS0FBQSxPQUFBLE9BQUE7QUFDQSxRQUFBLFdBQUEsS0FBQSxPQUFBLE9BQUEsWUFBQTtBQUNBLFFBQUEsU0FBQSxLQUFBLE9BQUEsT0FBQSxVQUFBO0FBQ0EsUUFBQSxPQUFBLEtBQUEsT0FBQSxPQUFBLFFBQUE7QUFFQSxRQUFBLENBQUEsS0FBQTtBQUNBLFdBQUEsaUJBQUEsV0FBQSxVQUFBLFFBQUE7O0FBR0EsUUFBQSxVQUFBO0FBQ0EsZUFBQSxPQUFBO0FBQ0EsVUFBQSxDQUFBLEtBQUEsU0FBQSxJQUFBO0FBQ0EsYUFBQSxTQUFBLElBQUE7OztBQUlBLFFBQUEsUUFBQTtBQUNBLGFBQUEsT0FBQTtBQUNBLFVBQUEsQ0FBQSxLQUFBLE9BQUEsSUFBQTtBQUNBLGFBQUEsT0FBQSxJQUFBOzs7QUFJQSxTQUFBLFVBQUEsSUFBQTtNQUNBLGVBQUEsVUFBQTtNQUNBLGlCQUFBLFVBQUE7TUFDQSxjQUFBLFlBQUEsUUFBQSxTQUFBO01BQ0EsZ0JBQUEsWUFBQSxRQUFBLFNBQUE7TUFDQTtNQUNBOzs7QUFPQSxxQkFBQSxVQUFBLG1CQUNBLDZDQUFBLGFBQUE7QUFDQSxRQUFBLFNBQUE7QUFDQSxRQUFBLEtBQUEsZUFBQTtBQUNBLGVBQUEsS0FBQSxTQUFBLEtBQUEsYUFBQTs7QUFHQSxRQUFBLGtCQUFBO0FBR0EsVUFBQSxDQUFBLEtBQUE7QUFDQSxhQUFBLG1CQUFBLE9BQUEsT0FBQTs7QUFFQSxXQUFBLGlCQUFBLEtBQUEsWUFBQSxXQUFBO2VBQ0EsS0FBQTtBQUdBLGFBQUEsS0FBQSxpQkFBQSxLQUFBLFlBQUE7QUFDQSxVQUFBLE9BQUEsS0FBQSxLQUFBLGtCQUFBLFdBQUE7QUFDQSxhQUFBLG1CQUFBOzs7O0FBcUJBLHFCQUFBLFVBQUEsaUJBQ0EsMkNBQUEsb0JBQUEsYUFBQTtBQUNBLFFBQUEsYUFBQTtBQUVBLFFBQUEsZUFBQTtBQUNBLFVBQUEsbUJBQUEsUUFBQTtBQUNBLGNBQUEsSUFBQSxNQUNBOztBQUlBLG1CQUFBLG1CQUFBOztBQUVBLFFBQUEsYUFBQSxLQUFBO0FBRUEsUUFBQSxjQUFBO0FBQ0EsbUJBQUEsS0FBQSxTQUFBLFlBQUE7O0FBSUEsUUFBQSxhQUFBLElBQUE7QUFDQSxRQUFBLFdBQUEsSUFBQTtBQUdBLFNBQUEsVUFBQSxnQkFBQSxTQUFBO0FBQ0EsVUFBQSxRQUFBLFdBQUEsY0FBQSxRQUFBLGdCQUFBO0FBRUEsWUFBQSxXQUFBLG1CQUFBLG9CQUFBO1VBQ0EsTUFBQSxRQUFBO1VBQ0EsUUFBQSxRQUFBOztBQUVBLFlBQUEsU0FBQSxVQUFBO0FBRUEsa0JBQUEsU0FBQSxTQUFBO0FBQ0EsY0FBQSxrQkFBQTtBQUNBLG9CQUFBLFNBQUEsS0FBQSxLQUFBLGdCQUFBLFFBQUE7O0FBRUEsY0FBQSxjQUFBO0FBQ0Esb0JBQUEsU0FBQSxLQUFBLFNBQUEsWUFBQSxRQUFBOztBQUVBLGtCQUFBLGVBQUEsU0FBQTtBQUNBLGtCQUFBLGlCQUFBLFNBQUE7QUFDQSxjQUFBLFNBQUEsUUFBQTtBQUNBLG9CQUFBLE9BQUEsU0FBQTs7OztBQUtBLFVBQUEsU0FBQSxRQUFBO0FBQ0EsVUFBQSxVQUFBLFFBQUEsQ0FBQSxXQUFBLElBQUE7QUFDQSxtQkFBQSxJQUFBOztBQUdBLFVBQUEsT0FBQSxRQUFBO0FBQ0EsVUFBQSxRQUFBLFFBQUEsQ0FBQSxTQUFBLElBQUE7QUFDQSxpQkFBQSxJQUFBOztPQUdBO0FBQ0EsU0FBQSxXQUFBO0FBQ0EsU0FBQSxTQUFBO0FBR0EsdUJBQUEsUUFBQSxRQUFBLFNBQUE7QUFDQSxVQUFBLFVBQUEsbUJBQUEsaUJBQUE7QUFDQSxVQUFBLFdBQUE7QUFDQSxZQUFBLGtCQUFBO0FBQ0Esd0JBQUEsS0FBQSxLQUFBLGdCQUFBOztBQUVBLFlBQUEsY0FBQTtBQUNBLHdCQUFBLEtBQUEsU0FBQSxZQUFBOztBQUVBLGFBQUEsaUJBQUEsYUFBQTs7T0FFQTs7QUFjQSxxQkFBQSxVQUFBLG1CQUNBLDRDQUFBLFlBQUEsV0FBQSxTQUNBO0FBS0EsUUFBQSxhQUFBLE9BQUEsVUFBQSxTQUFBLFlBQUEsT0FBQSxVQUFBLFdBQUE7QUFDQSxZQUFBLElBQUEsTUFDQTs7QUFNQSxRQUFBLGNBQUEsVUFBQSxjQUFBLFlBQUEsY0FDQSxXQUFBLE9BQUEsS0FBQSxXQUFBLFVBQUEsS0FDQSxDQUFBLGFBQUEsQ0FBQSxXQUFBLENBQUE7QUFFQTtlQUVBLGNBQUEsVUFBQSxjQUFBLFlBQUEsY0FDQSxhQUFBLFVBQUEsYUFBQSxZQUFBLGFBQ0EsV0FBQSxPQUFBLEtBQUEsV0FBQSxVQUFBLEtBQ0EsVUFB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QTtBQUNBLG9CQUFBLEtBQUE7O0FBRUEsa0JBQUEsS0FBQSxLQUFBLFNBQUE7QUFDQSxXQUFBLFdBQUE7O0FBRUEsV0FBQTs7QUFVQSxhQUFBLFVBQUEsZUFBQSxpQ0FBQSxVQUFBO0FBQ0EsUUFBQSxZQUFBLEtBQUEsU0FBQSxLQUFBLFNBQUEsU0FBQTtBQUNBLFFBQUEsVUFBQTtBQUNBLGdCQUFBLGFBQUEsVUFBQTtlQUVBLE9BQUEsY0FBQTtBQUNBLFdBQUEsU0FBQSxLQUFBLFNBQUEsU0FBQSxLQUFBLFVBQUEsUUFBQSxVQUFBOztBQUdBLFdBQUEsU0FBQSxLQUFBLEdBQUEsUUFBQSxVQUFBOztBQUVBLFdBQUE7O0FBVUEsYUFBQSxVQUFBLG1CQUNBLHFDQUFBLGFBQUE7QUFDQSxTQUFBLGVBQUEsS0FBQSxZQUFBLGdCQUFBOztBQVNBLGFBQUEsVUFBQSxxQkFDQSx1Q0FBQTtBQUNBLGFBQUEsSUFBQSxHQUFBLE1BQUEsS0FBQSxTQUFBLFFBQUEsSUFBQSxLQUFBO0FBQ0EsVUFBQSxLQUFBLFNBQUEsR0FBQTtBQUNBLGFBQUEsU0FBQSxHQUFBLG1CQUFBOzs7QUFJQSxRQUFBLFVBQUEsT0FBQSxLQUFBLEtBQUE7QUFDQSxhQUFBLElBQUEsR0FBQSxNQUFBLFFBQUEsUUFBQSxJQUFBLEtBQUE7QUFDQSxVQUFBLEtBQUEsY0FBQSxRQUFBLEtBQUEsS0FBQSxlQUFBLFFBQUE7OztBQVFBLGFBQUEsVUFBQSxXQUFBO0FBQ0EsUUFBQSxNQUFBO0FBQ0EsU0FBQSxLQUFBLFNBQUE7QUFDQSxhQUFBOztBQUVBLFdBQUE7O0FBT0EsYUFBQSxVQUFBLHdCQUFBLDBDQUFBO0FBQ0EsUUFBQSxZQUFBO01BQ0EsTUFBQTtNQUNBLE1BQUE7TUFDQSxRQUFBOztBQUVBLFFBQUEsTUFBQSxJQUFBLG1CQUFBO0FBQ0EsUUFBQSxzQkFBQTtBQUNBLFFBQUEscUJBQUE7QUFDQSxRQUFBLG1CQUFBO0FBQ0EsUUFBQSxxQkFBQTtBQUNBLFFBQUEsbUJBQUE7QUFDQSxTQUFBLEtBQUEsU0FBQSxPQUFBO0FBQ0EsZ0JBQUEsUUFBQTtBQUNBLFVBQUEsU0FBQSxXQUFBLFFBQ0EsU0FBQSxTQUFBLFFBQ0EsU0FBQSxXQUFBO0FBQ0EsWUFBQSx1QkFBQSxTQUFBLFVBQ0EscUJBQUEsU0FBQSxRQUNBLHVCQUFBLFNBQUEsVUFDQSxxQkFBQSxTQUFBO0FBQ0EsY0FBQSxXQUFBO1lBQ0EsUUFBQSxTQUFBO1lBQ0EsVUFBQTtjQUNBLE1BQUEsU0FBQTtjQUNBLFFBQUEsU0FBQTs7WUFFQSxXQUFBO2NBQ0EsTUFBQSxVQUFBO2NBQ0EsUUFBQSxVQUFBOztZQUVBLE1BQUEsU0FBQTs7O0FBR0EsNkJBQUEsU0FBQTtBQUNBLDJCQUFBLFNBQUE7QUFDQSw2QkFBQSxTQUFBO0FBQ0EsMkJBQUEsU0FBQTtBQUNBLDhCQUFBO2lCQUNBO0FBQ0EsWUFBQSxXQUFBO1VBQ0EsV0FBQTtZQUNBLE1BQUEsVUFBQTtZQUNBLFFBQUEsVUFBQTs7O0FBR0EsNkJBQUE7QUFDQSw4QkFBQTs7QUFFQSxlQUFBLE1BQUEsR0FBQSxTQUFBLE1BQUEsUUFBQSxNQUFBLFFBQUE7QUFDQSxZQUFBLE1BQUEsV0FBQSxTQUFBO0FBQ0Esb0JBQUE7QUFDQSxvQkFBQSxTQUFBO0FBRUEsY0FBQSxNQUFBLE1BQUE7QUFDQSxpQ0FBQTtBQUNBLGtDQUFBO3FCQUNBO0FBQ0EsZ0JBQUEsV0FBQTtjQUNBLFFBQUEsU0FBQTtjQUNBLFVBQUE7Z0JBQ0EsTUFBQSxTQUFBO2dCQUNBLFFBQUEsU0FBQTs7Y0FFQSxXQUFBO2dCQUNBLE1BQUEsVUFBQTtnQkFDQSxRQUFBLFVBQUE7O2NBRUEsTUFBQSxTQUFBOzs7O0FBSUEsb0JBQUE7Ozs7QUFJQSxTQUFBLG1CQUFBLFNBQUEsWUFBQTtBQUNBLFVBQUEsaUJBQUEsWUFBQTs7QUFHQSxXQUFBLENBQUEsTUFBQSxVQUFBLE1BQUE7O0FBR0EsVUFBQSxhQUFBOztBQzNZQSxrQkFBQSxPQUFBLE9BQUE7QUFDQSxRQUFBLFNBQUE7QUFDQSxhQUFBLE1BQUE7ZUFDQSxVQUFBLFdBQUE7QUFDQSxhQUFBOztBQUVBLFlBQUEsSUFBQSxNQUFBLE1BQUEsUUFBQTs7O0FBR0EsVUFBQSxTQUFBO0FBRUEsTUFBQSxZQUFBO0FBQ0EsTUFBQSxnQkFBQTtBQUVBLG9CQUFBO0FBQ0EsUUFBQSxRQUFBLEtBQUEsTUFBQTtBQUNBLFFBQUEsQ0FBQTtBQUNBLGFBQUE7O0FBRUEsV0FBQTtNQUNBLFFBQUEsTUFBQTtNQUNBLE1BQUEsTUFBQTtNQUNBLE1BQUEsTUFBQTtNQUNBLE1BQUEsTUFBQTtNQUNBLE1BQUEsTUFBQTs7O0FBR0EsVUFBQSxXQUFBO0FBRUEsdUJBQUE7QUFDQSxRQUFBLE1BQUE7QUFDQSxRQUFBLFdBQUE7QUFDQSxhQUFBLFdBQUEsU0FBQTs7QUFFQSxXQUFBO0FBQ0EsUUFBQSxXQUFBO0FBQ0EsYUFBQSxXQUFBLE9BQUE7O0FBRUEsUUFBQSxXQUFBO0FBQ0EsYUFBQSxXQUFBOztBQUVBLFFBQUEsV0FBQTtBQUNBLGFBQUEsTUFBQSxXQUFBOztBQUVBLFFBQUEsV0FBQTtBQUNBLGFBQUEsV0FBQTs7QUFFQSxXQUFBOztBQUVBLFVBQUEsY0FBQTtBQWFBLHFCQUFBO0FBQ0EsUUFBQSxPQUFBO0FBQ0EsUUFBQSxNQUFBLFNBQUE7QUFDQSxRQUFBO0FBQ0EsVUFBQSxDQUFBLElBQUE7QUFDQSxlQUFBOztBQUVBLGFBQUEsSUFBQTs7QUFFQSxRQUFBLGFBQUEsUUFBQSxXQUFBO0FBRUEsUUFBQSxRQUFBLEtBQUEsTUFBQTtBQUNBLGFBQUEsTUFBQSxLQUFBLEdBQUEsSUFBQSxNQUFBLFNBQUEsR0FBQSxLQUFBLEdBQUE7QUFDQSxhQUFBLE1BQUE7QUFDQSxVQUFBLFNBQUE7QUFDQSxjQUFBLE9BQUEsR0FBQTtpQkFDQSxTQUFBO0FBQ0E7aUJBQ0EsS0FBQTtBQUNBLFlBQUEsU0FBQTtBQUlBLGdCQUFBLE9BQUEsSUFBQSxHQUFBO0FBQ0EsZUFBQTs7QUFFQSxnQkFBQSxPQUFBLEdBQUE7QUFDQTs7OztBQUlBLFdBQUEsTUFBQSxLQUFBO0FBRUEsUUFBQSxTQUFBO0FBQ0EsYUFBQSxhQUFBLE1BQUE7O0FBR0EsUUFBQTtBQUNBLFVBQUEsT0FBQTtBQUNBLGFBQUEsWUFBQTs7QUFFQSxXQUFBOztBQUVBLFVBQUEsWUFBQTtBQWtCQSxnQkFBQSxPQUFBO0FBQ0EsUUFBQSxVQUFBO0FBQ0EsY0FBQTs7QUFFQSxRQUFBLFVBQUE7QUFDQSxjQUFBOztBQUVBLFFBQUEsV0FBQSxTQUFBO0FBQ0EsUUFBQSxXQUFBLFNBQUE7QUFDQSxRQUFBO0FBQ0EsY0FBQSxTQUFBLFFBQUE7O0FBSUEsUUFBQSxZQUFBLENBQUEsU0FBQTtBQUNBLFVBQUE7QUFDQSxpQkFBQSxTQUFBLFNBQUE7O0FBRUEsYUFBQSxZQUFBOztBQUdBLFFBQUEsWUFBQSxNQUFBLE1BQUE7QUFDQSxhQUFBOztBQUlBLFFBQUEsWUFBQSxDQUFBLFNBQUEsUUFBQSxDQUFBLFNBQUE7QUFDQSxlQUFBLE9BQUE7QUFDQSxhQUFBLFlBQUE7O0FBR0EsUUFBQSxTQUFBLE1BQUEsT0FBQSxPQUFBLE1BQ0EsUUFDQSxVQUFBLE1BQUEsUUFBQSxRQUFBLE1BQUEsTUFBQTtBQUVBLFFBQUE7QUFDQSxlQUFBLE9BQUE7QUFDQSxhQUFBLFlBQUE7O0FBRUEsV0FBQTs7QUFFQSxVQUFBLE9BQUE7QUFFQSxVQUFBLGFBQUEsU0FBQTtBQUNBLFdBQUEsTUFBQSxPQUFBLE9BQUEsT0FBQSxVQUFBLEtBQUE7O0FBU0Esb0JBQUEsT0FBQTtBQUNBLFFBQUEsVUFBQTtBQUNBLGNBQUE7O0FBR0EsWUFBQSxNQUFBLFFBQUEsT0FBQTtBQU1BLFFBQUEsUUFBQTtBQUNBLFdBQUEsTUFBQSxRQUFBLFFBQUEsU0FBQTtBQUNBLFVBQUEsUUFBQSxNQUFBLFlBQUE7QUFDQSxVQUFBLFFBQUE7QUFDQSxlQUFBOztBQU1BLGNBQUEsTUFBQSxNQUFBLEdBQUE7QUFDQSxVQUFBLE1BQUEsTUFBQTtBQUNBLGVBQUE7O0FBR0EsUUFBQTs7QUFJQSxXQUFBLE1BQUEsUUFBQSxHQUFBLEtBQUEsU0FBQSxNQUFBLE9BQUEsTUFBQSxTQUFBOztBQUVBLFVBQUEsV0FBQTtBQUVBLE1BQUEsb0JBQUE7QUFDQSxRQUFBLE1BQUEsT0FBQSxPQUFBO0FBQ0EsV0FBQSxDQUFBLGdCQUFBOztBQUdBLG9CQUFBO0FBQ0EsV0FBQTs7QUFZQSx1QkFBQTtBQUNBLFFBQUEsY0FBQTtBQUNBLGFBQUEsTUFBQTs7QUFHQSxXQUFBOztBQUVBLFVBQUEsY0FBQSxvQkFBQSxXQUFBO0FBRUEseUJBQUE7QUFDQSxRQUFBLGNBQUE7QUFDQSxhQUFBLEtBQUEsTUFBQTs7QUFHQSxXQUFBOztBQUVBLFVBQUEsZ0JBQUEsb0JBQUEsV0FBQTtBQUVBLHlCQUFBO0FBQ0EsUUFBQSxDQUFBO0FBQ0EsYUFBQTs7QUFHQSxRQUFBLFNBQUEsRUFBQTtBQUVBLFFBQUEsU0FBQTtBQUNBLGFBQUE7O0FBR0EsUUFBQSxFQUFBLFdBQUEsU0FBQSxPQUFBLE1BQ0EsRUFBQSxXQUFBLFNBQUEsT0FBQSxNQUNBLEVBQUEsV0FBQSxTQUFBLE9BQUEsT0FDQSxFQUFBLFdBQUEsU0FBQSxPQUFBLE9BQ0EsRUFBQSxXQUFBLFNBQUEsT0FBQSxPQUNBLEVBQUEsV0FBQSxTQUFBLE9BQUEsT0FDQSxFQUFBLFdBQUEsU0FBQSxPQUFBLE9BQ0EsRUFBQSxXQUFBLFNBQUEsT0FBQSxNQUNBLEVBQUEsV0FBQSxTQUFBLE9BQUE7QUFDQSxhQUFBOztBQUdBLGFBQUEsSUFBQSxTQUFBLElBQUEsS0FBQSxHQUFBO0FBQ0EsVUFBQSxFQUFBLFdBQUEsT0FBQTtBQUNBLGVBQUE7OztBQUlBLFdBQUE7O0FBV0Esc0NBQUEsVUFBQSxVQUFBO0FBQ0EsUUFBQSxNQUFBLE9BQUEsU0FBQSxRQUFBLFNBQUE7QUFDQSxRQUFBLFFBQUE7QUFDQSxhQUFBOztBQUdBLFVBQUEsU0FBQSxlQUFBLFNBQUE7QUFDQSxRQUFBLFFBQUE7QUFDQSxhQUFBOztBQUdBLFVBQUEsU0FBQSxpQkFBQSxTQUFBO0FBQ0EsUUFBQSxRQUFBLEtBQUE7QUFDQSxhQUFBOztBQUdBLFVBQUEsU0FBQSxrQkFBQSxTQUFBO0FBQ0EsUUFBQSxRQUFBO0FBQ0EsYUFBQTs7QUFHQSxVQUFBLFNBQUEsZ0JBQUEsU0FBQTtBQUNBLFFBQUEsUUFBQTtBQUNBLGFBQUE7O0FBR0EsV0FBQSxPQUFBLFNBQUEsTUFBQSxTQUFBOztBQUVBLFVBQUEsNkJBQUE7QUFXQSwrQ0FBQSxVQUFBLFVBQUE7QUFDQSxRQUFBLE1BQUEsU0FBQSxnQkFBQSxTQUFBO0FBQ0EsUUFBQSxRQUFBO0FBQ0EsYUFBQTs7QUFHQSxVQUFBLFNBQUEsa0JBQUEsU0FBQTtBQUNBLFFBQUEsUUFBQSxLQUFBO0FBQ0EsYUFBQTs7QUFHQSxVQUFBLE9BQUEsU0FBQSxRQUFBLFNBQUE7QUFDQSxRQUFBLFFBQUE7QUFDQSxhQUFBOztBQUdBLFVBQUEsU0FBQSxlQUFBLFNBQUE7QUFDQSxRQUFBLFFBQUE7QUFDQSxhQUFBOztBQUdBLFVBQUEsU0FBQSxpQkFBQSxTQUFBO0FBQ0EsUUFBQSxRQUFBO0FBQ0EsYUFBQTs7QUFHQSxXQUFBLE9BQUEsU0FBQSxNQUFBLFNBQUE7O0FBRUEsVUFBQSxzQ0FBQTtBQUVBLGtCQUFBLE9BQUE7QUFDQSxRQUFBLFVBQUE7QUFDQSxhQUFBOztBQUdBLFFBQUEsVUFBQTtBQUNBLGFBQUE7O0FBR0EsUUFBQSxVQUFBO0FBQ0EsYUFBQTs7QUFHQSxRQUFBLFFBQUE7QUFDQSxhQUFBOztBQUdBLFdBQUE7O0FBT0EsK0NBQUEsVUFBQTtBQUNBLFFBQUEsTUFBQSxTQUFBLGdCQUFBLFNBQUE7QUFDQSxRQUFBLFFBQUE7QUFDQSxhQUFBOztBQUdBLFVBQUEsU0FBQSxrQkFBQSxTQUFBO0FBQ0EsUUFBQSxRQUFBO0FBQ0EsYUFBQTs7QUFHQSxVQUFBLE9BQUEsU0FBQSxRQUFBLFNBQUE7QUFDQSxRQUFBLFFBQUE7QUFDQSxhQUFBOztBQUdBLFVBQUEsU0FBQSxlQUFBLFNBQUE7QUFDQSxRQUFBLFFBQUE7QUFDQSxhQUFBOztBQUdBLFVBQUEsU0FBQSxpQkFBQSxTQUFBO0FBQ0EsUUFBQSxRQUFBO0FBQ0EsYUFBQTs7QUFHQSxXQUFBLE9BQUEsU0FBQSxNQUFBLFNBQUE7O0FBRUEsVUFBQSxzQ0FBQTtBQU9BLCtCQUFBO0FBQ0EsV0FBQSxLQUFBLE1BQUEsSUFBQSxR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QUFBLFFBQUE7QUFFQSxjQUFBLENBQUEsU0FBQTtBQUNBLG1CQUFBOztBQUdBLGNBQUEsQ0FBQSxTQUFBLFdBQUE7QUFDQSxxQkFBQSxPQUFBLFdBQUEsU0FBQSxXQUFBO0FBQ0EsdUJBQUEsWUFBQSxxQkFBQTs7QUFHQSxjQUFBLENBQUEsU0FBQSxXQUFBO0FBQ0EsZ0JBQUEsU0FBQSxXQUFBLFNBQUE7QUFDQSx1QkFBQSxhQUFBLFNBQUEsV0FBQSxRQUFBLFlBQUE7QUFDQSx1QkFBQSxPQUFBOztBQUVBLGdCQUFBLFNBQUEsV0FBQSxTQUFBLDBCQUNBLFNBQUEsV0FBQSxTQUFBO0FBQ0EsdUJBQUEsYUFBQTs7O0FBSUEsaUJBQUEsRUFBQSxPQUFBLENBQUEsWUFBQSxLQUFBLEtBQUE7OztVQUlBO0FBQ0EsZUFBQSxJQUFBLFlBQUEsS0FBQSxJQUFBLFlBQUE7O1VBR0E7QUFDQSxlQUFBLElBQUEsWUFDQSxVQUFBLE1BQUEsT0FBQSxFQUFBLE9BQUEsRUFBQSxNQUFBLElBQ0E7QUFDQSxpQkFBQSxNQUFBLE1BQUEsTUFBQSxHQUFBLE9BQUEsQ0FBQSxNQUFBO0FBQ0EsaUJBQUEsU0FBQSxNQUFBLFVBQUEsaUJBQUEsYUFBQSxPQUFBLFVBQUE7QUFDQSxpQkFBQSxjQUFBLE1BQUEsZUFBQSxpQkFBQSxhQUFBLE9BQUEsZUFBQTtBQUNBLG1CQUFBO2FBQUEsRUFBQSxPQUFBLElBQUEsTUFBQSxNQUFBOzs7VUFNQTtBQUNBLGVBQUEsS0FBQSxZQUFBLG1CQUFBLE9BQUEsQ0FBQSxHQUFBLE1BQUEsTUFBQSxLQUFBLENBQUEsR0FBQSxjQUFBLEVBQUEsUUFBQSxFQUFBOztNQUdBLEdBQUE7QUFDQSxlQUFBLEVBQUEsT0FBQTtVQUVBLGFBQUE7VUFDQSxRQUFBO1VBQ0EsT0FBQTtVQUNBLFFBQUE7VUFDQSxNQUFBO1VBQ0EsTUFBQTtVQUNBLFFBQUE7V0FFQSxLQUFBOzthQUdBLGVBQUEsR0FBQTtBQUNBLGVBQUEsRUFBQSxTQUFBLEVBQUEsUUFDQSxFQUFBLFNBQUEsRUFBQSxRQUNBLEVBQUEsV0FBQSxFQUFBOztVQUdBO0FBRUEsY0FBQSxVQUFBLENBQUEsR0FBQSxNQUFBLEtBQUEsR0FBQSxTQUFBLElBQUEsRUFBQSxNQUFBLEdBQUEsSUFBQSxLQUFBLFdBQUE7QUFDQSxjQUFBLFlBQUEsQ0FBQSxHQUFBLE1BQUEsS0FBQSxHQUFBLFNBQUEsSUFBQSxXQUFBLEVBQUEsTUFBQSxDQUFBLEtBQUEsTUFBQTtBQUVBLGVBQUEsUUFBQSxLQUFBLFlBQUEsSUFDQSxPQUFBO1VBQ0EsUUFBQSxRQUFBLEVBQUEsYUFBQSxZQUFBLGdCQUFBO1VBQ0EsVUFBQSxFQUFBLGFBQUEsRUFBQSxZQUFBLE1BQUEsRUFBQSxRQUFBLElBQUEsWUFBQSxnQkFBQTtVQUNBLFFBQUEsR0FBQSxjQUFBLElBQUEsVUFBQSxJQUFBLFlBQUEsZ0JBQUE7OzthQUlBO0FBRUEsa0JBQUE7OztBQU9BLGdCQUFBLGtCQUFBO01BRUEsUUFBQTtNQUNBLE1BQUE7TUFDQSxZQUFBOztBQU1BLElBQUE7QUFFQSxZQUFBLFVBQUE7UUFFQSxRQUFBO0FBRUEsZ0JBQUEsSUFBQSxZQUFBO0FBQ0EsWUFBQSxPQUFBLFlBQUEsZUFBQSxVQUFBLEVBQUEsU0FBQSxLQUFBLE9BQUE7O1FBR0EsT0FBQTtBQUVBLGdCQUFBLElBQUEsWUFBQTtBQUNBLFlBQUEsT0FBQSxZQUFBLGVBQUEsVUFBQSxFQUFBLFNBQUEsQ0FBQSxLQUFBLE9BQUE7OztBQUlBLFFBQUEsT0FBQSxZQUFBLGNBQUE7O0FBT0EsS0FBQSxPQUFBLFVBQUEsU0FBQSxVQUFBLFdBQUEsUUFBQTtBQUVBLGtCQUFBLFVBQUEsUUFBQTtBQUVBLGNBQUEsTUFBQSxNQUFBLEtBQUE7QUFDQSxlQUFBLElBQUEsWUFBQSxJQUFBLE1BQUEsTUFBQSxLQUFBOzs7QUFPQSxnQkFBQSxRQUFBLE9BQUEsV0FBQSxjQUFBLE9BQUEsSUFBQSxpQkFBQTtBQUlBLFdBQUEsVUFBQTs7OztBQzdTQSxNQUFBLGdCQUFBLHVCQUFBLFNBQUE7Ozs7QUFFQSxTQUFPLFFBQVEsY0FBQTs7Ozs7OztBQ0pmLE1BQUEsZUFB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
