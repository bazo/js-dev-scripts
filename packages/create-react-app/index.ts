#!/usr/bin/env node

import Zip from "adm-zip";
import { exec } from "child_process";
import cpy from "cpy";
import * as fs from "fs";
import * as https from "https";
import ora from "ora";

const appName = process.argv[2] as string;

const downloadURL = "https://codeload.github.com/bazo/ts-app-template/zip/main";

const cwd = process.cwd();
const destination = `${cwd}/${appName}`;

async function download(url: string): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		https
			.get(
				url,
				{
					headers: {
						accept: "application/zip",
						"accept-encoding": "gzip,deflate",
					},
				},
				(response) => {
					const data: Buffer[] = [];

					response.on("data", function (chunk: Buffer) {
						data.push(chunk);
					});

					response.on("end", function () {
						const buffer = Buffer.concat(data);

						resolve(buffer);
					});
				}
			)
			.on("error", reject);
	});
}

function unzip(source: string | Buffer, destination: string): void {
	const zip = new Zip(source);
	return zip.extractAllTo(destination);
}

async function install(): Promise<string> {
	return new Promise((resolve, reject) => {
		exec("yarn", (error, stdout, stderr) => {
			if (error) {
				reject(error);
				return;
			}

			resolve(stdout);
		}).stdout?.pipe(process.stdout);
	});
}

async function gitInit(): Promise<string> {
	return new Promise((resolve, reject) => {
		exec("git init", (error, stdout, stderr) => {
			if (error) {
				reject(error);
				return;
			}

			resolve(stdout);
		}).stdout?.pipe(process.stdout);
	});
}

async function createApp(): Promise<void> {
	const spinner = ora({});
	try {
		//const spinner = ora(`Downloading`).start();
		spinner.text = "Downloading";
		spinner.start();
		const zipBuffer = await download(downloadURL);
		spinner.text = "Unzipping";
		unzip(zipBuffer, destination);
		const tempDir = `${destination}/ts-app-template-main`;
		spinner.text = "Copying files";
		process.chdir(tempDir);
		await cpy([`**/*`], destination, {
			parents: true,
			cwd: tempDir,
			dot: true,
		});

		fs.rmSync(tempDir, {
			recursive: true,
			force: true,
		});

		process.chdir(destination);

		const packageJSONPath = `${destination}/package.json`;
		const packageJSON = require(packageJSONPath);

		packageJSON.name = appName;

		fs.writeFileSync(packageJSONPath, JSON.stringify(packageJSON, null, 4));

		spinner.stopAndPersist();
		await gitInit();

		spinner.start();
		spinner.text = "Installing packages";
		spinner.stopAndPersist();

		await install();

		spinner.succeed("Project ready");
	} catch (error) {
		spinner.fail(error.message);
	}
}

createApp();
