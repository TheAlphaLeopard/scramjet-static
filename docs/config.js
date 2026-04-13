const basePath = new URL("./baremux/worker.js", self.location.href).href;
self.SCRAMJET_CONFIG = {
	wispUrl: "wss://truffled.lol/wisp/",
	transports: {
		libcurl: "https://cdn.jsdelivr.net/npm/@mercuryworkshop/libcurl-transport@1.5.2/dist/index.mjs",
		bareMuxWorker: basePath,
	},
	scramjetFiles: {
		all: "https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@2.0.0-alpha/dist/scramjet.all.js",
		wasm: "https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@2.0.0-alpha/dist/scramjet.wasm.wasm",
		sync: "https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@2.0.0-alpha/dist/scramjet.sync.js",
	},
};
