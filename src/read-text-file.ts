import * as fs from "fs";
import * as path from "path";
import * as iconv from "iconv-lite";
let jschardet = require("jschardet");

import { StringDecoder } from "string_decoder";

export async function read(path: string): Promise<string>
{
	let stat = await fileStat(path);

	let fd: number = null;
	let result: string;

	try
	{
		fd = await openFile(path, "r");

		let buffer = new Buffer(stat.size);
		let readBomResult = await readFile(fd, buffer, 0, stat.size, 0);

		result = decode(buffer);
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

export function readSync(path: string): string
{
	let stat = fs.statSync(path);

	let fd: number = null;
	let result: string;

	try
	{
		fd = fs.openSync(path, "r");

		let buffer = new Buffer(stat.size);
		fs.readSync(fd, buffer, 0, stat.size, 0);

		result = decode(buffer);
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

function decode(buffer: Buffer) : string
{
	// TODO: fallback for when confidence is too low? (pass it as "defaultEncoding" below)
	let encodingName = getEncodingName(buffer);
	return iconv.decode(buffer, encodingName, {stripBOM: true, addBOM: false, defaultEncoding: "utf-8"});
}

function getEncodingName(buffer: Buffer) : string
{
	// TODO: set min confidence?
	let result = jschardet.detect(buffer);
	return result.encoding;
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