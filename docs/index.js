"use strict";
/**
 * @type {HTMLFormElement}
 */
const form = document.getElementById("sj-form");
/**
 * @type {HTMLInputElement}
 */
const address = document.getElementById("sj-address");
/**
 * @type {HTMLInputElement}
 */
const searchEngine = document.getElementById("sj-search-engine");
/**
 * @type {HTMLParagraphElement}
 */
const error = document.getElementById("sj-error");
/**
 * @type {HTMLPreElement}
 */
const errorCode = document.getElementById("sj-error-code");

const config = window.SCRAMJET_CONFIG || {};

function showError(message, err) {
	error.textContent = message;
	errorCode.textContent = err ? err.toString() : "";
}

const { ScramjetController } = $scramjetLoadController();

const scramjet = new ScramjetController({
	files: {
		wasm: config.scramjetFiles?.wasm,
		all: config.scramjetFiles?.all,
		sync: config.scramjetFiles?.sync,
	},
});

const connection = new BareMux.BareMuxConnection(
	config.transports?.bareMuxWorker ||
		"https://cdn.jsdelivr.net/npm/@mercuryworkshop/bare-mux@2.1.7/dist/worker.js"
);

form.addEventListener("submit", async (event) => {
	event.preventDefault();
	error.textContent = "";
	errorCode.textContent = "";

	if (!config.wispUrl) {
		showError(
			"This static page requires a remote Scramjet/WISP backend. Set SCRAMJET_CONFIG.wispUrl in config.js."
		);
		return;
	}

	try {
		await registerSW();
		await scramjet.init();
	} catch (err) {
		showError("Failed to prepare the proxy engine.", err);
		return;
	}

	const url = search(address.value, searchEngine.value);
	const transportPath =
		config.transports?.libcurl ||
		"https://cdn.jsdelivr.net/npm/@mercuryworkshop/libcurl-transport@1.5.2/dist/index.mjs";

	try {
		await scramjet.modifyConfig({
			wisp: config.wispUrl,
			files: {
				wasm: config.scramjetFiles?.wasm,
				all: config.scramjetFiles?.all,
				sync: config.scramjetFiles?.sync,
			},
		});
	} catch (err) {
		showError("Failed to configure Scramjet.", err);
		return;
	}

	try {
		if ((await connection.getTransport()) !== transportPath) {
			await connection.setTransport(transportPath, [
				{ websocket: config.wispUrl },
			]);
		}

		const existingFrame = document.getElementById("sj-frame");
		if (existingFrame) {
			existingFrame.remove();
		}

		const frame = scramjet.createFrame();
		frame.frame.id = "sj-frame";
		document.body.appendChild(frame.frame);
		frame.go(url);
	} catch (err) {
		showError("Failed to open the proxy frame.", err);
	}
});
