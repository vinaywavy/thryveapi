"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _axios = require("axios");
var _qs = require("qs");
var _app = require("firebase/app");
var _firestore = require("firebase/firestore");
var dotenv = _interopRequireWildcard(require("dotenv"));
var _nodeCron = require("node-cron");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
dotenv.config();
var tDate = new Date();
var tDay = tDate.toISOString().substring(0, 10);
var utcTime = 'T00:00:00+01:00';
var today = tDay.concat(utcTime);
var tomDate = new Date(tDate.getTime() + 24 * 60 * 60 * 1000).toISOString().substring(0, 10);
var tomorrow = tomDate.concat(utcTime);
var authData = _qs.stringify({
  'authenticationToken': process.env.AUTHENTICATION_TOKEN,
  'startTimestamp': "".concat(today),
  'endTimestamp': "".concat(tomorrow),
  'dataSources': '2',
  'valueTypes': '3000',
  'detailed': 'false'
});
var config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://api.und-gesund.de/v5/dynamicEpochValues',
  headers: {
    'AppAuthorization': process.env.APP_AUTHORIZATION,
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': process.env.AUTHORIZATION
  },
  data: authData
};
var heartRate = [];
var firebaseApp = (0, _app.initializeApp)({
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID
});
var firestore = (0, _firestore.getFirestore)();
var date = new Date().toISOString().substring(0, 10);
var specialOfTheDay = (0, _firestore.doc)(firestore, "Cardio/".concat(date));
function getEpochVal() {
  return _getEpochVal.apply(this, arguments);
} //getEpochVal()
function _getEpochVal() {
  _getEpochVal = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _axios.axios)(config).then(function (response) {
            var thryveData = response.data;
            var destructredData = thryveData[0].dataSources[0].data;
            //console.log(destructredData)
            heartRate = (0, _toConsumableArray2["default"])(destructredData);
            console.log("Length of the Array is ".concat(heartRate.length));
            setTimeout(function () {
              writeDailySpecial();
              console.log("Data has been updated on ".concat(tDate, " in the firebase"));
            }, 50000);
          })["catch"](function (error) {
            console.log(error);
          });
        case 2:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _getEpochVal.apply(this, arguments);
}
function writeDailySpecial() {
  return _writeDailySpecial.apply(this, arguments);
}
function _writeDailySpecial() {
  _writeDailySpecial = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var docData;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          docData = _objectSpread({}, heartRate);
          _context2.prev = 1;
          _context2.next = 4;
          return (0, _firestore.setDoc)(specialOfTheDay, docData, {
            merge: true
          });
        case 4:
          console.log("This has been updated in the fire database");
          _context2.next = 10;
          break;
        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](1);
          console.log("I got an error ".concat(_context2.t0));
        case 10:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[1, 7]]);
  }));
  return _writeDailySpecial.apply(this, arguments);
}
var task = _nodeCron.schedule('*/2 * * * *', getEpochVal);
task.start();
