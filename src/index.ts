import type { Plugin } from "vite";

export interface ViteSeverHeaderPluginOptions {
	headers:
		| Record<string, string>
		| Array<{
				test: string | RegExp;
				headers: Record<string, string>;
		  }>;
}

export const ViteSeverHeaderPlugin = (
	opts: ViteSeverHeaderPluginOptions,
): Plugin => {
	const headers = Array.isArray(opts.headers)
		? opts.headers
		: [
				{
					test: /.*/,
					headers: opts.headers,
				},
			];

	return {
		name: "vite-sever-header-plugin",
		apply: "serve",
		configureServer(server) {
			server.middlewares.use((req, res, next) => {
				for (const header of headers) {
					const test =
						header.test instanceof RegExp
							? header.test
							: new RegExp(header.test);
					if (req.url && test.test(req.url)) {
						for (const [key, value] of Object.entries(header.headers)) {
							res.setHeader(key, value);
						}
					}
				}
				next();
			});
		},
	};
};
