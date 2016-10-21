"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = _promise2.default))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator.throw(value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var fs = require("fs");
var iconv = require("iconv-lite");
var jschardet = require("jschardet");
function read(path) {
    return __awaiter(this, void 0, void 0, _regenerator2.default.mark(function _callee() {
        var stat, fd, result, buffer, readBomResult;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return fileStat(path);

                    case 2:
                        stat = _context.sent;
                        fd = null;
                        result = void 0;
                        _context.prev = 5;
                        _context.next = 8;
                        return openFile(path, "r");

                    case 8:
                        fd = _context.sent;
                        buffer = new Buffer(stat.size);
                        _context.next = 12;
                        return readFile(fd, buffer, 0, stat.size, 0);

                    case 12:
                        readBomResult = _context.sent;

                        result = decode(buffer);

                    case 14:
                        _context.prev = 14;

                        if (!(fd !== null && fd !== undefined)) {
                            _context.next = 18;
                            break;
                        }

                        _context.next = 18;
                        return closeFile(fd);

                    case 18:
                        return _context.finish(14);

                    case 19:
                        return _context.abrupt("return", result);

                    case 20:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this, [[5,, 14, 19]]);
    }));
}
exports.read = read;
function readSync(path) {
    var stat = fs.statSync(path);
    var fd = null;
    var result = void 0;
    try {
        fd = fs.openSync(path, "r");
        var buffer = new Buffer(stat.size);
        fs.readSync(fd, buffer, 0, stat.size, 0);
        result = decode(buffer);
    } finally {
        if (fd !== null && fd !== undefined) {
            fs.closeSync(fd);
        }
    }
    return result;
}
exports.readSync = readSync;
function decode(buffer) {
    // TODO: fallback for when confidence is too low? (pass it as "defaultEncoding" below)
    var encodingName = getEncodingName(buffer);
    return iconv.decode(buffer, encodingName, { stripBOM: true, addBOM: false, defaultEncoding: "utf-8" });
}
function getEncodingName(buffer) {
    // TODO: set min confidence?
    var result = jschardet.detect(buffer);
    return result.encoding;
}
// TODO: share these, or try fs-promise (or similar)
function fileStat(path) {
    return new _promise2.default(function (resolve, reject) {
        fs.stat(path, function (err, stats) {
            if (null !== err && undefined !== err) {
                reject(err);
            } else {
                resolve(stats);
            }
        });
    });
}
function openFile(path, flags) {
    return new _promise2.default(function (resolve, reject) {
        fs.open(path, flags, function (err, fd) {
            if (null !== err && undefined !== err) {
                reject(err);
            } else {
                resolve(fd);
            }
        });
    });
}
function readFile(fd, buffer, offset, length, position) {
    return new _promise2.default(function (resolve, reject) {
        fs.read(fd, buffer, offset, length, position, function (err, bytesRead, buffer) {
            if (null !== err && undefined !== err) {
                reject(err);
            } else {
                resolve({ bytesRead: bytesRead, buffer: buffer });
            }
        });
    });
}
function closeFile(fd) {
    return new _promise2.default(function (resolve, reject) {
        fs.close(fd, function (err) {
            if (null !== err && undefined !== err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhZC10ZXh0LWZpbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcmVhZC10ZXh0LWZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBWSxBQUFFLGFBQU0sQUFBSSxBQUFDO0FBRXpCLElBQVksQUFBSyxnQkFBTSxBQUFZLEFBQUM7QUFDcEMsSUFBSSxBQUFTLFlBQUcsQUFBTyxRQUFDLEFBQVcsQUFBQyxBQUFDO0FBSXJDLGNBQTJCLEFBQVk7O0FBRXRDOzs7Ozs7K0JBQWlCLEFBQVEsU0FBQyxBQUFJLEFBQUMsQUFBQyxBQUVoQzs7O0FBRkksQUFBSSxBQUFHO0FBRVAsQUFBRSw2QkFBVyxBQUFJLEFBQUMsQUFDdEI7QUFBSSxBQUFjLEFBQUMsQUFFbkIsQUFDQSxBQUFDOzs7K0JBQ1csQUFBUSxTQUFDLEFBQUksTUFBRSxBQUFHLEFBQUMsQUFBQyxBQUUvQjs7O0FBRkEsQUFBRSxBQUFHO0FBRUQsQUFBTSxpQ0FBRyxJQUFJLEFBQU0sT0FBQyxBQUFJLEtBQUMsQUFBSSxBQUFDLEFBQUMsQUFDbkM7OytCQUEwQixBQUFRLFNBQUMsQUFBRSxJQUFFLEFBQU0sUUFBRSxBQUFDLEdBQUUsQUFBSSxLQUFDLEFBQUksTUFBRSxBQUFDLEFBQUMsQUFBQzs7O0FBQTVELEFBQWEsQUFBRzs7QUFFcEIsQUFBTSxpQ0FBRyxBQUFNLE9BQUMsQUFBTSxBQUFDLEFBQUMsQUFDekIsQUFBQyxBQUVELEFBQUMsQUFDQSxBQUFFLEFBQUM7Ozs7OzhCQUFFLEFBQUUsT0FBSyxBQUFJLEFBQUMsQUFBSSxJQUFqQixJQUFrQixBQUFFLE9BQUssQUFBUyxBQUFDLEFBQUMsQUFDeEMsQUFBQyxBQUNBOzs7Ozs7K0JBQU0sQUFBUyxVQUFDLEFBQUUsQUFBQyxBQUFDLEFBQ3JCLEFBQUMsQUFDRixBQUFDLEFBRUQsQUFBTTs7Ozs7O3lEQUFDLEFBQU0sQUFBQyxBQUNmLEFB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IjtcclxuaW1wb3J0ICogYXMgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgKiBhcyBpY29udiBmcm9tIFwiaWNvbnYtbGl0ZVwiO1xyXG5sZXQganNjaGFyZGV0ID0gcmVxdWlyZShcImpzY2hhcmRldFwiKTtcclxuXHJcbmltcG9ydCB7IFN0cmluZ0RlY29kZXIgfSBmcm9tIFwic3RyaW5nX2RlY29kZXJcIjtcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZWFkKHBhdGg6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPlxyXG57XHJcblx0bGV0IHN0YXQgPSBhd2FpdCBmaWxlU3RhdChwYXRoKTtcclxuXHJcblx0bGV0IGZkOiBudW1iZXIgPSBudWxsO1xyXG5cdGxldCByZXN1bHQ6IHN0cmluZztcclxuXHJcblx0dHJ5XHJcblx0e1xyXG5cdFx0ZmQgPSBhd2FpdCBvcGVuRmlsZShwYXRoLCBcInJcIik7XHJcblxyXG5cdFx0bGV0IGJ1ZmZlciA9IG5ldyBCdWZmZXIoc3RhdC5zaXplKTtcclxuXHRcdGxldCByZWFkQm9tUmVzdWx0ID0gYXdhaXQgcmVhZEZpbGUoZmQsIGJ1ZmZlciwgMCwgc3RhdC5zaXplLCAwKTtcclxuXHJcblx0XHRyZXN1bHQgPSBkZWNvZGUoYnVmZmVyKTtcclxuXHR9XHJcblx0ZmluYWxseVxyXG5cdHtcclxuXHRcdGlmICgoZmQgIT09IG51bGwpICYmIChmZCAhPT0gdW5kZWZpbmVkKSlcclxuXHRcdHtcclxuXHRcdFx0YXdhaXQgY2xvc2VGaWxlKGZkKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZWFkU3luYyhwYXRoOiBzdHJpbmcpOiBzdHJpbmdcclxue1xyXG5cdGxldCBzdGF0ID0gZnMuc3RhdFN5bmMocGF0aCk7XHJcblxyXG5cdGxldCBmZDogbnVtYmVyID0gbnVsbDtcclxuXHRsZXQgcmVzdWx0OiBzdHJpbmc7XHJcblxyXG5cdHRyeVxyXG5cdHtcclxuXHRcdGZkID0gZnMub3BlblN5bmMocGF0aCwgXCJyXCIpO1xyXG5cclxuXHRcdGxldCBidWZmZXIgPSBuZXcgQnVmZmVyKHN0YXQuc2l6ZSk7XHJcblx0XHRmcy5yZWFkU3luYyhmZCwgYnVmZmVyLCAwLCBzdGF0LnNpemUsIDApO1xyXG5cclxuXHRcdHJlc3VsdCA9IGRlY29kZShidWZmZXIpO1xyXG5cdH1cclxuXHRmaW5hbGx5XHJcblx0e1xyXG5cdFx0aWYgKChmZCAhPT0gbnVsbCkgJiYgKGZkICE9PSB1bmRlZmluZWQpKVxyXG5cdFx0e1xyXG5cdFx0XHRmcy5jbG9zZVN5bmMoZmQpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZnVuY3Rpb24gZGVjb2RlKGJ1ZmZlcjogQnVmZmVyKSA6IHN0cmluZ1xyXG57XHJcblx0Ly8gVE9ETzogZmFsbGJhY2sgZm9yIHdoZW4gY29uZmlkZW5jZSBpcyB0b28gbG93PyAocGFzcyBpdCBhcyBcImRlZmF1bHRFbmNvZGluZ1wiIGJlbG93KVxyXG5cdGxldCBlbmNvZGluZ05hbWUgPSBnZXRFbmNvZGluZ05hbWUoYnVmZmVyKTtcclxuXHRyZXR1cm4gaWNvbnYuZGVjb2RlKGJ1ZmZlciwgZW5jb2RpbmdOYW1lLCB7c3RyaXBCT006IHRydWUsIGFkZEJPTTogZmFsc2UsIGRlZmF1bHRFbmNvZGluZzogXCJ1dGYtOFwifSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEVuY29kaW5nTmFtZShidWZmZXI6IEJ1ZmZlcikgOiBzdHJpbmdcclxue1xyXG5cdC8vIFRPRE86IHNldCBtaW4gY29uZmlkZW5jZT9cclxuXHRsZXQgcmVzdWx0ID0ganNjaGFyZGV0LmRldGVjdChidWZmZXIpO1xyXG5cdHJldHVybiByZXN1bHQuZW5jb2Rpbmc7XHJcbn1cclxuXHJcbi8vIFRPRE86IHNoYXJlIHRoZXNlLCBvciB0cnkgZnMtcHJvbWlzZSAob3Igc2ltaWxhcilcclxuZnVuY3Rpb24gZmlsZVN0YXQocGF0aDogc3RyaW5nIHwgQnVmZmVyKTogUHJvbWlzZTxmcy5TdGF0cz5cclxue1xyXG5cdHJldHVybiBuZXcgUHJvbWlzZTxmcy5TdGF0cz4oXHJcblx0XHRmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KVxyXG5cdFx0e1xyXG5cdFx0XHRmcy5zdGF0KFxyXG5cdFx0XHRcdHBhdGgsXHJcblx0XHRcdFx0ZnVuY3Rpb24gKGVyciwgc3RhdHMpXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0aWYgKChudWxsICE9PSBlcnIpICYmICh1bmRlZmluZWQgIT09IGVycikpXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHJlamVjdChlcnIpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKHN0YXRzKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBvcGVuRmlsZShwYXRoOiBzdHJpbmcgfCBCdWZmZXIsIGZsYWdzOiBzdHJpbmcgfCBudW1iZXIpOiBQcm9taXNlPG51bWJlcj5cclxue1xyXG5cdHJldHVybiBuZXcgUHJvbWlzZTxudW1iZXI+KFxyXG5cdFx0ZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdClcclxuXHRcdHtcclxuXHRcdFx0ZnMub3BlbihcclxuXHRcdFx0XHRwYXRoLFxyXG5cdFx0XHRcdGZsYWdzLFxyXG5cdFx0XHRcdGZ1bmN0aW9uIChlcnIsIGZkKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGlmICgobnVsbCAhPT0gZXJyKSAmJiAodW5kZWZpbmVkICE9PSBlcnIpKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRyZWplY3QoZXJyKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShmZCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9KTtcclxufVxyXG5cclxuaW50ZXJmYWNlIFJlYWRGaWxlUmVzdWx0XHJcbntcclxuXHRieXRlc1JlYWQ6IG51bWJlcjtcclxuXHRidWZmZXI6IEJ1ZmZlcjtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVhZEZpbGUoZmQ6IG51bWJlciwgYnVmZmVyOiBCdWZmZXIsIG9mZnNldDogbnVtYmVyLCBsZW5ndGg6IG51bWJlciwgcG9zaXRpb246IG51bWJlcik6IFByb21pc2U8UmVhZEZpbGVSZXN1bHQ+XHJcbntcclxuXHRyZXR1cm4gbmV3IFByb21pc2U8UmVhZEZpbGVSZXN1bHQ+KFxyXG5cdFx0ZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdClcclxuXHRcdHtcclxuXHRcdFx0ZnMucmVhZChcclxuXHRcdFx0XHRmZCxcclxuXHRcdFx0XHRidWZmZXIsXHJcblx0XHRcdFx0b2Zmc2V0LFxyXG5cdFx0XHRcdGxlbmd0aCxcclxuXHRcdFx0XHRwb3NpdGlvbixcclxuXHRcdFx0XHRmdW5jdGlvbiAoZXJyLCBieXRlc1JlYWQsIGJ1ZmZlcilcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRpZiAoKG51bGwgIT09IGVycikgJiYgKHVuZGVmaW5lZCAhPT0gZXJyKSlcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0cmVqZWN0KGVycik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoeyBieXRlc1JlYWQ6IGJ5dGVzUmVhZCwgYnVmZmVyOiBidWZmZXIgfSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2xvc2VGaWxlKGZkOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+XHJcbntcclxuXHRyZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oXHJcblx0XHRmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KVxyXG5cdFx0e1xyXG5cdFx0XHRmcy5jbG9zZShcclxuXHRcdFx0XHRmZCxcclxuXHRcdFx0XHRmdW5jdGlvbiAoZXJyKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGlmICgobnVsbCAhPT0gZXJyKSAmJiAodW5kZWZpbmVkICE9PSBlcnIpKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRyZWplY3QoZXJyKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZSgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcbn0iXX0=