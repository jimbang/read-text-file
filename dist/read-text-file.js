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
    return jschardet.detect(buffer);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhZC10ZXh0LWZpbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcmVhZC10ZXh0LWZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBWSxBQUFFLGFBQU0sQUFBSSxBQUFDO0FBRXpCLElBQVksQUFBSyxnQkFBTSxBQUFZLEFBQUM7QUFDcEMsSUFBSSxBQUFTLFlBQUcsQUFBTyxRQUFDLEFBQVcsQUFBQyxBQUFDO0FBSXJDLGNBQTJCLEFBQVk7O0FBRXRDOzs7Ozs7K0JBQWlCLEFBQVEsU0FBQyxBQUFJLEFBQUMsQUFBQyxBQUVoQzs7O0FBRkksQUFBSSxBQUFHO0FBRVAsQUFBRSw2QkFBVyxBQUFJLEFBQUMsQUFDdEI7QUFBSSxBQUFjLEFBQUMsQUFFbkIsQUFDQSxBQUFDOzs7K0JBQ1csQUFBUSxTQUFDLEFBQUksTUFBRSxBQUFHLEFBQUMsQUFBQyxBQUUvQjs7O0FBRkEsQUFBRSxBQUFHO0FBRUQsQUFBTSxpQ0FBRyxJQUFJLEFBQU0sT0FBQyxBQUFJLEtBQUMsQUFBSSxBQUFDLEFBQUMsQUFDbkM7OytCQUEwQixBQUFRLFNBQUMsQUFBRSxJQUFFLEFBQU0sUUFBRSxBQUFDLEdBQUUsQUFBSSxLQUFDLEFBQUksTUFBRSxBQUFDLEFBQUMsQUFBQzs7O0FBQTVELEFBQWEsQUFBRzs7QUFFcEIsQUFBTSxpQ0FBRyxBQUFNLE9BQUMsQUFBTSxBQUFDLEFBQUMsQUFDekIsQUFBQyxBQUVELEFBQUMsQUFDQSxBQUFFLEFBQUM7Ozs7OzhCQUFFLEFBQUUsT0FBSyxBQUFJLEFBQUMsQUFBSSxJQUFqQixJQUFrQixBQUFFLE9BQUssQUFBUyxBQUFDLEFBQUMsQUFDeEMsQUFBQyxBQUNBOzs7Ozs7K0JBQU0sQUFBUyxVQUFDLEFBQUUsQUFBQyxBQUFDLEFBQ3JCLEFBQUMsQUFDRixBQUFDLEFBRUQsQUFBTTs7Ozs7O3lEQUFDLEFBQU0sQUFBQyxBQUNmLEFB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QUFFLEFBQWdCO0FBRTdGLEFBQU0saUNBQ0wsVUFBVSxBQUFPLFNBQUUsQUFBTTtBQUV4QixBQUFFLFdBQUMsQUFBSSxLQUNOLEFBQUUsSUFDRixBQUFNLFFBQ04sQUFBTSxRQUNOLEFBQU0sUUFDTixBQUFRLFVBQ1IsVUFBVSxBQUFHLEtBQUUsQUFBUyxXQUFFLEFBQU07QUFFL0IsQUFBRSxBQUFDLGdCQUFFLEFBQUksU0FBSyxBQUFHLEFBQUMsQUFBSSxHQUFsQixJQUFtQixBQUFTLGNBQUssQUFBRyxBQUFDLEFBQUMsS0FDMUMsQUFBQztBQUNBLEFBQU0sdUJBQUMsQUFBRyxBQUFDLEFBQUMsQUFDYjtBQUFDLEFBQ0QsQUFBSSxtQkFDSixBQUFDO0FBQ0EsQUFBTyx3QkFBQyxFQUFFLEFBQVMsV0FBRSxBQUFTLFdBQUUsQUFBTSxRQUFFLEFBQU0sQUFBRSxBQUFDLEFBQUMsQUFDbkQ7QUFBQyxBQUNGO0FBQUMsQUFBQyxBQUFDLEFBQ0w7QUFBQyxBQUFDLEFBQUMsQUFDTCxLQXJCUSxBQUFJLEFBQU87QUFxQmxCO0FBRUQsbUJBQW1CLEFBQVU7QUFFNUIsQUFBTSxpQ0FDTCxVQUFVLEFBQU8sU0FBRSxBQUFNO0FBRXhCLEFBQUUsV0FBQyxBQUFLLE1BQ1AsQUFBRSxJQUNGLFVBQVUsQUFBRztBQUVaLEFBQUUsQUFBQyxnQkFBRSxBQUFJLFNBQUssQUFBRyxBQUFDLEFBQUksR0FBbEIsSUFBbUIsQUFBUyxjQUFLLEFBQUcsQUFBQyxBQUFDLEtBQzFDLEFBQUM7QUFDQSxBQUFNLHVCQUFDLEFBQUcsQUFBQyxBQUFDLEFBQ2I7QUFBQyxBQUNELEFBQUksbUJBQ0osQUFBQztBQUNBLEFBQU8sQUFBRSxBQUFDLEFBQ1g7QUFBQyxBQUNGO0FBQUMsQUFBQyxBQUFDLEFBQ0w7QUFBQyxBQUFDLEFBQUMsQUFDTCxLQWpCUSxBQUFJLEFBQU87QUFpQmxCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSBcImZzXCI7XHJcbmltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0ICogYXMgaWNvbnYgZnJvbSBcImljb252LWxpdGVcIjtcclxubGV0IGpzY2hhcmRldCA9IHJlcXVpcmUoXCJqc2NoYXJkZXRcIik7XHJcblxyXG5pbXBvcnQgeyBTdHJpbmdEZWNvZGVyIH0gZnJvbSBcInN0cmluZ19kZWNvZGVyXCI7XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVhZChwYXRoOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz5cclxue1xyXG5cdGxldCBzdGF0ID0gYXdhaXQgZmlsZVN0YXQocGF0aCk7XHJcblxyXG5cdGxldCBmZDogbnVtYmVyID0gbnVsbDtcclxuXHRsZXQgcmVzdWx0OiBzdHJpbmc7XHJcblxyXG5cdHRyeVxyXG5cdHtcclxuXHRcdGZkID0gYXdhaXQgb3BlbkZpbGUocGF0aCwgXCJyXCIpO1xyXG5cclxuXHRcdGxldCBidWZmZXIgPSBuZXcgQnVmZmVyKHN0YXQuc2l6ZSk7XHJcblx0XHRsZXQgcmVhZEJvbVJlc3VsdCA9IGF3YWl0IHJlYWRGaWxlKGZkLCBidWZmZXIsIDAsIHN0YXQuc2l6ZSwgMCk7XHJcblxyXG5cdFx0cmVzdWx0ID0gZGVjb2RlKGJ1ZmZlcik7XHJcblx0fVxyXG5cdGZpbmFsbHlcclxuXHR7XHJcblx0XHRpZiAoKGZkICE9PSBudWxsKSAmJiAoZmQgIT09IHVuZGVmaW5lZCkpXHJcblx0XHR7XHJcblx0XHRcdGF3YWl0IGNsb3NlRmlsZShmZCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVhZFN5bmMocGF0aDogc3RyaW5nKTogc3RyaW5nXHJcbntcclxuXHRsZXQgc3RhdCA9IGZzLnN0YXRTeW5jKHBhdGgpO1xyXG5cclxuXHRsZXQgZmQ6IG51bWJlciA9IG51bGw7XHJcblx0bGV0IHJlc3VsdDogc3RyaW5nO1xyXG5cclxuXHR0cnlcclxuXHR7XHJcblx0XHRmZCA9IGZzLm9wZW5TeW5jKHBhdGgsIFwiclwiKTtcclxuXHJcblx0XHRsZXQgYnVmZmVyID0gbmV3IEJ1ZmZlcihzdGF0LnNpemUpO1xyXG5cdFx0ZnMucmVhZFN5bmMoZmQsIGJ1ZmZlciwgMCwgc3RhdC5zaXplLCAwKTtcclxuXHJcblx0XHRyZXN1bHQgPSBkZWNvZGUoYnVmZmVyKTtcclxuXHR9XHJcblx0ZmluYWxseVxyXG5cdHtcclxuXHRcdGlmICgoZmQgIT09IG51bGwpICYmIChmZCAhPT0gdW5kZWZpbmVkKSlcclxuXHRcdHtcclxuXHRcdFx0ZnMuY2xvc2VTeW5jKGZkKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlY29kZShidWZmZXI6IEJ1ZmZlcikgOiBzdHJpbmdcclxue1xyXG5cdC8vIFRPRE86IGZhbGxiYWNrIGZvciB3aGVuIGNvbmZpZGVuY2UgaXMgdG9vIGxvdz8gKHBhc3MgaXQgYXMgXCJkZWZhdWx0RW5jb2RpbmdcIiBiZWxvdylcclxuXHRsZXQgZW5jb2RpbmdOYW1lID0gZ2V0RW5jb2RpbmdOYW1lKGJ1ZmZlcik7XHJcblx0cmV0dXJuIGljb252LmRlY29kZShidWZmZXIsIGVuY29kaW5nTmFtZSwge3N0cmlwQk9NOiB0cnVlLCBhZGRCT006IGZhbHNlLCBkZWZhdWx0RW5jb2Rpbmc6IFwidXRmLThcIn0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRFbmNvZGluZ05hbWUoYnVmZmVyOiBCdWZmZXIpIDogc3RyaW5nXHJcbntcclxuXHQvLyBUT0RPOiBzZXQgbWluIGNvbmZpZGVuY2U/XHJcblx0cmV0dXJuIGpzY2hhcmRldC5kZXRlY3QoYnVmZmVyKTtcclxufVxyXG5cclxuLy8gVE9ETzogc2hhcmUgdGhlc2UsIG9yIHRyeSBmcy1wcm9taXNlIChvciBzaW1pbGFyKVxyXG5mdW5jdGlvbiBmaWxlU3RhdChwYXRoOiBzdHJpbmcgfCBCdWZmZXIpOiBQcm9taXNlPGZzLlN0YXRzPlxyXG57XHJcblx0cmV0dXJuIG5ldyBQcm9taXNlPGZzLlN0YXRzPihcclxuXHRcdGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpXHJcblx0XHR7XHJcblx0XHRcdGZzLnN0YXQoXHJcblx0XHRcdFx0cGF0aCxcclxuXHRcdFx0XHRmdW5jdGlvbiAoZXJyLCBzdGF0cylcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRpZiAoKG51bGwgIT09IGVycikgJiYgKHVuZGVmaW5lZCAhPT0gZXJyKSlcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0cmVqZWN0KGVycik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoc3RhdHMpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9wZW5GaWxlKHBhdGg6IHN0cmluZyB8IEJ1ZmZlciwgZmxhZ3M6IHN0cmluZyB8IG51bWJlcik6IFByb21pc2U8bnVtYmVyPlxyXG57XHJcblx0cmV0dXJuIG5ldyBQcm9taXNlPG51bWJlcj4oXHJcblx0XHRmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KVxyXG5cdFx0e1xyXG5cdFx0XHRmcy5vcGVuKFxyXG5cdFx0XHRcdHBhdGgsXHJcblx0XHRcdFx0ZmxhZ3MsXHJcblx0XHRcdFx0ZnVuY3Rpb24gKGVyciwgZmQpXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0aWYgKChudWxsICE9PSBlcnIpICYmICh1bmRlZmluZWQgIT09IGVycikpXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHJlamVjdChlcnIpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKGZkKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdH0pO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgUmVhZEZpbGVSZXN1bHRcclxue1xyXG5cdGJ5dGVzUmVhZDogbnVtYmVyO1xyXG5cdGJ1ZmZlcjogQnVmZmVyO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZWFkRmlsZShmZDogbnVtYmVyLCBidWZmZXI6IEJ1ZmZlciwgb2Zmc2V0OiBudW1iZXIsIGxlbmd0aDogbnVtYmVyLCBwb3NpdGlvbjogbnVtYmVyKTogUHJvbWlzZTxSZWFkRmlsZVJlc3VsdD5cclxue1xyXG5cdHJldHVybiBuZXcgUHJvbWlzZTxSZWFkRmlsZVJlc3VsdD4oXHJcblx0XHRmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KVxyXG5cdFx0e1xyXG5cdFx0XHRmcy5yZWFkKFxyXG5cdFx0XHRcdGZkLFxyXG5cdFx0XHRcdGJ1ZmZlcixcclxuXHRcdFx0XHRvZmZzZXQsXHJcblx0XHRcdFx0bGVuZ3RoLFxyXG5cdFx0XHRcdHBvc2l0aW9uLFxyXG5cdFx0XHRcdGZ1bmN0aW9uIChlcnIsIGJ5dGVzUmVhZCwgYnVmZmVyKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGlmICgobnVsbCAhPT0gZXJyKSAmJiAodW5kZWZpbmVkICE9PSBlcnIpKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRyZWplY3QoZXJyKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZSh7IGJ5dGVzUmVhZDogYnl0ZXNSZWFkLCBidWZmZXI6IGJ1ZmZlciB9KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjbG9zZUZpbGUoZmQ6IG51bWJlcik6IFByb21pc2U8dm9pZD5cclxue1xyXG5cdHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPihcclxuXHRcdGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpXHJcblx0XHR7XHJcblx0XHRcdGZzLmNsb3NlKFxyXG5cdFx0XHRcdGZkLFxyXG5cdFx0XHRcdGZ1bmN0aW9uIChlcnIpXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0aWYgKChudWxsICE9PSBlcnIpICYmICh1bmRlZmluZWQgIT09IGVycikpXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHJlamVjdChlcnIpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9KTtcclxufSJdfQ==