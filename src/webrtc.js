"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var events_1 = require("events");
var RTCHelper = /** @class */ (function (_super) {
    __extends(RTCHelper, _super);
    function RTCHelper(name) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.rpc = new RTCPeerConnection();
        _this.candidates = [];
        _this.connected = false;
        _this.tag = "";
        _this.onIceCandidate = function (ev) {
            console.log(_this.tag + "onIceCandidate: " + JSON.stringify(ev.candidate));
            if (ev.candidate)
                _this.candidates.push(ev.candidate);
            _this.emit('ice', ev.candidate);
        };
        _this.onDataChannel = function (ev) {
            console.log(_this.tag + "onDataChannel: " + JSON.stringify(ev.channel));
            _this.setChannel(ev.channel);
        };
        _this.onDataChannelOpen = function (ev) {
            console.log(_this.tag + "onDataChannelOpen: " + ev.type);
            _this.connected = true;
            _this.emit('connected');
        };
        _this.onMessage = function (ev) {
            console.log("" + _this.tag + ev.type + ": " + ev.data);
        };
        if (name)
            _this.tag = "[" + name + "] ";
        _this.rpc.onicecandidate = _this.onIceCandidate;
        _this.rpc.ondatachannel = _this.onDataChannel;
        return _this;
    }
    RTCHelper.prototype.setChannel = function (c) {
        this.dataChannel = c;
        this.dataChannel.onopen = this.onDataChannelOpen;
        this.dataChannel.onmessage = this.onMessage;
    };
    RTCHelper.prototype.waitConnection = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.connected)
                    return [2 /*return*/, Promise.resolve()];
                return [2 /*return*/, new Promise(function (res, rej) { return _this.on('connected', function () { return res(); }); })];
            });
        });
    };
    RTCHelper.prototype.createOffer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log(this.tag + "createOffer");
                        this.setChannel(this.rpc.createDataChannel("chat"));
                        _a = this;
                        return [4 /*yield*/, this.rpc.createOffer()];
                    case 1:
                        _a.offer = _b.sent();
                        return [4 /*yield*/, this.rpc.setLocalDescription(this.offer)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, this.offer];
                }
            });
        });
    };
    RTCHelper.prototype.pushOffer = function (offer) {
        return __awaiter(this, void 0, void 0, function () {
            var answer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(this.tag + "pushOffer: " + JSON.stringify(offer));
                        if (this.offer)
                            throw "can't push offer to already inited rtc connection!";
                        return [4 /*yield*/, this.rpc.setRemoteDescription(offer)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.rpc.createAnswer()];
                    case 2:
                        answer = _a.sent();
                        return [4 /*yield*/, this.rpc.setLocalDescription(answer)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, answer];
                }
            });
        });
    };
    RTCHelper.prototype.pushAnswer = function (answer) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(this.tag + "pushAnswer: " + JSON.stringify(answer));
                        return [4 /*yield*/, this.rpc.setRemoteDescription(answer)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    RTCHelper.prototype.pushIceCandidate = function (candidate) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpc.addIceCandidate(candidate)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return RTCHelper;
}(events_1.EventEmitter));
exports.RTCHelper = RTCHelper;
