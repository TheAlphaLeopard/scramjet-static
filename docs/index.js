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
/**
 * @type {HTMLDivElement}
 */
const loading = document.getElementById("sj-loading");
/**
 * @type {HTMLProgressElement}
 */
const progress = document.getElementById("sj-progress");

const config = window.SCRAMJET_CONFIG || {};

function showError(message, err) {
	error.textContent = message;
	errorCode.textContent = err ? err.toString() : "";
	loading.style.display = "none";
}

function showLoading() {
	error.textContent = "";
	errorCode.textContent = "";
	loading.style.display = "block";
	progress.value = 0;
}

function updateProgress(value) {
	progress.value = value;
}

async function checkBackendHealth() {
	if (!config.wispUrl) return false;
	try {
		const ws = new WebSocket(config.wispUrl.replace("wss://", "ws://").replace("ws://", "ws://"));
		return new Promise((resolve) => {
			ws.onopen = () => {
				ws.close();
				resolve(true);
			};
			ws.onerror = () => resolve(false);
			setTimeout(() => {
				ws.close();
				resolve(false);
			}, 5000);
		});
	} catch {
		return false;
	}
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
		new URL("./baremux/worker.js", location.href).href
);

form.addEventListener("submit", async (event) => {
	event.preventDefault();
	showLoading();
	updateProgress(10);

	if (!config.wispUrl) {
		showError(
			"This static page requires a remote Scramjet/WISP backend. Set SCRAMJET_CONFIG.wispUrl in config.js."
		);
		return;
	}

	updateProgress(20);
	const isHealthy = await checkBackendHealth();
	if (!isHealthy) {
		showError("Backend is unreachable. Please check your WISP URL configuration.");
		return;
	}

	updateProgress(30);
	try {
		await registerSW();
		updateProgress(50);
		await scramjet.init();
		updateProgress(70);
	} catch (err) {
		showError("Failed to prepare the proxy engine.", err);
		return;
	}

	const url = search(address.value, searchEngine.value);
	const transportPath =
		config.transports?.libcurl ||
		"https://cdn.jsdelivr.net/npm/@mercuryworkshop/libcurl-transport@1.5.2/dist/index.mjs";

	updateProgress(80);
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

	updateProgress(90);
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
		updateProgress(100);
		setTimeout(() => {
			loading.style.display = "none";
		}, 1000);
	} catch (err) {
		showError("Failed to open the proxy frame.", err);
	}
});
