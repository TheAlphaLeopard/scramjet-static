importScripts("config.js");
importScripts(
	SCRAMJET_CONFIG?.scramjetFiles?.all ||
	"https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@2.0.0-alpha/dist/scramjet.all.js"
);

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

async function handleRequest(event) {
	try {
		await scramjet.loadConfig();
		if (scramjet.route(event)) {
			let retries = 3;
			while (retries > 0) {
				try {
					return await scramjet.fetch(event);
				} catch (err) {
					console.warn(`Proxy fetch failed, retries left: ${retries}`, err);
					retries--;
					if (retries === 0) throw err;
					await new Promise(resolve => setTimeout(resolve, 1000));
				}
			}
		}
		return fetch(event.request);
	} catch (err) {
		console.error("Request handling error:", err);
		return new Response("Proxy error", { status: 500 });
	}
}

self.addEventListener("fetch", (event) => {
	event.respondWith(handleRequest(event));
});
