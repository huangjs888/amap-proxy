"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
exports.__esModule = true;
exports.default = ap;
var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/concat"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/map"));
var _getOwnPropertyDescriptor = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/object/get-own-property-descriptor"));
/*
 * @Author: Huangjs
 * @Date: 2021-10-10 15:07:28
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-21 10:28:09
 * @Description: 对于内网环境下，使用代理服务器转发，从而实现在线加载高德地图
 */

var windowWrapper = function windowWrapper(win, convertUrl) {
  if (win.Blob) {
    var BlobWrapper = win.Blob;
    win.Blob = function Blob(buffer, options) {
      var _context, _context2;
      var injectCode = options && options.type && options.type.indexOf('text/javascript') !== -1;
      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }
      return new (Function.prototype.bind.apply(BlobWrapper, (0, _concat.default)(_context = [null, injectCode ? (0, _concat.default)(_context2 = ["(" + windowWrapper.toString() + ")(self, " + convertUrl.toString() + ");\n"]).call(_context2, buffer) : buffer, options]).call(_context, args)))();
    };
  }
  if (win.Request) {
    var RequestWrapper = win.Request;
    win.Request = function Request(url) {
      var _context3;
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }
      return new (Function.prototype.bind.apply(RequestWrapper, (0, _concat.default)(_context3 = [null, typeof url === 'string' ? convertUrl(url) : url]).call(_context3, args)))();
    };
  }
  if (win.fetch) {
    var fetchWrapper = win.fetch;
    win.fetch = function fetch(url) {
      var _context4;
      for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }
      return fetchWrapper.apply(this, (0, _concat.default)(_context4 = [typeof url === 'string' ? convertUrl(url) : url]).call(_context4, args));
    };
  }
  if (win.XMLHttpRequest) {
    var openWrapper = win.XMLHttpRequest.prototype.open;
    win.XMLHttpRequest.prototype.open = function open(type, url) {
      var _context5;
      for (var _len4 = arguments.length, args = new Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
        args[_key4 - 2] = arguments[_key4];
      }
      return openWrapper.apply(this, (0, _concat.default)(_context5 = [type, convertUrl(url)]).call(_context5, args));
    };
  }
};
var documentWrapper = function documentWrapper(win, convertUrl) {
  if (win.document) {
    if (win.document.write) {
      var writeWrapper = win.document.write;
      win.document.write = function write() {
        for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
          args[_key5] = arguments[_key5];
        }
        return writeWrapper.apply(this, (0, _map.default)(args).call(args, function (value) {
          return convertUrl(value);
        }));
      };
    }
    if (typeof document.createTextNode === 'function') {
      var createTextNodeWrapper = win.document.createTextNode;
      win.document.createTextNode = function createTextNode(data) {
        var _context6;
        for (var _len6 = arguments.length, args = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
          args[_key6 - 1] = arguments[_key6];
        }
        return createTextNodeWrapper.apply(this, (0, _concat.default)(_context6 = [convertUrl(data)]).call(_context6, args));
      };
    }
  }
  if (win.Element) {
    var setAttributeWrapper = win.Element.prototype.setAttribute;
    win.Element.prototype.setAttribute = function setAttribute(name, value) {
      var _context8;
      for (var _len7 = arguments.length, args = new Array(_len7 > 2 ? _len7 - 2 : 0), _key7 = 2; _key7 < _len7; _key7++) {
        args[_key7 - 2] = arguments[_key7];
      }
      if (name === 'src' || name === 'href' || name === 'style') {
        var _context7;
        return setAttributeWrapper.apply(this, (0, _concat.default)(_context7 = [name, convertUrl(value)]).call(_context7, args));
      }
      return setAttributeWrapper.apply(this, (0, _concat.default)(_context8 = [name, value]).call(_context8, args));
    };
    var setAttributeNSWrapper = win.Element.prototype.setAttributeNS;
    win.Element.prototype.setAttributeNS = function setAttributeNS(ns, name, value) {
      var _context10;
      for (var _len8 = arguments.length, args = new Array(_len8 > 3 ? _len8 - 3 : 0), _key8 = 3; _key8 < _len8; _key8++) {
        args[_key8 - 3] = arguments[_key8];
      }
      if (name === 'src' || name === 'href' || name === 'style') {
        var _context9;
        return setAttributeNSWrapper.apply(this, (0, _concat.default)(_context9 = [ns, name, convertUrl(value)]).call(_context9, args));
      }
      return setAttributeNSWrapper.apply(this, (0, _concat.default)(_context10 = [ns, name, value]).call(_context10, args));
    };
  }
  if (win.HTMLElement) {
    var style = (0, _getOwnPropertyDescriptor.default)(win.HTMLElement.prototype, 'style');
    if (style) {
      Object.defineProperty(win.HTMLElement.prototype, 'style', (0, _extends2.default)({}, style, {
        set: function set(value) {
          if (value.background) {
            value.background = convertUrl(value.background);
          }
          if (value.backgroundImage) {
            value.backgroundImage = convertUrl(value.backgroundImage);
          }
          if (value.border) {
            value.border = convertUrl(value.border);
          }
          if (value.borderImage) {
            value.borderImage = convertUrl(value.borderImage);
          }
          if (value.cssText) {
            value.cssText = convertUrl(value.cssText);
          }
          if (style.set) {
            var _context11;
            for (var _len9 = arguments.length, args = new Array(_len9 > 1 ? _len9 - 1 : 0), _key9 = 1; _key9 < _len9; _key9++) {
              args[_key9 - 1] = arguments[_key9];
            }
            style.set.apply(this, (0, _concat.default)(_context11 = [value]).call(_context11, args));
          }
        }
      }));
    }
  }
  if (win.HTMLStyleElement) {
    var styleSheet = (0, _getOwnPropertyDescriptor.default)(win.HTMLStyleElement.prototype, 'styleSheet');
    if (styleSheet) {
      Object.defineProperty(win.HTMLStyleElement.prototype, 'styleSheet', (0, _extends2.default)({}, styleSheet, {
        set: function set(value) {
          if (value.cssText) {
            value.cssText = convertUrl(value.cssText);
          }
          if (styleSheet.set) {
            var _context12;
            for (var _len10 = arguments.length, args = new Array(_len10 > 1 ? _len10 - 1 : 0), _key10 = 1; _key10 < _len10; _key10++) {
              args[_key10 - 1] = arguments[_key10];
            }
            styleSheet.set.apply(this, (0, _concat.default)(_context12 = [value]).call(_context12, args));
          }
        }
      }));
    }
  }
  [{
    element: ['HTMLScriptElement', 'HTMLImageElement', 'HTMLIFrameElement', 'HTMLFrameElement', 'HTMLMediaElement', 'HTMLEmbedElement', 'HTMLSourceElement',
    // srcset
    'HTMLInputElement'],
    property: ['src']
  }, {
    element: ['HTMLLinkElement', 'HTMLAnchorElement', 'HTMLAreaElement'],
    property: ['href']
  }, {
    element: ['HTMLElement'],
    property: ['innerText', 'outerText']
  }, {
    element: ['Element'],
    property: ['innerHTML', 'outerHTML']
  }, {
    element: ['CharacterData'],
    property: ['data']
  }, {
    element: ['Attr'],
    property: ['value']
  }, {
    element: ['Node'],
    property: ['textContent']
  }].forEach(function (_ref) {
    var element = _ref.element,
      property = _ref.property;
    element.forEach(function (el) {
      if (win[el]) {
        var prototype = win[el].prototype;
        property.forEach(function (py) {
          var descriptor = (0, _getOwnPropertyDescriptor.default)(prototype, py);
          if (descriptor) {
            Object.defineProperty(prototype, py, (0, _extends2.default)({}, descriptor, {
              set: function set(value) {
                if (descriptor.set) {
                  var _context13;
                  for (var _len11 = arguments.length, args = new Array(_len11 > 1 ? _len11 - 1 : 0), _key11 = 1; _key11 < _len11; _key11++) {
                    args[_key11 - 1] = arguments[_key11];
                  }
                  descriptor.set.apply(this, (0, _concat.default)(_context13 = [convertUrl(value)]).call(_context13, args));
                }
              }
            }));
          }
        });
      }
    });
  });
};
function ap(proxyUrl, regExp) {
  var win = window || global || self || this || {};
  var convertUrl = function convertUrl(url) {
    return typeof url === 'string' ? url.replace(regExp, proxyUrl + "$2") : url;
  };
  convertUrl.toString = function toString() {
    return "function convertUrl(url) {\n      return typeof url === 'string' ? url.replace(" + regExp + ", ''.concat('" + proxyUrl + "', '$2')) : url;\n    }";
  };
  windowWrapper(win, convertUrl);
  documentWrapper(win, convertUrl);
}