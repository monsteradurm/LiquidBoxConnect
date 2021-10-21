// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"Tnu0":[function(require,module,exports) {

},{}],"S326":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = box;

var _react = _interopRequireWildcard(require("react"));

var _standardButton = _interopRequireDefault(require("@atlaskit/button/standard-button"));

var _breadcrumbs = _interopRequireWildcard(require("@atlaskit/breadcrumbs"));

var _folderFilled = require("@atlaskit/icon/glyph/folder-filled");

var _spinner = _interopRequireDefault(require("@atlaskit/spinner"));

var _axios = _interopRequireDefault(require("axios"));

var _reactFetchHook = _interopRequireDefault(require("react-fetch-hook"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _reactFontawesome = require("@fortawesome/react-fontawesome");

var _freeSolidSvgIcons = require("@fortawesome/free-solid-svg-icons");

var _spinnersReact = require("spinners-react");

var _emptyState = _interopRequireDefault(require("@atlaskit/empty-state"));

var _ = _interopRequireWildcard(require("underscore"));

require("./styles.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// Atlaskit
//other
//css
const BoxURL = "https://www.liquidanimation.live/box-rest";

const onRequestError = err => {
  console.log("Request", err);
};

const FileItem = ({
  item,
  setDisplayItem
}) => {
  const [thumbnail, setThumbnail] = (0, _react.useState)(null);
  const [base64String, setBase64String] = (0, _react.useState)(null);
  (0, _react.useEffect)(() => {
    if (item) (0, _axios.default)({
      method: 'get',
      url: "https://liquidanimation.live/box-rest/thumbnail?id=" + item.id
    }).then(res => {
      setThumbnail(res.data);
      if (res.data.file && res.data.file.data) setBase64String(btoa(String.fromCharCode(...new Uint8Array(res.data.file.data))));
    }).catch(err => onRequestError(err));
  }, []);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "box-file-container bow-row"
  }, base64String && /*#__PURE__*/_react.default.createElement("img", {
    src: `data:image/png;base64,${base64String}`,
    alt: ""
  }), thumbnail && thumbnail.location && /*#__PURE__*/_react.default.createElement("img", {
    src: thumbnail.location
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "box-file",
    onClick: () => setDisplayItem(item)
  }, item.name));
};

const FolderItem = ({
  item,
  setCurrentFolderId,
  pageRoot
}) => {
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "box-folder-container bow-row",
    onClick: () => {
      setCurrentFolderId(item.id);
    }
  }, /*#__PURE__*/_react.default.createElement(_reactFontawesome.FontAwesomeIcon, {
    icon: _freeSolidSvgIcons.faFolder,
    style: {
      fontSize: 25 + 'px',
      color: 'inherit'
    }
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "box-folder"
  }, item.name));
};

const DisplayLoading = ({
  message
}) => {
  return /*#__PURE__*/_react.default.createElement("div", {
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      margin: 'auto',
      width: 'fit-content',
      padding: 20 + 'px'
    }
  }, /*#__PURE__*/_react.default.createElement(_spinner.default, {
    size: "xlarge"
  })), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      margin: 'auto',
      width: 'fit-content'
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      margin: 'auto'
    }
  }, /*#__PURE__*/_react.default.createElement(_emptyState.default, {
    header: message
  }))));
};

const DisplayError = ({
  message
}) => {
  return /*#__PURE__*/_react.default.createElement("div", {
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      margin: 'auto',
      width: 'fit-content'
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      margin: 'auto'
    }
  }, /*#__PURE__*/_react.default.createElement(_emptyState.default, {
    header: message
  }))));
};

const NavigationCrumbs = ({
  setCurrentFolderId,
  boxCrumbs
}) => {
  return /*#__PURE__*/_react.default.createElement(_breadcrumbs.default, null, boxCrumbs.map(crumb => /*#__PURE__*/_react.default.createElement(_breadcrumbs.BreadcrumbsItem, {
    key: crumb.id + '_crumb',
    text: crumb.name,
    onClick: () => setCurrentFolderId(crumb.id)
  })));
};

function box() {
  const [properties, setProperties] = (0, _react.useState)({
    title: null,
    spaceKey: null
  });
  const [currentFolderId, setCurrentFolderId] = (0, _react.useState)(null);
  const [boxCrumbs, setBoxCrumbs] = (0, _react.useState)([]);
  const [boxRoot, setBoxRoot] = (0, _react.useState)(null);
  const [pageRoot, setPageRoot] = (0, _react.useState)(null);
  const [page, setPage] = (0, _react.useState)(null);
  const [projectId, setProjectId] = (0, _react.useState)(null);
  const [files, setFiles] = (0, _react.useState)([]);
  const [folders, setFolders] = (0, _react.useState)([]);
  const [fetching, setFetching] = (0, _react.useState)(true);
  const [errorMsg, setErrorMsg] = (0, _react.useState)(null);
  const [displayItem, setDisplayItem] = (0, _react.useState)(null);
  (0, _react.useEffect)(() => {
    if (displayItem && displayItem.shared_link && displayItem.shared_link.url) {
      window.open(displayItem.shared_link.url, "_blank");
    } else if (displayItem) {
      (0, _axios.default)({
        method: 'get',
        url: "https://liquidanimation.live/box-rest/sharedFile?id=" + displayItem.id
      }).then(res => {
        window.open(res.data.shared_link.url, "_blank");
      }).catch(err => onRequestError(err));
    }
  }, [displayItem]);
  (0, _react.useEffect)(() => {
    setPage(props.title);
    setProjectId(props.spaceKey);
    AP.request({
      url: '/rest/api/space/' + props.spaceKey + '/property/forge-BoxRoot',
      success: res => {
        const result = JSON.parse(res);
        setBoxRoot(result.value);
        (0, _axios.default)({
          method: 'get',
          url: "https://liquidanimation.live/box-rest/folderItems?root=" + result.value
        }).then(res => {
          const root = _.find(res.data.entries, e => e.name == props.title);

          if (!root) {
            setErrorMsg("Box Folder: " + '"' + props.title + '"' + " could not be found!");
          } else {
            setPageRoot(root.id);
            setCurrentFolderId(root.id);
          }
        }).catch(err => onRequestError(err));
      },
      error: onRequestError
    });
  }, []);
  (0, _react.useEffect)(() => {
    if (currentFolderId) (0, _axios.default)({
      method: 'get',
      url: "https://liquidanimation.live/box-rest/folderInfo?id=" + currentFolderId
    }).then(res => {
      if (!pageRoot || currentFolderId == pageRoot) {
        console.log("Root Directory");
        setBoxCrumbs([{
          id: res.data.id,
          name: res.data.name
        }]);
      }

      const entries = res.data.path_collection.entries;

      const crumbIndex = _.findIndex(entries, c => c.id == pageRoot);

      if (crumbIndex < 0) setBoxCrumbs([{
        id: res.data.id,
        name: res.data.name
      }]);else {
        const crumbs = [...[...entries].splice(crumbIndex), {
          id: res.data.id,
          name: res.data.name
        }];
        setBoxCrumbs(crumbs);
        console.log(entries, crumbIndex, crumbs);
      }
    }).catch(err => onRequestError(err));
  }, [currentFolderId]);
  (0, _react.useEffect)(() => {
    if (currentFolderId) {
      setFetching(true);
      (0, _axios.default)({
        method: 'get',
        url: "https://liquidanimation.live/box-rest/folderItems?root=" + currentFolderId
      }).then(res => {
        const folderEntries = [];

        _.forEach(res.data.entries.filter(item => item.type == 'folder'), folder => {
          const rootIndex = _.findIndex(folder.path_collection.entries, f => f.id == boxRoot);

          folder['crumbs'] = [...folder.path_collection.entries.splice(rootIndex + 1), {
            id: folder.id,
            name: folder.name
          }];
          folderEntries.push(folder);
        });

        setFolders(folderEntries);
        setFiles(res.data.entries.filter(item => item.type == 'file'));
        setFetching(false);
      }).catch(err => onRequestError(err));
    }
  }, [currentFolderId]);
  if (errorMsg) return /*#__PURE__*/_react.default.createElement(DisplayError, {
    message: errorMsg
  });else if (fetching && !pageRoot) return /*#__PURE__*/_react.default.createElement(DisplayLoading, {
    message: "Connecting to Box..."
  });
  return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(NavigationCrumbs, {
    setCurrentFolderId: setCurrentFolderId,
    page: page,
    boxCrumbs: boxCrumbs,
    pageRoot: pageRoot
  }), fetching && /*#__PURE__*/_react.default.createElement(DisplayLoading, {
    message: "Fetching Box Data..."
  }), !fetching && folders.map(item => /*#__PURE__*/_react.default.createElement(FolderItem, {
    key: item.id + '_folder',
    item: item,
    setCurrentFolderId: setCurrentFolderId
  })), !fetching && files.map(item => /*#__PURE__*/_react.default.createElement(FileItem, {
    key: item.id + '_file',
    item: item,
    setDisplayItem: setDisplayItem
  })));
}
},{"./styles.css":"Tnu0"}]},{},["S326"], null)
//# sourceMappingURL=/box.js.map