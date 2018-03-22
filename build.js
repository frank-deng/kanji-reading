const Sha256 = require('js-sha256');
const fs = require("fs");

const webpack = require('webpack');
function webpackErrorHandler(err, stats){
	if (err) {
		console.error(err.stack || err);
		if (err.details) {
			console.error(err.details);
		}
		process.exit(1);
	}
	const info = stats.toJson();
	if (stats.hasErrors()) {
		console.error(info.errors);
		process.exit(1);
	}
	if (stats.hasWarnings()) {
		console.warn(info.warnings);
	}
}

webpack({
	mode: 'production',
	target: "node",
	entry: {
		index: __dirname + '/data/gendata.js',
	},
	output: {
		path: __dirname,
		filename: 'gendata.temp.js',
	},
	optimization: {
		minimize: false,
	},
}, (err, stats) => {
	webpackErrorHandler(err, stats);
	var gendata = require('./gendata.temp');
	var READINGS_SHA256_SUM = Sha256.sha256(fs.readFileSync('./readings.txt', 'utf-8'));
	webpack({
		mode: 'production',
		entry: {
			index: __dirname + '/app/index.js',
		},
		output: {
			path: __dirname,
			filename: 'index.min.js',
		},
		module: {
			rules: [
				{
					test: /(\.jsx|\.js)$/,
					use: {
						loader: "babel-loader"
					},
					exclude: /node_modules/
				},
			],
		},
		resolveLoader: {
			alias: {
				'css-loader': __dirname + "/app/css-loader.js",
			},
		},
		plugins: [
			new webpack.DefinePlugin({
				'READINGS_SHA256_SUM': `\"${READINGS_SHA256_SUM}\"`,
			}),
		],
	}, webpackErrorHandler);
});
