const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const PreloadWebpackPlugin = require("preload-webpack-plugin");
const HappyPack = require("happypack");
const root = path.resolve(__dirname, "..", "..");
const fills = path.join(root, "packages", "ide", "src", "fill");
const vsFills = path.join(root, "packages", "vscode", "src", "fill");

const merge = require("webpack-merge");

module.exports = merge({
	devtool: "source-map",
	entry: "./packages/web/src/index.ts",
	output: {
		chunkFilename: "[name]-[hash:6].bundle.js",
		path: path.join(root, "dist"),
		filename: "[hash:6].bundle.js",
	},
	module: {
		rules: [{
			loader: "string-replace-loader",
			test: /\.(j|t)s/,
			options: {
				multiple: [{
					search: "require\\.toUrl\\(",
					replace: "requireToUrl(",
					flags: "g",
				}, {
					search: "require\\.__\\$__nodeRequire",
					replace: "require",
					flags: "g",
				}, {
					search: "\\.attributes\\[([^\\]]+)\\] = ([^;]+)",
					replace: ".setAttribute($1, $2)",
					flags: "g",
				}],
			},
		}],
	},
	node: {
		module: "empty",
		crypto: "empty",
		tls: "empty",
	},
	resolve: {
		alias: {
			"gc-signals": path.join(fills, "empty.ts"),
			"selenium-webdriver": path.join(fills, "empty.ts"),
			"vscode": path.join(fills, "empty.ts"),
			"vscode-fsevents": path.join(fills, "empty.ts"),
			"vsda": path.join(fills, "empty.ts"),
			"windows-foreground-love": path.join(fills, "empty.ts"),
			"windows-mutex": path.join(fills, "empty.ts"),
			"windows-process-tree": path.join(fills, "empty.ts"),
			"vscode-sqlite3": path.join(fills, "empty.ts"),
			"tls": path.join(fills, "empty.ts"),
			"native-is-elevated": path.join(fills, "empty.ts"),
			"native-watchdog": path.join(fills, "empty.ts"),
			"dns": path.join(fills, "empty.ts"),
			"console": path.join(fills, "empty.ts"),
			"readline": path.join(fills, "empty.ts"),

			"crypto": "crypto-browserify",
			"http": "http-browserify",

			"child_process": path.join(fills, "child_process.ts"),
			"os": path.join(fills, "os.ts"),
			"fs": path.join(fills, "fs.ts"),
			"net": path.join(fills, "net.ts"),
			"util": path.join(fills, "util.ts"),
			"electron": path.join(fills, "electron.ts"),

			"native-keymap": path.join(vsFills, "native-keymap.ts"),
			"node-pty": path.join(vsFills, "node-pty.ts"),
			"graceful-fs": path.join(vsFills, "graceful-fs.ts"),
			"spdlog": path.join(vsFills, "spdlog.ts"),

			"vs/base/node/paths": path.join(vsFills, "paths.ts"),
			"vs/base/common/amd": path.join(vsFills, "amd.ts"),
			"vs/platform/node/product": path.join(vsFills, "product.ts"),
			"vs/platform/node/package": path.join(vsFills, "package.ts"),
			"vs": path.join(root, "lib", "vscode", "src", "vs"),
		},
	},
	resolveLoader: {
		alias: {
			"vs/css": path.join(vsFills, "css.js"),
		},
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "packages/web/src/index.html",
		}),
		new PreloadWebpackPlugin({
			rel: "preload",
			as: "script",
		}),
		new HappyPack({
			id: "ts",
			threads: 2,
			loaders: [{
				path: "ts-loader",
				query: {
					happyPackMode: true,
					configFile: path.join(__dirname, "tsconfig.json"),
				},
			}],
		}),
	],
	target: "web",
}, require(path.join(root, "scripts", "webpack.general.config.js"))());