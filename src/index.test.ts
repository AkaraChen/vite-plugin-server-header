import { createServer } from "vite";
import { expect, test } from "vitest";
import { ViteSeverHeaderPlugin } from ".";

const port = 3000;

test("ViteSeverHeaderPlugin start server", async () => {
	const plugin = ViteSeverHeaderPlugin({
		headers: {
			"X-Frame-Options": "DENY",
		},
	});

	const server = await createServer({
		plugins: [plugin],
		server: {
			port,
		},
	});

	await server.listen();

	const res = await fetch(`http://localhost:${port}/`);
	const headers = res.headers.get("X-Frame-Options");
	expect(headers).toBe("DENY");

	await server.close();
});

test("ViteSeverHeaderPlugin start server with multiple headers", async () => {
	const plugin = ViteSeverHeaderPlugin({
		headers: [
			{
				test: /a/,
				headers: {
					"X-Frame-Options": "DENY",
				},
			},
			{
				test: /b/,
				headers: {
					"X-Content-Type-Options": "nosniff",
				},
			},
		],
	});

	const server = await createServer({
		plugins: [plugin],
		server: {
			port,
		},
	});

	await server.listen();

	const resA = await fetch(`http://localhost:${port}/a`);
	const headersA = resA.headers.get("X-Frame-Options");
	expect(headersA).toBe("DENY");

	const resB = await fetch(`http://localhost:${port}/b`);
	const headersB = resB.headers.get("X-Content-Type-Options");
	expect(headersB).toBe("nosniff");

	await server.close();
});
