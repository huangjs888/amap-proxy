function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
/*
 * @Author: Huangjs
 * @Date: 2021-10-10 15:07:28
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-21 10:28:09
 * @Description: 对于内网环境下，使用代理服务器转发，从而实现在线加载高德地图
 */

const windowWrapper = function windowWrapper(win, convertUrl) {
  if (win.Blob) {
    const BlobWrapper = win.Blob;
    win.Blob = function Blob(buffer, options, ...args) {
      const injectCode = options && options.type && options.type.indexOf('text/javascript') !== -1;
      return new (Function.prototype.bind.apply(BlobWrapper, [null, injectCode ? [`(${windowWrapper.toString()})(self, ${convertUrl.toString()});\n`].concat(buffer) : buffer, options, ...args]))();
    };
  }
  if (win.Request) {
    const RequestWrapper = win.Request;
    win.Request = function Request(url, ...args) {
      return new (Function.prototype.bind.apply(RequestWrapper, [null, typeof url === 'string' ? convertUrl(url) : url].concat(args)))();
    };
  }
  if (win.fetch) {
    const fetchWrapper = win.fetch;
    win.fetch = function fetch(url, ...args) {
      return fetchWrapper.apply(this, [typeof url === 'string' ? convertUrl(url) : url].concat(args));
    };
  }
  if (win.XMLHttpRequest) {
    const openWrapper = win.XMLHttpRequest.prototype.open;
    win.XMLHttpRequest.prototype.open = function open(type, url, ...args) {
      return openWrapper.apply(this, [type, convertUrl(url)].concat(args));
    };
  }
};
const documentWrapper = function documentWrapper(win, convertUrl) {
  if (win.document) {
    if (win.document.write) {
      const writeWrapper = win.document.write;
      win.document.write = function write(...args) {
        return writeWrapper.apply(this, args.map(value => convertUrl(value)));
      };
    }
    if (typeof document.createTextNode === 'function') {
      const createTextNodeWrapper = win.document.createTextNode;
      win.document.createTextNode = function createTextNode(data, ...args) {
        return createTextNodeWrapper.apply(this, [convertUrl(data)].concat(args));
      };
    }
  }
  if (win.Element) {
    const setAttributeWrapper = win.Element.prototype.setAttribute;
    win.Element.prototype.setAttribute = function setAttribute(name, value, ...args) {
      if (name === 'src' || name === 'href' || name === 'style') {
        return setAttributeWrapper.apply(this, [name, convertUrl(value)].concat(args));
      }
      return setAttributeWrapper.apply(this, [name, value].concat(args));
    };
    const setAttributeNSWrapper = win.Element.prototype.setAttributeNS;
    win.Element.prototype.setAttributeNS = function setAttributeNS(ns, name, value, ...args) {
      if (name === 'src' || name === 'href' || name === 'style') {
        return setAttributeNSWrapper.apply(this, [ns, name, convertUrl(value)].concat(args));
      }
      return setAttributeNSWrapper.apply(this, [ns, name, value].concat(args));
    };
  }
  if (win.HTMLElement) {
    const style = Object.getOwnPropertyDescriptor(win.HTMLElement.prototype, 'style');
    if (style) {
      Object.defineProperty(win.HTMLElement.prototype, 'style', _extends({}, style, {
        set: function set(value, ...args) {
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
            style.set.apply(this, [value].concat(args));
          }
        }
      }));
    }
  }
  if (win.HTMLStyleElement) {
    const styleSheet = Object.getOwnPropertyDescriptor(win.HTMLStyleElement.prototype, 'styleSheet');
    if (styleSheet) {
      Object.defineProperty(win.HTMLStyleElement.prototype, 'styleSheet', _extends({}, styleSheet, {
        set: function set(value, ...args) {
          if (value.cssText) {
            value.cssText = convertUrl(value.cssText);
          }
          if (styleSheet.set) {
            styleSheet.set.apply(this, [value].concat(args));
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
  }].forEach(({
    element,
    property
  }) => {
    element.forEach(el => {
      if (win[el]) {
        const {
          prototype
        } = win[el];
        property.forEach(py => {
          const descriptor = Object.getOwnPropertyDescriptor(prototype, py);
          if (descriptor) {
            Object.defineProperty(prototype, py, _extends({}, descriptor, {
              set: function set(value, ...args) {
                if (descriptor.set) {
                  descriptor.set.apply(this, [convertUrl(value)].concat(args));
                }
              }
            }));
          }
        });
      }
    });
  });
};
export default function ap(proxyUrl, regExp) {
  const win = window || global || self || this || {};
  const convertUrl = url => typeof url === 'string' ? url.replace(regExp, `${proxyUrl}$2`) : url;
  convertUrl.toString = function toString() {
    return `function convertUrl(url) {
      return typeof url === 'string' ? url.replace(${regExp}, ''.concat('${proxyUrl}', '$2')) : url;
    }`;
  };
  windowWrapper(win, convertUrl);
  documentWrapper(win, convertUrl);
}