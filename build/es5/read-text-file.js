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
var string_decoder_1 = require("string_decoder");
function read(path) {
    return __awaiter(this, void 0, void 0, _regenerator2.default.mark(function _callee() {
        var stat, fd, result, buffer, readBomResult, encodingInfo, decoder, textOffset, textSize, readFileResult;
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
                        buffer = new Buffer(maxBomLength);
                        _context.next = 12;
                        return readFile(fd, buffer, 0, maxBomLength, 0);

                    case 12:
                        readBomResult = _context.sent;
                        encodingInfo = getEncodingInfo(readBomResult.buffer);
                        decoder = new string_decoder_1.StringDecoder(encodingInfo.encoding);
                        textOffset = encodingInfo.bomLength;
                        textSize = stat.size - encodingInfo.bomLength;

                        buffer = new Buffer(textSize);
                        _context.next = 20;
                        return readFile(fd, buffer, 0, textSize, encodingInfo.bomLength);

                    case 20:
                        readFileResult = _context.sent;

                        result = decoder.write(readFileResult.buffer);

                    case 22:
                        _context.prev = 22;

                        if (!(fd !== null && fd !== undefined)) {
                            _context.next = 26;
                            break;
                        }

                        _context.next = 26;
                        return closeFile(fd);

                    case 26:
                        return _context.finish(22);

                    case 27:
                        return _context.abrupt("return", result);

                    case 28:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this, [[5,, 22, 27]]);
    }));
}
exports.read = read;
function readSync(path) {
    var stat = fs.statSync(path);
    var fd = null;
    var result = void 0;
    try {
        fd = fs.openSync(path, "r");
        var buffer = new Buffer(maxBomLength);
        fs.readSync(fd, buffer, 0, maxBomLength, 0);
        var encodingInfo = getEncodingInfo(buffer);
        var decoder = new string_decoder_1.StringDecoder(encodingInfo.encoding);
        var textOffset = encodingInfo.bomLength;
        var textSize = stat.size - encodingInfo.bomLength;
        buffer = new Buffer(textSize);
        fs.readSync(fd, buffer, 0, textSize, encodingInfo.bomLength);
        result = decoder.write(buffer);
    } finally {
        if (fd !== null && fd !== undefined) {
            fs.closeSync(fd);
        }
    }
    return result;
}
exports.readSync = readSync;
function getEncodingInfo(buffer) {
    var encoding = defaultTextFileEncoding;
    var bomLength = 0;
    for (var bomMapItemName in bomMap) {
        var bomMapItem = bomMap[bomMapItemName];
        if (isBomMatch(bomMapItem, buffer)) {
            if (typeof bomMapItem.encoding !== "string") {
                throw new Error("Unsupported text file encoding");
            }
            bomLength = bomMapItem.bom.length;
            encoding = bomMapItem.encoding;
            break;
        }
    }
    return { encoding: encoding, bomLength: bomLength };
}
var utf8FileTextEncoding = "utf-8";
var defaultTextFileEncoding = utf8FileTextEncoding;
var bomMap = {
    bomUTF_8: { bom: [0xEF, 0xBB, 0xBF], encoding: utf8FileTextEncoding },
    bomUTF_16_BE: { bom: [0xFE, 0xFF], encoding: "" },
    bomUTF_16_LE: { bom: [0xFF, 0xFE], encoding: "" },
    bomUTF_32_BE: { bom: [0x00, 0x00, 0xFE, 0xFF], encoding: "" },
    bomUTF_32_LE: { bom: [0xFF, 0xFE, 0x00, 0x00], encoding: "" },
    bomUTF_7_a: { bom: [0x2B, 0x2F, 0x76, 0x38], encoding: "" },
    bomUTF_7_b: { bom: [0x2B, 0x2F, 0x76, 0x39], encoding: "" },
    bomUTF_7_c: { bom: [0x2B, 0x2F, 0x76, 0x2B], encoding: "" },
    bomUTF_7_d: { bom: [0x2B, 0x2F, 0x76, 0x2F], encoding: "" },
    bomUTF_7_e: { bom: [0x2B, 0x2F, 0x76, 0x38, 0x2D], encoding: "" },
    bomUTF_1: { bom: [0xF7, 0x64, 0x4C], encoding: "" },
    bomUTF_EBCDIC: { bom: [0xDD, 0x73, 0x66, 0x73], encoding: "" },
    bomSCSU: { bom: [0x0E, 0xFE, 0xFF], encoding: "" },
    bomBOCU_1: { bom: [0xFB, 0xEE, 0x28], encoding: "" },
    bomGB_18030: { bom: [0x84, 0x31, 0x95, 0x33], encoding: "" }
};
var maxBomLength = 0;
for (var bomMapItemName in bomMap) {
    var bomMapItem = bomMap[bomMapItemName];
    maxBomLength = Math.max(maxBomLength, bomMapItem.bom.length);
}
function isBomMatch(mapItem, bom) {
    if (bom.length < mapItem.bom.length) {
        return false;
    }
    for (var i = 0; i < mapItem.bom.length; i++) {
        if (bom[i] != mapItem.bom[i]) {
            return false;
        }
    }
    return true;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhZC10ZXh0LWZpbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVhZC10ZXh0LWZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBWSxBQUFFLGFBQU0sQUFBSSxBQUFDO0FBR3pCLCtCQUE4QixBQUFnQixBQUFDO0FBRS9DLGNBQTJCLEFBQVk7O0FBRXRDOzs7Ozs7K0JBQWlCLEFBQVEsU0FBQyxBQUFJLEFBQUMsQUFBQyxBQUVoQzs7O0FBRkksQUFBSSxBQUFHO0FBRVAsQUFBRSw2QkFBVyxBQUFJLEFBQUMsQUFDdEI7QUFBSSxBQUFjLEFBQUMsQUFFbkIsQUFDQSxBQUFDOzs7K0JBQ1csQUFBUSxTQUFDLEFBQUksTUFBRSxBQUFHLEFBQUMsQUFBQyxBQUUvQjs7O0FBRkEsQUFBRSxBQUFHO0FBRUQsQUFBTSxpQ0FBRyxJQUFJLEFBQU0sT0FBQyxBQUFZLEFBQUMsQUFBQyxBQUN0Qzs7K0JBQTBCLEFBQVEsU0FBQyxBQUFFLElBQUUsQUFBTSxRQUFFLEFBQUMsR0FBRSxBQUFZLGNBQUUsQUFBQyxBQUFDLEFBQUMsQUFFbkU7OztBQUZJLEFBQWEsQUFBRztBQUVoQixBQUFZLHVDQUFHLEFBQWUsZ0JBQUMsQUFBYSxjQUFDLEFBQU0sQUFBQyxBQUFDLEFBRXpEO0FBQUksQUFBTyxrQ0FBRyxJQUFJLGlCQUFhLGNBQUMsQUFBWSxhQUFDLEFBQVEsQUFBQyxBQUFDLEFBRXZEO0FBQUksQUFBVSxxQ0FBRyxBQUFZLGFBQUMsQUFBUyxBQUFDLEFBQ3hDO0FBQUksQUFBUSxtQ0FBRyxBQUFJLEtBQUMsQUFBSSxPQUFHLEFBQVksYUFBQyxBQUFTLEFBQUM7O0FBRWxELEFBQU0saUNBQUcsSUFBSSxBQUFNLE9BQUMsQUFBUSxBQUFDLEFBQUMsQUFDOUI7OytCQUEyQixBQUFRLFNBQUMsQUFBRSxJQUFFLEFBQU0sUUFBRSxBQUFDLEdBQUUsQUFBUSxV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S0FyQlEsQUFBSSxBQUFPO0FBcUJsQjtBQUVELG1CQUFtQixBQUFVO0FBRTVCLEFBQU0saUNBQ0wsVUFBVSxBQUFPLFNBQUUsQUFBTTtBQUV4QixBQUFFLFdBQUMsQUFBSyxNQUNQLEFBQUUsSUFDRixVQUFVLEFBQUc7QUFFWixBQUFFLEFBQUMsZ0JBQUUsQUFBSSxTQUFLLEFBQUcsQUFBQyxBQUFJLEdBQWxCLElBQW1CLEFBQVMsY0FBSyxBQUFHLEFBQUMsQUFBQyxLQUMxQyxBQUFDO0FBQ0EsQUFBTSx1QkFBQyxBQUFHLEFBQUMsQUFBQyxBQUNiO0FBQUMsQUFDRCxBQUFJLG1CQUNKLEFBQUM7QUFDQSxBQUFPLEFBQUUsQUFBQyxBQUNYO0FBQUMsQUFDRjtBQUFDLEFBQUMsQUFBQyxBQUNMO0FBQUMsQUFBQyxBQUFDLEFBQ0wsS0FqQlEsQUFBSSxBQUFPO0FBaUJsQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gXCJmc1wiO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tIFwicGF0aFwiO1xuXG5pbXBvcnQgeyBTdHJpbmdEZWNvZGVyIH0gZnJvbSBcInN0cmluZ19kZWNvZGVyXCI7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZWFkKHBhdGg6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPlxue1xuXHRsZXQgc3RhdCA9IGF3YWl0IGZpbGVTdGF0KHBhdGgpO1xuXG5cdGxldCBmZDogbnVtYmVyID0gbnVsbDtcblx0bGV0IHJlc3VsdDogc3RyaW5nO1xuXG5cdHRyeVxuXHR7XG5cdFx0ZmQgPSBhd2FpdCBvcGVuRmlsZShwYXRoLCBcInJcIik7XG5cblx0XHRsZXQgYnVmZmVyID0gbmV3IEJ1ZmZlcihtYXhCb21MZW5ndGgpO1xuXHRcdGxldCByZWFkQm9tUmVzdWx0ID0gYXdhaXQgcmVhZEZpbGUoZmQsIGJ1ZmZlciwgMCwgbWF4Qm9tTGVuZ3RoLCAwKTtcblxuXHRcdGxldCBlbmNvZGluZ0luZm8gPSBnZXRFbmNvZGluZ0luZm8ocmVhZEJvbVJlc3VsdC5idWZmZXIpO1xuXG5cdFx0bGV0IGRlY29kZXIgPSBuZXcgU3RyaW5nRGVjb2RlcihlbmNvZGluZ0luZm8uZW5jb2RpbmcpO1xuXG5cdFx0bGV0IHRleHRPZmZzZXQgPSBlbmNvZGluZ0luZm8uYm9tTGVuZ3RoO1xuXHRcdGxldCB0ZXh0U2l6ZSA9IHN0YXQuc2l6ZSAtIGVuY29kaW5nSW5mby5ib21MZW5ndGg7XG5cblx0XHRidWZmZXIgPSBuZXcgQnVmZmVyKHRleHRTaXplKTtcblx0XHRsZXQgcmVhZEZpbGVSZXN1bHQgPSBhd2FpdCByZWFkRmlsZShmZCwgYnVmZmVyLCAwLCB0ZXh0U2l6ZSwgZW5jb2RpbmdJbmZvLmJvbUxlbmd0aCk7XG5cblx0XHRyZXN1bHQgPSBkZWNvZGVyLndyaXRlKHJlYWRGaWxlUmVzdWx0LmJ1ZmZlcik7XG5cdH1cblx0ZmluYWxseVxuXHR7XG5cdFx0aWYgKChmZCAhPT0gbnVsbCkgJiYgKGZkICE9PSB1bmRlZmluZWQpKVxuXHRcdHtcblx0XHRcdGF3YWl0IGNsb3NlRmlsZShmZCk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlYWRTeW5jKHBhdGg6IHN0cmluZyk6IHN0cmluZ1xue1xuXHRsZXQgc3RhdCA9IGZzLnN0YXRTeW5jKHBhdGgpO1xuXG5cdGxldCBmZDogbnVtYmVyID0gbnVsbDtcblx0bGV0IHJlc3VsdDogc3RyaW5nO1xuXG5cdHRyeVxuXHR7XG5cdFx0ZmQgPSBmcy5vcGVuU3luYyhwYXRoLCBcInJcIik7XG5cblx0XHRsZXQgYnVmZmVyID0gbmV3IEJ1ZmZlcihtYXhCb21MZW5ndGgpO1xuXHRcdGZzLnJlYWRTeW5jKGZkLCBidWZmZXIsIDAsIG1heEJvbUxlbmd0aCwgMCk7XG5cblx0XHRsZXQgZW5jb2RpbmdJbmZvID0gZ2V0RW5jb2RpbmdJbmZvKGJ1ZmZlcik7XG5cblx0XHRsZXQgZGVjb2RlciA9IG5ldyBTdHJpbmdEZWNvZGVyKGVuY29kaW5nSW5mby5lbmNvZGluZyk7XG5cblx0XHRsZXQgdGV4dE9mZnNldCA9IGVuY29kaW5nSW5mby5ib21MZW5ndGg7XG5cdFx0bGV0IHRleHRTaXplID0gc3RhdC5zaXplIC0gZW5jb2RpbmdJbmZvLmJvbUxlbmd0aDtcblxuXHRcdGJ1ZmZlciA9IG5ldyBCdWZmZXIodGV4dFNpemUpO1xuXHRcdGZzLnJlYWRTeW5jKGZkLCBidWZmZXIsIDAsIHRleHRTaXplLCBlbmNvZGluZ0luZm8uYm9tTGVuZ3RoKTtcblxuXHRcdHJlc3VsdCA9IGRlY29kZXIud3JpdGUoYnVmZmVyKTtcblx0fVxuXHRmaW5hbGx5XG5cdHtcblx0XHRpZiAoKGZkICE9PSBudWxsKSAmJiAoZmQgIT09IHVuZGVmaW5lZCkpXG5cdFx0e1xuXHRcdFx0ZnMuY2xvc2VTeW5jKGZkKTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG5pbnRlcmZhY2UgRW5jb2RpbmdJbmZvXG57XG5cdGVuY29kaW5nOiBzdHJpbmc7XG5cdGJvbUxlbmd0aDogbnVtYmVyO1xufVxuXG5mdW5jdGlvbiBnZXRFbmNvZGluZ0luZm8oYnVmZmVyOiBCdWZmZXIpOiBFbmNvZGluZ0luZm9cbntcblx0bGV0IGVuY29kaW5nID0gZGVmYXVsdFRleHRGaWxlRW5jb2Rpbmc7XG5cdGxldCBib21MZW5ndGggPSAwO1xuXG5cdGZvciAobGV0IGJvbU1hcEl0ZW1OYW1lIGluIGJvbU1hcClcblx0e1xuXHRcdGxldCBib21NYXBJdGVtID0gKGJvbU1hcCBhcyBhbnkpW2JvbU1hcEl0ZW1OYW1lXSBhcyBCb21NYXBJdGVtO1xuXG5cdFx0aWYgKGlzQm9tTWF0Y2goYm9tTWFwSXRlbSwgYnVmZmVyKSlcblx0XHR7XG5cdFx0XHRpZiAoKHR5cGVvZiAoYm9tTWFwSXRlbS5lbmNvZGluZykgIT09IFwic3RyaW5nXCIpKVxuXHRcdFx0e1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbnN1cHBvcnRlZCB0ZXh0IGZpbGUgZW5jb2RpbmdcIik7XG5cdFx0XHR9XG5cblx0XHRcdGJvbUxlbmd0aCA9IGJvbU1hcEl0ZW0uYm9tLmxlbmd0aDtcblx0XHRcdGVuY29kaW5nID0gYm9tTWFwSXRlbS5lbmNvZGluZztcblxuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHsgZW5jb2Rpbmc6IGVuY29kaW5nLCBib21MZW5ndGg6IGJvbUxlbmd0aCB9O1xufVxuXG5pbnRlcmZhY2UgQm9tTWFwSXRlbVxue1xuXHRib206IG51bWJlcltdO1xuXHRlbmNvZGluZzogc3RyaW5nO1xufVxuXG5jb25zdCB1dGY4RmlsZVRleHRFbmNvZGluZyA9IFwidXRmLThcIjtcbmNvbnN0IGRlZmF1bHRUZXh0RmlsZUVuY29kaW5nID0gdXRmOEZpbGVUZXh0RW5jb2Rpbmc7XG5cbmxldCBib21NYXAgPVxuXHR7XG5cdFx0Ym9tVVRGXzg6IHsgYm9tOiBbMHhFRiwgMHhCQiwgMHhCRl0sIGVuY29kaW5nOiB1dGY4RmlsZVRleHRFbmNvZGluZyB9IGFzIEJvbU1hcEl0ZW0sXG5cblx0XHRib21VVEZfMTZfQkU6IHsgYm9tOiBbMHhGRSwgMHhGRl0sIGVuY29kaW5nOiBcIlwiIH0gYXMgQm9tTWFwSXRlbSxcblx0XHRib21VVEZfMTZfTEU6IHsgYm9tOiBbMHhGRiwgMHhGRV0sIGVuY29kaW5nOiBcIlwiIH0gYXMgQm9tTWFwSXRlbSxcblxuXHRcdGJvbVVURl8zMl9CRTogeyBib206IFsweDAwLCAweDAwLCAweEZFLCAweEZGXSwgZW5jb2Rpbmc6IFwiXCIgfSBhcyBCb21NYXBJdGVtLFxuXHRcdGJvbVVURl8zMl9MRTogeyBib206IFsweEZGLCAweEZFLCAweDAwLCAweDAwXSwgZW5jb2Rpbmc6IFwiXCIgfSBhcyBCb21NYXBJdGVtLFxuXG5cdFx0Ym9tVVRGXzdfYTogeyBib206IFsweDJCLCAweDJGLCAweDc2LCAweDM4XSwgZW5jb2Rpbmc6IFwiXCIgfSBhcyBCb21NYXBJdGVtLFxuXHRcdGJvbVVURl83X2I6IHsgYm9tOiBbMHgyQiwgMHgyRiwgMHg3NiwgMHgzOV0sIGVuY29kaW5nOiBcIlwiIH0gYXMgQm9tTWFwSXRlbSxcblx0XHRib21VVEZfN19jOiB7IGJvbTogWzB4MkIsIDB4MkYsIDB4NzYsIDB4MkJdLCBlbmNvZGluZzogXCJcIiB9IGFzIEJvbU1hcEl0ZW0sXG5cdFx0Ym9tVVRGXzdfZDogeyBib206IFsweDJCLCAweDJGLCAweDc2LCAweDJGXSwgZW5jb2Rpbmc6IFwiXCIgfSBhcyBCb21NYXBJdGVtLFxuXHRcdGJvbVVURl83X2U6IHsgYm9tOiBbMHgyQiwgMHgyRiwgMHg3NiwgMHgzOCwgMHgyRF0sIGVuY29kaW5nOiBcIlwiIH0gYXMgQm9tTWFwSXRlbSxcblxuXHRcdGJvbVVURl8xOiB7IGJvbTogWzB4RjcsIDB4NjQsIDB4NENdLCBlbmNvZGluZzogXCJcIiB9IGFzIEJvbU1hcEl0ZW0sXG5cblx0XHRib21VVEZfRUJDRElDOiB7IGJvbTogWzB4REQsIDB4NzMsIDB4NjYsIDB4NzNdLCBlbmNvZGluZzogXCJcIiB9IGFzIEJvbU1hcEl0ZW0sXG5cblx0XHRib21TQ1NVOiB7IGJvbTogWzB4MEUsIDB4RkUsIDB4RkZdLCBlbmNvZGluZzogXCJcIiB9IGFzIEJvbU1hcEl0ZW0sXG5cblx0XHRib21CT0NVXzE6IHsgYm9tOiBbMHhGQiwgMHhFRSwgMHgyOF0sIGVuY29kaW5nOiBcIlwiIH0gYXMgQm9tTWFwSXRlbSxcblxuXHRcdGJvbUdCXzE4MDMwOiB7IGJvbTogWzB4ODQsIDB4MzEsIDB4OTUsIDB4MzNdLCBlbmNvZGluZzogXCJcIiB9IGFzIEJvbU1hcEl0ZW0sXG5cdH07XG5cbmxldCBtYXhCb21MZW5ndGg6IG51bWJlciA9IDA7XG5cbmZvciAobGV0IGJvbU1hcEl0ZW1OYW1lIGluIGJvbU1hcClcbntcblx0bGV0IGJvbU1hcEl0ZW0gPSAoYm9tTWFwIGFzIGFueSlbYm9tTWFwSXRlbU5hbWVdIGFzIEJvbU1hcEl0ZW07XG5cdG1heEJvbUxlbmd0aCA9IE1hdGgubWF4KG1heEJvbUxlbmd0aCwgYm9tTWFwSXRlbS5ib20ubGVuZ3RoKTtcbn1cblxuZnVuY3Rpb24gaXNCb21NYXRjaChtYXBJdGVtOiBCb21NYXBJdGVtLCBib206IEJ1ZmZlcilcbntcblx0aWYgKGJvbS5sZW5ndGggPCBtYXBJdGVtLmJvbS5sZW5ndGgpXG5cdHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRmb3IgKGxldCBpID0gMDsgaSA8IG1hcEl0ZW0uYm9tLmxlbmd0aDsgaSsrKVxuXHR7XG5cdFx0aWYgKGJvbVtpXSAhPSBtYXBJdGVtLmJvbVtpXSlcblx0XHR7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRydWU7XG59XG5cbi8vIFRPRE86IHNoYXJlIHRoZXNlLCBvciB0cnkgZnMtcHJvbWlzZSAob3Igc2ltaWxhcilcbmZ1bmN0aW9uIGZpbGVTdGF0KHBhdGg6IHN0cmluZyB8IEJ1ZmZlcik6IFByb21pc2U8ZnMuU3RhdHM+XG57XG5cdHJldHVybiBuZXcgUHJvbWlzZTxmcy5TdGF0cz4oXG5cdFx0ZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdClcblx0XHR7XG5cdFx0XHRmcy5zdGF0KFxuXHRcdFx0XHRwYXRoLFxuXHRcdFx0XHRmdW5jdGlvbiAoZXJyLCBzdGF0cylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGlmICgobnVsbCAhPT0gZXJyKSAmJiAodW5kZWZpbmVkICE9PSBlcnIpKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHJlamVjdChlcnIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0cmVzb2x2ZShzdGF0cyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHR9KTtcbn1cblxuZnVuY3Rpb24gb3BlbkZpbGUocGF0aDogc3RyaW5nIHwgQnVmZmVyLCBmbGFnczogc3RyaW5nIHwgbnVtYmVyKTogUHJvbWlzZTxudW1iZXI+XG57XG5cdHJldHVybiBuZXcgUHJvbWlzZTxudW1iZXI+KFxuXHRcdGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpXG5cdFx0e1xuXHRcdFx0ZnMub3Blbihcblx0XHRcdFx0cGF0aCxcblx0XHRcdFx0ZmxhZ3MsXG5cdFx0XHRcdGZ1bmN0aW9uIChlcnIsIGZkKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0aWYgKChudWxsICE9PSBlcnIpICYmICh1bmRlZmluZWQgIT09IGVycikpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0cmVqZWN0KGVycik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKGZkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdH0pO1xufVxuXG5pbnRlcmZhY2UgUmVhZEZpbGVSZXN1bHRcbntcblx0Ynl0ZXNSZWFkOiBudW1iZXI7XG5cdGJ1ZmZlcjogQnVmZmVyO1xufVxuXG5mdW5jdGlvbiByZWFkRmlsZShmZDogbnVtYmVyLCBidWZmZXI6IEJ1ZmZlciwgb2Zmc2V0OiBudW1iZXIsIGxlbmd0aDogbnVtYmVyLCBwb3NpdGlvbjogbnVtYmVyKTogUHJvbWlzZTxSZWFkRmlsZVJlc3VsdD5cbntcblx0cmV0dXJuIG5ldyBQcm9taXNlPFJlYWRGaWxlUmVzdWx0Pihcblx0XHRmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KVxuXHRcdHtcblx0XHRcdGZzLnJlYWQoXG5cdFx0XHRcdGZkLFxuXHRcdFx0XHRidWZmZXIsXG5cdFx0XHRcdG9mZnNldCxcblx0XHRcdFx0bGVuZ3RoLFxuXHRcdFx0XHRwb3NpdGlvbixcblx0XHRcdFx0ZnVuY3Rpb24gKGVyciwgYnl0ZXNSZWFkLCBidWZmZXIpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpZiAoKG51bGwgIT09IGVycikgJiYgKHVuZGVmaW5lZCAhPT0gZXJyKSlcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRyZWplY3QoZXJyKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHJlc29sdmUoeyBieXRlc1JlYWQ6IGJ5dGVzUmVhZCwgYnVmZmVyOiBidWZmZXIgfSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHR9KTtcbn1cblxuZnVuY3Rpb24gY2xvc2VGaWxlKGZkOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+XG57XG5cdHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPihcblx0XHRmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KVxuXHRcdHtcblx0XHRcdGZzLmNsb3NlKFxuXHRcdFx0XHRmZCxcblx0XHRcdFx0ZnVuY3Rpb24gKGVycilcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGlmICgobnVsbCAhPT0gZXJyKSAmJiAodW5kZWZpbmVkICE9PSBlcnIpKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHJlamVjdChlcnIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0fSk7XG59Il19