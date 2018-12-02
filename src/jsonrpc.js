"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
function notify(method, params, reduced) {
    if (reduced === void 0) { reduced = false; }
    if (reduced)
        return method + "||" + JSON.stringify(params);
    return jrpcs({
        method: method,
        params: params
    });
}
exports.notify = notify;
function error(id, error) {
    return jrpcs({
        id: id,
        error: error
    });
}
exports.error = error;
function result(id, result, reduced) {
    if (reduced === void 0) { reduced = false; }
    if (reduced)
        return "|" + id + "|" + JSON.stringify(result);
    return jrpcs({
        id: id,
        result: result
    });
}
exports.result = result;
function call(method, id, params, reduced) {
    if (reduced === void 0) { reduced = false; }
    if (reduced)
        return method + "|" + id + "|" + JSON.stringify(params);
    return jrpcs({
        method: method,
        id: id,
        params: params
    });
}
exports.call = call;
function jrpc(obj) {
    return Object.assign({}, obj, { jsonrpc: "2.0" });
}
exports.jrpc = jrpc;
function jrpcs(obj) {
    return JSON.stringify(jrpc(obj));
}
exports.jrpcs = jrpcs;
var JsonRpc = /** @class */ (function () {
    function JsonRpc(send, onRequest) {
        var _this = this;
        this.lastOutgoingMsgId = 1;
        this.listeners = {};
        this.onMessage = function (data) {
            var json = JSON.parse(data);
            // console.log(json)
            var id = json.id;
            if (json.method) {
                _this.onRequest(json, function (error, result) { return _this.send(JSON.stringify(__assign({ id: id, jsonrpc: '2.0' }, (error ? { error: error } : { result: result })))); });
            }
            else if (_this.listeners[id]) {
                var m = _this.listeners[id];
                delete _this.listeners[id];
                m(json.error, json.result);
            }
        };
        this.send = send;
        this.onRequest = onRequest;
    }
    JsonRpc.prototype.ping = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.call("ping")];
                    case 1:
                        response = _a.sent();
                        if (response != "pong")
                            throw "JSON-RPC: unknown ping error!";
                        return [2 /*return*/];
                }
            });
        });
    };
    JsonRpc.prototype.callRaw = function (method, args) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                console.log("JSON.RAW: " + method + "(" + JSON.stringify(args) + ")");
                return [2 /*return*/, new Promise(function (res, rej) {
                        var id = _this.getNextMsgId();
                        _this.listeners[id] = function (err, msg) { return err ? rej(err) : res(msg); };
                        console.log("outgoing: " + call(method, id, args));
                        _this.send(call(method, id, args));
                    })];
            });
        });
    };
    JsonRpc.prototype.call = function (method) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.callRaw(method, args)];
            });
        });
    };
    JsonRpc.prototype.getNextMsgId = function () {
        return this.lastOutgoingMsgId++;
    };
    return JsonRpc;
}());
exports.JsonRpc = JsonRpc;
