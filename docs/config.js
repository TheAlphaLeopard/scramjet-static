self.SCRAMJET_CONFIG = {
	wispUrl: null,
	transports: {
		libcurl: "https://cdn.jsdelivr.net/npm/@mercuryworkshop/libcurl-transport@1.5.2/dist/index.mjs",
		bareMuxWorker: "https://cdn.jsdelivr.net/npm/@mercuryworkshop/bare-mux@2.1.7/dist/worker.js",
	},
	scramjetFiles: {
		all: "https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@2.0.0-alpha/dist/scramjet.all.js",
		wasm: "https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@2.0.0-alpha/dist/scramjet.wasm.wasm",
		sync: "https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@2.0.0-alpha/dist/scramjet.sync.js",
	},
};
