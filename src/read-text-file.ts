declare let require: any;
require("babel-polyfill");

import * as fs from "fs";
import * as path from "path";

import { StringDecoder } from "string_decoder";

export async function readTextFile(path: string): Promise<string>
{
	let stat = await fileStat(path);

	let fd: number = null;
	let result: string;

	try
	{
		fd = await openFile(path, "r");

		let buffer = new Buffer(maxBomLength);
		let readBomResult = await readFile(fd, buffer, 0, maxBomLength, 0);

		let encodingInfo = getEncodingInfo(readBomResult.buffer);

		let decoder = new StringDecoder(encodingInfo.encoding);

		let textOffset = encodingInfo.bomLength;
		let textSize = stat.size - encodingInfo.bomLength;

		buffer = new Buffer(textSize);
		let readFileResult = await readFile(fd, buffer, 0, textSize, encodingInfo.bomLength);

		result = decoder.write(readFileResult.buffer);
	}
	finally
	{
		if ((fd !== null) && (fd !== undefined))
		{
			await closeFile(fd);
		}
	}

	return result;
}

export function readTextFileSync(path: string): string
{
	let stat = fs.statSync(path);

	let fd: number = null;
	let result: string;

	try
	{
		fd = fs.openSync(path, "r");

		let buffer = new Buffer(maxBomLength);
		fs.readSync(fd, buffer, 0, maxBomLength, 0);

		let encodingInfo = getEncodingInfo(buffer);

		let decoder = new StringDecoder(encodingInfo.encoding);

		let textOffset = encodingInfo.bomLength;
		let textSize = stat.size - encodingInfo.bomLength;

		buffer = new Buffer(textSize);
		fs.readSync(fd, buffer, 0, textSize, encodingInfo.bomLength);

		result = decoder.write(buffer);
	}
	finally
	{
		if ((fd !== null) && (fd !== undefined))
		{
			fs.closeSync(fd);
		}
	}

	return result;
}

interface EncodingInfo
{
	encoding: string;
	bomLength: number;
}

function getEncodingInfo(buffer: Buffer): EncodingInfo
{
	let encoding = defaultTextFileEncoding;
	let bomLength = 0;

	for (let bomMapItemName in bomMap)
	{
		let bomMapItem = (bomMap as any)[bomMapItemName] as BomMapItem;

		if (isBomMatch(bomMapItem, buffer))
		{
			if ((typeof (bomMapItem.encoding) !== "string"))
			{
				throw new Error("Unsupported text file encoding");
			}

			bomLength = bomMapItem.bom.length;
			encoding = bomMapItem.encoding;

			break;
		}
	}

	return { encoding: encoding, bomLength: bomLength };
}

interface BomMapItem
{
	bom: number[];
	encoding: string;
}

const utf8FileTextEncoding = "utf-8";
const defaultTextFileEncoding = utf8FileTextEncoding;

// TODO: support others? at least utf-16??
let bomMap =
	{
		bomUTF_8: { bom: [0xEF, 0xBB, 0xBF], encoding: utf8FileTextEncoding } as BomMapItem,

		bomUTF_16_BE: { bom: [0xFE, 0xFF], encoding: "" } as BomMapItem,
		bomUTF_16_LE: { bom: [0xFF, 0xFE], encoding: "" } as BomMapItem,

		bomUTF_32_BE: { bom: [0x00, 0x00, 0xFE, 0xFF], encoding: "" } as BomMapItem,
		bomUTF_32_LE: { bom: [0xFF, 0xFE, 0x00, 0x00], encoding: "" } as BomMapItem,

		bomUTF_7_a: { bom: [0x2B, 0x2F, 0x76, 0x38], encoding: "" } as BomMapItem,
		bomUTF_7_b: { bom: [0x2B, 0x2F, 0x76, 0x39], encoding: "" } as BomMapItem,
		bomUTF_7_c: { bom: [0x2B, 0x2F, 0x76, 0x2B], encoding: "" } as BomMapItem,
		bomUTF_7_d: { bom: [0x2B, 0x2F, 0x76, 0x2F], encoding: "" } as BomMapItem,
		bomUTF_7_e: { bom: [0x2B, 0x2F, 0x76, 0x38, 0x2D], encoding: "" } as BomMapItem,

		bomUTF_1: { bom: [0xF7, 0x64, 0x4C], encoding: "" } as BomMapItem,

		bomUTF_EBCDIC: { bom: [0xDD, 0x73, 0x66, 0x73], encoding: "" } as BomMapItem,

		bomSCSU: { bom: [0x0E, 0xFE, 0xFF], encoding: "" } as BomMapItem,

		bomBOCU_1: { bom: [0xFB, 0xEE, 0x28], encoding: "" } as BomMapItem,

		bomGB_18030: { bom: [0x84, 0x31, 0x95, 0x33], encoding: "" } as BomMapItem,
	};

let maxBomLength: number = 0;
for (let bomMapItemName in bomMap)
{
	let bomMapItem = (bomMap as any)[bomMapItemName] as BomMapItem;

	maxBomLength = Math.max(maxBomLength, bomMapItem.bom.length);
}

function isBomMatch(mapItem: BomMapItem, bom: Buffer)
{
	if (bom.length < mapItem.bom.length)
	{
		return false;
	}

	for (let i = 0; i < mapItem.bom.length; i++)
	{
		if (bom[i] != mapItem.bom[i])
		{
			return false;
		}
	}

	return true;
}

// TODO: share these, or try fs-promise (or similar)
function fileStat(path: string | Buffer): Promise<fs.Stats>
{
	return new Promise<fs.Stats>(
		function (resolve, reject)
		{
			fs.stat(
				path,
				function (err, stats)
				{
					if ((null !== err) && (undefined !== err))
					{
						reject(err);
					}
					else
					{
						resolve(stats);
					}
				});
		});
}

function openFile(path: string | Buffer, flags: string | number): Promise<number>
{
	return new Promise<number>(
		function (resolve, reject)
		{
			fs.open(
				path,
				flags,
				function (err, fd)
				{
					if ((null !== err) && (undefined !== err))
					{
						reject(err);
					}
					else
					{
						resolve(fd);
					}
				});
		});
}

interface ReadFileResult
{
	bytesRead: number;
	buffer: Buffer;
}

function readFile(fd: number, buffer: Buffer, offset: number, length: number, position: number): Promise<ReadFileResult>
{
	return new Promise<ReadFileResult>(
		function (resolve, reject)
		{
			fs.read(
				fd,
				buffer,
				offset,
				length,
				position,
				function (err, bytesRead, buffer)
				{
					if ((null !== err) && (undefined !== err))
					{
						reject(err);
					}
					else
					{
						resolve({ bytesRead: bytesRead, buffer: buffer });
					}
				});
		});
}

function closeFile(fd: number): Promise<void>
{
	return new Promise<void>(
		function (resolve, reject)
		{
			fs.close(
				fd,
				function (err)
				{
					if ((null !== err) && (undefined !== err))
					{
						reject(err);
					}
					else
					{
						resolve();
					}
				});
		});
}