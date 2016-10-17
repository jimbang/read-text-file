"use strict";

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
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
function readTextFile(path) {
    return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee() {
        var stat, fd, result, buffer, readBomResult, encodingInfo, decoder, textOffset, textSize, readFileResult;
        return regeneratorRuntime.wrap(function _callee$(_context) {
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
exports.readTextFile = readTextFile;
function readTextFileSync(path) {
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
exports.readTextFileSync = readTextFileSync;
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
// TODO: support others? at least utf-16??
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
    return new Promise(function (resolve, reject) {
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
    return new Promise(function (resolve, reject) {
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
    return new Promise(function (resolve, reject) {
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
    return new Promise(function (resolve, reject) {
        fs.close(fd, function (err) {
            if (null !== err && undefined !== err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhZC10ZXh0LWZpbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVhZC10ZXh0LWZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFZLEFBQUUsYUFBTSxBQUFJLEFBQUM7QUFHekIsK0JBQThCLEFBQWdCLEFBQUM7QUFFL0Msc0JBQW1DLEFBQVk7O0FBRTlDOzs7Ozs7K0JBQWlCLEFBQVEsU0FBQyxBQUFJLEFBQUMsQUFBQyxBQUVoQzs7O0FBRkksQUFBSSxBQUFHO0FBRVAsQUFBRSw2QkFBVyxBQUFJLEFBQUMsQUFDdEI7QUFBSSxBQUFjLEFBQUMsQUFFbkIsQUFDQSxBQUFDOzs7K0JBQ1csQUFBUSxTQUFDLEFBQUksTUFBRSxBQUFHLEFBQUMsQUFBQyxBQUUvQjs7O0FBRkEsQUFBRSxBQUFHO0FBRUQsQUFBTSxpQ0FBRyxJQUFJLEFBQU0sT0FBQyxBQUFZLEFBQUMsQUFBQyxBQUN0Qzs7K0JBQTBCLEFBQVEsU0FBQyxBQUFFLElBQUUsQUFBTSxRQUFFLEFBQUMsR0FBRSxBQUFZLGNBQUUsQUFBQyxBQUFDLEFBQUMsQUFFbkU7OztBQUZJLEFBQWEsQUFBRztBQUVoQixBQUFZLHVDQUFHLEFBQWUsZ0JBQUMsQUFBYSxjQUFDLEFBQU0sQUFBQyxBQUFDLEFBRXpEO0FBQUksQUFBTyxrQ0FBRyxJQUFJLGlCQUFhLGNBQUMsQUFBWSxhQUFDLEFBQVEsQUFBQyxBQUFDLEFBRXZEO0FBQUksQUFBVSxxQ0FBRyxBQUFZLGFBQUMsQUFBUyxBQUFDLEFBQ3hDO0FBQUksQUFBUSxtQ0FBRyxBQUFJLEtBQUMsQUFBSSxPQUFHLEFBQVksYUFBQyxBQUFTLEFBQUM7O0FBRWxELEFBQU0saUNBQUcsSUFBSSxBQUFNLE9BQUMsQUFBUSxBQUFDLEFBQUMsQUFDOUI7OytCQUEyQixBQUFRLFNBQUMsQUFBRSxJQUFFLEFBQU0sUUFBRSxBQUFDLEdBQUUsQUFBUSxVQUFFLEFBQVks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QUMsQUFBQyxBQUNMLEtBckJRO0FBcUJQO0FBRUQsbUJBQW1CLEFBQVU7QUFFNUIsQUFBTSxlQUFLLEFBQU8sUUFDakIsVUFBVSxBQUFPLFNBQUUsQUFBTTtBQUV4QixBQUFFLFdBQUMsQUFBSyxNQUNQLEFBQUUsSUFDRixVQUFVLEFBQUc7QUFFWixBQUFFLEFBQUMsZ0JBQUUsQUFBSSxTQUFLLEFBQUcsQUFBQyxBQUFJLEdBQWxCLElBQW1CLEFBQVMsY0FBSyxBQUFHLEFBQUMsQUFBQyxLQUMxQyxBQUFDO0FBQ0EsQUFBTSx1QkFBQyxBQUFHLEFBQUMsQUFBQyxBQUNiO0FBQUMsQUFDRCxBQUFJLG1CQUNKLEFBQUM7QUFDQSxBQUFPLEFBQUUsQUFBQyxBQUNYO0FBQUMsQUFDRjtBQUFDLEFBQUMsQUFBQyxBQUNMO0FBQUMsQUFBQyxBQUFDLEFBQ0wsS0FqQlE7QUFpQlAiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tIFwiZnNcIjtcbmltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjtcblxuaW1wb3J0IHsgU3RyaW5nRGVjb2RlciB9IGZyb20gXCJzdHJpbmdfZGVjb2RlclwiO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVhZFRleHRGaWxlKHBhdGg6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPlxue1xuXHRsZXQgc3RhdCA9IGF3YWl0IGZpbGVTdGF0KHBhdGgpO1xuXG5cdGxldCBmZDogbnVtYmVyID0gbnVsbDtcblx0bGV0IHJlc3VsdDogc3RyaW5nO1xuXG5cdHRyeVxuXHR7XG5cdFx0ZmQgPSBhd2FpdCBvcGVuRmlsZShwYXRoLCBcInJcIik7XG5cblx0XHRsZXQgYnVmZmVyID0gbmV3IEJ1ZmZlcihtYXhCb21MZW5ndGgpO1xuXHRcdGxldCByZWFkQm9tUmVzdWx0ID0gYXdhaXQgcmVhZEZpbGUoZmQsIGJ1ZmZlciwgMCwgbWF4Qm9tTGVuZ3RoLCAwKTtcblxuXHRcdGxldCBlbmNvZGluZ0luZm8gPSBnZXRFbmNvZGluZ0luZm8ocmVhZEJvbVJlc3VsdC5idWZmZXIpO1xuXG5cdFx0bGV0IGRlY29kZXIgPSBuZXcgU3RyaW5nRGVjb2RlcihlbmNvZGluZ0luZm8uZW5jb2RpbmcpO1xuXG5cdFx0bGV0IHRleHRPZmZzZXQgPSBlbmNvZGluZ0luZm8uYm9tTGVuZ3RoO1xuXHRcdGxldCB0ZXh0U2l6ZSA9IHN0YXQuc2l6ZSAtIGVuY29kaW5nSW5mby5ib21MZW5ndGg7XG5cblx0XHRidWZmZXIgPSBuZXcgQnVmZmVyKHRleHRTaXplKTtcblx0XHRsZXQgcmVhZEZpbGVSZXN1bHQgPSBhd2FpdCByZWFkRmlsZShmZCwgYnVmZmVyLCAwLCB0ZXh0U2l6ZSwgZW5jb2RpbmdJbmZvLmJvbUxlbmd0aCk7XG5cblx0XHRyZXN1bHQgPSBkZWNvZGVyLndyaXRlKHJlYWRGaWxlUmVzdWx0LmJ1ZmZlcik7XG5cdH1cblx0ZmluYWxseVxuXHR7XG5cdFx0aWYgKChmZCAhPT0gbnVsbCkgJiYgKGZkICE9PSB1bmRlZmluZWQpKVxuXHRcdHtcblx0XHRcdGF3YWl0IGNsb3NlRmlsZShmZCk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlYWRUZXh0RmlsZVN5bmMocGF0aDogc3RyaW5nKTogc3RyaW5nXG57XG5cdGxldCBzdGF0ID0gZnMuc3RhdFN5bmMocGF0aCk7XG5cblx0bGV0IGZkOiBudW1iZXIgPSBudWxsO1xuXHRsZXQgcmVzdWx0OiBzdHJpbmc7XG5cblx0dHJ5XG5cdHtcblx0XHRmZCA9IGZzLm9wZW5TeW5jKHBhdGgsIFwiclwiKTtcblxuXHRcdGxldCBidWZmZXIgPSBuZXcgQnVmZmVyKG1heEJvbUxlbmd0aCk7XG5cdFx0ZnMucmVhZFN5bmMoZmQsIGJ1ZmZlciwgMCwgbWF4Qm9tTGVuZ3RoLCAwKTtcblxuXHRcdGxldCBlbmNvZGluZ0luZm8gPSBnZXRFbmNvZGluZ0luZm8oYnVmZmVyKTtcblxuXHRcdGxldCBkZWNvZGVyID0gbmV3IFN0cmluZ0RlY29kZXIoZW5jb2RpbmdJbmZvLmVuY29kaW5nKTtcblxuXHRcdGxldCB0ZXh0T2Zmc2V0ID0gZW5jb2RpbmdJbmZvLmJvbUxlbmd0aDtcblx0XHRsZXQgdGV4dFNpemUgPSBzdGF0LnNpemUgLSBlbmNvZGluZ0luZm8uYm9tTGVuZ3RoO1xuXG5cdFx0YnVmZmVyID0gbmV3IEJ1ZmZlcih0ZXh0U2l6ZSk7XG5cdFx0ZnMucmVhZFN5bmMoZmQsIGJ1ZmZlciwgMCwgdGV4dFNpemUsIGVuY29kaW5nSW5mby5ib21MZW5ndGgpO1xuXG5cdFx0cmVzdWx0ID0gZGVjb2Rlci53cml0ZShidWZmZXIpO1xuXHR9XG5cdGZpbmFsbHlcblx0e1xuXHRcdGlmICgoZmQgIT09IG51bGwpICYmIChmZCAhPT0gdW5kZWZpbmVkKSlcblx0XHR7XG5cdFx0XHRmcy5jbG9zZVN5bmMoZmQpO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiByZXN1bHQ7XG59XG5cbmludGVyZmFjZSBFbmNvZGluZ0luZm9cbntcblx0ZW5jb2Rpbmc6IHN0cmluZztcblx0Ym9tTGVuZ3RoOiBudW1iZXI7XG59XG5cbmZ1bmN0aW9uIGdldEVuY29kaW5nSW5mbyhidWZmZXI6IEJ1ZmZlcik6IEVuY29kaW5nSW5mb1xue1xuXHRsZXQgZW5jb2RpbmcgPSBkZWZhdWx0VGV4dEZpbGVFbmNvZGluZztcblx0bGV0IGJvbUxlbmd0aCA9IDA7XG5cblx0Zm9yIChsZXQgYm9tTWFwSXRlbU5hbWUgaW4gYm9tTWFwKVxuXHR7XG5cdFx0bGV0IGJvbU1hcEl0ZW0gPSAoYm9tTWFwIGFzIGFueSlbYm9tTWFwSXRlbU5hbWVdIGFzIEJvbU1hcEl0ZW07XG5cblx0XHRpZiAoaXNCb21NYXRjaChib21NYXBJdGVtLCBidWZmZXIpKVxuXHRcdHtcblx0XHRcdGlmICgodHlwZW9mIChib21NYXBJdGVtLmVuY29kaW5nKSAhPT0gXCJzdHJpbmdcIikpXG5cdFx0XHR7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVuc3VwcG9ydGVkIHRleHQgZmlsZSBlbmNvZGluZ1wiKTtcblx0XHRcdH1cblxuXHRcdFx0Ym9tTGVuZ3RoID0gYm9tTWFwSXRlbS5ib20ubGVuZ3RoO1xuXHRcdFx0ZW5jb2RpbmcgPSBib21NYXBJdGVtLmVuY29kaW5nO1xuXG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4geyBlbmNvZGluZzogZW5jb2RpbmcsIGJvbUxlbmd0aDogYm9tTGVuZ3RoIH07XG59XG5cbmludGVyZmFjZSBCb21NYXBJdGVtXG57XG5cdGJvbTogbnVtYmVyW107XG5cdGVuY29kaW5nOiBzdHJpbmc7XG59XG5cbmNvbnN0IHV0ZjhGaWxlVGV4dEVuY29kaW5nID0gXCJ1dGYtOFwiO1xuY29uc3QgZGVmYXVsdFRleHRGaWxlRW5jb2RpbmcgPSB1dGY4RmlsZVRleHRFbmNvZGluZztcblxuLy8gVE9ETzogc3VwcG9ydCBvdGhlcnM/IGF0IGxlYXN0IHV0Zi0xNj8/XG5sZXQgYm9tTWFwID1cblx0e1xuXHRcdGJvbVVURl84OiB7IGJvbTogWzB4RUYsIDB4QkIsIDB4QkZdLCBlbmNvZGluZzogdXRmOEZpbGVUZXh0RW5jb2RpbmcgfSBhcyBCb21NYXBJdGVtLFxuXG5cdFx0Ym9tVVRGXzE2X0JFOiB7IGJvbTogWzB4RkUsIDB4RkZdLCBlbmNvZGluZzogXCJcIiB9IGFzIEJvbU1hcEl0ZW0sXG5cdFx0Ym9tVVRGXzE2X0xFOiB7IGJvbTogWzB4RkYsIDB4RkVdLCBlbmNvZGluZzogXCJcIiB9IGFzIEJvbU1hcEl0ZW0sXG5cblx0XHRib21VVEZfMzJfQkU6IHsgYm9tOiBbMHgwMCwgMHgwMCwgMHhGRSwgMHhGRl0sIGVuY29kaW5nOiBcIlwiIH0gYXMgQm9tTWFwSXRlbSxcblx0XHRib21VVEZfMzJfTEU6IHsgYm9tOiBbMHhGRiwgMHhGRSwgMHgwMCwgMHgwMF0sIGVuY29kaW5nOiBcIlwiIH0gYXMgQm9tTWFwSXRlbSxcblxuXHRcdGJvbVVURl83X2E6IHsgYm9tOiBbMHgyQiwgMHgyRiwgMHg3NiwgMHgzOF0sIGVuY29kaW5nOiBcIlwiIH0gYXMgQm9tTWFwSXRlbSxcblx0XHRib21VVEZfN19iOiB7IGJvbTogWzB4MkIsIDB4MkYsIDB4NzYsIDB4MzldLCBlbmNvZGluZzogXCJcIiB9IGFzIEJvbU1hcEl0ZW0sXG5cdFx0Ym9tVVRGXzdfYzogeyBib206IFsweDJCLCAweDJGLCAweDc2LCAweDJCXSwgZW5jb2Rpbmc6IFwiXCIgfSBhcyBCb21NYXBJdGVtLFxuXHRcdGJvbVVURl83X2Q6IHsgYm9tOiBbMHgyQiwgMHgyRiwgMHg3NiwgMHgyRl0sIGVuY29kaW5nOiBcIlwiIH0gYXMgQm9tTWFwSXRlbSxcblx0XHRib21VVEZfN19lOiB7IGJvbTogWzB4MkIsIDB4MkYsIDB4NzYsIDB4MzgsIDB4MkRdLCBlbmNvZGluZzogXCJcIiB9IGFzIEJvbU1hcEl0ZW0sXG5cblx0XHRib21VVEZfMTogeyBib206IFsweEY3LCAweDY0LCAweDRDXSwgZW5jb2Rpbmc6IFwiXCIgfSBhcyBCb21NYXBJdGVtLFxuXG5cdFx0Ym9tVVRGX0VCQ0RJQzogeyBib206IFsweERELCAweDczLCAweDY2LCAweDczXSwgZW5jb2Rpbmc6IFwiXCIgfSBhcyBCb21NYXBJdGVtLFxuXG5cdFx0Ym9tU0NTVTogeyBib206IFsweDBFLCAweEZFLCAweEZGXSwgZW5jb2Rpbmc6IFwiXCIgfSBhcyBCb21NYXBJdGVtLFxuXG5cdFx0Ym9tQk9DVV8xOiB7IGJvbTogWzB4RkIsIDB4RUUsIDB4MjhdLCBlbmNvZGluZzogXCJcIiB9IGFzIEJvbU1hcEl0ZW0sXG5cblx0XHRib21HQl8xODAzMDogeyBib206IFsweDg0LCAweDMxLCAweDk1LCAweDMzXSwgZW5jb2Rpbmc6IFwiXCIgfSBhcyBCb21NYXBJdGVtLFxuXHR9O1xuXG5sZXQgbWF4Qm9tTGVuZ3RoOiBudW1iZXIgPSAwO1xuZm9yIChsZXQgYm9tTWFwSXRlbU5hbWUgaW4gYm9tTWFwKVxue1xuXHRsZXQgYm9tTWFwSXRlbSA9IChib21NYXAgYXMgYW55KVtib21NYXBJdGVtTmFtZV0gYXMgQm9tTWFwSXRlbTtcblxuXHRtYXhCb21MZW5ndGggPSBNYXRoLm1heChtYXhCb21MZW5ndGgsIGJvbU1hcEl0ZW0uYm9tLmxlbmd0aCk7XG59XG5cbmZ1bmN0aW9uIGlzQm9tTWF0Y2gobWFwSXRlbTogQm9tTWFwSXRlbSwgYm9tOiBCdWZmZXIpXG57XG5cdGlmIChib20ubGVuZ3RoIDwgbWFwSXRlbS5ib20ubGVuZ3RoKVxuXHR7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBtYXBJdGVtLmJvbS5sZW5ndGg7IGkrKylcblx0e1xuXHRcdGlmIChib21baV0gIT0gbWFwSXRlbS5ib21baV0pXG5cdFx0e1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0cnVlO1xufVxuXG4vLyBUT0RPOiBzaGFyZSB0aGVzZSwgb3IgdHJ5IGZzLXByb21pc2UgKG9yIHNpbWlsYXIpXG5mdW5jdGlvbiBmaWxlU3RhdChwYXRoOiBzdHJpbmcgfCBCdWZmZXIpOiBQcm9taXNlPGZzLlN0YXRzPlxue1xuXHRyZXR1cm4gbmV3IFByb21pc2U8ZnMuU3RhdHM+KFxuXHRcdGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpXG5cdFx0e1xuXHRcdFx0ZnMuc3RhdChcblx0XHRcdFx0cGF0aCxcblx0XHRcdFx0ZnVuY3Rpb24gKGVyciwgc3RhdHMpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpZiAoKG51bGwgIT09IGVycikgJiYgKHVuZGVmaW5lZCAhPT0gZXJyKSlcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRyZWplY3QoZXJyKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHJlc29sdmUoc3RhdHMpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0fSk7XG59XG5cbmZ1bmN0aW9uIG9wZW5GaWxlKHBhdGg6IHN0cmluZyB8IEJ1ZmZlciwgZmxhZ3M6IHN0cmluZyB8IG51bWJlcik6IFByb21pc2U8bnVtYmVyPlxue1xuXHRyZXR1cm4gbmV3IFByb21pc2U8bnVtYmVyPihcblx0XHRmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KVxuXHRcdHtcblx0XHRcdGZzLm9wZW4oXG5cdFx0XHRcdHBhdGgsXG5cdFx0XHRcdGZsYWdzLFxuXHRcdFx0XHRmdW5jdGlvbiAoZXJyLCBmZClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGlmICgobnVsbCAhPT0gZXJyKSAmJiAodW5kZWZpbmVkICE9PSBlcnIpKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHJlamVjdChlcnIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0cmVzb2x2ZShmZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHR9KTtcbn1cblxuaW50ZXJmYWNlIFJlYWRGaWxlUmVzdWx0XG57XG5cdGJ5dGVzUmVhZDogbnVtYmVyO1xuXHRidWZmZXI6IEJ1ZmZlcjtcbn1cblxuZnVuY3Rpb24gcmVhZEZpbGUoZmQ6IG51bWJlciwgYnVmZmVyOiBCdWZmZXIsIG9mZnNldDogbnVtYmVyLCBsZW5ndGg6IG51bWJlciwgcG9zaXRpb246IG51bWJlcik6IFByb21pc2U8UmVhZEZpbGVSZXN1bHQ+XG57XG5cdHJldHVybiBuZXcgUHJvbWlzZTxSZWFkRmlsZVJlc3VsdD4oXG5cdFx0ZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdClcblx0XHR7XG5cdFx0XHRmcy5yZWFkKFxuXHRcdFx0XHRmZCxcblx0XHRcdFx0YnVmZmVyLFxuXHRcdFx0XHRvZmZzZXQsXG5cdFx0XHRcdGxlbmd0aCxcblx0XHRcdFx0cG9zaXRpb24sXG5cdFx0XHRcdGZ1bmN0aW9uIChlcnIsIGJ5dGVzUmVhZCwgYnVmZmVyKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0aWYgKChudWxsICE9PSBlcnIpICYmICh1bmRlZmluZWQgIT09IGVycikpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0cmVqZWN0KGVycik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKHsgYnl0ZXNSZWFkOiBieXRlc1JlYWQsIGJ1ZmZlcjogYnVmZmVyIH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0fSk7XG59XG5cbmZ1bmN0aW9uIGNsb3NlRmlsZShmZDogbnVtYmVyKTogUHJvbWlzZTx2b2lkPlxue1xuXHRyZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oXG5cdFx0ZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdClcblx0XHR7XG5cdFx0XHRmcy5jbG9zZShcblx0XHRcdFx0ZmQsXG5cdFx0XHRcdGZ1bmN0aW9uIChlcnIpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpZiAoKG51bGwgIT09IGVycikgJiYgKHVuZGVmaW5lZCAhPT0gZXJyKSlcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRyZWplY3QoZXJyKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHJlc29sdmUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdH0pO1xufSJdfQ==